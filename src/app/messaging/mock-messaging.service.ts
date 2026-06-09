import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Message, Conversation, SendMessageRequest, ConversationListResponse, MessageType } from './models';

@Injectable({
  providedIn: 'root'
})
export class MockMessagingService {
  private mockConversations: Conversation[] = [
    {
      id: 'conv1',
      participantIds: ['currentUser', 'user1'],
      participantNames: ['Sarah Miller'],
      participantAvatars: ['https://i.pravatar.cc/150?img=5'],
      lastMessage: {
        id: 'msg1',
        conversationId: 'conv1',
        senderId: 'user1',
        senderName: 'Sarah Miller',
        senderAvatar: 'https://i.pravatar.cc/150?img=5',
        receiverId: 'currentUser',
        content: 'Can we discuss the project requirements in more detail?',
        timestamp: new Date(Date.now() - 1000 * 60 * 2), // 2 minutes ago
        read: false,
        type: MessageType.TEXT
      },
      unreadCount: 2,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      updatedAt: new Date(Date.now() - 1000 * 60 * 2),
      jobId: '2',
      jobTitle: 'Mobile App Developer - iOS & Android'
    },
    {
      id: 'conv2',
      participantIds: ['currentUser', 'user2'],
      participantNames: ['Mike Johnson'],
      participantAvatars: ['https://i.pravatar.cc/150?img=3'],
      lastMessage: {
        id: 'msg10',
        conversationId: 'conv2',
        senderId: 'currentUser',
        senderName: 'You',
        receiverId: 'user2',
        content: 'Thanks for the update! Looking forward to seeing the progress.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        read: true,
        type: MessageType.TEXT
      },
      unreadCount: 0,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
      jobId: '3',
      jobTitle: 'UI/UX Designer for SaaS Dashboard'
    },
    {
      id: 'conv3',
      participantIds: ['currentUser', 'user3'],
      participantNames: ['Emily Chen'],
      participantAvatars: ['https://i.pravatar.cc/150?img=9'],
      lastMessage: {
        id: 'msg20',
        conversationId: 'conv3',
        senderId: 'user3',
        senderName: 'Emily Chen',
        senderAvatar: 'https://i.pravatar.cc/150?img=9',
        receiverId: 'currentUser',
        content: 'I have completed the initial design mockups. Would you like to schedule a call to review them?',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // Yesterday
        read: false,
        type: MessageType.TEXT
      },
      unreadCount: 1,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
      jobId: '1',
      jobTitle: 'Full Stack Web Developer for E-commerce Platform'
    },
    {
      id: 'conv4',
      participantIds: ['currentUser', 'user4'],
      participantNames: ['David Rodriguez'],
      participantAvatars: ['https://i.pravatar.cc/150?img=12'],
      lastMessage: {
        id: 'msg30',
        conversationId: 'conv4',
        senderId: 'currentUser',
        senderName: 'You',
        receiverId: 'user4',
        content: 'Perfect! The deadline works for me. Let\'s proceed with the project.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
        read: true,
        type: MessageType.TEXT
      },
      unreadCount: 0,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
      jobId: '4',
      jobTitle: 'DevOps Engineer - AWS Infrastructure'
    }
  ];

  private mockMessages: Record<string, Message[]> = {
    'conv1': [
      {
        id: 'msg1-1',
        conversationId: 'conv1',
        senderId: 'user1',
        senderName: 'Sarah Miller',
        senderAvatar: 'https://i.pravatar.cc/150?img=5',
        receiverId: 'currentUser',
        content: 'Hi! I saw your job posting for the Mobile App Developer position.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
        read: true,
        type: MessageType.TEXT
      },
      {
        id: 'msg1-2',
        conversationId: 'conv1',
        senderId: 'currentUser',
        senderName: 'You',
        receiverId: 'user1',
        content: 'Hello Sarah! Thanks for your interest. Have you had a chance to review the project requirements?',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2.5),
        read: true,
        type: MessageType.TEXT
      },
      {
        id: 'msg1-3',
        conversationId: 'conv1',
        senderId: 'user1',
        senderName: 'Sarah Miller',
        senderAvatar: 'https://i.pravatar.cc/150?img=5',
        receiverId: 'currentUser',
        content: 'Yes, I have! The project looks great and aligns perfectly with my skills. I have 4 years of experience with React Native.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        read: true,
        type: MessageType.TEXT
      },
      {
        id: 'msg1-4',
        conversationId: 'conv1',
        senderId: 'currentUser',
        senderName: 'You',
        receiverId: 'user1',
        content: 'That\'s excellent! Could you share some examples of your previous work?',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        read: true,
        type: MessageType.TEXT
      },
      {
        id: 'msg1-5',
        conversationId: 'conv1',
        senderId: 'user1',
        senderName: 'Sarah Miller',
        senderAvatar: 'https://i.pravatar.cc/150?img=5',
        receiverId: 'currentUser',
        content: 'Of course! I\'ll send you my portfolio link: https://sarahmiller.dev',
        timestamp: new Date(Date.now() - 1000 * 60 * 10),
        read: true,
        type: MessageType.TEXT
      },
      {
        id: 'msg1-6',
        conversationId: 'conv1',
        senderId: 'user1',
        senderName: 'Sarah Miller',
        senderAvatar: 'https://i.pravatar.cc/150?img=5',
        receiverId: 'currentUser',
        content: 'Can we discuss the project requirements in more detail?',
        timestamp: new Date(Date.now() - 1000 * 60 * 2),
        read: false,
        type: MessageType.TEXT
      }
    ],
    'conv2': [
      {
        id: 'msg2-1',
        conversationId: 'conv2',
        senderId: 'currentUser',
        senderName: 'You',
        receiverId: 'user2',
        content: 'Hi Mike! I wanted to check in on the UI/UX project progress.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
        read: true,
        type: MessageType.TEXT
      },
      {
        id: 'msg2-2',
        conversationId: 'conv2',
        senderId: 'user2',
        senderName: 'Mike Johnson',
        senderAvatar: 'https://i.pravatar.cc/150?img=3',
        receiverId: 'currentUser',
        content: 'Hello! The project is going well. I\'ve completed the wireframes and started on the high-fidelity designs.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
        read: true,
        type: MessageType.TEXT
      },
      {
        id: 'msg2-3',
        conversationId: 'conv2',
        senderId: 'user2',
        senderName: 'Mike Johnson',
        senderAvatar: 'https://i.pravatar.cc/150?img=3',
        receiverId: 'currentUser',
        content: 'I should have the first draft ready by tomorrow afternoon.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3.5),
        read: true,
        type: MessageType.TEXT
      },
      {
        id: 'msg2-4',
        conversationId: 'conv2',
        senderId: 'currentUser',
        senderName: 'You',
        receiverId: 'user2',
        content: 'Thanks for the update! Looking forward to seeing the progress.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        read: true,
        type: MessageType.TEXT
      }
    ],
    'conv3': [
      {
        id: 'msg3-1',
        conversationId: 'conv3',
        senderId: 'user3',
        senderName: 'Emily Chen',
        senderAvatar: 'https://i.pravatar.cc/150?img=9',
        receiverId: 'currentUser',
        content: 'Thank you for accepting my application! I\'m excited to work on this project.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
        read: true,
        type: MessageType.TEXT
      },
      {
        id: 'msg3-2',
        conversationId: 'conv3',
        senderId: 'currentUser',
        senderName: 'You',
        receiverId: 'user3',
        content: 'Welcome aboard Emily! Let\'s schedule a kickoff meeting to discuss the project scope.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36),
        read: true,
        type: MessageType.TEXT
      },
      {
        id: 'msg3-3',
        conversationId: 'conv3',
        senderId: 'user3',
        senderName: 'Emily Chen',
        senderAvatar: 'https://i.pravatar.cc/150?img=9',
        receiverId: 'currentUser',
        content: 'I have completed the initial design mockups. Would you like to schedule a call to review them?',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
        read: false,
        type: MessageType.TEXT
      }
    ],
    'conv4': [
      {
        id: 'msg4-1',
        conversationId: 'conv4',
        senderId: 'user4',
        senderName: 'David Rodriguez',
        senderAvatar: 'https://i.pravatar.cc/150?img=12',
        receiverId: 'currentUser',
        content: 'I can start the DevOps project next week. Does that timeline work for you?',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72),
        read: true,
        type: MessageType.TEXT
      },
      {
        id: 'msg4-2',
        conversationId: 'conv4',
        senderId: 'currentUser',
        senderName: 'You',
        receiverId: 'user4',
        content: 'Perfect! The deadline works for me. Let\'s proceed with the project.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
        read: true,
        type: MessageType.TEXT
      }
    ]
  };

  getConversations(): Observable<ConversationListResponse> {
    const totalUnread = this.mockConversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

    return of({
      conversations: this.mockConversations,
      totalUnread: totalUnread
    }).pipe(delay(300));
  }

  getConversation(conversationId: string): Observable<Conversation> {
    const conversation = this.mockConversations.find(c => c.id === conversationId);
    if (!conversation) {
      throw new Error('Conversation not found');
    }
    return of(conversation).pipe(delay(200));
  }

  getMessages(conversationId: string, _page = 0, _size = 50): Observable<Message[]> {
    const messages = this.mockMessages[conversationId] || [];
    return of(messages).pipe(delay(300));
  }

  sendMessage(request: SendMessageRequest): Observable<Message> {
    const newMessage: Message = {
      id: `msg${Date.now()}`,
      conversationId: request.conversationId || 'conv1',
      senderId: 'currentUser',
      senderName: 'You',
      receiverId: request.receiverId,
      content: request.content,
      timestamp: new Date(),
      read: false,
      type: request.type || MessageType.TEXT
    };

    // Add to mock messages
    if (request.conversationId && this.mockMessages[request.conversationId]) {
      this.mockMessages[request.conversationId].push(newMessage);
    }

    // Update conversation last message
    const conversation = this.mockConversations.find(c => c.id === request.conversationId);
    if (conversation) {
      conversation.lastMessage = newMessage;
      conversation.updatedAt = new Date();
    }

    return of(newMessage).pipe(delay(500));
  }

  markAsRead(conversationId: string): Observable<void> {
    const conversation = this.mockConversations.find(c => c.id === conversationId);
    if (conversation) {
      conversation.unreadCount = 0;
    }

    // Mark all messages as read
    if (this.mockMessages[conversationId]) {
      this.mockMessages[conversationId].forEach(msg => {
        if (msg.receiverId === 'currentUser') {
          msg.read = true;
        }
      });
    }

    return of(void 0).pipe(delay(200));
  }

  getOrCreateConversation(userId: string, jobId?: string): Observable<Conversation> {
    // Check if conversation exists
    let conversation = this.mockConversations.find(c => c.participantIds.includes(userId));

    // Create new conversation if doesn't exist
    if (!conversation) {
      conversation = {
        id: `conv${Date.now()}`,
        participantIds: ['currentUser', userId],
        participantNames: ['New User'],
        participantAvatars: ['https://i.pravatar.cc/150?img=10'],
        unreadCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        jobId: jobId,
        jobTitle: jobId ? 'Related Job' : undefined
      };
      this.mockConversations.unshift(conversation);
      this.mockMessages[conversation.id] = [];
    }

    return of(conversation).pipe(delay(300));
  }

  getUnreadCount(): Observable<number> {
    const totalUnread = this.mockConversations.reduce((sum, conv) => sum + conv.unreadCount, 0);
    return of(totalUnread).pipe(delay(200));
  }

  searchMessages(query: string): Observable<Message[]> {
    const allMessages: Message[] = [];
    Object.values(this.mockMessages).forEach(messages => {
      allMessages.push(...messages.filter(msg =>
        msg.content.toLowerCase().includes(query.toLowerCase())
      ));
    });
    return of(allMessages).pipe(delay(300));
  }

  deleteMessage(messageId: string): Observable<void> {
    Object.keys(this.mockMessages).forEach(convId => {
      this.mockMessages[convId] = this.mockMessages[convId].filter(msg => msg.id !== messageId);
    });
    return of(void 0).pipe(delay(200));
  }
}
