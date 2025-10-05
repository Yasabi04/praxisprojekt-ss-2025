const express = require("express");
const cors = require("cors");
const axios = require("axios");
const FormData = require("form-data");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(cors());
const DEEPL_API_KEY = process.env.DEEPL_API_KEY;

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


app.post("/api/document", async (req, res) => {
  try {
    const { document, fileName, fileType, language } = req.body;

    if (!Array.isArray(document))
      return res.status(400).json({ error: "document muss ein Array sein" });

    // 🔹 Array -> Buffer umwandeln
    const fileBuffer = Buffer.from(document);

    console.log("Buffer Header:", fileBuffer.slice(0, 4)); // [%PDF] prüfen

    // 🔹 FormData vorbereiten
    const formData = new FormData();
    formData.append("file", fileBuffer, {
      filename: fileName,
      contentType: fileType || "application/octet-stream",
    });
    formData.append("target_lang", language);
    formData.append("source_lang", "DE");

    // 🔹 DeepL Upload
    const uploadResponse = await axios.post(
      "https://api-free.deepl.com/v2/document",
      formData,
      {
        headers: {
          Authorization: `DeepL-Auth-Key ${DEEPL_API_KEY}`,
          ...formData.getHeaders(),
        },
      }
    );

    const { document_id, document_key } = uploadResponse.data;
    console.log("Upload erfolgreich:", { document_id });

    // 🔹 Polling, bis Übersetzung fertig ist
    let status = "queued";
    while (status === "queued" || status === "translating") {
      await new Promise((res) => setTimeout(res, 3000));
      const statusResponse = await axios.post(
        `https://api-free.deepl.com/v2/document/${document_id}`,
        { document_key },
        {
          headers: { Authorization: `DeepL-Auth-Key ${DEEPL_API_KEY}` },
        }
      );
      status = statusResponse.data.status;
      console.log("Status:", status);
    }

    // 🔹 Download
    const result = await axios.post(
      `https://api-free.deepl.com/v2/document/${document_id}/result`,
      { document_key },
      {
        headers: { Authorization: `DeepL-Auth-Key ${DEEPL_API_KEY}` },
        responseType: "arraybuffer",
      }
    );

    const translatedFile = Buffer.from(result.data);
    const outputFileName =
      fileName.replace(/\.[^.]+$/, "") + `_${language}.${fileName.split(".").pop()}`;

    res.json({
      success: true,
      translatedFile: Array.from(translatedFile),
      fileName: outputFileName,
    });
  } catch (error) {
    console.error("Fehler bei der Dokumentenübersetzung:", error.response?.data || error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(3500, () => console.log("Server läuft auf Port 3500"));
