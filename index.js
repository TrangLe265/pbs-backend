const express = require('express'); 
const db = require('./db.js'); 

const app = express(); 

app.get('/', async(req,res) => {
    try {
        const result = await db.query('SELECT * FROM cars');
        res.json(result.rows);
      } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      }
})

const port = process.env.Port || 3000; 
app.listen(port, () => console.log(`Server started: Listening on port ${port}...`));