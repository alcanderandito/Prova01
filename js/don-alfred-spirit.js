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