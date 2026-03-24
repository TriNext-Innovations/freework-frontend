import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subject, takeUntil } from 'rxjs';
import { MessagingService } from '../messaging.service';
import { WebSocketService } from '../websocket.service';
import { Message, Conversation, TypingIndicator } from '../models';
import { AuthService } from '../../auth/auth.service';
import { ProfileService } from '../../profile/profile.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTooltipModule
  ],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  @ViewChild('messageInput') messageInput!: ElementRef;

  conversations: Conversation[] = [];
  selectedConversation: Conversation | null = null;
  messages: Message[] = [];
  messageText = '';

  loading = false;
  sendingMessage = false;
  loadingConversations = false;

  // Mobile view state
  isMobileView = false;
  showSidebarOnMobile = true;

  // Additional properties
  totalUnreadCount = 0;
  typingUsers = new Map<string, string>();
  currentUserId = '';
  private avatarCache = new Map<string, string>();

  private destroy$ = new Subject<void>();
  private typingTimeout: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private messagingService: MessagingService,
    private webSocketService: WebSocketService,
    private authService: AuthService,
    private profileService: ProfileService,
    private snackBar: MatSnackBar
  ) {
    this.currentUserId = this.authService.currentUserValue?.id || '';
  }

  ngOnInit(): void {
    this.checkMobileView();
    window.addEventListener('resize', () => this.checkMobileView());
    // Only initialize WebSocket if not using mock data
    // this.initializeWebSocket(); // Commented out for mock data testing
    this.loadConversations();
    this.subscribeToMessages();
    this.subscribeToTypingIndicators();
    this.subscribeToNotifications();

    // Check if conversation ID is provided in route
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const conversationId = params.get('id');
      if (conversationId) {
        this.selectConversationById(conversationId);
      }
    });
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', () => this.checkMobileView());
    this.destroy$.next();
    this.destroy$.complete();
    // Only disconnect if WebSocket was initialized
    // this.webSocketService.disconnect(); // Commented out for mock data testing
  }

  initializeWebSocket(): void {
    // In real app, get token from auth service
    const token = localStorage.getItem('access_token') || 'demo-token';
    try {
      this.webSocketService.connect(token);
    } catch (error) {
      console.log('WebSocket connection not available, using mock data mode');
    }
  }

  loadConversations(): void {
    this.loadingConversations = true;
    this.messagingService.getConversations().subscribe({
      next: (response) => {
        this.conversations = response.conversations;
        this.totalUnreadCount = response.totalUnread;
        this.loadingConversations = false;
        this.loadParticipantAvatars();

        // Auto-select first conversation if none selected
        if (!this.selectedConversation && this.conversations.length > 0) {
          this.selectConversation(this.conversations[0]);
        }
      },
      error: (error) => {
        console.error('Error loading conversations:', error);
        this.showError('Failed to load conversations');
        this.loadingConversations = false;
      }
    });
  }

  selectConversation(conversation: Conversation): void {
    this.selectedConversation = conversation;

    // On mobile, hide sidebar when conversation is selected
    if (this.isMobileView) {
      this.showSidebarOnMobile = false;
    }

    console.log('Selected conversation:', conversation);
    console.log('Participant names:', conversation.participantNames);
    console.log('Participant avatars:', conversation.participantAvatars);
    console.log('Getting name:', this.getOtherParticipantName());
    console.log('Getting avatar:', this.getOtherParticipantAvatar());
    this.loadMessages(conversation.id);
    this.markAsRead(conversation.id);

    // Update URL without reloading
    this.router.navigate(['/messages', conversation.id], { replaceUrl: true });
  }

  selectConversationById(id: string): void {
    const conversation = this.conversations.find(c => c.id === id);
    if (conversation) {
      this.selectConversation(conversation);
    }
  }

  loadMessages(conversationId: string): void {
    this.loading = true;
    this.messages = [];

    this.messagingService.getMessages(conversationId).subscribe({
      next: (messages) => {
        this.messages = messages;
        this.loading = false;
        setTimeout(() => this.scrollToBottom(), 100);
      },
      error: (error) => {
        console.error('Error loading messages:', error);
        this.showError('Failed to load messages');
        this.loading = false;
      }
    });
  }

  sendMessage(): void {
    if (!this.messageText.trim() || !this.selectedConversation) {
      return;
    }

    this.sendingMessage = true;
    const request = {
      conversationId: this.selectedConversation.id,
      receiverId: this.getOtherParticipantId(),
      content: this.messageText.trim()
    };

    this.messagingService.sendMessage(request).subscribe({
      next: (message) => {
        this.messages.push(message);
        this.messageText = '';
        this.sendingMessage = false;
        setTimeout(() => this.scrollToBottom(), 100);

        // Update last message in conversation list
        if (this.selectedConversation) {
          this.selectedConversation.lastMessage = message;
        }
      },
      error: (error) => {
        console.error('Error sending message:', error);
        this.showError('Failed to send message');
        this.sendingMessage = false;
      }
    });
  }

  onMessageInput(): void {
    if (!this.selectedConversation) return;

    // Send typing indicator
    this.webSocketService.sendTypingIndicator(this.selectedConversation.id, true);

    // Clear previous timeout
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }

    // Stop typing after 2 seconds of inactivity
    this.typingTimeout = setTimeout(() => {
      if (this.selectedConversation) {
        this.webSocketService.sendTypingIndicator(this.selectedConversation.id, false);
      }
    }, 2000);
  }

  markAsRead(conversationId: string): void {
    this.messagingService.markAsRead(conversationId).subscribe({
      next: () => {
        // Update unread count in conversation list
        const conversation = this.conversations.find(c => c.id === conversationId);
        if (conversation) {
          this.totalUnreadCount -= conversation.unreadCount;
          conversation.unreadCount = 0;
        }

        // Send read receipt via WebSocket
        this.webSocketService.markAsRead(conversationId);
      },
      error: (error) => {
        console.error('Error marking as read:', error);
      }
    });
  }

  subscribeToMessages(): void {
    this.webSocketService.message$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (message) => {
        // Add message to current conversation if it matches
        if (this.selectedConversation && message.conversationId === this.selectedConversation.id) {
          this.messages.push(message);
          setTimeout(() => this.scrollToBottom(), 100);

          // Mark as read if conversation is open
          this.markAsRead(message.conversationId);
        }

        // Update conversation list
        this.updateConversationWithNewMessage(message);
      }
    });
  }

  subscribeToTypingIndicators(): void {
    this.webSocketService.typing$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (indicator: TypingIndicator) => {
        if (indicator.isTyping) {
          this.typingUsers.set(indicator.userId, indicator.userName);
        } else {
          this.typingUsers.delete(indicator.userId);
        }
      }
    });
  }

  subscribeToNotifications(): void {
    this.webSocketService.notification$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (notification) => {
        // Update unread count
        this.totalUnreadCount = notification.totalUnread;

        // Show notification if not in current conversation
        if (!this.selectedConversation || this.selectedConversation.id !== notification.conversationId) {
          this.showNotification(`New message: ${notification.message.content.substring(0, 50)}...`);
        }
      }
    });
  }

  updateConversationWithNewMessage(message: Message): void {
    const conversation = this.conversations.find(c => c.id === message.conversationId);
    if (conversation) {
      conversation.lastMessage = message;
      conversation.updatedAt = message.timestamp;

      // Increment unread count if not current conversation
      if (!this.selectedConversation || this.selectedConversation.id !== message.conversationId) {
        conversation.unreadCount++;
      }

      // Move to top of list
      this.conversations = [conversation, ...this.conversations.filter(c => c.id !== message.conversationId)];
    }
  }

  checkMobileView(): void {
    this.isMobileView = window.innerWidth <= 768;
    if (!this.isMobileView) {
      this.showSidebarOnMobile = true;
    }
  }

  backToConversations(): void {
    if (this.isMobileView) {
      this.showSidebarOnMobile = true;
      this.selectedConversation = null;
    }
  }

  loadParticipantAvatars(): void {
    const otherIds = new Set<string>();
    this.conversations.forEach(conv => {
      const otherId = conv.participantIds.find(id => id !== this.currentUserId);
      if (otherId && !this.avatarCache.has(otherId)) {
        otherIds.add(otherId);
      }
    });

    otherIds.forEach(userId => {
      this.profileService.getProfileByUserId(userId).subscribe({
        next: (profile) => {
          if (profile.profilePicture) {
            this.avatarCache.set(userId, profile.profilePicture);
          }
        },
        error: () => {}
      });
    });
  }

  private getOtherParticipantIndex(conversation: Conversation): number {
    const idx = conversation.participantIds.findIndex(id => id !== this.currentUserId);
    return idx >= 0 ? idx : 0;
  }

  getOtherParticipantId(): string {
    if (!this.selectedConversation) return '';
    return this.selectedConversation.participantIds.find(id => id !== this.currentUserId) || '';
  }

  getOtherParticipantName(): string {
    if (!this.selectedConversation) return '';
    const idx = this.getOtherParticipantIndex(this.selectedConversation);
    return this.selectedConversation.participantNames[idx] || 'Unknown';
  }

  getOtherParticipantAvatar(): string {
    const otherId = this.getOtherParticipantId();
    return this.avatarCache.get(otherId) || '';
  }

  getConversationName(conversation: Conversation): string {
    const idx = this.getOtherParticipantIndex(conversation);
    return conversation.participantNames[idx] || 'Unknown';
  }

  getConversationAvatar(conversation: Conversation): string {
    const otherId = conversation.participantIds.find(id => id !== this.currentUserId);
    return (otherId && this.avatarCache.get(otherId)) || '';
  }

  isMyMessage(message: Message): boolean {
    return message.senderId === this.currentUserId;
  }

  getTypingText(): string {
    const users = Array.from(this.typingUsers.values());
    if (users.length === 0) return '';
    if (users.length === 1) return `${users[0]} is typing...`;
    return `${users.length} people are typing...`;
  }

  formatTime(timestamp: Date): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  formatMessageTime(timestamp: Date): string {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }

  scrollToBottom(): void {
    try {
      if (this.messagesContainer) {
        this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
      }
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
  }

  private showNotification(message: string): void {
    this.snackBar.open(message, 'View', {
      duration: 4000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['info-snackbar']
    });
  }
}

