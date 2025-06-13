const { ParameterizedQuery } = require("pg-promise");
const db = require("../../db.js"); 

const getAllClassifications = async () => {
    try{
        return await db.query("SELECT * FROM dots_assessment")

    } catch (err){
        console.error('Error fetching data:', err);
        throw err;
    }
}

const getClassificationByScore = async (score) => {
    try {
        return await db.query("SELECT * FROM dots_assessment where min_score < $1 and max_score > $1 ", [score])
    }catch (err){
        console.error(`Error in assessing score : ${score}`, err);
        throw err;
    }
}

module.exports = {
   getAllClassifications,
   getClassificationByScore
}