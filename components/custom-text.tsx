import React from 'react';
import { StyleSheet, Text, TextProps } from 'react-native';
import { fonts } from '../constants/fonts';

type FontWeight = 'regular' | 'medium' | 'bold';

interface CustomTextProps extends TextProps {
  weight?: FontWeight;
}

/**
 * Componente Text personalizado que usa Space Grotesk por defecto
 * 
 * @example
 * <CustomText>Texto normal</CustomText>
 * <CustomText weight="bold">Texto en negrita</CustomText>
 * <CustomText weight="medium">Texto en medium</CustomText>
 */
export const CustomText: React.FC<CustomTextProps> = ({
  weight = 'regular',
  style,
  ...props
}) => {
  const fontFamily = fonts.spaceGrotesk[weight];

  return (
    <Text
      {...props}
      style={[styles.default, { fontFamily }, style]}
    />
  );
};

const styles = StyleSheet.create({
  default: {
    fontFamily: fonts.spaceGrotesk.regular,
  },
});
