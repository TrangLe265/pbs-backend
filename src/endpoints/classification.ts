import * as dotsAssessmentQueries from '../sql/queries/dots_assessment';
import { Request, Response, Application } from "express";
import { DotsAssessment, AssessmentParam } from '../types/DotsAssessment.interface';

  /**
 * @swagger
 * /classification:
 *   get:dock
 *     summary: Get all classifications
 *     tags: [DOTS classifications]
 *     responses:
 *       200:
 *         description: All classifications retrieved successfully
 */
  const getAllClassifications = async (req: Request, res: Response<DotsAssessment[] | {message: string}>) => {
    try {
      const result = await dotsAssessmentQueries.getAllClassifications();
      const classifications : DotsAssessment[] | undefined = result.rows; 
      if (classifications?.length === 0){
        res.status(404).json({"message": 'No classification found'});
      }
      res.json(classifications);
    } catch (err) {
      console.error(err);
      res.status(500).json({"message": 'Internal Server Error'});
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
  const getClassificationByScore = async (
    req: Request<AssessmentParam>, 
    res: Response<DotsAssessment| {message: string}> 
  ) => {
    try {
      const score = Number(req.params.score);
      if (isNaN(score)){
        return res.status(400).json({ "message":'Invalid score format'});
      }
      const result = await dotsAssessmentQueries.getClassificationByScore(score);
      const assessment : DotsAssessment | undefined = result.rows[0];
      if (!assessment){
        return res.status(404).json({"message": "Fail to  classified this score"})
      }
      
    } catch (err) {
      console.error(err);
      res.status(500).json({ "message":'Internal Server Error'});
    }
  };


export default function classificationRoute(app: Application): void {
    app.get('/classification', getAllClassifications); 
    app.get('/classification/score/:score',getClassificationByScore);
};
