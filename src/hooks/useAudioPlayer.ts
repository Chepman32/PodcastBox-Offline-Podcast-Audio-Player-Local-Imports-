import {useEffect, useRef} from 'react';
import TrackPlayer, {Event, State, useTrackPlayerEvents} from 'react-native-track-player';
import {usePlayerStore} from '../stores/playerStore';
import {useLibraryStore} from '../stores/libraryStore';
import {audioPlayerService} from '../services/audioPlayer';
import {notificationService} from '../services/notifications';

/**
 * Hook to sync audio player with player store
 * Handles playback events and keeps store in sync with actual player state
 */
export const useAudioPlayer = () => {
  const playerStore = usePlayerStore();
  const libraryStore = useLibraryStore();
  const positionInterval = useRef<NodeJS.Timeout | null>(null);

  // Initialize audio player
  useEffect(() => {
    const init = async () => {
      await audioPlayerService.initialize();
      await notificationService.initialize();
      notificationService.createChannel();
    };

    init();

    return () => {
      if (positionInterval.current) {
        clearInterval(positionInterval.current);
      }
    };
  }, []);

  // Sync playback state
  useEffect(() => {
    const syncPlayback = async () => {
      if (playerStore.isPlaying) {
        await audioPlayerService.play();
      } else {
        await audioPlayerService.pause();
      }
    };

    syncPlayback();
  }, [playerStore.isPlaying]);

  // Sync speed
  useEffect(() => {
    audioPlayerService.setRate(playerStore.speed);
  }, [playerStore.speed]);

  // Sync volume
  useEffect(() => {
    audioPlayerService.setVolume(playerStore.volume);
  }, [playerStore.volume]);

  // Sync current track
  useEffect(() => {
    const loadTrack = async () => {
      if (playerStore.currentTrack) {
        await audioPlayerService.loadTrack(playerStore.currentTrack);

        // Update notification
        notificationService.showPlaybackNotification(
          playerStore.currentTrack,
          playerStore.isPlaying,
          playerStore.position
        );
      }
    };

    loadTrack();
  }, [playerStore.currentTrack?.id]);

  // Sync queue
  useEffect(() => {
    const loadQueue = async () => {
      if (playerStore.queue.length > 0) {
        await audioPlayerService.loadQueue(
          playerStore.queue,
          playerStore.queueIndex
        );
      }
    };

    loadQueue();
  }, [playerStore.queue.length]);

  // Position tracking
  useEffect(() => {
    if (playerStore.isPlaying) {
      positionInterval.current = setInterval(async () => {
        const position = await audioPlayerService.getPosition();
        playerStore.seekTo(position);

        // Update track's playback position in database
        if (playerStore.currentTrack) {
          const updatedTrack = {
            ...playerStore.currentTrack,
            playbackPosition: position,
          };
          await libraryStore.updateTrack(updatedTrack);
        }
      }, 1000);
    } else {
      if (positionInterval.current) {
        clearInterval(positionInterval.current);
        positionInterval.current = null;
      }
    }

    return () => {
      if (positionInterval.current) {
        clearInterval(positionInterval.current);
      }
    };
  }, [playerStore.isPlaying]);

  // Track player events
  useTrackPlayerEvents([Event.PlaybackState, Event.PlaybackTrackChanged], async (event) => {
    if (event.type === Event.PlaybackState) {
      const state = await audioPlayerService.getState();
      const isPlaying = state === State.Playing;

      if (isPlaying !== playerStore.isPlaying) {
        if (isPlaying) {
          playerStore.play();
        } else {
          playerStore.pause();
        }
      }
    }

    if (event.type === Event.PlaybackTrackChanged) {
      // Track changed, update play count
      if (playerStore.currentTrack) {
        const updatedTrack = {
          ...playerStore.currentTrack,
          playCount: playerStore.currentTrack.playCount + 1,
          lastPlayedAt: new Date().toISOString(),
        };
        await libraryStore.updateTrack(updatedTrack);
      }
    }
  });

  // Update notification when playback changes
  useEffect(() => {
    if (playerStore.currentTrack) {
      notificationService.updatePlaybackNotification(
        playerStore.currentTrack,
        playerStore.isPlaying,
        playerStore.position
      );
    }
  }, [playerStore.isPlaying, playerStore.currentTrack, playerStore.position]);

  return {
    // Expose useful helpers
    isReady: true,
  };
};
