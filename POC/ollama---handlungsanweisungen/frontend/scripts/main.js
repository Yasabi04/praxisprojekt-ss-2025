document.addEventListener('DOMContentLoaded', () => {
    const button = document.querySelector('.explain-btn');
    const result = document.getElementById('result');
    const textInput = document.getElementById('textInput');

    button.addEventListener('click', async () => {
        const task = textInput ? textInput.value : 'Wie koche ich Nudeln';
        
        if (!task.trim()) {
            result.innerHTML = 'Bitte gib eine Aufgabe ein!';
            return;
        }

        result.innerHTML = '<div class="loader"></div>';
        
        setTimeout(async () => {
            try {
                const response = await fetch('http://localhost:3500/api/instructions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        task: task,
                        complexityLevel: 'simple'
                    })
                });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                const data = await response.json();
                console.log('Backend-Antwort:', data); // Debug-Ausgabe
                
                if (data.success) {
                    // Sichere Überprüfung von data.instructions
                    const instructions = data.instructions || 'Keine Anweisungen erhalten';
                    
                    result.innerHTML = `
                        <h3>Anweisungen für: ${data.task}</h3>
                        <div class="instructions">
                            ${typeof instructions === 'string' ? instructions.replace(/\n/g, '<br>') : instructions}
                        </div>
                    `;
                } else {
                    result.innerHTML = `Fehler: ${data.error}`;
                }
                
            } catch (error) {
                console.error('Fehler:', error);
                result.innerHTML = `Netzwerk-Fehler: ${error.message}`;
            }
        }, 2000);
    });
});