const { ParameterizedQuery } = require("pg-promise");
const db = require("../../db.js"); 

const getAllLift = async () => {
    try {
        return await db.query('SELECT * FROM lift');
    } catch (err) {
        console.error('Error fetching all lifts:', err);
        throw err; 
    }
};


const getLiftByLiftId = async (param) => {
    try {
        return await db.query('SELECT * FROM lift WHERE id = $1', [param]);
    } catch (err) {
        console.error(`Error fetching lift by id (${param}):`, err);
        throw err;
    }
};

const getLiftByUserId = async (param) => {
    try {
        return await db.query('SELECT * FROM lift WHERE user_id = $1', [param]);
    } catch (err) {
        console.error(`Error fetching lifts by userId (${param}):`, err);
        throw err;
    }
};




module.exports = {
    getAllLift, 
    getLiftByUserId, 
    getLiftByLiftId
}