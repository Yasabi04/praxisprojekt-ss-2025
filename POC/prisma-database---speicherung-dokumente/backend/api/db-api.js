const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();


// localhost:3012/api/...
router.get('/allusers', async (req, res) => {
    try{
        const users = await prisma.user.findMany();
        res.json(users);
    }
    catch (error){
        res.status(500).json({ error: 'Fehler beim Abrufen der Benutzer' });
    }
})

router.get('/safedDocs/:id', async (req, res) => {
    try{
        const reqId = req.params.id
        const docs = await prisma.document.findMany({
            where: {
                authorId: reqId
            }
        })
        if(docs.length > 0){
            res.json(docs)
        }
        else if(docs.length == 0) {
            res.json({ message: 'Keine Dokumente gespeichert' })
        }
    }
    catch (error){
        console.log(error + 'B A D')
        res.status(500).json({ error: 'Fehler beim Abrufen'})
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