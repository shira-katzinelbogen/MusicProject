import { Component, AfterViewChecked, ElementRef, ViewChild, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';
import { ChatService } from '../../../Services/chat.service';
import { StorageService } from '../../../Services/storage.service';

interface Message {
  text: string;
  sender: 'user' | 'bot';
  avatar: string;  
}

@Component({
  selector: 'app-chat-bot',
  standalone: true, 
  templateUrl: './chat-bot.component.html',
  imports: [
    CommonModule, 
    FormsModule,
    HttpClientModule
  ],
  styleUrls: ['./chat-bot.component.css']
})
export class ChatBotComponent implements OnInit, AfterViewChecked {
  
  messages: Message[] = [];
  userInput: string = '';
  conversationId: string = '1234';
  isOpen: boolean = false;

  private chatService: ChatService;
  private storageService: StorageService;

  constructor(
    @Inject(ChatService) chatService: ChatService,
    @Inject(StorageService) storageService: StorageService
  ) {
    this.chatService = chatService;
    this.storageService = storageService;
  }

  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  ngOnInit() {
    const saved = this.storageService.getItem(this.conversationId);
    if (saved) {
      this.messages = JSON.parse(saved);
    }
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  sendMessage(event: Event) {
    event.preventDefault();
    const text = this.userInput.trim();
    if (!text) return;

    this.addMessage({
      text,
      sender: 'user',
      avatar: 'assets/images/544.jpg'
    });

    this.userInput = '';

    this.chatService.sendMessage(text, this.conversationId)
      .subscribe({
        next: (res: string) => {

          this.addMessage({
            text: res,
            sender: 'bot',
            avatar: 'assets/images/chat-ai.webp'
          });

        },
        error: () => {
          this.addMessage({
            text: 'שגיאה בשליחת ההודעה. בדוק את השרת.',
            sender: 'bot',
            avatar: 'assets/images/chat-ai.webp'
          });
        }
      });
  }

  private addMessage(msg: Message) {
    this.messages.push(msg);
    this.storageService.setItem(this.conversationId, JSON.stringify(this.messages));
  }

  private scrollToBottom() {
    try {
      this.messagesContainer.nativeElement.scrollTop =
        this.messagesContainer.nativeElement.scrollHeight;
    } catch {}
  }
}
