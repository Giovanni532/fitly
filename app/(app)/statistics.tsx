import { Card, CardContent } from '@/components/ui/card';
import { Loading } from '@/components/ui/loading';
import { StorageService } from '@/lib/storage';
import { Activity, ActivityDistributionData, Badge, Challenge, WeeklyActivityData } from '@/lib/types';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Types pour les statistiques
type TimePeriod = 'week' | 'month' | 'year';

// Composant Header amélioré
function StatisticsHeader({ totalPoints, currentStreak, totalBadges }: {
    totalPoints: number;
    currentStreak: number;
    totalBadges: number;
}) {
    const currentDate = new Date();
    const monthName = currentDate.toLocaleDateString('fr-FR', { month: 'long' });
    const year = currentDate.getFullYear();

    return (
        <View className="bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 px-4 pt-4 pb-6 rounded-b-3xl shadow-lg">
            {/* En-tête principal */}
            <View className="flex-row items-center justify-between mb-4">
                <View>
                    <Text className="text-2xl font-semibold mb-1 shadow-none">
                        Mes Statistiques
                    </Text>
                    <Text className="text-sm font-semibold shadow-none">
                        {monthName} {year}
                    </Text>
                </View>
                <View className="bg-white/20 rounded-full p-3">
                    <Ionicons name="analytics" size={28} color="blue" />
                </View>
            </View>

            {/* Cartes de statistiques rapides */}
            <View className="flex-row space-x-3 ">
                {/* Points totaux */}
                <Card className="flex-1 bg-white/20 border-0 m-2 bg-white shadow-none">
                    <CardContent className="p-3">
                        <View className="items-center">
                            <View className="bg-yellow-400 rounded-full p-2 mb-2">
                                <Ionicons name="star" size={16} color="white" />
                            </View>
                            <Text className="text-lg font-bold">
                                {totalPoints.toLocaleString()}
                            </Text>
                            <Text className="text-xs">
                                Points
                            </Text>
                        </View>
                    </CardContent>
                </Card>

                {/* Streak actuel */}
                <Card className="flex-1 bg-white/20 border-0 m-2 bg-white shadow-none">
                    <CardContent className="p-3">
                        <View className="items-center">
                            <View className="bg-red-400 rounded-full p-2 mb-2">
                                <Ionicons name="flame" size={16} color="white" />
                            </View>
                            <Text className="text-lg font-bold">
                                {currentStreak}
                            </Text>
                            <Text className="text-xs">
                                Jours
                            </Text>
                        </View>
                    </CardContent>
                </Card>

                {/* Badges */}
                <Card className="flex-1 bg-white/20 border-0 m-2 bg-white shadow-none">
                    <CardContent className="p-3">
                        <View className="items-center">
                            <View className="bg-purple-400 rounded-full p-2 mb-2">
                                <Ionicons name="trophy" size={16} color="white" />
                            </View>
                            <Text className="text-lg font-bold">
                                {totalBadges}
                            </Text>
                            <Text className="text-xs">
                                Badges
                            </Text>
                        </View>
                    </CardContent>
                </Card>
            </View>

            {/* Message motivant */}
            <View className="mt-4 bg-white/10 rounded-xl p-3">
                <Text className="text-center text-sm font-medium">
                    {currentStreak > 0
                        ? `🔥 Incroyable ! Vous êtes actif depuis ${currentStreak} jour${currentStreak > 1 ? 's' : ''} !`
                        : "🚀 Commencez votre voyage fitness aujourd'hui !"
                    }
                </Text>
            </View>
        </View>
    );
}

// Composant Filtre de période
function TimeFilter({ selectedPeriod, onPeriodChange }: {
    selectedPeriod: TimePeriod;
    onPeriodChange: (period: TimePeriod) => void;
}) {
    const periods = [
        { id: 'week', label: 'Semaine', icon: 'calendar' },
        { id: 'month', label: 'Mois', icon: 'calendar-outline' },
        { id: 'year', label: 'Année', icon: 'calendar-clear' }
    ];

    return (
        <View className="bg-white border border-gray-200 p-2 rounded-xl">
            <View className="flex-row">
                {periods.map((period) => (
                    <View
                        key={period.id}
                        className={`flex-1 py-2 px-4 rounded-lg ${selectedPeriod === period.id
                            ? 'bg-blue-500'
                            : 'bg-transparent'
                            }`}
                    >
                        <TouchableOpacity
                            className="items-center"
                            onPress={() => onPeriodChange(period.id as TimePeriod)}
                            activeOpacity={0.7}
                        >
                            <Ionicons
                                name={period.icon as any}
                                size={16}
                                color={selectedPeriod === period.id ? 'white' : '#6B7280'}
                                style={{ marginBottom: 4 }}
                            />
                            <Text
                                className={`text-center font-medium ${selectedPeriod === period.id
                                    ? 'text-white'
                                    : 'text-gray-700'
                                    }`}
                            >
                                {period.label}
                            </Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
        </View>
    );
}

// Composant Cartes de statistiques
function StatisticsCards({ totalPoints, totalBadges, currentStreak, totalTrainingTime, activeDaysThisWeek }: {
    totalPoints: number;
    totalBadges: number;
    currentStreak: number;
    totalTrainingTime: number;
    activeDaysThisWeek: number;
}) {
    const stats = [
        {
            title: 'Points totaux',
            value: totalPoints.toLocaleString(),
            icon: 'star',
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-50'
        },
        {
            title: 'Badges',
            value: totalBadges.toString(),
            icon: 'trophy',
            color: 'text-purple-600',
            bgColor: 'bg-purple-50'
        },
        {
            title: 'Streak actuel',
            value: `${currentStreak} jours`,
            icon: 'flame',
            color: 'text-red-600',
            bgColor: 'bg-red-50'
        },
        {
            title: 'Temps d\'entraînement',
            value: `${totalTrainingTime}h`,
            icon: 'time',
            color: 'text-blue-600',
            bgColor: 'bg-blue-50'
        },
        {
            title: 'Jours actifs',
            value: `${activeDaysThisWeek}/7`,
            icon: 'calendar',
            color: 'text-green-600',
            bgColor: 'bg-green-50'
        }
    ];

    return (
        <View className="space-y-3">
            {stats.map((stat, index) => (
                <Card key={index} className="bg-white border border-gray-200 my-2">
                    <CardContent className="p-4">
                        <View className="flex-row items-center justify-between">
                            <View className="flex-row items-center flex-1">
                                <View className={`w-12 h-12 rounded-full items-center justify-center mr-4 ${stat.bgColor}`}>
                                    <Ionicons name={stat.icon as any} size={24} className={stat.color} />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-gray-600 text-sm">
                                        {stat.title}
                                    </Text>
                                    <Text className={`text-2xl font-bold ${stat.color}`}>
                                        {stat.value}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </CardContent>
                </Card>
            ))}
        </View>
    );
}

// Composant Graphique d'activité hebdomadaire
function WeeklyActivityChart({ data }: { data: WeeklyActivityData[] }) {
    const maxActivities = Math.max(...data.map(d => d.activities));

    return (
        <Card className="bg-white border border-gray-200">
            <CardContent className="p-6">
                <View className="flex-row items-end justify-between h-32">
                    {data.map((item, index) => (
                        <View key={index} className="flex-1 items-center">
                            <View className="w-8 mb-2">
                                <View
                                    className={`w-full rounded-t-lg ${item.active
                                        ? 'bg-blue-500'
                                        : 'bg-gray-200'
                                        }`}
                                    style={{
                                        height: item.active
                                            ? Math.max(20, (item.activities / maxActivities) * 80)
                                            : 8
                                    }}
                                />
                            </View>

                            <Text className="text-xs text-gray-600 mb-1">
                                {item.activities}
                            </Text>

                            <Text className="text-xs font-medium text-gray-900">
                                {item.day}
                            </Text>
                        </View>
                    ))}
                </View>

                <View className="flex-row justify-center mt-4 pt-4 border-t border-gray-200">
                    <View className="flex-row items-center mr-6">
                        <View className="w-3 h-3 bg-blue-500 rounded-full mr-2" />
                        <Text className="text-xs text-gray-600">
                            Jours actifs
                        </Text>
                    </View>
                    <View className="flex-row items-center">
                        <View className="w-3 h-3 bg-gray-200 rounded-full mr-2" />
                        <Text className="text-xs text-gray-600">
                            Jours inactifs
                        </Text>
                    </View>
                </View>
            </CardContent>
        </Card>
    );
}

// Composant Graphique de répartition des activités
function ActivityDistributionChart({ data }: { data: ActivityDistributionData[] }) {
    const total = data.reduce((sum, item) => sum + item.value, 0);

    return (
        <Card className="bg-white border border-gray-200">
            <CardContent className="p-6">
                <View className="space-y-3">
                    {data.map((item, index) => (
                        <View key={index} className="flex-row items-center">
                            <View className="w-20">
                                <Text className="text-sm font-medium text-gray-900">
                                    {item.name}
                                </Text>
                            </View>

                            <View className="flex-1 mx-3">
                                <View className="h-4 bg-gray-200 rounded-full overflow-hidden">
                                    <View
                                        className="h-full rounded-full"
                                        style={{
                                            width: `${(item.value / total) * 100}%`,
                                            backgroundColor: item.color
                                        }}
                                    />
                                </View>
                            </View>

                            <View className="w-12">
                                <Text className="text-sm font-semibold text-gray-900 text-right">
                                    {item.value}%
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>

                <View className="flex-row justify-between items-center mt-4 pt-4 border-t border-gray-200">
                    <Text className="text-sm font-medium text-gray-900">
                        Total
                    </Text>
                    <Text className="text-sm font-bold text-blue-600">
                        {total}%
                    </Text>
                </View>
            </CardContent>
        </Card>
    );
}

// Composant Liste des badges
function BadgesList({ badges }: { badges: Badge[] }) {
    const getRarityColor = (rarity: string) => {
        switch (rarity) {
            case 'common': return 'text-gray-600';
            case 'rare': return 'text-blue-600';
            case 'epic': return 'text-purple-600';
            case 'legendary': return 'text-yellow-600';
            default: return 'text-gray-600';
        }
    };

    const getRarityLabel = (rarity: string) => {
        switch (rarity) {
            case 'common': return 'Commun';
            case 'rare': return 'Rare';
            case 'epic': return 'Épique';
            case 'legendary': return 'Légendaire';
            default: return 'Commun';
        }
    };

    const renderBadge = ({ item }: { item: Badge }) => (
        <Card className={`mb-3 border ${item.unlocked
            ? 'bg-white border-gray-200'
            : 'bg-gray-100 border-gray-300'
            }`}>
            <CardContent className="p-4">
                <View className="flex-row items-center">
                    <View className={`w-16 h-16 rounded-full items-center justify-center mr-4 ${item.unlocked
                        ? 'bg-gradient-to-br from-yellow-400 to-orange-500'
                        : 'bg-gray-300'
                        }`}>
                        <Text className="text-2xl">
                            {item.icon}
                        </Text>
                    </View>

                    <View className="flex-1">
                        <View className="flex-row items-center mb-1">
                            <Text className={`text-lg font-bold ${item.unlocked
                                ? 'text-gray-900'
                                : 'text-gray-500'
                                }`}>
                                {item.name}
                            </Text>
                            {item.unlocked && (
                                <Ionicons
                                    name="checkmark-circle"
                                    size={20}
                                    color="#10B981"
                                    style={{ marginLeft: 8 }}
                                />
                            )}
                        </View>

                        <Text className={`text-sm mb-2 ${item.unlocked
                            ? 'text-gray-600'
                            : 'text-gray-500'
                            }`}>
                            {item.description}
                        </Text>

                        <View className="flex-row items-center justify-between">
                            <View className="flex-row items-center">
                                <Text className={`text-xs font-medium ${getRarityColor(item.rarity)}`}>
                                    {getRarityLabel(item.rarity)}
                                </Text>
                            </View>

                            {item.unlocked && item.unlockedAt && (
                                <Text className="text-xs text-gray-500">
                                    Débloqué le {new Date(item.unlockedAt).toLocaleDateString('fr-FR')}
                                </Text>
                            )}
                        </View>
                    </View>
                </View>
            </CardContent>
        </Card>
    );

    return (
        <View>
            {badges.map((badge, index) => (
                <View key={badge.id}>
                    {renderBadge({ item: badge })}
                </View>
            ))}
        </View>
    );
}

// Composant État vide
function EmptyStatsState() {
    return (
        <Card className="bg-white border border-gray-200">
            <CardContent className="p-8 items-center">
                <Ionicons name="analytics-outline" size={48} color="#9CA3AF" />
                <Text className="text-gray-600 text-center mt-4 text-lg font-medium">
                    Aucune donnée disponible
                </Text>
                <Text className="text-gray-500 text-center text-sm mt-2">
                    Commencez à faire des activités et complétez des défis pour voir vos statistiques
                </Text>
                <View className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <Text className="text-blue-600 text-sm text-center">
                        💡 Conseil : Ajoutez votre première activité depuis l'écran d'accueil
                    </Text>
                </View>
            </CardContent>
        </Card>
    );
}

// Hook pour les données de statistiques
function useStatisticsData() {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const [totalPoints, setTotalPoints] = useState(0);
    const [currentStreak, setCurrentStreak] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadRealData = async () => {
            try {
                setLoading(true);

                const [allActivities, allChallenges, points, streak] = await Promise.all([
                    StorageService.getActivities(),
                    StorageService.getChallenges(),
                    StorageService.getTotalPoints(),
                    StorageService.calculateStreakFromDates()
                ]);

                setActivities(allActivities);
                setChallenges(allChallenges);
                setTotalPoints(points);
                setCurrentStreak(streak);

                setLoading(false);
            } catch (error) {
                console.error('Erreur lors du chargement des données de statistiques:', error);
                setLoading(false);
            }
        };

        loadRealData();
    }, []);

    const weeklyData = useMemo((): WeeklyActivityData[] => {
        const today = new Date();
        const currentDay = today.getDay();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - currentDay + (currentDay === 0 ? -6 : 1));

        const weekData: WeeklyActivityData[] = [];
        const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

        for (let i = 0; i < 7; i++) {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            const dateString = date.toISOString().split('T')[0];

            const dayActivities = activities.filter(activity =>
                activity.doAtThisDate === dateString
            );

            const completedChallenges = challenges.filter(challenge =>
                challenge.doAtThisDate === dateString
            );

            const totalActivities = dayActivities.length + completedChallenges.length;
            const isActive = totalActivities > 0;

            weekData.push({
                day: days[i],
                active: isActive,
                activities: totalActivities
            });
        }

        return weekData;
    }, [activities, challenges]);

    const activityDistribution = useMemo((): ActivityDistributionData[] => {
        const activityTypes: { [key: string]: { count: number; color: string } } = {
            'Course': { count: 0, color: '#3B82F6' },
            'Musculation': { count: 0, color: '#F59E0B' },
            'Boxe': { count: 0, color: '#EF4444' },
            'Yoga': { count: 0, color: '#10B981' },
            'Natation': { count: 0, color: '#8B5CF6' },
            'Vélo': { count: 0, color: '#06B6D4' },
            'Pilates': { count: 0, color: '#EC4899' },
            'Autre': { count: 0, color: '#6B7280' }
        };

        activities.forEach(activity => {
            const activityName = activity.name.toLowerCase();

            if (activityName.includes('course') || activityName.includes('running')) {
                activityTypes['Course'].count++;
            } else if (activityName.includes('muscu') || activityName.includes('pompe') || activityName.includes('squat')) {
                activityTypes['Musculation'].count++;
            } else if (activityName.includes('boxe') || activityName.includes('boxing')) {
                activityTypes['Boxe'].count++;
            } else if (activityName.includes('yoga')) {
                activityTypes['Yoga'].count++;
            } else if (activityName.includes('natation') || activityName.includes('swimming')) {
                activityTypes['Natation'].count++;
            } else if (activityName.includes('vélo') || activityName.includes('bike') || activityName.includes('cycling')) {
                activityTypes['Vélo'].count++;
            } else if (activityName.includes('pilates')) {
                activityTypes['Pilates'].count++;
            } else {
                activityTypes['Autre'].count++;
            }
        });

        const totalActivities = activities.length;
        if (totalActivities === 0) {
            return [
                { name: 'Aucune activité', value: 100, color: '#6B7280' }
            ];
        }

        return Object.entries(activityTypes)
            .filter(([_, data]) => data.count > 0)
            .map(([name, data]) => ({
                name,
                value: Math.round((data.count / totalActivities) * 100),
                color: data.color
            }));
    }, [activities]);

    const badges = useMemo((): Badge[] => {
        const currentDate = new Date();
        const totalActivitiesCount = activities.length;
        const totalChallengesCompleted = challenges.filter(c => c.completed).length;
        const totalTrainingHours = activities.reduce((sum, activity) => {
            const duration = parseInt(activity.duration.replace(/\D/g, '')) || 0;
            return sum + duration;
        }, 0) / 60;

        const badges: Badge[] = [
            {
                id: '1',
                name: 'Premier Pas',
                description: 'Complétez votre première activité',
                icon: '🏃‍♂️',
                unlocked: totalActivitiesCount >= 1,
                unlockedAt: totalActivitiesCount >= 1 ? activities[0]?.doAtThisDate : undefined,
                rarity: 'common'
            },
            {
                id: '2',
                name: 'Streak Master',
                description: '7 jours consécutifs d\'activité',
                icon: '🔥',
                unlocked: currentStreak >= 7,
                unlockedAt: currentStreak >= 7 ?
                    new Date(currentDate.getTime() - (currentStreak - 7) * 24 * 60 * 60 * 1000).toISOString().split('T')[0] :
                    undefined,
                rarity: 'rare'
            },
            {
                id: '3',
                name: 'Marathonien',
                description: 'Cumulez 42km de course',
                icon: '🏃‍♀️',
                unlocked: false,
                rarity: 'epic'
            },
            {
                id: '4',
                name: 'Gym Rat',
                description: '100 séances de musculation',
                icon: '💪',
                unlocked: totalActivitiesCount >= 100,
                unlockedAt: totalActivitiesCount >= 100 ?
                    activities[99]?.doAtThisDate :
                    undefined,
                rarity: 'rare'
            },
            {
                id: '5',
                name: 'Early Bird',
                description: '5 entraînements avant 7h du matin',
                icon: '🌅',
                unlocked: false,
                rarity: 'common'
            },
            {
                id: '6',
                name: 'Weekend Warrior',
                description: '10 activités pendant les weekends',
                icon: '🏆',
                unlocked: (() => {
                    const weekendActivities = activities.filter(activity => {
                        if (!activity.doAtThisDate) return false;
                        const date = new Date(activity.doAtThisDate);
                        const day = date.getDay();
                        return day === 0 || day === 6;
                    });
                    return weekendActivities.length >= 10;
                })(),
                unlockedAt: (() => {
                    const weekendActivities = activities.filter(activity => {
                        if (!activity.doAtThisDate) return false;
                        const date = new Date(activity.doAtThisDate);
                        const day = date.getDay();
                        return day === 0 || day === 6;
                    });
                    return weekendActivities.length >= 10 ? weekendActivities[9]?.doAtThisDate : undefined;
                })(),
                rarity: 'rare'
            },
            {
                id: '7',
                name: 'Legendary Athlete',
                description: '1000 heures d\'entraînement total',
                icon: '👑',
                unlocked: totalTrainingHours >= 1000,
                unlockedAt: totalTrainingHours >= 1000 ?
                    activities[Math.floor(1000 / (totalTrainingHours / totalActivitiesCount))]?.doAtThisDate :
                    undefined,
                rarity: 'legendary'
            },
            {
                id: '8',
                name: 'Challenge Master',
                description: 'Complétez 50 défis',
                icon: '🎯',
                unlocked: totalChallengesCompleted >= 50,
                unlockedAt: totalChallengesCompleted >= 50 ?
                    challenges.filter(c => c.completed)[49]?.doAtThisDate :
                    undefined,
                rarity: 'epic'
            }
        ];

        return badges;
    }, [activities, challenges, currentStreak]);

    const totalBadges = badges.filter(b => b.unlocked).length;

    const totalTrainingTime = useMemo(() => {
        return Math.round(activities.reduce((sum, activity) => {
            const duration = parseInt(activity.duration.replace(/\D/g, '')) || 0;
            return sum + duration;
        }, 0) / 60);
    }, [activities]);

    const activeDaysThisWeek = weeklyData.filter(d => d.active).length;

    return {
        weeklyData,
        activityDistribution,
        badges,
        totalPoints,
        totalBadges,
        currentStreak,
        totalTrainingTime,
        activeDaysThisWeek,
        loading
    };
}

// Page principale
export default function StatisticsPage() {
    const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('month');

    const {
        weeklyData,
        activityDistribution,
        badges,
        totalPoints,
        totalBadges,
        currentStreak,
        totalTrainingTime,
        activeDaysThisWeek,
        loading
    } = useStatisticsData();

    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-gray-50">
                <Loading message="Chargement des statistiques..." />
            </SafeAreaView>
        );
    }

    const hasData = totalPoints > 0 || totalBadges > 0 || currentStreak > 0 || totalTrainingTime > 0;

    if (!hasData) {
        return (
            <SafeAreaView className="flex-1 bg-gray-50">
                <ScrollView className="flex-1 px-4 pt-4">
                    <StatisticsHeader
                        totalPoints={totalPoints}
                        currentStreak={currentStreak}
                        totalBadges={totalBadges}
                    />
                    <EmptyStatsState />
                </ScrollView>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <ScrollView className="flex-1 px-4 pt-4">
                {/* Header amélioré */}
                <StatisticsHeader
                    totalPoints={totalPoints}
                    currentStreak={currentStreak}
                    totalBadges={totalBadges}
                />

                {/* Filtre de période */}
                <View className="mb-6 mt-4">
                    <TimeFilter
                        selectedPeriod={selectedPeriod}
                        onPeriodChange={setSelectedPeriod}
                    />
                </View>

                {/* Cartes de statistiques principales */}
                <View className="mb-6">
                    <StatisticsCards
                        totalPoints={totalPoints}
                        totalBadges={totalBadges}
                        currentStreak={currentStreak}
                        totalTrainingTime={totalTrainingTime}
                        activeDaysThisWeek={activeDaysThisWeek}
                    />
                </View>

                {/* Graphique d'activité hebdomadaire */}
                <View className="mb-6">
                    <Text className="text-lg font-semibold text-gray-900 mb-3">
                        Activité cette semaine
                    </Text>
                    <WeeklyActivityChart data={weeklyData} />
                </View>

                {/* Graphique de répartition des activités */}
                <View className="mb-6">
                    <Text className="text-lg font-semibold text-gray-900 mb-3">
                        Répartition des activités
                    </Text>
                    <ActivityDistributionChart data={activityDistribution} />
                </View>

                {/* Liste des badges */}
                <View className="mb-6">
                    <Text className="text-lg font-semibold text-gray-900 mb-3">
                        Badges ({totalBadges}/{badges.length})
                    </Text>
                    <BadgesList badges={badges} />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
} 