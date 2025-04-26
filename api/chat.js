// api/chat.js
export default async function handler(req, res) {
  try {
    const { message } = await req.json();

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-turbo",    // oppure "gpt-4", "gpt-4-turbo"…
        messages: [
          { role: "system", content: "Sei Alfred Bot, rispondi in italiano." },
          { role: "user",   content: message },
        ],
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("OpenAI error:", err);
      return res.status(500).json({ reply: "Errore interno, riprova più tardi." });
    }

    const data = await response.json();
    const reply = data.choices[0].message.content;
    res.status(200).json({ reply });

  } catch (e) {
    console.error("Handler error:", e);
    res.status(500).json({ reply: "Errore di connessione 😢" });
  }
}
