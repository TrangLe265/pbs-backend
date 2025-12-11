import pool from "../../db";

export async function getAllScore(userId) {
    try {
        return await pool.query('SELECT * from dots_score WHERE user_id=$1',[userId]); 
    } catch (err){
        console.error('Error fetching all records: ', err);
        throw err; 
    }
}

export async function getScoreById(scoreId) {
    try{
        return await pool.query("SELECT * FROM dots_score WHERE id=$1", [scoreId]); 
    } catch (err){
        console.error(`Error fetching dots score with id ${scoreId}`); 
        throw err; 
    }
}

export async function addScore(score, userId, benchId, squatId, deadliftId) {
    try {
        return await pool.query(
            "INSERT INTO dots_score (score, user_id, bench_lift_id, squat_lift_id, deadlift_lift_id) VALUES ($1, $2, $3, $4, $5)",
            [score,  userId, benchId, squatId, deadliftId]
        );
    } catch (err) {
        console.error('Error adding new score:', err);
        throw err;
    }
};

export async function deleteScoreById(scoreId) {
    try {
        await pool.query("DELETE FROM dots_score WHERE id=$1", [scoreId]); 
    } catch(err){
        console.error(`Error deleting dots score with id ${scoreId}`); 
        throw err; 
    }
}

