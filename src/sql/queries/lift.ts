import pool from '../../db';

//get all lifts of all users
//TODO: REMOVE THIS ENDPOINT AFTER TESTING ALL DONE
export async function getAllLift() {
    try {
        return await pool.query('SELECT * FROM lift');
    } catch (err) {
        console.error('Error fetching all lifts:', err);
        throw err; 
    }
};

//get a specific lift by its id
export async function getLiftByLiftId(liftId: number) {
    try {
        return await pool.query('SELECT * FROM lift WHERE id = $1', [liftId]);
    } catch (err) {
        console.error(`Error fetching lift by id (${liftId}):`, err);
        throw err;
    }
};

//get all lifts of a specific typer by an user 
export async function getLiftByTypeByUserId(userId: number, liftTypeId: number) {
    try {
        return await pool.query('SELECT * FROM lift WHERE user_id = $1 AND lift_type_id = $2', [userId, liftTypeId]);
    } catch (err) {
        console.error(`Error fetching lifts by userId (${userId}) and liftType (${liftTypeId}):`, err);
        throw err;
    }
};

export async function addLift(userId: number, weightLifted: number, liftTypeId: number, date: Date, notes: string) {
    try {
        return await pool.query(
            'INSERT INTO lift (user_id, weight_lifted, lift_type_id, date, notes) VALUES ($1, $2, $3, $4, $5) RETURNING *' ,
            [userId, weightLifted, liftTypeId, date, notes] 
        );
    } catch (err) {
        console.error(
            `Error adding new lift`,
            err
        );
        throw err;
    }
};

export async function deleteLiftById(liftId: number)  {
    try {
        return await pool.query("DELETE FROM lift WHERE id = $1",[liftId]); 

    } catch (err){
        console.error(`Error deleting lift with id ${liftId}`);
        throw err;
    }
}

export async function editLiftById(weightLifted: number, date: Date|undefined, notes: string|undefined, liftId: number) {
    try {
        return await pool.query("UPDATE lift SET weight_lifted = $1, date = COALESCE($2, date), notes = COALESCE($3, notes) WHERE id = $4",[weightLifted, date??null, notes??null, liftId])

    } catch (err){
        console.error(`Error editing lift with id ${liftId}`);
        throw err;
    }
};

export async function getWeightLiftedByLiftId(liftId: number) {
    try{
        return await pool.query("SELECT weight_lifted FROM lift WHERE id=$1",[liftId])
    } catch(err){
        console.error('Error fetching weight lifted with the given id'); 
        throw err; 

    }
}
