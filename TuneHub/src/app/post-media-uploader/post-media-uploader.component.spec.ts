import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostMediaUploaderComponent } from './post-media-uploader.component';

describe('PostMediaUploaderComponent', () => {
  let component: PostMediaUploaderComponent;
  let fixture: ComponentFixture<PostMediaUploaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostMediaUploaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostMediaUploaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
