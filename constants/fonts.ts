/**
 * Configuración de fuentes para la aplicación
 * Space Grotesk con variantes: Regular, Medium, Bold
 */

export const fonts = {
    spaceGrotesk: {
        regular: 'SpaceGrotesk-Regular',
        medium: 'SpaceGrotesk-Medium',
        bold: 'SpaceGrotesk-Bold',
    },
} as const;

/**
 * Mapeo de fuentes para expo-font
 * Asegúrate de que los nombres de los archivos coincidan con estos nombres
 */
export const fontAssets = {
    'SpaceGrotesk-Regular': require('../assets/fonts/SpaceGrotesk-Regular.ttf'),
    'SpaceGrotesk-Medium': require('../assets/fonts/SpaceGrotesk-Medium.ttf'),
    'SpaceGrotesk-Bold': require('../assets/fonts/SpaceGrotesk-Bold.ttf'),
};
