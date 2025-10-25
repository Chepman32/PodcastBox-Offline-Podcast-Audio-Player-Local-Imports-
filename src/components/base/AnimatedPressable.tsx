import React from 'react';
import {Pressable, PressableProps, ViewStyle} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface Props extends Omit<PressableProps, 'style'> {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  scaleAmount?: number;
  hapticFeedback?: boolean;
}

export const AnimatedPress: React.FC<Props> = ({
  children,
  style,
  scaleAmount = 0.96,
  hapticFeedback = true,
  ...pressableProps
}) => {
  const scale = useSharedValue(1);

  const tap = Gesture.Tap()
    .onBegin(() => {
      scale.value = withSpring(scaleAmount, {stiffness: 240, damping: 18});
    })
    .onFinalize(() => {
      scale.value = withTiming(1, {duration: 260});
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  return (
    <GestureDetector gesture={tap}>
      <AnimatedPressable style={[style, animatedStyle]} {...pressableProps}>
        {children}
      </AnimatedPressable>
    </GestureDetector>
  );
};
