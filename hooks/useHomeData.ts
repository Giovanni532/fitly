import { StorageService } from '@/lib/storage';
import { Activity, Challenge, DailyStats } from '@/lib/types';
import { useEffect, useState } from 'react';

export function useHomeData() {
    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [stats, setStats] = useState<DailyStats>({
        totalPoints: 0,
        streak: 0,
        activitiesCount: 0,
        challengesCompleted: 0,
    });
    const [loading, setLoading] = useState(true);

    // Charger les données au démarrage
    useEffect(() => {
        let timeoutId: ReturnType<typeof setTimeout>;

        const loadDataWithTimeout = async () => {
            try {
                setLoading(true);

                // Charger les défis quotidiens et activités du jour
                const [loadedDailyActivities] = await Promise.all([
                    StorageService.getDailyActivities(),
                ]);

                // Générer les défis du jour
                const loadedChallenges = StorageService.getDailyChallenges();

                // Calculer le streak basé sur les dates réelles
                const currentStreak = await StorageService.calculateStreakFromDates();

                // Marquer les défis complétés aujourd'hui
                const today = StorageService.getTodayString();
                const completedChallenges = await StorageService.getCompletedChallenges();
                const todaysCompleted = completedChallenges[today] || [];

                const updatedChallenges = loadedChallenges.map(challenge => ({
                    ...challenge,
                    completed: todaysCompleted.includes(challenge.id),
                }));

                setChallenges(updatedChallenges);
                setActivities(loadedDailyActivities);

                // Calculer les statistiques
                updateStats(updatedChallenges, loadedDailyActivities, currentStreak);

                console.log('Données chargées avec succès:', {
                    challenges: updatedChallenges.length,
                    dailyActivities: loadedDailyActivities.length,
                    streak: currentStreak
                });

                setLoading(false);

                // Annuler le timeout car les données sont chargées
                if (timeoutId) {
                    clearTimeout(timeoutId);
                    console.log('Timeout annulé - données chargées avec succès');
                }
            } catch (error) {
                console.error('Erreur lors du chargement des données:', error);
                // En cas d'erreur, utiliser les défis quotidiens
                const defaultChallenges = StorageService.getDailyChallenges();
                setChallenges(defaultChallenges);
                setActivities([]);
                updateStats(defaultChallenges, [], 0);
                setLoading(false);

                // Annuler le timeout car on a géré l'erreur
                if (timeoutId) {
                    clearTimeout(timeoutId);
                    console.log('Timeout annulé - erreur gérée');
                }
            }
        };

        // Timeout de sécurité
        timeoutId = setTimeout(() => {
            if (loading) {
                console.log('Timeout de chargement, utilisation des défis quotidiens');
                const defaultChallenges = StorageService.getDailyChallenges();
                setChallenges(defaultChallenges);
                setActivities([]);
                updateStats(defaultChallenges, [], 0);
                setLoading(false);
            }
        }, 8000); // 8 secondes de timeout

        loadDataWithTimeout();

        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, []);

    const updateStats = async (currentChallenges: Challenge[], currentActivities: Activity[], streak: number) => {
        // Calculer les points du jour (activités + défis complétés)
        const dailyPoints = currentActivities.reduce((sum, activity) => sum + activity.points, 0) +
            currentChallenges.filter(c => c.completed).reduce((sum, challenge) => sum + challenge.points, 0);

        // Récupérer les points totaux
        const totalPoints = await StorageService.getTotalPoints();

        const challengesCompleted = currentChallenges.filter(c => c.completed).length;

        setStats({
            totalPoints: totalPoints + dailyPoints, // Points totaux + points du jour
            streak,
            activitiesCount: currentActivities.length,
            challengesCompleted,
        });
    };

    const startChallenge = async (challengeId: string) => {
        console.log('Défi commencé:', challengeId);
        // Ici vous pourriez ajouter une logique pour suivre le temps du défi
    };

    const completeChallenge = async (challengeId: string) => {
        try {
            const today = StorageService.getTodayString();

            // Marquer le défi comme complété avec la date
            const updatedChallenges = challenges.map(challenge =>
                challenge.id === challengeId
                    ? { ...challenge, completed: true, doAtThisDate: today }
                    : challenge
            );

            // Sauvegarder les défis
            await StorageService.saveChallenges(updatedChallenges);

            // Sauvegarder le défi complété pour aujourd'hui
            const completedChallenges = await StorageService.getCompletedChallenges();
            const todaysCompleted = completedChallenges[today] || [];

            if (!todaysCompleted.includes(challengeId)) {
                completedChallenges[today] = [...todaysCompleted, challengeId];
                await StorageService.saveCompletedChallenges(completedChallenges);
            }

            // Ajouter les points du défi aux points totaux
            const challenge = updatedChallenges.find(c => c.id === challengeId);
            if (challenge) {
                await StorageService.addPoints(challenge.points);
            }

            // Recalculer le streak basé sur les nouvelles données
            const newStreak = await StorageService.calculateStreakFromDates();

            setChallenges(updatedChallenges);
            updateStats(updatedChallenges, activities, newStreak);
        } catch (error) {
            console.error('Erreur lors de la complétion du défi:', error);
        }
    };

    const addActivity = async (activity: Omit<Activity, 'id' | 'createdAt' | 'doAtThisDate'>) => {
        try {
            const today = StorageService.getTodayString();

            const newActivity: Activity = {
                ...activity,
                id: Date.now().toString(),
                createdAt: new Date(),
                doAtThisDate: today,
            };

            const updatedActivities = [newActivity, ...activities];

            // Sauvegarder les activités du jour
            await StorageService.saveDailyActivities(updatedActivities);

            // Ajouter aux activités historiques
            const allActivities = await StorageService.getActivities();
            await StorageService.saveActivities([newActivity, ...allActivities]);

            // Ajouter les points aux points totaux
            await StorageService.addPoints(newActivity.points);

            // Recalculer le streak basé sur les nouvelles données
            const newStreak = await StorageService.calculateStreakFromDates();

            setActivities(updatedActivities);
            updateStats(challenges, updatedActivities, newStreak);
        } catch (error) {
            console.error('Erreur lors de l\'ajout de l\'activité:', error);
        }
    };

    const getTodaysChallenge = () => {
        // Retourne le premier défi non complété ou le premier si tous sont complétés
        return challenges.find(c => !c.completed) || challenges[0];
    };

    const resetDailyData = async () => {
        try {
            // Réinitialiser les défis pour aujourd'hui
            const updatedChallenges = challenges.map(challenge => ({
                ...challenge,
                completed: false,
            }));

            await StorageService.saveChallenges(updatedChallenges);
            setChallenges(updatedChallenges);
            updateStats(updatedChallenges, activities, stats.streak);
        } catch (error) {
            console.error('Erreur lors de la réinitialisation:', error);
        }
    };

    const refreshData = async () => {
        try {
            setLoading(true);

            // Vérifier si c'est un nouveau jour et réinitialiser si nécessaire
            await StorageService.resetDailyData();

            const [loadedDailyActivities] = await Promise.all([
                StorageService.getDailyActivities(),
            ]);

            // Générer les défis du jour
            const loadedChallenges = StorageService.getDailyChallenges();

            // Recalculer le streak basé sur les dates réelles
            const currentStreak = await StorageService.calculateStreakFromDates();

            const today = StorageService.getTodayString();
            const completedChallenges = await StorageService.getCompletedChallenges();
            const todaysCompleted = completedChallenges[today] || [];

            const updatedChallenges = loadedChallenges.map(challenge => ({
                ...challenge,
                completed: todaysCompleted.includes(challenge.id),
            }));

            setChallenges(updatedChallenges);
            setActivities(loadedDailyActivities);
            updateStats(updatedChallenges, loadedDailyActivities, currentStreak);
            setLoading(false);
        } catch (error) {
            console.error('Erreur lors du rechargement:', error);
            setLoading(false);
        }
    };

    return {
        challenges,
        activities,
        stats,
        loading,
        startChallenge,
        completeChallenge,
        addActivity,
        getTodaysChallenge,
        resetDailyData,
        refreshData,
    };
} 