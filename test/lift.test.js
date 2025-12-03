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
            throw new Error("No lift_type found with name 'bench'");
          }
          liftTypeId = res.rows[0].id;

        // Insert a test user
        const resUser = await db.query(
          "INSERT INTO app_user ( name, sex, body_weight) VALUES ( 'Test User', 'male', 80.0) RETURNING id"
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

    test('getLiftByTypeByUserId returns lifts of specific type for user', async () => {
        const result = await getLiftByTypeByUserId(testUserId, liftTypeId); 
        expect(result.rows.length).toBeGreaterThan(0); 
        expect(result.rows[0].lift_type_id).toBe(liftTypeId); 
    })

    test('addLift adds a new lift', async () => {
        const newLift = {
          user_id: testUserId,
          weight_lifted: 250,
          lift_type_id: liftTypeId,
          date: '2025-02-02',
          notes: 'new lift test'
        };
        const result = await addLift(newLift); 
        expect(result.rows[0].weight_lifted).toBeCloseTo(250); 
        expect(result.rows[0].notes).toBe('new lift test'); 

        // Clean up
        await db.query("DELETE FROM lift WHERE id = $1", [result.rows[0].id]);
    })

    test('deleteLiftById removes the correctlift', async () => {
        const newLift = {
          user_id: testUserId,
          weight_lifted: 300,
          lift_type_id: liftTypeId,
          date: '2025-03-03',
          notes: 'delete lift test'
        };
        const addedLift = await addLift(newLift); 
        const liftIdToDelete = addedLift.rows[0].id;

        await deleteLiftById(liftIdToDelete); 
        const result = await getLiftByLiftId(liftIdToDelete); 
        expect(result.rows.length).toBe(0); 
    })

    test('editLiftById updates the lift details', async () => {
        const updatedData = {
          weight_lifted: 220,
          date: '2025-01-05',
          notes: 'updated notes',
          liftId: testLiftId
        };
        await editLiftById(updatedData); 
        const result = await getLiftByLiftId(testLiftId); 
        expect(Number(result.rows[0].weight_lifted)).toBeCloseTo(220); 
        expect(result.rows[0].notes).toBe('updated notes'); 
    })  
      
});