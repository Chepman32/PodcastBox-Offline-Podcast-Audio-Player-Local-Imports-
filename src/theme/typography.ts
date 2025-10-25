import {Platform, TextStyle} from 'react-native';

// SF Pro font family
const fontFamily = Platform.select({
  ios: 'System',
  android: 'Roboto',
  default: 'System',
});

export const typography = {
  // Large Title
  largeTitle: {
    fontFamily,
    fontSize: 34,
    lineHeight: 41,
    fontWeight: '700',
    letterSpacing: 0.37,
  } as TextStyle,

  // Title 1
  title1: {
    fontFamily,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700',
    letterSpacing: 0.36,
  } as TextStyle,

  // Title 2
  title2: {
    fontFamily,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700',
    letterSpacing: 0.35,
  } as TextStyle,

  // Title 3
  title3: {
    fontFamily,
    fontSize: 20,
    lineHeight: 25,
    fontWeight: '600',
    letterSpacing: 0.38,
  } as TextStyle,

  // Headline
  headline: {
    fontFamily,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '600',
    letterSpacing: -0.41,
  } as TextStyle,

  // Body
  body: {
    fontFamily,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '400',
    letterSpacing: -0.41,
  } as TextStyle,

  // Callout
  callout: {
    fontFamily,
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '400',
    letterSpacing: -0.32,
  } as TextStyle,

  // Subheadline
  subheadline: {
    fontFamily,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '400',
    letterSpacing: -0.24,
  } as TextStyle,

  // Footnote
  footnote: {
    fontFamily,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400',
    letterSpacing: -0.08,
  } as TextStyle,

  // Caption 1
  caption1: {
    fontFamily,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
    letterSpacing: 0,
  } as TextStyle,

  // Caption 2
  caption2: {
    fontFamily,
    fontSize: 11,
    lineHeight: 13,
    fontWeight: '400',
    letterSpacing: 0.07,
  } as TextStyle,
};

export type Typography = typeof typography;
