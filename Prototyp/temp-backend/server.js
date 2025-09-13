const express = require('express');
const path = require('path');
const cors = require('cors');

require('dotenv').config(); 

const port = 3500; 
const DEEPL_API_KEY = process.env.DEEPL_API_KEY; 

console.log('=== ENVIRONMENT DEBUG ===');
console.log('DEEPL_API_KEY gefunden:', !!DEEPL_API_KEY);
console.log('=========================');

const app = express();

// CORS aktivieren
app.use(cors({
    origin: [
        'http://localhost:5500',
        'http://127.0.0.1:5500',
        'http://localhost:3000',
        'http://localhost:5501',
        'http://127.0.0.1:5501'
    ],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json());

// Test-Route
app.get('/test', (req, res) => {
    res.json({ 
        message: 'Server läuft!', 
        hasApiKey: !!DEEPL_API_KEY,
        timestamp: new Date().toISOString()
    });
});

// Übersetzungs-Route
// Übersetzungs-Route mit echter DeepL API
// app.post('/api/translate', async (req, res) => {
//     try {
//         const { text, target_lang } = req.body;
//         console.log('Übersetzungsanfrage:', { text, target_lang });
        
//         if (!text || !target_lang) {
//             return res.status(400).json({
//                 success: false,
//                 error: 'Text und Zielsprache sind erforderlich'
//             });
//         }
        
//         // DeepL API-Anfrage
//         const deepLResponse = await fetch('https://api-free.deepl.com/v2/translate', {
//             method: 'POST',
//             headers: {
//                 'Authorization': `DeepL-Auth-Key ${DEEPL_API_KEY}`,
//                 'Content-Type': 'application/x-www-form-urlencoded'
//             },
//             body: new URLSearchParams({
//                 'source_language': 'DE',
//                 'text': text,
//                 'target_lang': target_lang
//             })
//         });
        
//         if (!deepLResponse.ok) {
//             throw new Error(`DeepL API Fehler: ${deepLResponse.status}`);
//         }
        
//         const deepLData = await deepLResponse.json();
//         console.log('DeepL Antwort:', deepLData);
        
//         res.json({
//             success: true,
//             translation: deepLData.translations[0].text,
//             source_lang: deepLData.translations[0].detected_source_language,
//             target_lang: target_lang
//         });
        
//     } catch (error) {
//         console.error('Übersetzungsfehler:', error);
//         res.status(500).json({
//             success: false,
//             error: 'Übersetzungsfehler',
//             details: error.message
//         });
//     }
// });

app.post('/api/translate', async (req, res) => {
    try {
        const { text, target_lang, user_lang } = req.body;
        console.log('Übersetzungsanfrage:', { text, target_lang, user_lang });
        
        if (!text || !target_lang) {
            return res.status(400).json({
                success: false,
                error: 'Text und Zielsprache sind erforderlich'
            });
        }

        // Glossar-ID aus deiner .env (muss vorher erstellt werden!)
        const GLOSSARY_ID = process.env.DEEPL_GLOSSARY_ID;

        // DeepL API-Anfrage mit Glossar
        const deepLResponse = await fetch('https://api-free.deepl.com/v2/translate', {
            method: 'POST',
            headers: {
                'Authorization': `DeepL-Auth-Key ${DEEPL_API_KEY}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                'text': text,
                'target_lang': target_lang,
                'source_lang': 'DE',
                // ...(GLOSSARY_ID ? { 'glossary_id': GLOSSARY_ID } : {}) // nur wenn vorhanden
            })
        });
        
        if (!deepLResponse.ok) {
            throw new Error(`DeepL API Fehler: ${deepLResponse.status}`);
        }
        
        const deepLData = await deepLResponse.json();
        console.log('DeepL Antwort:', deepLData);
        
        res.json({
            success: true,
            translation: deepLData.translations[0].text,
            source_lang: deepLData.translations[0].detected_source_language,
            target_lang: target_lang,
            glossary_used: GLOSSARY_ID ? true : false
        });
        
    } catch (error) {
        console.error('Übersetzungsfehler:', error);
        res.status(500).json({
            success: false,
            error: 'Übersetzungsfehler',
            details: error.message
        });
    }
});


// Server starten
app.listen(port, () => {
    console.log(`Server läuft auf http://localhost:${port}`);
});