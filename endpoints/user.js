const userQueries = require('../sql/queries/app_user.js');

/**
 * @swagger
 * /user/{userId}:
 *   get:
 *     summary: Get user info by user ID
 *     tags: [User]
 */
const getUserById = async (req, res) => {
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
 */
const updateUserWeight = async (req, res) => {
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


module.exports = (app) => {
  app.get('/user/:userId', getUserById);
  app.put('/user/:userId', updateUserWeight);
};