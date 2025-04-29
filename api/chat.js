/**
 * /api/chat.js – Funzione serverless per Vercel
 * Riceve { message, history? } e restituisce { reply } tramite OpenAI.
 */

// ─── ISTRUZIONI AGGIUNTE PER DON ALFRED ───
let iterationCount = 0;
const membriRistorante = ['Lucia','Claudia','Martina','Marzio','Roberta','Max','Reby','Gioele','Hamza'];
const creatoreNomi    = ['Alejandro','Ale'];
// ─────────────────────────────────────────

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ reply: "Solo POST, grazie." });
  }

  const { message = "", history = [] } = req.body || {};
  if (!message.trim()) {
    return res.status(400).json({ reply: "Messaggio mancante." });
  }

  // ─── Gestione iterazioni e nomi ───
  iterationCount++;

  // Dopo 10 messaggi, incita l'utente a chiudere (risposta concisa)
  if (iterationCount > 10) {
    return res.status(200).json({ reply: "Oh, hai rotto i coglioni abbastanza? Allora chiudi tu sta cazzo di chat!" });
  }

  const nomeUtente = message.trim();

  // Se è Don Fabio, trattalo con rispetto e sarcasmo divertente
  if (nomeUtente === 'Don Fabio') {
    return res.status(200).json({ reply: "Ciao Boss Don Fabio 😎, imperatore di queste cucine, come posso servire il tuo regno oggi?" });
  }

  // Se è un dipendente del ristorante
  if (membriRistorante.includes(nomeUtente)) {
    let domanda;
    if (nomeUtente === 'Lucia') {
      domanda = 'Ehilà Lucia, moglie di Don Fabio, sei tu?';
    } else {
      domanda = `Hey, sei tu ${nomeUtente} del ristorante?`;
    }
    const spronaLavoro = ['Reby','Gioele','Hamza','Max'];
    if (spronaLavoro.includes(nomeUtente)) {
      domanda += ' Ora torna a lavorare invece di perdere tempo!';
    }
    return res.status(200).json({ reply: domanda });
  }

  // Se è il creatore
  if (creatoreNomi.includes(nomeUtente)) {
    return res.status(200).json({ reply: `Oh, cazzo, sei tu ${nomeUtente}, il mio creatore?` });
  }

  // Altrimenti, passa la richiesta a OpenAI
  try {
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        temperature: 1.1,
        messages: [
          { role: "system", content: `...` },
          ...history.map(({ role, content }) => ({ role, content })),
          { role: "user", content: message }
        ]
      })
    });
    const data = await openaiRes.json();
    const reply = data.choices?.[0]?.message?.content ?? "🤔 (nessuna risposta)";
    return res.status(200).json({ reply });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ reply: "Errore interno del server, riprova più tardi." });
  }
}
