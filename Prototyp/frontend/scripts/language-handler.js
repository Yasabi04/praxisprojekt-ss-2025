document.addEventListener("DOMContentLoaded", () => {
    let languageData = null;
    window.currentLanguage = "en"; 
    const supportedLanguages = {
        de: "Deutsch",
        en: "English",
        fr: "Français",
        ar: "العربية",
        tr: "Türkçe",
        fa: "فارسی",
    };

    const setText = (selector, text) => {
        const element = document.querySelector(selector);
        if (element && text) element.innerHTML = text;
    };

    const setAttribute = (selector, attribute, value) => {
        const element = document.querySelector(selector);
        if (element && value) element.setAttribute(attribute, value);
    };

    const createLanguageOptions = () => {
        const languageOptionContainers = document.querySelectorAll(".language-options");
        languageOptionContainers.forEach(container => {
            container.innerHTML = '';
            for (const [code, name] of Object.entries(supportedLanguages)) {
                const li = document.createElement("li");
                const a = document.createElement("a");
                a.href = `?lang=${code}`;
                a.textContent = name;
                a.dataset.lang = code;
                li.appendChild(a);
                container.appendChild(li);
            }
        });
    };

    const loadLanguageData = async () => {
        if (!languageData) {
            try {
                const response = await fetch("../jsons/languages.json");
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                languageData = await response.json();
            } catch (error) {
                console.error("Fehler beim Laden der Sprachdatei:", error);
            }
        }
        return languageData;
    };

    const applyLanguage = async (lang) => {
        window.currentLanguage = lang;
        const data = await loadLanguageData();
        if (!data) return;

        const content = data[lang] || data.english; 

        document.querySelectorAll(".header-language-word").forEach(el => el.innerHTML = content.header[0]);
        document.querySelectorAll(".header-documents-link").forEach(el => el.innerHTML = content.header[1]);
        document.querySelectorAll(".header-account-link").forEach(el => el.innerHTML = content.header[2]);

        setText(".welcome-heading", content.heading);
        setText(".documents-heading", content.documentsHeading);
        setText(".documents-hero-text", content.documentsText);

        setText(".note-heading", content.noteHeading);
        setText(".note-message", content.noteText);
        setAttribute("#user-input", "placeholder", content.deskInputPlaceholder);
        
        const deskModes = document.querySelectorAll("#mode-select .option div");
        if (deskModes.length > 0 && content.deskModes) {
            deskModes.forEach((mode, i) => {
                if(content.deskModes[i]) mode.innerHTML = content.deskModes[i];
            });
        }

        const footerLinks = document.querySelectorAll(".footer-links li");
        footerLinks.forEach((li, i) => {
            const child = li.querySelector('a') || li;
            if (content.footer[i]) child.innerHTML = content.footer[i];
        });

        document.documentElement.dir = (lang === "ar" || lang === "fa") ? "rtl" : "ltr";

        const url = new URL(window.location);
        url.searchParams.set("lang", lang);
        window.history.pushState({}, "", url);
        localStorage.setItem("selectedLanguage", lang);

        if (document.querySelector('.card-container')) {
            translateDocs(lang);
        }
    };

    const setupEventListeners = () => {
        document.body.addEventListener("click", (e) => {
            if (e.target.matches(".language-options a")) {
                e.preventDefault();
                const language = e.target.dataset.lang;
                if (language) applyLanguage(language);
            }
        });
    };

    const init = () => {
        const urlLang = new URLSearchParams(window.location.search).get("lang");
        const storedLang = localStorage.getItem("selectedLanguage");
        const browserLang = (navigator.language || navigator.userLanguage).slice(0, 2).toLowerCase();
        
        let initialLang = "en";
        if (urlLang && supportedLanguages[urlLang]) initialLang = urlLang;
        else if (storedLang && supportedLanguages[storedLang]) initialLang = storedLang;
        else if (supportedLanguages[browserLang]) initialLang = browserLang;

        createLanguageOptions();
        setupEventListeners();
        applyLanguage(initialLang);
    };

    init();
});

async function translateDocs(targetLang) {
    const elementsToTranslate = document.querySelectorAll(".doc-heading[data-original-text], .doc-intro[data-original-text]");
    if (elementsToTranslate.length === 0) return;

    if (targetLang === 'de') {
        elementsToTranslate.forEach(el => {
            el.textContent = el.dataset.originalText;
        });
        return;
    }

    for (const element of elementsToTranslate) {
        const originalText = element.dataset.originalText;
        if (!originalText?.trim()) continue;

        try {
            const response = await fetch("http://localhost:3500/api/translate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    text: originalText,
                    target_lang: targetLang.toUpperCase(),
                }),
            });

            if (!response.ok) {
                console.error("Translation API Error:", response.status, await response.text());
                continue;
            }

            const data = await response.json();
            if (data?.success && data.translation) {
                element.textContent = data.translation;
            }
        } catch (error) {
            console.error("Failed to fetch translation:", error);
        }
    }
}
