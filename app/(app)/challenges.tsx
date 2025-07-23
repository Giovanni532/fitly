import { ChallengeFilters } from '@/components/challenges/ChallengeFilters';
import { ChallengeStats } from '@/components/challenges/ChallengeStats';
import { CompletedToggle } from '@/components/challenges/CompletedToggle';
import { EmptyState } from '@/components/challenges/EmptyState';
import { SearchBar } from '@/components/challenges/SearchBar';
import { ChallengeCard } from '@/components/home/ChallengeCard';
import { StorageService } from '@/lib/storage';
import { Challenge } from '@/lib/types';
import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, ScrollView, Text, TouchableOpacity, View } from 'react-native';

// Types pour les filtres
type ChallengeType = 'all' | 'cardio' | 'muscu' | 'souplesse' | 'equilibre';
type Difficulty = 'all' | 'easy' | 'medium' | 'hard';

// Données de test pour les défis
const mockChallenges: Challenge[] = [
    {
        id: '1',
        name: '30 jours de cardio',
        description: 'Faites 30 minutes de cardio chaque jour pendant 30 jours',
        completed: false,
        points: 500,
        createdAt: new Date(),
        type: 'cardio',
        difficulty: 'medium',
        duration: '30 jours',
        intensity: 'moderate'
    },
    {
        id: '2',
        name: 'Challenge musculation',
        description: '100 pompes par jour pendant une semaine',
        completed: true,
        points: 300,
        createdAt: new Date(),
        doAtThisDate: '2024-01-15',
        type: 'muscu',
        difficulty: 'hard',
        duration: '7 jours',
        intensity: 'intense'
    },
    {
        id: '3',
        name: 'Équilibre quotidien',
        description: 'Pose d\'équilibre de 5 minutes par jour',
        completed: false,
        points: 200,
        createdAt: new Date(),
        type: 'equilibre',
        difficulty: 'easy',
        duration: '14 jours',
        intensity: 'light'
    },
    {
        id: '4',
        name: 'Souplesse matinale',
        description: 'Étirements de 10 minutes chaque matin',
        completed: false,
        points: 150,
        createdAt: new Date(),
        type: 'souplesse',
        difficulty: 'easy',
        duration: '21 jours',
        intensity: 'light'
    },
    {
        id: '5',
        name: 'Marathon virtuel',
        description: 'Cumulez 42km de course à pied',
        completed: false,
        points: 1000,
        createdAt: new Date(),
        type: 'cardio',
        difficulty: 'hard',
        duration: 'Flexible',
        intensity: 'intense'
    }
];

export default function ChallengesPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState<ChallengeType>('all');
    const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('all');
    const [showCompleted, setShowCompleted] = useState(true);
    const [challenges, setChallenges] = useState<Challenge[]>(mockChallenges); // Initialiser avec les défis par défaut
    const [loading, setLoading] = useState(true);

    // Charger les défis au montage du composant
    useEffect(() => {
        const loadChallenges = async () => {
            try {
                setLoading(true);
                const loadedChallenges = await StorageService.getChallenges();

                // Si aucun défi n'est chargé, utiliser les défis par défaut
                if (loadedChallenges.length === 0) {
                    setChallenges(mockChallenges);
                } else {
                    setChallenges(loadedChallenges);
                }
            } catch (error) {
                console.error('Erreur lors du chargement des défis:', error);
                setChallenges(mockChallenges); // Fallback vers les données de test
            } finally {
                setLoading(false);
            }
        };

        loadChallenges();
    }, []);

    // Filtrage des défis
    const filteredChallenges = useMemo(() => {
        const filtered = challenges.filter(challenge => {
            // Filtre par recherche
            const matchesSearch = challenge.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                challenge.description?.toLowerCase().includes(searchQuery.toLowerCase());

            // Filtre par type
            const matchesType = selectedType === 'all' || challenge.type === selectedType;

            // Filtre par difficulté
            const matchesDifficulty = selectedDifficulty === 'all' || challenge.difficulty === selectedDifficulty;

            // Filtre par statut (complété ou non)
            const matchesStatus = showCompleted || !challenge.completed;

            return matchesSearch && matchesType && matchesDifficulty && matchesStatus;
        });

        return filtered;
    }, [challenges, searchQuery, selectedType, selectedDifficulty, showCompleted]);

    const handleStartChallenge = async (challengeId: string) => {
        try {
            await StorageService.startChallenge(challengeId);
            const updatedChallenges = await StorageService.getChallenges();
            setChallenges(updatedChallenges);
        } catch (error) {
            console.error('Erreur lors du démarrage du défi:', error);
        }
    };

    const handleCompleteChallenge = async (challengeId: string) => {
        try {
            const result = await StorageService.completeChallenge(challengeId);

            if (result.success) {
                const updatedChallenges = await StorageService.getChallenges();
                setChallenges(updatedChallenges);
            }
        } catch (error) {
            console.error('Erreur lors de la completion du défi:', error);
        }
    };

    const renderChallengeCard = ({ item }: { item: Challenge }) => (
        <View className="mb-4">
            <ChallengeCard
                challenge={item}
                onStart={handleStartChallenge}
                onComplete={handleCompleteChallenge}
            />
        </View>
    );

    return (
        <View className="flex-1 bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <View className="bg-white dark:bg-gray-800 px-4 pt-12 pb-4 border-b border-gray-200 dark:border-gray-700">
                <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Défis
                </Text>
                <Text className="text-gray-600 dark:text-gray-400">
                    Relevez des défis et gagnez des points
                </Text>
            </View>

            <ScrollView className="flex-1 px-4 pt-4">
                {loading ? (
                    <View className="flex-1 justify-center items-center py-20">
                        <Text className="text-gray-600 dark:text-gray-300 text-lg">Chargement des défis...</Text>
                    </View>
                ) : (
                    <>
                        {/* Barre de recherche */}
                        <View className="mb-6">
                            <SearchBar
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                placeholder="Rechercher un défi..."
                            />
                        </View>

                        {/* Filtres */}
                        <ChallengeFilters
                            selectedType={selectedType}
                            selectedDifficulty={selectedDifficulty}
                            onTypeChange={setSelectedType}
                            onDifficultyChange={setSelectedDifficulty}
                        />

                        {/* Toggle pour afficher/masquer les défis complétés */}
                        <View className="mb-6">
                            <CompletedToggle
                                showCompleted={showCompleted}
                                onToggle={setShowCompleted}
                            />
                        </View>

                        {/* Statistiques */}
                        <View className="mb-6">
                            <ChallengeStats
                                challenges={challenges}
                                filteredCount={filteredChallenges.length}
                            />
                        </View>

                        {/* Bouton de réinitialisation temporaire */}
                        <View className="mb-6">
                            <TouchableOpacity
                                onPress={async () => {
                                    try {
                                        await StorageService.resetAllChallenges();
                                        const updatedChallenges = await StorageService.getChallenges();
                                        setChallenges(updatedChallenges);
                                    } catch (error) {
                                        console.error('Erreur lors de la réinitialisation:', error);
                                    }
                                }}
                                className="bg-red-500 px-4 py-2 rounded-lg"
                            >
                                <Text className="text-white text-center font-medium">
                                    Réinitialiser tous les défis
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Liste des défis */}
                        <View className="mb-6">
                            <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                                Défis disponibles
                            </Text>
                            {filteredChallenges.length === 0 ? (
                                <EmptyState />
                            ) : (
                                <FlatList
                                    data={filteredChallenges}
                                    renderItem={renderChallengeCard}
                                    keyExtractor={(item) => item.id}
                                    scrollEnabled={false}
                                    showsVerticalScrollIndicator={false}
                                />
                            )}
                        </View>
                    </>
                )}
            </ScrollView>
        </View>
    );
} 