import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadSheetMusicComponent } from './upload-sheet-music.component';

describe('UploadSheetMusicComponent', () => {
  let component: UploadSheetMusicComponent;
  let fixture: ComponentFixture<UploadSheetMusicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadSheetMusicComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadSheetMusicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
