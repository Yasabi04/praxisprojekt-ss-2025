const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs')

const app = express();
const PORT = process.env.PORT || 3012;

app.use(cors({
    origin: '*', // Erlaubt Anfragen von jeder Herkunft
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Wichtig: OPTIONS für Preflight
    allowedHeaders: ['Content-Type', 'Authorization', 'ngrok-skip-browser-warning'], // Wichtig: ngrok-Header erlauben
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const dbAPI = require('./api/db-api');
app.use('/api', dbAPI);

app.get('/', (req, res) => {
    res.json({ message: 'Backend Server läuft :)' });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server (HTTPS) läuft auf 0.0.0.0:${PORT}`);
});
