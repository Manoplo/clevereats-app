import { queryKeys } from "@/lib/query-keys";
import { supabase } from "@/lib/supabase";
import { MealPlan } from "@/types/api";
import { useQuery } from "@tanstack/react-query";

/**
 * Hook para obtener todos los planes de comida de un usuario
 */
export const useMealPlans = (userId: string) => {
  return useQuery({
    queryKey: queryKeys.supabase.mealPlans.byUser(userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("meal_plans")
        .select("*")
        .eq("user_id", userId)
        .order("date", { ascending: false });

      if (error) throw error;
      return data as MealPlan[];
    },
    enabled: !!userId, // Solo ejecutar si hay un userId
  });
};

/**
 * Hook para obtener un plan de comida específico por ID
 */
export const useMealPlan = (planId: string) => {
  return useQuery({
    queryKey: queryKeys.supabase.mealPlans.detail(planId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("meal_plans")
        .select("*")
        .eq("id", planId)
        .single();

      if (error) throw error;
      return data as MealPlan;
    },
    enabled: !!planId,
  });
};

/**
 * Hook para obtener un plan de comida por fecha
 */
export const useMealPlanByDate = (date: string, userId: string) => {
  return useQuery({
    queryKey: queryKeys.supabase.mealPlans.byDate(date),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("meal_plans")
        .select("*")
        .eq("user_id", userId)
        .eq("date", date)
        .single();

      if (error) throw error;
      return data as MealPlan | null;
    },
    enabled: !!date && !!userId,
  });
};
