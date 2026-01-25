import { Component, AfterViewChecked, ElementRef, ViewChild, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ChatService } from '../../../Services/chat.service';
import { StorageService } from '../../../Services/storage.service';
import { MatIconModule } from '@angular/material/icon';
import { ChatBotService } from '../../../Services/chatBot.service';


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
    MatIconModule
  ],
  styleUrls: ['./chat-bot.component.css']
})

export class ChatBotComponent implements OnInit, AfterViewChecked {

  messages: Message[] = [];
  userInput: string = '';
  conversationId = crypto.randomUUID();
  isOpen: boolean = false;


  constructor(
    private chatService: ChatService,
    private storageService: StorageService,
    public chatBotService: ChatBotService
  ) { }

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
        error: (e) => {
          let errorText = '';

          if (e.status === 401) {
            errorText = '.Please log in to use the chat bot';
          } else {
            errorText = '.Error sending message. Check the server';
          }

          this.addMessage({
            text: errorText,
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
    } catch { }
  }
}
