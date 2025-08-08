document.getElementById('uploadForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('title', document.querySelector('input[name="title"]').value);
    formData.append('content', document.querySelector('textarea[name="content"]').value);
    formData.append('pdfFile', document.querySelector('input[name="pdfFile"]').files[0]);
    
    try {
        const response = await fetch('http://mivs06.gm.fh-koeln.de:3500/api/uploaddoc', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        if (result.success) {
            alert('PDF erfolgreich hochgeladen!');
        }
    } catch (error) {
        console.error('Upload-Fehler:', error);
        alert('Upload fehlgeschlagen');
    }
});