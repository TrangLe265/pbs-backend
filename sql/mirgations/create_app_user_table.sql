CREATE TABLE IF NOT EXISTS app_user (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY, 
    name VARCHAR(255) NOT NULL,
    sex VARCHAR(255) NOT NULL UNIQUE CHECK (sex IN ('male','female')), 
    body_weight DECIMAL(5,2) NOT NULL
)