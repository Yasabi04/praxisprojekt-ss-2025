class PDFViewer {
    constructor() {
        this.pdfDoc = null;
        this.scale = 0.6;
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

        const urlParams = new URLSearchParams(window.location.search);
        const docId = urlParams.get('pdf');
        if (!docId) {
            const url = '../tmp-pdf/asylerstantrag.pdf';
            console.log("Loading fallback PDF:", url);
            this.pdfDoc = await pdfjsLib.getDocument(url).promise;
            await this.renderAllPages();
            return;
        }

        const apiUrl = `http://mivs15.gm.fh-koeln.de:3500/api/finddoc/${docId}`;

        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        try {
            const response = await fetch(apiUrl, {
                signal: controller.signal,
                headers: new Headers({
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    "ngrok-skip-browser-warning": "69420"
                })
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            if (!data.pdfFile) {
                throw new Error('Keine PDF-Datei in Response');
            }

            let bytes;
            
            if (data.pdfFile && typeof data.pdfFile === 'object') {
                if (data.pdfFile.data && Array.isArray(data.pdfFile.data)) {
                    bytes = new Uint8Array(data.pdfFile.data);
                } else {
                    bytes = new Uint8Array(Object.values(data.pdfFile));
                }
            } else if (typeof data.pdfFile === 'string') {
                console.log("That didn't go to plan. PDF File is a String")
            }
            
            if (bytes.length === 0) {
                throw new Error('PDF data is empty');
            }

            this.pdfDoc = await pdfjsLib.getDocument(bytes).promise;
            await this.renderAllPages();
            
        } catch (fetchError) {
            clearTimeout(timeoutId);
            
            if (fetchError.name === 'AbortError') {
                throw new Error('API request timeout (10s)');
            } else {
                throw fetchError;
            }
        }
        
    } catch (error) {
        try {
            const fallbackUrl = '../tmp-pdf/asylerstantrag.pdf';
            this.pdfDoc = await pdfjsLib.getDocument(fallbackUrl).promise;
            await this.renderAllPages();
            console.log("Fallback PDF loaded successfully");
        } catch (fallbackError) {
            document.getElementById("doc-space").innerHTML = `
                <div style="text-align: center; padding: 2rem; color: var(--font-color);">
                    <h3>PDF could not be loaded</h3>
                    <p>API Error: ${error.message}</p>
                    <p>Fallback Error: ${fallbackError.message}</p>
                    <p>Doc-ID: ${docId}</p>
                    <button onclick="location.reload()">Retry</button>
                </div>
            `;
        }
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

            await page.render({
                canvasContext: ctx,
                transform: transform,
                viewport: viewport,
            }).promise;

            const textLayerDiv = document.createElement("div");
            textLayerDiv.className = "textLayer";
            textLayerDiv.style.position = "absolute";
            textLayerDiv.style.left = "0";
            textLayerDiv.style.top = "0";
            textLayerDiv.style.width = Math.floor(viewport.width) + "px";
            textLayerDiv.style.height = Math.floor(viewport.height) + "px";
            textLayerDiv.style.overflow = "hidden";
            textLayerDiv.style.lineHeight = "1.0";

            textLayerDiv.style.setProperty("--scale-factor", this.scale);

            const pageContainer = document.createElement("div");
            pageContainer.className = "page-container";
            pageContainer.style.position = "relative";
            pageContainer.style.width = Math.floor(viewport.width) + "px";
            pageContainer.style.height = Math.floor(viewport.height) + "px";
            pageContainer.style.marginBottom = "2rem";

            pageContainer.style.setProperty("--scale-factor", this.scale);

            pageContainer.appendChild(canvas);
            pageContainer.appendChild(textLayerDiv);
            this.pagesContainer.appendChild(pageContainer);

            const textContent = await page.getTextContent();

            try {
                await pdfjsLib.renderTextLayer({
                    textContentSource: textContent,
                    container: textLayerDiv,
                    viewport: viewport,
                    textDivs: [],
                }).promise;

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

    createSimpleTextOverlay(container, textContent, viewport) {
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

document.addEventListener("DOMContentLoaded", () => {
    new PDFViewer();
});