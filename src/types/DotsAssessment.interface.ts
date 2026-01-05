export interface DotsAssessment {
    id: number;
    minScore: number;
    maxScore: number;
    classification: 'Poor'|'Average'|'Good'|'Strong'|'Very Strong'|'Elite';
    description: string; 
}