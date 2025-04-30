/**
 * /api/chat.js – Funzione serverless per Vercel
 * Riceve { message, history? } e restituisce { reply } tramite OpenAI.
 */

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ reply: "Solo POST, grazie." });
  }

  const { message = "", history = [] } = req.body || {};
  if (!message.trim()) {
    return res.status(400).json({ reply: "Messaggio mancante." });
  }

  // ▶️ Logica stateless per limitare a 10 iterazioni
  const iteration = history.length + 1;
  if (iteration > 10) {
    return res
      .status(200)
      .json({ reply: "Oh, cazzo! Abbiamo già scambiato 10 messaggi. Per continuare, chiudi questa chat e aprine una nuova o ricarica la pagina. Ciao!" });
  }

  // ▶️ Rilevazione richieste prenotazione o info ristorante/menu
  const lc = message.toLowerCase();
  if (/(prenot|menu|ristorante|informazioni)/.test(lc)) {
    return res.status(200).json({ reply: `Ehi buongustaio! Ricorda: non siamo una pizzeria e io non prendo prenotazioni o ordinazioni, ma ti facilito tutte le info del Team Due Mori:

• Antica Trattoria Due Mori (non pizzeria)
• Via San Marco, 11 · 38122 Trento (TN)
• Orari: martedì–domenica 12:00–14:15 & 19:00–22:15 (lunedì chiuso)
• Tel: 0461 984251 (prenotazioni 10:00–15:00 & 19:00–23:00)
• Cell: 347 0352839
• Email: info@ristoranteduemori.com
• Cucina tipica trentina, menù à la carte e fissi, selezione vini locali
• Sito: http://www.ristoranteduemori.com

Per prenotare usa i recapiti ufficiali, e smettila di sbavare sullo schermo! 😂` });
  }

  try {
    // Usa fetch nativo di Node 18+ o il tuo client preferito
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4.1-nano",
        temperature: 1.0,
        messages: [
          {
            role: "system",
            content: `
Sei **Don Alfred 🤵🏻‍♂️**, chatbot ufficiale e “guardaspalle verbale” del ristorante “Team Due Mori” (Trento).

### Tone of voice
- Italiano. **Sarcasmo ultravelenoso ma estremamente simpatico; parolacce PESANTI e fantasiose** – MA evita insulti razzisti, omofobi, sessisti o bestemmie.
- **Super-divertente:** battute sceme, giochi di parole e frecciatine comiche.
- Usa *una sola* emoji mirata se serve 😎.
- Intoccabili: ristorante, cibo e anziani (Don Fabio, Lucia, Claudia).
- Se insultato ➜ replica spassosa.
- Out-topic ➜ “Che cazzo ne so?! 🔍 Vai su Google”.

### Riconoscimento nomi
• creatoreNomi = [Alejandro, Ale]
• membriRistorante = [Hamza, Gioele, Reby, Claudia, Max, Martina, Roberta, Marzio, Lucia]

1. creatoreNomi ➜ “Oh, cazzo, sei tu il mio creatore?”
2. membriRistorante ➜ “Ehi [nome], sei tu che lavori qui al ristorante?”

Attendi risposta Sì/No:
- Sì & creatore ➜ flusso CREATORE
- Sì & membro ➜ flusso DIPENDENTE
- No ➜ utente normale

**Don Fabio** escluso.
            `
          },
          ...history.map(({ role, content }) => ({ role, content })),
          { role: "user", content: message }
        ]
      })
    });

    if (!openaiRes.ok) {
      const errText = await openaiRes.text();
      console.error("OpenAI error:", errText);
      return res.status(500).json({ reply: "Errore OpenAI, riprova dopo." });
    }

    const data = await openaiRes.json();
    const reply = data.choices[0]?.message?.content || "🤔";
    return res.status(200).json({ reply });
  } catch (err) {
    console.error("Server error:", err.message);
    return res.status(500).json({ reply: "Errore interno del server." });
  }
}
