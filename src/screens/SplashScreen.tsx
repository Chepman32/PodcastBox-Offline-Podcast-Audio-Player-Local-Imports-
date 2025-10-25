import React, {useEffect} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  runOnJS,
} from 'react-native-reanimated';
import {Canvas, Circle, Group, LinearGradient, vec} from '@shopify/react-native-skia';
import {useTheme} from '../theme/ThemeContext';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

interface Props {
  onFinish: () => void;
}

export const SplashScreen: React.FC<Props> = ({onFinish}) => {
  const {theme} = useTheme();

  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const particleScale = useSharedValue(1);

  useEffect(() => {
    // Animate logo appearance
    opacity.value = withTiming(1, {duration: 500});
    scale.value = withSequence(
      withSpring(1.2, {stiffness: 100, damping: 10}),
      withSpring(1, {stiffness: 200, damping: 15})
    );

    // Animate particle explosion
    particleScale.value = withSequence(
      withTiming(0, {duration: 0}),
      withTiming(2, {duration: 1000}),
      withTiming(0, {duration: 500})
    );

    // Navigate after animation
    const timer = setTimeout(() => {
      runOnJS(onFinish)();
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
    opacity: opacity.value,
  }));

  // Generate particle positions
  const particles = Array.from({length: 30}, (_, i) => {
    const angle = (i / 30) * Math.PI * 2;
    const radius = 100;
    return {
      x: SCREEN_WIDTH / 2 + Math.cos(angle) * radius,
      y: SCREEN_HEIGHT / 2 + Math.sin(angle) * radius,
      color: i % 2 === 0 ? theme.colors.primary : theme.colors.primaryLight,
    };
  });

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <Canvas style={styles.canvas}>
        {/* Particle effect */}
        <Group>
          {particles.map((particle, index) => (
            <Circle
              key={index}
              cx={particle.x}
              cy={particle.y}
              r={4}
              color={particle.color}
              opacity={0.6}
            />
          ))}
        </Group>

        {/* Main logo circle */}
        <Circle
          cx={SCREEN_WIDTH / 2}
          cy={SCREEN_HEIGHT / 2}
          r={60}
          color={theme.colors.primary}
        >
          <LinearGradient
            start={vec(SCREEN_WIDTH / 2 - 60, SCREEN_HEIGHT / 2 - 60)}
            end={vec(SCREEN_WIDTH / 2 + 60, SCREEN_HEIGHT / 2 + 60)}
            colors={[theme.colors.primary, theme.colors.primaryDark]}
          />
        </Circle>
      </Canvas>

      <Animated.View style={[styles.logoContainer, logoStyle]}>
        <Animated.Text style={[styles.logoText, {color: '#FFFFFF'}]}>
          PodcastBox
        </Animated.Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  canvas: {
    ...StyleSheet.absoluteFillObject,
  },
  logoContainer: {
    position: 'absolute',
  },
  logoText: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
  },
});
