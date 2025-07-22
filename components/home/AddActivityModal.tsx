import { Drawer } from '@/components/ui/drawer';
import { calculatePoints, getSportsList } from '@/lib/sports-config';
import { Activity } from '@/lib/types';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface AddActivityModalProps {
    visible: boolean;
    onClose: () => void;
    onAdd: (activity: Omit<Activity, 'id' | 'createdAt'>) => void;
}

export function AddActivityModal({ visible, onClose, onAdd }: AddActivityModalProps) {
    const [selectedSport, setSelectedSport] = useState('');
    const [duration, setDuration] = useState('');
    const [intensity, setIntensity] = useState<Activity['intensity']>('moderate');

    const sportsList = getSportsList();
    const intensityOptions = [
        { value: 'light' as const, label: 'Léger', icon: 'leaf-outline' as const, color: '#10B981' },
        { value: 'moderate' as const, label: 'Modéré', icon: 'flame-outline' as const, color: '#F59E0B' },
        { value: 'intense' as const, label: 'Intense', icon: 'flash-outline' as const, color: '#EF4444' },
    ];

    const handleAdd = () => {
        if (!selectedSport) {
            Alert.alert('Erreur', 'Veuillez sélectionner un sport');
            return;
        }
        if (!duration.trim()) {
            Alert.alert('Erreur', 'Veuillez saisir la durée');
            return;
        }

        const calculatedPoints = calculatePoints(selectedSport, duration, intensity);

        onAdd({
            name: selectedSport,
            duration: duration.trim(),
            intensity,
            points: calculatedPoints,
        });

        // Reset form
        setSelectedSport('');
        setDuration('');
        setIntensity('moderate');
        onClose();
    };

    const getCalculatedPoints = () => {
        if (!selectedSport) return 0;
        if (!duration.trim()) return 0;

        return calculatePoints(selectedSport, duration, intensity);
    };

    return (
        <Drawer
            open={visible}
            onClose={onClose}
            size="full"
        >
            <View className="p-6 bg-white flex-1">
                <View className="flex-row items-center justify-between mb-6">
                    <Text className="text-2xl font-bold text-gray-800">
                        Ajouter une activité
                    </Text>
                    <TouchableOpacity onPress={onClose} className="p-2">
                        <Ionicons name="close" size={24} color="#6B7280" />
                    </TouchableOpacity>
                </View>

                <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                    <View className="space-y-4">
                        {/* Sélection du sport */}
                        <View className="mb-3">
                            <Text className="text-gray-700 font-semibold mb-2">
                                Sport
                            </Text>

                            {/* Tous les sports disponibles */}
                            <View className="flex-row flex-wrap">
                                {sportsList.map((sport) => (
                                    <TouchableOpacity
                                        key={sport.value}
                                        onPress={() => setSelectedSport(sport.value)}
                                        className={`flex-row items-center px-3 py-2 rounded-lg border mr-2 mb-2 ${selectedSport === sport.value
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 bg-white'
                                            }`}
                                    >
                                        <Ionicons name={sport.icon as keyof typeof Ionicons.glyphMap} size={14} color={sport.color} />
                                        <Text className={`ml-1 font-medium text-sm ${selectedSport === sport.value
                                            ? 'text-blue-600'
                                            : 'text-gray-600'
                                            }`}>
                                            {sport.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Durée */}
                        <View className="mb-3">
                            <Text className="text-gray-700 font-semibold mb-2">
                                Durée
                            </Text>
                            <TextInput
                                value={duration}
                                onChangeText={setDuration}
                                placeholder="Ex: 1h, 30min, 1h30, 45min..."
                                className="bg-gray-100 rounded-xl p-4 text-gray-800 text-base"
                                placeholderTextColor="#9CA3AF"
                            />
                        </View>

                        {/* Intensité */}
                        <View className="mb-3">
                            <Text className="text-gray-700 font-semibold mb-2">
                                Intensité
                            </Text>
                            <View className="flex-row space-x-3">
                                {intensityOptions.map((option) => (
                                    <TouchableOpacity
                                        key={option.value}
                                        onPress={() => setIntensity(option.value)}
                                        className={`flex-1 flex-row items-center justify-center p-4 rounded-xl mx-2 border-2 ${intensity === option.value
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 bg-white'
                                            }`}
                                    >
                                        <Ionicons
                                            name={option.icon}
                                            size={18}
                                            color={intensity === option.value ? option.color : '#6B7280'}
                                        />
                                        <Text className={`ml-2 font-semibold text-base ${intensity === option.value
                                            ? 'text-blue-600'
                                            : 'text-gray-600'
                                            }`}>
                                            {option.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Points calculés */}
                        <View className="bg-blue-50 rounded-xl p-4">
                            <View className="flex-row items-center justify-between">
                                <Text className="text-gray-700 font-semibold">
                                    Points à gagner
                                </Text>
                                <View className="flex-row items-center">
                                    <Ionicons name="star" size={20} color="#F59E0B" />
                                    <Text className="text-gray-800 font-bold text-lg ml-2">
                                        {getCalculatedPoints()}
                                    </Text>
                                </View>
                            </View>
                            {selectedSport && duration.trim() && (
                                <Text className="text-gray-600 text-sm mt-2">
                                    Calculé selon le sport et la durée
                                </Text>
                            )}
                        </View>

                        {/* Boutons */}
                        <View className="flex-row space-x-4 pt-4 mb-20">
                            <TouchableOpacity
                                onPress={onClose}
                                className="flex-1 bg-gray-200 rounded-xl py-4 items-center mx-2"
                            >
                                <Text className="text-gray-700 font-semibold text-base">
                                    Annuler
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleAdd}
                                className="flex-1 bg-blue-500 rounded-xl py-4 items-center mx-2"
                            >
                                <Text className="text-white font-semibold text-base">
                                    Ajouter
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </Drawer>
    );
} 