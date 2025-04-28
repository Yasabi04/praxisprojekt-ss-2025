document.addEventListener("DOMContentLoaded", () => {

    const cityName = new URL(window.location.href).searchParams.get('cty').toUpperCase()
    const cards = document.querySelectorAll(".city-card");
    cards.forEach((card) => {
        card.addEventListener("click", () => {
            window.location.href = `/application.html/?cty=${cityName}`;
        });
    });
})