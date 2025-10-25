import SQLite from 'react-native-sqlite-storage';
import {Track, Bookmark, Playlist, Chapter, AppSettings} from '../types';

SQLite.DEBUG(false);
SQLite.enablePromise(true);

const DATABASE_NAME = 'podcastbox.db';
const DATABASE_VERSION = '1.0';
const DATABASE_DISPLAY_NAME = 'PodcastBox Database';
const DATABASE_SIZE = 200000;

class DatabaseService {
  private db: SQLite.SQLiteDatabase | null = null;

  async init(): Promise<void> {
    try {
      this.db = await SQLite.openDatabase({
        name: DATABASE_NAME,
        location: 'default',
      });

      await this.createTables();
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Database initialization error:', error);
      throw error;
    }
  }

  private async createTables(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const queries = [
      // Tracks table
      `CREATE TABLE IF NOT EXISTS tracks (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        artist TEXT,
        albumArt TEXT,
        duration INTEGER NOT NULL,
        filePath TEXT NOT NULL,
        fileSize INTEGER NOT NULL,
        mimeType TEXT NOT NULL,
        addedAt TEXT NOT NULL,
        lastPlayedAt TEXT,
        playbackPosition INTEGER DEFAULT 0,
        playCount INTEGER DEFAULT 0,
        isFavorite INTEGER DEFAULT 0,
        tags TEXT,
        metadata TEXT
      )`,

      // Chapters table
      `CREATE TABLE IF NOT EXISTS chapters (
        id TEXT PRIMARY KEY,
        trackId TEXT NOT NULL,
        title TEXT NOT NULL,
        startTime INTEGER NOT NULL,
        endTime INTEGER NOT NULL,
        imageUrl TEXT,
        FOREIGN KEY (trackId) REFERENCES tracks (id) ON DELETE CASCADE
      )`,

      // Bookmarks table
      `CREATE TABLE IF NOT EXISTS bookmarks (
        id TEXT PRIMARY KEY,
        trackId TEXT NOT NULL,
        position INTEGER NOT NULL,
        title TEXT NOT NULL,
        note TEXT,
        createdAt TEXT NOT NULL,
        color TEXT,
        FOREIGN KEY (trackId) REFERENCES tracks (id) ON DELETE CASCADE
      )`,

      // Playlists table
      `CREATE TABLE IF NOT EXISTS playlists (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        trackIds TEXT NOT NULL,
        coverImage TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        isSystemPlaylist INTEGER DEFAULT 0,
        sortOrder TEXT DEFAULT 'manual'
      )`,

      // Waveform cache table
      `CREATE TABLE IF NOT EXISTS waveforms (
        trackId TEXT PRIMARY KEY,
        samples TEXT NOT NULL,
        sampleRate INTEGER NOT NULL,
        peaks TEXT NOT NULL,
        generatedAt TEXT NOT NULL,
        FOREIGN KEY (trackId) REFERENCES tracks (id) ON DELETE CASCADE
      )`,

      // Settings table
      `CREATE TABLE IF NOT EXISTS settings (
        id TEXT PRIMARY KEY,
        theme TEXT DEFAULT 'auto',
        playbackSpeed REAL DEFAULT 1.0,
        smartSpeedEnabled INTEGER DEFAULT 0,
        skipSilence INTEGER DEFAULT 0,
        forwardSkipSeconds INTEGER DEFAULT 30,
        backwardSkipSeconds INTEGER DEFAULT 15,
        autoplay INTEGER DEFAULT 1,
        sleepTimerMinutes INTEGER,
        volumeBoost REAL DEFAULT 0,
        showWaveform INTEGER DEFAULT 1,
        hapticFeedback INTEGER DEFAULT 1,
        lockScreenControls INTEGER DEFAULT 1,
        downloadQuality TEXT DEFAULT 'high',
        storageLimit INTEGER,
        isPro INTEGER DEFAULT 0
      )`,

      // Indexes for better query performance
      'CREATE INDEX IF NOT EXISTS idx_tracks_title ON tracks(title)',
      'CREATE INDEX IF NOT EXISTS idx_tracks_artist ON tracks(artist)',
      'CREATE INDEX IF NOT EXISTS idx_tracks_addedAt ON tracks(addedAt)',
      'CREATE INDEX IF NOT EXISTS idx_bookmarks_trackId ON bookmarks(trackId)',
      'CREATE INDEX IF NOT EXISTS idx_chapters_trackId ON chapters(trackId)',
    ];

    for (const query of queries) {
      await this.db.executeSql(query);
    }

    // Insert default settings if not exists
    const [result] = await this.db.executeSql('SELECT COUNT(*) as count FROM settings');
    if (result.rows.item(0).count === 0) {
      await this.db.executeSql(
        `INSERT INTO settings (id) VALUES ('default')`
      );
    }
  }

  // Track operations
  async insertTrack(track: Track): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.executeSql(
      `INSERT INTO tracks (
        id, title, artist, albumArt, duration, filePath, fileSize, mimeType,
        addedAt, lastPlayedAt, playbackPosition, playCount, isFavorite, tags, metadata
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        track.id,
        track.title,
        track.artist,
        track.albumArt || null,
        track.duration,
        track.filePath,
        track.fileSize,
        track.mimeType,
        track.addedAt,
        track.lastPlayedAt || null,
        track.playbackPosition,
        track.playCount,
        track.isFavorite ? 1 : 0,
        JSON.stringify(track.tags),
        track.metadata ? JSON.stringify(track.metadata) : null,
      ]
    );

    // Insert chapters if any
    if (track.chapters && track.chapters.length > 0) {
      for (const chapter of track.chapters) {
        await this.insertChapter(chapter);
      }
    }
  }

  async getAllTracks(): Promise<Track[]> {
    if (!this.db) throw new Error('Database not initialized');

    const [results] = await this.db.executeSql('SELECT * FROM tracks ORDER BY addedAt DESC');
    const tracks: Track[] = [];

    for (let i = 0; i < results.rows.length; i++) {
      const row = results.rows.item(i);
      const chapters = await this.getChaptersByTrackId(row.id);

      tracks.push({
        id: row.id,
        title: row.title,
        artist: row.artist,
        albumArt: row.albumArt,
        duration: row.duration,
        filePath: row.filePath,
        fileSize: row.fileSize,
        mimeType: row.mimeType,
        chapters,
        addedAt: row.addedAt,
        lastPlayedAt: row.lastPlayedAt,
        playbackPosition: row.playbackPosition,
        playCount: row.playCount,
        isFavorite: row.isFavorite === 1,
        tags: row.tags ? JSON.parse(row.tags) : [],
        metadata: row.metadata ? JSON.parse(row.metadata) : undefined,
      });
    }

    return tracks;
  }

  async getTrackById(id: string): Promise<Track | null> {
    if (!this.db) throw new Error('Database not initialized');

    const [results] = await this.db.executeSql('SELECT * FROM tracks WHERE id = ?', [id]);

    if (results.rows.length === 0) return null;

    const row = results.rows.item(0);
    const chapters = await this.getChaptersByTrackId(row.id);

    return {
      id: row.id,
      title: row.title,
      artist: row.artist,
      albumArt: row.albumArt,
      duration: row.duration,
      filePath: row.filePath,
      fileSize: row.fileSize,
      mimeType: row.mimeType,
      chapters,
      addedAt: row.addedAt,
      lastPlayedAt: row.lastPlayedAt,
      playbackPosition: row.playbackPosition,
      playCount: row.playCount,
      isFavorite: row.isFavorite === 1,
      tags: row.tags ? JSON.parse(row.tags) : [],
      metadata: row.metadata ? JSON.parse(row.metadata) : undefined,
    };
  }

  async updateTrack(track: Track): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.executeSql(
      `UPDATE tracks SET
        title = ?, artist = ?, albumArt = ?, duration = ?, filePath = ?,
        fileSize = ?, mimeType = ?, lastPlayedAt = ?, playbackPosition = ?,
        playCount = ?, isFavorite = ?, tags = ?, metadata = ?
      WHERE id = ?`,
      [
        track.title,
        track.artist,
        track.albumArt || null,
        track.duration,
        track.filePath,
        track.fileSize,
        track.mimeType,
        track.lastPlayedAt || null,
        track.playbackPosition,
        track.playCount,
        track.isFavorite ? 1 : 0,
        JSON.stringify(track.tags),
        track.metadata ? JSON.stringify(track.metadata) : null,
        track.id,
      ]
    );
  }

  async deleteTrack(id: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.executeSql('DELETE FROM tracks WHERE id = ?', [id]);
  }

  // Chapter operations
  async insertChapter(chapter: Chapter): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.executeSql(
      'INSERT INTO chapters (id, trackId, title, startTime, endTime, imageUrl) VALUES (?, ?, ?, ?, ?, ?)',
      [chapter.id, chapter.trackId, chapter.title, chapter.startTime, chapter.endTime, chapter.imageUrl || null]
    );
  }

  async getChaptersByTrackId(trackId: string): Promise<Chapter[]> {
    if (!this.db) throw new Error('Database not initialized');

    const [results] = await this.db.executeSql(
      'SELECT * FROM chapters WHERE trackId = ? ORDER BY startTime ASC',
      [trackId]
    );

    const chapters: Chapter[] = [];
    for (let i = 0; i < results.rows.length; i++) {
      chapters.push(results.rows.item(i));
    }

    return chapters;
  }

  // Bookmark operations
  async insertBookmark(bookmark: Bookmark): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.executeSql(
      'INSERT INTO bookmarks (id, trackId, position, title, note, createdAt, color) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [bookmark.id, bookmark.trackId, bookmark.position, bookmark.title, bookmark.note || null, bookmark.createdAt, bookmark.color || null]
    );
  }

  async getAllBookmarks(): Promise<Bookmark[]> {
    if (!this.db) throw new Error('Database not initialized');

    const [results] = await this.db.executeSql('SELECT * FROM bookmarks ORDER BY createdAt DESC');
    const bookmarks: Bookmark[] = [];

    for (let i = 0; i < results.rows.length; i++) {
      bookmarks.push(results.rows.item(i));
    }

    return bookmarks;
  }

  async getBookmarksByTrackId(trackId: string): Promise<Bookmark[]> {
    if (!this.db) throw new Error('Database not initialized');

    const [results] = await this.db.executeSql(
      'SELECT * FROM bookmarks WHERE trackId = ? ORDER BY position ASC',
      [trackId]
    );

    const bookmarks: Bookmark[] = [];
    for (let i = 0; i < results.rows.length; i++) {
      bookmarks.push(results.rows.item(i));
    }

    return bookmarks;
  }

  async deleteBookmark(id: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.executeSql('DELETE FROM bookmarks WHERE id = ?', [id]);
  }

  // Playlist operations
  async insertPlaylist(playlist: Playlist): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.executeSql(
      `INSERT INTO playlists (id, name, description, trackIds, coverImage, createdAt, updatedAt, isSystemPlaylist, sortOrder)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        playlist.id,
        playlist.name,
        playlist.description || null,
        JSON.stringify(playlist.trackIds),
        playlist.coverImage || null,
        playlist.createdAt,
        playlist.updatedAt,
        playlist.isSystemPlaylist ? 1 : 0,
        playlist.sortOrder,
      ]
    );
  }

  async getAllPlaylists(): Promise<Playlist[]> {
    if (!this.db) throw new Error('Database not initialized');

    const [results] = await this.db.executeSql('SELECT * FROM playlists ORDER BY createdAt DESC');
    const playlists: Playlist[] = [];

    for (let i = 0; i < results.rows.length; i++) {
      const row = results.rows.item(i);
      playlists.push({
        ...row,
        trackIds: JSON.parse(row.trackIds),
        isSystemPlaylist: row.isSystemPlaylist === 1,
      });
    }

    return playlists;
  }

  async updatePlaylist(playlist: Playlist): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.executeSql(
      `UPDATE playlists SET name = ?, description = ?, trackIds = ?, coverImage = ?, updatedAt = ?, sortOrder = ?
       WHERE id = ?`,
      [
        playlist.name,
        playlist.description || null,
        JSON.stringify(playlist.trackIds),
        playlist.coverImage || null,
        playlist.updatedAt,
        playlist.sortOrder,
        playlist.id,
      ]
    );
  }

  async deletePlaylist(id: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.executeSql('DELETE FROM playlists WHERE id = ?', [id]);
  }

  // Settings operations
  async getSettings(): Promise<AppSettings> {
    if (!this.db) throw new Error('Database not initialized');

    const [results] = await this.db.executeSql('SELECT * FROM settings WHERE id = ?', ['default']);

    if (results.rows.length === 0) {
      throw new Error('Settings not found');
    }

    const row = results.rows.item(0);
    return {
      id: row.id,
      theme: row.theme,
      playbackSpeed: row.playbackSpeed,
      smartSpeedEnabled: row.smartSpeedEnabled === 1,
      skipSilence: row.skipSilence === 1,
      forwardSkipSeconds: row.forwardSkipSeconds,
      backwardSkipSeconds: row.backwardSkipSeconds,
      autoplay: row.autoplay === 1,
      sleepTimerMinutes: row.sleepTimerMinutes,
      volumeBoost: row.volumeBoost,
      showWaveform: row.showWaveform === 1,
      hapticFeedback: row.hapticFeedback === 1,
      lockScreenControls: row.lockScreenControls === 1,
      downloadQuality: row.downloadQuality,
      storageLimit: row.storageLimit,
      isPro: row.isPro === 1,
    };
  }

  async updateSettings(settings: Partial<AppSettings>): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const fields = Object.keys(settings)
      .filter(key => key !== 'id')
      .map(key => `${key} = ?`)
      .join(', ');

    const values = Object.entries(settings)
      .filter(([key]) => key !== 'id')
      .map(([_, value]) => {
        if (typeof value === 'boolean') return value ? 1 : 0;
        return value;
      });

    await this.db.executeSql(`UPDATE settings SET ${fields} WHERE id = 'default'`, values);
  }

  async close(): Promise<void> {
    if (this.db) {
      await this.db.close();
      this.db = null;
    }
  }
}

export const databaseService = new DatabaseService();
