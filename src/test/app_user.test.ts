import {describe, expect, test, afterAll, beforeAll} from '@jest/globals';
import pool from '../db';
import { getDataByUserId, updateWeightByUserId } from '../sql/queries/app_user';

describe('app_user queries', () => {
  let testUserId;

  beforeAll(async () => {
    // Insert a test user
    const res = await pool.query(
      "INSERT INTO app_user ( name, sex, body_weight) VALUES ('Test User', 'male', 80.0) RETURNING id"
    );
    testUserId = res.rows[0].id;
  });

  afterAll(async () => {
    // Clean up test user
    await pool.query("DELETE FROM app_user WHERE name = $1", ['Test User']);
  });

  test('getDataByUserId returns correct user', async () => {
    const result = await getDataByUserId(testUserId);
    expect(result.rows[0].name).toBe('Test User');
    expect(Number(result.rows[0].body_weight)).toBeCloseTo(80);
    expect(result.rows[0].sex).toBe('male');
  });

  test('updateWeightByUserId updates weight', async () => {
    await updateWeightByUserId(testUserId, 85.50);
    const result = await getDataByUserId(testUserId);
    expect(Number(result.rows[0].body_weight)).toBeCloseTo(85.50);
  });
});