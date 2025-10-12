// filepath: c:\Users\HP\Desktop\6. Semester\Praxisprojekt-SS-2025\praxisprojekt-ss-2025\Prototyp\frontend\scripts\main.js
document.addEventListener('DOMContentLoaded', function () {
    const menuToggleBtn = document.getElementById('menu-toggle-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuToggleBtn && mobileMenu) {
        menuToggleBtn.addEventListener('click',  () => {
            mobileMenu.classList.toggle('open');

            if (mobileMenu.classList.contains('open')) {
                menuToggleBtn.textContent = 'X';
            } else {
                menuToggleBtn.textContent = '☰';
            }
        });
    }

    const mobileLangMenu = document.querySelector("#mobile-menu .header-language");

    if (mobileLangMenu) {
        mobileLangMenu.addEventListener("click", (e) => {
            if (e.target.closest("a") && e.target.closest(".language-options")) {
                return;
            }

            e.preventDefault();
            e.stopPropagation();

            mobileLangMenu.classList.toggle("active");
        });
    }
});