async function fetchDocuments() {
    const docContainer = document.querySelector('.card-container');
    await fetch('http://localhost:3012/api/alldocs')
        .then(res => res.json())
        .then(data => {
            data.forEach(doc => {
                const card = document.createElement('div');
                card.className = 'doc-card';
                card.innerHTML = `
                    <div class="card-hor-align">
                        <div class="img-container">
                            <img src="../img/lost-man-welcome-unsplash.jpg" alt="Vorschau">
                        </div>
                        <div class="text-content">
                            <h2 class="doc-heading">${doc.title}</h2>
                            <p class="doc-intro">${doc.content}</p>
                        </div>
                        <div class="doc-add-fav">+</div>
                    </div>
                `;
                docContainer.appendChild(card);
            });
        })  // Geändert von ) zu })
        .catch(error => console.error('Fehler beim Abrufen der Dokumente:', error));
}

document.addEventListener('DOMContentLoaded', () => {
    fetchDocuments();
});