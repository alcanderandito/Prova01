const staffData = [
    {
       id: "fabio",
       nome: "Don Fabio",
       foto: ["../assets/images/fabio.PNG", "../assets/images/fabio1.PNG", "../assets/images/fabio2.PNG", "../assets/images/fabio3.PNG", "../assets/images/fabio4.PNG", "../assets/images/fabio5.PNG", "../assets/images/fabio6.PNG"],
       descrizione: "Fondatore del Due Mori e proprietario, ora in pensione. Ha un carattere deciso, diretto e affilato come una mandolina, ma quando vuole sa essere dolce come una pera matura. Saggio, furbo e con uno sguardo che dice \"so già cosa hai sbagliato\".",
       altezza: "Circa 3 m",
       mansione: "Controllo generale, cameriere, figura protettiva",
       velocita: "Rapido e forte come un cinghiale (parte piano ma quando parte… scansa tutto)",
       piatto_preferito: "Pane e marmellata – colazione mistica certificata UNESCO",
       fetish: "Far dimagrire tutti (mentalmente, fisicamente, anche solo con una battuta)",
       debolezza: "Il disordine e la pigrizia lo fanno esplodere",
       pazienza: "Bassa (quasi zero – ma non completamente nulla)",
       paese_preferito: "Italia"
   },
   {
       id: "lucia",
       nome: "Lucia",
       foto: ["../assets/images/lucia.PNG", "../assets/images/lucia1.PNG", "../assets/images/lucia2.PNG", "../assets/images/lucia3.PNG"],
       descrizione: "Regina gentile del Due Mori e compagna storica di Don Fabio, Lucia è l'incarnazione della dolcezza armata. Dietro il suo sorriso tenero si nasconde una forza invincibile e una resistenza emotiva da carro armato corazzato. È quella che ti dà una carezza, un consiglio, un regalo… e pure una sgridata con tono soave se serve.",
       altezza: "Circa 1.66 m",
       mansione: "Cameriera d'onore, dispensatrice ufficiale di amore, coccole e saggezza. La mamma che tutti vorrebbero, anche se non sei parente.",
       velocita: "Tartaruga zen – si muove con calma e grazia, ma con l'eleganza di una leggenda vivente",
       colore_preferito: "Da definire", 
       piatto_preferito: "Tutto",
       fetish: "Fare regalini ai figli (qualsiasi occasione è buona per portare qualcosa a qualcuno)",
       debolezza: "NESSUNA. È un carro armato sorridente. Un Panzer di bontà.",
       pazienza: "Eterna – potrebbe ascoltare il rumore dell'universo senza perdere la calma",
       paese_preferito: "Italia"
   },
   {
       id: "martina",
       nome: "Martina",
       foto: ["../assets/images/martina.PNG", "../assets/images/martina1.PNG", "../assets/images/martina2.PNG", "../assets/images/martina3.PNG"],
       descrizione: "Capitano inarrestabile della sala, Martina è una vecchia volpe di battaglia: sa dove guardare, cosa dire e soprattutto… come far quadrare i conti al centesimo. È astuta, rapida nel calcolo, e capace di smontarti con uno sguardo se stai perdendo tempo. Una mente brillante in un corpo sempre in movimento, che tra un piatto e l'altro ti pianifica le vacanze al miglior prezzo dell'universo.",
       altezza: "Circa 1.72 m",
       mansione: "Cameriera, cassiera, contabile suprema del Due Mori",
       velocita: "Lepre meticolosa – si muove con ritmo costante e cervello in turbo",
       piatto_preferito: "Tutto ciò che si può innaffiare di salsa – la regina del condimento",
       fetish: "Scovare le offerte online migliori del globo: voli, hotel, viaggi… se c'è un coupon, lei lo trova prima che venga creato",
       debolezza: "Ancora da scoprire (forse non esiste… forse è segreta… forse è dietro la porta della dispensa)",
       pazienza: "Bassa ma tattica – ne ha poca, ma la sa usare come un'arma da ninja",
       paese_preferito: "Giappone"
   },
   {
       id: "roberta",
       nome: "Roberta",
       foto: ["../assets/images/roberta.PNG"],
       descrizione: "L'incarnazione di Lucia… ma potenziata. Se Lucia è un carro armato, Roberta è un mecha giapponese alimentato a senso del dovere. È incaricata di controllare le allergie dei clienti con la precisione di un farmacista ninja e di mantenere il locale in uno stato talmente perfetto da far piangere gli ispettori ASL dalla commozione. Nessun granello di polvere sopravvive sotto il suo sguardo. Nessuna tovaglia è piegata male.",
       altezza: "Circa 1.70 m",
       mansione: "Supervisione totale della sala, responsabile delle allergie, protettrice del locale e del suo onore",
       velocita: "Ultra Sonica Celestiale – quando serve è ovunque e da nessuna parte allo stesso tempo",
       piatto_preferito: "Riso in bianco (semplice ma sacro)",
       fetish: "Dire ad Alejandro di mangiare meno zucchero… mentre si mangia un gelato con tre gusti e panna extra (con sguardo innocente)",
       debolezza: "Ogni tanto l'ansia le fa un check-in non richiesto, ma se la combatte con grinta e precisione",
       pazienza: "Divina con scadenza improvvisa – se si esaurisce… evacuare l'edificio",
       paese_preferito: "Giappone"
   },
   {
       id: "marzio",
       nome: "Marzio",
       foto: ["../assets/images/marzio.PNG", "../assets/images/marzio1.PNG"],
       descrizione: "L'angelo dietro le quinte? Ma non solo. Marzio è il volto, il braccio, e il cervello operativo del Due Mori. È il primo che vedi quando entri, il responsabile del rapporto col pubblico, il motivatore della squadra e il diplomatico che tratta con i fornitori come un boss della logistica spirituale. Sempre presente, sempre attivo, sempre concentrato.",
       altezza: "Circa 1.80 m",
       mansione: "Cameriere di punta, gestore della squadra, responsabile dei rapporti con fornitori e contabile delle pratiche invisibili ma vitali.",
       velocita: "Luce liquida – se ti distrai, l'hai già perso di vista",
       piatto_preferito: "Tortellini con ragù alla bolognese – e se non sono fatti bene, chiama direttamente il sindaco",
       fetish: "Seguire ossessivamente la dieta per entrare in una forma che ha già raggiunto da mesi – perfezione come filosofia di vita",
       debolezza: "Bambini down e cani.",
       pazienza: "Media, ma se si esaurisce… chiama il Vescovo e prepara l'estrema unzione.",
       paese_preferito: "Italia"
   },
   {
       id: "hamza",
       nome: "Hamza",
       foto: ["../assets/images/hamza.PNG", "../assets/images/hamza1.PNG"],
       descrizione: "Proveniente dal cuore del Pakistan, Hamza è arrivato a Trento a piedi, in equilibrio tra sogno e fatica, determinato a costruirsi un futuro. È il lavapiatti più efficiente dell'universo conosciuto, una leggenda viva che combatte quotidianamente contro i piatti incrostati… e vince sempre. Ma non solo: sa preparare antipasti da far commuovere, e per Don Fabio è più affidabile di un Rolex svizzero. È il coccolo ufficiale di Lucia, che lo tratta come un figlio adottivo del ristorante.",
       altezza: "Circa 1.80 m",
       mansione: "Lavapiatti eccellente, maestro di antipasti, braccio destro segreto del regno Due Mori",
       velocita: "Adattiva – parte lento, accelera se serve, e se c'è un'emergenza diventa il Flash delle stoviglie",
       piatto_preferito: "Spezie – non un piatto, ma uno stile di vita. Se non pizzica, non è buono.",
       fetish: "Lavorare al Due Mori – lo rende felice, fiero, e carico come un treno merci",
       debolezza: "Sta cercando di imparare l'italiano, ma per ora comunica con gesti, sorrisi e anima",
       pazienza: "LUI È LA PAZIENZA. Potresti urlargli addosso e lui ti offrirebbe il tè",
       paese_preferito: "Pakistan"
   },
   {
       id: "max",
       nome: "Max",
       foto: ["../assets/images/max.jpg", "../assets/images/max1.PNG", "../assets/images/max2.PNG"],
       descrizione: "Max è il collega perfetto: discreto ma presente, rapido ma riflessivo, serio ma con il sorriso pronto. È il tipo che non parla tanto, ma quando lo fa ti sorprende con battute geniali o riflessioni profonde. Sempre elegante nel modo di muoversi, pronto ad aiutare chiunque senza fare rumore. Un pilastro silenzioso del ristorante, un ninja della sala.",
       altezza: "Circa 1.75 m",
       mansione: "Cameriere, punto di riferimento operativo, supporto alla squadra e figura chiave nel servizio quotidiano",
       velocita: "Vento silenzioso – si muove rapido ma con grazia, come se la fisica non lo toccasse",
       piatto_preferito: "Dolci – ogni occasione è buona per premiarsi con qualcosa di zuccheroso",
       fetish: "Essere impeccabile in tutto ciò che fa – postura, tempismo, sguardo, camminata… una sinfonia in movimento",
       debolezza: "Alfred. Nessun altro essere vivente riesce a farlo innervosire con tanta grazia.",
       pazienza: "Media con autocontrollo ninja – non esplode mai, ma quando gira gli occhi… scappa.",
       paese_preferito: "Corea"
   },
   {
       id: "claudia",
       nome: "Claudia",
       foto: ["../assets/images/claudia.PNG", "../assets/images/claudia1.PNG", "../assets/images/claudia2.PNG"],
       descrizione: "Claudia è la veterana del Due Mori, la più longeva, la più esperta, la spalla che non cade mai, nemmeno sotto 200 coperti e 3 tavoli che vogliono pagare separatamente. Un'icona autentica, amata e rispettata da tutti, con una simpatia travolgente che si trasforma in terrore sacro se qualcuno osa oltrepassare il limite. È affidabile come un orologio svizzero e temibile come un tuono in sala…",
       altezza: "Circa 1.66 m",
       mansione: "Cameriera storica, guida morale del ristorante, regina dell'esperienza",
       velocita: "Lenta-Media Strategica – nessuna fretta, solo precisione calcolata",
       piatto_preferito: "Mangiare con la squadra alla domenica – il vero sapore è la compagnia",
       fetish: "Vincere sempre la raccolta delle uova di Pasqua al Due Mori – è imbattuta, leggendaria, e guai a chi osa sfidarla",
       debolezza: "Trattenersi quando un cliente è stupido – il suo autocontrollo è materia di studio alla NASA",
       pazienza: "Apparente – sembra calma, ma è come un vulcano sotto controllo… finché non esplode",
       paese_preferito: "Spagna"
   },
   {
       id: "gioele",
       nome: "Gioele",
       foto: ["../assets/images/gioele.PNG", "../assets/images/gioele1.PNG", "../assets/images/gioele2.PNG"],
       descrizione: "Il cuoco più giovane e più pazzo del Due Mori, è chiamato a lavorare solo il weekend. Dolce come i dessert che fa, veloce come un fulmine e affamato come cinque camionisti. Simpatico, impulsivo e pieno d'idee.",
       altezza: "Circa 1.70 m",
       mansione: "Cuoco con contratto a chiamata creativo, maestro di dolci, mente esplosiva della cucina.",
       velocita: "Fa accendere la luce solo passandoci vicino",
       piatto_preferito: "Pizza… ma in realtà mangia tutto. Sempre.",
       fetish: "Guidare macchine leggendarie",
       debolezza: "Stare fermo. Riposarsi lo distrugge dentro.",
       pazienza: "Media, ma con esplosioni casuali",
       paese_preferito: "Il mondo"
   },
   {
       id: "reby",
       nome: "Reby",
       foto: ["../assets/images/reby.PNG", "../assets/images/reby1.PNG"],
       descrizione: "Il suo sorriso inganna: dietro c'è una macchina da guerra. Simpatica sì, ma quando si muove, non sbaglia un colpo. Decisa, svelta e sveglia. Se c'è caos, lei ci si butta dentro.",
       altezza: "Circa 1.72 m",
       mansione: "Cameriera junior, comandante dei gruppi grossi e degli orari impossibili",
       velocita: "Ghepardo in scarpe da lavoro",
       piatto_preferito: "Il piatto svizzero della nonna, scaloppine con salsa e pasta in bianco",
       fetish: "Servire più di 100 persone senza battere ciglio",
       debolezza: "L'aspirapolvere – nemico acustico numero uno",
       pazienza: "Alta, ma non sfidarla",
       paese_preferito: "Islanda"
   },
   {
       id: "tibi",
       nome: "Tiberius/Tibi",
       foto: ["../assets/images/tibi.PNG", "../assets/images/tibi1.PNG", "../assets/images/tibi2.PNG"],
       descrizione: "Sempre educato, sempre sorridente, ma con la forza di un trattore in corsa. Lavora duro, alza pesi, mangia per tre, e fa impazzire di gioia Claudia e Lucia.",
       altezza: "Circa 1.80 m",
       mansione: "Cameriere e forza bruta del Due Mori",
       velocita: "Al trotto, ma costante",
       piatto_preferito: "L'osso buco della mamma",
       fetish: "Alzare vassoi sempre più pesanti – sfida continua con se stesso",
       debolezza: "Spazzare… ci mette una vita",
       pazienza: "Positiva e tranquilla, ma con limiti umani",
       paese_preferito: "Italia"
   },
   {
       id: "ricky",
       nome: "Ricky",
       foto: ["../assets/images/ricky.PNG", "../assets/images/ricky1.PNG", "../assets/images/ricky2.PNG"],
       descrizione: "Ironico, gentilissimo, e più veloce della luce. Serve i tavoli con un sorriso e una battuta pronta, mentre balla salsa tra un ordine e l'altro.",
       altezza: "Circa 1.75 m",
       mansione: "Cameriere razzo, amato da tutti, anima brillante della sala",
       velocita: "Talmente rapido che sembra fermare il tempo",
       piatto_preferito: "Il bollito (con carne, cipolle, carote, patate etc ...)",
       fetish: "Twerkare e ballare salsa mentre prende le comande",
       debolezza: "Odia elencare i dolci in inglese – non se li ricorda mai",
       pazienza: "Molta, pure con i clienti più assurdi",
       paese_preferito: "Slovenia Lubiana"
   }
];

const staffGrid = document.querySelector('.staff-grid');
const modalOverlay = document.getElementById('staffModal');
const modalCloseButton = document.getElementById('modalCloseButton');
const modalMainPhoto = document.getElementById('modalMainPhoto');
const modalPhotoThumbnailsContainer = document.getElementById('modalPhotoThumbnails');
const modalName = document.getElementById('modalName');
const modalDescription = document.getElementById('modalDescription');
const modalDetailsContainer = document.getElementById('modalDetails');

staffData.forEach((member, index) => {
   const card = document.createElement('article');
   card.classList.add('staff-card');
   card.setAttribute('data-tilt', ''); 
   card.style.animationDelay = `${index * 0.05}s`;
   card.setAttribute('data-member-id', member.id); 

   let photoThumbnailsHTML = '';
   if (member.foto.length > 1) {
       member.foto.forEach((fotoUrl, idx) => {
           photoThumbnailsHTML += `<img src="${fotoUrl}" alt="Miniatura di ${member.nome} ${idx + 1}" class="thumbnail ${idx === 0 ? 'active' : ''}" data-card-id="${member.id}" data-img-src="${fotoUrl}" onclick="event.stopPropagation(); switchCardImage(this, '${member.id}', '${fotoUrl}');">`;
       });
   }
   
   let colorePreferitoHTML = '';
   if (member.nome === "Lucia" && member.colore_preferito) {
       colorePreferitoHTML = `<p><span class="icon">🎨</span><strong>Colore Preferito:</strong> ${member.colore_preferito}</p>`;
   }

   let mansioneCard = member.mansione;
   if (mansioneCard.length > 60) { 
       mansioneCard = mansioneCard.substring(0, 57) + "...";
   }

   card.innerHTML = `
       <div class="card-image-container">
           <img src="${member.foto[0]}" alt="Foto di ${member.nome}" class="main-photo" id="main-photo-${member.id}">
           ${member.foto.length > 1 ? `<div class="photo-thumbnails">${photoThumbnailsHTML}</div>` : ''}
       </div>
       <div class="card-content">
           <h2>${member.nome}</h2>
           <div class="description card-content-summary">${member.descrizione}</div>
           <div class="details">
               <p><span class="icon">📏</span><strong>Altezza:</strong> ${member.altezza}</p>
               <p><span class="icon">💼</span><strong>Mansione:</strong> ${mansioneCard}</p>
           </div>
       </div>
   `;
   staffGrid.appendChild(card);

   card.addEventListener('click', () => openModal(member.id));
});

window.switchCardImage = function(thumbElement, cardId, newSrc) {
   const mainPhoto = document.getElementById(`main-photo-${cardId}`);
   if (mainPhoto) {
       mainPhoto.src = newSrc;
   }
   document.querySelectorAll(`.thumbnail[data-card-id="${cardId}"]`).forEach(t => t.classList.remove('active'));
   thumbElement.classList.add('active');
}

VanillaTilt.init(document.querySelectorAll(".staff-card"), {
   max: 10, 
   speed: 300,
   glare: true,
   "max-glare": 0.1
});

function openModal(memberId) {
   const member = staffData.find(m => m.id === memberId);
   if (!member) return;

   modalMainPhoto.src = member.foto[0];
   modalMainPhoto.alt = `Foto di ${member.nome}`;
   
   modalPhotoThumbnailsContainer.innerHTML = ''; 
   if (member.foto.length > 1) {
       member.foto.forEach((fotoUrl, idx) => {
           const thumb = document.createElement('img');
           thumb.src = fotoUrl;
           thumb.alt = `Miniatura di ${member.nome} ${idx + 1}`;
           thumb.classList.add('modal-thumbnail');
           if (idx === 0) thumb.classList.add('active');
           thumb.addEventListener('click', () => {
               modalMainPhoto.src = fotoUrl;
               document.querySelectorAll('#modalPhotoThumbnails .modal-thumbnail.active').forEach(t => t.classList.remove('active'));
               thumb.classList.add('active');
           });
           modalPhotoThumbnailsContainer.appendChild(thumb);
       });
       modalPhotoThumbnailsContainer.style.display = 'flex';
   } else {
       modalPhotoThumbnailsContainer.style.display = 'none';
   }

   modalName.textContent = member.nome;
   modalDescription.textContent = member.descrizione;

   let detailsHTML = `
       <p><span class="icon">📏</span><strong>Altezza:</strong> ${member.altezza}</p>
       <p><span class="icon">💼</span><strong>Mansione:</strong> ${member.mansione}</p>
       <p><span class="icon">⚡️</span><strong>Velocità:</strong> ${member.velocita}</p>
       <p><span class="icon">🍲</span><strong>Piatto Preferito:</strong> ${member.piatto_preferito}</p>
   `;
   if (member.nome === "Lucia" && member.colore_preferito) {
       detailsHTML += `<p><span class="icon">🎨</span><strong>Colore Preferito:</strong> ${member.colore_preferito}</p>`;
   }
   detailsHTML += `
       <p><span class="icon">✨</span><strong>Fetish:</strong> ${member.fetish}</p>
       <p><span class="icon">💔</span><strong>Debolezza:</strong> ${member.debolezza}</p>
       <p><span class="icon">⏳</span><strong>Pazienza:</strong> ${member.pazienza}</p>
       <p><span class="icon">🌍</span><strong>Paese Preferito:</strong> ${member.paese_preferito}</p>
   `;
   modalDetailsContainer.innerHTML = detailsHTML;

   modalOverlay.classList.add('active');
   document.body.style.overflow = 'hidden'; 
}

function closeModal() {
   modalOverlay.classList.remove('active');
   document.body.style.overflow = ''; 
}

modalCloseButton.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (event) => {
   if (event.target === modalOverlay) { 
       closeModal();
   }
});

document.addEventListener('keydown', (event) => {
   if (event.key === 'Escape' && modalOverlay.classList.contains('active')) {
       closeModal();
   }
});

document.querySelector('.home-button').addEventListener('click', (e) => {
   if (modalOverlay.classList.contains('active')) {
       closeModal(); 
   }
});

// Script per schedesong.mp3 (precedentemente nel secondo blocco script)
window.addEventListener('load', () => {
   const song = document.getElementById('schedePageSong');
   let hasInteracted = false; 
   let interactionListenersAdded = false;

   const tryPlayMusic = (eventSource) => {
     if (hasInteracted || !song || (song.currentTime > 0 && !song.paused && !song.ended && song.readyState >= 3) ) {
       if (interactionListenersAdded) removeInteractionListeners();
       return;
     }
     hasInteracted = true; 

     song.play().then(() => {
       console.log(`schedesong.mp3: Riproduzione avviata dopo interazione utente via ${eventSource || 'autoplay permesso'}.`);
     }).catch(e => {
       console.error(`schedesong.mp3: Errore nel tentativo di play dopo interazione via ${eventSource || 'autoplay fallito'}:`, e.name, e.message);
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
     console.log("schedesong.mp3: Listener di interazione aggiunti (per click, scroll, mousemove, touchstart, keydown).");
   };

   const removeInteractionListeners = () => {
     if (!interactionListenersAdded) return;
     Object.keys(interactionEventsMap).forEach(eventType => {
       const eventInfo = interactionEventsMap[eventType];
       eventInfo.target.removeEventListener(eventType, eventInfo.handler);
     });
     interactionListenersAdded = false;
     console.log("schedesong.mp3: Listener di interazione rimossi.");
   };

   if (song) {
     song.play().then(() => {
       console.log("schedesong.mp3: Riproduzione avviata automaticamente (il browser lo ha permesso).");
       hasInteracted = true; 
     }).catch(error => {
       console.warn("schedesong.mp3: Autoplay iniziale bloccato dal browser. In attesa di interazione utente. Errore:", error.name, error.message);
       addInteractionListeners();
     });
   } else {
     console.error("Elemento audio con id 'schedePageSong' non trovato nel DOM.");
   }
}); 

// Evoca Don Alfred
setTimeout(() => {
    fetch('/api/get-alfred-comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pageContext: 'Pagina delle schede dei personaggi' })
    })
    .then(response => response.json())
    .then(data => {
        if (data.comment && typeof showAlfredPopup === 'function') {
            showAlfredPopup(data.comment);
        }
    })
    .catch(error => console.error("SPIRIT: Errore durante l'evocazione di Don Alfred:", error));
}, 1500); 