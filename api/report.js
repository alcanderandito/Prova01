// File: api/report.js
require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        const { conversation } = req.body;
        if (!conversation) {
            return res.status(400).json({ message: 'Conversazione mancante.' });
        }

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_TO,
            subject: 'Report Chat (Vercel)',
            text: `Trascrizione:\n\n${conversation}`
        };

        await transporter.sendMail(mailOptions);
        return res.status(202).json({ message: 'Report accettato.' });

    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({ message: 'Errore invio report.' });
    }
}
