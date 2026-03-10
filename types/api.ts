/**
 * Tipos compartidos para las respuestas de la API
 */

// Tipos para Supabase
export interface Profile {
  id: string;
  user_id: string;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}


// Enums para la API de Nest.js
export enum CookingLevel {
  BEGINNER = "BEGINNER",
  INTERMEDIATE = "INTERMEDIATE",
  ADVANCED = "ADVANCED",
}

export enum DietaryPreferences {
  VEGETARIAN = "VEGETARIAN",
  VEGAN = "VEGAN",
  KETO = "KETO",
  PALEO = "PALEO",
  GLUTEN_FREE = "GLUTEN_FREE",
  DAIRY_FREE = "DAIRY_FREE",
}

export enum PreferredCookingTime {
  QUICK = "QUICK", // < 30 minutos
  MODERATE = "MODERATE", // 30-60 minutos
  EXTENDED = "EXTENDED", // > 60 minutos
  ANY = "ANY", // Cualquier tiempo
}

export enum FavoriteCuisines {
  ITALIAN = "ITALIAN",
  MEXICAN = "MEXICAN",
  JAPANESE = "JAPANESE",
  ASIA_FUSION = "ASIA_FUSION",
  MEDITERRANEAN = "MEDITERRANEAN",
  SOUTH_AMERICAN = "SOUTH_AMERICAN",
  WORLD_CUISINE = "WORLD_CUISINE",
}

/**
 * Tags informativos para las comidas
 * Proporcionan información concisa y directa al usuario en la UI
 */
export enum MealTag {
  LOW_CALORIES = "LOW_CALORIES", // Baja en calorías
  LOW_CARBS = "LOW_CARBS", // Baja en carbohidratos
  HIGH_PROTEIN = "HIGH_PROTEIN", // Rica en proteínas
  QUICK_PREP = "QUICK_PREP", // Preparación rápida
  VEGETARIAN_ONLY = "VEGETARIAN_ONLY", // Solo verdura/vegetariano
  VEGAN = "VEGAN", // Vegano
  GLUTEN_FREE = "GLUTEN_FREE", // Sin gluten
  DAIRY_FREE = "DAIRY_FREE", // Sin lácteos
  HIGH_FIBER = "HIGH_FIBER", // Rica en fibra
  KETO_FRIENDLY = "KETO_FRIENDLY", // Apto para keto
  PALEO_FRIENDLY = "PALEO_FRIENDLY", // Apto para paleo
  HIGH_IRON = "HIGH_IRON", // Rica en hierro
  OMEGA_3 = "OMEGA_3", // Rica en omega-3
  HIGH_CALCIUM = "HIGH_CALCIUM", // Rica en calcio
  KID_FRIENDLY = "KID_FRIENDLY", // Apto para niños
  ONE_POT = "ONE_POT", // Todo en una olla
  MEAL_PREP = "MEAL_PREP", // Apto para meal prep
  SPICY = "SPICY", // Picante
  SWEET = "SWEET", // Dulce
  SAVORY = "SAVORY", // Salado
}

// Tipos para la API de Nest.js (IA)
/**
 * DTO que coincide exactamente con GeneratePlanDto de Nest.js
 */
export interface GeneratePlanDto {
  dietaryPreferences?: DietaryPreferences[];
  favoriteCuisines: FavoriteCuisines[];
  cookingLevel: CookingLevel;
  preferredCookingTime: PreferredCookingTime;
  numberOfAdults: number;
  numberOfChildren: number;
  optionalNotes?: string;
}

// SUPABASE
export interface GeneratePlanRequest {
  preferences?: string[];
  dietaryRestrictions?: DietaryPreferences[];
  caloriesPerDay?: number;
  startDate: string;
  endDate: string;
}


export interface AISuggestion {
  id: string;
  type: "recipe" | "meal" | "ingredient";
  suggestion: string;
  confidence: number;
  context: string;
}

// Tipos de error
export interface ApiError {
  message: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
}

/**
 * Interfaz para la respuesta del endpoint de generar plan de comidas
 * Usar en el frontend para tipar la respuesta de la API
 */

export interface Ingredient {
  name: string;
  amount: string; // Ej: "200g", "1 taza", "2 cucharadas", "1/2 cebolla"
}

export interface Meal {
  name: string;
  ingredients: Ingredient[];
  instructions: string[]; // Instrucciones paso a paso para preparar la comida
  preparationTime: string;
  difficulty: string;
  calories: number;
  tags: MealTag[]; // Tags informativos sobre la comida (baja en calorías, rica en proteínas, etc.)
}

export interface DayMealPlan {
  day: string;
  breakfast: Meal;
  meal: Meal;
  dinner: Meal;
}

export interface MealPlan {
  week: DayMealPlan[];
}

export interface GeneratePlanResponse {
  weekStartDate: string; // ISO 8601 date string
  plan: MealPlan;
}
