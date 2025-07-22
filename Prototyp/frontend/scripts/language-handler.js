document.addEventListener('DOMContentLoaded', () => {
    const elements = {
        lang: document.querySelector('.header-language-word'),
        docs: document.querySelector('.header-documents-link'),
        account: document.querySelector('.header-account-link'),
        heading: document.querySelector('.welcome-heading')
    }
    
    const lang = new URLSearchParams(window.location.search).get('lang') ?? 'de'
    
    const setText = (element, text, fallback) => 
        element && (element.innerHTML = text ?? fallback)
    
    fetch('../jsons/languages.json')
        .then(response => response.ok ? response.json() : Promise.reject(response))
        .then(data => {
            switch(lang){
                case 'de':
                    setText(elements.lang, data.german?.header?.[0], 'SPRACHE')
                    setText(elements.docs, data.german?.header?.[1], 'DOKUMENTE')
                    setText(elements.account, data.german?.header?.[2], 'KONTO')
                    setText(elements.heading, data.german?.heading, 'Durchsuche Dokumente')
                    break;
                    
                case 'en':
                    setText(elements.lang, data.english?.header?.[0], 'LANGUAGE')
                    setText(elements.docs, data.english?.header?.[1], 'DOCUMENTS')
                    setText(elements.account, data.english?.header?.[2], 'ACCOUNT')
                    setText(elements.heading, data.english?.heading, 'Browse the latest documents')
                    break;
                    
                case 'fr':
                    setText(elements.lang, data.french?.header?.[0], 'LANGUE')
                    setText(elements.docs, data.french?.header?.[1], 'DOCUMENTS')
                    setText(elements.account, data.french?.header?.[2], 'COMPTE')
                    setText(elements.heading, data.french?.heading, 'Parcourir les documents')
                    // RTL für Französisch nicht nötig
                    document.documentElement.dir = 'ltr'
                    break;
                    
                case 'ar':
                    setText(elements.lang, data.arabic?.header?.[0], 'اللغة')
                    setText(elements.docs, data.arabic?.header?.[1], 'الوثائق')
                    setText(elements.account, data.arabic?.header?.[2], 'الحساب')
                    setText(elements.heading, data.arabic?.heading, 'تصفح الوثائق')
                    // RTL für Arabisch aktivieren
                    document.documentElement.dir = 'rtl'
                    break;

                case 'tr':
                    setText(elements.lang, data.turkish?.header?.[0], 'LANGUAGES')
                    setText(elements.docs, data.turkish?.header?.[1], 'DOCUMENTS')
                    setText(elements.account, data.turkish?.header?.[2], 'ACCOUNT')
                    setText(elements.heading, data.turkish?.heading, 'BROWSE DOCUMENTS')
                    // RTL für Türkisch deaktivieren
                    document.documentElement.dir = 'ltr'
                    break;
                    
                default:
                    setText(elements.lang, null, 'LANGUAGE')
                    setText(elements.docs, null, 'DOCUMENTS')
                    setText(elements.account, null, 'ACCOUNT')
                    setText(elements.heading, null, 'BROWSE DOCUMENTS')
                    document.documentElement.dir = 'ltr'
            }
        })
        .catch(error => {
            console.error('Fehler:', error)
            setText(elements.lang, null, 'LANGUAGE')
            setText(elements.docs, null, 'DOCUMENTS')
            setText(elements.account, null, 'ACCOUNT')
            setText(elements.heading, null, 'BROWSE DOCUMENTS')
        })
})