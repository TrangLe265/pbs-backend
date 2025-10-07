CREATE TABLE IF NOT EXISTS lift_type (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(255) NOT NULL
); 

INSERT INTO lift_type (name)
VALUES 
    ('back squat'), 
    ('bench'), 
    ('deadlift')
ON CONFLICT DO NOTHING; 

/* id bigint: auto-incrementijng numeric id ideal for small fixed set of types */