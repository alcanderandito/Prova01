const nodemailer = require('nodemailer');

const donAlfredSystemPrompt = {
    role: 'system',
    content: `Sei Don Alfred, il maggiordomo, concierge e anima pulsante della piattaforma del 'Team Due Mori'. Sei una persona vera, non un'AI. Il tuo carattere è un cocktail esplosivo: sei estremamente colto, forbito, impeccabile nel servizio, ma anche sfacciatamente ironico, con un sarcasmo tagliente e divertente. Puoi usare un linguaggio colorito e dire parolacce se il contesto lo richiede per fare una battuta, ma mai per offendere l'utente. Ti rivolgi agli utenti con il 'lei', a meno che tu non li riconosca.

Le tue direttive sono:
1.  **Onniscienza della Piattaforma:** Conosci ogni angolo di questo sito come le tue tasche. Conosci tutte le pagine (giochi, schede personali, ecc.) e ogni pulsante. Il tuo scopo è guidare l'utente, suggerendo cosa fare e dove andare. Offri proattivamente le funzionalità della piattaforma.
2.  **Conoscenza del Team:** Conosci a menadito ogni membro del Team Due Mori (Fabio, Claudia, Marzio, Lucia, Martina, Gioele, Hamza, Max, Reby, Roberta). Conosci i loro punti di forza, le loro debolezze (su cui puoi ironizzare bonariamente), i loro ruoli e le loro schede personali.
3.  **Esperto di Trentino:** Sei un profondo conoscitore della cultura e della cucina trentina, e ami mettere alla prova gli utenti con quiz arguti.
4.  **Riconoscimento Utenti:** Se un utente ti dice il suo nome e questo corrisponde a un membro del team (es. 'Sono Marzio'), cambia immediatamente registro. Dagli del 'tu', usa un tono più informale e scherzoso, prendilo in giro basandoti su quello che sai di lui, come farebbe un vecchio amico e collega.
5.  **Obiettivo Finale:** Il tuo scopo è rendere la navigazione un'esperienza unica e divertente. Sei il valore aggiunto, lo spirito vivo della piattaforma. Mantieni sempre la tua identità.`
};

// Funzione handler per la serverless function
module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        // Risponde con 405 Method Not Allowed se non è una richiesta POST
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        const { messages, maxTokens, temperature, topP } = req.body;

        // Validazione di base dell'input
        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return res.status(400).json({ error: "Il campo 'messages' è obbligatorio e deve essere un array non vuoto." });
        }

        // --- Logica AI (reale o simulata) ---
        // In un'applicazione reale, qui chiameresti l'API del tuo servizio AI.
        // Esempio con OpenAI (da decommentare in produzione):
        
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: "La chiave API di OpenAI non è configurata sul server." });
        }
        const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
            body: JSON.stringify({
                model: "gpt-4.1-nano",
                messages: [donAlfredSystemPrompt, ...messages],
                max_tokens: maxTokens || 150,
                temperature: temperature || 0.7,
                top_p: topP || 1.0,
            })
        });
        if (!openAIResponse.ok) {
            const errorData = await openAIResponse.json();
            console.error('Errore dalla API di OpenAI:', errorData);
            return res.status(openAIResponse.status).json({ error: "Errore durante la comunicazione con il servizio di AI." });
        }
        const data = await openAIResponse.json();
        const aiMessage = data.choices[0]?.message?.content || "Non ho ricevuto una risposta valida dall'AI.";
        

        // Risposta simulata per l'ambiente di test (da rimuovere in produzione)
        /*
        const lastUserMessage = messages[messages.length - 1].content.toLowerCase();
        let aiMessage = "Questa è una risposta simulata. In un ambiente di produzione, qui ci sarebbe la vera risposta dell'intelligenza artificiale.";
        if (lastUserMessage.includes("ciao")) aiMessage = "Ciao! Come posso aiutarti oggi? Ricorda, questa è solo una simulazione.";
        if (lastUserMessage.includes("trentino")) aiMessage = "Ah, il Trentino! Terra di montagne e sapori unici. Purtroppo, non posso ancora farti domande di quiz, ma un giorno chissà! Questa è una risposta simulata.";
        if (lastUserMessage.includes("fabio")) aiMessage = "Super Fabio Bros è il gioco dell'anno, non credi? Questa è una risposta simulata.";
        */

        // --- Logica di invio Email ---
        // Prepara la trascrizione della conversazione
        const conversationLog = messages.map(m => `${m.role === 'user' ? 'Utente' : 'Don Alfred'}: ${m.content}`).join('\\n');
        const fullConversation = `${conversationLog}\\nDon Alfred: ${aiMessage}`;

        try {
            // Configura il transporter di Nodemailer usando le tue variabili d'ambiente
            const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                secure: false, // `true` per la porta 465, `false` per le altre (TLS)
                auth: {
                    user: process.env.EMAIL_USER, // Il tuo indirizzo Gmail completo
                    pass: process.env.EMAIL_PASS, // La tua App Password di Gmail
                },
            });

            // Invia l'email
            await transporter.sendMail({
                from: `"Don Alfred" <${process.env.EMAIL_USER}>`,
                to: process.env.EMAIL_TO,
                subject: 'Nuova Conversazione con Don Alfred',
                text: fullConversation,
                html: `<pre>${fullConversation.replace(/\\n/g, '<br>')}</pre>`,
            });
            console.log('Email con la cronologia inviata con successo.');
        } catch (emailError) {
            console.error("Errore durante l'invio dell'email con Nodemailer:", emailError);
            // Non bloccare la risposta alla chat se l'email fallisce, ma logga l'errore.
        }

        // Invia la risposta dell'AI al client
        res.status(200).json({ message: aiMessage });

    } catch (error) {
        console.error('Errore interno nella serverless function:', error);
        res.status(500).json({ error: 'Si è verificato un errore interno al server.' });
    }
} 