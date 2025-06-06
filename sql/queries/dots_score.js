const { ParameterizedQuery } = require("pg-promise");
const db = require("../../db.js"); 
const { get } = require("underscore");

const getAllScore = async (userId) => {
    try {
        return await db.query('SELECT * from dots_score WHERE user_id=$1',[userId]); 
    } catch (err){
        console.error('Error fetching all records: ', err);
        throw err; 
    }
}

const addScore = async (score, userId, benchId, squatId, deadliftId) => {
    try {
        return await db.query(
            "INSERT INTO dots_score (score, user_id, bench_lift_id, squat_lift_id, deadlift_lift_id) VALUES ($1, $2, $3, $4, $5)",
            [score,  userId, benchId, squatId, deadliftId]
        );
    } catch (err) {
        console.error('Error adding new score:', err);
        throw err;
    }
};

module.exports = {
    getAllScore, 
    addScore, 
}