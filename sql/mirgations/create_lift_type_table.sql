CREATE TABLE IF NOT EXISTS lift_type (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL
); 

INSERT INTO lift_type (id,name)
VALUES 
    (gen_random_uuid(), 'back squat'), 
    (gen_random_uuid(), 'bench'), 
    (gen_random_uuid(), 'deadlift')
ON CONFLICT DO NOTHING; 