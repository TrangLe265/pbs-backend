CREATE TABLE IF NOT EXISTS app_user (
    id SERIAL PRIMARY KEY, 
    name VARCHAR(255) NOT NULL,
    sex VARCHAR(255) NOT NULL CHECK (sex IN ('male','female')),
    body_weight DECIMAL(5,2) NOT NULL
);