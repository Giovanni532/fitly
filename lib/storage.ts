import AsyncStorage from '@react-native-async-storage/async-storage';
import { Activity, Challenge } from './types';

const STORAGE_KEYS = {
    CHALLENGES: 'fitly_challenges',
    ACTIVITIES: 'fitly_activities',
    STREAK: 'fitly_streak',
    LAST_ACTIVITY_DATE: 'fitly_last_activity_date',
    COMPLETED_CHALLENGES: 'fitly_completed_challenges',
};

export class StorageService {
    // Gestion des défis
    static async getChallenges(): Promise<Challenge[]> {
        try {
            const data = await AsyncStorage.getItem(STORAGE_KEYS.CHALLENGES);
            return data ? JSON.parse(data) : this.getDefaultChallenges();
        } catch (error) {
            console.error('Erreur lors de la récupération des défis:', error);
            return this.getDefaultChallenges();
        }
    }

    static async saveChallenges(challenges: Challenge[]): Promise<void> {
        try {
            await AsyncStorage.setItem(STORAGE_KEYS.CHALLENGES, JSON.stringify(challenges));
        } catch (error) {
            console.error('Erreur lors de la sauvegarde des défis:', error);
        }
    }

    // Gestion des activités
    static async getActivities(): Promise<Activity[]> {
        try {
            const data = await AsyncStorage.getItem(STORAGE_KEYS.ACTIVITIES);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Erreur lors de la récupération des activités:', error);
            return [];
        }
    }

    static async saveActivities(activities: Activity[]): Promise<void> {
        try {
            await AsyncStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
        } catch (error) {
            console.error('Erreur lors de la sauvegarde des activités:', error);
        }
    }

    // Gestion du streak
    static async getStreak(): Promise<number> {
        try {
            const data = await AsyncStorage.getItem(STORAGE_KEYS.STREAK);
            return data ? parseInt(data, 10) : 0;
        } catch (error) {
            console.error('Erreur lors de la récupération du streak:', error);
            return 0;
        }
    }

    static async saveStreak(streak: number): Promise<void> {
        try {
            await AsyncStorage.setItem(STORAGE_KEYS.STREAK, streak.toString());
        } catch (error) {
            console.error('Erreur lors de la sauvegarde du streak:', error);
        }
    }

    // Gestion de la date de dernière activité
    static async getLastActivityDate(): Promise<string | null> {
        try {
            return await AsyncStorage.getItem(STORAGE_KEYS.LAST_ACTIVITY_DATE);
        } catch (error) {
            console.error('Erreur lors de la récupération de la date:', error);
            return null;
        }
    }

    static async saveLastActivityDate(date: string): Promise<void> {
        try {
            await AsyncStorage.setItem(STORAGE_KEYS.LAST_ACTIVITY_DATE, date);
        } catch (error) {
            console.error('Erreur lors de la sauvegarde de la date:', error);
        }
    }

    // Gestion des défis complétés par date
    static async getCompletedChallenges(): Promise<Record<string, string[]>> {
        try {
            const data = await AsyncStorage.getItem(STORAGE_KEYS.COMPLETED_CHALLENGES);
            return data ? JSON.parse(data) : {};
        } catch (error) {
            console.error('Erreur lors de la récupération des défis complétés:', error);
            return {};
        }
    }

    static async saveCompletedChallenges(completed: Record<string, string[]>): Promise<void> {
        try {
            await AsyncStorage.setItem(STORAGE_KEYS.COMPLETED_CHALLENGES, JSON.stringify(completed));
        } catch (error) {
            console.error('Erreur lors de la sauvegarde des défis complétés:', error);
        }
    }

    // Méthodes utilitaires
    static getDefaultChallenges(): Challenge[] {
        return [
            {
                id: '1',
                name: '30 squats',
                description: 'Renforce tes cuisses et tes fessiers',
                completed: false,
                points: 20,
                createdAt: new Date(),
            },
            {
                id: '2',
                name: '20 pompes',
                description: 'Développe ta force du haut du corps',
                completed: false,
                points: 25,
                createdAt: new Date(),
            },
            {
                id: '3',
                name: '5 minutes de planche',
                description: 'Améliore ta stabilité et ton gainage',
                completed: false,
                points: 30,
                createdAt: new Date(),
            },
            {
                id: '4',
                name: '50 jumping jacks',
                description: 'Cardio et coordination',
                completed: false,
                points: 15,
                createdAt: new Date(),
            },
            {
                id: '5',
                name: '10 burpees',
                description: 'Exercice complet et intense',
                completed: false,
                points: 35,
                createdAt: new Date(),
            },
        ];
    }

    static getTodayString(): string {
        return new Date().toISOString().split('T')[0];
    }

    static async updateStreak(): Promise<number> {
        const today = this.getTodayString();
        const lastActivityDate = await this.getLastActivityDate();
        const currentStreak = await this.getStreak();

        if (lastActivityDate === today) {
            // Déjà une activité aujourd'hui, pas de changement
            return currentStreak;
        }

        if (lastActivityDate === this.getYesterdayString()) {
            // Activité hier, continuer le streak
            const newStreak = currentStreak + 1;
            await this.saveStreak(newStreak);
            await this.saveLastActivityDate(today);
            return newStreak;
        } else {
            // Pas d'activité hier, reset du streak
            await this.saveStreak(1);
            await this.saveLastActivityDate(today);
            return 1;
        }
    }

    static getYesterdayString(): string {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return yesterday.toISOString().split('T')[0];
    }
} 