import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ShortNumberPipe } from "../../../Pipes/short-number.pipe";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stats-counter',  
  templateUrl: './stats-counter.component.html',
  styleUrl: './stats-counter.component.css',
  imports: [ShortNumberPipe, CommonModule]
})

export class StatsCounterComponent implements OnChanges {
  @Input() number: number = 0;
  @Input() label: string = '';
  @Input() glowClass: string = '';

  displayedNumber: number = 0;
  duration: number = 1000;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['number']) {
      this.animateNumber();
    }
  }

  animateNumber() {
    const start = 0;
    const end = this.number || start;
    const duration = this.duration;
    const startTime = performance.now();

    const step = (currentTime: number) => {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      this.displayedNumber = Math.floor(end * progress);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        this.displayedNumber = end;
      }
    };

    requestAnimationFrame(step);
  }
}
