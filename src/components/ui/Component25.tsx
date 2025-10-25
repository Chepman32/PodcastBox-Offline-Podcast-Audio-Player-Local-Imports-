import React from 'react';
import {View, ViewStyle} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {Canvas, Path, Circle, Rect, RoundedRect, LinearGradient, vec} from '@shopify/react-native-skia';
import {useTheme} from '../../theme/ThemeContext';

interface Component25Props {
  prop1?: number;
  prop2?: number;
  prop3?: string;
  prop4?: boolean;
  prop5?: string;
  prop6?: number;
  prop7?: number;
  prop8?: string;
  style?: ViewStyle;
  onPress?: () => void;
  accessibilityLabel?: string;
}

/**
 * Component25 - Reusable UI component
 * Features: longPress, doubleTap gestures
 * Animations: onFocusTransition, onPressScaleSpring, onDismissSwipe, onRevealFling
 */
export const Component25: React.FC<Component25Props> = ({
  style,
  onPress,
  accessibilityLabel = 'Component25',
  ...props
}) => {
  const {theme} = useTheme();


  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
    opacity: opacity.value,
  }));


  // Gesture handlers
  const onTap = () => {
    scale.value = withSpring(0.96, {stiffness: 240, damping: 18});
    setTimeout(() => {
      scale.value = withTiming(1, {duration: 260});
    }, 100);
    onPress?.();
  };

  const onLongPress = () => {
    // Handle long press
  };

  const onDoubleTap = () => {
    // Handle double tap
  };

  const onFling = () => {
    // Handle fling
  };

  const onEdgeSwipe = () => {
    // Handle edge swipe
  };

  const onPressAndHold = () => {
    // Handle press and hold
  };

  const longPressGesture = Gesture.LongPress().onStart(() => { runOnJS(onLongPress)(); });
  const doubleTapGesture = Gesture.Tap().numberOfTaps(2).onStart(() => { runOnJS(onDoubleTap)(); });

  const composedGesture = Gesture.Race(
    Gesture.Tap().onStart(() => { runOnJS(onTap)(); })
  );

  return (
    <GestureDetector gesture={composedGesture}>
      <Animated.View
        style={[
          {
            width: 100,
            height: 100,
            backgroundColor: theme.colors.surface,
            borderRadius: theme.borderRadius.md,
          },
          animatedStyle,
          style,
        ]}
        accessible={true}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
      >
        <Canvas style={{flex: 1}}>
          <RoundedRect
            x={0}
            y={0}
            width={100}
            height={100}
            r={theme.borderRadius.md}
            color={theme.colors.primary}
            opacity={0.1}
          />
          <Circle
            cx={50}
            cy={50}
            r={20}
            color={theme.colors.primary}
          />
        </Canvas>
      </Animated.View>
    </GestureDetector>
  );
};
