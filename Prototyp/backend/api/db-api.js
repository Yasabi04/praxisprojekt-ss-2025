const express = require('express');
const { PrismaClient } = require('@prisma/client');
const multer = require('multer');
const router = express.Router();
const prisma = new PrismaClient();


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
        const docs = await prisma.document.findMany({
		select: {
			docId: true,
			title: true,
			content: true,
			createdAt: true
		}
	});
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

        // Frontend-kompatible Response basierend auf Schema
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
        const { title, content } = req.body;

        // Validierung des Dateityps (nur PDFs erlaubt)
        if (mimetype !== 'application/pdf') {
            return res.status(400).json({ error: 'Nur PDF-Dateien sind erlaubt' });
        }

        // Dokument in der Datenbank speichern
        const newDoc = await prisma.document.create({
            data: {
		title: title,
		content: content,
                pdfName: originalname,
                pdfSize: size,
                pdfFile: buffer,
                createdAt: new Date(),
		updatedAt: new Date()
            }
        });

        console.log('Dokument erfolgreich hochgeladen:', newDoc.docId);
        
        res.status(201).json({
            success: true,
            message: 'Datei erfolgreich hochgeladen',
            document: {
                id: newDoc.docId,
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




// DELETE Route
router.post('/delete/:id', async (req, res) => {
    try {
        const docId = req.params.id;

        console.log('Lösche Dokument mit ID:', docId);

        const deletedDoc = await prisma.document.delete({
            where: {
                docId: docId
            }
        });

        res.json({
            success: true,
            message: 'Dokument erfolgreich gelöscht',
            deletedDocument: {
                id: deletedDoc.docId,
                title: deletedDoc.title
            }
        });

    } catch (error) {
        console.error('Fehler beim Löschen:', error);

        if (error.code === 'P2025') {
            return res.status(404).json({
                success: false,
                error: 'Dokument nicht gefunden'
            });
        }

        res.status(500).json({
            success: false,
            error: 'Fehler beim Löschen des Dokuments'
        });
    }
});







// API Route nach ollama/qwen











router.post('/explain', async (req, res) => {
    try {
        const { userLang, conversation, task, complexityLevel = 'normal' } = req.body;
	console.log('Sprache: ' + userLang)

	let instructionPrompts;
	if(userLang == 'tr'){
		instructionPrompts = {
			simple: 'Aşağıdaki metni çevirmemelisiniz, ancak açıklamalısınız: ' + task,
			easyLanguage: 'Aşağıdaki metni çevirmemelisiniz, ancak basit bir dille açıklamalısınız: ' + task
		}
	}
	else if(userLang == 'ar'){
		instructionPrompts = {
			simple: 'لا ينبغي لك ترجمة النص التالي، بل عليك شرحه: ' + task,
			easyLanguage: 'لا ينبغي عليك ترجمة النص التالي، بل شرحه بلغة بسيطة:' + task
		}
	}
	else if(userLang == 'pr'){
		instructionPrompts = {
			simple: 'متن زیر را ترجمه نکنید، بلکه آن را توضیح دهید:' + task,
			easyLanguage: 'شما نباید متن زیر را ترجمه کنید، بلکه باید آن را به زبان ساده توضیح دهید:' + task
		}
	}
	else  if(userLang == 'en'){
		instructionPrompts = {
			simple: 'I do not speak german. What does that mean: ' + task + '?',
			easyLanguage: 'I do not speak  German. Please explain the following text in Easy Language:' + task
		}
	}
	else if(userLang == 'fr'){
		instructionPrompts = {
			simple: 'Vous ne devez pas traduire le texte suivant, mais lexpliquer.' + task,
			easyLanguage: 'Vous ne devez pas traduire le texte suivant, mais lexpliquer dans un langage simple.' + task
		}
	}
	else if(userLang == 'de'){
		instructionPrompts = {
			simple: 'Bitte erkläre folgenden Part inhaltlich:' + task,
			easyLanguage: 'Bitte den folgenden Text mit einfachen Worten erklären und bitte alle Fachwörter ersetzen: ' + task
		}
	}

        const finalPrompt = instructionPrompts[complexityLevel] || instructionPrompts.simple;

	finalContextPrompt = finalPrompt + conversation

        res.setHeader('Content-Type', 'application/x-ndjson; charset=utf-8');
	res.setHeader('Connection', 'keep-alive')
        res.setHeader('Transfer-Encoding', 'chunked');

        const ollamaResponse = await fetch('http://ollama:11434/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'qwen2.5:1.5b', //oder ein anderes installiertes Modell
                prompt: finalContextPrompt,
                stream: true,
                options: {
                    num_predict: 400,
                    temperature: 0.4,
                    stop: ["Ende", "Fertig", "\n\n\n"]
                }
            })
        });

        if (!ollamaResponse.ok) {
            const errorText = await ollamaResponse.text();
            throw new Error(`Ollama API Fehler: ${ollamaResponse.status} - ${errorText}`);
        }

        const reader = ollamaResponse.body.getReader();
        const decoder = new TextDecoder();

        let buffer = '';
    		while (true) {
      			const { done, value } = await reader.read();
      			if (done) break;

      			buffer += decoder.decode(value, { stream: true });
      			const lines = buffer.split("\n");

      // letzte Zeile evtl. unvollständig -> im Buffer behalten
			buffer = lines.pop();

      			for (const line of lines) {
        			if (!line.trim()) continue;
        				try {
          					const data = JSON.parse(line);
          					if (data.response) {
            // NDJSON rausgeben (eine Zeile pro JSON)
            						res.write(JSON.stringify({ response: data.response }) + "\n");
           						res.flush?.();
          					}
        				} catch (err) {
          					console.error("Fehler beim Parsen:", line);
        				}
				}
    			}

        res.end();
    } catch (error) {
        console.error('Backend-Fehler:', error);
        if (!res.headersSent) {
            res.status(500).json({
                success: false,
                error: 'Fehler beim Generieren der Anweisungen',
                details: error.message
            });
        }
    }
});



module.exports = router;
