# Système de Notifications - Fitly

## 📱 Vue d'ensemble

Le système de notifications de Fitly utilise `expo-notifications` pour envoyer des notifications push et locales aux utilisateurs. Il est conçu pour motiver et engager les utilisateurs dans leurs objectifs fitness.

## 🚀 Fonctionnalités

### Notifications automatiques
- **Motivation matinale** : Notification quotidienne à 8h00
- **Rappel d'activité** : Notification quotidienne à 20h00
- **Félicitations défi** : Notification immédiate quand un défi est complété
- **Niveau supérieur** : Notification quand l'utilisateur monte de niveau
- **Streak maintenu** : Notifications pour les streaks de 7, 14, 30 jours et multiples de 10

### Notifications programmées
- **Rappels quotidiens** : Notifications récurrentes pour maintenir la motivation
- **Rappels de défis** : Notifications personnalisées pour les défis spécifiques

## 🛠️ Configuration

### Installation
```bash
npx expo install expo-notifications
```

### Configuration app.json
```json
{
  "expo": {
    "plugins": [
      [
        "expo-notifications",
        {
          "icon": "./assets/images/notification-icon.png",
          "color": "#ffffff"
        }
      ]
    ]
  }
}
```

## 📁 Structure des fichiers

```
lib/
├── notifications.ts          # Service principal des notifications
hooks/
├── useNotifications.ts       # Hook pour gérer les notifications
app/
├── _layout.tsx              # Initialisation des notifications
└── (app)/profile.tsx        # Interface de gestion des notifications
```

## 🔧 Utilisation

### Service de notifications
```typescript
import { NotificationService } from '@/lib/notifications';

// Envoyer une notification immédiate
await NotificationService.sendNotification('Titre', 'Message');

// Programmer une notification quotidienne
await NotificationService.scheduleDailyNotification('Titre', 'Message', 8, 0);

// Configurer les notifications par défaut
await NotificationService.setupDefaultNotifications();
```

### Hook personnalisé
```typescript
import { useNotifications } from '@/hooks/useNotifications';

function MyComponent() {
  const { sendTestNotification, scheduleTestReminder } = useNotifications();
  
  // Utiliser les fonctions de test
}
```

## 🎯 Types de notifications

### 1. Notifications de motivation
- **Motivation matinale** : Démarrage de journée positif
- **Rappel d'activité** : Encouragement pour l'activité physique

### 2. Notifications de progression
- **Défi complété** : Félicitations avec points gagnés
- **Niveau atteint** : Célébration des paliers
- **Streak maintenu** : Reconnaissance de la régularité

### 3. Notifications de test
- **Test immédiat** : Vérification du fonctionnement
- **Test programmé** : Validation des notifications différées

## 🔐 Gestion des permissions

Le système gère automatiquement :
- Demande de permissions au premier lancement
- Vérification des permissions avant envoi
- Fallback gracieux si permissions refusées
- Réactivation automatique si permissions accordées

## 📊 Intégration avec l'app

### Points d'intégration
1. **Complétion de défis** : `lib/storage.ts` → `completeChallenge()`
2. **Mise à jour des streaks** : `lib/storage.ts` → `updateStreakFromActivity()`
3. **Interface utilisateur** : `app/(app)/profile.tsx` → Gestion des préférences
4. **Initialisation** : `app/_layout.tsx` → Configuration au démarrage

### Persistance
- Préférences sauvegardées dans `AsyncStorage`
- État synchronisé entre les composants
- Configuration restaurée au redémarrage

## 🧪 Tests

### Boutons de test dans le profil
- **Test notification** : Envoi immédiat
- **Test rappel** : Programmation 5 secondes

### Vérification
1. Activer les notifications dans le profil
2. Utiliser les boutons de test
3. Vérifier la réception sur l'appareil
4. Tester la complétion d'un défi

## 🔧 Personnalisation

### Modifier les horaires
```typescript
// Dans lib/notifications.ts
await NotificationService.scheduleMorningMotivation(); // 8h00
await NotificationService.scheduleActivityReminder();  // 20h00
```

### Ajouter de nouveaux types
```typescript
// Nouvelle méthode dans NotificationService
static async sendCustomNotification(title: string, body: string): Promise<void> {
  await this.sendNotification(title, body, { type: 'custom' });
}
```

### Modifier les messages
```typescript
// Personnaliser les messages dans les méthodes
static async sendChallengeCompletedNotification(challengeTitle: string, pointsEarned: number): Promise<void> {
  await this.sendNotification(
    '🎉 Défi accompli !',
    `Bravo ! Vous avez gagné ${pointsEarned} points avec "${challengeTitle}"`
  );
}
```

## 🐛 Dépannage

### Problèmes courants
1. **Notifications non reçues** : Vérifier les permissions système
2. **Notifications programmées manquées** : Vérifier la configuration Android/iOS
3. **Erreurs de permissions** : Redémarrer l'app et réessayer

### Logs de débogage
```typescript
// Activer les logs dans le service
console.log('Notification envoyée:', notificationId);
console.log('Permissions:', await Notifications.getPermissionsAsync());
```

## 📱 Plateformes supportées

- ✅ iOS (avec configuration background modes)
- ✅ Android (avec permissions appropriées)
- ⚠️ Web (fonctionnalités limitées)

## 🔄 Mise à jour

Pour mettre à jour le système :
1. Modifier `lib/notifications.ts` pour les nouvelles fonctionnalités
2. Mettre à jour `app.json` si nécessaire
3. Tester sur les plateformes cibles
4. Documenter les changements

---

*Dernière mise à jour : Décembre 2024* 