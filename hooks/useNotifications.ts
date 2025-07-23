import { NotificationService } from '@/lib/notifications';
import { useEffect, useState } from 'react';

export function useNotifications() {
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        const initializeNotifications = async () => {
            try {
                // Vérifier si les notifications sont activées
                const enabled = await NotificationService.areNotificationsEnabled();

                if (enabled) {
                    // Configurer les notifications par défaut
                    await NotificationService.setupDefaultNotifications();
                }

                setIsInitialized(true);
            } catch (error) {
                console.error('Erreur lors de l\'initialisation des notifications:', error);
                setIsInitialized(true);
            }
        };

        initializeNotifications();
    }, []);

    const sendTestNotification = async () => {
        try {
            await NotificationService.sendNotification(
                'Test de notification 🧪',
                'Les notifications fonctionnent parfaitement !'
            );
        } catch (error) {
            console.error('Erreur lors de l\'envoi de la notification de test:', error);
        }
    };

    const scheduleTestReminder = async () => {
        try {
            // Programmer une notification dans 5 secondes
            await NotificationService.scheduleNotification(
                'Rappel de test ⏰',
                'Ceci est un rappel programmé de test',
                { seconds: 5 } as any
            );
        } catch (error) {
            console.error('Erreur lors de la programmation du rappel de test:', error);
        }
    };

    return {
        isInitialized,
        sendTestNotification,
        scheduleTestReminder,
    };
} 