const db = require("../../db.js");

const seedLiftData = async () => {
    try {
        const userResult = await db.query("SELECT id FROM app_user WHERE name='John Doe'");
        if (!userResult.rows || userResult.rows.length === 0) {
            throw new Error('Required FK value not found in app_user');
        }
        const userId = userResult.rows[0].id;

        // Get all lift types
        const liftTypes = ['back squat', 'deadlift', 'bench'];
        const liftTypeIds = {};

        for (const type of liftTypes) {
            const res = await db.query("SELECT id FROM lift_type WHERE name=$1", [type]);
            if (!res.rows || res.rows.length === 0) {
                throw new Error(`Required FK value not found in lift_type for ${type}`);
            }
            liftTypeIds[type] = res.rows[0].id;
        }

        const result = await db.query('SELECT COUNT(*) FROM lift');
        const liftCount = parseInt(result.rows[0].count);

        if (liftCount > 0) {
            console.log('Seed data already exists. Skipping seeding.');
            return;
        }

        // Seed for back squat
        await db.query(`
            INSERT INTO lift (user_id, weight_lifted, lift_type_id, date, notes)
            VALUES 
            ($1, 100.0, $2, CURRENT_DATE, 'first attempt')
            ON CONFLICT DO NOTHING;
        `, [userId, liftTypeIds['back squat']]); 

        await db.query(`
            INSERT INTO lift (user_id, weight_lifted, lift_type_id, date, notes)
            VALUES 
            ($1, 120.0, $2, CURRENT_DATE, 'second attempt')
            ON CONFLICT DO NOTHING;
        `, [userId, liftTypeIds['back squat']]); 

        // Seed for deadlift
        await db.query(`
            INSERT INTO lift (user_id, weight_lifted, lift_type_id, date, notes)
            VALUES 
            ($1, 140.0, $2, CURRENT_DATE, 'first deadlift')
            ON CONFLICT DO NOTHING;
        `, [userId, liftTypeIds['deadlift']]); 

        await db.query(`
            INSERT INTO lift (user_id, weight_lifted, lift_type_id, date, notes)
            VALUES 
            ($1, 160.0, $2, CURRENT_DATE, 'second deadlift')
            ON CONFLICT DO NOTHING;
        `, [userId, liftTypeIds['deadlift']]); 

        // Seed for bench
        await db.query(`
            INSERT INTO lift (user_id, weight_lifted, lift_type_id, date, notes)
            VALUES 
            ($1, 80.0, $2, CURRENT_DATE, 'first bench')
            ON CONFLICT DO NOTHING;
        `, [userId, liftTypeIds['bench']]); 

        await db.query(`
            INSERT INTO lift (user_id, weight_lifted, lift_type_id, date, notes)
            VALUES 
            ($1, 90.0, $2, CURRENT_DATE, 'second bench')
            ON CONFLICT DO NOTHING;
        `, [userId, liftTypeIds['bench']]); 

        console.log('Seeding lift completed successfully'); 
    } catch (err){
        console.log('Error while seeding lift: ', err); 
    } 
}; 

module.exports = {seedLiftData};