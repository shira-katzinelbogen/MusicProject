import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonBookingComponent } from './lesson-booking.component';

describe('LessonBookingComponent', () => {
  let component: LessonBookingComponent;
  let fixture: ComponentFixture<LessonBookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LessonBookingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LessonBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
