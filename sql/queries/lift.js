const { ParameterizedQuery } = require("pg-promise");
const db = require("../../db.js"); 

const getAllLift = async () => {
    return db.query('SELECT * FROM lift')
}; 

module.exports = {
    getAllLift, 
}