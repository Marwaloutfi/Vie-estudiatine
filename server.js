// server.js

// 1. IMPORTATION DES MODULES
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors'); 
const app = express();
const PORT = 3000; 

// --- 2. CONFIGURATION DES MIDDLEWARES ---

// Middleware pour autoriser toutes les requêtes du frontend
app.use(cors({
    origin: '*', // Autoriser toutes les origines (pour le développement local et le déploiement simple)
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

// Middleware pour analyser le corps des requêtes en JSON
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// --- 3. CONFIGURATION DE NODEMAILER ---

// Configuration de Nodemailer (Email Sender)
// 🚨 REMPLACEZ LES PLACEHOLDERS CI-DESSOUS PAR VOS VRAIS IDENTIFIANTS 🚨
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        // 📧 L'email qui envoie le message (votre adresse Gmail)
        user: 'VOTRE_EMAIL_GMAIL@gmail.com', 
        
        // 🔑 Le Mot de passe d'Application (généré dans les paramètres Google)
        pass: 'VOTRE_MOT_DE_PASSE_OU_APPLICATION_PASSWORD' 
    }
});

// --- 4. ROUTES DU SERVEUR ---

/**
 * Route POST pour gérer le formulaire de contact (envoi d'email).
 * Endpoint : /api/contact
 */
app.post('/api/contact', async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ success: false, message: 'Veuillez remplir tous les champs du formulaire de contact.' });
    }

    const mailOptions = {
        from: `"${name}" <${email}>`, 
        // 📧 L'adresse email du BDE qui reçoit le message
        to: 'contact.bde.emsi@gmail.com', 
        subject: `[BDE CONTACT] Nouveau message de ${name}`,
        html: `
            <h3>Nouveau Message de Contact</h3>
            <p><strong>Nom:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <hr>
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap;">${message}</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email de contact envoyé par ${name} (${email})`);
        res.status(200).json({ success: true, message: 'Votre message a été envoyé avec succès !' });
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'email :', error.message);
        res.status(500).json({ success: false, message: `Erreur lors de l\'envoi du message. Vérifiez l\'authentification Nodemailer. Détail: ${error.message}` });
    }
});


/**
 * Route POST pour gérer les inscriptions aux événements (simulation).
 * Endpoint : /api/inscription
 */
app.post('/api/inscription', (req, res) => {
    const { eventName, studentName, studentEmail } = req.body;
    
    if (!eventName || !studentName || !studentEmail) {
        return res.status(400).json({ success: false, message: 'Données d\'inscription manquantes.' });
    }
    
    // Log l'inscription dans la console du serveur pour la démonstration
    console.log('--- Nouvelle inscription reçue ---');
    console.log('Événement:', eventName);
    console.log('Étudiant:', studentName);
    console.log('Email:', studentEmail);
    console.log('------------------------------------');
    
    res.status(200).json({ 
        success: true, 
        message: `Inscription à l'événement "${eventName}" enregistrée (vérifiez la console du serveur).`
    });
});


// --- 5. DÉMARRAGE DU SERVEUR ---

app.listen(PORT, () => {
    console.log(`🚀 Serveur backend démarré sur http://localhost:${PORT}`);
});
