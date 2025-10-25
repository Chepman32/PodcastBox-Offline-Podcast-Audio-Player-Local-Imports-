export const lightColors = {
  // Primary palette
  primary: '#007AFF',
  primaryLight: '#5AC8FA',
  primaryDark: '#0051D5',

  // Backgrounds
  background: '#FFFFFF',
  backgroundSecondary: '#F2F2F7',
  backgroundTertiary: '#FFFFFF',

  // Surfaces
  surface: '#FFFFFF',
  surfaceElevated: '#F2F2F7',

  // Text
  text: '#000000',
  textSecondary: '#3C3C43',
  textTertiary: '#3C3C4399',
  textDisabled: '#3C3C434D',

  // Borders
  border: '#C6C6C8',
  borderLight: '#E5E5EA',

  // Semantic
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  info: '#5AC8FA',

  // Overlays
  overlay: 'rgba(0, 0, 0, 0.4)',
  scrim: 'rgba(0, 0, 0, 0.6)',

  // Player specific
  waveform: '#007AFF',
  waveformBackground: '#E5E5EA',
  progressBar: '#007AFF',
  progressBarBackground: '#E5E5EA',
};

export const darkColors = {
  // Primary palette
  primary: '#0A84FF',
  primaryLight: '#64D2FF',
  primaryDark: '#0062CC',

  // Backgrounds
  background: '#000000',
  backgroundSecondary: '#1C1C1E',
  backgroundTertiary: '#2C2C2E',

  // Surfaces
  surface: '#1C1C1E',
  surfaceElevated: '#2C2C2E',

  // Text
  text: '#FFFFFF',
  textSecondary: '#EBEBF5',
  textTertiary: '#EBEBF599',
  textDisabled: '#EBEBF54D',

  // Borders
  border: '#38383A',
  borderLight: '#48484A',

  // Semantic
  success: '#30D158',
  warning: '#FF9F0A',
  error: '#FF453A',
  info: '#64D2FF',

  // Overlays
  overlay: 'rgba(0, 0, 0, 0.6)',
  scrim: 'rgba(0, 0, 0, 0.8)',

  // Player specific
  waveform: '#0A84FF',
  waveformBackground: '#48484A',
  progressBar: '#0A84FF',
  progressBarBackground: '#48484A',
};

export type ColorScheme = typeof lightColors;
