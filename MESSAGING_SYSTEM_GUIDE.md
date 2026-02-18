---
liquid: false
---

# Messaging System Guide

## Overview

The Freework messaging system provides real-time chat functionality between clients and freelancers. Built on WebSocket technology, it enables instant communication for job discussions, negotiations, and project updates.

## Features

- **Real-time Chat** - Instant message delivery via WebSocket
- **Conversation Threads** - Organized message history
- **User Presence** - Online/offline status indicators
- **Message History** - Persistent message storage
- **Typing Indicators** - See when someone is typing
- **Unread Count** - Track unread messages
- **File Sharing** - Share documents and images (planned)

## Architecture

### Services

1. **MessagingService** (`messaging.service.ts`) - Main messaging logic
2. **WebSocketService** (`websocket.service.ts`) - WebSocket connection management
3. **MockMessagingService** (`mock-messaging.service.ts`) - Development mock service

### Data Models

```typescript
interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

interface Conversation {
  id: string;
  participants: ConversationParticipant[];
  lastMessage?: Message;
  unreadCount: number;
  updatedAt: Date;
}

interface ConversationParticipant {
  userId: string;
  userName: string;
  userRole: 'client' | 'freelancer';
  isOnline: boolean;
}

interface SendMessageRequest {
  receiverId: string;
  content: string;
}
```

## Usage

### Initializing WebSocket Connection

```typescript
import { WebSocketService } from '@app/messaging/websocket.service';
import { MessagingService } from '@app/messaging/messaging.service';

constructor(
  private wsService: WebSocketService,
  private messagingService: MessagingService
) {}

ngOnInit() {
  // WebSocket automatically connects when MessagingService is used
  this.messagingService.connect();
}

ngOnDestroy() {
  this.messagingService.disconnect();
}
```

### Getting Conversations

```typescript
// Get all conversations for current user
this.messagingService.getConversations().subscribe(conversations => {
  this.conversations = conversations;
  console.log('Conversations:', conversations);
});

// Subscribe to real-time conversation updates
this.messagingService.conversations$.subscribe(conversations => {
  this.conversations = conversations;
});
```

### Sending Messages

```typescript
sendMessage(receiverId: string, content: string) {
  this.messagingService.sendMessage({
    receiverId,
    content
  }).subscribe({
    next: (message) => {
      console.log('Message sent:', message);
      this.messageContent = ''; // Clear input
    },
    error: (error) => {
      console.error('Error sending message:', error);
    }
  });
}
```

### Getting Conversation Messages

```typescript
// Get messages for a specific conversation
this.messagingService.getMessages(conversationId).subscribe(messages => {
  this.messages = messages;
});

// Subscribe to real-time message updates
this.messagingService.messages$(conversationId).subscribe(messages => {
  this.messages = messages;
});
```

### Starting a New Conversation

```typescript
startConversation(userId: string) {
  this.messagingService.getOrCreateConversation(userId).subscribe({
    next: (conversation) => {
      console.log('Conversation ready:', conversation);
      this.router.navigate(['/messages', conversation.id]);
    },
    error: (error) => {
      console.error('Error starting conversation:', error);
    }
  });
}
```

### Marking Messages as Read

```typescript
// Mark all messages in a conversation as read
this.messagingService.markAsRead(conversationId).subscribe({
  next: () => console.log('Messages marked as read'),
  error: (error) => console.error('Error:', error)
});
```

### Getting Unread Count

```typescript
// Get total unread message count
this.messagingService.getUnreadCount().subscribe(count => {
  this.unreadCount = count;
});

// Subscribe to real-time unread count updates
this.messagingService.unreadCount$.subscribe(count => {
  this.unreadCount = count;
});
```

### Typing Indicators

```typescript
// Send typing indicator
this.messagingService.sendTypingIndicator(conversationId);

// Subscribe to typing indicators
this.messagingService.typingIndicator$(conversationId).subscribe(typing => {
  if (typing) {
    this.typingMessage = `${typing.userName} is typing...`;
  } else {
    this.typingMessage = '';
  }
});
```

### User Presence

```typescript
// Check if user is online
this.messagingService.getUserPresence(userId).subscribe(isOnline => {
  this.userOnline = isOnline;
});

// Subscribe to presence updates
this.messagingService.presence$(userId).subscribe(isOnline => {
  this.userOnline = isOnline;
});
```

## Components

### ChatComponent
- Main chat interface
- Message list with auto-scroll
- Message input
- User presence display
- Typing indicators

### ConversationListComponent
- List of all conversations
- Unread message badges
- Last message preview
- Click to open conversation

## WebSocket Events

### Client → Server

```typescript
{
  type: 'message',
  data: { conversationId, content }
}

{
  type: 'typing',
  data: { conversationId }
}

{
  type: 'read',
  data: { conversationId }
}
```

### Server → Client

```typescript
{
  type: 'message',
  data: Message
}

{
  type: 'typing',
  data: { conversationId, userId, userName }
}

{
  type: 'presence',
  data: { userId, isOnline }
}
```

## API Endpoints

```
GET    /api/messages/conversations    - Get all conversations
GET    /api/messages/:conversationId  - Get messages in conversation
POST   /api/messages                  - Send new message
PUT    /api/messages/:id/read         - Mark message as read
GET    /api/messages/unread           - Get unread count
POST   /api/messages/conversation     - Create/get conversation with user
WS     /ws/messages                   - WebSocket connection
```

## Template Examples

### Chat Interface

```html
<div class="chat-container">
  <!-- Conversation List -->
  <div class="conversations">
    <h3>Messages</h3>
    @for (conv of conversations; track conv.id) {
      <div 
        class="conversation-item"
        [class.active]="currentConversation?.id === conv.id"
        (click)="selectConversation(conv)">
        
        <div class="participant-info">
          <h4>{{ getOtherParticipant(conv).userName }}</h4>
          @if (getOtherParticipant(conv).isOnline) {
            <span class="online-indicator">●</span>
          }
        </div>

        @if (conv.lastMessage) {
          <p class="last-message">{{ conv.lastMessage.content }}</p>
        }

        @if (conv.unreadCount > 0) {
          <span class="unread-badge">{{ conv.unreadCount }}</span>
        }

        <span class="timestamp">
          {{ conv.updatedAt | date:'short' }}
        </span>
      </div>
    }
  </div>

  <!-- Message Thread -->
  <div class="message-thread">
    @if (currentConversation) {
      <div class="chat-header">
        <h3>{{ getOtherParticipant(currentConversation).userName }}</h3>
        @if (getOtherParticipant(currentConversation).isOnline) {
          <span class="status">Online</span>
        }
      </div>

      <div class="messages" #messageContainer>
        @for (message of messages; track message.id) {
          <div 
            class="message"
            [class.own-message]="message.senderId === currentUserId">
            <div class="message-content">
              <p>{{ message.content }}</p>
              <span class="timestamp">
                {{ message.timestamp | date:'short' }}
              </span>
            </div>
          </div>
        }

        @if (isTyping) {
          <div class="typing-indicator">
            <span>{{ typingMessage }}</span>
          </div>
        }
      </div>

      <div class="message-input">
        <textarea
          [(ngModel)]="messageContent"
          (keyup)="onTyping()"
          (keydown.enter)="sendMessage($event)"
          placeholder="Type a message...">
        </textarea>
        <button 
          (click)="sendMessage()"
          [disabled]="!messageContent.trim()">
          Send
        </button>
      </div>
    } @else {
      <div class="no-conversation">
        <p>Select a conversation to start messaging</p>
      </div>
    }
  </div>
</div>
```

### Conversation List (Simplified)

```html
<div class="conversation-list">
  <h2>
    Messages
    @if (unreadCount > 0) {
      <span class="badge">{{ unreadCount }}</span>
    }
  </h2>

  @for (conversation of conversations; track conversation.id) {
    <a [routerLink]="['/messages', conversation.id]" class="conversation-card">
      <div class="user-avatar">
        {{ getInitials(conversation) }}
      </div>
      <div class="conversation-info">
        <h4>{{ getOtherUser(conversation).userName }}</h4>
        <p>{{ conversation.lastMessage?.content }}</p>
      </div>
      @if (conversation.unreadCount > 0) {
        <span class="unread">{{ conversation.unreadCount }}</span>
      }
    </a>
  }

  @if (conversations.length === 0) {
    <p class="empty-state">No conversations yet</p>
  }
</div>
```

## Component Example

```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MessagingService } from '@app/messaging/messaging.service';
import { Conversation, Message } from '@app/messaging/models';
import { AuthService } from '@app/auth/auth.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {
  conversations: Conversation[] = [];
  currentConversation?: Conversation;
  messages: Message[] = [];
  messageContent = '';
  unreadCount = 0;
  isTyping = false;
  
  private destroy$ = new Subject<void>();

  constructor(
    private messagingService: MessagingService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.messagingService.connect();
    this.loadConversations();
    this.subscribeToUpdates();
  }

  loadConversations() {
    this.messagingService.getConversations()
      .pipe(takeUntil(this.destroy$))
      .subscribe(conversations => {
        this.conversations = conversations;
      });
  }

  subscribeToUpdates() {
    // Real-time conversation updates
    this.messagingService.conversations$
      .pipe(takeUntil(this.destroy$))
      .subscribe(conversations => {
        this.conversations = conversations;
      });

    // Unread count
    this.messagingService.unreadCount$
      .pipe(takeUntil(this.destroy$))
      .subscribe(count => {
        this.unreadCount = count;
      });
  }

  selectConversation(conversation: Conversation) {
    this.currentConversation = conversation;
    this.loadMessages(conversation.id);
    this.messagingService.markAsRead(conversation.id).subscribe();
  }

  loadMessages(conversationId: string) {
    this.messagingService.messages$(conversationId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(messages => {
        this.messages = messages;
        this.scrollToBottom();
      });
  }

  sendMessage() {
    if (!this.messageContent.trim() || !this.currentConversation) return;

    const receiverId = this.getOtherParticipant(this.currentConversation).userId;

    this.messagingService.sendMessage({
      receiverId,
      content: this.messageContent
    }).subscribe({
      next: () => {
        this.messageContent = '';
      },
      error: (error) => console.error('Error sending message:', error)
    });
  }

  onTyping() {
    if (this.currentConversation) {
      this.messagingService.sendTypingIndicator(this.currentConversation.id);
    }
  }

  getOtherParticipant(conversation: Conversation) {
    const currentUserId = this.authService.currentUser()?.id;
    return conversation.participants.find(p => p.userId !== currentUserId)!;
  }

  scrollToBottom() {
    // Implement auto-scroll to latest message
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.messagingService.disconnect();
  }
}
```

## Best Practices

1. **Connection Management**: Always disconnect WebSocket on component destroy
2. **Unsubscribe**: Use takeUntil pattern to prevent memory leaks
3. **Auto-scroll**: Scroll to bottom when new messages arrive
4. **Typing Indicators**: Debounce typing events (300ms)
5. **Error Handling**: Handle connection drops gracefully
6. **Message Queuing**: Queue messages if connection is lost
7. **Presence Updates**: Update presence on visibility changes

## Development with Mock Service

For development without a WebSocket server, use the mock service:

```typescript
// app.config.ts
providers: [
  {
    provide: MessagingService,
    useClass: MockMessagingService
  }
]
```

The mock service simulates real-time messaging with RxJS subjects.

## Security

- Messages encrypted in transit (WSS protocol)
- User authentication required
- Users can only access their own conversations
- Input sanitization to prevent XSS
- Rate limiting on message sending

## Quick Start

See [MESSAGING_QUICK_START.md](MESSAGING_QUICK_START.md) for a quick implementation guide.

## Related Documentation

- [Job Application Guide](JOB_APPLICATION_GUIDE.md) - Context for job-related messaging
- [Authentication Guide](AUTHENTICATION_GUIDE.md) - User authentication required
