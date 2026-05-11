import { useState } from 'react';

export default function TaskForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Personnel');
  const [priority, setPriority] = useState('normal');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Le titre est obligatoire');
      return;
    }

    onAdd(title.trim(), category, priority, dueDate);
    setTitle('');
    setPriority('normal');
    setDueDate('');
    setError('');
  };

  return (
    <form onSubmit={handleSubmit} className="task-form animate-fadeIn">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="📝 Nouvelle tâche..."
        aria-label="Titre de la tâche"
      />
      <select 
        value={category} 
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="Personnel">👤 Personnel</option>
        <option value="Travail">💼 Travail</option>
        <option value="Études">📚 Études</option>
        <option value="Courses">🛒 Courses</option>
        <option value="Santé">❤️ Santé</option>
      </select>
      <select 
        value={priority} 
        onChange={(e) => setPriority(e.target.value)}
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
        aria-label="Date d'échéance"
      />
      <button type="submit">
        ➕ Ajouter
      </button>
      {error && <p className="error">{error}</p>}
    </form>
  );
}