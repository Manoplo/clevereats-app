import { QueryClient } from "@tanstack/react-query";

/**
 * Configuración del QueryClient para React Query
 * Define los valores por defecto para las queries y mutaciones
 */
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Tiempo que los datos se consideran "fresh" (en segundos)
            staleTime: 1000 * 60 * 5, // 5 minutos
            // Tiempo que los datos se mantienen en caché después de que el componente se desmonta
            gcTime: 1000 * 60 * 30, // 30 minutos (antes era cacheTime)
            // Reintentar automáticamente en caso de error
            retry: 1,
            // No refetch automático al volver a la ventana
            refetchOnWindowFocus: false,
            // No refetch automático al reconectar
            refetchOnReconnect: false,
        },
        mutations: {
            // Reintentar automáticamente en caso de error
            retry: 1,
        },
    },
});
