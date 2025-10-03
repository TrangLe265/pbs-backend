const coefficientsQueries = require('../sql/queries/coefficients.js');

  /**
   * @swagger
   * /coefficients/{sex}:
   *   get:
   *     summary: Get DOTS coefficients by sex
   *     tags: [Coefficients]
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
