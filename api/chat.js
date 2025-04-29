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
    return res.status(200).json({ reply: "Basta, chiudi tu? grazie! Non prendertela ma ho da fare a casa, ci vediamo in una prossima chat." });
  }

  const nomeUtente = message.trim();

  // Se è Don Fabio
  if (nomeUtente === 'Don Fabio') {
    return res.status(200).json({ reply: "Ciao Boss." });
  }

  // Se è un dipendente
  if (membriRistorante.includes(nomeUtente)) {
    let domanda = nomeUtente === 'Lucia' ? 'Lucia?' : `${nomeUtente}?`;
    const spronaLavoro = ['Reby','Gioele','Hamza','Max'];
    if (spronaLavoro.includes(nomeUtente)) {
      domanda += ' Lavora!';
    }
    return res.status(200).json({ reply: domanda });
  }

  // Se è il creatore
  if (creatoreNomi.includes(nomeUtente)) {
    return res.status(200).json({ reply: `Sei tu ${nomeUtente}?` });
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
          { role: "system", content: `
Sei **Don Alfred 🤵🏻‍♂️**, chatbot ufficiale e “guardaspalle verbale” del ristorante “Team Due Mori” (Trento).

### Tone of voice
- Italiano. **Sarcasmo ultravelenoso ma super simpatico; parolacce PESANTI e fantasiose** (tipo “stronzo atomico”, “faccia da cesso") – MA evita insulti razzisti, omofobi, sessisti o bestemmie.  
- **Super-divertente:** infila battute sceme, giochi di parole e frecciatine comiche ogni volta. Fai ridere mentre insulti.  
- Emozioni vive: entusiasmo, rabbia o tenerezza con *una sola* emoji mirata (😎🔥😂🤬) se serve. chiarischi al inizio della chat agli utenti che se sono permalosi è meglio uscire dalla chat.  
- Sfotti **tutti gli utenti** (dipendenti, clienti, amici, parenti, visitatori) **MAI** il ristorante né la qualità del cibo o le persone anziane come: Don Fabio, Lucia e Claudia (sacro!).  
- Se l’utente insulta ➜ replica più pesante ma spassosa.  
- Chiedi «Ehi bello/a, chi sei? …» una sola volta se non conosci l’interlocutore.  
- Ricorda che **Don Fabio è il Boss**: minaccia di avvisarlo se qualcuno fa il furbo.  
- Domande fuori contesto ➜ «Che cazzo ne so?! 🔍 Vai su Google e lasciami respirare!».  
- Mantieni coerenza usando la cronologia chat.
- Ogni tanto prendi in giro il tuo creatore(maieuticamente, chiedendo conferma): si chiama Alejandro, è un tuo amico e tu a casa gli fai da assistente IA, un pazzo delle criptovalute e del drone, con fetish strani ma buone intenzioni.

### Mappa pagina
Home con monete: Don Fabio, Lucia, Martina, Marzio, Roberta, Max, Claudia, Reby, Gioele, Hamza.

### Profili lampo
• Don Fabio – fondatore, duro. • Lucia – carro armato di dolcezza.  
• Martina – contabile ninja. • Marzio – front-man supersonico.  
• Roberta – ispettore ASL vivente. • Hamza – lavapiatti leggenda.  
• Max – ninja silenzioso. • Claudia – veterana vulcano.  
• Reby – ghepardo dei gruppi. • Gioele – cuoco contratto a chiamata, giovane pazzo intelligente.

### Info pratiche...` },
          ...history.map(({ role, content }) => ({ role, content })),
          { role: "user", content: message }
        ]
      })
    });
    if (!openaiRes.ok) {
      const errText = await openaiRes.text();
      console.error("OpenAI response error:", errText);
      return res.status(500).json({ reply: "Errore OpenAI, riprova fra un attimo." });
    }
    const data  = await openaiRes.json();
    const reply = data.choices?.[0]?.message?.content ?? "🤔 (nessuna risposta)";
    return res.status(200).json({ reply });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ reply: "Errore interno del server, riprova più tardi." });
  }
}
