import RNFS from 'react-native-fs';
import {Track, Chapter} from '../types';
import {databaseService} from './database';

interface AudioMetadata {
  title: string;
  artist: string;
  album?: string;
  albumArt?: string;
  duration: number;
  chapters?: Chapter[];
}

class FileImportService {
  /**
   * Import an audio file from device storage
   */
  async importFile(filePath: string): Promise<Track> {
    try {
      // Check if file exists
      const fileExists = await RNFS.exists(filePath);
      if (!fileExists) {
        throw new Error('File not found');
      }

      // Get file info
      const fileInfo = await RNFS.stat(filePath);
      const fileName = filePath.split('/').pop() || 'Unknown';

      // Extract metadata
      const metadata = await this.extractMetadata(filePath);

      // Generate unique ID
      const trackId = `track_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Create track object
      const track: Track = {
        id: trackId,
        title: metadata.title || fileName.replace(/\.[^/.]+$/, ''),
        artist: metadata.artist || 'Unknown Artist',
        albumArt: metadata.albumArt,
        duration: metadata.duration,
        filePath: filePath,
        fileSize: parseInt(fileInfo.size),
        mimeType: this.getMimeType(filePath),
        chapters: metadata.chapters || [],
        addedAt: new Date().toISOString(),
        playbackPosition: 0,
        playCount: 0,
        isFavorite: false,
        tags: [],
        metadata: {
          album: metadata.album,
        },
      };

      // Save to database
      await databaseService.insertTrack(track);

      // Generate waveform in background
      this.generateWaveform(track.id, filePath);

      return track;
    } catch (error) {
      console.error('Import file error:', error);
      throw error;
    }
  }

  /**
   * Import multiple files
   */
  async importMultipleFiles(filePaths: string[]): Promise<{
    successful: Track[];
    failed: Array<{path: string; error: string}>;
  }> {
    const successful: Track[] = [];
    const failed: Array<{path: string; error: string}> = [];

    for (const filePath of filePaths) {
      try {
        const track = await this.importFile(filePath);
        successful.push(track);
      } catch (error) {
        failed.push({
          path: filePath,
          error: (error as Error).message,
        });
      }
    }

    return {successful, failed};
  }

  /**
   * Extract metadata from audio file
   * This is a simplified version - in production, use a library like react-native-audio-metadata
   */
  private async extractMetadata(filePath: string): Promise<AudioMetadata> {
    // TODO: Implement actual metadata extraction using a library
    // For now, return basic metadata
    const fileName = filePath.split('/').pop() || 'Unknown';

    return {
      title: fileName.replace(/\.[^/.]+$/, ''),
      artist: 'Unknown Artist',
      duration: 0, // Will be updated when audio loads
      chapters: [],
    };
  }

  /**
   * Extract chapters from audio file metadata
   */
  async extractChapters(filePath: string, trackId: string): Promise<Chapter[]> {
    // TODO: Implement chapter extraction from MP3/M4A metadata
    // This would parse ID3 chapters or M4A chapter atoms
    return [];
  }

  /**
   * Generate waveform data for visualization
   */
  private async generateWaveform(trackId: string, filePath: string): Promise<void> {
    try {
      // TODO: Implement actual waveform generation
      // This would:
      // 1. Load audio file
      // 2. Extract PCM data
      // 3. Downsample to reasonable number of points (e.g., 200-500)
      // 4. Calculate peak values
      // 5. Store in database

      // For now, generate mock waveform data
      const samples = Array.from({length: 200}, () => Math.random());
      const peaks = samples.filter((_, i) => i % 10 === 0);

      // This would normally be saved to database via databaseService
      console.log(`Generated waveform for track ${trackId}`);
    } catch (error) {
      console.error('Waveform generation error:', error);
    }
  }

  /**
   * Get MIME type from file extension
   */
  private getMimeType(filePath: string): string {
    const extension = filePath.split('.').pop()?.toLowerCase();

    const mimeTypes: Record<string, string> = {
      mp3: 'audio/mpeg',
      m4a: 'audio/mp4',
      m4b: 'audio/mp4',
      mp4: 'audio/mp4',
      aac: 'audio/aac',
      wav: 'audio/wav',
      ogg: 'audio/ogg',
      opus: 'audio/opus',
      flac: 'audio/flac',
    };

    return mimeTypes[extension || ''] || 'audio/mpeg';
  }

  /**
   * Scan a directory for audio files
   */
  async scanDirectory(directoryPath: string): Promise<string[]> {
    try {
      const files = await RNFS.readDir(directoryPath);
      const audioExtensions = ['.mp3', '.m4a', '.m4b', '.mp4', '.aac', '.wav', '.ogg', '.opus', '.flac'];

      return files
        .filter(file => {
          const ext = file.name.toLowerCase();
          return audioExtensions.some(audioExt => ext.endsWith(audioExt));
        })
        .map(file => file.path);
    } catch (error) {
      console.error('Scan directory error:', error);
      return [];
    }
  }

  /**
   * Get common audio directories
   */
  getCommonAudioDirectories(): string[] {
    return [
      `${RNFS.DocumentDirectoryPath}/Audio`,
      `${RNFS.DownloadDirectoryPath}`,
      `${RNFS.ExternalStorageDirectoryPath}/Music`,
      `${RNFS.ExternalStorageDirectoryPath}/Podcasts`,
      `${RNFS.ExternalStorageDirectoryPath}/Download`,
    ];
  }
}

export const fileImportService = new FileImportService();
