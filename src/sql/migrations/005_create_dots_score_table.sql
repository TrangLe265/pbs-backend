CREATE TABLE IF NOT EXISTS dots_score (
    id SERIAL PRIMARY KEY,
    score DECIMAL(10,2) NOT NULL,
    date_calculated DATE DEFAULT CURRENT_DATE,
    user_id INTEGER NOT NULL,
    bench_lift_id INTEGER,
    squat_lift_id INTEGER,
    deadlift_lift_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES app_user(id) ON DELETE CASCADE,
    FOREIGN KEY (bench_lift_id) REFERENCES lift(id) ON DELETE CASCADE,
    FOREIGN KEY (squat_lift_id) REFERENCES lift(id) ON DELETE CASCADE,
    FOREIGN KEY (deadlift_lift_id) REFERENCES lift(id) ON DELETE CASCADE
);