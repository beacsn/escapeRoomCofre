import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GameStateService {

  // ⏱️ TIEMPO
  timeLeft = signal(1800); // 30 min
  private intervalId: any;

  startTimer() {
    if (this.intervalId) return;

    this.intervalId = setInterval(() => {
      if (this.timeLeft() > 0) {
        this.timeLeft.update(t => t - 1);
      } else {
        clearInterval(this.intervalId);
      }
    }, 1000);
  }

  get minutes() {
    return Math.floor(this.timeLeft() / 60);
  }

  get seconds() {
    return this.timeLeft() % 60;
  }

  // 🔊 AUDIO
  audio = new Audio('tricky-fox-188090.mp3');
  audioEnabled = signal(false);

  toggleAudio(enabled: boolean) {
    this.audioEnabled.set(enabled);

    if (enabled) {
      this.audio.loop = true;
      this.audio.play().catch(() => {});
    } else {
      this.audio.pause();
    }
  }
}
