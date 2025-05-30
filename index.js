const Joi = require('joi'); // this class Joi from package Joi is used for data validation and error display
// https://joi.dev/api/?v=17.13.3
const express = require('express'); 
const db = require('./db.js'); 
const liftTypeQueries = require('./sql/queries/lift_type.js');
const liftQueries = require('./sql/queries/lift.js');
const {seedUserData} = require('./sql/queries/seed_app_user.js'); 
const {seedLiftData} = require('./sql/queries/seed_lift.js');
const { errors } = require('pg-promise');


const app = express(); 

app.get('/ping', async (req, res) => res.send('pong'));

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

app.get('/lift', async(req,res) => {
  try{
    const result = await liftQueries.getAllLift();
    res.json(result.rows)
  }catch(err){
    console.error(err); 
    res.status(500).send('Internal Server Error')
  }
})

app.get('/lift/user/:userId', async (req,res) => {
  try {
    const {userId} = req.params; 
    const result = await liftQueries.getLiftByUserId(userId);
    res.json(result.rows); 
  } catch (err) {
    console.log(err); 
    res.status(500).send('Internal Server Error'); 
  }
})

//get lift by liftId
app.get('/lift/id/:liftId', async (req,res) => {
  try {
    const {liftId} = req.params; 
    const result = await liftQueries.getLiftByLiftId(liftId);
    res.json(result.rows); 
  } catch (err) {
    console.log(err); 
    res.status(500).send('Internal Server Error'); 
  }
})

const port = process.env.PORT || 3000;
console.log('About to start server...');
app.listen(port, async () => {
  console.log(`Server started: Listening on port ${port}...`);
  try {
    console.log('Running seed data...');
    await seedUserData();
    await seedLiftData(); 
  } 
  catch (err) {
    console.error('Error during seeding:', err);
  }
});