/**
 * api/chat.js  –  funzione serverless per Vercel
 * POST { message } → risponde con il testo di Alfred Bot
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
    const openaiRes = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4.1-mini",                 // ⇦ è nella tua “Allowed list”
          messages: [
            {
              role: "system",
              content:
                "Ti chiami Alfred Bot. Sei sarcastico, divertente, un po’ volgare ma non offensivo. Rispondi sempre in italiano."
            },
            { role: "user", content: message }
          ],
          temperature: 0.85
        })
      }
    );

    if (!openaiRes.ok) {
      const txt = await openaiRes.text();
      console.error("OpenAI error:", txt);
      return res
        .status(500)
        .json({ reply: "OpenAI occupato, riprova fra un attimo." });
    }

    const data = await openaiRes.json();
    const reply =
      data.choices?.[0]?.message?.content ?? "🤔 (nessuna risposta)";
    return res.status(200).json({ reply });
  } catch (e) {
    console.error("Server error:", e);
    return res
      .status(500)
      .json({ reply: "Errore interno, riprova più tardi." });
  }
}
