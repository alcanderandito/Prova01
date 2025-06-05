document.addEventListener('DOMContentLoaded', () => {
    // Intersection Observer per animazioni allo scroll
    const sections = document.querySelectorAll('.info-section');
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 // Attiva quando il 10% della sezione è visibile
    };

    const observer = new IntersectionObserver((entries, observerInstance) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // observerInstance.unobserve(entry.target); // Per animare solo una volta
            } else {
                // Opzionale: per ri-animare se si esce e rientra (solo desktop per performance)
                // if (window.innerWidth >= 1024 && entry.target.classList.contains('visible')) {
                //    entry.target.classList.remove('visible');
                // }
            }
        });
    }, observerOptions);
    sections.forEach(section => observer.observe(section));

    // Generazione Particelle Sfondo (leggero)
    const particleContainer = document.getElementById('backgroundParticlesContainer');
    if (particleContainer) {
        const colors = ['var(--accent-blue)', 'var(--accent-teal)', 'var(--accent-pink)', 'var(--accent-yellow)'];
        for (let i = 0; i < 30; i++) { // Numero di particelle
            const p = document.createElement('div');
            p.classList.add('particle');
            const size = Math.random() * 3 + 1; // Dimensione tra 1px e 4px
            p.style.width = `${size}px`;
            p.style.height = `${size}px`;
            p.style.left = `${Math.random() * 100}%`;
            p.style.top = `${Math.random() * 100}%`;
            p.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            p.style.animationDelay = `${Math.random() * 20}s`; // Ritardo casuale
            p.style.animationDuration = `${15 + Math.random() * 10}s`; // Durata casuale
            particleContainer.appendChild(p);
        }
    }
});

// Script per infosong.mp3 (precedentemente nel secondo blocco script)
window.addEventListener('load', () => {
    const song = document.getElementById('infoPageSong');
    let hasInteracted = false; 
    let interactionListenersAdded = false;

    const tryPlayMusic = (eventSource) => {
      if (hasInteracted || !song || (song.currentTime > 0 && !song.paused && !song.ended && song.readyState >= 3) ) {
        if (interactionListenersAdded) removeInteractionListeners();
        return;
      }
      hasInteracted = true; 

      song.play().then(() => {
        console.log(`infosong.mp3: Riproduzione avviata dopo interazione utente via ${eventSource || 'autoplay permesso'}.`);
      }).catch(e => {
        console.error(`infosong.mp3: Errore nel tentativo di play dopo interazione via ${eventSource || 'autoplay fallito'}:`, e.name, e.message);
        hasInteracted = false; 
      }).finally(() => {
         if (interactionListenersAdded) removeInteractionListeners();
      });
    };

    const interactionEventsMap = {
      'click': { target: document.body, handler: () => tryPlayMusic('click') },
      'scroll': { target: window, handler: () => tryPlayMusic('scroll') },
      'mousemove': { target: document.body, handler: () => tryPlayMusic('mousemove') },
      'touchstart': { target: document.body, handler: () => tryPlayMusic('touchstart') },
      'keydown': { target: window, handler: () => tryPlayMusic('keydown') }
    };
    
    const addInteractionListeners = () => {
      if (interactionListenersAdded) return;
      Object.keys(interactionEventsMap).forEach(eventType => {
        const eventInfo = interactionEventsMap[eventType];
        eventInfo.target.addEventListener(eventType, eventInfo.handler, { once: true });
      });
      interactionListenersAdded = true;
      console.log("infosong.mp3: Listener di interazione aggiunti (per click, scroll, mousemove, touchstart, keydown).");
    };

    const removeInteractionListeners = () => {
      if (!interactionListenersAdded) return;
      Object.keys(interactionEventsMap).forEach(eventType => {
        const eventInfo = interactionEventsMap[eventType];
        eventInfo.target.removeEventListener(eventType, eventInfo.handler);
      });
      interactionListenersAdded = false;
      console.log("infosong.mp3: Listener di interazione rimossi.");
    };

    if (song) {
      song.play().then(() => {
        console.log("infosong.mp3: Riproduzione avviata automaticamente (il browser lo ha permesso).");
        hasInteracted = true; 
      }).catch(error => {
        console.warn("infosong.mp3: Autoplay iniziale bloccato dal browser. In attesa di interazione utente. Errore:", error.name, error.message);
        addInteractionListeners();
      });
    } else {
      console.error("Elemento audio con id 'infoPageSong' non trovato nel DOM.");
    }
}); 