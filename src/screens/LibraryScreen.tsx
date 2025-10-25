import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {useTheme} from '../theme/ThemeContext';
import {useLibraryStore} from '../stores/libraryStore';
import {usePlayerStore} from '../stores/playerStore';
import {Track} from '../types';
import {AnimatedPress} from '../components/base/AnimatedPressable';

export const LibraryScreen: React.FC = () => {
  const {theme} = useTheme();
  const {loadTracks, getFilteredTracks, setSearchQuery, searchQuery} = useLibraryStore();
  const {setQueue, setCurrentTrack, play} = usePlayerStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTracks().finally(() => setIsLoading(false));
  }, []);

  const tracks = getFilteredTracks();

  const handleTrackPress = (track: Track, index: number) => {
    setQueue(tracks, index);
    setCurrentTrack(track);
    play();
  };

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const renderTrackItem = ({item, index}: {item: Track; index: number}) => (
    <AnimatedPress
      onPress={() => handleTrackPress(item, index)}
      style={[styles.trackItem, {backgroundColor: theme.colors.surface}]}
    >
      <View style={styles.trackArtwork}>
        {item.albumArt ? (
          <Image source={{uri: item.albumArt}} style={styles.artworkImage} />
        ) : (
          <View style={[styles.artworkPlaceholder, {backgroundColor: theme.colors.primary}]}>
            <Text style={[styles.artworkText, {color: theme.colors.text}]}>
              {item.title.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.trackInfo}>
        <Text
          style={[styles.trackTitle, {color: theme.colors.text}]}
          numberOfLines={1}
        >
          {item.title}
        </Text>
        <Text
          style={[styles.trackArtist, {color: theme.colors.textSecondary}]}
          numberOfLines={1}
        >
          {item.artist}
        </Text>
        <Text style={[styles.trackDuration, {color: theme.colors.textTertiary}]}>
          {formatDuration(item.duration)}
        </Text>
      </View>

      {item.isFavorite && (
        <Text style={styles.favoriteIcon}>❤️</Text>
      )}
    </AnimatedPress>
  );

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <View style={[styles.header, {backgroundColor: theme.colors.surface}]}>
        <Text style={[styles.headerTitle, {color: theme.colors.text}]}>Library</Text>
        <TextInput
          style={[
            styles.searchInput,
            {
              backgroundColor: theme.colors.backgroundSecondary,
              color: theme.colors.text,
              borderColor: theme.colors.border,
            },
          ]}
          placeholder="Search tracks..."
          placeholderTextColor={theme.colors.textTertiary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, {color: theme.colors.textSecondary}]}>
            Loading your library...
          </Text>
        </View>
      ) : tracks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, {color: theme.colors.textSecondary}]}>
            No tracks found
          </Text>
          <Text style={[styles.emptySubtext, {color: theme.colors.textTertiary}]}>
            Import audio files to get started
          </Text>
        </View>
      ) : (
        <FlatList
          data={tracks}
          renderItem={renderTrackItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingTop: 60,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: '700',
    marginBottom: 16,
  },
  searchInput: {
    height: 40,
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    borderWidth: 1,
  },
  listContent: {
    padding: 16,
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  trackArtwork: {
    marginRight: 12,
  },
  artworkImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  artworkPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.3,
  },
  artworkText: {
    fontSize: 24,
    fontWeight: '600',
  },
  trackInfo: {
    flex: 1,
  },
  trackTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  trackArtist: {
    fontSize: 14,
    marginBottom: 2,
  },
  trackDuration: {
    fontSize: 12,
  },
  favoriteIcon: {
    fontSize: 20,
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
});
