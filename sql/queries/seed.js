const db = require("../../db.js");

const seedData = async () => {
    try {
        await db.query(`
            INSERT INTO app_user (id, name, sex, body_weight)
            VALUES 
            (gen_random_uuid(), 'John Doe', 'male', 80.5),
            (gen_random_uuid(), 'Jane Smith', 'female', 65.3)
            ON CONFLICT DO NOTHING;
        `); 

        await db.query(`
            INSERT INTO lift (id, user_id, weight_lifted, lift_type_id, date, notes)
            SELECT 
            gen_random_uuid(), 
            app_user.id, 
            100.0, 
            lift_type.id, 
            CURRENT_DATE, 
            'First lift'
            FROM app_user, lift_type
            WHERE app_user.name = 'John Doe' AND lift_type.name = 'squat'
            ON CONFLICT DO NOTHING;
        `)
        console.log('Seeding completed successfully'); 
    } catch (err){
        console.log('Error while seeding: ', err); 
    } finally {
        process.exit(); 
    }
}; 

module.exports = {seedData}; 