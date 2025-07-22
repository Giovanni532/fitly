export interface SportConfig {
    name: string;
    basePoints: number; // Points par minute
    intensityMultipliers: {
        light: number;
        moderate: number;
        intense: number;
    };
    icon: string;
    color: string;
}

export const SPORTS_CONFIG: Record<string, SportConfig> = {
    // Sports de combat
    'boxe': {
        name: 'Boxe',
        basePoints: 8, // 8 points par minute
        intensityMultipliers: { light: 1.2, moderate: 1.5, intense: 2.0 },
        icon: 'fitness-outline',
        color: '#EF4444'
    },
    'kickboxing': {
        name: 'Kickboxing',
        basePoints: 8,
        intensityMultipliers: { light: 1.2, moderate: 1.5, intense: 2.0 },
        icon: 'fitness-outline',
        color: '#EF4444'
    },
    'muay-thai': {
        name: 'Muay Thai',
        basePoints: 9,
        intensityMultipliers: { light: 1.2, moderate: 1.5, intense: 2.0 },
        icon: 'fitness-outline',
        color: '#EF4444'
    },
    'judo': {
        name: 'Judo',
        basePoints: 7,
        intensityMultipliers: { light: 1.2, moderate: 1.5, intense: 2.0 },
        icon: 'fitness-outline',
        color: '#EF4444'
    },

    // Sports cardio
    'course': {
        name: 'Course à pied',
        basePoints: 6,
        intensityMultipliers: { light: 1.0, moderate: 1.3, intense: 1.8 },
        icon: 'walk-outline',
        color: '#10B981'
    },
    'velo': {
        name: 'Vélo',
        basePoints: 5,
        intensityMultipliers: { light: 1.0, moderate: 1.3, intense: 1.8 },
        icon: 'bicycle-outline',
        color: '#10B981'
    },
    'natation': {
        name: 'Natation',
        basePoints: 7,
        intensityMultipliers: { light: 1.0, moderate: 1.3, intense: 1.8 },
        icon: 'water-outline',
        color: '#3B82F6'
    },
    'rameur': {
        name: 'Rameur',
        basePoints: 8,
        intensityMultipliers: { light: 1.0, moderate: 1.3, intense: 1.8 },
        icon: 'boat-outline',
        color: '#3B82F6'
    },

    // Musculation
    'musculation': {
        name: 'Musculation',
        basePoints: 4,
        intensityMultipliers: { light: 1.0, moderate: 1.4, intense: 1.9 },
        icon: 'barbell-outline',
        color: '#F59E0B'
    },
    'crossfit': {
        name: 'CrossFit',
        basePoints: 9,
        intensityMultipliers: { light: 1.1, moderate: 1.5, intense: 2.0 },
        icon: 'fitness-outline',
        color: '#F59E0B'
    },
    'calisthenics': {
        name: 'Calisthenics',
        basePoints: 6,
        intensityMultipliers: { light: 1.0, moderate: 1.4, intense: 1.9 },
        icon: 'body-outline',
        color: '#F59E0B'
    },

    // Sports de raquette
    'tennis': {
        name: 'Tennis',
        basePoints: 6,
        intensityMultipliers: { light: 1.0, moderate: 1.3, intense: 1.7 },
        icon: 'tennisball-outline',
        color: '#10B981'
    },
    'badminton': {
        name: 'Badminton',
        basePoints: 7,
        intensityMultipliers: { light: 1.0, moderate: 1.3, intense: 1.7 },
        icon: 'tennisball-outline',
        color: '#10B981'
    },
    'ping-pong': {
        name: 'Ping Pong',
        basePoints: 4,
        intensityMultipliers: { light: 1.0, moderate: 1.2, intense: 1.5 },
        icon: 'tennisball-outline',
        color: '#10B981'
    },

    // Sports collectifs
    'football': {
        name: 'Football',
        basePoints: 7,
        intensityMultipliers: { light: 1.0, moderate: 1.3, intense: 1.8 },
        icon: 'football-outline',
        color: '#10B981'
    },
    'basketball': {
        name: 'Basketball',
        basePoints: 8,
        intensityMultipliers: { light: 1.0, moderate: 1.3, intense: 1.8 },
        icon: 'basketball-outline',
        color: '#F59E0B'
    },
    'volleyball': {
        name: 'Volleyball',
        basePoints: 6,
        intensityMultipliers: { light: 1.0, moderate: 1.3, intense: 1.7 },
        icon: 'basketball-outline',
        color: '#F59E0B'
    },

    // Sports de bien-être
    'yoga': {
        name: 'Yoga',
        basePoints: 3,
        intensityMultipliers: { light: 1.0, moderate: 1.2, intense: 1.4 },
        icon: 'leaf-outline',
        color: '#8B5CF6'
    },
    'pilates': {
        name: 'Pilates',
        basePoints: 4,
        intensityMultipliers: { light: 1.0, moderate: 1.2, intense: 1.4 },
        icon: 'body-outline',
        color: '#8B5CF6'
    },
    'meditation': {
        name: 'Méditation',
        basePoints: 2,
        intensityMultipliers: { light: 1.0, moderate: 1.1, intense: 1.2 },
        icon: 'leaf-outline',
        color: '#8B5CF6'
    },

    // Autres
    'escalade': {
        name: 'Escalade',
        basePoints: 8,
        intensityMultipliers: { light: 1.1, moderate: 1.4, intense: 1.9 },
        icon: 'trending-up-outline',
        color: '#F59E0B'
    },
    'danse': {
        name: 'Danse',
        basePoints: 5,
        intensityMultipliers: { light: 1.0, moderate: 1.3, intense: 1.7 },
        icon: 'musical-notes-outline',
        color: '#EC4899'
    },
    'zumba': {
        name: 'Zumba',
        basePoints: 7,
        intensityMultipliers: { light: 1.0, moderate: 1.3, intense: 1.8 },
        icon: 'musical-notes-outline',
        color: '#EC4899'
    },
    'autre': {
        name: 'Autre',
        basePoints: 4,
        intensityMultipliers: { light: 1.0, moderate: 1.3, intense: 1.7 },
        icon: 'fitness-outline',
        color: '#6B7280'
    }
};

// Fonction pour calculer les points selon le sport, la durée et l'intensité
export function calculatePoints(sport: string, duration: string, intensity: 'light' | 'moderate' | 'intense'): number {
    const sportConfig = SPORTS_CONFIG[sport.toLowerCase()] || SPORTS_CONFIG['autre'];

    // Convertir la durée en minutes
    const minutes = parseDurationToMinutes(duration);

    // Calculer les points de base
    const basePoints = sportConfig.basePoints * minutes;

    // Appliquer le multiplicateur d'intensité
    const multiplier = sportConfig.intensityMultipliers[intensity];

    // Arrondir à l'entier le plus proche
    return Math.round(basePoints * multiplier);
}

// Fonction pour convertir une durée en minutes
function parseDurationToMinutes(duration: string): number {
    const cleanDuration = duration.toLowerCase().trim();

    // Pattern pour détecter "1h30" ou "1h30min" ou "1:30"
    const combinedPattern = /(\d+)\s*h\s*(\d+)(?:\s*min)?/i;
    const combinedMatch = cleanDuration.match(combinedPattern);

    if (combinedMatch) {
        const hours = parseInt(combinedMatch[1]);
        const minutes = parseInt(combinedMatch[2]);
        return hours * 60 + minutes;
    }

    // Pattern pour détecter "1:30" (format avec deux-points)
    const colonPattern = /(\d+):(\d+)/;
    const colonMatch = cleanDuration.match(colonPattern);

    if (colonMatch) {
        const hours = parseInt(colonMatch[1]);
        const minutes = parseInt(colonMatch[2]);
        return hours * 60 + minutes;
    }

    // Patterns pour détecter les heures et minutes séparément
    const hourPattern = /(\d+)\s*h/i;
    const minutePattern = /(\d+)\s*min/i;

    let hours = 0;
    let minutes = 0;

    // Extraire les heures
    const hourMatch = cleanDuration.match(hourPattern);
    if (hourMatch) {
        hours = parseInt(hourMatch[1]);
    }

    // Extraire les minutes
    const minuteMatch = cleanDuration.match(minutePattern);
    if (minuteMatch) {
        minutes = parseInt(minuteMatch[1]);
    }

    // Si pas de pattern détecté, essayer de parser un nombre simple
    if (!hourMatch && !minuteMatch) {
        const numberMatch = cleanDuration.match(/(\d+)/);
        if (numberMatch) {
            const num = parseInt(numberMatch[1]);
            // Si le nombre est petit (< 10), on suppose que ce sont des heures
            // Sinon on suppose que ce sont des minutes
            if (num < 10) {
                hours = num;
            } else {
                minutes = num;
            }
        }
    }

    return hours * 60 + minutes;
}

// Fonction pour obtenir la liste des sports pour l'interface
export function getSportsList(): Array<{ value: string; label: string; icon: string; color: string }> {
    return Object.entries(SPORTS_CONFIG).map(([key, config]) => ({
        value: key,
        label: config.name,
        icon: config.icon,
        color: config.color
    }));
} 