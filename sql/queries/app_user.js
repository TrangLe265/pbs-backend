const { ParameterizedQuery } = require("pg-promise");
const db = require("../../db.js"); 

const getDataByUserId = async (userId) => {
    try{
         return await db.query("SELECT body_weight,sex FROM app_user WHERE id=$1",[userId])
    } catch (err){
        console.error('Error fetching data:', err); 
        throw err;
    }
}

module.exports = {
   getDataByUserId
}