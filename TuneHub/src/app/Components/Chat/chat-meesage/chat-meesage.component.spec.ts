import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatMeesageComponent } from './chat-meesage.component';

describe('ChatMeesageComponent', () => {
  let component: ChatMeesageComponent;
  let fixture: ComponentFixture<ChatMeesageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatMeesageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatMeesageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
