const { ParameterizedQuery } = require("pg-promise");
const db = require("../../db.js"); 

const getDotsRange = async () => {
    try{
        return await db.query("SELECT * FROM dots_assessment")

    } catch (err){
        console.error('Error fetching data:', err);
        throw err;
    }
}

module.exports = {
    getDotsRange
}