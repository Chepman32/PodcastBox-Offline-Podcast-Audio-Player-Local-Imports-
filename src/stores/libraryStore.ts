import {create} from 'zustand';
import {Track, SortOption, FilterOption} from '../types';
import {databaseService} from '../services/database';

interface LibraryState {
  tracks: Track[];
  isLoading: boolean;
  error: string | null;
  sortBy: SortOption;
  filterBy: FilterOption;
  searchQuery: string;

  // Actions
  loadTracks: () => Promise<void>;
  addTrack: (track: Track) => Promise<void>;
  updateTrack: (track: Track) => Promise<void>;
  deleteTrack: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  setSortBy: (sortBy: SortOption) => void;
  setFilterBy: (filterBy: FilterOption) => void;
  setSearchQuery: (query: string) => void;
  getFilteredTracks: () => Track[];
}

export const useLibraryStore = create<LibraryState>((set, get) => ({
  tracks: [],
  isLoading: false,
  error: null,
  sortBy: 'dateAdded',
  filterBy: 'all',
  searchQuery: '',

  loadTracks: async () => {
    set({isLoading: true, error: null});
    try {
      const tracks = await databaseService.getAllTracks();
      set({tracks, isLoading: false});
    } catch (error) {
      set({error: (error as Error).message, isLoading: false});
    }
  },

  addTrack: async (track: Track) => {
    try {
      await databaseService.insertTrack(track);
      set(state => ({tracks: [track, ...state.tracks]}));
    } catch (error) {
      set({error: (error as Error).message});
    }
  },

  updateTrack: async (track: Track) => {
    try {
      await databaseService.updateTrack(track);
      set(state => ({
        tracks: state.tracks.map(t => (t.id === track.id ? track : t)),
      }));
    } catch (error) {
      set({error: (error as Error).message});
    }
  },

  deleteTrack: async (id: string) => {
    try {
      await databaseService.deleteTrack(id);
      set(state => ({tracks: state.tracks.filter(t => t.id !== id)}));
    } catch (error) {
      set({error: (error as Error).message});
    }
  },

  toggleFavorite: async (id: string) => {
    const track = get().tracks.find(t => t.id === id);
    if (track) {
      const updatedTrack = {...track, isFavorite: !track.isFavorite};
      await get().updateTrack(updatedTrack);
    }
  },

  setSortBy: (sortBy: SortOption) => set({sortBy}),
  setFilterBy: (filterBy: FilterOption) => set({filterBy}),
  setSearchQuery: (searchQuery: string) => set({searchQuery}),

  getFilteredTracks: () => {
    const {tracks, sortBy, filterBy, searchQuery} = get();

    // Filter
    let filtered = tracks;

    if (filterBy === 'favorites') {
      filtered = filtered.filter(t => t.isFavorite);
    } else if (filterBy === 'unplayed') {
      filtered = filtered.filter(t => t.playCount === 0);
    } else if (filterBy === 'inProgress') {
      filtered = filtered.filter(t => t.playbackPosition > 0 && t.playbackPosition < t.duration);
    }

    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        t =>
          t.title.toLowerCase().includes(query) ||
          t.artist.toLowerCase().includes(query) ||
          t.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'artist':
          return a.artist.localeCompare(b.artist);
        case 'dateAdded':
          return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
        case 'lastPlayed':
          if (!a.lastPlayedAt) return 1;
          if (!b.lastPlayedAt) return -1;
          return new Date(b.lastPlayedAt).getTime() - new Date(a.lastPlayedAt).getTime();
        case 'duration':
          return b.duration - a.duration;
        case 'playCount':
          return b.playCount - a.playCount;
        default:
          return 0;
      }
    });

    return sorted;
  },
}));
