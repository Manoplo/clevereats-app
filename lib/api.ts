import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import Constants from "expo-constants";

/**
 * URL base de la API de Nest.js
 * 
 * Para usar este cliente, necesitas configurar la variable de entorno:
 * - EXPO_PUBLIC_API_URL
 * 
 * Crea un archivo .env en la raíz del proyecto con:
 * EXPO_PUBLIC_API_URL=http://localhost:3000 (o tu URL de producción)
 */
const API_URL =
    Constants.expoConfig?.extra?.apiUrl || process.env.EXPO_PUBLIC_API_URL || "http://192.168.1.137:3000";

/**
 * Cliente Axios configurado para toda la aplicación
 * 
 * Este cliente incluye:
 * - URL base configurada
 * - Headers por defecto
 * - Interceptores para requests y responses
 * - Manejo de errores centralizado
 */
class ApiClient {
    private client: AxiosInstance;

    constructor(baseURL: string) {
        this.client = axios.create({
            baseURL,
            timeout: 30000, // 30 segundos
            headers: {
                "Content-Type": "application/json",
            },
        });

        this.setupInterceptors();
    }

    /**
     * Configura los interceptores para requests y responses
     */
    private setupInterceptors(): void {
        // Interceptor para requests
        this.client.interceptors.request.use(
            (config) => {
                // Aquí puedes agregar el token de autenticación si es necesario
                // const token = await getAuthToken();
                // if (token) {
                //   config.headers.Authorization = `Bearer ${token}`;
                // }

                // Log de requests en desarrollo
                if (__DEV__) {
                    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
                        data: config.data,
                        params: config.params,
                    });
                }

                return config;
            },
            (error) => {
                console.error("[API Request Error]:", error);
                return Promise.reject(error);
            }
        );

        // Interceptor para responses
        this.client.interceptors.response.use(
            (response) => {
                // Log de responses en desarrollo
                if (__DEV__) {
                    console.log(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`, {
                        status: response.status,
                        data: response.data,
                    });
                }

                return response;
            },
            (error: AxiosError) => {
                // Manejo centralizado de errores
                if (error.response) {
                    // El servidor respondió con un código de estado fuera del rango 2xx
                    const status = error.response.status;
                    const data = error.response.data as { message?: string; errors?: Record<string, string[]> };

                    console.error(`[API Error] ${status}:`, {
                        url: error.config?.url,
                        message: data?.message || error.message,
                        errors: data?.errors,
                    });

                    // Puedes agregar lógica específica según el código de estado
                    switch (status) {
                        case 401:
                            // No autorizado - podrías redirigir al login
                            // navigation.navigate('Auth');
                            break;
                        case 403:
                            // Prohibido
                            break;
                        case 404:
                            // No encontrado
                            break;
                        case 500:
                            // Error del servidor
                            break;
                    }
                } else if (error.request) {
                    // La petición fue hecha pero no se recibió respuesta
                    console.error("[API Error] No response received:", error.request);
                } else {
                    // Algo pasó al configurar la petición
                    console.error("[API Error] Request setup error:", error.message);
                }

                return Promise.reject(error);
            }
        );
    }

    /**
     * GET request
     */
    async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.client.get<T>(url, config);
        return response.data;
    }

    /**
     * POST request
     */
    async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.client.post<T>(url, data, config);
        return response.data;
    }

    /**
     * PUT request
     */
    async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.client.put<T>(url, data, config);
        return response.data;
    }

    /**
     * PATCH request
     */
    async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.client.patch<T>(url, data, config);
        return response.data;
    }

    /**
     * DELETE request
     */
    async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.client.delete<T>(url, config);
        return response.data;
    }

    /**
     * Obtener la instancia de axios directamente (para casos especiales)
     */
    getInstance(): AxiosInstance {
        return this.client;
    }
}

export const apiClient = new ApiClient(API_URL);
