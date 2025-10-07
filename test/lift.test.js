const db = require ('../db'); 
const {getLiftByLiftId,getLiftByTypeByUserId, addLift,deleteLiftById,editLiftById} = require('../sql/queries/lift'); 

describe('lifts queries', () => {
      let testUserId;
      let testLiftId;
      let liftTypeId;
    
      beforeAll(async () => {
        const res = await db.query(
            `SELECT id FROM lift_type WHERE name = 'bench';`
          ); 

         if (!res.rows.length) {
            throw new Error("No lift_type found with name 'squat'");
          }
          liftTypeId = res.rows[0].id;

        // Insert a test user
        const resUser = await db.query(
          "INSERT INTO app_user (id, name, sex, body_weight) VALUES (gen_random_uuid(), 'Test User', 'male', 80.0) RETURNING id"
        );
        testUserId = resUser.rows[0].id;

        const resLift = await db.query(`
            INSERT INTO lift (user_id, weight_lifted, lift_type_id, date, notes) VALUES ($1, 200, $2, '2025-01-02', 'test') RETURNING id;`, [testUserId,liftTypeId]
        )
        testLiftId=resLift.rows[0].id;
      });

      afterAll(async () => {
          // Clean up test user
          
          await db.query("DELETE FROM lift WHERE id = $1", [testLiftId]);
          await db.query("DELETE FROM app_user WHERE id = $1", [testUserId]);
        });

    test('getLiftByLiftId returns correct lift', async () => {
        const result = await getLiftByLiftId(testLiftId); 
        expect (Number(result.rows[0].weight_lifted)).toBeCloseTo(200); 
        expect(result.rows[0].notes).toBe('test');  
    })
})