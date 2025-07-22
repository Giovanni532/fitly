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

                // Charger les défis et activités
                const [loadedChallenges, loadedActivities] = await Promise.all([
                    StorageService.getChallenges(),
                    StorageService.getActivities(),
                ]);

                // Mettre à jour le streak
                const currentStreak = await StorageService.updateStreak();

                // Marquer les défis complétés aujourd'hui
                const today = StorageService.getTodayString();
                const completedChallenges = await StorageService.getCompletedChallenges();
                const todaysCompleted = completedChallenges[today] || [];

                const updatedChallenges = loadedChallenges.map(challenge => ({
                    ...challenge,
                    completed: todaysCompleted.includes(challenge.id),
                }));

                setChallenges(updatedChallenges);
                setActivities(loadedActivities);

                // Calculer les statistiques
                updateStats(updatedChallenges, loadedActivities, currentStreak);

                console.log('Données chargées avec succès:', {
                    challenges: updatedChallenges.length,
                    activities: loadedActivities.length,
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
                // En cas d'erreur, utiliser les données par défaut
                const defaultChallenges = StorageService.getDefaultChallenges();
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
                console.log('Timeout de chargement, utilisation des données par défaut');
                const defaultChallenges = StorageService.getDefaultChallenges();
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



    const updateStats = (currentChallenges: Challenge[], currentActivities: Activity[], streak: number) => {
        const totalPoints = currentActivities.reduce((sum, activity) => sum + activity.points, 0) +
            currentChallenges.filter(c => c.completed).reduce((sum, challenge) => sum + challenge.points, 0);

        const challengesCompleted = currentChallenges.filter(c => c.completed).length;

        setStats({
            totalPoints,
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
            // Marquer le défi comme complété
            const updatedChallenges = challenges.map(challenge =>
                challenge.id === challengeId
                    ? { ...challenge, completed: true }
                    : challenge
            );

            // Sauvegarder les défis
            await StorageService.saveChallenges(updatedChallenges);

            // Sauvegarder le défi complété pour aujourd'hui
            const today = StorageService.getTodayString();
            const completedChallenges = await StorageService.getCompletedChallenges();
            const todaysCompleted = completedChallenges[today] || [];

            if (!todaysCompleted.includes(challengeId)) {
                completedChallenges[today] = [...todaysCompleted, challengeId];
                await StorageService.saveCompletedChallenges(completedChallenges);
            }

            // Mettre à jour le streak
            const newStreak = await StorageService.updateStreak();

            setChallenges(updatedChallenges);
            updateStats(updatedChallenges, activities, newStreak);
        } catch (error) {
            console.error('Erreur lors de la complétion du défi:', error);
        }
    };

    const addActivity = async (activity: Omit<Activity, 'id' | 'createdAt'>) => {
        try {
            const newActivity: Activity = {
                ...activity,
                id: Date.now().toString(),
                createdAt: new Date(),
            };

            const updatedActivities = [newActivity, ...activities];

            // Sauvegarder les activités
            await StorageService.saveActivities(updatedActivities);

            // Mettre à jour le streak
            const newStreak = await StorageService.updateStreak();

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
        refreshData: () => {
            const loadDataWithTimeout = async () => {
                try {
                    setLoading(true);

                    const [loadedChallenges, loadedActivities] = await Promise.all([
                        StorageService.getChallenges(),
                        StorageService.getActivities(),
                    ]);

                    const currentStreak = await StorageService.updateStreak();
                    const today = StorageService.getTodayString();
                    const completedChallenges = await StorageService.getCompletedChallenges();
                    const todaysCompleted = completedChallenges[today] || [];

                    const updatedChallenges = loadedChallenges.map(challenge => ({
                        ...challenge,
                        completed: todaysCompleted.includes(challenge.id),
                    }));

                    setChallenges(updatedChallenges);
                    setActivities(loadedActivities);
                    updateStats(updatedChallenges, loadedActivities, currentStreak);
                    setLoading(false);
                } catch (error) {
                    console.error('Erreur lors du rechargement:', error);
                    setLoading(false);
                }
            };
            loadDataWithTimeout();
        },
    };
} 