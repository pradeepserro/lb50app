export const Fonts = {
  MontserratRegular: 'Montserrat-Regular',
  MontserratMedium: 'Montserrat-Medium',
  MontserratSemiBold: 'Montserrat-SemiBold',
  MontserratBold: 'Montserrat-Bold',
  PoppinsRegular: 'Poppins-Regular',
  PoppinsMedium: 'Poppins-Medium',
  PoppinsSemiBold: 'Poppins-SemiBold',
  PoppinsBold: 'Poppins-Bold',
} as const;

export type FontFamily = typeof Fonts[keyof typeof Fonts];
