import { Link } from 'react-router-dom';

export default function Home({ tasks }) {
  const completedTasks = tasks.filter(t => t.completed).length;
  const pendingTasks = tasks.filter(t => !t.completed).length;
  const urgentTasks = tasks.filter(t => t.priority === 'high' && !t.completed).length;
  
  const completionRate = tasks.length > 0 
    ? Math.round((completedTasks / tasks.length) * 100) 
    : 0;

  return (
    <div className="home">
      <h1 className="animate-fadeIn">✨ Bienvenue sur le Gestionnaire de tâches</h1>
      <p className="subtitle animate-fadeIn">
        Organisez votre vie, une tâche à la fois
      </p>
      
      <div className="stats-container">
        <div className="stat-card" style={{ animationDelay: '0.1s' }}>
          <h3>📊 Total des tâches</h3>
          <p className="stat-number">{tasks.length}</p>
        </div>
        <div className="stat-card" style={{ animationDelay: '0.2s' }}>
          <h3>⏳ En attente</h3>
          <p className="stat-number pending">{pendingTasks}</p>
        </div>
        <div className="stat-card" style={{ animationDelay: '0.3s' }}>
          <h3>✅ Terminées</h3>
          <p className="stat-number completed">{completedTasks}</p>
        </div>
        {urgentTasks > 0 && (
          <div className="stat-card" style={{ animationDelay: '0.4s' }}>
            <h3>🔴 Urgentes</h3>
            <p className="stat-number" style={{ background: 'var(--gradient-2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {urgentTasks}
            </p>
          </div>
        )}
        <div className="stat-card" style={{ animationDelay: '0.5s' }}>
          <h3>📈 Taux de complétion</h3>
          <p className="stat-number" style={{ background: 'var(--gradient-4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {completionRate}%
          </p>
        </div>
      </div>

      <Link to="/tasks" className="btn-primary animate-float">
        Voir mes tâches →
      </Link>
    </div>
  );
}