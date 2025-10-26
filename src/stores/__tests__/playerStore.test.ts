import {usePlayerStore} from '../playerStore';
import {Track} from '../../types';

// Mock track data
const mockTrack: Track = {
  id: 'track-1',
  title: 'Test Track',
  artist: 'Test Artist',
  duration: 180,
  filePath: '/test/path.mp3',
  fileSize: 5000000,
  mimeType: 'audio/mpeg',
  chapters: [],
  addedAt: '2025-01-01T00:00:00Z',
  playbackPosition: 0,
  playCount: 0,
  isFavorite: false,
  tags: [],
};

const mockTrack2: Track = {
  ...mockTrack,
  id: 'track-2',
  title: 'Test Track 2',
};

describe('PlayerStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    usePlayerStore.getState().reset();
  });

  describe('setCurrentTrack', () => {
    it('should set current track and duration', () => {
      const {setCurrentTrack} = usePlayerStore.getState();

      setCurrentTrack(mockTrack);

      const state = usePlayerStore.getState();
      expect(state.currentTrack).toEqual(mockTrack);
      expect(state.duration).toBe(mockTrack.duration);
      expect(state.position).toBe(0);
    });

    it('should restore playback position if track has one', () => {
      const trackWithPosition = {...mockTrack, playbackPosition: 60};
      const {setCurrentTrack} = usePlayerStore.getState();

      setCurrentTrack(trackWithPosition);

      const state = usePlayerStore.getState();
      expect(state.position).toBe(60);
    });
  });

  describe('play/pause', () => {
    it('should toggle playback state', () => {
      const {play, pause} = usePlayerStore.getState();

      play();
      expect(usePlayerStore.getState().isPlaying).toBe(true);

      pause();
      expect(usePlayerStore.getState().isPlaying).toBe(false);
    });

    it('togglePlayPause should toggle isPlaying', () => {
      const {togglePlayPause} = usePlayerStore.getState();

      togglePlayPause();
      expect(usePlayerStore.getState().isPlaying).toBe(true);

      togglePlayPause();
      expect(usePlayerStore.getState().isPlaying).toBe(false);
    });
  });

  describe('seekTo', () => {
    it('should update position within duration bounds', () => {
      const {setCurrentTrack, seekTo} = usePlayerStore.getState();

      setCurrentTrack(mockTrack); // duration = 180

      seekTo(90);
      expect(usePlayerStore.getState().position).toBe(90);

      seekTo(200); // Should clamp to duration
      expect(usePlayerStore.getState().position).toBe(180);

      seekTo(-10); // Should clamp to 0
      expect(usePlayerStore.getState().position).toBe(0);
    });
  });

  describe('setSpeed', () => {
    it('should set playback speed within valid range', () => {
      const {setSpeed} = usePlayerStore.getState();

      setSpeed(1.5);
      expect(usePlayerStore.getState().speed).toBe(1.5);

      setSpeed(0.25); // Below minimum, should clamp to 0.5
      expect(usePlayerStore.getState().speed).toBe(0.5);

      setSpeed(3.0); // Above maximum, should clamp to 2.0
      expect(usePlayerStore.getState().speed).toBe(2.0);
    });
  });

  describe('queue management', () => {
    it('should set queue and start from specified index', () => {
      const {setQueue} = usePlayerStore.getState();
      const tracks = [mockTrack, mockTrack2];

      setQueue(tracks, 1);

      const state = usePlayerStore.getState();
      expect(state.queue).toEqual(tracks);
      expect(state.queueIndex).toBe(1);
      expect(state.currentTrack).toEqual(mockTrack2);
    });

    it('should add track to queue', () => {
      const {setQueue, addToQueue} = usePlayerStore.getState();

      setQueue([mockTrack]);
      addToQueue(mockTrack2);

      const state = usePlayerStore.getState();
      expect(state.queue.length).toBe(2);
      expect(state.queue[1]).toEqual(mockTrack2);
    });

    it('should remove track from queue', () => {
      const {setQueue, removeFromQueue} = usePlayerStore.getState();

      setQueue([mockTrack, mockTrack2]);
      removeFromQueue(0);

      const state = usePlayerStore.getState();
      expect(state.queue.length).toBe(1);
      expect(state.queue[0]).toEqual(mockTrack2);
    });
  });

  describe('nextTrack', () => {
    it('should advance to next track in queue', () => {
      const {setQueue, nextTrack} = usePlayerStore.getState();

      setQueue([mockTrack, mockTrack2], 0);
      nextTrack();

      const state = usePlayerStore.getState();
      expect(state.queueIndex).toBe(1);
      expect(state.currentTrack).toEqual(mockTrack2);
      expect(state.position).toBe(0);
    });

    it('should loop when reaching end with repeat mode all', () => {
      const {setQueue, nextTrack} = usePlayerStore.getState();

      setQueue([mockTrack, mockTrack2], 1);
      usePlayerStore.setState({repeatMode: 'all'});

      nextTrack();

      const state = usePlayerStore.getState();
      expect(state.queueIndex).toBe(0);
      expect(state.currentTrack).toEqual(mockTrack);
    });

    it('should restart current track with repeat mode one', () => {
      const {setCurrentTrack, nextTrack, seekTo} = usePlayerStore.getState();

      setCurrentTrack(mockTrack);
      seekTo(90);
      usePlayerStore.setState({repeatMode: 'one'});

      nextTrack();

      const state = usePlayerStore.getState();
      expect(state.position).toBe(0);
      expect(state.currentTrack).toEqual(mockTrack);
    });
  });

  describe('toggleRepeat', () => {
    it('should cycle through repeat modes', () => {
      const {toggleRepeat} = usePlayerStore.getState();

      expect(usePlayerStore.getState().repeatMode).toBe('off');

      toggleRepeat();
      expect(usePlayerStore.getState().repeatMode).toBe('all');

      toggleRepeat();
      expect(usePlayerStore.getState().repeatMode).toBe('one');

      toggleRepeat();
      expect(usePlayerStore.getState().repeatMode).toBe('off');
    });
  });

  describe('skip forward/backward', () => {
    it('should skip forward by specified seconds', () => {
      const {setCurrentTrack, skipForward} = usePlayerStore.getState();

      setCurrentTrack(mockTrack);
      skipForward(30);

      expect(usePlayerStore.getState().position).toBe(30);
    });

    it('should skip backward by specified seconds', () => {
      const {setCurrentTrack, seekTo, skipBackward} = usePlayerStore.getState();

      setCurrentTrack(mockTrack);
      seekTo(60);
      skipBackward(15);

      expect(usePlayerStore.getState().position).toBe(45);
    });

    it('should not skip past duration or below 0', () => {
      const {setCurrentTrack, skipForward, skipBackward} = usePlayerStore.getState();

      setCurrentTrack(mockTrack); // duration = 180

      skipForward(200); // Should clamp to duration
      expect(usePlayerStore.getState().position).toBe(180);

      skipBackward(200); // Should clamp to 0
      expect(usePlayerStore.getState().position).toBe(0);
    });
  });
});
