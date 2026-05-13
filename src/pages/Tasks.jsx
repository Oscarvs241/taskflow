import { useState, useMemo } from 'react';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import { sendTaskNotification } from '../utils/sendEmail';

export default function Tasks({ tasks, onToggle, onDelete, onAdd }) {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // États pour la notification email
  const [showNotify, setShowNotify] = useState(false);
  const [lastTask, setLastTask] = useState(null);
  const [notifyEmail, setNotifyEmail] = useState('');
  const [notifyStatus, setNotifyStatus] = useState({ loading: false, success: false, error: '' });

  // 🎯 STATS OPTIMISÉES AVEC USEMEMO (mise à jour automatique)
  const stats = useMemo(() => ({
    total: tasks.length,
    pending: tasks.filter(t => !t.completed).length,
    completed: tasks.filter(t => t.completed).length
  }), [tasks]); // Se recalcule UNIQUEMENT quand `tasks` change

  // 🎯 FILTRES + TRI OPTIMISÉS AVEC USEMEMO
  const filteredTasks = useMemo(() => {
    let result = [...tasks];
    
    // Filtre par statut
    if (filter === 'pending') {
      result = result.filter(t => !t.completed);
    } else if (filter === 'completed') {
      result = result.filter(t => t.completed);
    }
    
    // Filtre par recherche
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(t => t.title.toLowerCase().includes(term));
    }
    
    // Tri par priorité + date
    const priorityOrder = { high: 0, medium: 1, normal: 2, low: 3 };
    result.sort((a, b) => {
      const prioDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (prioDiff !== 0) return prioDiff;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    
    return result;
  }, [tasks, filter, searchTerm]); // Se recalcule seulement si ces valeurs changent

  // ✅ Gestion de l'ajout de tâche + notification email
  const handleAddTask = async (newTask) => {
    // 1. Ajouter la tâche via la fonction reçue d'App.jsx
    await onAdd(newTask);
    
    // 2. Préparer la notification email
    setLastTask(newTask);
    setShowNotify(true);
    setNotifyStatus({ loading: false, success: false, error: '' });
  };

  // ✅ Gestion de l'envoi de la notification
  const handleSendNotify = async (e) => {
    e.preventDefault();
    if (!notifyEmail.trim() || !lastTask) return;
    
    setNotifyStatus({ loading: true, success: false, error: '' });
    
    try {
      await sendTaskNotification(lastTask, notifyEmail.trim());
      setNotifyStatus({ loading: false, success: true, error: '' });
      setTimeout(() => setShowNotify(false), 2500);
    } catch (err) {
      console.error('Erreur envoi email:', err);
      setNotifyStatus({ loading: false, success: false, error: 'Échec de l\'envoi.' });
    }
  };

  return (
    <div className="tasks-page animate-fadeIn">
      <h1>📋 Mes Tâches</h1>
      
      {/* Barre de recherche */}
      <div className="search-bar">
        <input 
          type="text" 
          value={searchTerm} 
          onChange={e => setSearchTerm(e.target.value)} 
          placeholder="🔍 Rechercher une tâche..." 
          className="search-input"
        />
      </div>

      {/* Formulaire d'ajout */}
      <TaskForm onAdd={handleAddTask} />

      {/* Panneau de notification email */}
      {showNotify && (
        <div className="notify-panel animate-scaleIn">
          <h3>📧 Notifier par email ?</h3>
          <p>Envoie un récapitulatif de : <strong>"{lastTask?.title}"</strong></p>
          <form onSubmit={handleSendNotify} className="notify-form">
            <input 
              type="email" 
              value={notifyEmail} 
              onChange={e => setNotifyEmail(e.target.value)} 
              placeholder="email@exemple.com" 
              required 
            />
            <button type="submit" disabled={notifyStatus.loading}>
              {notifyStatus.loading ? '⏳...' : 'Envoyer'}
            </button>
          </form>
          {notifyStatus.success && <p className="success-msg">✅ Email envoyé !</p>}
          {notifyStatus.error && <p className="error-msg">{notifyStatus.error}</p>}
          <button className="close-notify" onClick={() => setShowNotify(false)}>✕</button>
        </div>
      )}

      {/* 🎯 FILTRES AVEC COMPTEURS EN TEMPS RÉEL */}
      <div className="filters">
        <button 
          className={filter === 'all' ? 'active' : ''} 
          onClick={() => setFilter('all')}
        >
          📊 Toutes ({stats.total})
        </button>
        
        <button 
          className={filter === 'pending' ? 'active' : ''} 
          onClick={() => setFilter('pending')}
        >
          ⏳ À faire ({stats.pending})
        </button>
        
        <button 
          className={filter === 'completed' ? 'active' : ''} 
          onClick={() => setFilter('completed')}
        >
          ✅ Terminées ({stats.completed})
        </button>
      </div>

      {/* Liste des tâches */}
      <TaskList 
        tasks={filteredTasks} 
        onToggle={onToggle} 
        onDelete={onDelete} 
      />
      
      {/* Message si aucune tâche */}
      {filteredTasks.length === 0 && (
        <div className="empty-state">
          {tasks.length === 0 
            ? '📭 Aucune tâche pour le moment. Ajoutes-en une !' 
            : '🔍 Aucune tâche ne correspond à ta recherche.'}
        </div>
      )}
    </div>
  );
}