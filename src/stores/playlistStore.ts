import {create} from 'zustand';
import {Playlist} from '../types';
import {databaseService} from '../services/database';

interface PlaylistState {
  playlists: Playlist[];
  isLoading: boolean;
  error: string | null;

  // Actions
  loadPlaylists: () => Promise<void>;
  createPlaylist: (playlist: Playlist) => Promise<void>;
  updatePlaylist: (playlist: Playlist) => Promise<void>;
  deletePlaylist: (id: string) => Promise<void>;
  addTrackToPlaylist: (playlistId: string, trackId: string) => Promise<void>;
  removeTrackFromPlaylist: (playlistId: string, trackId: string) => Promise<void>;
  reorderPlaylistTracks: (playlistId: string, trackIds: string[]) => Promise<void>;
}

export const usePlaylistStore = create<PlaylistState>((set, get) => ({
  playlists: [],
  isLoading: false,
  error: null,

  loadPlaylists: async () => {
    set({isLoading: true, error: null});
    try {
      const playlists = await databaseService.getAllPlaylists();
      set({playlists, isLoading: false});
    } catch (error) {
      set({error: (error as Error).message, isLoading: false});
    }
  },

  createPlaylist: async (playlist: Playlist) => {
    try {
      await databaseService.insertPlaylist(playlist);
      set(state => ({playlists: [...state.playlists, playlist]}));
    } catch (error) {
      set({error: (error as Error).message});
    }
  },

  updatePlaylist: async (playlist: Playlist) => {
    try {
      await databaseService.updatePlaylist(playlist);
      set(state => ({
        playlists: state.playlists.map(p => (p.id === playlist.id ? playlist : p)),
      }));
    } catch (error) {
      set({error: (error as Error).message});
    }
  },

  deletePlaylist: async (id: string) => {
    try {
      await databaseService.deletePlaylist(id);
      set(state => ({playlists: state.playlists.filter(p => p.id !== id)}));
    } catch (error) {
      set({error: (error as Error).message});
    }
  },

  addTrackToPlaylist: async (playlistId: string, trackId: string) => {
    const playlist = get().playlists.find(p => p.id === playlistId);
    if (playlist && !playlist.trackIds.includes(trackId)) {
      const updatedPlaylist = {
        ...playlist,
        trackIds: [...playlist.trackIds, trackId],
        updatedAt: new Date().toISOString(),
      };
      await get().updatePlaylist(updatedPlaylist);
    }
  },

  removeTrackFromPlaylist: async (playlistId: string, trackId: string) => {
    const playlist = get().playlists.find(p => p.id === playlistId);
    if (playlist) {
      const updatedPlaylist = {
        ...playlist,
        trackIds: playlist.trackIds.filter(id => id !== trackId),
        updatedAt: new Date().toISOString(),
      };
      await get().updatePlaylist(updatedPlaylist);
    }
  },

  reorderPlaylistTracks: async (playlistId: string, trackIds: string[]) => {
    const playlist = get().playlists.find(p => p.id === playlistId);
    if (playlist) {
      const updatedPlaylist = {
        ...playlist,
        trackIds,
        updatedAt: new Date().toISOString(),
      };
      await get().updatePlaylist(updatedPlaylist);
    }
  },
}));
