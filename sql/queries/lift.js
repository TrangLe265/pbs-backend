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

const addLift = async (userId, weightLifted, liftTypeId, date, notes) => {
    try {
        return await db.query(
            'INSERT INTO lift (user_id, weight_lifted, lift_type_id, date, notes) VALUES ($1, $2, $3, $4, $5)',
            [userId, weightLifted, liftTypeId, date, notes]
        );
    } catch (err) {
        console.error(
            `Error adding new lift`,
            err
        );
        throw err;
    }
};

const deleteLiftById = async (liftId) => {
    try {
        return await db.query("DELETE FROM lift WHERE id = $1",[liftId]); 

    } catch (err){
        console.error(`Error deleting lift with id ${liftId}`);
        throw err;
    }
}

const editLiftById = async ( weightLifted, date, notes, liftId) => {
    try {
        return await db.query("UPDATE lift SET weight_lifted = $1, date = $2, notes = $3 WHERE id = $4",[weightLifted, date, notes, liftId])

    } catch (err){
        console.error(`Error editing lift with id ${liftId}`);
        throw err;
    }
}

const getWeightLiftedByLiftId = async (liftId) => {
    try{
        return await db.query("SELECT weight_lifted FROM lift WHERE id=$1",[liftId])
    } catch(err){
        console.error('Error fetching weight lifted with the given id'); 
        throw err; 

    }
}


module.exports = {
    getAllLift, 
    getLiftByTypeByUserId,  
    getLiftByLiftId, 
    addLift, 
    deleteLiftById, 
    editLiftById, 
    getWeightLiftedByLiftId 
}