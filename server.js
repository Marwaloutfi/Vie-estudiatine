// server.js
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;
// server.js (before line 92)

// 1. Get the 'config' module (assuming your config file exports it)
const config = require('./path/to/your/config');
// OR, if you're using a package like 'config'
// const config = require('config');
// === DONNÉES SIMULÉES ===
const registeredUsers = [];       // { name, email, promotion, password }
const eventRegistrations = [];    // { eventName, name, email, promotion, timestamp }

// === MIDDLEWARE ===
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public'))); // Assurez-vous que votre frontend est dans /public

// === NODEMAILER CONFIGURATION ===
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'marghwaloutfi@gmail.com', // Ton email Gmail
        pass: 'jfqd smtz pxby zjkk'      // Mot de passe d'application Gmail
    }
});

// === ROUTES AUTHENTIFICATION ===

// Créer un compte
app.post('/api/create-account', (req, res) => {
    const { name, email, promotion, password } = req.body;
    if (!name || !email || !promotion || !password) {
        return res.status(400).json({ success: false, error: 'Veuillez remplir tous les champs.' });
    }
    if (!email.endsWith('@emsi.ma')) {
        return res.status(400).json({ success: false, error: 'Email EMSI requis.' });
    }
    if (registeredUsers.find(u => u.email === email)) {
        return res.status(409).json({ success: false, error: 'Email déjà enregistré.' });
    }
    registeredUsers.push({ name, email, promotion, password });
    res.status(201).json({ success: true, message: `Bienvenue ${name} ! Compte créé.` });
});

// Connexion
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const user = registeredUsers.find(u => u.email === email && u.password === password);
    if (!user) return res.status(401).json({ success: false, error: 'Email ou mot de passe incorrect.' });
    res.json({ success: true, message: `Connexion réussie ! Bienvenue ${user.name}.` });
});

// === ROUTES ÉVÉNEMENTS ===

// Inscription à un événement
app.post('/api/register-event', (req, res) => {
    const { eventName, name, email, promotion } = req.body;
    if (!eventName || !name || !email || !promotion) return res.status(400).json({ success: false, error: 'Tous les champs requis.' });

    if (eventRegistrations.find(e => e.email === email && e.eventName === eventName)) {
        return res.status(409).json({ success: false, error: `Déjà inscrit à ${eventName}.` });
    }

    eventRegistrations.push({ eventName, name, email, promotion, timestamp: new Date().toISOString() });
    res.json({ success: true, message: `Inscription à ${eventName} réussie !` });
});

// === FORMULAIRE DE CONTACT ===
app.post('/api/contact', async (req, res) => {
    const { name, email, message } = req.body;
    if (!name || !email || !message) return res.status(400).json({ success: false, error: 'Tous les champs requis.' });

    try {
        await transporter.sendMail({
            from: `"${name}" <${email}>`,
            to: 'marghwaloutfi@gmail.com', 
            subject: `Message BDE EMSI de ${name}`,
            html: `<p>${message}</p><p>De : ${email}</p>`
        });
        res.json({ success: true, message: 'Message envoyé avec succès !' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Erreur lors de l’envoi du message.' });
    }
});

// === SERVIR LE FRONTEND ===
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
if (config.isSimulationMode) {
    console.log("C'est envoyé");
    return true; // Return success status immediately
} else {
    // **Actual logic to call the external service goes here**
    externalService.send(data);
}
// === LANCEMENT DU SERVEUR ===
app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur http://localhost:${3000}`);
});
