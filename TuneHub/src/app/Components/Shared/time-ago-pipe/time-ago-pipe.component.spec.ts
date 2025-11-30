import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeAgoPipeComponent } from './time-ago-pipe.component';

describe('TimeAgoPipeComponent', () => {
  let component: TimeAgoPipeComponent;
  let fixture: ComponentFixture<TimeAgoPipeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimeAgoPipeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimeAgoPipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
