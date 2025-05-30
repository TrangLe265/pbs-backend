const db = require("../../db.js");

const seedUserData = async () => {
    try {
        const result = await db.query('SELECT COUNT(*) FROM app_user'); 
        const userCount = parseInt(result.rows[0].count)
        if (userCount > 0){
            console.log('Users data already exist, skip seeding'); 
        } else {
            await db.query(`
                INSERT INTO app_user (id, name, sex, body_weight)
                VALUES 
                (gen_random_uuid(), 'John Doe', 'male', 80.5),
                (gen_random_uuid(), 'Jane Smith', 'female', 65.3)
                ON CONFLICT DO NOTHING;
            `); 
        }
    
        console.log('Seeding app_user completed successfully'); 
    } catch (err){
        console.log('Error while seeding app_user: ', err); 
    } 
}; 

module.exports = {seedUserData}; 