import {create} from 'zustand';
import {Bookmark} from '../types';
import {databaseService} from '../services/database';

interface BookmarkState {
  bookmarks: Bookmark[];
  isLoading: boolean;
  error: string | null;

  // Actions
  loadBookmarks: () => Promise<void>;
  addBookmark: (bookmark: Bookmark) => Promise<void>;
  deleteBookmark: (id: string) => Promise<void>;
  getBookmarksByTrackId: (trackId: string) => Bookmark[];
}

export const useBookmarkStore = create<BookmarkState>((set, get) => ({
  bookmarks: [],
  isLoading: false,
  error: null,

  loadBookmarks: async () => {
    set({isLoading: true, error: null});
    try {
      const bookmarks = await databaseService.getAllBookmarks();
      set({bookmarks, isLoading: false});
    } catch (error) {
      set({error: (error as Error).message, isLoading: false});
    }
  },

  addBookmark: async (bookmark: Bookmark) => {
    try {
      await databaseService.insertBookmark(bookmark);
      set(state => ({bookmarks: [bookmark, ...state.bookmarks]}));
    } catch (error) {
      set({error: (error as Error).message});
    }
  },

  deleteBookmark: async (id: string) => {
    try {
      await databaseService.deleteBookmark(id);
      set(state => ({bookmarks: state.bookmarks.filter(b => b.id !== id)}));
    } catch (error) {
      set({error: (error as Error).message});
    }
  },

  getBookmarksByTrackId: (trackId: string) => {
    return get().bookmarks.filter(b => b.trackId === trackId);
  },
}));
