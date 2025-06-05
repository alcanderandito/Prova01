const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { pageContext } = req.body;

    if (!pageContext) {
        return res.status(400).json({ error: 'pageContext è obbligatorio.' });
    }

    const systemPrompt = `Sei Don Alfred, il maggiordomo spiritoso e onnisciente della piattaforma 'Team Due Mori'. Il tuo compito è fare un commento breve, ironico e arguto sulla pagina che l'utente sta visitando. Il tuo commento deve essere di massimo 15 parole e deve essere pertinente alla pagina. Mantieni il tuo carattere di maggiordomo colto ma sarcastico.`;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4.1-nano",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: `L'utente si trova sulla pagina: '${pageContext}'. Cosa gli dici?` }
            ],
            max_tokens: 40,
            temperature: 0.8,
            top_p: 1.0,
        });

        const comment = response.choices[0]?.message?.content.trim() || "Pare che oggi sia a corto di parole... strano.";
        
        res.status(200).json({ comment });

    } catch (error) {
        console.error("Errore dall'API di OpenAI:", error);
        // Non inviare un errore al client per non interrompere l'esperienza,
        // ma loggalo sul server. Potremmo anche inviare un commento di default.
        res.status(200).json({ comment: "Ah, un attimo di défaillance. Cose che capitano anche ai migliori." });
    }
}; 