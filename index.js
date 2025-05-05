const Joi = require('joi'); // this class Joi from package Joi is used for data validation and error display
// https://joi.dev/api/?v=17.13.3
const express = require('express'); 
const db = require('./db.js'); 
const liftTypeQueries = require('./sql/queries/lift_type.js');

const app = express(); 

app.get('/',async(req,res) => {
  res.json('Testing server')
})

app.get('/lift-type', async(req,res) => {
    try {
        const result = await liftTypeQueries.getAllLiftTypes();
        res.json(result.rows);
      } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      }
})

app.get('/lift-type/:name', async (req, res) => {
  try {
      const { name } = req.params; // Extract the 'name' parameter from the URL
      const result = await liftTypeQueries.getLiftTypeByName(name);
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
});

const port = process.env.Port || 3000; 
app.listen(port, () => console.log(`Server started: Listening on port ${port}...`));