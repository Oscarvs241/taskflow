import { Link, useLocation } from 'react-router-dom';

export default function Navbar({ theme, onToggleTheme }) {
  const { pathname } = useLocation();

  const links = [
    { to: '/', label: '🏠 Accueil' },
    { to: '/tasks', label: '📋 Tâches' },
    { to: '/about', label: 'ℹ️ À propos' }
  ];

  return (
    <nav className="navbar">
      <div className="logo animate-float">✨ Gestion de tâches</div>
      <ul>
        {links.map(link => (
          <li key={link.to}>
            <Link 
              to={link.to} 
              className={pathname === link.to ? 'active' : ''}
            >
              {link.label}
            </Link>
          </li>
        ))}
        <li>
          <button 
            onClick={onToggleTheme}
            className="theme-toggle"
            title={theme === 'light' ? 'Mode sombre' : 'Mode clair'}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </li>
      </ul>
    </nav>
  );
}