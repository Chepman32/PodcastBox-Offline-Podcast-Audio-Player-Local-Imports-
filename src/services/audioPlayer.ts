import TrackPlayer, {
  Capability,
  Event,
  RepeatMode,
  State,
} from 'react-native-track-player';
import {Track} from '../types';

class AudioPlayerService {
  private initialized: boolean = false;

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      await TrackPlayer.setupPlayer({
        autoUpdateMetadata: true,
        autoHandleInterruptions: true,
      });

      await TrackPlayer.updateOptions({
        capabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
          Capability.SeekTo,
          Capability.Stop,
          Capability.JumpForward,
          Capability.JumpBackward,
        ],
        compactCapabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
        ],
        notificationCapabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
        ],
        forwardJumpInterval: 30,
        backwardJumpInterval: 15,
      });

      this.initialized = true;
      console.log('Audio player initialized');
    } catch (error) {
      console.error('Audio player initialization error:', error);
      throw error;
    }
  }

  async loadTrack(track: Track): Promise<void> {
    try {
      await TrackPlayer.reset();
      await TrackPlayer.add({
        id: track.id,
        url: track.filePath,
        title: track.title,
        artist: track.artist,
        artwork: track.albumArt,
        duration: track.duration,
      });
    } catch (error) {
      console.error('Load track error:', error);
      throw error;
    }
  }

  async loadQueue(tracks: Track[], startIndex: number = 0): Promise<void> {
    try {
      await TrackPlayer.reset();

      const trackList = tracks.map(track => ({
        id: track.id,
        url: track.filePath,
        title: track.title,
        artist: track.artist,
        artwork: track.albumArt,
        duration: track.duration,
      }));

      await TrackPlayer.add(trackList);
      await TrackPlayer.skip(startIndex);
    } catch (error) {
      console.error('Load queue error:', error);
      throw error;
    }
  }

  async play(): Promise<void> {
    try {
      await TrackPlayer.play();
    } catch (error) {
      console.error('Play error:', error);
    }
  }

  async pause(): Promise<void> {
    try {
      await TrackPlayer.pause();
    } catch (error) {
      console.error('Pause error:', error);
    }
  }

  async stop(): Promise<void> {
    try {
      await TrackPlayer.stop();
    } catch (error) {
      console.error('Stop error:', error);
    }
  }

  async seekTo(position: number): Promise<void> {
    try {
      await TrackPlayer.seekTo(position);
    } catch (error) {
      console.error('Seek error:', error);
    }
  }

  async skipToNext(): Promise<void> {
    try {
      await TrackPlayer.skipToNext();
    } catch (error) {
      console.error('Skip to next error:', error);
    }
  }

  async skipToPrevious(): Promise<void> {
    try {
      await TrackPlayer.skipToPrevious();
    } catch (error) {
      console.error('Skip to previous error:', error);
    }
  }

  async setRate(rate: number): Promise<void> {
    try {
      await TrackPlayer.setRate(rate);
    } catch (error) {
      console.error('Set rate error:', error);
    }
  }

  async setVolume(volume: number): Promise<void> {
    try {
      await TrackPlayer.setVolume(volume);
    } catch (error) {
      console.error('Set volume error:', error);
    }
  }

  async getPosition(): Promise<number> {
    try {
      return await TrackPlayer.getPosition();
    } catch (error) {
      console.error('Get position error:', error);
      return 0;
    }
  }

  async getDuration(): Promise<number> {
    try {
      return await TrackPlayer.getDuration();
    } catch (error) {
      console.error('Get duration error:', error);
      return 0;
    }
  }

  async getState(): Promise<State> {
    try {
      return await TrackPlayer.getState();
    } catch (error) {
      console.error('Get state error:', error);
      return State.None;
    }
  }

  async setRepeatMode(mode: 'off' | 'track' | 'queue'): Promise<void> {
    try {
      const repeatMode =
        mode === 'track'
          ? RepeatMode.Track
          : mode === 'queue'
          ? RepeatMode.Queue
          : RepeatMode.Off;

      await TrackPlayer.setRepeatMode(repeatMode);
    } catch (error) {
      console.error('Set repeat mode error:', error);
    }
  }

  async reset(): Promise<void> {
    try {
      await TrackPlayer.reset();
    } catch (error) {
      console.error('Reset error:', error);
    }
  }

  async destroy(): Promise<void> {
    try {
      await TrackPlayer.destroy();
      this.initialized = false;
    } catch (error) {
      console.error('Destroy error:', error);
    }
  }
}

export const audioPlayerService = new AudioPlayerService();
