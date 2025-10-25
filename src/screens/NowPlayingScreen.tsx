import React from 'react';
import {View, Text, StyleSheet, Image, Dimensions} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {useTheme} from '../theme/ThemeContext';
import {usePlayerStore} from '../stores/playerStore';
import {AnimatedPress} from '../components/base/AnimatedPressable';
import {Slider} from '../components/base/Slider';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

export const NowPlayingScreen: React.FC = () => {
  const {theme} = useTheme();
  const {
    currentTrack,
    isPlaying,
    position,
    duration,
    speed,
    togglePlayPause,
    seekTo,
    skipForward,
    skipBackward,
    nextTrack,
    previousTrack,
    setSpeed,
  } = usePlayerStore();

  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);

  // Parallax effect for artwork
  const artworkStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            translateY.value,
            [0, 200],
            [0, -50],
            Extrapolate.CLAMP
          ),
        },
        {scale: scale.value},
      ],
    };
  });

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSpeedChange = () => {
    const speeds = [0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0];
    const currentIndex = speeds.indexOf(speed);
    const nextIndex = (currentIndex + 1) % speeds.length;
    setSpeed(speeds[nextIndex]);
  };

  if (!currentTrack) {
    return (
      <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, {color: theme.colors.textSecondary}]}>
            No track playing
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      {/* Artwork with parallax */}
      <Animated.View style={[styles.artworkContainer, artworkStyle]}>
        {currentTrack.albumArt ? (
          <Image source={{uri: currentTrack.albumArt}} style={styles.artwork} />
        ) : (
          <View style={[styles.artworkPlaceholder, {backgroundColor: theme.colors.primary}]}>
            <Text style={[styles.artworkText, {color: '#FFFFFF'}]}>
              {currentTrack.title.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
      </Animated.View>

      {/* Track info */}
      <View style={styles.infoContainer}>
        <Text style={[styles.title, {color: theme.colors.text}]} numberOfLines={2}>
          {currentTrack.title}
        </Text>
        <Text style={[styles.artist, {color: theme.colors.textSecondary}]} numberOfLines={1}>
          {currentTrack.artist}
        </Text>
      </View>

      {/* Progress bar */}
      <View style={styles.progressContainer}>
        <Slider
          style={styles.slider}
          value={position}
          minimumValue={0}
          maximumValue={duration}
          onSlidingComplete={seekTo}
          minimumTrackTintColor={theme.colors.primary}
          maximumTrackTintColor={theme.colors.progressBarBackground}
          thumbTintColor={theme.colors.primary}
        />
        <View style={styles.timeContainer}>
          <Text style={[styles.timeText, {color: theme.colors.textTertiary}]}>
            {formatTime(position)}
          </Text>
          <Text style={[styles.timeText, {color: theme.colors.textTertiary}]}>
            {formatTime(duration)}
          </Text>
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controlsContainer}>
        <AnimatedPress onPress={previousTrack} style={styles.controlButton}>
          <Text style={[styles.controlIcon, {color: theme.colors.text}]}>⏮</Text>
        </AnimatedPress>

        <AnimatedPress onPress={() => skipBackward(15)} style={styles.controlButton}>
          <Text style={[styles.controlIcon, {color: theme.colors.text}]}>↶ 15</Text>
        </AnimatedPress>

        <AnimatedPress onPress={togglePlayPause} style={styles.playButton}>
          <Text style={[styles.playIcon, {color: '#FFFFFF'}]}>
            {isPlaying ? '⏸' : '▶'}
          </Text>
        </AnimatedPress>

        <AnimatedPress onPress={() => skipForward(30)} style={styles.controlButton}>
          <Text style={[styles.controlIcon, {color: theme.colors.text}]}>30 ↷</Text>
        </AnimatedPress>

        <AnimatedPress onPress={nextTrack} style={styles.controlButton}>
          <Text style={[styles.controlIcon, {color: theme.colors.text}]}>⏭</Text>
        </AnimatedPress>
      </View>

      {/* Speed control */}
      <View style={styles.speedContainer}>
        <AnimatedPress
          onPress={handleSpeedChange}
          style={[styles.speedButton, {backgroundColor: theme.colors.surface}]}
        >
          <Text style={[styles.speedText, {color: theme.colors.text}]}>
            {speed}x
          </Text>
        </AnimatedPress>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  artworkContainer: {
    alignItems: 'center',
    marginVertical: 32,
  },
  artwork: {
    width: SCREEN_WIDTH * 0.75,
    height: SCREEN_WIDTH * 0.75,
    borderRadius: 16,
  },
  artworkPlaceholder: {
    width: SCREEN_WIDTH * 0.75,
    height: SCREEN_WIDTH * 0.75,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  artworkText: {
    fontSize: 120,
    fontWeight: '700',
  },
  infoContainer: {
    paddingHorizontal: 32,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  artist: {
    fontSize: 18,
    textAlign: 'center',
  },
  progressContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  timeText: {
    fontSize: 12,
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  controlButton: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlIcon: {
    fontSize: 24,
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  playIcon: {
    fontSize: 32,
  },
  speedContainer: {
    alignItems: 'center',
  },
  speedButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  speedText: {
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 18,
  },
});
