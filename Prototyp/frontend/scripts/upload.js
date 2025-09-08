document.getElementById('uploadForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const fileInput = document.querySelector('input[name="pdfFile"]');
    // const fileTitle = document.querySelector('input[name="title"]')
    const file = fileInput.files[0];
    // const fileContent = document.querySelector('textarea[name="content"]').value;
    // console.log(fileContent)
    
    // Validierung
    if (!file) {
        alert('Bitte wählen Sie eine Datei aus');
        return;
    }
    
    if (file.type !== 'application/pdf') {
        alert('Nur PDF-Dateien sind erlaubt');
        return;
    }
    
    // FormData für Upload vorbereiten
    const formData = new FormData();
    formData.append('title', document.querySelector('input[name="title"]').value);
    formData.append('content', document.querySelector('textarea[name="content"]').value);
    formData.append('file', document.querySelector('input[name="pdfFile"]').files[0]);
    
    // Upload-Feedback
    const submitButton = document.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Uploading...';
    submitButton.disabled = true;
    
    try {
        const response = await fetch('https://neutral-aware-bonefish.ngrok-free.app/api/upload', {
            method: 'POST',
            headers: {
                "ngrok-skip-browser-warning": "69420" // ngrok Header
            },
            body: formData
        });
        
        const result = await response.json();
        
        if (response.ok && result.success) {
            alert(`PDF erfolgreich hochgeladen!\nDatei: ${result.document.fileName}\nGröße: ${(result.document.fileSize / 1024).toFixed(2)} KB`);
            
            // Form zurücksetzen
            document.getElementById('uploadForm').reset();
            
            console.log('Upload erfolgreich:', result.document);
        } else {
            throw new Error(result.error || 'Upload fehlgeschlagen');
        }
        
    } catch (error) {
        console.error('Upload-Fehler:', error);
        alert(`Upload fehlgeschlagen: ${error.message}`);
    } finally {
        // Button zurücksetzen
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }
});



document.addEventListener('DOMContentLoaded', () => {
    getCurrentDocs()
})

async function getCurrentDocs(){
    try {
        const response = await fetch(
            "https://neutral-aware-bonefish.ngrok-free.app/api/alldocs",
            {
                method: "get",
                headers: new Headers({
                    "ngrok-skip-browser-warning": "69420"
                }),
            }
        );

        const data = await response.json();
        console.log("API Response:", data);
    }
    catch(error){
        console.log(error)
    }
}