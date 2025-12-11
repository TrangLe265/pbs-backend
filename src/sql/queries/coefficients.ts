import pool from "../../db";

export async function getCoefficientsBySex(sex) {
    try{
         return await pool.query("SELECT a,b,c,d,e FROM dots_coefficients WHERE sex=$1",[sex])
    } catch (err){
        console.error('Error fetching data:', err); 
        throw err;
    }
}
