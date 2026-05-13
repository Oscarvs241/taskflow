require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Configuration SMTP avec TES identifiants
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Tester la connexion
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Erreur SMTP:', error);
  } else {
    console.log('✅ Serveur SMTP prêt à envoyer des emails');
  }
});

// Route d'envoi
app.post('/api/send-email', async (req, res) => {
  const { to, subject, text, html } = req.body;

  const mailOptions = {
    from: `"TaskFlow" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
    to: to,
    subject: subject,
    text: text,
    html: html
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email envoyé:', info.messageId);
    res.json({ 
      success: true, 
      message: 'Email envoyé avec succès',
      messageId: info.messageId 
    });
  } catch (error) {
    console.error('❌ Erreur:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Serveur SMTP démarré sur http://localhost:${PORT}`);
});
