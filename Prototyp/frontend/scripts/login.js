document.addEventListener('DOMContentLoaded', () => {
    const button = document.querySelector('.login-btn')

    button.addEventListener('click', e => {

        const user = document.querySelector('.user').value;
        const pass = document.querySelector('.pass').value;
        e.preventDefault()

        if(user === "admin" && pass === "admin1"){
            window.location.href = 'upload.html'
        }
    })
})