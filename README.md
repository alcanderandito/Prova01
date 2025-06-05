# Team Due Mori

Questo è il repository per il progetto del Team Due Mori.

## Descrizione

Il progetto contiene una web application con diverse pagine, tra cui una chat interattiva con un assistente AI (simulato), una pagina di presentazione dei membri del team, e alcuni giochi.

## Struttura del Progetto

-   `/`: Contiene la pagina principale (`index.html`).
-   `api/`: Contiene le serverless functions per la logica di backend.
    -   `send-message.js`: Gestisce le richieste dalla chat e simula una risposta da un'AI.
-   `assets/`: Contiene risorse statiche come immagini e audio.
-   `css/`: Contiene i fogli di stile per le diverse pagine.
-   `html/`: Contiene le pagine HTML secondarie (chat, schede, giochi).
-   `js/`: Contiene i file JavaScript per la logica del frontend.

## Setup e Sviluppo Locale

Per eseguire il progetto in locale, è necessario un ambiente di sviluppo Node.js e un gestore di pacchetti come `npm` o `pnpm`.

### Prerequisiti

-   [Node.js](https://nodejs.org/) (versione 14.x o superiore)
-   `npm` (solitamente installato con Node.js)

### Installazione

1.  Clonare il repository e navigare nella cartella del progetto.

2.  Installare le dipendenze del progetto e la CLI di Vercel:
    ```bash
    npm install
    npm install -g vercel
    ```

### Configurazione Variabili d'Ambiente

Per far funzionare l'applicazione, è necessario configurare le seguenti variabili d'ambiente nel proprio account Vercel:

-   `OPENAI_API_KEY`: La tua chiave API per OpenAI.
-   `EMAIL_TO`: L'indirizzo email a cui verranno inviate le cronologie delle chat.
-   `EMAIL_USER`: Il tuo indirizzo email completo di Gmail (es. `nome.cognome@gmail.com`).
-   `EMAIL_PASS`: Una **App Password** generata dal tuo account Google. **Non usare la tua password normale.** Puoi crearne una seguendo questi passaggi:
    1.  Vai alla pagina di [gestione del tuo Account Google](https://myaccount.google.com/security).
    2.  Assicurati che la "Verifica in 2 passaggi" sia attiva.
    3.  Cerca la sezione "Password per le app".
    4.  Crea una nuova password per l'app (puoi chiamarla "Vercel Chat").
    5.  Copia la password di 16 caratteri generata e usala per questa variabile.

Inoltre, nel file `api/send-message.js`, assicurati di impostare correttamente l'indirizzo del tuo `TUO_HOST_SMTP`.

### Esecuzione

1.  Avviare il server di sviluppo di Vercel dalla root del progetto:
    ```bash
    vercel dev
    ```

2.  Il server si avvierà su una porta locale (solitamente `http://localhost:3000`). Apri questo indirizzo nel tuo browser per vedere l'applicazione in funzione.

## Funzionalità della Chat

La chat è stata recentemente aggiornata con le seguenti caratteristiche:

-   **Responsive Design**: Adattata per funzionare su dispositivi desktop e mobile.
-   **Input Dinamico**: L'area di testo si ridimensiona automaticamente con il contenuto.
-   **Copia Messaggi**: Un pulsante permette di copiare facilmente il testo di ogni messaggio.
-   **Scroll Automatico**: Un pulsante per tornare in fondo alla chat appare quando si scorre verso l'alto.
-   **Backend Simulata**: Utilizza una serverless function per simulare le risposte dell'AI, pronta per essere collegata a un vero servizio (es. OpenAI).
