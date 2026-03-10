import { createClient } from "@supabase/supabase-js";
import Constants from "expo-constants";

/**
 * Cliente de Supabase
 * 
 * Para usar este cliente, necesitas configurar las variables de entorno:
 * - EXPO_PUBLIC_SUPABASE_URL
 * - EXPO_PUBLIC_SUPABASE_ANON_KEY
 * 
 * Crea un archivo .env en la raíz del proyecto con:
 * EXPO_PUBLIC_SUPABASE_URL=tu_url_de_supabase
 * EXPO_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
 */
const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl || process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
        "Missing Supabase environment variables. Please set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY"
    );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});
