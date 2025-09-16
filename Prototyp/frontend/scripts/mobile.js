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
});