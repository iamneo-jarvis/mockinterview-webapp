import { Injectable } from '@angular/core';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  public socket$: WebSocketSubject<any> | undefined;

  connect(roomId: string): void {
    this.socket$ = webSocket(`ws://172.28.87.198:8080/ws/${roomId}`);

    this.socket$.subscribe({
      next: (message) => console.log('Received message:', message),
      error: (err) => console.error('WebSocket error:', err),
      complete: () => console.log('WebSocket connection closed'),
    });
  }

  sendMessage(message: any): void {
    if (this.socket$) {
      this.socket$.next(message);
    } else {
      console.error('WebSocket connection is not established');
    }
  }

  close(): void {
    if (this.socket$) {
      this.socket$.complete();
    } else {
      console.error('WebSocket connection is not established');
    }
  }
}
