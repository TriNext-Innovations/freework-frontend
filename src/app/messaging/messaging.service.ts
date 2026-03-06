import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { Message, Conversation, SendMessageRequest, ConversationListResponse } from './models';
import { MockMessagingService } from './mock-messaging.service';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {
  private apiUrl = 'https://api.freework.co.za/api/messages';
  private useMockData = true; // Toggle this to switch between mock and real API
  private unreadCountSubject = new BehaviorSubject<number>(0);
  public unreadCount$ = this.unreadCountSubject.asObservable();

  constructor(
    private http: HttpClient,
    private mockMessagingService: MockMessagingService
  ) {}

  /**
   * Get all conversations for the current user
   */
  getConversations(): Observable<ConversationListResponse> {
    if (this.useMockData) {
      return this.mockMessagingService.getConversations().pipe(
        tap(response => this.unreadCountSubject.next(response.totalUnread))
      );
    }

    return this.http.get<ConversationListResponse>(`${this.apiUrl}/conversations`).pipe(
      tap(response => this.unreadCountSubject.next(response.totalUnread))
    );
  }

  /**
   * Get a specific conversation by ID
   */
  getConversation(conversationId: string): Observable<Conversation> {
    if (this.useMockData) {
      return this.mockMessagingService.getConversation(conversationId);
    }

    return this.http.get<Conversation>(`${this.apiUrl}/conversations/${conversationId}`);
  }

  /**
   * Get messages for a conversation
   */
  getMessages(conversationId: string, page: number = 0, size: number = 50): Observable<Message[]> {
    if (this.useMockData) {
      return this.mockMessagingService.getMessages(conversationId, page, size);
    }

    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<Message[]>(`${this.apiUrl}/conversations/${conversationId}/messages`, { params });
  }

  /**
   * Send a new message
   */
  sendMessage(request: SendMessageRequest): Observable<Message> {
    if (this.useMockData) {
      return this.mockMessagingService.sendMessage(request);
    }

    return this.http.post<Message>(`${this.apiUrl}/send`, request);
  }

  /**
   * Mark conversation as read
   */
  markAsRead(conversationId: string): Observable<void> {
    if (this.useMockData) {
      return this.mockMessagingService.markAsRead(conversationId);
    }

    return this.http.put<void>(`${this.apiUrl}/conversations/${conversationId}/read`, {});
  }

  /**
   * Create or get conversation with a user
   */
  getOrCreateConversation(userId: string, jobId?: string): Observable<Conversation> {
    if (this.useMockData) {
      return this.mockMessagingService.getOrCreateConversation(userId, jobId);
    }

    const params = jobId ? new HttpParams().set('jobId', jobId) : new HttpParams();
    return this.http.post<Conversation>(`${this.apiUrl}/conversations/start/${userId}`, {}, { params });
  }

  /**
   * Get unread message count
   */
  getUnreadCount(): Observable<number> {
    if (this.useMockData) {
      return this.mockMessagingService.getUnreadCount().pipe(
        tap(count => this.unreadCountSubject.next(count))
      );
    }

    return this.http.get<{ count: number }>(`${this.apiUrl}/unread-count`).pipe(
      map(r => r.count),
      tap(count => this.unreadCountSubject.next(count))
    );
  }

  /**
   * Search messages
   */
  searchMessages(query: string): Observable<Message[]> {
    if (this.useMockData) {
      return this.mockMessagingService.searchMessages(query);
    }

    const params = new HttpParams().set('query', query);
    return this.http.get<Message[]>(`${this.apiUrl}/search`, { params });
  }

  /**
   * Delete a message
   */
  deleteMessage(messageId: string): Observable<void> {
    if (this.useMockData) {
      return this.mockMessagingService.deleteMessage(messageId);
    }

    return this.http.delete<void>(`${this.apiUrl}/${messageId}`);
  }

  /**
   * Update unread count (called from WebSocket events)
   */
  updateUnreadCount(count: number): void {
    this.unreadCountSubject.next(count);
  }
}
