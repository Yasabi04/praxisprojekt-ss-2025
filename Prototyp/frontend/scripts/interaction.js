document.addEventListener("DOMContentLoaded", () => {
    let conversationHistory = [];

    const btn = document.querySelector(".send-message");
    let selectedOption = "translate";

    console.log("----------");

    const options = document.querySelectorAll(".option div[data-id]");
    const choosingDiv = document.querySelector(".chosing");
    const modeSelect = document.querySelector("#mode-select");
    const selection = document.querySelector(".selection");

    options.forEach((option) => {
        option.addEventListener("click", () => {
            selectedOption = option.getAttribute("data-id");
            choosingDiv.textContent = option.textContent;
            console.log("Selected option:", selectedOption);

            if (selection) {
                selection.style.display = "none";
            }
        });
    });

    modeSelect.addEventListener("mouseenter", () => {
        if (selection) {
            selection.style.display = "flex";
        }
    });

    modeSelect.addEventListener("mouseleave", () => {
        if (selection) {
            selection.style.display = "none";
        }
    });

    btn.addEventListener("click", () => {
        const userText = document.querySelector(".user-input").value.trim();
        const option = selectedOption;
        const conversation = document.querySelector(".conversation");
        const urlParams = new URLSearchParams(window.location.search);
        const langParam = urlParams.get("lang");

        console.log("User Text:", userText);
        console.log("Option:", option);
        console.log("Lang Parameter:", langParam);

        if (!userText) {
            return;
        }

        conversationHistory.push({ role: "User", request: userText });
        console.log(conversationHistory);

        const conversationItemUser = document.createElement("li");
        conversationItemUser.className = "sentence right";
        conversationItemUser.innerHTML = `
                            <div class = "user-request">
                                ${userText}
                            </div>
                        `;
        conversation.appendChild(conversationItemUser);

        const conversationItemModell = document.createElement("li");
        conversationItemModell.className = "sentence left";
        const instructionsDiv = document.createElement("div");
        instructionsDiv.className = "instructions";
        instructionsDiv.innerHTML = '<div class="loader"></div>';
        conversationItemModell.appendChild(instructionsDiv);

        conversation.appendChild(conversationItemModell);

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
                            "http://localhost:3500/api/translate",
                            {
                                method: "POST",
                                headers: new Headers({
                                    "Content-Type": "application/json",
                                }),
                                body: JSON.stringify({
                                    text: userText,
                                    target_lang: langParam.toUpperCase(),
                                }),
                            }
                        );

                        const responseText = await response.text();

                        if (!response.ok) {
                            throw new Error(
                                `HTTP ${response.status}: ${responseText}`
                            );
                        }

                        // Versuchen als JSON zu parsen
                        let data;
                        try {
                            data = JSON.parse(responseText);
                        } catch (parseError) {
                            throw new Error(
                                "Server returned non-JSON response: " +
                                    responseText.substring(0, 200)
                            );
                        }

                        if (data.success) {
                            instructionsDiv.innerHTML = data.translation;
                        } else {
                            // Loader durch Fehlermeldung ersetzen
                            conversationItemModell.innerHTML = `
                                <div class="error-message">
                                    Fehler: ${
                                        data.error ||
                                        "Übersetzung fehlgeschlagen"
                                    }
                                </div>
                            `;
                            throw new Error(
                                data.error || "Übersetzung fehlgeschlagen"
                            );
                        }
                    } catch (err) {
                        if (conversationItemModell) {
                            conversationItemModell.innerHTML = `
                                <div class="error-message">
                                    Sorry :( At the moment DeepL does not support iranian language support
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

                        const response = await fetch(
                            "http://mivs15.gm.fh-koeln.de:3500/api/explain",
                            {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                    "ngrok-skip-browser-warning": "69420",
                                },
                                body: JSON.stringify({
                                    userLang: langParam,
                                    task: userText,
                                    conversation: conversationHistory,
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
                            buffer = lines.pop();

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
                alert("Unbekannte Option ausgewählt");
        }

        document.querySelector(".user-input").value = "";
    });
});