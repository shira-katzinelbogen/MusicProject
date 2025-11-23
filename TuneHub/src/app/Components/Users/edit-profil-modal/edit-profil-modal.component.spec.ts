import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProfilModalComponent } from './edit-profil-modal.component';

describe('EditProfilModalComponent', () => {
  let component: EditProfilModalComponent;
  let fixture: ComponentFixture<EditProfilModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditProfilModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditProfilModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
