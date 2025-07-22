import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/auth-context';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import {
    Alert,
    Modal,
    SafeAreaView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

interface BirthDateModalProps {
    visible: boolean;
    onClose: () => void;
    onComplete: () => void;
}

export function BirthDateModal({ visible, onClose, onComplete }: BirthDateModalProps) {
    const [birthDate, setBirthDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);
    const { updateUserProfile } = useAuth();

    const handleConfirm = async () => {
        try {
            const result = await updateUserProfile({
                dateOfBirth: birthDate.toISOString().split('T')[0]
            });

            if (result.success) {
                Alert.alert('Succès', 'Profil mis à jour avec succès !');
                onComplete();
            } else {
                Alert.alert('Erreur', result.error || 'Erreur lors de la mise à jour');
            }
        } catch (error) {
            Alert.alert('Erreur', 'Une erreur est survenue');
        }
    };

    const handleSkip = () => {
        onComplete();
    };

    const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        setShowPicker(false);
        if (selectedDate) {
            setBirthDate(selectedDate);
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
        >
            <SafeAreaView className="flex-1 bg-gradient-to-b from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
                <View className="flex-1 justify-center px-6">
                    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 rounded-3xl">
                        <CardHeader className="items-center pb-4">
                            <CardTitle className="text-2xl font-bold text-gray-800 dark:text-white">
                                Date de naissance
                            </CardTitle>
                            <Text className="text-gray-600 dark:text-gray-300 text-center mt-2">
                                Pour personnaliser votre expérience
                            </Text>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Sélecteur de date */}
                            <View className="space-y-2">
                                <Text className="text-gray-700 dark:text-gray-200 font-medium text-sm">
                                    Votre date de naissance
                                </Text>
                                <TouchableOpacity
                                    onPress={() => setShowPicker(true)}
                                    className="h-14 bg-gray-50 dark:bg-gray-700 rounded-xl px-4 justify-center border border-gray-200 dark:border-gray-600"
                                >
                                    <Text className="text-gray-800 dark:text-white text-base">
                                        {birthDate.toLocaleDateString('fr-FR')}
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            {/* DatePicker */}
                            {showPicker && (
                                <DateTimePicker
                                    value={birthDate}
                                    mode="date"
                                    display="default"
                                    onChange={handleDateChange}
                                    maximumDate={new Date()}
                                    minimumDate={new Date(1900, 0, 1)}
                                />
                            )}

                            {/* Boutons */}
                            <View className="space-y-3">
                                <Button
                                    onPress={handleConfirm}
                                    className="w-full"
                                >
                                    <Text className="text-white font-semibold text-base">
                                        Confirmer
                                    </Text>
                                </Button>

                                <TouchableOpacity
                                    onPress={handleSkip}
                                    className="w-full h-14 bg-transparent border border-gray-300 dark:border-gray-600 rounded-xl items-center justify-center"
                                >
                                    <Text className="text-gray-700 dark:text-gray-200 font-medium text-base">
                                        Passer cette étape
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </CardContent>
                    </Card>
                </View>
            </SafeAreaView>
        </Modal>
    );
} 