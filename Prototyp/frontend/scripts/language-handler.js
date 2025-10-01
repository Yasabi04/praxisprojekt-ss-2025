document.addEventListener("DOMContentLoaded", () => {
    if (getBrowserLanguage()) {
    }

    const elements = {
        lang: document.querySelector(".header-language-word"),
        docs: document.querySelector(".header-documents-link"),
        account: document.querySelector(".header-account-link"),
        heading: document.querySelector(".welcome-heading"),
        // Footer-Elemente hinzufügen
        footerSocials: document.querySelector(".socials-link"),
        footerImprint: document.querySelector(".imprint-link"),
        footerPrivacy: document.querySelector(".privacy-link"),
        footerTerms: document.querySelector(".terms-link"),
        footerContact: document.querySelector(".contact-link"),
        footerPartners: document.querySelector(".partners-link"),
    };

    let languageData = null; // Cache für JSON-Daten

    const setText = (element, text, fallback) =>
        element && (element.innerHTML = text ?? fallback);

    // JSON einmal laden und cachen
    const loadLanguageData = async () => {
        if (!languageData) {
            try {
                const response = await fetch("../jsons/languages.json");
                languageData = await response.json();
            } catch (error) {
                console.error("Fehler beim Laden der Sprachen:", error);
            }
        }
        return languageData;
    };

    const applyLanguage = async (lang) => {
        const data = await loadLanguageData();
        if (!data) return;

        switch (lang) {
            case "de":
                setText(elements.lang, data.german?.header?.[0], "SPRACHE");
                setText(elements.docs, data.german?.header?.[1], "DOKUMENTE");
                setText(elements.account, data.german?.header?.[2], "KONTO");
                setText(
                    elements.heading,
                    data.german?.heading,
                    "Durchsuche Dokumente"
                );
                // Footer noch hard coded, geht aber einfacher: Einmaliger Zugriff auf JSON und für jedes footer array element ein li erstellen.
                setText(
                    elements.footerSocials,
                    data.german?.footer?.[0],
                    "Socials"
                );
                setText(
                    elements.footerImprint,
                    data.german?.footer?.[1],
                    "Impressum"
                );
                setText(
                    elements.footerPrivacy,
                    data.german?.footer?.[2],
                    "Datenschutz"
                );
                setText(elements.footerTerms, data.german?.footer?.[3], "AGB");
                setText(
                    elements.footerContact,
                    data.german?.footer?.[4],
                    "Kontakt"
                );
                setText(
                    elements.footerPartners,
                    data.german?.footer?.[5],
                    "Unsere Partner"
                );

                document.documentElement.dir = "ltr";
                break;

            case "en":
                setText(elements.lang, data.english?.header?.[0], "LANGUAGE");
                setText(elements.docs, data.english?.header?.[1], "DOCUMENTS");
                setText(elements.account, data.english?.header?.[2], "ACCOUNT");
                setText(
                    elements.heading,
                    data.english?.heading,
                    "Browse the latest documents"
                );
                setText(
                    elements.footerSocials,
                    data.english?.footer?.[0],
                    "Socials"
                );
                setText(
                    elements.footerImprint,
                    data.english?.footer?.[1],
                    "Imprint"
                );
                setText(
                    elements.footerPrivacy,
                    data.english?.footer?.[2],
                    "Privacy Policy"
                );
                setText(
                    elements.footerTerms,
                    data.english?.footer?.[3],
                    "Terms"
                );
                setText(
                    elements.footerContact,
                    data.english?.footer?.[4],
                    "Contact"
                );
                setText(
                    elements.footerPartners,
                    data.english?.footer?.[5],
                    "Our Partners"
                );
                document.documentElement.dir = "ltr";
                break;

            case "fr":
                setText(elements.lang, data.french?.header?.[0], "LANGUE");
                setText(elements.docs, data.french?.header?.[1], "DOCUMENTS");
                setText(elements.account, data.french?.header?.[2], "COMPTE");
                setText(
                    elements.heading,
                    data.french?.heading,
                    "Parcourir les documents"
                );
                setText(
                    elements.footerSocials,
                    data.french?.footer?.[0],
                    "Réseaux sociaux"
                );
                setText(
                    elements.footerImprint,
                    data.french?.footer?.[1],
                    "Mentions légales"
                );
                setText(
                    elements.footerPrivacy,
                    data.french?.footer?.[2],
                    "Politique de confidentialité"
                );
                setText(elements.footerTerms, data.french?.footer?.[3], "CGU");
                setText(
                    elements.footerContact,
                    data.french?.footer?.[4],
                    "Contact"
                );
                setText(
                    elements.footerPartners,
                    data.french?.footer?.[5],
                    "Nos partenaires"
                );
                document.documentElement.dir = "ltr";
                break;

            case "ar":
                setText(elements.lang, data.arabic?.header?.[0], "اللغة");
                setText(elements.docs, data.arabic?.header?.[1], "الوثائق");
                setText(elements.account, data.arabic?.header?.[2], "الحساب");
                setText(elements.heading, data.arabic?.heading, "تصفح الوثائق");
                setText(
                    elements.footerSocials,
                    data.arabic?.footer?.[0],
                    "وسائل التواصل"
                );
                setText(
                    elements.footerImprint,
                    data.arabic?.footer?.[1],
                    "بيانات الموقع"
                );
                setText(
                    elements.footerPrivacy,
                    data.arabic?.footer?.[2],
                    "سياسة الخصوصية"
                );
                setText(
                    elements.footerTerms,
                    data.arabic?.footer?.[3],
                    "الشروط"
                );
                setText(
                    elements.footerContact,
                    data.arabic?.footer?.[4],
                    "اتصل بنا"
                );
                setText(
                    elements.footerPartners,
                    data.arabic?.footer?.[5],
                    "شركاؤنا"
                );
                document.documentElement.dir = "rtl";
                break;

            case "tr":
                setText(elements.lang, data.turkish?.header?.[0], "DIL");
                setText(elements.docs, data.turkish?.header?.[1], "BELGELER");
                setText(elements.account, data.turkish?.header?.[2], "HESAP");
                setText(
                    elements.heading,
                    data.turkish?.heading,
                    "Belgelere göz atın"
                );
                setText(
                    elements.footerSocials,
                    data.turkish?.footer?.[0],
                    "Sosyal medya"
                );
                setText(
                    elements.footerImprint,
                    data.turkish?.footer?.[1],
                    "Künye"
                );
                setText(
                    elements.footerPrivacy,
                    data.turkish?.footer?.[2],
                    "Gizlilik politikası"
                );
                setText(
                    elements.footerTerms,
                    data.turkish?.footer?.[3],
                    "Şartlar"
                );
                setText(
                    elements.footerContact,
                    data.turkish?.footer?.[4],
                    "İletişim"
                );
                setText(
                    elements.footerPartners,
                    data.turkish?.footer?.[5],
                    "Ortaklarımız"
                );
                document.documentElement.dir = "ltr";
                break;

            case "fa":
                setText(elements.lang, data.persian?.header?.[0], "زبان");
                setText(elements.docs, data.persian?.header?.[1], "اسناد");
                setText(
                    elements.account,
                    data.persian?.header?.[2],
                    "حساب کاربری"
                );
                setText(elements.heading, data.persian?.heading, "مرور اسناد");
                setText(
                    elements.footerSocials,
                    data.persian?.footer?.[0],
                    "شبکه‌های اجتماعی"
                );
                setText(
                    elements.footerImprint,
                    data.persian?.footer?.[1],
                    "اطلاعات سایت"
                );
                setText(
                    elements.footerPrivacy,
                    data.persian?.footer?.[2],
                    "سیاست حفظ حریم خصوصی"
                );
                setText(
                    elements.footerTerms,
                    data.persian?.footer?.[3],
                    "شرایط"
                );
                setText(
                    elements.footerContact,
                    data.persian?.footer?.[4],
                    "تماس با ما"
                );
                setText(
                    elements.footerPartners,
                    data.persian?.footer?.[5],
                    "شرکای ما"
                );
                document.documentElement.dir = "rtl";
                break;

            default:
                setText(elements.lang, null, "LANGUAGE");
                setText(elements.docs, null, "DOCUMENTS");
                setText(elements.account, null, "ACCOUNT");
                setText(elements.heading, null, "BROWSE DOCUMENTS");
                setText(elements.footerSocials, null, "SOCIALS");
                setText(elements.footerImprint, null, "IMPRINT");
                setText(elements.footerPrivacy, null, "PRIVACY");
                setText(elements.footerTerms, null, "TERMS");
                setText(elements.footerContact, null, "CONTACT");
                setText(elements.footerPartners, null, "PARTNERS");
                document.documentElement.dir = "ltr";
        }

        // URL aktualisieren ohne Reload
        const url = new URL(window.location);
        url.searchParams.set("lang", lang);
        window.history.pushState({}, "", url);

        // Sprache in localStorage speichern
        localStorage.setItem("selectedLanguage", lang);
//
        translateDocs();
    };

    // Event-Listener für Dropdown-Links
    document.querySelectorAll(".language-options a").forEach((link) => {
        link.addEventListener("click", (e) => {
            e.preventDefault(); // Verhindert Reload

            const href = link.getAttribute("href");
            const language = new URLSearchParams(href.split("?")[1]).get(
                "lang"
            );

            if (language) {
                applyLanguage(language);
            }
        });
    });

    // Initial: Sprache aus URL oder localStorage laden, mit Browser-Sprache als Priorität
    const supportedLanguages = ["de", "en", "fr", "ar", "tr", "fa"];
    const browserLang = getBrowserLanguage();

    let initialLang = "en"; // Standard-Sprache ist Englisch

    if (supportedLanguages.includes(browserLang)) {
        initialLang = browserLang;
    }
    applyLanguage(initialLang);
});

function getBrowserLanguage() {
    const userLang = navigator.language || navigator.userLanguage;
    const smallBrowserLang = userLang.slice(0, 2).toLowerCase();
    return smallBrowserLang;
}

async function translateDocs() {
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get("lang") || "en";

    // Wenn die Zielsprache Deutsch ist, einfach den Originaltext wiederherstellen.
    if (langParam === 'de') {
        docTitles.forEach(el => { if (el.dataset.originalText) el.textContent = el.dataset.originalText; });
        docDescriptions.forEach(el => { if (el.dataset.originalText) el.textContent = el.dataset.originalText; });
        console.log("Original German text restored.");
        return;
    }

    // Refaktorierte Helferfunktion, um eine Liste von Elementen zu übersetzen
    const translateElements = async (elements) => {
        for (const element of elements) {
            // Den Originaltext aus dem data-Attribut für die Übersetzung verwenden
            const originalText = element.dataset.originalText;
            if (!originalText?.trim()) continue;

            try {
                const response = await fetch(
                    "http://localhost:3500/api/translate",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            text: originalText, // Immer den Originaltext senden
                            target_lang: langParam.toUpperCase(),
                            user_lang: langParam
                        }),
                    }
                );

                const responseText = await response.text();
                if (!response.ok) {
                    console.error("Translation API Error:", response.status, responseText);
                    continue;
                }

                let data;
                try {
                    data = JSON.parse(responseText);
                } catch (parseError) {
                    console.error("JSON Parse Error:", parseError, responseText);
                    continue;
                }

                if (data && data.success && data.translation) {
                    element.textContent = data.translation;
                } else {
                    console.warn("Translation failed or text not found in response:", data);
                }
            } catch (error) {
                console.error("Failed to fetch translation:", error);
            }
        }
    };

    // Elemente selektieren
    const docTitles = document.querySelectorAll(".doc-heading");
    const docDescriptions = document.querySelectorAll(".doc-intro");

    console.log(`Found ${docTitles.length} titles and ${docDescriptions.length} descriptions to translate.`);

    // Beide Übersetzungen parallel anstoßen und warten, bis alle fertig sind.
    await Promise.all([
        translateElements(docTitles),
        translateElements(docDescriptions)
    ]);

    console.log("All translations finished.");
}
