document.addEventListener("DOMContentLoaded", () => {
    const welcomeSection = document.querySelector(".welcome-section");
    if(welcomeSection) console.log("Welcome section found!");

    // Funktion zum durchgehenden Ändern der Bilder

    function changeImages() {
        setInterval(() => {
            const images = [
                './img/group-welcome-unsplash.jpg',
                './img/lost-man-welcome-unsplash.jpg',
                './img/mountain-welcome-unsplash.jpg'
            ];
            const randomIndex = Math.floor(Math.random() * images.length);
            welcomeSection.style.backgroundImage = `url('${images[randomIndex]}')`;
            welcomeSection.style.backgroundSize = "cover";
            welcomeSection.style.backgroundPosition = "center";
            welcomeSection.style.transition = "all 2s ease";
        }, 7000); // Alle 5 Sekunden
    }

    changeImages();

    const cityName = new URL(window.location.href).searchParams.get('cty').toUpperCase()
    document.querySelector('title').innerHTML = 'WHERE NEXT - ' + cityName
    document.querySelector('.city-h2').innerHTML = cityName
});