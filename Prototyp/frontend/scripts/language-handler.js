document.addEventListener('DOMContentLoaded', () => {

    let langTAG = document.querySelector('.header-language')
    const docTAG = document.querySelector('.header-documents')
    const accTag = document.querySelector('.header-account')
    const urlParams = new URLSearchParams(window.location.search)
    const lang = urlParams.get('lang')

    fetch('../jsons/languages.json')
        .then(data => data.json())
        .then(data => {
            
        })
})