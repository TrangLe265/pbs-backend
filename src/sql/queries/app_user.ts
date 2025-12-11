import pool from "../../db";

export async function getDataByUserId(userId) {
    try{
         return await pool.query("SELECT name,body_weight,sex FROM app_user WHERE id=$1",[userId])
    } catch (err){
        console.error('Error fetching data:', err); 
        throw err;
    }
}

export async function updateWeightByUserId(userId, bodyWeight) {
    try {
        return await pool.query(
            "UPDATE app_user SET body_weight = $1 WHERE id = $2 RETURNING id, name, body_weight, sex",
            [bodyWeight, userId]
        );
    } catch (err) {
        console.error('Error updating user:', err);
        throw err;
    }
}
