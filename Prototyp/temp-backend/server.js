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
