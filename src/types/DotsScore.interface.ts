export interface DotsScore {
    id: number;
    score: number;
    date_calculated: Date;
    user_id: number;
    bench_lift_id: number;
    squat_lift_id: number;
    deadlift_lift_id: number;
}

export interface ScoreParam {
    id: number;
}

export interface NewScore {
    score: number;
    date_calculated: Date;
    user_id: number;
    bench_lift_id: number;
    squat_lift_id: number;
    deadlift_lift_id: number;
}