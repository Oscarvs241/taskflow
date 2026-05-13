// src/utils/sendEmail.js
// ⚠️ Ce fichier ne contient QUE des fonctions, PAS de JSX !

const API_URL = 'http://localhost:3001/api';

export const sendEmail = async (to, subject, text, html = null) => {
  try {
    const response = await fetch(`${API_URL}/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        to,
        subject,
        text,
        html
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Erreur d\'envoi');
    }

    return { success: true, data };
  } catch (error) {
    console.error('Erreur sendEmail:', error);
    return { success: false, error: error.message };
  }
};

export const sendTaskNotification = async (task, recipientEmail) => {
  const subject = `Nouvelle tâche créée : ${task.title}`;
  const text = `
    Une nouvelle tâche a été créée dans TaskFlow
    
    Titre: ${task.title}
    Catégorie: ${task.category}
    Priorité: ${task.priority === 'high' ? 'Urgente' : task.priority === 'medium' ? 'Importante' : 'Normale'}
    Date: ${new Date().toLocaleDateString('fr-FR')}
  `;
  
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2 style="color: #6366f1;">📋 Nouvelle tâche TaskFlow</h2>
      <p><strong>${task.title}</strong></p>
      <p>Catégorie: ${task.category}</p>
      <p>Priorité: ${task.priority}</p>
    </div>
  `;

  return sendEmail(recipientEmail, subject, text, html);
};

export const sendContactMessage = async (formData) => {
  const subject = `Contact TaskFlow: ${formData.subject}`;
  const text = `
    Nom: ${formData.name}
    Email: ${formData.email}
    Sujet: ${formData.subject}
    Message: ${formData.message}
  `;

  return sendEmail(formData.email, subject, text);
};