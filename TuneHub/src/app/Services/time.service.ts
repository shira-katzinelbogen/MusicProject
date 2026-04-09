import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TimeService {
  public currentTime = signal(Date.now());

  constructor() {
    setInterval(() => {
      this.currentTime.set(Date.now());
    }, 60000);
  }
}