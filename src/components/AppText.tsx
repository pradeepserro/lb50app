import React from 'react';
import { Text, TextProps } from 'react-native';
import { Fonts, FontFamily } from '@/utils/fonts';

export interface AppTextProps extends TextProps {
  fontFamily?: FontFamily;
}

export const AppText: React.FC<AppTextProps> = ({ 
  style, 
  fontFamily = Fonts.PoppinsRegular, 
  ...rest 
}) => {
  return (
    <Text 
      style={[{ fontFamily }, style]} 
      {...rest} 
    />
  );
};
