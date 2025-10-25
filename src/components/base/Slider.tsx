import React from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  runOnJS,
} from 'react-native-reanimated';

interface SliderProps {
  value: number;
  minimumValue: number;
  maximumValue: number;
  onSlidingComplete?: (value: number) => void;
  minimumTrackTintColor?: string;
  maximumTrackTintColor?: string;
  thumbTintColor?: string;
  style?: ViewStyle;
}

export const Slider: React.FC<SliderProps> = ({
  value,
  minimumValue,
  maximumValue,
  onSlidingComplete,
  minimumTrackTintColor = '#007AFF',
  maximumTrackTintColor = '#E5E5EA',
  thumbTintColor = '#007AFF',
  style,
}) => {
  const [width, setWidth] = React.useState(0);
  const position = useSharedValue(0);
  const isScrubbing = useSharedValue(false);

  // Calculate position from value
  React.useEffect(() => {
    if (!isScrubbing.value && width > 0) {
      const range = maximumValue - minimumValue;
      const percentage = (value - minimumValue) / range;
      position.value = percentage * width;
    }
  }, [value, width, minimumValue, maximumValue]);

  const handleSlidingComplete = (newValue: number) => {
    onSlidingComplete?.(newValue);
  };

  const pan = Gesture.Pan()
    .onBegin(() => {
      isScrubbing.value = true;
    })
    .onUpdate((event) => {
      const newPosition = Math.max(0, Math.min(event.x, width));
      position.value = newPosition;
    })
    .onFinalize(() => {
      isScrubbing.value = false;
      const range = maximumValue - minimumValue;
      const percentage = position.value / width;
      const newValue = minimumValue + percentage * range;
      runOnJS(handleSlidingComplete)(newValue);
    });

  const thumbStyle = useAnimatedStyle(() => ({
    left: position.value - 10,
  }));

  const fillStyle = useAnimatedStyle(() => ({
    width: position.value,
  }));

  return (
    <View
      style={[styles.container, style]}
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
    >
      <View style={[styles.track, {backgroundColor: maximumTrackTintColor}]} />
      <Animated.View
        style={[styles.fill, {backgroundColor: minimumTrackTintColor}, fillStyle]}
      />
      <GestureDetector gesture={pan}>
        <Animated.View
          style={[styles.thumb, {backgroundColor: thumbTintColor}, thumbStyle]}
        />
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 40,
    justifyContent: 'center',
    position: 'relative',
  },
  track: {
    height: 4,
    borderRadius: 2,
  },
  fill: {
    position: 'absolute',
    height: 4,
    borderRadius: 2,
  },
  thumb: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
});
