export interface Challenge {
    id: string;
    name: string;
    description?: string;
    completed: boolean;
    points: number;
    createdAt: Date;
    doAtThisDate?: string; // Date au format YYYY-MM-DD quand le défi a été complété
    type?: 'cardio' | 'muscu' | 'souplesse' | 'equilibre';
    difficulty?: 'easy' | 'medium' | 'hard';
    duration?: string;
    intensity?: 'light' | 'moderate' | 'intense';
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

export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string;
    unlocked: boolean;
    unlockedAt?: string; // Date au format YYYY-MM-DD quand le badge a été débloqué
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface WeeklyActivityData {
    day: string;
    active: boolean;
    activities: number;
}

export interface ActivityDistributionData {
    name: string;
    value: number;
    color: string;
}

export interface Statistics {
    totalPoints: number;
    totalBadges: number;
    currentStreak: number;
    totalTrainingTime: number;
    activeDaysThisWeek: number;
    weeklyData: WeeklyActivityData[];
    activityDistribution: ActivityDistributionData[];
    badges: Badge[];
} 