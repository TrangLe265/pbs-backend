export interface DotsAssessment {
    id: number;
    min_score: number;
    max_score: number;
    classification: 'Poor'|'Average'|'Good'|'Strong'|'Very Strong'|'Elite';
    description: string; 
}

export interface AssessmentParam {
    score: number; 
}