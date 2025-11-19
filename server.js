const express = require("express");
const nodemailer = require("nodemailer");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// IMPORTANT : Assurez-vous que votre fichier index.html corrigé
// se trouve bien dans un dossier nommé 'public' à la racine de ce script.
app.use(express.static(path.join(__dirname, "public"))); 

// Route GET pour la page d'accueil (peut être omise si express.static est bien configuré)
app.get("/", (req, res) => {
    // Si express.static est utilisé, index.html dans 'public' est servi automatiquement.
    // Cette ligne assure une compatibilité si le comportement par défaut n'est pas le bon.
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Configuration du transporteur Nodemailer (à définir une seule fois)
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "marwaloutfi2006@gmail.com",
        // IMPORTANT: Utilisez toujours un MOT DE PASSE D'APPLICATION pour la sécurité.
        pass: "ylxt xsri ygmo lxqc" 
    }
});

// Route POST pour le formulaire de CONTACT
app.post("/contact", async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ success: false, message: "Tous les champs sont requis." });
    }

    const mailOptions = {
        from: `"${name}" <${email}>`, // Permet d'identifier l'expéditeur dans votre boîte de réception
        to: "marwaloutfi2006@gmail.com",
        subject: `[BDE CONTACT] Message de ${name}`,
        html: `<p><strong>Nom:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong> ${message}</p>`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, message: "Message envoyé avec succès !" });
    } catch (err) {
        console.error("Erreur Nodemailer (Contact):", err.message);
        res.status(500).json({ success: false, message: "Erreur lors de l'envoi du message." });
    }
});

// NOUVEAUTÉ : Route POST pour l'INSCRIPTION à un événement
app.post("/register", async (req, res) => {
    const { name, email, eventName } = req.body;

    if (!name || !email || !eventName) {
        return res.status(400).json({ success: false, message: "Le nom, l'email et l'événement sont requis." });
    }

    // Vous pouvez ici enregistrer l'inscription dans une base de données (non implémenté)

    // Envoi d'une notification par email
    const mailOptions = {
        from: `"Inscription BDE" <marwaloutfi2006@gmail.com>`,
        to: "marwaloutfi2006@gmail.com", // Vous recevez la notification
        subject: `[BDE INSCRIPTION] Nouvelle inscription pour ${eventName}`,
        html: `<p><strong>Événement:</strong> ${eventName}</p><p><strong>Nom de l'étudiant:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p>`
    };

    try {
        await transporter.sendMail(mailOptions);
        // Envoi d'une confirmation de succès au client
        res.status(200).json({ success: true, message: `Inscription à ${eventName} enregistrée !` });
    } catch (err) {
        console.error("Erreur Nodemailer (Inscription):", err.message);
        res.status(500).json({ success: false, message: "Erreur lors de l'inscription et de la notification." });
    }
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${3000}`);
});
