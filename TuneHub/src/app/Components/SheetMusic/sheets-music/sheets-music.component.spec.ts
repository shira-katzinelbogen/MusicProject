import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SheetsMusicComponent } from './sheets-music.component';

describe('SheetsMusicComponent', () => {
  let component: SheetsMusicComponent;
  let fixture: ComponentFixture<SheetsMusicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SheetsMusicComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SheetsMusicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
