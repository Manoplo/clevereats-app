import { apiClient } from "@/lib/api";
import { GeneratePlanDto, GeneratePlanResponse } from "@/types/api";
import { useMutation } from "@tanstack/react-query";

/**
 * Hook para generar un plan de comida usando IA
 */
export const useGeneratePlan = () => {
  /* const queryClient = useQueryClient(); */

  return useMutation({
    mutationFn: async (data: GeneratePlanDto): Promise<GeneratePlanResponse> => {
      return apiClient.post<GeneratePlanResponse>("/recipes/generate-plan", data);
    },
    /*  onSuccess: (response, variables) => {
       // Invalidar las queries relacionadas después de generar un plan
       queryClient.invalidateQueries({
         queryKey: queryKeys.supabase.mealPlans.byUser(variables.userId),
       });
       queryClient.invalidateQueries({
         queryKey: queryKeys.supabase.mealPlans.byDate(variables.startDate),
       });
     }, */
  });
};
