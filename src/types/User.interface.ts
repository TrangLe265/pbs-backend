export interface User {
    id: number;
    name: string;
    sex: 'male' | 'female';
    body_weight: number; 
}

export interface UpdateUserWeight {
    body_weight: number;
}

export interface UserParam {
    id: string; 
}