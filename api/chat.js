/** api/chat.js — Serverless Function per Vercel **/

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ reply: "Solo POST, fratello!" });
  }

  // Il body è già parsato da Vercel (content-type: application/json)
  const { message = "" } = req.body || {};

  if (!message.trim()) {
    return res.status(400).json({ reply: "Messaggio mancante" });
  }

  try {
    const openaiRes = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-turbo",          // o "gpt-4"
          messages: [
            { role: "system", content: "Sei Alfred Bot: sarcastico, divertente e in italiano." },
            { role: "user",   content: message },
          ],
          temperature: 0.8,
        }),
      }
    );

    if (!openaiRes.ok) {
      const errText = await openaiRes.text();
      console.error("OpenAI error:", errText);
      return res.status(500).json({ reply: "OpenAI ha rifiutato la richiesta 🥲" });
    }

    const data = await openaiRes.json();
    const reply = data.choices[0].message.content;
    return res.status(200).json({ reply });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ reply: "Errore interno, riprova più tardi." });
  }
}
