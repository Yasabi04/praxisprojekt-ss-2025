const express = require('express');
const cors = require('cors');
const ollamaRoutes = require('./api-ollama');

const app = express();
const port = 3500; // Dein Backend-Port

// Middleware
app.use(cors({
    origin: [
        'http://localhost:5500',
        'http://127.0.0.1:5500', // Live Server Ports
        'http://127.0.0.1:5501',
        'http://localhost:5501'
    ],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// Routes
app.use('/api', ollamaRoutes); // Deine Ollama-Routes

// Test-Route
app.get('/', (req, res) => {
    res.json({ 
        message: 'Ollama Backend läuft!',
        routes: ['/api/instructions']
    });
});

// Server starten
app.listen(port, () => {
    console.log(`✅ Backend läuft auf http://localhost:${port}`);
    console.log(`✅ API verfügbar unter: http://localhost:${port}/api/instructions`);
});