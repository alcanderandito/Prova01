export default async function handler(req, res) {
  const body = await req.json();

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-4.0-turbo",
      messages: [{ role: "user", content: body.message }],
      temperature: 0.8
    })
  });

  const data = await response.json();
  res.status(200).json({ reply: data.choices[0].message.content });
}
