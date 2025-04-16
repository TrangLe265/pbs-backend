    CREATE TABLE IF NOT EXISTS lift (
        id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id uuid REFERENCES app_user(id) ON DELETE CASCADE, 
        weight_lifted DECIMAL(10,2) NOT NULL, 
        lift_type_id uuid REFERENCES lift_type(id) ON DELETE CASCADE,
        date DATE NOT NULL,
        notes TEXT
    )

    