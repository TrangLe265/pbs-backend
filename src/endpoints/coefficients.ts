import * as coefficientsQueries from '../sql/queries/coefficients';
import { Request, Response, Application } from "express";
import { Coefficient } from '../types/Coefficient.interface';

type SexParam = {sex: 'male' | 'female'}
/**
 * @swagger
 * /coefficients/{sex}:
 *   get:
 *     summary: Get DOTS coefficients by sex
 *     tags: [Coefficients]
 *     parameters:
 *       - in: path
 *         name: sex
 *         required: true
 *         schema:
 *           type: string
 *           enum: [male, female]
 *         description: The sex for which to retrieve coefficients
 *     responses:
 *       200:
 *         description: Coefficients retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   sex:
 *                     type: string
 *                   a:
 *                     type: number
 *                   b:
 *                     type: number
 *                   c:
 *                     type: number
 *                   d:
 *                     type: number
 *                   e:
 *                     type: number
 */
const getCoefficientsBySex = async (
  req: Request<{sex: 'male' | 'female'}>, 
  res: Response<{message: string}|Coefficient[]>
) => {
  try {
    const sex = req.params.sex;
    const result = await coefficientsQueries.getCoefficientsBySex(sex);
    const coefficients : Coefficient[] | undefined = result.rows
    if (coefficients?.length === 0) {
      return res.status(404).json({ message: 'Fail to retrieve coefficients' });
    }
    res.json(coefficients);
  } catch (err) {
    console.error(err);
    res.status(500).json({message: 'Internal Server Error'});
  }
};

export default function coefficientsRoute(app: Application): void {
    app.get('/coefficients/:sex', getCoefficientsBySex); 
};
