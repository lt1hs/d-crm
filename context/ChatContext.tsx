import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ChatConversation, ChatMessage, ChatUser } from '../types/chat';
import { useAuth } from './AuthContext';

interface ChatContextType {
  conversations: ChatConversation[];
  activeConversation: ChatConversation | null;
  users: ChatUser[];
  unreadCount: number;
  setActiveConversation: (conversation: ChatConversation | null) => void;
  sendMessage: (conversationId: string, content: string, type?: 'text' | 'image' | 'file') => void;
  markAsRead: (conversationId: string) => void;
  startConversation: (userId: string) => void;
  deleteConversation: (conversationId: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within ChatProvider');
  }
  return context;
};

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const { currentUser } = useAuth();
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<ChatConversation | null>(null);
  const [users, setUsers] = useState<ChatUser[]>([]);

  useEffect(() => {
    // Load conversations from localStorage
    const savedConversations = localStorage.getItem('chatConversations');
    if (savedConversations) {
      setConversations(JSON.parse(savedConversations));
    }

    // Load users from localStorage
    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
      const allUsers = JSON.parse(savedUsers);
      setUsers(allUsers.map((u: any) => ({
        id: u.id,
        name: u.name,
        avatar: u.avatar,
        status: u.status === 'active' ? 'online' : 'offline',
        role: u.role
      })));
    }
  }, []);

  useEffect(() => {
    // Save conversations to localStorage
    if (conversations.length > 0) {
      localStorage.setItem('chatConversations', JSON.stringify(conversations));
    }
  }, [conversations]);

  const unreadCount = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  const sendMessage = (conversationId: string, content: string, type: 'text' | 'image' | 'file' = 'text') => {
    if (!currentUser) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      content,
      timestamp: new Date().toISOString(),
      read: false,
      type
    };

    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          messages: [...conv.messages, message],
          lastMessage: content,
          lastMessageTime: message.timestamp
        };
      }
      return conv;
    }));

    // Update active conversation
    if (activeConversation?.id === conversationId) {
      setActiveConversation(prev => prev ? {
        ...prev,
        messages: [...prev.messages, message],
        lastMessage: content,
        lastMessageTime: message.timestamp
      } : null);
    }
  };

  const markAsRead = (conversationId: string) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          unreadCount: 0,
          messages: conv.messages.map(msg => ({ ...msg, read: true }))
        };
      }
      return conv;
    }));
  };

  const startConversation = (userId: string) => {
    // Check if conversation already exists
    const existing = conversations.find(c => c.participantId === userId);
    if (existing) {
      setActiveConversation(existing);
      return;
    }

    const user = users.find(u => u.id === userId);
    if (!user) return;

    const newConversation: ChatConversation = {
      id: Date.now().toString(),
      participantId: user.id,
      participantName: user.name,
      participantAvatar: user.avatar,
      participantStatus: user.status,
      lastMessage: '',
      lastMessageTime: new Date().toISOString(),
      unreadCount: 0,
      messages: []
    };

    setConversations(prev => [newConversation, ...prev]);
    setActiveConversation(newConversation);
  };

  const deleteConversation = (conversationId: string) => {
    setConversations(prev => prev.filter(c => c.id !== conversationId));
    if (activeConversation?.id === conversationId) {
      setActiveConversation(null);
    }
  };

  return (
    <ChatContext.Provider value={{
      conversations,
      activeConversation,
      users,
      unreadCount,
      setActiveConversation,
      sendMessage,
      markAsRead,
      startConversation,
      deleteConversation
    }}>
      {children}
    </ChatContext.Provider>
  );
};
