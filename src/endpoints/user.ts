import * as  userQueries from '../sql/queries/app_user.js';
import { Request, Response, Application } from "express";

/**
 * @swagger
 * /user/{userId}:
 *   get:
 *     summary: Get user info by user ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: userId
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

const getUserById = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const result = await userQueries.getDataByUserId(userId);
    if (!result.rows[0]) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
};

/**
 * @swagger
 * /user/{userId}:
 *   put:
 *     summary: Update user's body weight
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: userId
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
 *               weight:
 *                 type: number
 *             required:
 *               - weight
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
const updateUserWeight = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { weight } = req.body;

  if (typeof weight !== 'number' || weight <= 0) {
    return res.status(400).json({
      message: "Validation error",
      details: ["weight must be a positive number"]
    });
  }

  try {
    const result = await userQueries.updateWeightByUserId(userId, weight);
    if (!result.rows[0]) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({
      message: 'User weight updated successfully',
      user: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
};


export default function userRoute(app: Application): void {
  app.get('/user/:userId', getUserById);
  app.put('/user/:userId', updateUserWeight);
};