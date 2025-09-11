async function handleDocuments() {
    const docContainer = document.querySelector('.card-container');
    await fetch('http://localhost:3012/api/alldocs')
        .then(res => res.json())
        .then(data => {
            data.forEach(doc => {
                const card = document.createElement('div');
                card.className = 'doc-card';
                card.setAttribute('data-id', doc.docId);
                card.innerHTML = `
                    <div class="card-hor-align">
                        <div class="img-container">
                            <img src="../img/lost-man-welcome-unsplash.jpg" alt="Vorschau">
                        </div>
                        <div class="text-content">
                            <h2 class="doc-heading">${doc.title}</h2>
                            <p class="doc-intro">${doc.content}</p>
                        </div>
                        <div class="doc-download">+</div>
                    </div>
                `;
                docContainer.appendChild(card);
            });
        })
        .catch(error => console.error('Fehler beim Abrufen der Dokumente:', error));

        document.querySelectorAll('.doc-card').forEach(card => {
            card.addEventListener('click', () => {
                window.location.href = window.location.href + '/' + card.getAttribute('data-id');
            });
        })

        document.querySelectorAll('.doc-download').forEach(b => {
            b.addEventListener('click', e => {
                e.stopPropagation(); 
                const docId = b.closest('.doc-card').getAttribute('data-id');
                alert(`Dokument ${docId} zu Favoriten hinzugefügt!`);
            });
        });
}


document.addEventListener('DOMContentLoaded', () => {
    handleDocuments();
});