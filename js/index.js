console.log("SCRIPT: Inizio esecuzione blocco script.");

const ready = (callback) => {
    console.log("SCRIPT: Funzione ready definita.");
    if (document.readyState !== "loading") {
        console.log("SCRIPT: DOM già caricato, eseguo callback di ready.");
        callback();
    } else {
        console.log("SCRIPT: DOM non ancora caricato, aggiungo listener DOMContentLoaded.");
        document.addEventListener("DOMContentLoaded", () => {
            console.log("SCRIPT: Evento DOMContentLoaded scattato, eseguo callback di ready.");
            callback();
        });
    }
};

// ----- INIZIO SPOSTAMENTO FUNZIONE closePopup -----
// Funzione per chiudere una popup specifica
function closePopup(popupElement) {
    if (popupElement && popupElement.classList.contains('show')) { // Controlla se è visibile prima di tentare di chiudere
        popupElement.classList.remove('show');
        // Dopo la transizione, imposta display: none per rimuoverla dal flusso
        setTimeout(() => {
            if (!popupElement.classList.contains('show')) { // Ricontrolla nel caso sia stata riaperta velocemente
                popupElement.style.display = 'none';
            }
        }, 300); // Corrisponde alla durata della transizione CSS
    }
}
// ----- FINE SPOSTAMENTO FUNZIONE closePopup -----

// --- GESTIONE MENU ---
const menuButton = document.getElementById("menuButton");
const menuContent = document.getElementById("menuContent");
const pageOverlay = document.getElementById("pageOverlay");

// Queste funzioni DEVONO essere definite nello scope globale
// affinché onclick="toggleSubmenu(...)" in menu.html possa trovarle.

function closeAllSubmenus(container, exceptThisTrigger = null) {
    console.log("MENU: closeAllSubmenus chiamata.");
    if (!container) return;
    container.querySelectorAll('.submenu.open').forEach(submenu => {
        const trigger = submenu.previousElementSibling; 
        if (!exceptThisTrigger || (trigger && trigger !== exceptThisTrigger)) {
            submenu.classList.remove('open');
            if (trigger && trigger.classList.contains('submenu-trigger')) {
                trigger.classList.remove('open'); 
                trigger.setAttribute('aria-expanded', 'false');
            }
        }
    });
}

function toggleSubmenu(event, triggerElement) {
    console.log("MENU: toggleSubmenu chiamata per", triggerElement);
    const submenu = triggerElement.nextElementSibling;
    if (submenu && submenu.classList.contains('submenu')) {
        const isCurrentlyOpen = submenu.classList.contains('open');
        submenu.classList.toggle('open', !isCurrentlyOpen);
        triggerElement.classList.toggle('open', !isCurrentlyOpen);
        triggerElement.setAttribute('aria-expanded', String(!isCurrentlyOpen));
    } else {
        console.warn("MENU: Sottomenu non trovato come fratello successivo per", triggerElement, ". Fratello successivo:", submenu);
    }
}

function toggleMenu() {
    console.log("MENU: toggleMenu chiamata.");
    const isCurrentlyExpanded = menuButton.getAttribute("aria-expanded") === "true";
    
    // ----- INIZIO MODIFICA PER CHIUDERE POPUP -----
    if (!isCurrentlyExpanded) { // Se il menu si sta per APRIRE
        console.log("POPUP: Il menu si sta aprendo, chiudo le popup.");
        const pChat = document.getElementById('popupDonAlfredChat');
        const pMenu = document.getElementById('popupDiscoverMenu');
        closePopup(pChat);
        closePopup(pMenu);
    }
    // ----- FINE MODIFICA PER CHIUDERE POPUP -----

    menuButton.setAttribute("aria-expanded", String(!isCurrentlyExpanded));
    menuContent.classList.toggle("show", !isCurrentlyExpanded);
    pageOverlay.classList.toggle("active", !isCurrentlyExpanded);
    document.body.classList.toggle("menu-open", !isCurrentlyExpanded);

    if (!isCurrentlyExpanded && menuContent.querySelector('.menu-loading-placeholder')) {
        fetch('html/menu.html')
            .then(response => {
                if (!response.ok) { throw new Error(`Network response not ok: ${response.status}`); }
                return response.text();
            })
            .then(data => {
                menuContent.innerHTML = data.trim() === '' ? `<p class="menu-message">Menu vuoto.</p>` : data;
            })
            .catch(error => {
                menuContent.innerHTML = `<p class="menu-message" style="color: var(--color-text-error);">Errore caricamento menu.</p>`;
                console.error('MENU: Errore fetch menu.html:', error);
            });
    } else if (isCurrentlyExpanded) {
        closeAllSubmenus(menuContent);
    }
}

if (menuButton) {
    menuButton.addEventListener('click', toggleMenu);
} else {
    console.error("MENU: Bottone menu non trovato!");
}

if (pageOverlay) {
    pageOverlay.addEventListener('click', () => {
        if (menuButton && menuButton.getAttribute("aria-expanded") === "true") {
            toggleMenu();
        }
    });
}
window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuButton && menuButton.getAttribute("aria-expanded") === "true") {
        toggleMenu();
    }
});
console.log("SCRIPT: Gestori eventi menu definiti.");

// --- SFONDO DINAMICO ---
function initDynamicBackground() {
    console.log("SFONDO: initDynamicBackground chiamata.");
    const container = document.getElementById('dynamic-background-container');
    if (!container) { console.error("SFONDO: #dynamic-background-container non trovato!"); return; }
    const images = ['assets/images/home.PNG', 'assets/images/home1.PNG', 'assets/images/home2.PNG', 'assets/images/home3.PNG', 'assets/images/home4.PNG', 'assets/images/home5.PNG', 'assets/images/home6.PNG', 'assets/images/home7.PNG'];
    if (images.length === 0) { console.warn("SFONDO: Nessuna immagine definita."); return; }
    let currentIndex = -1; const slideDuration = 7000; const animDurationCSS = 20;
    images.forEach((imgName, i) => { const slide = document.createElement('div'); slide.classList.add('background-slide'); try { new URL(imgName, window.location.href); slide.style.backgroundImage = `url('${imgName}')`; } catch (e) { console.error(`SFONDO: Nome immagine non valido "${imgName}".`, e); return; } if (i % 2 !== 0) slide.classList.add('even-slide-kenburns'); container.appendChild(slide); });
    const slides = container.querySelectorAll('.background-slide');
    if (slides.length === 0) { console.error("SFONDO: Nessuna slide creata."); return; }
    function nextSlide() { if (currentIndex >= 0 && slides[currentIndex]) { slides[currentIndex].classList.remove('active'); slides[currentIndex].style.animation = 'none'; void slides[currentIndex].offsetHeight; } currentIndex = (currentIndex + 1) % slides.length; if (slides[currentIndex]) { slides[currentIndex].classList.add('active'); const animName = slides[currentIndex].classList.contains('even-slide-kenburns') ? 'kenburns-alt' : 'kenburns'; slides[currentIndex].style.animation = `${animName} ${animDurationCSS}s infinite alternate ease-in-out`; } }
    nextSlide(); setInterval(nextSlide, slideDuration);
    console.log("SFONDO: Inizializzazione completata.");
}

// --- EFFETTO PARTICELLE LUMINOSE ---
function initParticleEffect() {
    console.log("PARTICLES: initParticleEffect chiamata.");
    const canvas = document.getElementById('particle-effect-canvas');
    if (!canvas) { console.error("PARTICLES: #particle-effect-canvas NON TROVATO!"); return; }
    const ctx = canvas.getContext('2d');
    let particlesArray;

    function setCanvasSize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    setCanvasSize();

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width; this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() * 0.8 - 0.4); this.speedY = (Math.random() * 0.8 - 0.4);
            this.baseOpacity = Math.random() * 0.4 + 0.2; this.opacity = this.baseOpacity;
            this.opacitySpeed = (Math.random() - 0.5) * 0.01;
        }
        update() {
            this.x += this.speedX; this.y += this.speedY;
            this.opacity += this.opacitySpeed;
            if (this.opacity > this.baseOpacity + 0.2 || this.opacity < this.baseOpacity - 0.2) { this.opacitySpeed *= -1; }
            if (this.opacity < 0) this.opacity = 0; if (this.opacity > 1) this.opacity = 1;
            if (this.x < -this.size) this.x = canvas.width + this.size; if (this.x > canvas.width + this.size) this.x = -this.size;
            if (this.y < -this.size) this.y = canvas.height + this.size; if (this.y > canvas.height + this.size) this.y = -this.size;
        }
        draw() {
            ctx.fillStyle = `rgba(255, 255, 230, ${this.opacity})`;
            ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill();
        }
    }
    function initParticles() {
        particlesArray = [];
        const numberOfParticles = Math.max(50, Math.floor((canvas.width * canvas.height) / 15000));
        console.log("PARTICLES: Creando", numberOfParticles, "particelle.");
        for (let i = 0; i < numberOfParticles; i++) { particlesArray.push(new Particle()); }
    }
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) { particlesArray[i].update(); particlesArray[i].draw(); }
        requestAnimationFrame(animateParticles);
    }
    initParticles(); animateParticles();
    console.log("PARTICLES: Animazione particelle avviata.");
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            console.log("PARTICLES: Finestra ridimensionata, riadatto canvas e particelle.");
            setCanvasSize(); initParticles();
        }, 250);
    });
    console.log("PARTICLES: Inizializzazione effetto particelle completata.");
}

// --- AUDIO PLAYER ---
function initAudioPlayer() {
    console.log("AUDIO: initAudioPlayer chiamata.");
    const song = document.getElementById('indexPageSong');
    if (!song) { console.error("AUDIO: #indexPageSong non trovato."); return; }
    let hasInteracted = false; let interactionListeners = [];
    const tryPlayMusic = (eventSource) => { if (hasInteracted || (song.currentTime > 0 && !song.paused)) { removeInteractionListeners(); return; } hasInteracted = true; song.play().then(() => { console.log(`AUDIO: Riproduzione avviata (${eventSource || 'autoplay'}).`); removeInteractionListeners(); }).catch(e => { console.warn(`AUDIO: Play fallito (${eventSource || 'autoplay'}): ${e.name} - ${e.message}.`); hasInteracted = false; }); };
    function addInteractionListener(target, eventType, handlerName) { const handler = () => tryPlayMusic(handlerName); target.addEventListener(eventType, handler, { once: true, passive: true }); interactionListeners.push({ target, eventType, handler }); }
    function removeInteractionListeners() { if (interactionListeners.length > 0) { interactionListeners.forEach(listener => { listener.target.removeEventListener(listener.eventType, listener.handler); }); interactionListeners = []; } }
    song.play().then(() => { console.log("AUDIO: Autoplay riuscito."); hasInteracted = true; }).catch(() => { addInteractionListener(document.body, 'click', 'click'); addInteractionListener(window, 'scroll', 'scroll'); addInteractionListener(document.body, 'touchstart', 'touchstart'); addInteractionListener(window, 'keydown', 'keydown'); });
    console.log("AUDIO: Inizializzazione completata.");
}

// --- ESECUZIONE SCRIPT AL CARICAMENTO DEL DOM ---
console.log("SCRIPT: Aggiungo listener per 'ready'.");
ready(() => {
    console.log("SCRIPT: Callback di 'ready' ESEGUITA. Avvio funzioni principali.");

    console.log("SCRIPT: Chiamata a initDynamicBackground...");
    if (typeof initDynamicBackground === 'function') initDynamicBackground(); else console.error("Errore: initDynamicBackground non è una funzione.");

    console.log("SCRIPT: Chiamata a initParticleEffect...");
    if (typeof initParticleEffect === 'function') initParticleEffect(); else console.error("Errore: initParticleEffect non è una funzione.");

    console.log("SCRIPT: Chiamata a initAudioPlayer...");
    if (typeof initAudioPlayer === 'function') initAudioPlayer(); else console.error("Errore: initAudioPlayer non è una funzione.");

    // ----- INIZIO NUOVO CODICE PER POPUP GUIDATE (CON MODIFICHE PER RESPONSIVE) -----
    console.log("POPUP: Inizializzazione popup guidate.");

    const popupChat = document.getElementById('popupDonAlfredChat');
    const popupMenu = document.getElementById('popupDiscoverMenu');
    const chatButtonContainer = document.getElementById('goChatContainer'); 
    const menuButtonTarget = document.getElementById('menuButton'); 

    const arrowSize = 12; 
    const generalOffset = 8; 
    const screenMargin = 15; 
    
    function resetArrowStyle(arrowElement) {
        arrowElement.style.display = 'block';
        arrowElement.style.left = 'auto';
        arrowElement.style.right = 'auto';
        arrowElement.style.top = 'auto';
        arrowElement.style.bottom = 'auto';
        arrowElement.style.transform = '';
        arrowElement.style.borderColor = '';
        arrowElement.style.borderWidth = '';
        arrowElement.className = 'popup-arrow'; 
    }


    if (popupChat && chatButtonContainer) {
        popupChat.querySelector('.popup-close-btn').addEventListener('click', () => closePopup(popupChat));
        
        setTimeout(() => {
            if (popupChat.classList.contains('show')) return; // Non mostrare se già visibile (o chiusa manualmente)
            console.log("POPUP: Mostro popup Don Alfred Chat.");
            const targetRect = chatButtonContainer.getBoundingClientRect();
            popupChat.style.display = 'block'; 
            const popupRect = popupChat.getBoundingClientRect();
            const arrowChat = popupChat.querySelector('.popup-arrow');
            resetArrowStyle(arrowChat); 
            arrowChat.classList.add('chat-arrow'); 

            let popupTop, popupLeft;
            const isMobile = window.innerWidth <= 768;

            if (isMobile) {
                popupTop = targetRect.top - popupRect.height - arrowSize - generalOffset;
                popupLeft = targetRect.left + (targetRect.width / 2) - (popupRect.width / 2);
                
                arrowChat.style.borderColor = '#ffffff transparent transparent transparent';
                arrowChat.style.borderWidth = `${arrowSize}px 10px 0 10px`;
                arrowChat.style.left = '50%';
                arrowChat.style.bottom = `-${arrowSize}px`;
                arrowChat.style.transform = 'translateX(-50%)';

                if (popupTop < screenMargin) {
                    popupTop = targetRect.bottom + arrowSize + generalOffset;
                    arrowChat.style.borderColor = 'transparent transparent #ffffff transparent';
                    arrowChat.style.borderWidth = `0 10px ${arrowSize}px 10px`;
                    arrowChat.style.left = '50%';
                    arrowChat.style.top = `-${arrowSize}px`;
                    arrowChat.style.transform = 'translateX(-50%)';
                }

            } else {
                popupTop = targetRect.top + (targetRect.height / 2) - (popupRect.height / 2);
                popupLeft = targetRect.left - popupRect.width - arrowSize - generalOffset;
                arrowChat.style.borderColor = 'transparent transparent transparent #ffffff';
                arrowChat.style.borderWidth = `10px 0 10px ${arrowSize}px`;
                arrowChat.style.right = `-${arrowSize}px`;
                arrowChat.style.top = '50%';
                arrowChat.style.transform = 'translateY(-50%)';

                if (popupLeft < screenMargin) {
                    popupLeft = targetRect.right + arrowSize + generalOffset;
                    arrowChat.style.borderColor = 'transparent #ffffff transparent transparent';
                    arrowChat.style.borderWidth = `10px ${arrowSize}px 10px 0`;
                    arrowChat.style.left = `-${arrowSize}px`; 
                    arrowChat.style.right = 'auto';
                    arrowChat.style.top = '50%';
                    arrowChat.style.transform = 'translateY(-50%)';
                }
            }

            if (popupLeft < screenMargin) popupLeft = screenMargin;
            if (popupLeft + popupRect.width > window.innerWidth - screenMargin) {
                popupLeft = window.innerWidth - screenMargin - popupRect.width;
            }
            if (popupTop < screenMargin) popupTop = screenMargin;
            if (popupTop + popupRect.height > window.innerHeight - screenMargin) {
                popupTop = window.innerHeight - screenMargin - popupRect.height;
                 if (!isMobile && (Math.abs(targetRect.top + (targetRect.height / 2) - (popupTop + popupRect.height / 2)) > popupRect.height / 2)) {
                    arrowChat.style.display = 'none'; 
                 }
            }
            if (popupRect.width < 50 || popupRect.height < 30) arrowChat.style.display = 'none';

            popupChat.style.top = popupTop + 'px';
            popupChat.style.left = popupLeft + 'px';
            
            void popupChat.offsetWidth; 
            popupChat.classList.add('show');

        }, 2000);
    } else {
        console.error("POPUP: Elementi per popup chat non trovati.", popupChat, chatButtonContainer);
    }

    if (popupMenu && menuButtonTarget) {
        popupMenu.querySelector('.popup-close-btn').addEventListener('click', () => closePopup(popupMenu));

        setTimeout(() => {
            if (popupMenu.classList.contains('show')) return; // Non mostrare se già visibile
            console.log("POPUP: Mostro popup Discover Menu.");
            const targetRect = menuButtonTarget.getBoundingClientRect();
            popupMenu.style.display = 'block'; 
            const popupRect = popupMenu.getBoundingClientRect();
            const arrowMenu = popupMenu.querySelector('.popup-arrow');
            resetArrowStyle(arrowMenu);
            arrowMenu.classList.add('menu-arrow');

            let popupTop, popupLeft;
            const isMobile = window.innerWidth <= 768;

            popupTop = targetRect.bottom + arrowSize + generalOffset;
            popupLeft = targetRect.left + (targetRect.width / 2) - (popupRect.width / 2); 
            
            arrowMenu.style.borderColor = 'transparent transparent #ffffff transparent';
            arrowMenu.style.borderWidth = `0 10px ${arrowSize}px 10px`;
            arrowMenu.style.top = `-${arrowSize}px`;
            arrowMenu.style.left = '50%'; 
            arrowMenu.style.transform = 'translateX(-50%)';

            if (isMobile) {
                if (popupTop + popupRect.height > window.innerHeight - screenMargin) {
                    popupTop = targetRect.top - popupRect.height - arrowSize - generalOffset;
                    arrowMenu.style.borderColor = '#ffffff transparent transparent transparent';
                    arrowMenu.style.borderWidth = `${arrowSize}px 10px 0 10px`;
                    arrowMenu.style.bottom = `-${arrowSize}px`;
                    arrowMenu.style.top = 'auto'; 
                }
            } else { 
                popupLeft = targetRect.left; 
                const arrowMenuLeftInPopup = (targetRect.left + targetRect.width/2) - popupLeft;
                arrowMenu.style.left = `${Math.max(10, Math.min(arrowMenuLeftInPopup, popupRect.width - 10))}px`;
            }

            if (popupLeft < screenMargin) popupLeft = screenMargin;
            if (popupLeft + popupRect.width > window.innerWidth - screenMargin) {
                popupLeft = window.innerWidth - screenMargin - popupRect.width;
            }
            if(!isMobile) {
                const arrowMenuLeftInPopup = (targetRect.left + targetRect.width/2) - popupLeft;
                arrowMenu.style.left = `${Math.max(10, Math.min(arrowMenuLeftInPopup, popupRect.width - 20))}px`; 
            }

            if (popupTop < screenMargin) { 
                popupTop = screenMargin;
                arrowMenu.style.display = 'none'; 
            }
            if (popupTop + popupRect.height > window.innerHeight - screenMargin) {
                popupTop = window.innerHeight - screenMargin - popupRect.height;
                arrowMenu.style.display = 'none'; 
            }
             if (popupRect.width < 50 || popupRect.height < 30) arrowMenu.style.display = 'none';

            popupMenu.style.top = popupTop + 'px';
            popupMenu.style.left = popupLeft + 'px';
            
            void popupMenu.offsetWidth; 
            popupMenu.classList.add('show');

        }, 4000); 
    } else {
        console.error("POPUP: Elementi per popup menu non trovati.", popupMenu, menuButtonTarget);
    }
    console.log("POPUP: Inizializzazione popup guidate completata.");
    // ----- FINE NUOVO CODICE PER POPUP GUIDATE -----

    console.log("SCRIPT: Tutte le funzioni principali sono state chiamate.");
});

console.log("SCRIPT: Fine blocco script."); 