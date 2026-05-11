import { memo } from 'react';

const TaskItem = memo(function TaskItem({ task, onToggle, onDelete }) {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
  };

  const getPriorityLabel = (priority) => {
    const labels = {
      high: { text: 'Urgent', class: 'badge-high' },
      medium: { text: 'Important', class: 'badge-medium' },
      low: { text: 'Basse', class: 'badge-low' },
      normal: { text: 'Normal', class: '' }
    };
    return labels[priority] || labels.normal;
  };

  const priorityInfo = getPriorityLabel(task.priority);

  return (
    <li className={`task-item priority-${task.priority} ${task.completed ? 'completed' : ''}`}>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
        aria-label={`Marquer "${task.title}" comme ${task.completed ? 'à faire' : 'terminée'}`}
      />
      <div className="task-content">
        <span className="task-title">{task.title}</span>
        <div className="task-meta">
          <span className="task-date">📅 {formatDate(task.dueDate) || 'Pas de date'}</span>
          {priorityInfo.class && (
            <span className={`badge ${priorityInfo.class}`}>
              {priorityInfo.text}
            </span>
          )}
          <span>📁 {task.category}</span>
        </div>
      </div>
      <button 
        onClick={() => onDelete(task.id)}
        className="delete-btn"
        aria-label="Supprimer la tâche"
      >
        🗑️
      </button>
    </li>
  );
});

export default TaskItem;