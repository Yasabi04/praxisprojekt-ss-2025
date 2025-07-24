class PDFViewer {
    constructor() {
        this.pdfDoc = null;
        this.scale = 1.2;
        this.pagesContainer = document.getElementById("pdf-pages-container");

        if (this.pagesContainer) {
            this.initControls();
            this.loadPDF();
        } else {
            console.error("PDF Pages Container not found");
        }
    }

    initControls() {
        document
            .getElementById("zoom-in")
            ?.addEventListener("click", () => this.zoomIn());
        document
            .getElementById("zoom-out")
            ?.addEventListener("click", () => this.zoomOut());
    }

    async loadPDF() {
        try {
            pdfjsLib.GlobalWorkerOptions.workerSrc =
                "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

            const url = "../tmp-pdf/asylerstantrag.pdf";
            console.log("Loading PDF:", url);

            this.pdfDoc = await pdfjsLib.getDocument(url).promise;
            await this.renderAllPages();
            console.log("PDF loaded successfully");
        } catch (error) {
            console.error("Error loading PDF:", error);
            document.getElementById("doc-space").innerHTML = `
                        <div style="text-align: center; padding: 2rem; color: var(--font-color);">
                            <h3>PDF could not be loaded</h3>
                            <p>Error: ${error.message}</p>
                        </div>
                    `;
        }
    }

    async renderAllPages() {
        this.pagesContainer.innerHTML = "";

        for (let pageNum = 1; pageNum <= this.pdfDoc.numPages; pageNum++) {
            await this.renderPage(pageNum);
        }
    }

    async renderPage(pageNum) {
        try {
            const page = await this.pdfDoc.getPage(pageNum);
            const viewport = page.getViewport({
                scale: this.scale,
            });
            const outputScale = window.devicePixelRatio || 1;

            // Canvas erstellen
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            canvas.width = Math.floor(viewport.width * outputScale);
            canvas.height = Math.floor(viewport.height * outputScale);
            canvas.style.width = Math.floor(viewport.width) + "px";
            canvas.style.height = Math.floor(viewport.height) + "px";
            canvas.className = "pdf-page";
            canvas.setAttribute("data-page", pageNum);

            const transform =
                outputScale !== 1
                    ? [outputScale, 0, 0, outputScale, 0, 0]
                    : null;

            // Canvas rendern
            await page.render({
                canvasContext: ctx,
                transform: transform,
                viewport: viewport,
            }).promise;

            // Text-Layer erstellen
            const textLayerDiv = document.createElement("div");
            textLayerDiv.className = "textLayer";
            textLayerDiv.style.position = "absolute";
            textLayerDiv.style.left = "0";
            textLayerDiv.style.top = "0";
            textLayerDiv.style.width = Math.floor(viewport.width) + "px";
            textLayerDiv.style.height = Math.floor(viewport.height) + "px";
            textLayerDiv.style.overflow = "hidden";
            textLayerDiv.style.lineHeight = "1.0";

            // WICHTIG: CSS Scale-Factor Variable setzen
            textLayerDiv.style.setProperty("--scale-factor", this.scale);

            // Page Container
            const pageContainer = document.createElement("div");
            pageContainer.className = "page-container";
            pageContainer.style.position = "relative";
            pageContainer.style.width = Math.floor(viewport.width) + "px";
            pageContainer.style.height = Math.floor(viewport.height) + "px";
            pageContainer.style.marginBottom = "2rem";

            // Auch auf Container setzen (doppelt hält besser)
            pageContainer.style.setProperty("--scale-factor", this.scale);

            pageContainer.appendChild(canvas);
            pageContainer.appendChild(textLayerDiv);
            this.pagesContainer.appendChild(pageContainer);

            // Text Content laden
            const textContent = await page.getTextContent();

            // TextLayer rendern
            try {
                await pdfjsLib.renderTextLayer({
                    textContent: textContent,
                    container: textLayerDiv,
                    viewport: viewport,
                    textDivs: [],
                }).promise;

                console.log(
                    `Page ${pageNum}: Text layer rendered with ${textContent.items.length} items`
                );
            } catch (textError) {
                console.warn(
                    `TextLayer failed for page ${pageNum}, creating simple text overlay:`,
                    textError
                );
                this.createSimpleTextOverlay(
                    textLayerDiv,
                    textContent,
                    viewport
                );
            }
        } catch (error) {
            console.error(`Error rendering page ${pageNum}:`, error);
        }
    }
    // FALLBACK-Methode für einfachen Text-Overlay
    createSimpleTextOverlay(container, textContent, viewport) {
        // Alle Text-Items zu einem String zusammenfügen
        const textItems = textContent.items.map((item) => item.str).join(" ");

        const textDiv = document.createElement("div");
        textDiv.style.position = "absolute";
        textDiv.style.top = "0";
        textDiv.style.left = "0";
        textDiv.style.width = "100%";
        textDiv.style.height = "100%";
        textDiv.style.color = "transparent";
        textDiv.style.userSelect = "text";
        textDiv.style.cursor = "text";
        textDiv.style.fontSize = "12px";
        textDiv.style.fontFamily = "sans-serif";
        textDiv.style.lineHeight = "1.2";
        textDiv.style.padding = "10px";
        textDiv.style.whiteSpace = "pre-wrap";
        textDiv.textContent = textItems;

        container.appendChild(textDiv);
        console.log("Simple text overlay created");
    }

    async zoomIn() {
        this.scale += 0.3;
        await this.renderAllPages();
    }

    async zoomOut() {
        if (this.scale <= 0.6) return;
        this.scale -= 0.3;
        await this.renderAllPages();
    }
}

// PDF Viewer initialisieren
document.addEventListener("DOMContentLoaded", () => {
    console.log("Initializing PDF Viewer...");
    new PDFViewer();
});
