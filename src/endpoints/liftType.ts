import * as liftTypeQueries from '../sql/queries/lift_type';
import { Request, Response, Application } from "express";

/**
 * @swagger
 * /lift-type:
 *   get:
 *     summary: Get all available lift types
 *     tags: [Lift types]
 *     responses:
 *       200:
 *         description: A list of lift types
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 */
const getAllLiftTypes = async (req: Request, res: Response) => {
    try {
      const result = await liftTypeQueries.getAllLiftTypes();
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
}; 

export default function liftTypeRoute(app: Application): void {
    app.get('/lift-type', getAllLiftTypes);
}; 
