// 8pt spacing grid
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  round: 9999,
};

export const hitSlop = {
  small: {top: 8, bottom: 8, left: 8, right: 8},
  medium: {top: 12, bottom: 12, left: 12, right: 12},
  large: {top: 16, bottom: 16, left: 16, right: 16},
};

export const elevation = {
  none: 0,
  sm: 2,
  md: 4,
  lg: 8,
  xl: 16,
};

export type Spacing = typeof spacing;
export type BorderRadius = typeof borderRadius;
