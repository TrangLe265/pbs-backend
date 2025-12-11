import * as dotsAssessmentQueries from '../sql/queries/dots_assessment';
import { Request, Response, Application } from "express";

  /**
 * @swagger
 * /classification:
 *   get:
 *     summary: Get all classifications
 *     tags: [DOTS classifications]
 *     responses:
 *       200:
 *         description: All classifications retrieved successfully
 */
  const getAllClassifications = async (req: Request, res: Response) => {
    try {
      const result = await dotsAssessmentQueries.getAllClassifications();
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  };

  /**
 * @swagger
 * /classification/score/{score}:
 *   get:
 *     summary: Get classification for a score
 *     tags: [DOTS classifications]
 *     parameters:
 *       - in: path
 *         name: score
 *         required: true
 *         schema:
 *           type: integer
 *         description: The DOTS score to classify
 *     responses:
 *       200:
 *         description: Classification result
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   min_score:
 *                     type: number
 *                   max_score:
 *                     type: number
 *                   classification:
 *                     type: string
 *                   description:
 *                     type: string
 */
  const getClassificationByScore = async (req: Request, res: Response) => {
    try {
      const score = Number(req.params.score);
      const result = await dotsAssessmentQueries.getClassificationByScore(score);
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  };


export default function classificationRoute(app: Application): void {
    app.get('/classification', getAllClassifications); 
    app.get('/classification/score/:score',getClassificationByScore);
};
