const { ParameterizedQuery } = require("pg-promise");
const db = require("../../db.js"); 

const getAllLiftTypes = async () => {
    try{
        return await db.query('SELECT * FROM lift_type'); 
    }catch(err){
        console.error('Error fetching all lift types:', err);
        throw err;
    }
    
}; 

const getLiftTypeByName = async (param) => {
    try{
        return await db.query('SELECT id FROM lift_type WHERE name = $1', [param]);
    }catch(err){
        console.error('Error fetching lift type by name:', err);
        throw err;
    }
};

module.exports = {
    getAllLiftTypes,
    getLiftTypeByName
}