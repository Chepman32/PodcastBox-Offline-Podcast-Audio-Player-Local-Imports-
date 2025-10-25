import React, {useEffect} from 'react';
import {View, Text, FlatList, StyleSheet, Image} from 'react-native';
import {useTheme} from '../theme/ThemeContext';
import {usePlaylistStore} from '../stores/playlistStore';
import {useLibraryStore} from '../stores/libraryStore';
import {usePlayerStore} from '../stores/playerStore';
import {Playlist} from '../types';
import {AnimatedPress} from '../components/base/AnimatedPressable';

export const PlaylistsScreen: React.FC = () => {
  const {theme} = useTheme();
  const {playlists, loadPlaylists} = usePlaylistStore();
  const {tracks} = useLibraryStore();
  const {setQueue, play} = usePlayerStore();

  useEffect(() => {
    loadPlaylists();
  }, []);

  const handlePlaylistPress = (playlist: Playlist) => {
    const playlistTracks = playlist.trackIds
      .map(id => tracks.find(t => t.id === id))
      .filter(Boolean);

    if (playlistTracks.length > 0) {
      setQueue(playlistTracks as any, 0);
      play();
    }
  };

  const getPlaylistDuration = (playlist: Playlist): number => {
    return playlist.trackIds.reduce((total, id) => {
      const track = tracks.find(t => t.id === id);
      return total + (track?.duration || 0);
    }, 0);
  };

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const renderPlaylistItem = ({item}: {item: Playlist}) => {
    const duration = getPlaylistDuration(item);

    return (
      <AnimatedPress
        onPress={() => handlePlaylistPress(item)}
        style={[styles.playlistItem, {backgroundColor: theme.colors.surface}]}
      >
        <View style={styles.playlistCover}>
          {item.coverImage ? (
            <Image source={{uri: item.coverImage}} style={styles.coverImage} />
          ) : (
            <View style={[styles.coverPlaceholder, {backgroundColor: theme.colors.primary}]}>
              <Text style={[styles.coverText, {color: '#FFFFFF'}]}>
                {item.name.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.playlistInfo}>
          <Text style={[styles.playlistName, {color: theme.colors.text}]} numberOfLines={1}>
            {item.name}
          </Text>
          {item.description && (
            <Text
              style={[styles.playlistDescription, {color: theme.colors.textSecondary}]}
              numberOfLines={2}
            >
              {item.description}
            </Text>
          )}
          <Text style={[styles.playlistMeta, {color: theme.colors.textTertiary}]}>
            {item.trackIds.length} tracks • {formatDuration(duration)}
          </Text>
        </View>
      </AnimatedPress>
    );
  };

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <View style={[styles.header, {backgroundColor: theme.colors.surface}]}>
        <Text style={[styles.headerTitle, {color: theme.colors.text}]}>Playlists</Text>
        <Text style={[styles.headerSubtitle, {color: theme.colors.textSecondary}]}>
          {playlists.length} playlists
        </Text>
      </View>

      {playlists.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, {color: theme.colors.textSecondary}]}>
            No playlists yet
          </Text>
          <Text style={[styles.emptySubtext, {color: theme.colors.textTertiary}]}>
            Create playlists to organize your audio collection
          </Text>
        </View>
      ) : (
        <FlatList
          data={playlists}
          renderItem={renderPlaylistItem}
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
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
  },
  listContent: {
    padding: 16,
  },
  playlistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  playlistCover: {
    marginRight: 12,
  },
  coverImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  coverPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverText: {
    fontSize: 32,
    fontWeight: '700',
  },
  playlistInfo: {
    flex: 1,
  },
  playlistName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  playlistDescription: {
    fontSize: 14,
    marginBottom: 4,
  },
  playlistMeta: {
    fontSize: 12,
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
