# Settle

> Eine KI-gestützte Plattform zum besseren Verständnis behördlicher Dokumente für Menschen mit Migrationshintergrund

## 📋 Über das Projekt

Settle ist eine Webanwendung, die Menschen dabei hilft, komplexe behördliche Dokumente und Amtstexte zu verstehen. Mithilfe von künstlicher Intelligenz werden schwer verständliche Dokumente und Textpassagen in verständlicher Sprache erklärt und bei Bedarf in die Muttersprache übersetzt.

### Zielgruppe

- Menschen mit Migrationshintergrund
- Personen mit eingeschränkten Deutschkenntnissen
- Alle, die Unterstützung beim Verstehen von Behördendokumenten benötigen

### Kernfunktionen

- 🤖 **KI-gestützte Erklärungen**: Verständliche Erläuterungen komplexer Textpassagen
- 🌍 **Mehrsprachige Übersetzungen**: Unterstützung für 6 Sprachen
- 💬 **Interaktive Hilfe**: Fragen zu spezifischen Textabschnitten stellen

## 🌐 Unterstützte Sprachen

- 🇩🇪 Deutsch
- 🇬🇧 Englisch
- 🇸🇦 Arabisch
- 🇫🇷 Französisch
- 🇹🇷 Türkisch
- 🇮🇷 Persisch (Farsi) -> kann momentan leider nur im KI-Modell benutzt werden!

## 🛠️ Technologie-Stack

### Frontend
- HTML5
- CSS3
- Vanilla JavaScript

### Backend
- Node.js
- Express.js
- Docker
- Ollama (Qwen Modell)
- DeepL API

## 📦 Installation

### Voraussetzungen

- Ein moderner Webbrowser (Chrome, Firefox, Safari, Edge, ...)
- Gute Internetverbindung

### Setup für Nutzer

Die Anwendung läuft vollständig auf einem Server - du musst nichts installieren!

1. **Öffne die Anwendung im Browser**
```
https://yasabi04.github.io/praxisprojekt-ss-2025/Prototyp/frontend/html/
```

2. **Loslegen**: Dokumente einsehen und direkt nutzen

Das war's! Alle anderen Backend-Dienste (Docker, Ollama, APIs) laufen nämlich bereits auf dem Server.

---


### Voraussetzungen für Entwickler

- Node.js (v18 oder höher)
- Zugriff auf den Backend-Server oder lokale Docker-Installation
- DeepL API Key

### Lokale Entwicklungsumgebung

1. **Repository klonen**
```bash
git clone https://github.com/yasabi04/praxisprojekt-ss-2025.git
cd Prototyp/temp-backend
```

2. **Dependencies installieren**
```bash
npm install
```

3. **Umgebungsvariablen konfigurieren**
```bash
cp .env.example .env
```

Trage die Server-URLs und API Keys ein:
```
DEEPL_API_KEY=your_api_key_here
PORT=3000
```

4. **Entwicklungsserver starten**
```bash
node server.js
```

Die Frontend-Anwendung ist nun unter `http://localhost:3500` erreichbar und kommuniziert mit dem Backend-Server.

## 🐳 Backend-Infrastruktur

Das Backend läuft in Docker-Containern auf einem Server und umfasst:

- **Ollama Container**: Hostet das Qwen KI-Modell
- **Node.js/Express**: Verarbeitet Anfragen und kommuniziert mit Ollama
- **ngrok**: Sorgt für sichere HTTPS-Verbindungen zwischen Server und Client

*Hinweis: Als Endnutzer musst du dich nicht um die Backend-Infrastruktur kümmern.*

## 📖 Verwendung

1. **Dokument finden**: Suche eines aus einer Vielzahl behördlicher Dokumente aus
2. **Text auswählen**: Markiere die Textpassage, die du nicht verstehst
3. **Erklärung anfordern**: Frage das KI Modell für eine verständliche Erläuterung
4. **Übersetzen**: Wähle optional eine Zielsprache für die Übersetzung


### DeepL API

Für die Übersetzungsfunktion wird ein DeepL API Key benötigt. Registriere dich unter [deepl.com/pro-api](https://www.deepl.com/pro-api) für einen kostenlosen oder kostenpflichtigen Account.


## 👥 Autoren

- Yassin El Fraygui

---

**Hinweis**: Dieses Projekt dient zur Unterstützung beim Verständnis behördlicher Dokumente und ersetzt keine rechtliche Beratung.
