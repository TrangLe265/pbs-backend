import * as  userQueries from '../sql/queries/app_user.js';
import { Request, Response, Application } from "express";
import { User, UpdateUserWeight, UserParam} from '../types/User.interface';

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Get user info by user ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user's ID
 *     responses:
 *       200:
 *         description: User info retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                 body_weight:
 *                   type: number
 *                 sex:
 *                   type: string
 *       404:
 *         description: User not found
 */

const getUserById = async (req: Request<UserParam>, res: Response< User | { message: string }>) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) { return res.status(400).json({ message: 'Invalid userId' }); }
    const result = await userQueries.getDataByUserId(id);
    const user : User | undefined = result.rows[0];
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error'});
  }
};

/**
 * @swagger
 * /user/{id}:
 *   put:
 *     summary: Update user's body weight
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user's ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               body_weight:
 *                 type: number
 *             required:
 *               - body_weight
 *     responses:
 *       200:
 *         description: User weight updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     body_weight:
 *                       type: number
 *                     sex:
 *                      type: string
 *       400:
 *         description: Validation error
 *       404:
 *         description: User not found
 */
const updateUserWeight = async (
  req: Request<UserParam,{},UpdateUserWeight>, //Express has its own Request generic order, reqBody is in the third position
  res: Response<{message: string} | {message: string, user: User}>
) => {
  const id = Number(req.params.id);
  if (isNaN(id)) { return res.status(400).json({ message: 'Invalid userId' }); }

  const bodyWeight = req.body.body_weight;
  if (typeof bodyWeight !== 'number' || bodyWeight <= 0) {
    return res.status(400).json({
      message: "Validation error, weight must be a positive number"
    });
  }

  try {
    const result = await userQueries.updateWeightByUserId(id, bodyWeight);
    const user : User | undefined = result.rows[0]; 
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({
      message: 'User weight updated successfully',
      user
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({message: 'Internal Server Error'});
  }
};

export default function userRoute(app: Application): void {
  app.get('/user/:id', getUserById);
  app.put('/user/:id', updateUserWeight);
};