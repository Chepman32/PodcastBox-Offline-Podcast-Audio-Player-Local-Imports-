import {Platform} from 'react-native';
import PushNotification from 'react-native-push-notification';
import {Track} from '../types';

class NotificationService {
  private initialized: boolean = false;

  /**
   * Initialize notification service
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    PushNotification.configure({
      onNotification: function (notification) {
        console.log('Notification:', notification);
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: Platform.OS === 'ios',
    });

    this.initialized = true;
  }

  /**
   * Show playback notification
   */
  showPlaybackNotification(track: Track, isPlaying: boolean, position: number): void {
    const channelId = 'playback-channel';

    PushNotification.localNotification({
      channelId,
      id: 1,
      title: track.title,
      message: track.artist,
      playSound: false,
      vibrate: false,
      ongoing: isPlaying,
      priority: 'max',
      visibility: 'public',
      importance: 'high',
      allowWhileIdle: true,
      ignoreInForeground: false,
      largeIcon: track.albumArt || 'ic_launcher',
      smallIcon: 'ic_notification',
      actions: isPlaying
        ? ['pause', 'skip_backward', 'skip_forward']
        : ['play', 'skip_backward', 'skip_forward'],
    });
  }

  /**
   * Update playback notification
   */
  updatePlaybackNotification(track: Track, isPlaying: boolean, position: number): void {
    this.showPlaybackNotification(track, isPlaying, position);
  }

  /**
   * Clear playback notification
   */
  clearPlaybackNotification(): void {
    PushNotification.cancelLocalNotification({id: '1'});
  }

  /**
   * Schedule sleep timer notification
   */
  scheduleSleepTimer(minutes: number): void {
    const date = new Date(Date.now() + minutes * 60 * 1000);

    PushNotification.localNotificationSchedule({
      id: 2,
      title: 'Sleep Timer',
      message: 'Playback will stop soon',
      date,
      playSound: true,
      soundName: 'default',
    });
  }

  /**
   * Cancel sleep timer notification
   */
  cancelSleepTimer(): void {
    PushNotification.cancelLocalNotification({id: '2'});
  }

  /**
   * Show bookmark created notification
   */
  showBookmarkCreated(title: string): void {
    PushNotification.localNotification({
      id: 3,
      title: 'Bookmark Created',
      message: title,
      playSound: false,
      vibrate: true,
    });
  }

  /**
   * Create notification channel (Android only)
   */
  createChannel(): void {
    if (Platform.OS === 'android') {
      PushNotification.createChannel(
        {
          channelId: 'playback-channel',
          channelName: 'Playback Controls',
          channelDescription: 'Media playback controls',
          playSound: false,
          soundName: 'default',
          importance: 4,
          vibrate: false,
        },
        (created) => console.log(`Channel created: ${created}`)
      );
    }
  }
}

export const notificationService = new NotificationService();
