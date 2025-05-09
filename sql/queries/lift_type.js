const { ParameterizedQuery } = require("pg-promise");
const db = require("../../db.js"); 

const getAllUsers = async () => {
    return db.query('SELECT * FROM app_user'); 
}; 
const getAllLiftTypes = async () => {
    return db.query('SELECT * FROM lift_type'); 
}; 

const getLiftTypeByName = async (param) => {
    return db.query('SELECT id FROM lift_type WHERE name = $1', [param]);
};

module.exports = {
    getAllUsers,
    getAllLiftTypes,
    getLiftTypeByName
}