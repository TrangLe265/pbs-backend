CREATE TABLE IF NOT EXISTS dots_coefficients (
    id SERIAL PRIMARY KEY,
    sex VARCHAR(50) NOT NULL UNIQUE CHECK (sex IN ('male', 'female')),
    a DOUBLE PRECISION,
    b DOUBLE PRECISION,
    c DOUBLE PRECISION,
    d DOUBLE PRECISION,
    e DOUBLE PRECISION
);

INSERT INTO dots_coefficients (sex, a, b, c, d, e) VALUES
    ('male', -0.000001093, 0.0007391293, -0.1918759221, 24.0900756, -307.75076),
    ('female', -0.0000010706, 0.0005158568, -0.1126655495, 13.6175032, -57.96288);

/*SERIAL id: suitable if the data is set with certain values*/