import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { Message, TypingIndicator, MessageNotification } from './models';
import { WS_BASE_URL } from '../api.config';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 3000;
  private authFailed = false;

  private messageSubject = new Subject<Message>();
  private typingSubject = new Subject<TypingIndicator>();
  private notificationSubject = new Subject<MessageNotification>();
  private connectionSubject = new BehaviorSubject<boolean>(false);

  public message$ = this.messageSubject.asObservable();
  public typing$ = this.typingSubject.asObservable();
  public notification$ = this.notificationSubject.asObservable();
  public connected$ = this.connectionSubject.asObservable();

  connect(token: string): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      return;
    }

    this.authFailed = false;

    try {
      this.socket = new WebSocket(`${WS_BASE_URL}/ws`);

      this.socket.onopen = () => {
        this.reconnectAttempts = 0;
        this.socket!.send(JSON.stringify({ type: 'AUTH', token }));
      };

      this.socket.onmessage = (event) => {
        this.handleMessage(event.data);
      };

      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.connectionSubject.next(false);
      };

      this.socket.onclose = () => {
        this.connectionSubject.next(false);
        if (!this.authFailed) {
          this.attemptReconnect(token);
        }
      };
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      this.connectionSubject.next(false);
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
      this.connectionSubject.next(false);
    }
  }

  send(message: Record<string, unknown>): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not connected');
    }
  }

  sendTypingIndicator(conversationId: string, isTyping: boolean): void {
    this.send({ type: 'TYPING', conversationId, isTyping });
  }

  markAsRead(conversationId: string): void {
    this.send({ type: 'MARK_READ', conversationId });
  }

  isConnected(): boolean {
    return this.socket !== null && this.socket.readyState === WebSocket.OPEN;
  }

  private handleMessage(data: string): void {
    try {
      const payload = JSON.parse(data);

      switch (payload.type) {
        case 'AUTH_OK':
          this.connectionSubject.next(true);
          break;
        case 'AUTH_ERROR':
          console.error('WebSocket auth failed:', payload.message);
          this.authFailed = true;
          this.socket?.close();
          break;
        case 'MESSAGE':
          this.messageSubject.next(payload.message);
          break;
        case 'TYPING':
          this.typingSubject.next(payload.typing);
          break;
        case 'NOTIFICATION':
          this.notificationSubject.next(payload.notification);
          break;
        case 'READ_RECEIPT':
          break;
        default:
          console.log('Unknown message type:', payload.type);
      }
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  }

  private attemptReconnect(token: string): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      setTimeout(() => this.connect(token), this.reconnectInterval);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }
}
