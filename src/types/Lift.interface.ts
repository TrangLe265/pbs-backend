export interface Lift{
    id: number;
    userId: number;
    weight_lifted: number; 
    lift_type_id: number;
    date: Date;
    notes?: string
}