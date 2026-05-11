export default function About() {
  return (
    <div className="about-page">
      <h1>À propos de Gestion de tâches</h1>
      
      <div className="about-content">
        <section>
          <h2>🎯 Notre mission</h2>
          <p>
            Gestion de tâche est une application de gestion de tâches simple et efficace 
            conçue pour vous aider à organiser votre quotidien et à augmenter 
            votre productivité.
          </p>
        </section>

        <section>
          <h2>✨ Fonctionnalités</h2>
          <ul>
            <li>✅ Créer et gérer vos tâches</li>
            <li>📂 Organiser par catégories</li>
            <li>✔️ Marquer les tâches comme terminées</li>
            <li>📊 Suivre vos statistiques</li>
            <li>💾 Sauvegarde automatique</li>
          </ul>
        </section>

        <section>
          <h2>🛠️ Technologies utilisées</h2>
          <p>
            Cette application est construite avec React, React Router pour la 
            navigation, et utilise le localStorage pour persister vos données.
          </p>
        </section>
      </div>
    </div>
  );
}