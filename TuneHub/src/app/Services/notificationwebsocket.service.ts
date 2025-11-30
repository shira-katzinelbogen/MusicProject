import { Injectable } from '@angular/core';

import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationWebsocketService {

  private stompClient: any;

  connect(onConnected: () => void) {
    // הנתיב תוקן מ-'/ws' ל-'/ws-notifications'
    const socket = new SockJS('http://localhost:8080/ws-notifications'); 
    
    this.stompClient = Stomp.over(socket);
    this.stompClient.connect({}, () => {
      onConnected();
    });
  }

  subscribe(destination: string, callback: (msg: any) => void) {
    this.stompClient.subscribe(destination, callback);
  }

  disconnect() {
    if (this.stompClient) {
      this.stompClient.disconnect();
    }
  }
}