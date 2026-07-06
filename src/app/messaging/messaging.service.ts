import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { Message, Conversation, SendMessageRequest, ConversationListResponse } from './models';
import { buildApiEndpointUrl } from '../api.config';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {
  private http = inject(HttpClient);

  private apiUrl = buildApiEndpointUrl('/messages');
  private unreadCountSubject = new BehaviorSubject<number>(0);
  public unreadCount$ = this.unreadCountSubject.asObservable();

  getConversations(): Observable<ConversationListResponse> {
    return this.http.get<ConversationListResponse>(`${this.apiUrl}/conversations`).pipe(
      tap(response => this.unreadCountSubject.next(response.totalUnread))
    );
  }

  getConversation(conversationId: string): Observable<Conversation> {
    return this.http.get<Conversation>(`${this.apiUrl}/conversations/${conversationId}`);
  }

  getMessages(conversationId: string, page = 0, size = 50): Observable<Message[]> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<Message[]>(`${this.apiUrl}/conversations/${conversationId}/messages`, { params });
  }

  sendMessage(request: SendMessageRequest): Observable<Message> {
    return this.http.post<Message>(`${this.apiUrl}/send`, request);
  }

  markAsRead(conversationId: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/conversations/${conversationId}/read`, {});
  }

  getOrCreateConversation(userId: string, jobId?: string): Observable<Conversation> {
    const params = jobId ? new HttpParams().set('jobId', jobId) : new HttpParams();
    return this.http.post<Conversation>(`${this.apiUrl}/conversations/start/${userId}`, {}, { params });
  }

  getUnreadCount(): Observable<number> {
    return this.http.get<{ count: number }>(`${this.apiUrl}/unread-count`).pipe(
      map(r => r.count),
      tap(count => this.unreadCountSubject.next(count))
    );
  }

  searchMessages(query: string): Observable<Message[]> {
    const params = new HttpParams().set('query', query);
    return this.http.get<Message[]>(`${this.apiUrl}/search`, { params });
  }

  deleteMessage(messageId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${messageId}`);
  }

  updateUnreadCount(count: number): void {
    this.unreadCountSubject.next(count);
  }
}
