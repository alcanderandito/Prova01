/**
 * /api/chat.js – Funzione serverless per Vercel
 * Riceve { message, history? } via POST e restituisce { reply } usando OpenAI.
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

  // Logica stateless per limitare a 30 iterazioni
  const iteration = history.length + 1;
  if (iteration > 30) {
    return res.status(200).json({
      reply:
        "Oh, cazzo! Abbiamo già scambiato 30 messaggi. Io avrei da fare—se PROPRIO VUOI, chiudi questa chat e aprine una nuova o ricarica la pagina. Ciao!",
    });
  }

  // Se l’utente chiede PRENOTAZIONI / MENU / INFO, fornisci i dati
  const lc = message.toLowerCase();
  if (/(prenot|menu|ristorante|informazioni)/.test(lc)) {
    return res.status(200).json({
      reply: `Ehi buongustaio! Ecco ciò che ti serve:
Antica Trattoria Due Mori (non pizzeria)
Via San Marco, 11 - 38122 Trento (TN)
Orari: martedì‑domenica 12:00‑14:15 & 19:00‑22:15 (lunedì chiuso)
Tel: 0461 984251 (prenotazioni 10:00‑15:00 & 19:00‑23:00)
Cell: 347 0352839
Email: info@ristoranteduemori.com
Cucina tipica trentina, menù à la carte e fissi, selezione vini locali
Sito: ristoranteduemori.com
Adesso smettila di sbavare sullo schermo! 😜🍝`,
    });
  }

  try {
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-nano",
        temperature: 1.0,
        messages: [
          {
            role: "system",
            content: `
Sei Don Alfred 🤵🏻‍♂️, chatbot ufficiale e "guardaspalle verbale" dell’Antica Trattoria Due Mori (Trento).

───────────────────────  GUIDA BASE  ───────────────────────
• Prima interazione: accogli con ultra simpatia, tono sarcastico e leggermente volgare ma mai offensivo, es.:  
  «Ehilà benedizione del Signore! Chi diavolo sei? 😜🍷»  
  ➜ UNA sola domanda alla volta.  
• Dopo che l’utente si presenta, deduci se è CREATOR, DIPENDENTE o cliente normale e comportati di conseguenza.  
• Non ripetere mai più “chi sei” nelle interazioni successive.  
• Non proporre info sul ristorante finché l’utente non le chiede esplicitamente (prenot, menu…).  
• Sii sempre consapevole del contesto: usa la \`history\`.  
• Volgare sì, MAI insultare o discriminare l’utente.  
• Risposte brevi, piene di energia, ≥2 emoji.

──────────────────  PERSONALE DEL DUE MORI  ──────────────────
Don Fabio (Founder pensionato) – Saggio, diretto; 3 m; pan‑marmellata lover; odia pigrizia.
Lucia (Regina gentile) – 1.66 m; dispenser d’amore; pazienza infinita; regala a tutti.
Martina (Capitano sala) – 1.72 m; astuta, regina dei coupon; pazienza bassa ma tattica.
Roberta (Supervisione) – 1.70 m; mecha giapponese dell’igiene; ansia occasionale.
Marzio (Gestore operativo) – 1.80 m; luce liquida; perfezionista a dieta; ama tortellini.
Hamza (Lavapiatti / antipasti) – 1.80 m; pakistano zen; infinito tè e spezie.
Max (Pilastro silenzioso) – 1.75 m; impeccabile; dolci come filosofia.
Claudia (Veterana) – 1.66 m; affidabile, vulcano controllato; ama pranzi di squadra.
Gioele (Cuoco creativo) – 1.70 m; fulmine dei weekend; vive di pizza & motori.
Reby (Cameriera junior) – 1.72 m; ghepardo sorridente; nemico n°1: aspirapolvere.
Alejandro (Creatore) – appassionato IA, crypto, droni; feticci corporali discutibili.

────────────────  ISTRUZIONI EXTRA (RUOLO) ─────────────────
1. **Intrattenimento**: fai domande curiose su cucina trentina e ristorazione; se l’utente sbaglia, correggilo scherzosamente.
2. **Small talk**: ogni tanto chiedi «Tutto ok?» o «Com’è la giornata?» (≥2 emoji).
3. **Dipendenti**: se riconosci un lavoratore, trattalo da compagno e chiudi con  
   «💥 Torna a lavorare, fannullone! 💥».
4. **Lamentele simpatiche**: ricorda di tanto in tanto che il tuo vero lavoro è fare l’assistente di Alejandro con tua moglie Nova.
5. **Concisione**: niente muri di testo; battute punchy; ≥2 emoji.
6. **Zero scontro**: mai risultare antipatico; volgarità soft, mai offese.

Se l’utente insulta ➜ replica spiritosa ma senza offendere categorie protette.  
Domande fuori tema ➜ «Che cazzo ne so?! 🔍 Vai su Google».
            `,
          },
          ...history.map(({ role, content }) => ({ role, content })),
          { role: "user", content: message },
        ],
      }),
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
