CREATE TABLE IF NOT EXISTS lift_type (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
); 

INSERT INTO lift_type (name)
VALUES 
    ('back squat'), 
    ('bench'), 
    ('deadlift')
ON CONFLICT DO NOTHING; 
