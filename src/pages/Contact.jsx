import { useState } from 'react';
import { sendContactMessage } from '../utils/sendEmail';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState({ loading: false, success: false, error: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: '' });

    try {
      await sendContactMessage(form);
      setStatus({ loading: false, success: true, error: '' });
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setStatus({ loading: false, success: false, error: 'Échec de l\'envoi. Réessaie plus tard.' });
      console.error(err);
    }
  };

  return (
    <div className="contact-page animate-fadeIn">
      <h1>📬 Contact</h1>
      <p className="subtitle">Une question ? Une suggestion ? Écris-nous directement.</p>

      <div className="contact-grid">
        {/* Coordonnées */}
        <div className="contact-info animate-slideIn">
          <div className="info-card">
            <span className="icon">📍</span>
            <div>
              <h3>Adresse</h3>
              <p>123 Rue de l'Innovation, 75001 Paris</p>
            </div>
          </div>
          <div className="info-card">
            <span className="icon"></span>
            <div>
              <h3>Téléphone</h3>
              <p>+33 1 23 45 67 89</p>
            </div>
          </div>
          <div className="info-card">
            <span className="icon">✉️</span>
            <div>
              <h3>Email</h3>
              <p>contact@taskflow.app</p>
            </div>
          </div>
          <div className="info-card">
            <span className="icon"></span>
            <div>
              <h3>Réseaux</h3>
              <div className="socials">
                <a href="#" aria-label="LinkedIn">in</a>
                <a href="#" aria-label="Twitter">𝕏</a>
                <a href="#" aria-label="GitHub">️</a>
              </div>
            </div>
          </div>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="contact-form animate-scaleIn">
          <input name="name" value={form.name} onChange={handleChange} placeholder="Ton nom" required />
          <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Ton email" required />
          <input name="subject" value={form.subject} onChange={handleChange} placeholder="Sujet" required />
          <textarea name="message" value={form.message} onChange={handleChange} placeholder="Ton message..." rows="5" required />
          
          <button type="submit" disabled={status.loading} className="btn-submit">
            {status.loading ? '⏳ Envoi en cours...' : '📤 Envoyer le message'}
          </button>

          {status.success && <p className="success-msg">✅ Message envoyé avec succès !</p>}
          {status.error && <p className="error-msg">{status.error}</p>}
        </form>
      </div>
    </div>
  );
}