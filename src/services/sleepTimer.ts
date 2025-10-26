import {usePlayerStore} from '../stores/playerStore';
import {notificationService} from './notifications';

class SleepTimerService {
  private timer: NodeJS.Timeout | null = null;
  private remainingTime: number = 0;
  private isPaused: boolean = false;
  private callback: (() => void) | null = null;

  /**
   * Start sleep timer
   * @param minutes Duration in minutes
   * @param onComplete Callback when timer completes
   */
  start(minutes: number, onComplete?: () => void): void {
    this.stop(); // Clear any existing timer

    this.remainingTime = minutes * 60 * 1000; // Convert to milliseconds
    this.callback = onComplete || null;

    // Schedule notification 1 minute before
    if (minutes > 1) {
      notificationService.scheduleSleepTimer(minutes - 1);
    }

    this.timer = setInterval(() => {
      if (!this.isPaused) {
        this.remainingTime -= 1000;

        if (this.remainingTime <= 0) {
          this.complete();
        }
      }
    }, 1000);
  }

  /**
   * Stop and clear timer
   */
  stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.remainingTime = 0;
    this.isPaused = false;
    this.callback = null;
    notificationService.cancelSleepTimer();
  }

  /**
   * Pause timer
   */
  pause(): void {
    this.isPaused = true;
  }

  /**
   * Resume timer
   */
  resume(): void {
    this.isPaused = false;
  }

  /**
   * Get remaining time in seconds
   */
  getRemainingTime(): number {
    return Math.floor(this.remainingTime / 1000);
  }

  /**
   * Get remaining time formatted as MM:SS
   */
  getRemainingTimeFormatted(): string {
    const totalSeconds = this.getRemainingTime();
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  /**
   * Check if timer is active
   */
  isActive(): boolean {
    return this.timer !== null;
  }

  /**
   * Complete timer - stop playback
   */
  private complete(): void {
    // Stop playback
    const playerStore = usePlayerStore.getState();
    playerStore.pause();

    // Execute callback if provided
    if (this.callback) {
      this.callback();
    }

    // Clean up
    this.stop();

    console.log('Sleep timer completed - playback stopped');
  }

  /**
   * Add time to existing timer
   * @param minutes Minutes to add
   */
  addTime(minutes: number): void {
    if (this.isActive()) {
      this.remainingTime += minutes * 60 * 1000;
    }
  }

  /**
   * Preset durations in minutes
   */
  static PRESETS = {
    FIVE_MIN: 5,
    FIFTEEN_MIN: 15,
    THIRTY_MIN: 30,
    FORTY_FIVE_MIN: 45,
    ONE_HOUR: 60,
    TWO_HOURS: 120,
    END_OF_TRACK: -1, // Special value for "end of current track"
    END_OF_CHAPTER: -2, // Special value for "end of current chapter"
  };
}

export const sleepTimerService = new SleepTimerService();
