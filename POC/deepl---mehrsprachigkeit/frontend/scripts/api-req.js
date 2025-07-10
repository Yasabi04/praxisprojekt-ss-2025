async function translateText() {
    console.log('translateText() aufgerufen');
    
    const textInput = document.getElementById('textInput');
    const targetLang = document.getElementById('targetLang');
    const resultDiv = document.getElementById('result');
    
    const text = textInput.value.trim();
    console.log('Text zu übersetzen:', text);
    console.log('Zielsprache:', targetLang.value);
    
    if (!text) {
        resultDiv.className = 'result error';
        resultDiv.textContent = 'Bitte geben Sie Text zum Übersetzen ein!';
        return;
    }
    
    // Test die Serververbindung zuerst:
    try {
        const testResponse = await fetch('http://127.0.0.1:3500/test', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'  // Korrigiert: application statt apllication
            }
        });
        
        const testData = await testResponse.json();
        console.log('Server Test erfolgreich:', testData);
        
        // Jetzt die echte Übersetzung:
        resultDiv.className = 'result';
        resultDiv.textContent = 'Übersetze...';
        
        const translateResponse = await fetch('http://127.0.0.1:3500/api/translate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: text,
                target_lang: targetLang.value
            })
        });
        
        if (!translateResponse.ok) {
            throw new Error(`HTTP ${translateResponse.status}: ${translateResponse.statusText}`);
        }
        
        const translateData = await translateResponse.json();
        console.log('Übersetzung erhalten:', translateData);
        
        if (translateData.success) {
            resultDiv.className = 'result success';
            resultDiv.innerHTML = `
                <strong>Übersetzung (${translateData.source_lang} → ${translateData.target_lang}):</strong><br>
                ${translateData.translation}
            `;
        } else {
            throw new Error(translateData.error || 'Übersetzung fehlgeschlagen');
        }
        
    } catch (error) {
        console.error('Fehler:', error);
        resultDiv.className = 'result error';
        resultDiv.textContent = `Fehler: ${error.message}`;
    }
}

// Enter-Taste zum Übersetzen
document.getElementById('textInput').addEventListener('keypress', e => {
    if (e.key === 'Enter') {
        translateText();
    }
});

async function extractDocument(){
    
    const fileInput = document.querySelector('.file-input');
    const result = document.querySelector('.generatedDoc')
    console.log('File-Input Element:', fileInput);
    
    if (!fileInput) {
        console.log('File-Input nicht gefunden!');
        return;
    }
    
    // KORREKTUR: .files[0] statt .value
    const file = fileInput.files[0];
    console.log('Datei:', file);
    
    if (file) {
        console.log('Datei ausgewählt:', {
            name: file.name,
            type: file.type,
            size: file.size
        });
    } else {
        console.log('Keine Datei ausgewählt');
    }

    result.innerHTML = `
    
    `
}

// Automatischer Test beim Laden der Seite
window.addEventListener('DOMContentLoaded', () => {
    console.log('Seite geladen - bereit für Übersetzungen!');
    
    // Event-Listener HIER hinzufügen, nachdem DOM geladen ist
    const fileButton = document.querySelector('.file-input-button');
    console.log('Button gefunden:', fileButton);
    
    if (fileButton) {
        fileButton.addEventListener('click', () => {
            console.log('Button geklickt!');
            extractDocument();
            console.log('worked');
        });
    } else {
        console.log('❌ Button nicht gefunden!');
    }
});