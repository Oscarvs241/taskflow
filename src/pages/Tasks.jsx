import { useState, useMemo } from 'react';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';

export default function Tasks({ tasks, onToggle, onDelete, onAdd }) {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTasks = useMemo(() => {
    let result = tasks;

    // Filtre par statut
    if (filter === 'completed') result = result.filter(t => t.completed);
    if (filter === 'pending') result = result.filter(t => !t.completed);

    // Recherche
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(t => 
        t.title.toLowerCase().includes(term) ||
        t.category.toLowerCase().includes(term)
      );
    }

    return result.sort((a, b) => {
      // Trier par priorité puis par date
      const priorityOrder = { high: 0, medium: 1, normal: 2, low: 3 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [tasks, filter, searchTerm]);

  return (
    <div className="tasks-page">
      <h1 className="animate-fadeIn">📋 Mes Tâches</h1>
      
      <div className="search-bar">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="🔍 Rechercher une tâche..."
        />
      </div>

      <TaskForm onAdd={onAdd} />

      <div className="filters">
        <button 
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          📊 Toutes ({tasks.length})
        </button>
        <button 
          className={filter === 'pending' ? 'active' : ''}
          onClick={() => setFilter('pending')}
        >
          ⏳ À faire ({tasks.filter(t => !t.completed).length})
        </button>
        <button 
          className={filter === 'completed' ? 'active' : ''}
          onClick={() => setFilter('completed')}
        >
          ✅ Terminées ({tasks.filter(t => t.completed).length})
        </button>
      </div>

      <TaskList 
        tasks={filteredTasks} 
        onToggle={onToggle}
        onDelete={onDelete}
      />
    </div>
  );
}