/**
 * Inizializza l'audio di una pagina, facendolo partire alla prima interazione dell'utente.
 * @param {string} audioId L'ID dell'elemento <audio> da far partire.
 */
function initializePageAudio(audioId) {
    const song = document.getElementById(audioId);
    if (!song) {
        console.error(`Audio element with id '${audioId}' not found.`);
        return;
    }

    let hasInteracted = false;
    const interactionEvents = ['mousemove', 'touchstart', 'click', 'scroll', 'keydown'];

    const playAudio = (interactionType) => {
        if (hasInteracted) return;
        hasInteracted = true;

        song.play().then(() => {
            console.log(`Audio '${audioId}' started playing due to user ${interactionType}.`);
        }).catch(error => {
            console.warn(`Audio playback for '${audioId}' was prevented.`, error);
        });

        // Rimuove tutti i listener dopo la prima interazione per pulizia
        interactionEvents.forEach(event => {
            document.removeEventListener(event, handleInteraction);
        });
    };

    const handleInteraction = (event) => {
        playAudio(event.type);
    };

    // Prova un autoplay silente, se fallisce (come quasi sempre), attende l'interazione
    song.play().then(() => {
        console.log(`Audio '${audioId}' started automatically.`);
        hasInteracted = true;
    }).catch(() => {
        console.log(`Audio '${audioId}' waiting for user interaction.`);
        interactionEvents.forEach(event => {
            document.addEventListener(event, handleInteraction, { once: true, passive: true });
        });
    });
}

/**
 * Mostra un pop-up con un messaggio di Don Alfred nell'angolo in alto a destra.
 * Il pop-up svanisce automaticamente dopo un tempo prestabilito.
 * @param {string} message Il messaggio da mostrare.
 * @param {number} duration La durata in millisecondi prima che il pop-up scompaia. Default: 5000ms.
 */
function showAlfredPopup(message, duration = 5000) {
    // Controlla se esiste già un contenitore per i pop-up, altrimenti lo crea.
    let container = document.getElementById('don-alfred-popup-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'don-alfred-popup-container';
        document.body.appendChild(container);
    }

    // Crea l'elemento del pop-up
    const popup = document.createElement('div');
    popup.className = 'don-alfred-popup';
    
    // Aggiunge l'icona e il testo
    popup.innerHTML = `<strong>🤵🏻‍♂️ Don Alfred:</strong> ${message}`;

    // Aggiunge il pop-up al contenitore
    container.appendChild(popup);

    // Forza un reflow per attivare l'animazione di entrata
    void popup.offsetWidth;
    popup.classList.add('show');

    // Imposta un timer per rimuovere il pop-up
    setTimeout(() => {
        popup.classList.remove('show');
        // Rimuove l'elemento dal DOM dopo la fine dell'animazione di uscita
        popup.addEventListener('transitionend', () => {
            if (popup.parentElement) {
                popup.parentElement.removeChild(popup);
            }
        });
    }, duration);
} 