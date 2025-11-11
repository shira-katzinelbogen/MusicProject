import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileMiniAvatarComponent } from './profile-mini-avatar.component';

describe('ProfileMiniAvatarComponent', () => {
  let component: ProfileMiniAvatarComponent;
  let fixture: ComponentFixture<ProfileMiniAvatarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileMiniAvatarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileMiniAvatarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
