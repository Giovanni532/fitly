# 🚀 Fitly - Quickstarter Template

Un template moderne et complet pour démarrer rapidement vos applications React Native avec Expo.

## ✨ Fonctionnalités incluses

### 🔐 **Authentification complète**
- Contexte d'authentification avec React Context
- Pages de connexion et inscription avec animations
- Navigation protégée automatique
- Identifiants de test : `Testuser` / `1234`

### 🎨 **Interface moderne**
- Design system avec shadcn/ui pour React Native
- Animations fluides avec React Native Animated
- Support du thème sombre/clair
- Gradient et glassmorphism

### 📱 **Navigation intuitive**
- Navbar en bas d'écran avec animations
- Navigation entre pages (Accueil/Profil)
- Gestion automatique des états

### 🛠️ **Architecture propre**
- Structure de dossiers organisée
- Composants réutilisables
- Contextes séparés (auth, theme)
- Code TypeScript typé

## 🏗️ Structure du projet

```
fitly/
├── app/                    # Pages avec Expo Router
│   ├── (auth)/            # Pages d'authentification
│   ├── (app)/             # Pages de l'application
│   └── _layout.tsx        # Layout principal
├── components/            # Composants réutilisables
│   ├── auth/              # Composants d'authentification
│   ├── navigation/        # Composants de navigation
│   └── ui/                # Composants UI (shadcn)
├── contexts/              # Contextes React
│   ├── auth-context.tsx   # Gestion de l'authentification
│   └── theme-context.tsx  # Gestion du thème
└── lib/                   # Utilitaires
    └── utils.ts           # Fonctions utilitaires
```

## 🚀 Démarrage rapide

### 1. **Cloner le template**
```bash
git clone [URL_DU_REPO] mon-app
cd mon-app
```

### 2. **Installer les dépendances**
```bash
npm install
```

### 3. **Lancer l'application**
```bash
npm start
```

### 4. **Tester l'authentification**
- Utilisez les identifiants : `Testuser` / `1234`
- Ou créez un nouveau compte via l'inscription

## 🎯 Personnalisation

### **Changer le nom de l'app**
1. Modifiez `app.json` : `"name": "VotreApp"`
2. Remplacez "Fitly" par votre nom dans les composants
3. Mettez à jour le logo dans les pages d'authentification

### **Ajouter de nouvelles pages**
1. Créez un fichier dans `app/(app)/`
2. Ajoutez l'onglet dans `components/navigation/BottomNavbar.tsx`
3. Mettez à jour le switch dans `app/(app)/_layout.tsx`

### **Modifier le design**
1. Ajustez les couleurs dans `tailwind.config.js`
2. Modifiez les gradients dans les composants
3. Personnalisez les animations

### **Ajouter des fonctionnalités**
1. Étendez le contexte d'authentification
2. Créez de nouveaux contextes si nécessaire
3. Ajoutez des composants dans `components/`

## 🛠️ Technologies utilisées

- **Expo Router** : Navigation basée sur les fichiers
- **NativeWind** : Styling avec Tailwind CSS
- **shadcn/ui** : Composants UI modernes
- **React Context** : Gestion d'état globale
- **TypeScript** : Typage statique
- **React Native Animated** : Animations fluides

## 📦 Composants disponibles

### **UI Components (shadcn)**
- `Button` - Boutons stylisés
- `Input` - Champs de saisie
- `Card` - Cartes avec glassmorphism
- `Label` - Labels pour formulaires
- `Badge` - Badges colorés
- `Separator` - Séparateurs
- `Loading` - Indicateur de chargement

### **Navigation**
- `BottomNavbar` - Navbar en bas d'écran
- Navigation automatique entre pages

### **Authentification**
- `LoginForm` - Formulaire de connexion animé
- `SignupForm` - Formulaire d'inscription
- `AuthTabs` - Onglets login/signup

## 🎨 Design System

### **Couleurs principales**
- **Bleu** : `#3B82F6` (Primary)
- **Vert** : `#10B981` (Success)
- **Rouge** : `#EF4444` (Danger)
- **Gris** : `#6B7280` (Muted)

### **Animations**
- **Fade-in** : Apparition progressive
- **Slide-up** : Mouvement vers le haut
- **Scale** : Effet de rebond
- **Spring** : Animations naturelles

## 🔧 Configuration

### **Variables d'environnement**
Créez un fichier `.env` :
```env
EXPO_PUBLIC_APP_NAME=VotreApp
```

### **Métadonnées**
Modifiez `app.json` :
```json
{
  "expo": {
    "name": "VotreApp",
    "slug": "votre-app",
    "version": "1.0.0"
  }
}
```

## 📱 Déploiement

### **Build pour production**
```bash
npx expo build:android
npx expo build:ios
```

### **Publier sur les stores**
```bash
npx expo submit:android
npx expo submit:ios
```

## 🤝 Contribution

1. Fork le projet
2. Créez une branche feature (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🆘 Support

Si vous rencontrez des problèmes :
1. Vérifiez la [documentation Expo](https://docs.expo.dev/)
2. Consultez les [issues GitHub](https://github.com/votre-repo/issues)
3. Créez une nouvelle issue avec les détails du problème

---

**Happy coding! 🎉**
