const { ParameterizedQuery } = require("pg-promise");
const db = require("../../db.js"); 

const getDataByUserId = async (userId) => {
    try{
         return await db.query("SELECT name,body_weight,sex FROM app_user WHERE id=$1",[userId])
    } catch (err){
        console.error('Error fetching data:', err); 
        throw err;
    }
}

const updateWeightByUserId = async (userId, bodyWeight) => {
    try {
        return await db.query(
            "UPDATE app_user SET body_weight = $1 WHERE id = $2 RETURNING id, name, body_weight, sex",
            [bodyWeight, userId]
        );
    } catch (err) {
        console.error('Error updating user:', err);
        throw err;
    }
}

module.exports = {
   getDataByUserId, 
   updateWeightByUserId
}