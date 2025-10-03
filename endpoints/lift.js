const liftQueries = require('../sql/queries/lift.js');
const Joi = require('joi');

const liftSchema = Joi.object({
  user_id: Joi.string().uuid().required(),
  weight_lifted: Joi.number().positive().required(),
  lift_type_id: Joi.number().required(),
  date: Joi.date().required(),
  notes: Joi.string().allow('').optional()
});

  /**
   * @swagger
   * /lift/{liftId}:
   *   get:
   *     summary: Get a specific lift by ID
   *     tags: [Lifts]
   */
    const getLiftByLiftId = async (req,res) => {
        try {
            const { liftId } = req.params;
            const result = await liftQueries.getLiftByLiftId(liftId);
            res.json(result.rows);
        } catch (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        }
  };

  const getLiftByTypeByUserId = async (req,res) => {
    try {
        const {userId, liftTypeId} = req.params; 
        const result = await liftQueries.getLiftByTypeByUserId(userId, liftTypeId);
        res.json(result.rows); 

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Internal Server Error');
    }
  }

  /**
   * @swagger
   * /lift:
   *   post:
   *     summary: Create a new lift
   *     tags: [Lifts]
   */
  const addLift =  async (req, res) => {
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
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  };

  /**
   * @swagger
   * /lift/{liftId}:
   *   put:
   *     summary: Update a lift by ID
   *     tags: [Lifts]
   */
  const editLiftById = async (req,res) => {
    const { error } = liftSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        message: "Validation error",
        details: error.details.map(d => d.message)
      });
    }

    try {
      const { liftId } = req.params;
      const { weight_lifted, date, notes } = req.body;
      await liftQueries.editLiftById(weight_lifted, date, notes, liftId);
      res.status(200).send({ message: 'Lift edited successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  };

  /**
   * @swagger
   * /lift/{liftId}:
   *   delete:
   *     summary: Delete a lift by ID
   *     tags: [Lifts]
   */
  const deleteLiftById = async (req,res) => {
    try {
      const { liftId } = req.params;
      await liftQueries.deleteLiftById(liftId);
      res.status(200).send({ message: 'Lift deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  };


module.exports = (app) => {
    app.get('/lift/:liftId', getLiftByLiftId); 
    app.get('/lift/:liftTypeId/:userId', getLiftByTypeByUserId);
    app.post('/lift', addLift);
    app.put('/lift/:liftId', editLiftById);
    app.delete('/lift/:liftId',deleteLiftById); 

};
