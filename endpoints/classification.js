const dotsAssessmentQueries = require('../sql/queries/dots_assessment.js');


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
 *           type: number
 *         description: The DOTS score to classify
 *     responses:
 *       200:
 *         description: Classification result
 */
  const getAllClassifications = async (req,res) => {
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
 *           type: number
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
  const getClassificationByScore = async (req,res) => {
    try {
      const score = Number(req.params.score);
      const result = await dotsAssessmentQueries.getClassificationByScore(score);
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  };


module.exports = (app) => {
    app.get('/classification', getAllClassifications); 
    app.get('/classification/score/:score',getClassificationByScore);
};
