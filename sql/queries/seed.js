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

        const userId = '7e8c6f0c-9bf3-44c1-899e-be8991097826';
        const liftTypeId = 'a0c963e8-caaa-4740-8a04-b7cb4ac856c1';

        if (!userId || !liftTypeId){
            throw new Error('Required FK values not found in app_user or lift_type');
        }

        const result = await db.query('SELECT COUNT(*) FROM lift');
        const liftCount = parseInt(result.rows[0].count, 10);
        
        if (liftCount > 0) {
            console.log('Seed data already exists. Skipping seeding.');
            return;
        }

        await db.query(`
            INSERT INTO lift (id,user_id, weight_lifted, lift_type_id, date, notes)
            VALUES 
            (gen_random_uuid(), $1,
            100.0,
            $2,
            CURRENT_DATE,
            'first attempt')
            ON CONFLICT DO NOTHING;
        `, [userId, liftTypeId]); 

        console.log('Seeding completed successfully'); 
    } catch (err){
        console.log('Error while seeding: ', err); 
    } 
}; 

module.exports = {seedData}; 