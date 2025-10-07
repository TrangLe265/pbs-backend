const db = require('../db');
const { getDataByUserId, updateWeightByUserId } = require('../sql/queries/app_user');

describe('app_user queries', () => {
  let testUserId;

  beforeAll(async () => {
    // Insert a test user
    const res = await db.query(
      "INSERT INTO app_user (id, name, sex, body_weight) VALUES (gen_random_uuid(), 'Test User', 'male', 80.0) RETURNING id"
    );
    testUserId = res.rows[0].id;
  });

  afterAll(async () => {
    // Clean up test user
    await db.query("DELETE FROM app_user WHERE id = $1", [testUserId]);
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