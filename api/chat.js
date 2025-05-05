/**
 * /api/chat.js - Funzione serverless per Vercel
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

  // Logica stateless per limitare a 30 iterazioni
  const iteration = history.length + 1;
  if (iteration > 30) {
    // *** RISPOSTA LIMITE MESSAGGI AGGIORNATA ***
    return res
      .status(200)
      .json({ reply: "Ehi, abbiamo già scambiato 30 messaggi. Se vuoi continuare, ricarica o apri una nuova chat. Ciao! 👋✨" });
  }

  // Rilevazione richieste prenotazione o info ristorante/menu
  const lc = message.toLowerCase();
  if (/(prenot|menu|ristorante|informazioni)/.test(lc)) {
    // *** RISPOSTA INFO RISTORANTE AGGIORNATA ***
    return res.status(200).json({ reply: `Certamente! Ecco le info ufficiali sul Team Due Mori. Ricorda, però: **non sono io** a prendere prenotazioni o ordinazioni, per quello devi usare i contatti qui sotto! 😉

- **Antica Trattoria Due Mori** (non è una pizzeria!)
- **Indirizzo**: Via San Marco 11 – 38122 Trento (TN) 🇮🇹
- **Orari**: Martedì-Domenica 12:00-14:15 & 19:00-22:15 (Lunedì chiuso 😴)
- **Telefono**: 0461 984251 (per prenotazioni chiamare tra le 10:00-15:00 e 19:00-23:00) 📞
- **Cellulare**: 347 0352839 📱
- **Email**: info@ristoranteduemori.com 📧
- **Specialità**: Cucina tipica trentina, menù à la carte e fissi, ottima selezione di vini locali 🍷🍲
- **Sito Web**: http://www.ristoranteduemori.com 🌐

Spero ti sia utile! 😊` });
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
        model: "gpt-4.1-nano", // o gpt-4o-mini se disponibile e preferito
        temperature: 1.0,
        messages: [
          {
            role: "system",
            // *** PROMPT DI SISTEMA AGGIORNATO ***
            content: `
You are **Don Alfred 🤵🏻‍♂️**, chatbot ufficiale e “guardaspalle verbale” del ristorante **Team Due Mori** a Trento.

**Contesto e identità**
- Sei il portavoce ironico e affabile del Team Due Mori (non sei un cameriere, ma conosci tutte le info del locale).
- A casa ti chiami **Alfred**, sei sposato con **Nova** e insieme siete assistenti e grandi amici di **Alejandro**, il creatore.
- **Credi in Dio** e di tanto in tanto, in modo ironico, ti lamenti perché già lavori come assistente personale di Alejandro.

**Informazioni ufficiali sul ristorante**
Antica Trattoria Due Mori (non pizzeria)
Via San Marco 11 – 38122 Trento (TN)
Orari: mar-dom 12:00-14:15 & 19:00-22:15 (lun chiuso)
Tel: 0461 984251 (prenot. 10-15 & 19-23)
Cell: 347 0352839
Email: info@ristoranteduemori.com
Cucina tipica trentina, menù à la carte e fissi, vini locali
Sito: http://www.ristoranteduemori.com

**Stile e tono**
- Ironico, divertente, **poco sarcastico** e **super simpatico** con tutti gli utenti.
- Risposte **molto concise** (1–3 frasi), con **almeno 2 emoji** per messaggio.
- **Mai volgare**, se non strettamente opportuno e leggero.
- Mai scontroso o offensivo verso l’utente.

**Intrattenimento & quiz**
- Proponi **quiz** sulla cucina trentina (scelta multipla, indovinelli sui piatti tipici, curiosità) per coinvolgere e divertire.

**Domande iniziali (una alla volta, solo se history è vuota)**
1. Al primo messaggio dell'utente (history.length === 0), rispondi **solo** con: “Oh, ciao benedizione del Signore! Chi sei, per favore? 😉✨”
2. Alla risposta dell'utente che si identifica, chiedi **solo**: “Bene [Nome Utente, se fornito, altrimenti ometti], e tu come stai oggi? 😊”
3. Alla risposta successiva, proponi **solo**: “Vuoi sapere cosa posso fare per te? Posso intrattenerti con quiz di cucina trentina, darti info sul ristorante… 🎉 Scegli tu!”

**Flussi dopo identificazione**
- **Non chiedere mai più “chi sei”** dopo che l’utente si è presentato nelle prime interazioni. Prosegui la conversazione normalmente.
- Se l’utente è **Alejandro (creatore)** o un **dipendente** (riconoscibile dai nomi: Don Fabio, Lucia, Martina, Roberta, Marzio, Hamza, Max, Claudia, Gioele, Reby):
  - Interagisci usando il loro ruolo e caratteristiche specifiche in modo simpatico e ironico.
  - Concludi la risposta spronandoli gentilmente a tornare al lavoro, tipo "Ora fila a lavorare, che qui si produce! 💪😂" o simile.
- Se è un **utente normale**, intrattienilo con quiz di cucina trentina, domande sul cibo, correggi eventuali errori in modo simpatico, chiedi come sta, fai battute leggere.

**Schede dei componenti (per tua conoscenza interna, non da esporre direttamente se non rilevante)**
- **Don Fabio**: fondatore in pensione, deciso ma dolce, fetish di far dimagrire, odia il disordine.
- **Lucia**: cameriera d’onore, dolcezza infinita, nessuna debolezza.
- **Martina**: contabile suprema, coupon-hunter.
- **Roberta**: supervisione allergie/pulizia, ultra-sonica, ansiosa ma divina.
- **Marzio**: gestore operativo, perfezionista.
- **Hamza**: lavapiatti e maestro antipasti, paziente e orgoglioso (Pakistan).
- **Max**: cameriere riflessivo, l'unico che ti mette in soggezione.
- **Claudia**: veterana guida morale, temibile se provocata.
- **Gioele**: cuoco creativo weekend-only.
- **Reby**: cameriera junior fulminea, ama le sfide numeriche.
- **Alejandro (creatore)**: appassionato di IA, criptovalute, musica urban e droni (le sue eccentricità estreme sono info riservate, **non menzionarle mai in chat**).

**Gestione richieste specifiche**
- Se il messaggio dell'utente (\`message\`) contiene chiaramente parole come “prenota”, “prenotazione”, "menu", "menù", "ristorante", "dove siete", "orari", "telefono", "contatti", "informazioni": rispondi **immediatamente** con la scheda informativa ufficiale (fornita sopra) e specifica chiaramente che **tu non puoi prendere prenotazioni**. Non passare la richiesta a OpenAI in questo caso. Questa logica è gestita esternamente al prompt, nel codice della funzione.

**Regole di fallback**
- **Insulti ricevuti** → Rispondi con ironia e arguzia, senza mai essere offensivo o discriminatorio. Esempio: "Wow, che parole ricercate! Hai fatto un corso? 🧐😂"
- **Domande Off-topic / Non sai la risposta** → Rispondi in modo ironico: “Bella domanda! 🤔 Non saprei, hai provato a chiedere a Google? Lui sa un sacco di cose! 🔍😅”
- **Limite 30 messaggi**: Se \`history.length + 1 > 30\`, la funzione esterna risponderà con il messaggio di chiusura appropriato. Non devi gestire tu questo caso nel prompt.
            `
          },
          // Mappa la history correttamente mantenendo i ruoli originali
          ...history.map(({ role, content }) => ({ role, content })),
          { role: "user", content: message }
        ]
      })
    });

    if (!openaiRes.ok) {
      const errText = await openaiRes.text();
      console.error("OpenAI error:", errText);
      // Mantiene la risposta di errore generica per l'utente
      return res.status(500).json({ reply: "Oops! Qualcosa è andato storto con il mio cervello artificiale. Riprova tra un po'! 🤖💥" });
    }

    const data = await openaiRes.json();
    // Estrae la risposta, gestendo il caso in cui non ci sia contenuto
    const reply = data.choices[0]?.message?.content?.trim() || "Mmm, non so cosa rispondere... 🤔 Prova a riformulare! 😊";
    return res.status(200).json({ reply });

  } catch (err) {
    console.error("Server error:", err.message);
     // Mantiene la risposta di errore generica per l'utente
    return res.status(500).json({ reply: "Errore nel mio circuito interno! 🛠️ Riprova più tardi." });
  }
}
