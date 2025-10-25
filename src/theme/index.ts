import {lightColors, darkColors, ColorScheme} from './colors';
import {typography, Typography} from './typography';
import {spacing, borderRadius, hitSlop, elevation, Spacing, BorderRadius} from './spacing';

export interface Theme {
  colors: ColorScheme;
  typography: Typography;
  spacing: Spacing;
  borderRadius: BorderRadius;
  hitSlop: typeof hitSlop;
  elevation: typeof elevation;
  isDark: boolean;
}

export const lightTheme: Theme = {
  colors: lightColors,
  typography,
  spacing,
  borderRadius,
  hitSlop,
  elevation,
  isDark: false,
};

export const darkTheme: Theme = {
  colors: darkColors,
  typography,
  spacing,
  borderRadius,
  hitSlop,
  elevation,
  isDark: true,
};

export {lightColors, darkColors, typography, spacing, borderRadius, hitSlop, elevation};
