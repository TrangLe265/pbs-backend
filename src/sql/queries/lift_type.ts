import pool from "../../db";

export async function getAllLiftTypes() {
    try{
        return await pool.query('SELECT * FROM lift_type'); 
    }catch(err){
        console.error('Error fetching all lift types:', err);
        throw err;
    }
    
}; 

export async function getLiftTypeByName(liftName) {
    try{
        return await pool.query('SELECT id FROM lift_type WHERE name = $1', [liftName]);
    }catch(err){
        console.error('Error fetching lift type by name:', err);
        throw err;
    }
};
