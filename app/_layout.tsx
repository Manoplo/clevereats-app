import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { StyleSheet, Text, TextProps } from "react-native";
import { fontAssets, fonts } from "../constants/fonts";

// Prevenir que el splash screen se oculte automáticamente
SplashScreen.preventAutoHideAsync();

// Sobrescribir el componente Text por defecto para usar Space Grotesk Regular
// Esto hace que todos los componentes <Text> usen Space Grotesk automáticamente
const OriginalText = Text;
(Text as any).render = function (props: TextProps, ref: any) {
  return (
    <OriginalText
      {...props}
      ref={ref}
      style={[
        { fontFamily: fonts.spaceGrotesk.regular },
        StyleSheet.flatten(props.style),
      ]}
    />
  );
};

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts(fontAssets);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      // Ocultar el splash screen cuando las fuentes estén cargadas
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // No renderizar nada hasta que las fuentes estén cargadas
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return <Stack />;
}
