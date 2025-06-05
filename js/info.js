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

    // Avvia la logica per la musica della pagina
    initializePageAudio('infoPageSong');

    // Evoca Don Alfred
    setTimeout(() => {
        fetch('/api/get-alfred-comment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pageContext: 'Pagina di Informazioni sul Progetto' })
        })
        .then(response => response.json())
        .then(data => {
            if (data.comment && typeof showAlfredPopup === 'function') {
                showAlfredPopup(data.comment);
            }
        })
        .catch(error => console.error("SPIRIT: Errore durante l'evocazione di Don Alfred:", error));
    }, 1500);
});

// Il vecchio script per 'infosong.mp3' viene rimosso 