CREATE TABLE IF NOT EXISTS dots_score (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY, 
    score DECIMAL(10,2) NOT NULL,
    date_calculated DATE DEFAULT CURRENT_DATE,
    user_id uuid REFERENCES app_user(id) ON DELETE CASCADE,
    bench_lift_id uuid REFERENCES lift(id) ON DELETE CASCADE,
    squat_lift_id uuid REFERENCES lift(id) ON DELETE CASCADE,
    deadlift_lift_id uuid REFERENCES lift(id) ON DELETE CASCADE
);
