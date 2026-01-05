export interface Lift{
    id: number;
    user_id: number;
    weight_lifted: number; 
    lift_type_id: number;
    date: Date;
    notes?: string | ''
}

export interface LiftIdParam {
    id: string,
}

export interface AllLiftByTypeParam {
    user_id: string;
    lift_type_id: string; 
}

export interface NewLift {
    user_id: number;
    weight_lifted: number; 
    lift_type_id: number;
    date: Date;
    notes?: string 
}

export interface EditLift {
    weight_lifted: number;
    date?: Date;
    notes?: string
}