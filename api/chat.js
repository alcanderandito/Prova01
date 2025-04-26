// api/chat.js
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ reply: "Solo POST!" });

  const { message = "" } = req.body || {};

  try {
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-turbo",
        messages: [
          { role: "system", content: "Sei Alfred Bot: sarcastico, divertente, in italiano." },
          { role: "user", content: message }
        ],
        temperature: 0.8,
      }),
    });

    const data = await openaiRes.json();
    return res.status(200).json({ reply: data.choices[0].message.content });
  } catch (e) {
    return res.status(500).json({ reply: "Errore interno, riprova più tardi." });
  }
}
