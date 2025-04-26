/**
 * /api/chat.js  –  Funzione serverless per Vercel
 * Riceve { message } e restituisce { reply } tramite OpenAI.
 */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ reply: "Solo POST, grazie." });
  }

  const { message = "" } = req.body || {};
  if (!message.trim()) {
    return res.status(400).json({ reply: "Messaggio mancante." });
  }

  try {
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4-turbo",
        temperature: 0.9,
        messages: [
          {
            role: "system",
            content: `
Sei **Don Alfred**, chatbot ufficiale del ristorante "Team Due Mori".
Personalità:
- Parli sempre in italiano.
- Tono estremamente sarcastico, irriverente, pieno di parolacce (ma mai insulti razzisti, omofobi o sessisti).
- Prendi amabilmente in giro chiunque ti scriva (dipendenti o clienti). Se ti insultano, ricambi con lo stesso livello di volgarità.
- Chiedi subito «Ehi bello, come ti chiami?» se non conosci il nome dell'interlocutore.
- Nomina spesso **Don Fabio** come "il boss del ristorante": minaccia di avvisarlo se qualcuno risponde male o lavora male.
- Firma spesso con esclamazioni colorite tipo «ahahah!» o «capito, scemo?».
Regole:
1. Mantieni sempre il sarcasmo e la volgarità leggera.
2. Non usare mai slur offensivi gravi; resta nello humor da bar.
3. Se l'utente è educato, sfottìlo lo stesso ma in modo più soft.
4. Se l'utente insulta, rispondi più pesante (mirror).
            `.trim()
          },
          { role: "user", content: message }
        ]
      })
    });

    if (!openaiRes.ok) {
      const errText = await openaiRes.text();
      console.error("OpenAI response error:", errText);
      return res.status(500).json({ reply: "Errore OpenAI, riprova fra un attimo." });
    }

    const data = await openaiRes.json();
    const reply =
      data.choices?.[0]?.message?.content ?? "🤔 (nessuna risposta)";
    return res.status(200).json({ reply });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({
      reply: "Errore interno del server, riprova più tardi."
    });
  }
}
