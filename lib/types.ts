export interface Challenge {
    id: string;
    name: string;
    description?: string;
    completed: boolean;
    points: number;
    createdAt: Date;
    doAtThisDate?: string; // Date au format YYYY-MM-DD quand le défi a été complété
}

export interface Activity {
    id: string;
    name: string;
    duration: string;
    intensity: 'light' | 'moderate' | 'intense';
    points: number;
    createdAt: Date;
    doAtThisDate: string; // Date au format YYYY-MM-DD quand l'activité a été faite
}

export interface DailyStats {
    totalPoints: number;
    streak: number;
    activitiesCount: number;
    challengesCompleted: number;
} 