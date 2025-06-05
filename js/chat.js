const messagesContainer = document.getElementById('messages');
const userInput = document.getElementById('message-input');
const chatForm = document.getElementById('input-bar');
const sendButton = document.getElementById('send-button');

let conversationHistoryForAI = [];
let fullReadableLog = "";

// Funzione per auto-ridimensionare la textarea
function autoResizeTextarea() {
    userInput.style.height = 'auto'; // Resetta l'altezza
    let newHeight = userInput.scrollHeight;

    // Se l'altezza del contenuto supera l'altezza di una riga
    if (newHeight > userInput.clientHeight) {
        // Limita l'altezza massima a 120px
        newHeight = Math.min(newHeight, 120);
        userInput.style.height = `${newHeight}px`;
    }

    // Aggiusta il padding-bottom di #messages per far spazio all'input più alto
    const inputBarHeight = chatForm.offsetHeight;
    messagesContainer.style.paddingBottom = `${inputBarHeight}px`;
}


// Event listener per l'input per ridimensionare la textarea
userInput.addEventListener('input', autoResizeTextarea);


// Funzione per gestire l'invio con "Invio" e "Shift+Invio"
userInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault(); // Previene l'inserimento di una nuova riga
        chatForm.requestSubmit(); // Invia il form
    }
});


function scrollToBottom(behavior = 'auto') {
  requestAnimationFrame(() => {
    if (messagesContainer) {
      messagesContainer.scrollTo({ top: messagesContainer.scrollHeight, behavior: behavior });
    }
  });
}

// Bottone "Scroll to bottom"
const scrollToBottomBtn = document.createElement('button');
scrollToBottomBtn.innerHTML = '&#8595;'; // Freccia verso il basso
scrollToBottomBtn.className = 'scroll-to-bottom';
document.body.appendChild(scrollToBottomBtn);

scrollToBottomBtn.addEventListener('click', () => {
    scrollToBottom('smooth');
});

messagesContainer.addEventListener('scroll', () => {
    // Mostra il bottone se l'utente ha scrollato in su di un po'
    if (messagesContainer.scrollHeight - messagesContainer.scrollTop > messagesContainer.clientHeight + 100) {
        scrollToBottomBtn.style.display = 'block';
    } else {
        scrollToBottomBtn.style.display = 'none';
    }
});



function addMessageToDisplay(who, text, roleForAI) {
    const time = new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
    const msgDiv = document.createElement('div');
    msgDiv.className = `msg ${who}`;
    const bubDiv = document.createElement('div');
    bubDiv.className = 'bub';
    bubDiv.textContent = text;
    const timeSpan = document.createElement('span');
    timeSpan.className = 'tim';
    timeSpan.textContent = time;

    // Bottone per copiare il testo del messaggio
    const copyBtn = document.createElement('button');
    copyBtn.innerHTML = '&#128203;'; // Icona di copia
    copyBtn.className = 'copy-btn';
    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(text).then(() => {
            // Feedback visivo (opzionale)
            copyBtn.innerHTML = '&#10003;'; // Checkmark
            setTimeout(() => { copyBtn.innerHTML = '&#128203;'; }, 1000);
        });
    });

    bubDiv.appendChild(timeSpan);
    bubDiv.appendChild(copyBtn); // Aggiunge il bottone di copia al fumetto
    msgDiv.appendChild(bubDiv);

    if (messagesContainer) {
        messagesContainer.appendChild(msgDiv);
        scrollToBottom('auto');
    } else {
        console.error("Cannot add message, #messages element not found!");
    }

    const prefix = (roleForAI === 'user') ? 'Utente' : 'IA';
    fullReadableLog += `${prefix}: ${text}\n`;

    if (roleForAI) {
        conversationHistoryForAI.push({ role: roleForAI, content: text });
    }
}

chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userText = userInput.value.trim();
    if (!userText) return;

    // Svuoto l'input subito dopo aver catturato il testo
    userInput.value = '';

    userInput.disabled = true;
    sendButton.disabled = true;
    userInput.placeholder = "Invio in corso...";
    userInput.style.height = 'auto'; // Resetta l'altezza dopo l'invio

    addMessageToDisplay('me', userText, 'user');
 
    try {
        const response = await fetch('../api/send-message.js', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: conversationHistoryForAI,
                maxTokens: 150,
                temperature: 0.7,
                topP: 1.0
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Errore sconosciuto dal server.' }));
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message}`);
        }

        const data = await response.json();
        const aiText = data.message;

        addMessageToDisplay('you', aiText, 'assistant');

    } catch (error) {
        console.error('Errore nella chiamata API:', error);
        addMessageToDisplay('you', `Don Alfred ha riscontrato un errore e non può risponderti. Riprova più tardi. Dettagli: ${error.message}`, null);
        const lastMessage = messagesContainer.lastElementChild;
        if (lastMessage) {
            lastMessage.classList.add('error');
        }
    } finally {
        userInput.disabled = false;
        sendButton.disabled = false;
        userInput.placeholder = "Scrivi un messaggio a Don Alfred…";
        userInput.focus();
    }
});

 