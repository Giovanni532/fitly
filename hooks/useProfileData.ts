import { StorageService } from '@/lib/storage';
import { Badge } from '@/lib/types';
import { useEffect, useState } from 'react';

export interface ProfileStats {
    totalPoints: number;
    currentLevel: number;
    progressToNextLevel: number;
    totalChallenges: number;
    totalActivities: number;
    streak: number;
    badges: Badge[];
}

// Callback pour notifier les autres hooks
type OnDataChangeCallback = () => void;

let dataChangeCallbacks: OnDataChangeCallback[] = [];

export function registerDataChangeCallback(callback: OnDataChangeCallback) {
    dataChangeCallbacks.push(callback);
    return () => {
        dataChangeCallbacks = dataChangeCallbacks.filter(cb => cb !== callback);
    };
}

export function notifyDataChange() {
    dataChangeCallbacks.forEach(callback => callback());
}

export function useProfileData() {
    const [stats, setStats] = useState<ProfileStats>({
        totalPoints: 0,
        currentLevel: 1,
        progressToNextLevel: 0,
        totalChallenges: 0,
        totalActivities: 0,
        streak: 0,
        badges: [],
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProfileData();
    }, []);

    const loadProfileData = async () => {
        try {
            setLoading(true);

            // Récupérer toutes les données en parallèle
            const [
                totalPoints,
                allActivities,
                allChallenges,
                streak,
                badges
            ] = await Promise.all([
                StorageService.getTotalPoints(),
                StorageService.getActivities(),
                StorageService.getChallenges(),
                StorageService.calculateStreakFromDates(),
                getBadges(),
            ]);

            // Calculer le niveau (100 points par niveau)
            const currentLevel = Math.floor(totalPoints / 100) + 1;
            const progressToNextLevel = (totalPoints % 100) / 100;

            // Compter les défis complétés
            const completedChallenges = allChallenges.filter(challenge => challenge.completed).length;

            setStats({
                totalPoints,
                currentLevel,
                progressToNextLevel,
                totalChallenges: completedChallenges,
                totalActivities: allActivities.length,
                streak,
                badges,
            });

            setLoading(false);
        } catch (error) {
            console.error('Erreur lors du chargement des données du profil:', error);
            setLoading(false);
        }
    };

    const getBadges = async (): Promise<Badge[]> => {
        // Logique pour déterminer les badges basée sur les vraies données
        const totalPoints = await StorageService.getTotalPoints();
        const allActivities = await StorageService.getActivities();
        const streak = await StorageService.calculateStreakFromDates();
        const allChallenges = await StorageService.getChallenges();
        const completedChallenges = allChallenges.filter(challenge => challenge.completed).length;

        const badges: Badge[] = [
            {
                id: 'beginner',
                name: 'Débutant',
                description: 'Complétez votre première activité',
                icon: 'star',
                unlocked: allActivities.length > 0,
                rarity: 'common',
            },
            {
                id: 'regular',
                name: 'Régulier',
                description: '7 jours consécutifs d\'activité',
                icon: 'calendar',
                unlocked: streak >= 7,
                rarity: 'common',
            },
            {
                id: 'athlete',
                name: 'Athlète',
                description: '1000 points cumulés',
                icon: 'fitness',
                unlocked: totalPoints >= 1000,
                rarity: 'rare',
            },
            {
                id: 'champion',
                name: 'Champion',
                description: 'Complétez 50 défis',
                icon: 'trophy',
                unlocked: completedChallenges >= 50,
                rarity: 'epic',
            },
            {
                id: 'marathon',
                name: 'Marathonien',
                description: '30 jours consécutifs d\'activité',
                icon: 'walk',
                unlocked: streak >= 30,
                rarity: 'epic',
            },
            {
                id: 'ultra',
                name: 'Ultra',
                description: '5000 points cumulés',
                icon: 'flash',
                unlocked: totalPoints >= 5000,
                rarity: 'legendary',
            },
        ];

        return badges;
    };

    const resetProgress = async () => {
        try {
            // Réinitialiser complètement toutes les données utilisateur
            await StorageService.resetAllUserData();

            // Notifier les autres hooks du changement
            notifyDataChange();

            // Recharger les données
            await loadProfileData();

            return true;
        } catch (error) {
            console.error('Erreur lors de la réinitialisation:', error);
            return false;
        }
    };

    return {
        stats,
        loading,
        refreshData: loadProfileData,
        resetProgress,
    };
} 