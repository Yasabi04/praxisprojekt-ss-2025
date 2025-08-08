document.addEventListener("DOMContentLoaded", () => {
    const btn = document.querySelector(".send-message");
    let selectedOption = "translate"; // Default option

    console.log("----------");

    // Event listeners for custom dropdown options
    const options = document.querySelectorAll(".option div[data-id]");
    const choosingDiv = document.querySelector(".chosing");
    const modeSelect = document.querySelector("#mode-select");
    const selection = document.querySelector(".selection");
    
    // Set up click listeners for options (only once)
    options.forEach((option) => {
        option.addEventListener("click", () => {
            selectedOption = option.getAttribute("data-id");
            choosingDiv.textContent = option.textContent;
            console.log("Selected option:", selectedOption);

            // Hide dropdown after selection
            if (selection) {
                selection.style.display = "none";
            }
        });
    });
    
    // Show dropdown on hover
    modeSelect.addEventListener("mouseenter", () => {
        if (selection) {
            selection.style.display = "flex";
        }
    });
    
    // Hide dropdown when mouse leaves
    modeSelect.addEventListener("mouseleave", () => {
        if (selection) {
            selection.style.display = "none";
        }
    });

    btn.addEventListener("click", () => {
        const userText = document.querySelector(".user-input").value.trim();
        const option = selectedOption; // Use our custom selected option
        const conversation = document.querySelector(".conversation");
        const urlParams = new URLSearchParams(window.location.search);
        const langParam = urlParams.get("lang");

        console.log("User Text:", userText);
        console.log("Option:", option);
        console.log("Lang Parameter:", langParam);

        // KORRIGIERT: Input-Validation
        if (!userText) {
            alert("Bitte geben Sie einen Text ein");
            return;
        }

        switch (option) {
            case "translate":
                // TRY CATCH!!! Aufruf muss asynchron sein!

                fetch("http://mivs06.gm.fh-koeln.de:3500/api/translate", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        text: userText, // ✅ KORRIGIERT: "text" statt "userInput"
                        target_lang: langParam,
                    }),
                })
                    .then((response) => {
                        console.log(
                            "Translation response status:",
                            response.status
                        );

                        if (!response.ok) {
                            return response.json().then((errorData) => {
                                throw new Error(
                                    errorData.error || `HTTP ${response.status}`
                                );
                            });
                        }

                        return response.json();
                    })
                    .then((data) => {
                        console.log("Translation successful:", data);

                        if (data.success) {
                            console.log("Übersetzung:", data.translation);
                            // TODO: Antwort in UI anzeigen
                            displayTranslation(data.translation);
                        } else {
                            throw new Error(
                                data.error || "Übersetzung fehlgeschlagen"
                            );
                        }
                    })
                    .catch((err) => {
                        console.error("Fehler bei der Übersetzung:", err);
                        alert("Übersetzungsfehler: " + err.message);
                    });
                break;

            case "easy-language":
                fetch("http://mivs06.gm.fh-koeln.de:3500/api/easylanguage", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        text: userText,
                        target_lang: langParam,
                    }),
                })
                    .then((response) => {
                        console.log(
                            "Easy language response status:",
                            response.status
                        );
                        if (!response.ok) {
                            throw new Error(
                                `HTTP ${response.status}: ${response.statusText}`
                            );
                        }
                        return response.json();
                    })
                    .then((data) => {
                        console.log("Easy language data:", data);
                        // TODO: Antwort in UI anzeigen
                    })
                    .catch((err) => {
                        console.error("Fehler bei easy language:", err);
                        alert("Easy Language Fehler: " + err.message);
                    });
                break;

            case "explain":
                (async () => {
                    try {
                        const loader = document.querySelector(".loader");
                        loader.style = "display: none";
                        const conversationItemUser =
                            document.createElement("li");
                        conversationItemUser.className = "sentence right";
                        conversationItemUser.innerHTML = `
                            <div class = "user-request">
                                ${userText}
                            </div>
                        `;
                        conversation.appendChild(conversationItemUser);

                        const response = await fetch(
                            "http://mivs06.gm.fh-koeln.de:3500/api/explain",
                            {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                    task: userText,
                                    complexityLevel: "simple",
                                }),
                            }
                        );

                        if (!response.ok) {
                            throw new Error(
                                `HTTP ${response.status}: ${response.statusText}`
                            );
                        }

                        const data = await response.json();
                        console.log("Backend-Antwort:", data);

                        if (data.success) {
                            // KORRIGIERT: Nur ein <li> Element erstellen
                            const conversationItemModell =
                                document.createElement("li");
                            conversationItemModell.className = "sentence left";
                            const instructions =
                                data.instructions ||
                                "Keine Anweisungen erhalten";
                            console.log("Instruktionen: " + instructions);

                            // KORRIGIERT: Keine doppelten <li> Tags
                            conversationItemModell.innerHTML = `
                                <div class="instructions">
                                    ${
                                        typeof instructions === "string"
                                            ? instructions.replace(
                                                  /\n/g,
                                                  "<br><br>"
                                              )
                                            : instructions
                                    }
                                </div>
                            `;

                            if (conversation) {
                                conversation.appendChild(
                                    conversationItemModell
                                );

                                // KORRIGIERT: Scroll zum Ende
                                const conversationContent =
                                    document.querySelector(
                                        ".conversation-content"
                                    );
                                if (conversationContent) {
                                    conversationContent.scrollTop =
                                        conversationContent.scrollHeight;
                                }
                            }
                        } else {
                            // KORRIGIERT: Auch Fehler als <li> anzeigen
                            const errorItem = document.createElement("li");
                            errorItem.className = "sentence left error";
                            errorItem.innerHTML = `
                                <div class="error-message">
                                    Fehler: ${
                                        data.error || "Unbekannter Fehler"
                                    }
                                </div>
                            `;
                            if (conversation) {
                                conversation.appendChild(errorItem);
                            }
                        }
                    } catch (error) {
                        console.error("Fehler:", error);

                        // KORRIGIERT: Auch Netzwerk-Fehler als <li> anzeigen
                        const errorItem = document.createElement("li");
                        errorItem.className = "sentence left error";
                        errorItem.innerHTML = `
                            <div class="error-message">
                                Netzwerk-Fehler: ${error.message}
                            </div>
                        `;
                        if (conversation) {
                            conversation.appendChild(errorItem);
                        }
                    }
                })();
                break;

            default:
                console.warn("Unknown option:", option);
                alert("Unbekannte Option ausgewählt");
        }

        // Input nach dem Senden leeren
        document.querySelector(".user-input").value = "";
    });
});

// Hilfsfunktion um Übersetzung anzuzeigen
function displayTranslation(translation) {
    const conversationContent = document.querySelector(".conversation-content");

    if (conversationContent) {
        const messageDiv = document.createElement("div");
        messageDiv.className = "message assistant";
        messageDiv.innerHTML = `
            <div class="message-content">
                <strong>Übersetzung:</strong>
                <p>${translation}</p>
            </div>
        `;
        conversationContent.appendChild(messageDiv);
        conversationContent.scrollTop = conversationContent.scrollHeight;
    }
}
