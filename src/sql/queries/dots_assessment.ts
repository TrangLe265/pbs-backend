import pool from "../../db";

export async function getAllClassifications() {
    try{
        return await pool.query("SELECT * FROM dots_assessment")

    } catch (err){
        console.error('Error fetching data:', err);
        throw err;
    }
}

export async function getClassificationByScore(score) {
    try {
        return await pool.query("SELECT * FROM dots_assessment where min_score <= $1 and max_score >= $1 ", [score])
    }catch (err){
        console.error(`Error in assessing score : ${score}`, err);
        throw err;
    }
}
