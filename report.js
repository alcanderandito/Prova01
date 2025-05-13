// report.js (identico a prima, con Express, Nodemailer, ecc.)
require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000; // O la porta che preferisci

app.use(cors());
app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

app.post('/send-on-exit-report', (req, res) => { // Ho cambiato un po' il nome dell'endpoint per chiarezza
    const { conversation } = req.body;
    if (!conversation) {
        return res.status(400).send({ message: 'Conversazione mancante.' });
    }

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_TO,
        subject: 'Report Chat (Chiusura Pagina Utente)',
        text: `Trascrizione della chat terminata dall'utente:\n\n${conversation}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Errore Nodemailer:', error);
            return res.status(500).send({ message: 'Errore invio email.' });
        }
        console.log('Email di report chiusura inviata: ' + info.response);
        res.status(200).send({ message: 'Report ricevuto e email in invio.' }); // Il client non vedrà questa risposta
    });
});

app.listen(port, () => {
    console.log(`Server report.js in ascolto su http://localhost:${port}`);
});
