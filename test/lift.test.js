const { describe, before } = require('node:test');
const db = require ('../db'); 
const {getLiftByLiftId,getLiftByTypeByUserId, addLift,deleteLiftById,editLiftById} = require('../sql/queries/lift'); 

describe('lifts queries', () => {
      let testUserId;
    
      beforeAll(async () => {
        // Insert a test user
        const res = await db.query(
          "INSERT INTO app_user (id, name, sex, body_weight) VALUES (gen_random_uuid(), 'Test User', 'male', 80.0) RETURNING id"
        );
        testUserId = res.rows[0].id;
      });

    test('getCoefficientsBySex returns correct coefficients', async () => {
        
    })
})