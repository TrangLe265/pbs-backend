const { ParameterizedQuery } = require("pg-promise");
const db = require("../../db.js"); 

//get all lifts of all users
//TODO: REMOVE THIS ENDPOINT AFTER TESTING ALL DONE
const getAllLift = async () => {
    try {
        return await db.query('SELECT * FROM lift');
    } catch (err) {
        console.error('Error fetching all lifts:', err);
        throw err; 
    }
};

//get a specific lift by its id
const getLiftByLiftId = async (param) => {
    try {
        return await db.query('SELECT * FROM lift WHERE id = $1', [param]);
    } catch (err) {
        console.error(`Error fetching lift by id (${param}):`, err);
        throw err;
    }
};

//get all lifts of a specific typer by an user 
const getLiftByTypeByUserId = async (userId, liftTypeId) => {
    try {
        return await db.query('SELECT * FROM lift WHERE user_id = $1 AND lift_type_id = $2', [userId, liftTypeId]);
    } catch (err) {
        console.error(`Error fetching lifts by userId (${userId}) and liftType (${liftTypeId}):`, err);
        throw err;
    }
};

module.exports = {
    getAllLift, 
    getLiftByTypeByUserId,  
    getLiftByLiftId
}