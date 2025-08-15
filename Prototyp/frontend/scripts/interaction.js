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

        if (!userText) {
            return;
        }

        switch (option) {
            case "translate":
                (async () => {
                    try {
                        console.log("=== DEBUG INFO ===");
                        console.log("Sending data:", {
                            text: userText,
                            target_lang: langParam,
                        });

                        const response = await fetch(
                            "https://neutral-aware-bonefish.ngrok-free.app/api/translate",
                            {
                                method: "POST",
                                headers: new Headers({
                                    "Content-Type":
                                        "application/x-www-form-urlencoded",
                                    "ngrok-skip-browser-warning": "69420",
                                }),
                                body: new URLSearchParams({
                                    text: userText,
                                    target_lang: langParam.toUpperCase(),
                                }),
                            }
                        );

                        console.log("Response status:", response.status);
                        console.log(
                            "Response headers:",
                            Object.fromEntries(response.headers.entries())
                        );

                        // WICHTIG: Erst Text lesen, dann analysieren
                        const responseText = await response.text();
                        console.log(
                            "Raw response (first 500 chars):",
                            responseText.substring(0, 500)
                        );

                        if (!response.ok) {
                            throw new Error(
                                `HTTP ${response.status}: ${responseText}`
                            );
                        }

                        // Versuchen als JSON zu parsen
                        let data;
                        try {
                            data = JSON.parse(responseText);
                            console.log("Parsed JSON:", data);
                        } catch (parseError) {
                            console.error("JSON Parse Error:", parseError);
                            throw new Error(
                                "Server returned non-JSON response: " +
                                    responseText.substring(0, 200)
                            );
                        }

                        if (data.success) {
                            console.log("Übersetzung:", data.translation);
                            displayTranslation(data.translation);
                        } else {
                            // Loader durch Fehlermeldung ersetzen
                            conversationItemLoader.innerHTML = `
                                <div class="error-message">
                                    Fehler: ${data.error || "Übersetzung fehlgeschlagen"}
                                </div>
                            `;
                            throw new Error(
                                data.error || "Übersetzung fehlgeschlagen"
                            );
                        }
                    } catch (err) {
                        console.error("Fehler bei der Übersetzung:", err);
                        
                        // Loader durch Fehlermeldung ersetzen falls noch vorhanden
                        if (conversationItemLoader) {
                            conversationItemLoader.innerHTML = `
                                <div class="error-message">
                                    Übersetzungsfehler: ${err.message}
                                </div>
                            `;
                        }
                    }
                })();

                break;

            case "explain":
            case "easy-language":
                (async () => {
                    try {
                        const complexityLevel =
                            option === "explain" ? "simple" : "easyLanguage";

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

                        
                        // Neues Element für die Modell-Antwort
                        const conversationItemModell =
                            document.createElement("li");
                        conversationItemModell.className = "sentence left";
                        const instructionsDiv = document.createElement("div");
                        instructionsDiv.className = "instructions";
                        instructionsDiv.innerHTML = '<div class="loader"></div>'
                        conversationItemModell.appendChild(instructionsDiv);
                        
                        conversation.appendChild(conversationItemUser);
                        conversation.appendChild(conversationItemModell);                        

                        const response = await fetch(
                            "https://neutral-aware-bonefish.ngrok-free.app/api/explain",
                            {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                    "ngrok-skip-browser-warning": "69420",
                                },
                                body: JSON.stringify({
                                    userLang: langParam,
                                    task: userText,
                                    complexityLevel: complexityLevel,
                                }),
                            }
                        );

                        if (!response.ok) {
                            throw new Error(
                                `HTTP ${response.status}: ${response.statusText}`
                            );
                        }

                        // Stream lesen (NDJSON)
                        const reader = response.body.getReader();
                        const decoder = new TextDecoder();
                        let buffer = "";

                        instructionsDiv.innerHTML = "";
                        while (true) {
                            const { value, done } = await reader.read();
                            if (done) break;

                            buffer += decoder.decode(value, { stream: true });
                            let lines = buffer.split("\n");
                            buffer = lines.pop(); // Letzte Zeile evtl. unvollständig behalten

                            for (const line of lines) {
                                if (!line.trim()) continue;
                                try {
                                    const json = JSON.parse(line);
                                    if (json.response) {
                                        instructionsDiv.innerHTML +=
                                            json.response.replace(
                                                /\n/g,
                                                "<br>"
                                            );
                                        // Scroll ans Ende
                                        const conversationContent =
                                            document.querySelector(
                                                ".conversation-content"
                                            );
                                        if (conversationContent) {
                                            conversationContent.scrollTop =
                                                conversationContent.scrollHeight;
                                        }
                                    }
                                } catch (err) {
                                    console.error(
                                        "Fehler beim JSON-Parsing:",
                                        err,
                                        line
                                    );
                                }
                            }
                        }
                    } catch (error) {
                        console.error("Fehler:", error);
                        const errorItem = document.createElement("li");
                        errorItem.className = "sentence left error";
                        errorItem.innerHTML = `
            <div class="error-message">
                Netzwerk-Fehler: ${error.message}
            </div>
        `;
                        conversation.appendChild(errorItem);
                    }
                })();

                break;

            default:
                console.warn("Unknown option:", option);
                alert("Unbekannte Option ausgewählt");
        }

        document.querySelector(".user-input").value = "";
    });
});

// Hilfsfunktion um Übersetzung anzuzeigen
// function displayTranslation(translation) {
//     const conversationContent = document.querySelector(".conversation-content");

//     if (conversationContent) {
//         const messageDiv = document.createElement("div");
//         messageDiv.className = "message assistant";
//         messageDiv.innerHTML = `
//             <div class="message-content">
//                 <strong>Übersetzung:</strong>
//                 <p>${translation}</p>
//             </div>
//         `;
//         conversationContent.appendChild(messageDiv);
//         conversationContent.scrollTop = conversationContent.scrollHeight;
//     }
// }
