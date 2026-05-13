import { useState } from 'react';
// Import de la fonction d'envoi (simulation ou réel selon ta config)
import { sendTaskNotification } from '../utils/sendEmail';

export default function TaskForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Personnel');
  const [priority, setPriority] = useState('normal');
  const [dueDate, setDueDate] = useState('');
  const [notifyEmail, setNotifyEmail] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 1. Validation
    if (!title.trim()) {
      setError('⚠️ Le titre de la tâche est obligatoire');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      // 2. Création de l'objet tâche
      const newTask = {
        id: Date.now(),
        title: title.trim(),
        category,
        priority,
        dueDate: dueDate || null,
        completed: false,
        createdAt: new Date().toISOString()
      };

      // 3. Ajout de la tâche via la props onAdd (mise à jour du state global)
      onAdd(newTask);

      // 4. Envoi de la notification email (si adresse fournie)
      if (notifyEmail.trim()) {
        await sendTaskNotification(newTask, notifyEmail.trim());
        setSuccessMsg('✅ Tâche ajoutée et notification envoyée !');
      } else {
        setSuccessMsg('✅ Tâche ajoutée avec succès !');
      }

      // 5. Reset du formulaire
      setTitle('');
      setCategory('Personnel');
      setPriority('normal');
      setDueDate('');
      setNotifyEmail('');
      
    } catch (err) {
      setError('❌ Une erreur est survenue: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
      // Effacer le message de succès après 3 secondes
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="task-form animate-fadeIn">
      
      {/* Ligne 1 : Titre + Catégorie */}
      <div className="form-row">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="📝 Titre de la tâche..."
          className="input-primary"
          disabled={loading}
        />
        <select 
          value={category} 
          onChange={(e) => setCategory(e.target.value)}
          className="input-select"
          disabled={loading}
        >
          <option value="Personnel">👤 Personnel</option>
          <option value="Travail">💼 Travail</option>
          <option value="Études">📚 Études</option>
          <option value="Courses">🛒 Courses</option>
          <option value="Santé">❤️ Santé</option>
        </select>
      </div>

      {/* Ligne 2 : Priorité + Date + Email */}
      <div className="form-row">
        <select 
          value={priority} 
          onChange={(e) => setPriority(e.target.value)}
          className="input-select"
          disabled={loading}
        >
          <option value="low">🟢 Basse</option>
          <option value="normal">🔵 Normale</option>
          <option value="medium">🟡 Importante</option>
          <option value="high">🔴 Urgente</option>
        </select>
        
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="input-date"
          disabled={loading}
        />
        
        <input
          type="email"
          value={notifyEmail}
          onChange={(e) => setNotifyEmail(e.target.value)}
          placeholder="📧 Email (optionnel)"
          className="input-email"
          disabled={loading}
        />
      </div>

      {/* Bouton d'action */}
      <button type="submit" className="btn-submit" disabled={loading}>
        {loading ? (
          <span className="loading-spinner">⏳ Traitement...</span>
        ) : (
          <span>➕ Ajouter la tâche</span>
        )}
      </button>

      {/* Messages d'état */}
      {error && <p className="error-message animate-slideIn">{error}</p>}
      {successMsg && <p className="success-message animate-slideIn">{successMsg}</p>}
    </form>
  );
}