const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

// GET /api/users - Alle Benutzer abrufen
router.get('/allusers', async (req, res) => {
    try{
        const users = await prisma.user.findMany();
        res.json(users);
    }
    catch (error){
        res.status(500).json({ error: 'Fehler beim Abrufen der Benutzer' });
    }
})

router.get('/alldocs', async (req, res) => {
    try {
        const docs = await prisma.document.findMany();
        res.json(docs);
    } catch (error) {
        res.status(500).json({ error: 'Fehler beim Abrufen der Dokumente' });
    }
});

module.exports = router;