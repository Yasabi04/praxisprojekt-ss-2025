document.addEventListener('DOMContentLoaded', () => {
    const elements = {
        lang: document.querySelector('.header-language-word'),
        docs: document.querySelector('.header-documents-link'),
        account: document.querySelector('.header-account-link'),
        heading: document.querySelector('.welcome-heading'),
        // Footer-Elemente hinzufügen
        footerSocials: document.querySelector('.socials-link'),
        footerImprint: document.querySelector('.imprint-link'),
        footerPrivacy: document.querySelector('.privacy-link'),
        footerTerms: document.querySelector('.terms-link'),
        footerContact: document.querySelector('.contact-link'),
        footerPartners: document.querySelector('.partners-link')
    }
    
    let languageData = null; // Cache für JSON-Daten
    
    const setText = (element, text, fallback) => 
        element && (element.innerHTML = text ?? fallback)
    
    // JSON einmal laden und cachen
    const loadLanguageData = async () => {
        if (!languageData) {
            try {
                const response = await fetch('../jsons/languages.json');
                languageData = await response.json();
            } catch (error) {
                console.error('Fehler beim Laden der Sprachen:', error);
            }
        }
        return languageData;
    }
    
    // Sprache anwenden ohne Reload
    const applyLanguage = async (lang) => {
        const data = await loadLanguageData();
        if (!data) return;
        
        switch(lang){
            case 'de':
                setText(elements.lang, data.german?.header?.[0], 'SPRACHE')
                setText(elements.docs, data.german?.header?.[1], 'DOKUMENTE')
                setText(elements.account, data.german?.header?.[2], 'KONTO')
                setText(elements.heading, data.german?.heading, 'Durchsuche Dokumente')
                setText(elements.footerSocials, data.german?.footer?.[0], 'Socials')
                setText(elements.footerImprint, data.german?.footer?.[1], 'Impressum')
                setText(elements.footerPrivacy, data.german?.footer?.[2], 'Datenschutz')
                setText(elements.footerTerms, data.german?.footer?.[3], 'AGB')
                setText(elements.footerContact, data.german?.footer?.[4], 'Kontakt')
                setText(elements.footerPartners, data.german?.footer?.[5], 'Unsere Partner')
                document.documentElement.dir = 'ltr'
                break;
                
            case 'en':
                setText(elements.lang, data.english?.header?.[0], 'LANGUAGE')
                setText(elements.docs, data.english?.header?.[1], 'DOCUMENTS')
                setText(elements.account, data.english?.header?.[2], 'ACCOUNT')
                setText(elements.heading, data.english?.heading, 'Browse the latest documents')
                setText(elements.footerSocials, data.english?.footer?.[0], 'Socials')
                setText(elements.footerImprint, data.english?.footer?.[1], 'Imprint')
                setText(elements.footerPrivacy, data.english?.footer?.[2], 'Privacy Policy')
                setText(elements.footerTerms, data.english?.footer?.[3], 'Terms')
                setText(elements.footerContact, data.english?.footer?.[4], 'Contact')
                setText(elements.footerPartners, data.english?.footer?.[5], 'Our Partners')
                document.documentElement.dir = 'ltr'
                break;
                
            case 'fr':
                setText(elements.lang, data.french?.header?.[0], 'LANGUE')
                setText(elements.docs, data.french?.header?.[1], 'DOCUMENTS')
                setText(elements.account, data.french?.header?.[2], 'COMPTE')
                setText(elements.heading, data.french?.heading, 'Parcourir les documents')
                setText(elements.footerSocials, data.french?.footer?.[0], 'Réseaux sociaux')
                setText(elements.footerImprint, data.french?.footer?.[1], 'Mentions légales')
                setText(elements.footerPrivacy, data.french?.footer?.[2], 'Politique de confidentialité')
                setText(elements.footerTerms, data.french?.footer?.[3], 'CGU')
                setText(elements.footerContact, data.french?.footer?.[4], 'Contact')
                setText(elements.footerPartners, data.french?.footer?.[5], 'Nos partenaires')
                document.documentElement.dir = 'ltr'
                break;
                
            case 'ar':
                setText(elements.lang, data.arabic?.header?.[0], 'اللغة')
                setText(elements.docs, data.arabic?.header?.[1], 'الوثائق')
                setText(elements.account, data.arabic?.header?.[2], 'الحساب')
                setText(elements.heading, data.arabic?.heading, 'تصفح الوثائق')
                setText(elements.footerSocials, data.arabic?.footer?.[0], 'وسائل التواصل')
                setText(elements.footerImprint, data.arabic?.footer?.[1], 'بيانات الموقع')
                setText(elements.footerPrivacy, data.arabic?.footer?.[2], 'سياسة الخصوصية')
                setText(elements.footerTerms, data.arabic?.footer?.[3], 'الشروط')
                setText(elements.footerContact, data.arabic?.footer?.[4], 'اتصل بنا')
                setText(elements.footerPartners, data.arabic?.footer?.[5], 'شركاؤنا')
                document.documentElement.dir = 'rtl'
                break;
                
            case 'tr':
                setText(elements.lang, data.turkish?.header?.[0], 'DIL')
                setText(elements.docs, data.turkish?.header?.[1], 'BELGELER')
                setText(elements.account, data.turkish?.header?.[2], 'HESAP')
                setText(elements.heading, data.turkish?.heading, 'Belgelere göz atın')
                setText(elements.footerSocials, data.turkish?.footer?.[0], 'Sosyal medya')
                setText(elements.footerImprint, data.turkish?.footer?.[1], 'Künye')
                setText(elements.footerPrivacy, data.turkish?.footer?.[2], 'Gizlilik politikası')
                setText(elements.footerTerms, data.turkish?.footer?.[3], 'Şartlar')
                setText(elements.footerContact, data.turkish?.footer?.[4], 'İletişim')
                setText(elements.footerPartners, data.turkish?.footer?.[5], 'Ortaklarımız')
                document.documentElement.dir = 'ltr'
                break;
                
            default:
                setText(elements.lang, null, 'LANGUAGE')
                setText(elements.docs, null, 'DOCUMENTS')
                setText(elements.account, null, 'ACCOUNT')
                setText(elements.heading, null, 'BROWSE DOCUMENTS')
                setText(elements.footerSocials, null, 'SOCIALS')
                setText(elements.footerImprint, null, 'IMPRINT')
                setText(elements.footerPrivacy, null, 'PRIVACY')
                setText(elements.footerTerms, null, 'TERMS')
                setText(elements.footerContact, null, 'CONTACT')
                setText(elements.footerPartners, null, 'PARTNERS')
                document.documentElement.dir = 'ltr'
        }
        
        // URL aktualisieren ohne Reload
        const url = new URL(window.location);
        url.searchParams.set('lang', lang);
        window.history.pushState({}, '', url);
        
        // Sprache in localStorage speichern
        localStorage.setItem('selectedLanguage', lang);
    }
    
    // Event-Listener für Dropdown-Links
    document.querySelectorAll('.language-options a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // Verhindert Reload
            
            const href = link.getAttribute('href');
            const lang = new URLSearchParams(href.split('?')[1]).get('lang');
            
            if (lang) {
                applyLanguage(lang);
            }
        });
    });
    
    // Initial: Sprache aus URL oder localStorage laden
    const initialLang = new URLSearchParams(window.location.search).get('lang') 
                       || localStorage.getItem('selectedLanguage') 
                       || 'de';
    
    applyLanguage(initialLang);
});