import {create} from 'zustand';
import {Track, PlaybackState} from '../types';

interface PlayerStore extends PlaybackState {
  // Actions
  setCurrentTrack: (track: Track) => void;
  play: () => void;
  pause: () => void;
  togglePlayPause: () => void;
  seekTo: (position: number) => void;
  setSpeed: (speed: number) => void;
  setVolume: (volume: number) => void;
  skipForward: (seconds: number) => void;
  skipBackward: (seconds: number) => void;
  nextTrack: () => void;
  previousTrack: () => void;
  setQueue: (tracks: Track[], startIndex?: number) => void;
  addToQueue: (track: Track) => void;
  removeFromQueue: (index: number) => void;
  toggleRepeat: () => void;
  toggleShuffle: () => void;
  reset: () => void;
}

const initialState: PlaybackState = {
  currentTrack: undefined,
  isPlaying: false,
  position: 0,
  duration: 0,
  speed: 1.0,
  volume: 1.0,
  queue: [],
  queueIndex: 0,
  repeatMode: 'off',
  shuffleEnabled: false,
};

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  ...initialState,

  setCurrentTrack: (track: Track) => {
    set({
      currentTrack: track,
      duration: track.duration,
      position: track.playbackPosition || 0,
    });
  },

  play: () => set({isPlaying: true}),
  pause: () => set({isPlaying: false}),

  togglePlayPause: () => {
    const {isPlaying} = get();
    set({isPlaying: !isPlaying});
  },

  seekTo: (position: number) => {
    const {duration} = get();
    const clampedPosition = Math.max(0, Math.min(position, duration));
    set({position: clampedPosition});
  },

  setSpeed: (speed: number) => {
    const clampedSpeed = Math.max(0.5, Math.min(speed, 2.0));
    set({speed: clampedSpeed});
  },

  setVolume: (volume: number) => {
    const clampedVolume = Math.max(0, Math.min(volume, 1.0));
    set({volume: clampedVolume});
  },

  skipForward: (seconds: number) => {
    const {position, duration} = get();
    const newPosition = Math.min(position + seconds, duration);
    set({position: newPosition});
  },

  skipBackward: (seconds: number) => {
    const {position} = get();
    const newPosition = Math.max(position - seconds, 0);
    set({position: newPosition});
  },

  nextTrack: () => {
    const {queue, queueIndex, repeatMode, shuffleEnabled} = get();

    if (queue.length === 0) return;

    if (repeatMode === 'one') {
      // Restart current track
      set({position: 0});
      return;
    }

    let nextIndex = queueIndex + 1;

    if (nextIndex >= queue.length) {
      if (repeatMode === 'all') {
        nextIndex = 0;
      } else {
        // End of queue, stop playback
        set({isPlaying: false});
        return;
      }
    }

    const nextTrack = queue[nextIndex];
    set({
      currentTrack: nextTrack,
      queueIndex: nextIndex,
      position: 0,
      duration: nextTrack.duration,
    });
  },

  previousTrack: () => {
    const {queue, queueIndex, position} = get();

    if (queue.length === 0) return;

    // If we're more than 3 seconds into the track, restart it
    if (position > 3) {
      set({position: 0});
      return;
    }

    let prevIndex = queueIndex - 1;

    if (prevIndex < 0) {
      prevIndex = queue.length - 1;
    }

    const prevTrack = queue[prevIndex];
    set({
      currentTrack: prevTrack,
      queueIndex: prevIndex,
      position: 0,
      duration: prevTrack.duration,
    });
  },

  setQueue: (tracks: Track[], startIndex = 0) => {
    if (tracks.length === 0) return;

    const currentTrack = tracks[startIndex];
    set({
      queue: tracks,
      queueIndex: startIndex,
      currentTrack,
      position: 0,
      duration: currentTrack.duration,
    });
  },

  addToQueue: (track: Track) => {
    set(state => ({
      queue: [...state.queue, track],
    }));
  },

  removeFromQueue: (index: number) => {
    set(state => {
      const newQueue = state.queue.filter((_, i) => i !== index);
      let newQueueIndex = state.queueIndex;

      if (index < state.queueIndex) {
        newQueueIndex = Math.max(0, newQueueIndex - 1);
      } else if (index === state.queueIndex && newQueue.length > 0) {
        // If removing current track, adjust index
        newQueueIndex = Math.min(newQueueIndex, newQueue.length - 1);
      }

      return {
        queue: newQueue,
        queueIndex: newQueueIndex,
      };
    });
  },

  toggleRepeat: () => {
    const {repeatMode} = get();
    const modes: Array<'off' | 'one' | 'all'> = ['off', 'all', 'one'];
    const currentIndex = modes.indexOf(repeatMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    set({repeatMode: nextMode});
  },

  toggleShuffle: () => {
    set(state => ({shuffleEnabled: !state.shuffleEnabled}));
  },

  reset: () => set(initialState),
}));
