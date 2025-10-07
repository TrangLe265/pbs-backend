    CREATE TABLE IF NOT EXISTS lift (
        id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        user_id uuid REFERENCES app_user(id) ON DELETE CASCADE, 
        weight_lifted DECIMAL(10,2) NOT NULL, 
        lift_type_id BIGINT REFERENCES lift_type(id) ON DELETE CASCADE,
        date DATE NOT NULL,
        notes TEXT
    ); 
  