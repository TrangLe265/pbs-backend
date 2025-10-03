const liftTypeQueries = require('../sql/queries/lift_type.js');

/**
   * @swagger
   * /lift-type:
    *   get:
   *     summary: Get all available lift types
   *     tags: [Lift types]
   */
const getAllLiftTypes = async (req,res) => {
    try {
      const result = await liftTypeQueries.getAllLiftTypes();
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
}; 

module.exports = (app) => {
    app.get('/lift-type', getAllLiftTypes);
}; 
