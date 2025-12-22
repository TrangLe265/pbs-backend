import {describe, expect, test, beforeAll, afterAll} from '@jest/globals';
import pool from '../db';
import {getLiftByLiftId,getLiftByTypeByUserId, addLift,deleteLiftById,editLiftById} from '../sql/queries/lift';

describe('lift queries', () => {
  let testUserId;
  let testLiftTypeId = 1;
  let testLiftId;

  beforeAll(async () => {
    // Insert a test user
    const resUser = await pool.query(
      "INSERT INTO app_user ( name, sex, body_weight) VALUES ('Lift Test User', 'female', 65.0) RETURNING id"
    );
    testUserId = resUser.rows[0].id;

    // Insert a test lift
    const resLift = await pool.query(
      "INSERT INTO lift (user_id, weight_lifted, lift_type_id, date, notes) VALUES ($1, $2, $3, $4, $5) RETURNING id",
      [testUserId, 100, testLiftTypeId, new Date(), 'Initial Test Lift']
    );
    testLiftId = resLift.rows[0].id;
  });

  afterAll(async () => {
    await pool.query("DELETE FROM lift WHERE user_id = $1", [testUserId]);
    await pool.query("DELETE FROM app_user WHERE id = $1", [testUserId]);
  });
  
  test('getLiftByLiftId returns correct lift', async () =>{
    const result = await getLiftByLiftId(testLiftId);
    expect(result.rows[0].id).toBe(testLiftId);
    expect(result.rows[0].user_id).toBe(testUserId);
    expect(Number(result.rows[0].weight_lifted)).toBeCloseTo(100);
    expect(result.rows[0].lift_type_id).toBe(testLiftTypeId);
    expect(result.rows[0].notes).toBe('Initial Test Lift');
  }); 

  test('getLiftByTypeByUserId returns lifts of specific type for user', async () => { 
    const result = await getLiftByTypeByUserId(testUserId, testLiftTypeId);
    expect(result.rows.length).toBeGreaterThan(0);
    expect(result.rows[0].id).toBe(testLiftId);
  }); 

  test('addLift adds a new lift and deleteLiftById to delete the correct lift', async () => {
    const date = new Date();
    const res = await addLift(testUserId, 120, testLiftTypeId, date, 'Added Test Lift'); 
    
    const newLiftId = res.rows[0]?.id;

    const newAddResult = await pool.query('SELECT * FROM lift WHERE id = $1', [newLiftId]);
    expect(newAddResult.rows.length).toBe(1); 
    expect(Number(newAddResult.rows[0].user_id)).toBe(testUserId);
    expect(Number(newAddResult.rows[0].weight_lifted)).toBe(120);
    expect(Number(newAddResult.rows[0].lift_type_id)).toBe(testLiftTypeId);
    expect(newAddResult.rows[0].notes).toBe('Added Test Lift');

    await deleteLiftById(newLiftId); 
    const deleteResult = await pool.query('SELECT * FROM lift WHERE id = $1', [newLiftId]);
    expect (deleteResult.rows.length).toBe(0); 
  }); 

  test('editLiftById makes changes to the right lift', async() => {
    const date = new Date();
    await editLiftById(120, date, 'update weight lifted', testLiftId)

    const editRes = await pool.query('SELECT * FROM lift WHERE id=$1',[testLiftId])
    expect(Number(editRes.rows[0].weight_lifted)).toBe(120); 

    const expectedDate = date.toISOString().slice(0,10); 
    const receivedDate = (editRes.rows[0].date).toISOString().slice(0,10); 

    expect(receivedDate).toBe(expectedDate);
    expect(editRes.rows[0].notes).toBe('update weight lifted');  
  })


})