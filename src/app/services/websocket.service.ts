import { Injectable } from '@angular/core';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';
import { environment } from 'src/environment';
@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  public socket$: WebSocketSubject<any> | undefined;
  private wsUrl = environment.wsUrl;
  connect(roomId: number, jwt_token?: string): void {
    this.socket$ = webSocket(`${this.wsUrl}/${roomId}`);
    console.log('WebSocket connection establishing');
    this.socket$.subscribe({
      next: (message) => console.log('Received message:', message),
      error: (err) => console.error('WebSocket error:', err),
      complete: () => console.log('WebSocket connection closed'),
    });
  }

  sendTranscription(message: any): void {
    if (this.socket$) {
      this.socket$.next(message);
    } else {
      console.error('WebSocket connection is not established');
    }
  }

  closeConnection(): void {
    if (this.socket$) {
      this.socket$.complete();
    } else {
      console.error('WebSocket connection is not established');
    }
  }
}
