const express = require('express');
const path = require('path');
const cors = require('cors');
const multer = require('multer');
const FormData = require('form-data');



require('dotenv').config(); 

const port = process.env.PORT || 3500; 
const DEEPL_API_KEY = process.env.DEEPL_API_KEY; 

console.log('=== ENVIRONMENT DEBUG ===');
console.log('DEEPL_API_KEY gefunden:', !!DEEPL_API_KEY);
console.log('=========================');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });


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
app.post('/api/translate', async (req, res) => {
    try {
        const { text, target_lang } = req.body;
        console.log('Übersetzungsanfrage:', { text, target_lang });
        
        if (!text || !target_lang) {
            return res.status(400).json({
                success: false,
                error: 'Text und Zielsprache sind erforderlich'
            });
        }
        
        // DeepL API-Anfrage
        const deepLResponse = await fetch('https://api-free.deepl.com/v2/translate', {
            method: 'POST',
            headers: {
                'Authorization': `DeepL-Auth-Key ${DEEPL_API_KEY}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                'text': text,
                'target_lang': target_lang
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
            target_lang: target_lang
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

// Neue Route für Dokumentübersetzung
app.post('/api/translate-document', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Keine Datei hochgeladen.' });
        }

        const { target_lang } = req.body;
        if (!target_lang) {
            return res.status(400).json({ error: 'Keine Zielsprache angegeben.' });
        }

        const formData = new FormData();
        formData.append('file', req.file.buffer, req.file.originalname);
        formData.append('target_lang', target_lang);

        const deepLResponse = await fetch('https://api-free.deepl.com/v2/document', {
            method: 'POST',
            headers: {
                ...formData.getHeaders(),
                'Authorization': `DeepL-Auth-Key ${DEEPL_API_KEY}`,
            },
            body: formData,
        });

        if (!deepLResponse.ok) {
            const errorText = await deepLResponse.text();
            console.error('DeepL API Fehler:', errorText);
            return res.status(deepLResponse.status).send(errorText);
        }

        const contentDisposition = deepLResponse.headers.get('content-disposition');
        res.setHeader('Content-Type', deepLResponse.headers.get('content-type'));
        if (contentDisposition) {
            res.setHeader('Content-Disposition', contentDisposition);
        }
        
        deepLResponse.body.pipe(res);

    } catch (error) {
        console.error('Fehler bei der Dokumentübersetzung:', error);
        res.status(500).json({ error: 'Interner Serverfehler.' });
    }
});


// Server starten
app.listen(port, () => {
    console.log(`Server läuft auf http://localhost:${port}`);
});