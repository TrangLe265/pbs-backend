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
 *     parameters:
 *       - in: path
 *         name: liftId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The lift's ID
 *     responses:
 *       200:
 *         description: Lift retrieved successfully
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

  /**
 * @swagger
 * /lift/{liftTypeId}/{userId}:
 *   get:
 *     summary: Get all lifts of a specific type by a user
 *     tags: [Lifts]
 *     parameters:
 *       - in: path
 *         name: liftTypeId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The lift type's ID
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The user's UUID
 *     responses:
 *       200:
 *         description: List of lifts for the user and type
 */
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *               weight_lifted:
 *                 type: number
 *               lift_type_id:
 *                 type: integer
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
 *       400:
 *         description: Validation error
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
 *     parameters:
 *       - in: path
 *         name: liftId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The lift's ID
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
 *         description: Lift edited successfully
 *       400:
 *         description: Validation error
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
 *     parameters:
 *       - in: path
 *         name: liftId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The lift's ID
 *     responses:
 *       200:
 *         description: Lift deleted successfully
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
