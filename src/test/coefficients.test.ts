import {describe, test, expect, beforeAll, afterAll} from '@jest/globals'; 
import pool from '../db';
import { getCoefficientsBySex } from '../sql/queries/coefficients';

describe('coeffeicients queries', () => {
    test('getCoefficientsBySex retrieves the right coeffecients for male users', async () => {
        const res = await getCoefficientsBySex('male'); 
        expect(Object.keys(res.rows[0]).length).toBe(5); 
        expect(Number(res.rows[0].a)).toBe(-0.000001093); 
        expect(Number(res.rows[0].b)).toBe(0.0007391293); 
        expect(Number(res.rows[0].c)).toBe(-0.1918759221); 
        expect(Number(res.rows[0].d)).toBe(24.0900756); 
        expect(Number(res.rows[0].e)).toBe(-307.75076); 
    })
})