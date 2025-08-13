const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs')

const app = express();
const PORT = process.env.PORT || 3012;

const allowedOrigins = [
  'http://localhost:5501',
  'http://127.0.0.1:5501',
];

//app.use(cors({
  //origin: function (origin, callback) {
    //if (!origin || allowedOrigins.includes(origin)) {
      //callback(null, true);
    //} else {
      //callback(new Error('Nicht erlaubter Origin: ' + origin));
    //}
  //}
//}));
app.use(cors())
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
