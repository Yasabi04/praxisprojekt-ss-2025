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
                        <h2 class = "doc-heading">${originalTitle}</h2>
                        <p class = "doc-intro">${originalContent}</p>
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
                e.stopPropagation();
                e.preventDefault();
                const docId = button
                    .closest(".doc-card")
                    .getAttribute("data-id");

                try {
                    const response = await fetch(
                        `http://mivs15.gm.fh-koeln.de:3500/api/finddoc/${docId}`,
                        {
                            method: "get",
                            headers: new Headers({
                                "ngrok-skip-browser-warning": "69420",
                            }),
                        }
                    );

                    if (!response.ok) {
                        const errorText = await response.text();
                        console.error(
                            "Fehler beim Abrufen der Dokument-Metadaten:",
                            errorText
                        );
                        alert(
                            "Fehler beim Herunterladen der Dokumentinformationen."
                        );
                        return;
                    }

                    const docData = await response.json();

                    // Zur Fehlersuche: Gib die Struktur von pdfFile in der Konsole aus
                    console.log("pdfFile-Objekt von der API:", docData.pdfFile);

                    // Prüfen, ob die erwarteten Daten vorhanden sind.
                    if (
                        docData &&
                        docData.pdfFile &&
                        docData.fileName &&
                        docData.fileType
                    ) {
                        let byteArray;

                        // Prüfen, ob pdfFile das erwartete Buffer-Objekt mit 'data'-Eigenschaft ist.
                        if (
                            docData.pdfFile.data &&
                            Array.isArray(docData.pdfFile.data)
                        ) {
                            byteArray = new Uint8Array(docData.pdfFile.data);
                        }
                        // Fallback, falls pdfFile direkt ein Array von Bytes ist.
                        else if (Array.isArray(docData.pdfFile)) {
                            byteArray = new Uint8Array(docData.pdfFile);
                        }
                        // NEUER FALLBACK: Wenn pdfFile ein Objekt mit numerischen Schlüsseln ist (z.B. {'0': 37, '1': 80, ...})
                        else if (
                            typeof docData.pdfFile === "object" &&
                            docData.pdfFile !== null
                        ) {
                            byteArray = new Uint8Array(
                                Object.values(docData.pdfFile)
                            );
                        } else {
                            // Wenn keine der obigen Bedingungen zutrifft, ist das Format unerwartet.
                            alert(
                                "Die PDF-Daten haben ein unerwartetes Format."
                            );
                            console.error(
                                "Unerwartetes PDF-Datenformat:",
                                docData.pdfFile
                            );
                            return;
                        }

                        // Ein Blob aus dem Byte-Array mit dem korrekten MIME-Typ erstellen.
                        const blob = new Blob([byteArray], {
                            type: docData.fileType,
                        });

                        // Überprüfen, ob der Blob eine Größe hat
                        if (blob.size === 0) {
                            alert(
                                "Fehler: Die erstellte Datei ist leer. Überprüfen Sie die Konsolenausgabe."
                            );
                            console.error(
                                "Blob size is 0. byteArray:",
                                byteArray
                            );
                            return;
                        }

                        // Download-Link erstellen und auslösen
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = docData.fileName; // Dateiname aus der API-Antwort verwenden
                        document.body.appendChild(a);
                        a.click();

                        // Aufräumen
                        window.URL.revokeObjectURL(url);
                        document.body.removeChild(a);
                    } else {
                        alert(
                            "Die heruntergeladenen Daten sind keine gültige PDF-Datei."
                        );
                        console.warn("Unerwartetes Datenformat:", docData);
                    }
                } catch (error) {
                    console.error(
                        "Fehler beim Verarbeiten des Downloads:",
                        error
                    );
                    alert(
                        "Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut."
                    );
                }
            });
        });

        

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
