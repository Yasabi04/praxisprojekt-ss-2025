document.addEventListener('DOMContentLoaded', () => {
    const allCards = document.querySelectorAll('.doc-card')
    const addFav = document.querySelectorAll('.doc-add-fav')
    allCards.forEach(card => {
        card.addEventListener('click', () => {
            window.location.href = window.location.href + '/' + card.getAttribute('data-id')
        })
    })

    addFav.forEach(icon => {
        icon.addEventListener('click', e => {
            e.stopPropagation()

            const cardElement = icon.closest('[data-id]')
            const dataId = cardElement ? cardElement.getAttribute('data-id'): 'Döp döp'
            // Fetch mit POST und data-id an User table
            alert('Gespeichert wurde Card mit ID: ' + dataId)
        })
    })
})