import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstrumentMarketComponent } from './instrument-market.component';

describe('InstrumentMarketComponent', () => {
  let component: InstrumentMarketComponent;
  let fixture: ComponentFixture<InstrumentMarketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstrumentMarketComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstrumentMarketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
