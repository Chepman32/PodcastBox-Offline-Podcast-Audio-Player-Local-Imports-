import React, {useEffect} from 'react';
import {View, Text, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import {useTheme} from '../theme/ThemeContext';
import {useBookmarkStore} from '../stores/bookmarkStore';
import {useLibraryStore} from '../stores/libraryStore';
import {usePlayerStore} from '../stores/playerStore';
import {Bookmark} from '../types';
import {AnimatedPress} from '../components/base/AnimatedPressable';

export const BookmarksScreen: React.FC = () => {
  const {theme} = useTheme();
  const {bookmarks, loadBookmarks, deleteBookmark} = useBookmarkStore();
  const {tracks} = useLibraryStore();
  const {setCurrentTrack, seekTo, play} = usePlayerStore();

  useEffect(() => {
    loadBookmarks();
  }, []);

  const handleBookmarkPress = (bookmark: Bookmark) => {
    const track = tracks.find(t => t.id === bookmark.trackId);
    if (track) {
      setCurrentTrack(track);
      seekTo(bookmark.position);
      play();
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderBookmarkItem = ({item}: {item: Bookmark}) => {
    const track = tracks.find(t => t.id === item.trackId);

    return (
      <AnimatedPress
        onPress={() => handleBookmarkPress(item)}
        style={[styles.bookmarkItem, {backgroundColor: theme.colors.surface}]}
      >
        <View style={styles.bookmarkContent}>
          <View
            style={[
              styles.colorMarker,
              {backgroundColor: item.color || theme.colors.primary},
            ]}
          />
          <View style={styles.bookmarkInfo}>
            <Text style={[styles.bookmarkTitle, {color: theme.colors.text}]} numberOfLines={1}>
              {item.title}
            </Text>
            <Text
              style={[styles.trackName, {color: theme.colors.textSecondary}]}
              numberOfLines={1}
            >
              {track?.title || 'Unknown Track'}
            </Text>
            {item.note && (
              <Text
                style={[styles.bookmarkNote, {color: theme.colors.textTertiary}]}
                numberOfLines={2}
              >
                {item.note}
              </Text>
            )}
          </View>
          <Text style={[styles.timeStamp, {color: theme.colors.textTertiary}]}>
            {formatTime(item.position)}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => deleteBookmark(item.id)}
          style={styles.deleteButton}
        >
          <Text style={styles.deleteIcon}>🗑</Text>
        </TouchableOpacity>
      </AnimatedPress>
    );
  };

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <View style={[styles.header, {backgroundColor: theme.colors.surface}]}>
        <Text style={[styles.headerTitle, {color: theme.colors.text}]}>Bookmarks</Text>
        <Text style={[styles.headerSubtitle, {color: theme.colors.textSecondary}]}>
          {bookmarks.length} saved
        </Text>
      </View>

      {bookmarks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, {color: theme.colors.textSecondary}]}>
            No bookmarks yet
          </Text>
          <Text style={[styles.emptySubtext, {color: theme.colors.textTertiary}]}>
            Create bookmarks while listening to remember important moments
          </Text>
        </View>
      ) : (
        <FlatList
          data={bookmarks}
          renderItem={renderBookmarkItem}
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
  bookmarkItem: {
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
  bookmarkContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorMarker: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: 12,
  },
  bookmarkInfo: {
    flex: 1,
  },
  bookmarkTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  trackName: {
    fontSize: 14,
    marginBottom: 4,
  },
  bookmarkNote: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  timeStamp: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  deleteButton: {
    padding: 8,
  },
  deleteIcon: {
    fontSize: 20,
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
