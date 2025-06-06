const Joi = require('joi'); // this class Joi from package Joi is used for data validation and error display
// https://joi.dev/api/?v=17.13.3
const express = require('express'); 
const db = require('./db.js'); 
const liftTypeQueries = require('./sql/queries/lift_type.js');
const liftQueries = require('./sql/queries/lift.js');
const dotsQueries = require('./sql/queries/dots_score.js');
const {seedUserData} = require('./sql/queries/seed_app_user.js'); 
const {seedLiftData} = require('./sql/queries/seed_lift.js');
const { errors } = require('pg-promise');


const app = express(); 

app.use(express.json()); 

//Define a JOI schemna for data validation
const liftSchema = Joi.object({
  user_id: Joi.string().uuid().required(),
  weight_lifted: Joi.number().positive().required(),
  lift_type_id: Joi.string().uuid().required(),
  date: Joi.date().required(),
  notes: Joi.string().allow('').optional()
});


//get id of a lift-type
//TODO: REMOVE THIS ENDPOINT AFTER TESTING ALL DONE
app.get('/lift-type/:name', async (req, res) => {
  try {
      const { name } = req.params; 
      const result = await liftTypeQueries.getLiftTypeByName(name);
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
});

//get all lifts of all users
//TODO: REMOVE THIS ENDPOINT AFTER TESTING ALL DONE
app.get('/lift', async(req,res) => {
  try{
    const result = await liftQueries.getAllLift();
    res.json(result.rows)
  }catch(err){
    console.error(err); 
    res.status(500).send('Internal Server Error')
  }
})

//get all the lift types
app.get('/lift-type', async(req,res) => {
    try {
        const result = await liftTypeQueries.getAllLiftTypes();
        res.json(result.rows);
      } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      }
})

//get all lifts of a specific typer by an user 
app.get('/lift/user/:userId/:liftTypeId', async (req,res) => {
  try {
    const { userId, liftTypeId } = req.params;  
    const result = await liftQueries.getLiftByTypeByUserId(userId, liftTypeId);
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

//add new lift for an user
app.post('/lift', async (req, res) => {
  const { error, value } = liftSchema.validate(req.body, { abortEarly: false });
  if (error) {
    // Return all validation errors
    return res.status(400).json({
      message: "Validation error",
      details: error.details.map(d => d.message)
    });
  }

  try {
    const { user_id, weight_lifted, lift_type_id, date, notes } = value;
    await liftQueries.addLift(user_id, weight_lifted, lift_type_id, date, notes);

    res.status(201).send({
      message: 'Lift added successfully',
      lift: { user_id, weight_lifted, lift_type_id, date, notes }
    });
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
})

//delete lift by liftId
app.delete('/lift/:liftId', async(req,res) => {
  try {
    const { liftId } = req.params;
    await liftQueries.deleteLiftById(liftId); 
    res.status(200).send({ message: 'Lift deleted successfully' });
  } catch (err){
    console.log(err); 
    res.status(500).send('Internal Server Error'); 
  }
})

//edit lift by its id
app.put('/lift/:liftId', async(req,res) => {
  try {
    const { error, value } = liftSchema.validate(req.body, { abortEarly: false });
    if (error) {
    // Return all validation errors
    return res.status(400).json({
      message: "Validation error",
      details: error.details.map(d => d.message)
    });
  }

    const {liftId} = req.params;
    const { weight_lifted, date, notes } = req.body;
    await liftQueries.editLiftById(
      weight_lifted, date, notes, liftId
    );

   res.status(201).send({message: 'Lift edited successfully'});
    
  } catch (err){
      console.log(err); 
      res.status(500).send('Internal Server Error'); 
  }
})

app.get('/dots/:userId', async(req,res) => {
  try {
    const {userId} = req.params;
    const result = await dotsQueries.getAllScore(userId);
    res.json(result.rows);
  }catch(err){
    console.log(err); 
    res.status(500).send('Internal Server Error'); 
  }
})

//TODO: add Post endpoint for dots
app.post('/dots/:userId', async(req,res) => {

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