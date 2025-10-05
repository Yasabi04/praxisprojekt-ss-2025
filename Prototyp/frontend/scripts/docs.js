document.addEventListener("DOMContentLoaded", () => {
    const allCards = document.querySelectorAll(".doc-card");
    allCards.forEach((card) => {
        card.addEventListener("click", () => {
            const dataId = card.getAttribute("data-id");
            window.location.href = `${window.location.origin}${window.location.pathname}/${dataId}`;
        });
    });

    handleDocuments();
});

async function handleDocuments() {
    const docContainer = document.querySelector(".card-container");

    try {
        console.log("Fetching documents from API...");
        const response = await fetch(
            "http://mivs15.gm.fh-koeln.de:3500/api/alldocs",
            {
                method: "get",
                headers: new Headers({
                    "ngrok-skip-browser-warning": "69420",
                }),
            }
        );

        console.log("Response status:", response.status);

        if (!response.ok) {
            let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

            try {
                const errorData = await response.json();
                errorMessage += ` - ${
                    errorData.error ||
                    errorData.message ||
                    "Unbekannter Server-Fehler"
                }`;
            } catch (jsonError) {
                const errorText = await response.text();
                errorMessage += ` - ${errorText}`;
            }

            throw new Error(errorMessage);
        }

        const data = await response.json();
        console.log("API Response:", data);

        let documents;

        if (Array.isArray(data)) {
            documents = data;
        } else if (data && data.documents && Array.isArray(data.documents)) {
            documents = data.documents;
        } else if (data && data.data && Array.isArray(data.data)) {
            documents = data.data;
        } else {
            console.warn("Unexpected response format:", data);
            documents = [];
        }

        console.log("Processing documents:", documents.length);

        // Container leeren
        docContainer.innerHTML = "";

        if (documents.length === 0) {
            docContainer.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: var(--font-color);">
                    <h3>Keine Dokumente gefunden</h3>
                    <p>Es sind noch keine Dokumente vorhanden.</p>
                </div>
            `;
            return;
        }

        // KORRIGIERT: Dokumente erstellen
        documents.forEach((doc) => {
            const card = document.createElement("div");
            card.className = "doc-card";
            card.setAttribute("data-id", doc.docId || doc.id || "unknown");

            // Die Originaltexte werden in data-Attributen gespeichert, ohne die Struktur zu ändern.
            const originalTitle = doc.title || "Kein Titel";
            const originalContent = doc.content || "Keine Beschreibung";

            card.innerHTML = `
                <div class="card-hor-align">
                    <div class="img-container">
                        <img src="../images/documents+stamp-unsplash.jpg" alt="Vorschau">
                    </div>
                    <div class = "text-content">
                        <h2 class = "doc-heading" data-original-text="${originalTitle}">${originalTitle}</h2>
                        <p class = "doc-intro" data-original-text="${originalContent}">${originalContent}</p>
                        <details class = "doc-intro-mobile">
                            <summary class = "doc-intro-mobile-summary">
                                <i class="fa-solid fa-chevron-down closed"></i>
                                <i class="fa-solid fa-chevron-up opened"></i>
                                    Mehr erfahren!
                            </summary>
                            <p>${originalContent}</p>
                        </details>

                        <small class = "card-date">
                            ${new Date(doc.createdAt).getFullYear()}
                        </small>
                    </div>
                    <div class="doc-download"><i class="fa-solid fa-download"></i></div>
                </div>
            `;

            docContainer.appendChild(card);
        });

        // KORRIGIERT: Event Listener NACH dem Hinzufügen der Elemente
        document.querySelectorAll(".doc-card").forEach((card) => {
            card.addEventListener("click", (e) => {
                // Nicht weiterleiten wenn Favoriten-Button geklickt wurde
                if (
                    e.target.classList.contains("doc-download") ||
                    e.target.classList.contains("doc-intro-mobile") ||
                    e.target.classList.contains("doc-intro-mobile-summary")
                ) {
                    return;
                }

                const docId = card.getAttribute("data-id");
                console.log("Navigating to document:", docId);
                window.location.href = `./desk.html?pdf=${docId}`;
            });
        });

        // Event Listener für Favoriten-Buttons
        document.querySelectorAll(".doc-download").forEach((button) => {
            button.addEventListener("click", async (e) => {
                button.innerHTML = '<div class = "loader"></div>'
                e.stopPropagation();
                e.preventDefault();
                const docId = button.closest(".doc-card").getAttribute("data-id");
                const lang = window.currentLanguage || 'de';

                try {
                    // 1. Original-Dokument vom Haupt-Backend holen
                    const docResponse = await fetch(
                        `http://mivs15.gm.fh-koeln.de:3500/api/finddoc/${docId}`,
                        { headers: new Headers({ "ngrok-skip-browser-warning": "69420" }) }
                    );
                    if (!docResponse.ok) {
                        throw new Error(`Originaldokument konnte nicht geladen werden (${docResponse.status})`);
                    }
                    
                    const originalDocData = await docResponse.json();

                    let fileBufferObject = originalDocData.pdfFile;
                    let fileName = originalDocData.fileName;
                    let fileType = originalDocData.fileType || "application/pdf";

                    // 2. Wenn die Sprache nicht Deutsch ist, Übersetzung anfordern
                    if (lang !== 'de') {
                        console.log(`Übersetzung nach '${lang.toUpperCase()}' wird angefordert...`);
                        
                        // --- KORREKTUR: Robuste Konvertierung von Objekt zu Array ---
                        const keys = Object.keys(fileBufferObject);
                        const bufferAsArray = new Array(keys.length);
                        for (const key of keys) {
                            bufferAsArray[parseInt(key)] = fileBufferObject[key];
                        }
                        // --- ENDE KORREKTUR ---

                        const translateResponse = await fetch("http://localhost:3500/api/document", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                document: bufferAsArray,
                                language: lang.toUpperCase(),
                                fileName: fileName,
                                fileType: fileType
                            }),
                        });

                        if (!translateResponse.ok) {
                            const errorData = await translateResponse.json();
                            throw new Error(`Übersetzung fehlgeschlagen: ${errorData.error || 'Serverfehler'}`);
                        }

                        const translatedData = await translateResponse.json();
                        
                        fileBufferObject = translatedData.translatedFile;
                        fileName = translatedData.fileName;
                    }

                    // 3. Datei-Download auslösen
                    const dataArray = fileBufferObject.data || Object.values(fileBufferObject);
                    if (!dataArray || dataArray.length === 0) {
                        throw new Error("Gültige Dateidaten für den Download fehlen.");
                    }

                    const byteArray = new Uint8Array(dataArray);
                    const blob = new Blob([byteArray], { type: fileType });

                    if (blob.size === 0) {
                        throw new Error("Die erstellte Datei ist leer.");
                    }

                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.style.display = 'none';
                    a.href = url;
                    a.download = fileName;
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                    button.innerHTML = '<i class="fa-solid fa-download"></i>'
                } catch (error) {
                    console.error("Fehler beim Verarbeiten des Downloads:", error);
                    alert("Ein Fehler ist aufgetreten: " + error.message);
                }
            });
        });

        translateDocumentCards(documents);

        console.log("Documents loaded successfully");
    } catch (error) {
        console.error("Fehler beim Abrufen der Dokumente:", error);

        docContainer.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: var(--font-color);">
                <h3>Dokumente konnten nicht geladen werden</h3>
                <p><strong>Error:</strong> ${error.message}</p>
                <button onclick="handleDocuments()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    Erneut versuchen
                </button>
            </div>
        `;
    }
}

function translateDocumentCards(documents) {
    const lang = window.currentLanguage || 'de';

    if (lang === 'de') return; // Keine Übersetzung nötig

    documents.forEach(async (doc) => {
        const card = document.querySelector(`.doc-card[data-id="${doc.docId || doc.id || "unknown"}"]`);
        if (!card) return;

        const originalTitle = doc.title || "Kein Titel";
        const originalContent = doc.content || "Keine Beschreibung";

        try {
            // Übersetzung der Titel und Inhalte anfordern
            const response = await fetch("http://localhost:3500/api/translate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    document: originalContent, // Nur der Inhalt für die Übersetzung
                    language: lang.toUpperCase(),
                    fileName: originalTitle
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Übersetzung fehlgeschlagen: ${errorData.error || 'Serverfehler'}`);
            }

            const translatedData = await response.json();

            // Übersetzte Texte in die Karte einfügen
            card.querySelector(".doc-heading").innerText = translatedData.translatedText || originalTitle;
            card.querySelector(".doc-intro").innerText = translatedData.translatedText || originalContent;

        } catch (error) {
            console.error("Fehler bei der Übersetzung der Dokumentenkarte:", error);
        }
    });
}
