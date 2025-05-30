const db = require("../../db.js");

const seedLiftData = async () => {
    try {
        
        const userResult = await db.query("SELECT id FROM app_user WHERE name='John Doe'");
        const liftTypeResult = await db.query("SELECT id FROM lift_type WHERE name='back squat'");

        if (!(userResult.rows) || !(liftTypeResult.rows)){
            throw new Error('Required FK values not found in app_user or lift_type');
            return; 
        }

        const userId = userResult.rows[0].id;
        const liftTypeId = liftTypeResult.rows[0].id;
        
        
        const result = await db.query('SELECT COUNT(*) FROM lift');
        const liftCount = parseInt(result.rows[0].count);
        
        if (liftCount > 0) {
            console.log('Seed data already exists. Skipping seeding.');
            return;
        }

        await db.query(`
            INSERT INTO lift (id,user_id, weight_lifted, lift_type_id, date, notes)
            VALUES 
            (gen_random_uuid(),
            $1,
            100.0,
            $2,
            CURRENT_DATE,
            'first attempt')
            ON CONFLICT DO NOTHING;
        `, [userId, liftTypeId]); 

        await db.query(`
            INSERT INTO lift (id,user_id, weight_lifted, lift_type_id, date, notes)
            VALUES 
            (gen_random_uuid(),
            $1,
            120.0,
            $2,
            CURRENT_DATE,
            'secondd attempt')
            ON CONFLICT DO NOTHING;
        `, [userId, liftTypeId]); 

        console.log('Seeding lift completed successfully'); 
    } catch (err){
        console.log('Error while seeding lift: ', err); 
    } 
}; 

module.exports = {seedLiftData}; 