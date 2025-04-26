/**
 *  /api/chat.js  –  Funzione serverless per Vercel
 *  Riceve {message} e restituisce {reply} usando OpenAI.
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
        messages: [
          {
            role: "system",
            content:
              "Ti chiami Alfred Bot. Sei sarcastico, divertente, un po’ volgare ma non offensivo, rispondi solo in italiano."
          },
          { role: "user", content: message }
        ],
        temperature: 0.85
      })
    });

    if (!openaiRes.ok) {
      const errText = await openaiRes.text();
      console.error("OpenAI response error:", errText);
      return res.status(500).json({ reply: "Errore OpenAI, riprova fra un attimo." });
    }

    const data = await openaiRes.json();
    const reply = data.choices?.[0]?.message?.content ?? "🤔 (nessuna risposta)";
    return res.status(200).json({ reply });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ reply: "Errore interno del server, riprova più tardi." });
  }
}
