import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { Message, TypingIndicator, MessageNotification } from './models';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 3000;

  // Subjects for different message types
  private messageSubject = new Subject<Message>();
  private typingSubject = new Subject<TypingIndicator>();
  private notificationSubject = new Subject<MessageNotification>();
  private connectionSubject = new BehaviorSubject<boolean>(false);

  // Public observables
  public message$ = this.messageSubject.asObservable();
  public typing$ = this.typingSubject.asObservable();
  public notification$ = this.notificationSubject.asObservable();
  public connected$ = this.connectionSubject.asObservable();

  constructor() {}

  /**
   * Connect to WebSocket server
   */
  connect(token: string): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      console.log('WebSocket already connected');
      return;
    }

    const wsUrl = `wss://api.freework.co.za/ws?token=${token}`;

    try {
      this.socket = new WebSocket(wsUrl);

      this.socket.onopen = () => {
        console.log('WebSocket connected');
        this.connectionSubject.next(true);
        this.reconnectAttempts = 0;
      };

      this.socket.onmessage = (event) => {
        this.handleMessage(event.data);
      };

      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.connectionSubject.next(false);
      };

      this.socket.onclose = () => {
        console.log('WebSocket disconnected');
        this.connectionSubject.next(false);
        this.attemptReconnect(token);
      };
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      this.connectionSubject.next(false);
    }
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
      this.connectionSubject.next(false);
    }
  }

  /**
   * Send a message through WebSocket
   */
  send(message: any): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not connected');
    }
  }

  /**
   * Send typing indicator
   */
  sendTypingIndicator(conversationId: string, isTyping: boolean): void {
    this.send({
      type: 'TYPING',
      conversationId,
      isTyping
    });
  }

  /**
   * Mark messages as read
   */
  markAsRead(conversationId: string): void {
    this.send({
      type: 'MARK_READ',
      conversationId
    });
  }

  /**
   * Handle incoming WebSocket messages
   */
  private handleMessage(data: string): void {
    try {
      const payload = JSON.parse(data);

      switch (payload.type) {
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
          // Handle read receipts
          break;
        default:
          console.log('Unknown message type:', payload.type);
      }
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  }

  /**
   * Attempt to reconnect to WebSocket
   */
  private attemptReconnect(token: string): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

      setTimeout(() => {
        this.connect(token);
      }, this.reconnectInterval);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  /**
   * Check if WebSocket is connected
   */
  isConnected(): boolean {
    return this.socket !== null && this.socket.readyState === WebSocket.OPEN;
  }
}
