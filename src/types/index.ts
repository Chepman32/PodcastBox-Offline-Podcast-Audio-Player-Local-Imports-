export interface Track {
  id: string;
  title: string;
  artist: string;
  albumArt?: string;
  duration: number; // in seconds
  filePath: string;
  fileSize: number; // in bytes
  mimeType: string;
  chapters: Chapter[];
  waveformData?: number[];
  addedAt: string; // ISO date string
  lastPlayedAt?: string; // ISO date string
  playbackPosition: number; // in seconds
  playCount: number;
  isFavorite: boolean;
  tags: string[];
  metadata?: TrackMetadata;
}

export interface Chapter {
  id: string;
  trackId: string;
  title: string;
  startTime: number; // in seconds
  endTime: number; // in seconds
  imageUrl?: string;
}

export interface TrackMetadata {
  genre?: string;
  year?: number;
  album?: string;
  trackNumber?: number;
  composer?: string;
  description?: string;
  language?: string;
  publisher?: string;
}

export interface Bookmark {
  id: string;
  trackId: string;
  position: number; // in seconds
  title: string;
  note?: string;
  createdAt: string; // ISO date string
  color?: string; // hex color for visual marker
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  trackIds: string[];
  coverImage?: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  isSystemPlaylist: boolean; // for favorites, recently played, etc.
  sortOrder: 'manual' | 'dateAdded' | 'title' | 'artist' | 'duration';
}

export interface AppSettings {
  id: string;
  theme: 'light' | 'dark' | 'auto';
  playbackSpeed: number; // 0.5 to 2.0
  smartSpeedEnabled: boolean; // Pro feature
  skipSilence: boolean;
  forwardSkipSeconds: number; // typically 15 or 30
  backwardSkipSeconds: number; // typically 15 or 30
  autoplay: boolean;
  sleepTimerMinutes?: number;
  volumeBoost: number; // 0 to 1
  showWaveform: boolean;
  hapticFeedback: boolean;
  lockScreenControls: boolean;
  downloadQuality: 'high' | 'medium' | 'low';
  storageLimit?: number; // in GB
  isPro: boolean;
}

export interface PlaybackState {
  currentTrack?: Track;
  isPlaying: boolean;
  position: number;
  duration: number;
  speed: number;
  volume: number;
  queue: Track[];
  queueIndex: number;
  repeatMode: 'off' | 'one' | 'all';
  shuffleEnabled: boolean;
}

export interface WaveformData {
  trackId: string;
  samples: number[];
  sampleRate: number;
  peaks: number[];
  generatedAt: string;
}

export interface ImportProgress {
  total: number;
  current: number;
  currentFile: string;
  status: 'scanning' | 'importing' | 'processing' | 'complete' | 'error';
  error?: string;
}

export type SortOption = 'title' | 'artist' | 'dateAdded' | 'lastPlayed' | 'duration' | 'playCount';
export type FilterOption = 'all' | 'favorites' | 'unplayed' | 'inProgress';
