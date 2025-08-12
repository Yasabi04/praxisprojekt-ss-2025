const express = require('express');
const { PrismaClient } = require('@prisma/client');
const multer = require('multer');
const router = express.Router();
const prisma = new PrismaClient();
require('dotenv').config();

// Multer-Konfiguration für File-Uploads
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

router.get('/alldocs', async (req, res) => {
    try {
        const docs = await prisma.document.findMany();
        console.log("Anzahl Dokumente: ", docs.length);
        res.json(docs);
    } catch (error) {
        console.error('Fehler beim Abrufen der Dokumente:', error);
        res.status(500).json({ error: 'Fehler beim Abrufen der Dokumente' });
    }
});

// Dokumente anhand der Id finden
router.get('/finddoc/:id', async (req, res) => {
    try {
        const docId = req.params.id;
        
        if (!docId || docId.trim() === '') {
            return res.status(400).json({ error: 'Ungültige Dokument-ID' });
        }

        const doc = await prisma.document.findUnique({
            where: {
                docId: docId  // docId ist der Primary Key in Ihrem Schema
            }
        });

        if (!doc) {
            return res.status(404).json({ error: 'Dokument nicht gefunden' });
        }

        // Frontend-kompatible Response basierend auf Ihrem Schema
        const response = {
            id: doc.docId,           // Frontend erwartet 'id'
            docId: doc.docId,        // Original docId
            title: doc.title,        // Schema hat bereits 'title'
            fileName: doc.pdfName,   // pdfName -> fileName für Kompatibilität
            fileType: "application/pdf", // Annahme: alle sind PDFs
            fileSize: doc.pdfSize,   // pdfSize -> fileSize
            content: doc.content,    // Textinhalt
            uploadDate: doc.createdAt, // createdAt -> uploadDate
            updatedAt: doc.updatedAt,
            pdfFile: doc.pdfFile     // Frontend erwartet 'pdfFile' (Bytes)
        };

        console.log(`Dokument ${docId} gefunden: ${doc.title} (${doc.pdfSize} bytes)`);
        res.json(response);
        
    } catch (error) {
        console.error('Fehler beim Abrufen des Dokuments:', error);
        res.status(500).json({ 
            error: 'Fehler beim Abrufen des Dokuments',
            details: error.message 
        });
    }
});




// POST File Upload
router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Keine Datei hochgeladen' });
        }

        const { originalname, mimetype, size, buffer } = req.file;
        const { userId } = req.body;

        // Validierung des Dateityps (nur PDFs erlaubt)
        if (mimetype !== 'application/pdf') {
            return res.status(400).json({ error: 'Nur PDF-Dateien sind erlaubt' });
        }

        // Dokument in der Datenbank speichern
        const newDoc = await prisma.document.create({
            data: {
                fileName: originalname,
                fileType: mimetype,
                fileSize: size,
                pdfFileBytes: buffer,
                uploadDate: new Date(),
                selected: false
            }
        });

        console.log('Dokument erfolgreich hochgeladen:', newDoc.id);
        
        res.status(201).json({
            success: true,
            message: 'Datei erfolgreich hochgeladen',
            document: {
                id: newDoc.id,
                fileName: newDoc.fileName,
                fileType: newDoc.fileType,
                fileSize: newDoc.fileSize,
                uploadDate: newDoc.uploadDate
            }
        });

    } catch (error) {
        console.error('Fehler beim Upload:', error);
        res.status(500).json({ error: 'Fehler beim Hochladen der Datei' });
    }
});

module.exports = router;
