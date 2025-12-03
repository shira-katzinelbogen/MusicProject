import { Injectable } from '@angular/core';

import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationWebsocketService {

  private stompClient: any;

  connect(onConnected: () => void) {
    const socket = new SockJS('http://localhost:8080/ws-notifications');
    this.stompClient = Stomp.over(socket);

    // קריאה ל-JWT מהקוקי
    const jwt = this.getJwtFromCookie('securitySample');

    const headers: any = {};
    if (jwt) {
      headers['Authorization'] = `Bearer ${jwt}`;
    }

    this.stompClient.connect(headers, () => {
      onConnected();
    });
  }
  private getJwtFromCookie(name: string): string | null {
    const matches = document.cookie.match(new RegExp(
      '(?:^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)'
    ));
    return matches ? decodeURIComponent(matches[1]) : null;
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

