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

    // ...existing code...
    // Event Listener für das Sprachmenü im mobilen Header
    const mobileLangMenu = document.querySelector("#mobile-menu .header-language");

    if (mobileLangMenu) {
        mobileLangMenu.addEventListener("click", (e) => {
            // Wenn auf einen Link in den Optionen geklickt wird, tue nichts (Standardverhalten des Links ausführen).
            if (e.target.closest("a") && e.target.closest(".language-options")) {
                return;
            }

            // Verhindert, dass der Klick auf den Container eine Aktion auslöst, die nicht gewollt ist.
            e.preventDefault();
            e.stopPropagation();

            // Schaltet die 'active'-Klasse um, um das Dropdown anzuzeigen/auszublenden.
            mobileLangMenu.classList.toggle("active");
        });
    }
});