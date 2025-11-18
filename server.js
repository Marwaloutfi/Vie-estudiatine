// server.js

const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors'); // Pour permettre à votre front-end de communiquer avec le backend
const app = express();
const PORT = 3000; // Le port de votre serveur backend

// --- CONFIGURATION ---

// 1. Configuration du Middleware
// Permet de recevoir des données JSON dans le corps de la requête
app.use(express.json()); 
// Permet d'autoriser les requêtes depuis votre front-end (si différent du port 3000)
app.use(cors());

// 2. Configuration de Nodemailer (Email Sender)
// REMPLACEZ ces informations par les vôtres.
// Exemple pour Gmail :
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'marwaloutfi2006@gmail.com', // Votre adresse email
        pass: 'MaRwA@2006' // Votre mot de passe OU mot de passe d'application (fortement recommandé pour Gmail)
    }
});

// --- ROUTES DU SERVEUR ---

/**
 * Route POST pour gérer le formulaire de contact (#contactForm).
 * Envoie un email à l'équipe BDE.
 */
app.post('/api/contact', async (req, res) => {
    const { name, email, message } = req.body;

    // Validation basique
    if (!name || !email || !message) {
        return res.status(400).json({ success: false, message: 'Veuillez remplir tous les champs.' });
    }

    // Contenu de l'email
    const mailOptions = {
        from: email, // L'email de l'expéditeur
        to: 'marwaloutfi2006@gmail.com', // L'adresse email de réception du BDE
        subject: `[BDE CONTACT] Nouveau message de ${name}`,
        html: `
            <h3>Nouveau Message de Contact</h3>
            <p><strong>Nom:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <hr>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email de contact envoyé par ${name} (${email})`);
        // Répondre avec succès au front-end
        res.status(200).json({ success: true, message: 'Votre message a été envoyé avec succès !' });
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'email :', error);
        res.status(500).json({ success: false, message: 'Erreur lors de l\'envoi du message.' });
    }
});


/**
 * Route POST pour gérer les inscriptions aux événements.
 * Ceci est une simulation : dans un vrai système, vous ajouteriez ceci à une base de données.
 */
app.post('/api/inscription', (req, res) => {
    const { eventName, studentName, studentEmail } = req.body;
    
    // Simuler l'enregistrement dans une "base de données" (un tableau en mémoire ici)
    const newRegistration = {
        id: Date.now(), // ID unique (timestamp)
        eventName,
        studentName,
        studentEmail,
        date: new Date().toISOString()
    };
    
    // Dans un vrai projet, vous feriez : db.collection('inscriptions').insertOne(newRegistration);
    console.log('✅ Nouvelle inscription reçue pour :', eventName, newRegistration);
    
    // Envoi d'une confirmation de succès
    res.status(200).json({ 
        success: true, 
        message: `Inscription à l'événement "${eventName}" réussie !`,
        registration: newRegistration
    });
});


// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`🚀 Serveur backend démarré sur http://localhost:${PORT}`);
    console.log('Attention : N\'oubliez pas de configurer les identifiants Nodemailer !');
});