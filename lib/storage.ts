import AsyncStorage from '@react-native-async-storage/async-storage';
import { Activity, Challenge } from './types';

const STORAGE_KEYS = {
    CHALLENGES: 'fitly_challenges',
    ACTIVITIES: 'fitly_activities',
    TOTAL_POINTS: 'fitly_total_points',
    DAILY_ACTIVITIES: 'fitly_daily_activities',
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

    // Gestion des activités (historique complet)
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

    // Gestion des activités du jour
    static async getDailyActivities(): Promise<Activity[]> {
        try {
            const today = this.getTodayString();
            const data = await AsyncStorage.getItem(`${STORAGE_KEYS.DAILY_ACTIVITIES}_${today}`);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Erreur lors de la récupération des activités du jour:', error);
            return [];
        }
    }

    static async saveDailyActivities(activities: Activity[]): Promise<void> {
        try {
            const today = this.getTodayString();
            await AsyncStorage.setItem(`${STORAGE_KEYS.DAILY_ACTIVITIES}_${today}`, JSON.stringify(activities));
        } catch (error) {
            console.error('Erreur lors de la sauvegarde des activités du jour:', error);
        }
    }

    // Gestion des points totaux
    static async getTotalPoints(): Promise<number> {
        try {
            const data = await AsyncStorage.getItem(STORAGE_KEYS.TOTAL_POINTS);
            return data ? parseInt(data, 10) : 0;
        } catch (error) {
            console.error('Erreur lors de la récupération des points totaux:', error);
            return 0;
        }
    }

    static async saveTotalPoints(points: number): Promise<void> {
        try {
            await AsyncStorage.setItem(STORAGE_KEYS.TOTAL_POINTS, points.toString());
        } catch (error) {
            console.error('Erreur lors de la sauvegarde des points totaux:', error);
        }
    }

    static async addPoints(pointsToAdd: number): Promise<number> {
        const currentPoints = await this.getTotalPoints();
        const newTotal = currentPoints + pointsToAdd;
        await this.saveTotalPoints(newTotal);
        return newTotal;
    }

    // Gestion du streak
    static async getStreak(): Promise<number> {
        try {
            const data = await AsyncStorage.getItem(STORAGE_KEYS.STREAK);
            return data ? parseInt(data, 10) : 0; // Retourner 0 par défaut, sera calculé automatiquement
        } catch (error) {
            console.error('Erreur lors de la récupération du streak:', error);
            return 0; // Retourner 0 par défaut en cas d'erreur
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
                name: '20 squats',
                description: '3 séries de 20 avec 1 min de pause entre chaque série',
                completed: false,
                points: 25,
                createdAt: new Date(),
            },
            {
                id: '2',
                name: '10 pompes',
                description: '3 séries de 10 avec 1 min de pause entre chaque série',
                completed: false,
                points: 30,
                createdAt: new Date(),
            },
            {
                id: '3',
                name: 'Planche 1 minute',
                description: '3 séries de 1 min avec 1 min de pause entre chaque série',
                completed: false,
                points: 20,
                createdAt: new Date(),
            },
            {
                id: '4',
                name: '30 jumping jacks',
                description: '2 séries de 30 avec 1 min de pause entre chaque série',
                completed: false,
                points: 15,
                createdAt: new Date(),
            },
            {
                id: '5',
                name: '5 burpees',
                description: '3 séries de 5 avec 1 min de pause entre chaque série',
                completed: false,
                points: 35,
                createdAt: new Date(),
            },
        ];
    }

    // Générer des défis variés selon le jour
    static getDailyChallenges(): Challenge[] {
        const today = new Date();
        const dayOfWeek = today.getDay(); // 0 = dimanche, 1 = lundi, etc.
        const dayOfMonth = today.getDate();

        // Défis de base pour chaque jour de la semaine
        const weeklyChallenges = [
            // Lundi - Début de semaine, cardio léger
            [
                {
                    id: 'monday-1',
                    name: '15 jumping jacks',
                    description: '3 séries de 15 avec 1 min de pause',
                    completed: false,
                    points: 20,
                    createdAt: new Date(),
                },
                {
                    id: 'monday-2',
                    name: '10 squats',
                    description: '2 séries de 10 avec 1 min de pause',
                    completed: false,
                    points: 15,
                    createdAt: new Date(),
                },
                {
                    id: 'monday-3',
                    name: 'Planche 30 secondes',
                    description: '2 séries de 30s avec 1 min de pause',
                    completed: false,
                    points: 15,
                    createdAt: new Date(),
                }
            ],
            // Mardi - Force du haut du corps
            [
                {
                    id: 'tuesday-1',
                    name: '8 pompes',
                    description: '3 séries de 8 avec 1 min de pause',
                    completed: false,
                    points: 25,
                    createdAt: new Date(),
                },
                {
                    id: 'tuesday-2',
                    name: '15 squats',
                    description: '2 séries de 15 avec 1 min de pause',
                    completed: false,
                    points: 20,
                    createdAt: new Date(),
                },
                {
                    id: 'tuesday-3',
                    name: 'Planche 45 secondes',
                    description: '2 séries de 45s avec 1 min de pause',
                    completed: false,
                    points: 20,
                    createdAt: new Date(),
                }
            ],
            // Mercredi - Cardio modéré
            [
                {
                    id: 'wednesday-1',
                    name: '25 jumping jacks',
                    description: '2 séries de 25 avec 1 min de pause',
                    completed: false,
                    points: 25,
                    createdAt: new Date(),
                },
                {
                    id: 'wednesday-2',
                    name: '12 pompes',
                    description: '2 séries de 12 avec 1 min de pause',
                    completed: false,
                    points: 30,
                    createdAt: new Date(),
                },
                {
                    id: 'wednesday-3',
                    name: '20 squats',
                    description: '2 séries de 20 avec 1 min de pause',
                    completed: false,
                    points: 25,
                    createdAt: new Date(),
                }
            ],
            // Jeudi - Force et équilibre
            [
                {
                    id: 'thursday-1',
                    name: '10 burpees',
                    description: '2 séries de 10 avec 1 min de pause',
                    completed: false,
                    points: 40,
                    createdAt: new Date(),
                },
                {
                    id: 'thursday-2',
                    name: 'Planche 1 minute',
                    description: '2 séries de 1 min avec 1 min de pause',
                    completed: false,
                    points: 25,
                    createdAt: new Date(),
                },
                {
                    id: 'thursday-3',
                    name: '15 squats',
                    description: '2 séries de 15 avec 1 min de pause',
                    completed: false,
                    points: 20,
                    createdAt: new Date(),
                }
            ],
            // Vendredi - Fin de semaine, intensité modérée
            [
                {
                    id: 'friday-1',
                    name: '30 jumping jacks',
                    description: '2 séries de 30 avec 1 min de pause',
                    completed: false,
                    points: 30,
                    createdAt: new Date(),
                },
                {
                    id: 'friday-2',
                    name: '15 pompes',
                    description: '2 séries de 15 avec 1 min de pause',
                    completed: false,
                    points: 35,
                    createdAt: new Date(),
                },
                {
                    id: 'friday-3',
                    name: '25 squats',
                    description: '2 séries de 25 avec 1 min de pause',
                    completed: false,
                    points: 30,
                    createdAt: new Date(),
                }
            ],
            // Samedi - Weekend, défi spécial
            [
                {
                    id: 'saturday-1',
                    name: 'Circuit complet',
                    description: '10 squats + 5 pompes + 30s planche, 2 séries avec 1 min de pause',
                    completed: false,
                    points: 45,
                    createdAt: new Date(),
                },
                {
                    id: 'saturday-2',
                    name: '20 jumping jacks',
                    description: '3 séries de 20 avec 1 min de pause',
                    completed: false,
                    points: 30,
                    createdAt: new Date(),
                },
                {
                    id: 'saturday-3',
                    name: 'Planche 1 min 30',
                    description: '2 séries de 1 min 30 avec 1 min de pause',
                    completed: false,
                    points: 35,
                    createdAt: new Date(),
                }
            ],
            // Dimanche - Repos actif
            [
                {
                    id: 'sunday-1',
                    name: 'Étirements 5 min',
                    description: 'Séance d\'étirements complète de 5 minutes',
                    completed: false,
                    points: 20,
                    createdAt: new Date(),
                },
                {
                    id: 'sunday-2',
                    name: '10 squats lents',
                    description: '2 séries de 10 squats lents avec 1 min de pause',
                    completed: false,
                    points: 15,
                    createdAt: new Date(),
                },
                {
                    id: 'sunday-3',
                    name: 'Planche 45 secondes',
                    description: '2 séries de 45s avec 1 min de pause',
                    completed: false,
                    points: 20,
                    createdAt: new Date(),
                }
            ]
        ];

        // Ajouter une variation selon le jour du mois pour plus de diversité
        const monthVariation = dayOfMonth % 3;
        const baseChallenges = weeklyChallenges[dayOfWeek] || weeklyChallenges[1]; // Lundi par défaut

        // Modifier légèrement les défis selon le jour du mois
        return baseChallenges.map((challenge, index) => ({
            ...challenge,
            id: `${challenge.id}-${monthVariation}`,
            points: challenge.points + (monthVariation * 5), // +5 points tous les 3 jours
        }));
    }

    static getTodayString(): string {
        return new Date().toISOString().split('T')[0];
    }

    static getYesterdayString(): string {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return yesterday.toISOString().split('T')[0];
    }

    // Réinitialiser les données quotidiennes
    static async resetDailyData(): Promise<void> {
        try {
            const today = this.getTodayString();

            // Vider les activités du jour
            await this.saveDailyActivities([]);

            // Réinitialiser les défis pour aujourd'hui
            const completedChallenges = await this.getCompletedChallenges();
            delete completedChallenges[today];
            await this.saveCompletedChallenges(completedChallenges);

        } catch (error) {
            console.error('Erreur lors de la réinitialisation des données quotidiennes:', error);
        }
    }

    // Calculer le streak basé sur les dates réelles des activités et défis
    static async calculateStreakFromDates(): Promise<number> {
        try {
            const today = this.getTodayString();
            const yesterday = this.getYesterdayString();

            // Récupérer toutes les activités avec leurs dates
            const allActivities = await this.getActivities();
            const allChallenges = await this.getChallenges();

            // Récupérer les défis complétés par date
            const completedChallenges = await this.getCompletedChallenges();

            // Créer un Set de toutes les dates où il y a eu une activité ou un défi complété
            const activityDates = new Set<string>();

            // Ajouter les dates des activités
            allActivities.forEach(activity => {
                if (activity.doAtThisDate) {
                    activityDates.add(activity.doAtThisDate);
                }
            });

            // Ajouter les dates des défis complétés
            Object.keys(completedChallenges).forEach(date => {
                if (completedChallenges[date].length > 0) {
                    activityDates.add(date);
                }
            });

            // Convertir en tableau et trier par date (plus récent en premier)
            const sortedDates = Array.from(activityDates).sort((a, b) => b.localeCompare(a));

            // Calculer le streak
            let streak = 0;
            let currentDate = new Date(today);

            for (let i = 0; i < sortedDates.length; i++) {
                const activityDate = sortedDates[i];
                const expectedDate = currentDate.toISOString().split('T')[0];

                if (activityDate === expectedDate) {
                    streak++;
                    currentDate.setDate(currentDate.getDate() - 1); // Passer au jour précédent
                } else {
                    // Si on trouve un trou dans la séquence, arrêter
                    break;
                }
            }

            await this.saveStreak(streak);
            return streak;

        } catch (error) {
            console.error('Erreur lors du calcul du streak:', error);
            return 0;
        }
    }
} 