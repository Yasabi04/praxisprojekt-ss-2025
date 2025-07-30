const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3012;

// Middleware MUSS vor den Routen stehen
app.use(cors());
app.use(express.json());

// API Routen (PrismaClient wird in db-api.js initialisiert)
const dbAPI = require('./api/db-api');
app.use('/api', dbAPI);
 
app.get('/', (req, res) => {
    res.json({ message: 'Backend Server läuft :)' });
});

app.listen(PORT, () => {
    console.log(`Server läuft auf Port ${PORT}`);
});