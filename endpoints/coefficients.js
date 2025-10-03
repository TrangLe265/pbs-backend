const coefficientsQueries = require('../sql/queries/coefficients.js');

/**
 * @swagger
 * /coefficients/{sex}:
 *   get:
 *     summary: Get DOTS coefficients by sex
 *     tags: [Coefficients]
 *     parameters:
 *       - in: path
 *         name: sex
 *         required: true
 *         schema:
 *           type: string
 *           enum: [male, female]
 *         description: The sex for which to retrieve coefficients
 *     responses:
 *       200:
 *         description: Coefficients retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   sex:
 *                     type: string
 *                   a:
 *                     type: number
 *                   b:
 *                     type: number
 *                   c:
 *                     type: number
 *                   d:
 *                     type: number
 *                   e:
 *                     type: number
 */
const getCoefficientsBySex = async (req,res) => {
  try {
    const sex = req.params.sex;
    const result = await coefficientsQueries.getCoefficientsBySex(sex);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = (app) => {
    app.get('/coefficients/:sex', getCoefficientsBySex); 
};
