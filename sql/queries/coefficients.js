const { ParameterizedQuery } = require("pg-promise");
const db = require("../../db.js"); 

const getCoefficientsBySex = async (sex) => {
    try{
         return await db.query("SELECT * FROM dots_coefficients WHERE sex=$1",[sex])
    } catch (err){
        console.error('Error fetching data:', err); 
        throw err;
    }
}

module.exports = {
   getCoefficientsBySex
}