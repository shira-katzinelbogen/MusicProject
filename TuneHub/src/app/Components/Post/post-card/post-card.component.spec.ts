import { ComponentFixture, TestBed } from '@angular/core/testing';

<<<<<<<< HEAD:TuneHub/src/app/Components/Post/post-card/post-card.component.spec.ts
import { PostCardComponent } from './post-card.component';

describe('PostCardComponent', () => {
  let component: PostCardComponent;
  let fixture: ComponentFixture<PostCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostCardComponent);
========
import { MusicCardComponent } from './music-card.component';

describe('MusicCardComponent', () => {
  let component: MusicCardComponent;
  let fixture: ComponentFixture<MusicCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MusicCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MusicCardComponent);
>>>>>>>> 7c405a8255491587b746aa9f8299bdcb26bacc59:TuneHub/src/app/Components/SheetMusic/music-card/music-card.component.spec.ts
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
