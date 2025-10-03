const dotsAssessmentQueries = require('../sql/queries/dots_assessment.js');


  /**
   * @swagger
   * /classification:
   *   get:
   *     summary: Get all DOTS classifications
   *     tags: [DOTS classifications]
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
