CREATE TABLE IF NOT EXISTS lift (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    weight_lifted DECIMAL(10,2) NOT NULL,
    lift_type_id INTEGER NOT NULL,
    date DATE NOT NULL,
    notes TEXT,
    FOREIGN KEY (user_id) REFERENCES app_user(id) ON DELETE CASCADE,
    FOREIGN KEY (lift_type_id) REFERENCES lift_type(id) ON DELETE CASCADE
);

