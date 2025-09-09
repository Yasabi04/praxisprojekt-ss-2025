document.getElementById("uploadForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const fileInput = document.querySelector('input[name="pdfFile"]');
    // const fileTitle = document.querySelector('input[name="title"]')
    const file = fileInput.files[0];
    // const fileContent = document.querySelector('textarea[name="content"]').value;
    // console.log(fileContent)

    // Validierung
    if (!file) {
        alert("Bitte wählen Sie eine Datei aus");
        return;
    }

    if (file.type !== "application/pdf") {
        alert("Nur PDF-Dateien sind erlaubt");
        return;
    }

    // FormData für Upload vorbereiten
    const formData = new FormData();
    formData.append(
        "title",
        document.querySelector('input[name="title"]').value
    );
    formData.append(
        "content",
        document.querySelector('textarea[name="content"]').value
    );
    formData.append(
        "file",
        document.querySelector('input[name="pdfFile"]').files[0]
    );

    // Upload-Feedback
    const submitButton = document.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = "Uploading...";
    submitButton.disabled = true;

    try {
        const response = await fetch(
            "http://mivs15.gm.fh-koeln.de:3500:3500/api/upload",
            {
                method: "POST",
                headers: {
                    "ngrok-skip-browser-warning": "69420", // ngrok Header
                },
                body: formData,
            }
        );

        const result = await response.json();

        if (response.ok && result.success) {
            alert(
                `PDF erfolgreich hochgeladen!\nDatei: ${
                    result.document.fileName
                }\nGröße: ${(result.document.fileSize / 1024).toFixed(2)} KB`
            );

            // Form zurücksetzen
            document.getElementById("uploadForm").reset();

            console.log("Upload erfolgreich:", result.document);
        } else {
            throw new Error(result.error || "Upload fehlgeschlagen");
        }
    } catch (error) {
        console.error("Upload-Fehler:", error);
        alert(`Upload fehlgeschlagen: ${error.message}`);
    } finally {
        // Button zurücksetzen
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }
});

document.addEventListener("DOMContentLoaded", () => {
    getCurrentDocs();
    hideAndShowForm();
});

async function getCurrentDocs() {
    try {
        const docContainer = document.querySelector(".doc-container");

        const response = await fetch(
            "http://mivs15.gm.fh-koeln.de:3500/api/alldocs",
            {
                method: "get",
                headers: new Headers({
                    "ngrok-skip-browser-warning": "69420",
                }),
            }
        );

        const data = await response.json();
        console.log(data)

        data.forEach((doc) => {
            const div = document.createElement("div");
            const reroute = window.location.origin + `/Prototyp/frontend/html/desk.html?pdf=${doc.docId}`
            div.innerHTML = `
                <div class="doc-content">
                    <a href = "${reroute}" class="doc-text-content">
                        <p class="doc-title">${doc.title}</p>
                        <p class="doc-year">
                            ${new Date(doc.createdAt).toLocaleDateString("de-DE", { month: "numeric", year: "numeric" }).replace('/', '.')}
                        </p>
                    </a>
                    <button class="delete" onclick="deleteDoc('${doc.docId}')"><i class="fa-solid fa-trash"></i></button>
                </div>
            `;

            docContainer.insertBefore(div, docContainer.firstChild);
        });
    } catch (error) {
        console.log(error);
    }
}

function hideAndShowForm() {
    const uploadForm = document.getElementById("uploadForm");
    const newDocButton = document.querySelector(".new-doc");
    const closeButton = document.querySelector(".close")

    newDocButton.addEventListener("click", () => {
        uploadForm.style = 'display: flex';
    });

    closeButton.addEventListener("click", () => {
        uploadForm.style = 'display: none';
    })
}

async function deleteDoc(docId) {
    try {
        fetch(
            "http://mivs15.gm.fh-koeln.de:3500/api/delete/" + docId,
            {
                method: "POST",
            }
        )
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then(() => {
                alert("Dokument erfolgreich gelöscht!");
                // Optional: Seite neu laden oder Element entfernen
                location.reload();
            })
            .catch((error) => {
                alert("Fehler beim Löschen des Dokuments: " + error.message);
            });
    } catch (error) {
        console.log(error);
    }
}
