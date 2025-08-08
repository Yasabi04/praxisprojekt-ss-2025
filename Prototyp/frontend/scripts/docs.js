const savedDocs = []

document.addEventListener("DOMContentLoaded", () => {
      const allCards = document.querySelectorAll(".doc-card");
      const addFav = document.querySelectorAll(".doc-add-fav");
      allCards.forEach(card => {
            card.addEventListener("click", () => {
                  const dataId = card.getAttribute("data-id");
                  window.location.href = `${window.location.origin}${window.location.pathname}/${dataId}`;
            });
      });

      addFav.forEach((icon) => {
            icon.addEventListener("click", (e) => {
                  e.stopPropagation();

                  const cardElement = icon.closest("[data-id]");
                  const dataId = cardElement
                        ? cardElement.getAttribute("data-id")
                        : "Döp döp";
                  // Fetch mit POST und data-id an User table
                  alert("Gespeichert wurde Card mit ID: " + dataId);
            });
      });

      handleDocuments()
});

async function handleDocuments() {
    const docContainer = document.querySelector('.card-container');
    

    try {
        console.log('Fetching documents from API...');
        const response = await fetch('http://mivs06.gm.fh-koeln.de:3500/api/alldocs');
        
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
            
            try {
                const errorData = await response.json();
                errorMessage += ` - ${errorData.error || errorData.message || 'Unbekannter Server-Fehler'}`;
            } catch (jsonError) {
                const errorText = await response.text();
                errorMessage += ` - ${errorText}`;
            }
            
            throw new Error(errorMessage);
        }
        
        const data = await response.json();
        console.log('API Response:', data);
        
        // KORRIGIERT: Verschiedene Response-Formate handhaben
        let documents;
        
        if (Array.isArray(data)) {
            documents = data;
        } else if (data && data.documents && Array.isArray(data.documents)) {
            documents = data.documents;
        } else if (data && data.data && Array.isArray(data.data)) {
            documents = data.data;
        } else {
            console.warn('Unexpected response format:', data);
            documents = [];
        }
        
        console.log('Processing documents:', documents.length);
        
        // Container leeren
        docContainer.innerHTML = '';
        
        if (documents.length === 0) {
            docContainer.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: var(--font-color);">
                    <h3>Keine Dokumente gefunden</h3>
                    <p>Es sind noch keine Dokumente vorhanden.</p>
                </div>
            `;
            return;
        }
        
        // KORRIGIERT: Dokumente erstellen
        documents.forEach(doc => {
            const card = document.createElement('div');
            card.className = 'doc-card';
            card.setAttribute('data-id', doc.docId || doc.id || 'unknown');
            
            card.innerHTML = `
                <div class="card-hor-align">
                    <div class="img-container">
                        <img src="../images/documents+stamp-unsplash.jpg" alt="Vorschau">
                    </div>
                    <div class="text-content">
                        <h2 class="doc-heading">${doc.title || 'Kein Titel'}</h2>
                        <p class="doc-intro">${(doc.content || 'Keine Beschreibung').substring(0, 100)}...</p>
                        <small>${doc.createdAt ? new Date(doc.createdAt).toLocaleDateString().slice(4) : 'Unbekannt'}</small>
                    </div>
                    <div class="doc-add-fav">+</div>
                </div>
            `;
            
            docContainer.appendChild(card);
        });
        
        // KORRIGIERT: Event Listener NACH dem Hinzufügen der Elemente
        document.querySelectorAll('.doc-card').forEach(card => {
            card.addEventListener('click', (e) => {
                // Nicht weiterleiten wenn Favoriten-Button geklickt wurde
                if (e.target.classList.contains('doc-add-fav')) {
                    return;
                }
                
                const docId = card.getAttribute('data-id');
                console.log('Navigating to document:', docId);
                window.location.href = `./desk.html?pdf=${docId}`;
            });
        });
        
        // Event Listener für Favoriten-Buttons
        document.querySelectorAll('.doc-add-fav').forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation(); 
                const docId = button.closest('.doc-card').getAttribute('data-id');
        
                if(savedDocs.includes(docId)){
                    const index = savedDocs.indexOf(docId);
                    savedDocs.splice(index, 1);
            
                    // KORRIGIERT: Visuelles Feedback - Favorit entfernt
                    button.textContent = '+';
                    button.style.backgroundColor = '';
                    button.style.color = '';
            
                    console.log('Removed from favorites:', docId);
                    console.log('Current savedDocs:', savedDocs);
                    localStorage.setItem('savedDocs', savedDocs)
                }
                else {
                    // Element hinzufügen
                    savedDocs.push(docId);
            
                    // KORRIGIERT: Visuelles Feedback - Favorit hinzugefügt
                    button.textContent = '✓';
                    button.style.backgroundColor = 'white';
            
                    console.log('Added to favorites:', docId);
                    console.log('Current savedDocs:', savedDocs);
                    localStorage.setItem('savedDocs', savedDocs)
                }
            });
        });
        
        console.log('Documents loaded successfully');
        
    } catch (error) {
        console.error('Fehler beim Abrufen der Dokumente:', error);
        
        docContainer.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: var(--font-color);">
                <h3>Dokumente konnten nicht geladen werden</h3>
                <p><strong>Error:</strong> ${error.message}</p>
                <button onclick="handleDocuments()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    Erneut versuchen
                </button>
            </div>
        `;
    }
}


function saveDocuments(){

}