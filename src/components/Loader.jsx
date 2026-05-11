import { useState, useEffect } from 'react';

export default function Loader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // ⏱️ Simule un chargement (remplace par ton vrai état de chargement plus tard)
    const timer = setTimeout(() => setVisible(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="loader-overlay">
      <div className="loader-container">
        <div className="loader-rings">
          <div className="ring ring-outer"></div>
          <div className="ring ring-inner"></div>
          <div className="loader-core"></div>
        </div>
        <h1 className="loader-title">Gestion de tâches</h1>
        <p className="loader-subtitle">Préparation de votre espace...</p>
        <div className="loader-dots">
          <span></span><span></span><span></span>
        </div>
      </div>
      
      {/* Particules flottantes en arrière-plan */}
      <div className="particles">
        {[...Array(6)].map((_, i) => (
          <div key={i} className={`particle p${i + 1}`}></div>
        ))}
      </div>
    </div>
  );
}