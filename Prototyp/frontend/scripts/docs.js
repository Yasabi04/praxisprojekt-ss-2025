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
    await fetch('http://mivs06.gm.fh-koeln.de:7777/api/alldocs')
        .then(res => res.json())
        .then(data => {
            console.log(data)
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
                        <div class="doc-add-fav">+</div>
                    </div>
                `;
                card.addEventListener('click', () => {
                    // es soll auf /docs.html/:data-id weitergeleitet werden
                    window.location.href = `./desk.html?pdf=${card.getAttribute('data-id')}`
                })
                docContainer.appendChild(card);
            });
        })
        .catch(error => console.error('Fehler beim Abrufen der Dokumente:', error));

        document.querySelectorAll('.doc-add-fav').forEach(b => {
            b.addEventListener('click', e => {
                e.stopPropagation(); 
                const docId = b.closest('.doc-card').getAttribute('data-id');
                alert(`Dokument ${docId} zu Favoriten hinzugefügt!`);
            });
        });
}