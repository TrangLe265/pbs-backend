import * as  liftQueries from '../sql/queries/lift';
import Joi from 'joi';
import { Request, Response, Application } from "express";
import {AllLiftByTypeParam, EditLift, Lift, LiftIdParam, NewLift} from '../types/Lift.interface'

const liftSchema = Joi.object({
  user_id: Joi.number().integer().required(),
  weight_lifted: Joi.number().positive().required(),
  lift_type_id: Joi.number().integer().required(),
  date: Joi.date().required(),
  notes: Joi.string().allow('').optional()
});

const editLiftSchema = Joi.object({
  weight_lifted: Joi.number().positive().required(),
  date: Joi.date().optional(),
  notes: Joi.string().optional()
});

  /**
 * @swagger
 * /lift/{id}:
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
const getLiftByLiftId = async (req: Request<LiftIdParam>, res: Response<Lift|{message: string}>) => {
  try {
    const id  = Number(req.params.id);
    if (isNaN(id)) { 
      return res.status(400).json({ message: 'Invalid liftId' }); 
    }

    const result = await liftQueries.getLiftByLiftId(id);
    const lift : Lift | undefined = result.rows[0]; 
    if (!lift){
      return res.status(404).json({message: "No lift found"})
    }
    res.json(lift);
  } catch (err) {
    console.error(err);
    res.status(500).json({message:"Internal Server Error"});
  }
  };

  /**
 * @swagger
 * /lift/{lift_type_id}/{user_id}:
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
 *           type: integer
 *         description: The user's ID
 *     responses:
 *       200:
 *         description: List of lifts for the user and type
 */
  const getLiftByTypeByUserId = async (req: Request<AllLiftByTypeParam>, res: Response<Lift[]|{message: string}>) => {
    try {
        const user_id = Number(req.params.user_id);
        const lift_type_id = Number(req.params.lift_type_id); 
        if (isNaN(user_id) || isNaN(lift_type_id)) {
          return res.status(400).json({message: "Invalid user id or lift type id"})
        }

        const result = await liftQueries.getLiftByTypeByUserId(user_id, lift_type_id);
        const lifts : Lift[] | undefined = result.rows
        if (lifts?.length === 0){
          return res.status(404).json({message:"There is no lift of this type for this user"})
        }
        res.json(lifts); 

    } catch (err) {
        console.error((err as Error).message);
        res.status(500).json({message:'Internal Server Error'});
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
 *                 type: integer
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
  const addLift =  async (
    req: Request<{},{},NewLift>, 
    res: Response<
    {message: string, details?: string[]}
    >) => {
    const { error, value } = liftSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        message: "Validation error",
        details: error.details.map(d => d.message)
      });
    }

    try {
      const { user_id, weight_lifted, lift_type_id, date, notes } = value;
      const result = await liftQueries.addLift(Number(user_id), Number(weight_lifted), Number(lift_type_id), new Date(date), notes);

      res.status(201).send({
        message: 'Lift added successfully'
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({message:'Internal Server Error'});
    }
  };

 /**
 * @swagger
 * /lift/{id}:
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
  const editLiftById = async (
    req: Request<LiftIdParam,{},EditLift>, 
    res: Response<{message: string, details?: string[]}>
  ) => {
    const { error,value } = editLiftSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        message: "Validation error",
        details: error.details.map(d => d.message)
      });
    }

    try {
      const liftId = Number(req.params.id);
      if (isNaN(liftId)) { 
        return res.status(400).json({ message: 'Invalid liftId' }); 
      }
      const { weight_lifted, date, notes } = value;
      await liftQueries.editLiftById(
        Number(weight_lifted), 
        date ? new Date(date) : undefined, 
        notes, 
        Number(liftId));
      res.status(200).json({ message: 'Lift edited successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({message: 'Internal Server Error'});
    }
  };

  /**
 * @swagger
 * /lift/{id}:
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
  const deleteLiftById = async (
    req: Request<LiftIdParam>,
    res: Response<{message: string}>) => {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)){
        return res.status(400).send({message: "Invalid lift id"})
      }
      await liftQueries.deleteLiftById(id);
      res.status(200).json({ message: 'Lift deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({message:'Internal Server Error'});
    }
  };


export default function liftRoute(app: Application): void {
    app.get('/lift/:id', getLiftByLiftId); 
    app.get('/lift/:lift_type_id/:user_id', getLiftByTypeByUserId);
    app.post('/lift', addLift);
    app.put('/lift/:id', editLiftById);
    app.delete('/lift/:id',deleteLiftById); 

};
