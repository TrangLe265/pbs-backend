CREATE TABLE IF NOT EXISTS dots_assessment (
    id SERIAL PRIMARY KEY,
    min_score DECIMAL(10,2),
    max_score DECIMAL(10,2),
    classification VARCHAR(50) NOT NULL, 
    description TEXT NOT NULL
);  

INSERT INTO dots_assessment (min_score, max_score, classification, description) VALUES 
    (0, 299.99, 'Poor', 'Need for significant improvement.'),
  (300, 349.99, 'Average', 'Basic level of strength.'),
  (350, 399.99, 'Good', 'Solid performance; competitive at local levels.'),
  (400, 449.99, 'Strong', 'Strong performance; competitive at regional levels.'),
  (450, 499.99, 'Very Strong', 'Exceptional performance; competitive at national levels.'),
  (500, NULL, 'Elite', 'Outstanding performance; competitive at international levels');