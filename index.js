const Joi = require('joi'); // this class Joi from package Joi is used for data validation and error display
// https://joi.dev/api/?v=17.13.3
const express = require('express'); 
const db = require('./db.js'); 
const liftTypeQueries = require('./sql/queries/lift_type.js');
const liftQueries = require('./sql/queries/lift.js');
const dotsQueries = require('./sql/queries/dots_score.js');
const dotsAssessmentQueries = require('./sql/queries/dots_assessment.js'); 
const coefficientsQueries = require('./sql/queries/coefficients.js');
const {seedUserData} = require('./sql/queries/seed_app_user.js'); 
const {seedLiftData} = require('./sql/queries/seed_lift.js');

const app = express(); 
require('./swagger')(app);

app.use(express.json()); 

//Define a JOI schemna for data validation
const liftSchema = Joi.object({
  user_id: Joi.string().uuid().required(),
  weight_lifted: Joi.number().positive().required(),
  lift_type_id: Joi.string().uuid().required(),
  date: Joi.date().required(),
  notes: Joi.string().allow('').optional()
});


/**
 * @swagger
 * /lift-type:
 *   get:
 *     summary: Get all available lift types
 *     tags: [Lift types]
 *     responses:
 *       200:
 *         description: Existing lift types
 */
app.get('/lift-type', async(req,res) => {
    try {
        const result = await liftTypeQueries.getAllLiftTypes();
        res.json(result.rows);
      } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      }
})

//get a specific lift by liftId
/**
 * @swagger
 * /lift/{liftId}:
 *   get:
 *     summary: Get a specific lift by its ID
 *     tags: [Lifts]
 *     parameters:
 *       - in: path
 *         name: liftId
 *         schema:
 *           type: string
 *         required: true
 *         description: The lift id
 *     responses:
 *       200:
 *         description: The lift response by id
 */
app.get('/lift/:liftId', async (req,res) => {
  try {
    const {liftId} = req.params; 
    const result = await liftQueries.getLiftByLiftId(liftId);
    res.json(result.rows); 
  } catch (err) {
    console.log(err); 
    res.status(500).send('Internal Server Error'); 
  }
})

// get all lifts of a specific type by userId 
/**
 * @swagger
 * /lift/user/{userId}/{liftTypeId}:
 *   get:
 *     summary: Get a user's lifts of a certain lift type
 *     tags: [Lifts]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *       - in: path
 *         name: liftTypeId
 *         schema:
 *           type: string
 *         required: true
 *         description: The lift type ID
 *     responses:
 *       200:
 *         description: The lift response by lift type id and user id
 * 
 */
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


//add new lift for an user
/**
 * @swagger
 * /lift:
 *   post:
 *     summary: Create a new lift
 *     tags: [Lifts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *                 format: uuid
 *               weight_lifted:
 *                 type: number
 *               lift_type_id:
 *                 type: string
 *                 format: uuid
 *               date:
 *                 type: string
 *                 format: date
 *               notes:
 *                 type: string
 *             required:
 *               - user_id
 *               - weight_lifted
 *               - lift_type_id
 *               - date
 *     responses:
 *       201:
 *         description: Lift added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 lift:
 *                   type: object
 *                   properties:
 *                     user_id:
 *                       type: string
 *                     weight_lifted:
 *                       type: number
 *                     lift_type_id:
 *                       type: string
 *                     date:
 *                       type: string
 *                     notes:
 *                       type: string
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 details:
 *                   type: array
 *                   items:
 *                     type: string
 */
app.post('/lift', async (req, res) => {
  const { error, value } = liftSchema.validate(req.body, { abortEarly: false });
  if (error) {
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
/**
 * @swagger
 * /lift/{liftId}:
 *   delete:
 *     summary: Delete a specific lift by its ID
 *     tags: [Lifts]
 *     parameters:
 *       - in: path
 *         name: liftId
 *         schema:
 *           type: string
 *         required: true
 *         description: The lift id
 *     responses:
 *       200:
 *         description: The lift was successfully deleted
 */
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
/**
 * @swagger
 * /lift/{liftId}:
 *   put:
 *     summary: Update an existing lift by its ID
 *     tags: [Lifts]
 *     parameters:
 *       - in: path
 *         name: liftId
 *         schema:
 *           type: string
 *         required: true
 *         description: The lift id     
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               weight_lifted:
 *                 type: number
 *               date:
 *                 type: string
 *                 format: date
 *               notes:
 *                 type: string
 *             required:
 *               - weight_lifted
 *               - date
 *     responses:
 *       200:
 *         description: Lift was updated successfully
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 details:
 *                   type: array
 *                   items:
 *                     type: string
 */
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

   res.status(200).send({message: 'Lift edited successfully'});
    
  } catch (err){
      console.log(err); 
      res.status(500).send('Internal Server Error'); 
  }
})

//get all the dots score of a specific user by their userId
/**
 * @swagger
 * /dots/user/{userId}:
 *   get:
 *     summary: get all DOTS score recorder for an user by the user ID
 *     tags: [DOTS scores]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id     
 *     responses:
 *       200:
 *         description: The dots score response with user id
 */
app.get('/dots/user/:userId', async(req,res) => {
  try {
    const {userId} = req.params;
    const result = await dotsQueries.getAllScore(userId);
    res.json(result.rows);
  }catch(err){
    console.log(err); 
    res.status(500).send('Internal Server Error'); 
  }
})

/**
 * @swagger
 * /dots/{scoreId}:
 *   get:
 *     summary: get a specifc DOTS score by the score ID
 *     tags: [DOTS scores]
 *     parameters:
 *       - in: path
 *         name: scoreId
 *         schema:
 *           type: string
 *         required: true
 *         description: The score id     
 *     responses:
 *       200:
 *         description: The dots score response with score id
 */
app.get('/dots/:scoreId', async (req, res) => {
  try {
    const { scoreId } = req.params;
    console.log(scoreId); 
    const result = await dotsQueries.getScoreById(scoreId);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

/**
 * @swagger
 * /dots/{scoreId}:
 *   delete:
 *     summary: delete a specifc DOTS score by the score ID
 *     tags: [DOTS scores]
 *     parameters:
 *       - in: path
 *         name: scoreId
 *         schema:
 *           type: string
 *         required: true
 *         description: The score id     
 *     responses:
 *       200:
 *         description: DOTS score deleted successfully
 */
app.delete('/dots/:scoreId', async (req, res) => {
  try {
    const { scoreId } = req.params;
    await dotsQueries.deleteScoreById(scoreId);
    res.status(200).send('DOTS score deleted successfully')
    
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

//add new score for an user
/** 
* @swagger
 * /dots:
 *   post:
 *     summary: Add a new DOTS score
 *     tags: [DOTS scores]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               score: 
 *                 type: number
 *               user_id:
 *                 type: string
 *                 format: uuid
 *               bench_lift_id:
 *                 type: string
 *                 format: uuid
 *               squat_lift_id:
 *                 type: string
 *                 format: uuid
 *               deadlift_lift_id:
 *                 type: string
 *                 format: uuid   
 *             required:
 *               - user_id
 *               - score
 *               - bench_lift_id
 *               - squat_lift_id
 *               - deadlift_lift_id
 *     responses:
 *       201:
 *         description: Lift added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 score:
 *                   type: object
 *                   properties:
 *                     user_id:
 *                       type: string
 *                     score:
 *                       type: number
 *                     bench_lift_id:
 *                       type: string
 *                     squat_lift_id:
 *                       type: string
 *                     deadlift_lift_id:
 *                       type: string
 */
app.post('/dots', async(req,res) => {
  try {
    const { score, user_id, bench_lift_id, squat_lift_id, deadlift_lift_id } = req.body; 
    await dotsQueries.addScore(score, user_id, bench_lift_id, squat_lift_id, deadlift_lift_id); 

    res.status(201).send({
      message: 'New DOTS score added successfully',
      dots: { score, bench_lift_id, squat_lift_id, deadlift_lift_id }
    });

  } catch(err){
    console.error(err); 
    res.status(500).send('Internal Server Error')
  }
})


//Get all classifications for DOTS Score
/**
 * @swagger
 * /classification:
 *   get:
 *     summary: Get all the DOTS score classifications
 *     tags: [DOTS classifications]
 *     responses:
 *       200:
 *         description: The classifications response 
 */
app.get('/classification', async(req,res) => {
  try {
    const result = await dotsAssessmentQueries.getAllClassifications(); 
    res.json(result.rows); 
  }catch(err){
    console.error(err); 
    res.status(500).send('Internal Server Error')
  }
})

//Get the classification for a specific score
/**
 * @swagger
 * /classification/score/{score}:
 *   get:
 *     summary: Get classification for the specific given score
 *     tags: [DOTS classifications]
 *     parameters: 
 *      - in: path
 *        name: score
 *        schema: 
 *          type: number
 *        required: true
 *        description: The DOTS score
 *     responses:
 *       200:
 *         description: The classifications response by the given score
 */
app.get('/classification/score/:score', async(req,res) => {
  try {
    const score = Number(req.params.score);
    const result = await dotsAssessmentQueries.getClassificationByScore(score); 
    res.json(result.rows); 

  } catch (err){
    console.error(err);
    res.status(500).send('Internal Server Error')
  }
})

//get the coefficients for dots calculation by sex
/**
 * @swagger
 * /coefficients/{sex}:
 *   get:
 *     summary: Get the coefficients needed for DOTS calculation by sex 
 *     tags: [Coefficients by sex]
 *     parameters:
 *       - in: path
 *         name: sex
 *         schema:
 *           type: string
 *           enum: [male, female]
 *         required: true
 *         description: 2 possible values - 'male' or 'female'
 *     responses:
 *       200:
 *         description: The coefficients response by sex
 */
app.get('/coefficients/:sex', async(req,res) => {
   try {
      const sex = req.params.sex; 
      const result = await coefficientsQueries.getCoefficientsBySex(sex); 
      res.json(result.rows); 
   } catch (err) {
    console.error(err); 
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