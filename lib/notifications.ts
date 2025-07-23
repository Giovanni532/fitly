import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

const NOTIFICATIONS_STORAGE_KEY = 'fitly_notifications_enabled';

// Configuration des notifications
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export class NotificationService {
    // Demander les permissions de notification
    static async requestPermissions(): Promise<boolean> {
        try {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;

            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }

            if (finalStatus !== 'granted') {
                console.log('Permissions de notification non accordées');
                return false;
            }

            // Configurer le canal de notification pour Android
            if (Platform.OS === 'android') {
                await Notifications.setNotificationChannelAsync('default', {
                    name: 'default',
                    importance: Notifications.AndroidImportance.MAX,
                    vibrationPattern: [0, 250, 250, 250],
                    lightColor: '#FF231F7C',
                });
            }

            return true;
        } catch (error) {
            console.error('Erreur lors de la demande de permissions:', error);
            return false;
        }
    }

    // Vérifier si les notifications sont activées
    static async areNotificationsEnabled(): Promise<boolean> {
        try {
            const saved = await AsyncStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
            if (saved === null) {
                // Par défaut, activer les notifications
                await AsyncStorage.setItem(NOTIFICATIONS_STORAGE_KEY, 'true');
                return true;
            }
            return JSON.parse(saved);
        } catch (error) {
            console.error('Erreur lors de la vérification des notifications:', error);
            return false;
        }
    }

    // Activer/désactiver les notifications
    static async setNotificationsEnabled(enabled: boolean): Promise<boolean> {
        try {
            await AsyncStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(enabled));

            if (enabled) {
                // Demander les permissions si activées
                const hasPermissions = await this.requestPermissions();
                if (!hasPermissions) {
                    // Si pas de permissions, désactiver automatiquement
                    await AsyncStorage.setItem(NOTIFICATIONS_STORAGE_KEY, 'false');
                    return false;
                }
            } else {
                // Annuler toutes les notifications programmées
                await this.cancelAllScheduledNotifications();
            }

            return true;
        } catch (error) {
            console.error('Erreur lors de la configuration des notifications:', error);
            return false;
        }
    }

    // Envoyer une notification immédiate
    static async sendNotification(title: string, body: string, data?: any): Promise<string | null> {
        try {
            const enabled = await this.areNotificationsEnabled();
            if (!enabled) {
                return null;
            }

            const notificationId = await Notifications.scheduleNotificationAsync({
                content: {
                    title,
                    body,
                    data,
                    sound: true,
                },
                trigger: null, // Notification immédiate
            });

            return notificationId;
        } catch (error) {
            console.error('Erreur lors de l\'envoi de notification:', error);
            return null;
        }
    }

    // Programmer une notification
    static async scheduleNotification(
        title: string,
        body: string,
        trigger: Notifications.NotificationTriggerInput,
        data?: any
    ): Promise<string | null> {
        try {
            const enabled = await this.areNotificationsEnabled();
            if (!enabled) {
                return null;
            }

            const notificationId = await Notifications.scheduleNotificationAsync({
                content: {
                    title,
                    body,
                    data,
                    sound: true,
                },
                trigger,
            });

            return notificationId;
        } catch (error) {
            console.error('Erreur lors de la programmation de notification:', error);
            return null;
        }
    }

    // Programmer une notification quotidienne
    static async scheduleDailyNotification(
        title: string,
        body: string,
        hour: number,
        minute: number,
        data?: any
    ): Promise<string | null> {
        return this.scheduleNotification(title, body, {
            hour,
            minute,
            repeats: true,
        } as Notifications.NotificationTriggerInput, data);
    }

    // Programmer une notification de rappel de défi
    static async scheduleChallengeReminder(challengeTitle: string, hour: number = 18): Promise<string | null> {
        return this.scheduleDailyNotification(
            'Défi du jour ! 🏃‍♂️',
            `N'oubliez pas de compléter votre défi : ${challengeTitle}`,
            hour,
            0,
            { type: 'challenge_reminder' }
        );
    }

    // Programmer une notification de motivation matinale
    static async scheduleMorningMotivation(): Promise<string | null> {
        return this.scheduleDailyNotification(
            'Bonjour ! ☀️',
            'Commencez votre journée avec un défi sportif !',
            8,
            0,
            { type: 'morning_motivation' }
        );
    }

    // Programmer une notification de rappel d'activité
    static async scheduleActivityReminder(): Promise<string | null> {
        return this.scheduleDailyNotification(
            'Activité physique ! 💪',
            'Il est temps de faire une activité physique pour maintenir votre streak !',
            20,
            0,
            { type: 'activity_reminder' }
        );
    }

    // Annuler une notification spécifique
    static async cancelNotification(notificationId: string): Promise<void> {
        try {
            await Notifications.cancelScheduledNotificationAsync(notificationId);
        } catch (error) {
            console.error('Erreur lors de l\'annulation de notification:', error);
        }
    }

    // Annuler toutes les notifications programmées
    static async cancelAllScheduledNotifications(): Promise<void> {
        try {
            await Notifications.cancelAllScheduledNotificationsAsync();
        } catch (error) {
            console.error('Erreur lors de l\'annulation de toutes les notifications:', error);
        }
    }

    // Obtenir toutes les notifications programmées
    static async getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
        try {
            return await Notifications.getAllScheduledNotificationsAsync();
        } catch (error) {
            console.error('Erreur lors de la récupération des notifications:', error);
            return [];
        }
    }

    // Configurer les notifications par défaut pour l'app
    static async setupDefaultNotifications(): Promise<void> {
        try {
            const enabled = await this.areNotificationsEnabled();
            if (!enabled) {
                return;
            }

            // Annuler les anciennes notifications
            await this.cancelAllScheduledNotifications();

            // Programmer les notifications par défaut
            await this.scheduleMorningMotivation();
            await this.scheduleActivityReminder();
        } catch (error) {
            console.error('Erreur lors de la configuration des notifications par défaut:', error);
        }
    }

    // Notification de félicitations pour un défi complété
    static async sendChallengeCompletedNotification(challengeTitle: string, pointsEarned: number): Promise<void> {
        await this.sendNotification(
            'Défi complété ! 🎉',
            `Félicitations ! Vous avez gagné ${pointsEarned} points avec "${challengeTitle}"`,
            { type: 'challenge_completed', points: pointsEarned }
        );
    }

    // Notification de niveau atteint
    static async sendLevelUpNotification(newLevel: number): Promise<void> {
        await this.sendNotification(
            'Niveau supérieur ! ⭐',
            `Félicitations ! Vous avez atteint le niveau ${newLevel}`,
            { type: 'level_up', level: newLevel }
        );
    }

    // Notification de streak maintenu
    static async sendStreakNotification(streakDays: number): Promise<void> {
        await this.sendNotification(
            'Streak maintenu ! 🔥',
            `Excellent ! Vous maintenez votre streak depuis ${streakDays} jours`,
            { type: 'streak_maintained', days: streakDays }
        );
    }
} 