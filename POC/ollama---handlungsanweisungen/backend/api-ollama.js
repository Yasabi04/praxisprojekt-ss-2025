const express = require('express')
const router = express.Router()

router.post('/instructions', async (req, res) => {
    try {
        const { task, complexityLevel = 'normal' } = req.body

        const instructionPrompts = {
            simple: `Antworte in maximal 5 Schritten: ${task}:
                        Und antworte bitte immer in diesem Muster:
                        1. ...
                        2. ...
                    `,
            simpleLeicht: `Erkläre in 10 Worten in Leichter Sprache: ${task}`,
            detailed: `Erkläre ausführlich: ${task}`
        }

        const finalPrompt = instructionPrompts[complexityLevel] || instructionPrompts.simpleLeicht

        console.log('Anfrage an Ollama:', { model: 'gemma3', task, complexityLevel });

        const ollamaResponse = await fetch('http://localhost:11434/api/generate', {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gemma3',  
                prompt: finalPrompt,
                stream: false,
                options: {
                    num_predict: 300,
                    temperature: 0.4,
                    stop: ["Ende", "Fertig", "\n\n\n"]
                }
            })
        })

        if (!ollamaResponse.ok) {
            const errorText = await ollamaResponse.text();
            throw new Error(`Ollama API Fehler: ${ollamaResponse.status} - ${errorText}`);
        }

        const ollamaData = await ollamaResponse.json()
        console.log('Ollama Antwort:', ollamaData);

        const instructions = ollamaData.response || 'Keine Antwort von Ollama erhalten';

        res.json({
            success: true,
            instructions: instructions,
            task: task,
            complexity: complexityLevel
        })
    }
    catch (error) {
        console.error('Backend-Fehler:', error);
        
        res.status(500).json({
            success: false,
            error: 'Fehler beim Generieren der Anweisungen',
            details: error.message
        });
    }
})

module.exports = router