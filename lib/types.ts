export interface Challenge {
    id: string;
    name: string;
    description?: string;
    completed: boolean;
    points: number;
    createdAt: Date;
}

export interface Activity {
    id: string;
    name: string;
    duration: string;
    intensity: 'light' | 'moderate' | 'intense';
    points: number;
    createdAt: Date;
}

export interface DailyStats {
    totalPoints: number;
    streak: number;
    activitiesCount: number;
    challengesCompleted: number;
} 