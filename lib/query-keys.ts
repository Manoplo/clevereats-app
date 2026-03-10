/**
 * Query Keys organizados para React Query
 * 
 * Esta estructura ayuda a mantener las query keys organizadas y tipadas.
 * Usa factory functions para crear keys dinámicas.
 */

// Base keys
export const queryKeys = {
    // Supabase queries
    supabase: {
        // Ejemplo: perfiles de usuario
        profiles: {
            all: ["supabase", "profiles"] as const,
            detail: (id: string) => ["supabase", "profiles", id] as const,
            list: (filters?: Record<string, unknown>) =>
                ["supabase", "profiles", "list", filters] as const,
        },
        // Ejemplo: planes de comida
        mealPlans: {
            all: ["supabase", "mealPlans"] as const,
            detail: (id: string) => ["supabase", "mealPlans", id] as const,
            byUser: (userId: string) => ["supabase", "mealPlans", "user", userId] as const,
            byDate: (date: string) => ["supabase", "mealPlans", "date", date] as const,
        },
        // Ejemplo: recetas
        recipes: {
            all: ["supabase", "recipes"] as const,
            detail: (id: string) => ["supabase", "recipes", id] as const,
            list: (filters?: Record<string, unknown>) =>
                ["supabase", "recipes", "list", filters] as const,
        },
    },

    // API de Nest.js queries
    api: {
        // Generación de planes con IA
        ai: {
            generatePlan: {
                all: ["api", "ai", "generatePlan"] as const,
                byParams: (params: Record<string, unknown>) =>
                    ["api", "ai", "generatePlan", params] as const,
            },
            // Otros endpoints de IA
            suggestions: {
                all: ["api", "ai", "suggestions"] as const,
                byContext: (context: string) => ["api", "ai", "suggestions", context] as const,
            },
        },
        // Otros endpoints de la API
        health: {
            all: ["api", "health"] as const,
        },
    },
} as const;
