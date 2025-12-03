const dotsQueries = require('../sql/queries/dots_score.js');
const liftQueries = require('../sql/queries/lift.js');
const userQueries = require('../sql/queries/app_user.js');
const coefficientsQueries = require('../sql/queries/coefficients.js');


    /**
 * @swagger
 * /dots/{scoreId}:
 *   get:
 *     summary: Get DOTS score by score ID
 *     tags: [DOTS scores]
 *     parameters:
 *       - in: path
 *         name: scoreId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The DOTS score ID
 *     responses:
 *       200:
 *         description: DOTS score retrieved successfully
 *       404:
 *         description: Score not found
 */
    const getScoreById = async (req, res) => {
      try {
        const { scoreId } = req.params;
        const result = await dotsQueries.getScoreById(scoreId);
        if (!result.rows[0]) {
          return res.status(404).json({ message: 'Score not found' });
        }
        res.json(result.rows[0]);
      } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      }
    };

 /**
 * @swagger
 * /dots/user/{userId}:
 *   get:
 *     summary: Get all DOTS scores by userId
 *     tags: [DOTS scores]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user's id
 *     responses:
 *       200:
 *         description: List of DOTS scores for the user
 */
  const getAllScore =  async (req,res) => {
    try {
      const { userId } = req.params;
      const result = await dotsQueries.getAllScore(userId);
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  };

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
 *               user_id:
 *                 type: integer
 *               bench_lift_id:
 *                 type: integer
 *               squat_lift_id:
 *                 type: integer
 *               deadlift_lift_id:
 *                 type: integer
 *             required:
 *               - user_id
 *               - bench_lift_id
 *               - squat_lift_id
 *               - deadlift_lift_id
 *     responses:
 *       201:
 *         description: DOTS score added
 *       400:
 *         description: Invalid input
 */
  const addScore = async (req,res) => {
    try {
      const { user_id, bench_lift_id, squat_lift_id, deadlift_lift_id } = req.body;

      const bench = await liftQueries.getWeightLiftedByLiftId(bench_lift_id);
      const squat = await liftQueries.getWeightLiftedByLiftId(squat_lift_id);
      const deadlift = await liftQueries.getWeightLiftedByLiftId(deadlift_lift_id);

      if (!bench.rows[0] || !squat.rows[0] || !deadlift.rows[0]) {
        return res.status(400).json({ message: "One or more lift IDs are invalid." });
      }

      const total = [bench, squat, deadlift].reduce((sum, q) => sum + parseFloat(q.rows[0].weight_lifted), 0);
      const user = await userQueries.getDataByUserId(user_id);

      if (!user.rows[0]) return res.status(400).json({ message: "Invalid userId" });

      const body_weight = parseFloat(user.rows[0].body_weight);
      const sex = user.rows[0].sex;
      const coeffs = await coefficientsQueries.getCoefficientsBySex(sex);

      const {a,b,c,d,e} = coeffs.rows[0];
      const score = parseFloat(total * 500 / (
        a * Math.pow(body_weight, 4) +
        b * Math.pow(body_weight, 3) +
        c * Math.pow(body_weight, 2) +
        d * body_weight +
        e
      )).toFixed(2);

      await dotsQueries.addScore(score, user_id, bench_lift_id, squat_lift_id, deadlift_lift_id);
      res.status(201).send({ message: 'DOTS score added', score });
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  };


module.exports = (app) => {
    app.get('/dots/:scoreId', getScoreById);
    app.get('/dots/user/:userId', getAllScore);
    app.post('/dots',addScore); 
    
};
