import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ChatConversation, ChatMessage, ChatUser, ChatChannel, ChatGroup, ChatFile } from '../types/chat';
import { useAuth } from './AuthContext';

interface EnhancedChatContextType {
  conversations: ChatConversation[];
  channels: ChatChannel[];
  groups: ChatGroup[];
  activeConversation: ChatConversation | null;
  users: ChatUser[];
  files: ChatFile[];
  unreadCount: number;
  viewMode: 'compact' | 'fullpage';
  setViewMode: (mode: 'compact' | 'fullpage') => void;
  setActiveConversation: (conversation: ChatConversation | null) => void;
  sendMessage: (conversationId: string, content: string, type?: 'text' | 'image' | 'file', fileData?: any) => void;
  markAsRead: (conversationId: string) => void;
  startDirectChat: (userId: string) => void;
  createChannel: (name: string, description: string, type: 'public' | 'private') => void;
  createGroup: (name: string, participantIds: string[], description?: string) => void;
  joinChannel: (channelId: string) => void;
  leaveChannel: (channelId: string) => void;
  addGroupMembers: (groupId: string, userIds: string[]) => void;
  removeGroupMember: (groupId: string, userId: string) => void;
  deleteConversation: (conversationId: string) => void;
  pinConversation: (conversationId: string) => void;
  muteConversation: (conversationId: string) => void;
  archiveConversation: (conversationId: string) => void;
  deleteMessage: (conversationId: string, messageId: string) => void;
  editMessage: (conversationId: string, messageId: string, newContent: string) => void;
  addReaction: (conversationId: string, messageId: string, emoji: string) => void;
  uploadFile: (conversationId: string, file: File) => Promise<void>;
  getConversationFiles: (conversationId: string) => ChatFile[];
  getAllFiles: () => ChatFile[];
  searchMessages: (query: string) => ChatMessage[];
}

const EnhancedChatContext = createContext<EnhancedChatContextType | undefined>(undefined);

export const useEnhancedChat = () => {
  const context = useContext(EnhancedChatContext);
  if (!context) {
    throw new Error('useEnhancedChat must be used within EnhancedChatProvider');
  }
  return context;
};

interface EnhancedChatProviderProps {
  children: ReactNode;
}

export const EnhancedChatProvider: React.FC<EnhancedChatProviderProps> = ({ children }) => {
  const { currentUser } = useAuth();
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [channels, setChannels] = useState<ChatChannel[]>([]);
  const [groups, setGroups] = useState<ChatGroup[]>([]);
  const [activeConversation, setActiveConversation] = useState<ChatConversation | null>(null);
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [files, setFiles] = useState<ChatFile[]>([]);
  const [viewMode, setViewMode] = useState<'compact' | 'fullpage'>('compact');

  useEffect(() => {
    // Load data from localStorage
    const savedConversations = localStorage.getItem('chatConversations');
    const savedChannels = localStorage.getItem('chatChannels');
    const savedGroups = localStorage.getItem('chatGroups');
    const savedFiles = localStorage.getItem('chatFiles');
    
    if (savedConversations) setConversations(JSON.parse(savedConversations));
    if (savedChannels) setChannels(JSON.parse(savedChannels));
    if (savedGroups) setGroups(JSON.parse(savedGroups));
    if (savedFiles) setFiles(JSON.parse(savedFiles));

    // Load users
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
    // Save to localStorage
    if (conversations.length > 0) {
      localStorage.setItem('chatConversations', JSON.stringify(conversations));
    }
    if (channels.length > 0) {
      localStorage.setItem('chatChannels', JSON.stringify(channels));
    }
    if (groups.length > 0) {
      localStorage.setItem('chatGroups', JSON.stringify(groups));
    }
    if (files.length > 0) {
      localStorage.setItem('chatFiles', JSON.stringify(files));
    }
  }, [conversations, channels, groups, files]);

  const unreadCount = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  const sendMessage = (conversationId: string, content: string, type: 'text' | 'image' | 'file' = 'text', fileData?: any) => {
    if (!currentUser) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      content,
      timestamp: new Date().toISOString(),
      read: false,
      type,
      ...(fileData && {
        fileUrl: fileData.url,
        fileName: fileData.name,
        fileSize: fileData.size
      })
    };

    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          messages: [...conv.messages, message],
          lastMessage: type === 'file' ? `📎 ${fileData?.name || 'File'}` : content,
          lastMessageTime: message.timestamp
        };
      }
      return conv;
    }));

    if (activeConversation?.id === conversationId) {
      setActiveConversation(prev => prev ? {
        ...prev,
        messages: [...prev.messages, message],
        lastMessage: type === 'file' ? `📎 ${fileData?.name || 'File'}` : content,
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

  const startDirectChat = (userId: string) => {
    const existing = conversations.find(c => c.type === 'direct' && c.participantId === userId);
    if (existing) {
      setActiveConversation(existing);
      return;
    }

    const user = users.find(u => u.id === userId);
    if (!user) return;

    const newConversation: ChatConversation = {
      id: Date.now().toString(),
      type: 'direct',
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

  const createChannel = (name: string, description: string, type: 'public' | 'private') => {
    if (!currentUser) return;

    const channel: ChatChannel = {
      id: Date.now().toString(),
      name,
      description,
      type,
      memberCount: 1,
      createdBy: currentUser.id,
      createdAt: new Date().toISOString(),
      admins: [currentUser.id]
    };

    const conversation: ChatConversation = {
      id: channel.id,
      type: 'channel',
      name: channel.name,
      description: channel.description,
      participants: [currentUser.id],
      admins: [currentUser.id],
      lastMessage: 'Channel created',
      lastMessageTime: new Date().toISOString(),
      unreadCount: 0,
      messages: []
    };

    setChannels(prev => [...prev, channel]);
    setConversations(prev => [conversation, ...prev]);
    setActiveConversation(conversation);
  };

  const createGroup = (name: string, participantIds: string[], description?: string) => {
    if (!currentUser) return;

    const allParticipants = [currentUser.id, ...participantIds];
    
    const group: ChatGroup = {
      id: Date.now().toString(),
      name,
      description,
      participants: allParticipants,
      admins: [currentUser.id],
      createdBy: currentUser.id,
      createdAt: new Date().toISOString()
    };

    const conversation: ChatConversation = {
      id: group.id,
      type: 'group',
      name: group.name,
      description: group.description,
      participants: allParticipants,
      admins: [currentUser.id],
      lastMessage: 'Group created',
      lastMessageTime: new Date().toISOString(),
      unreadCount: 0,
      messages: []
    };

    setGroups(prev => [...prev, group]);
    setConversations(prev => [conversation, ...prev]);
    setActiveConversation(conversation);
  };

  const joinChannel = (channelId: string) => {
    if (!currentUser) return;

    setChannels(prev => prev.map(ch => {
      if (ch.id === channelId) {
        return { ...ch, memberCount: ch.memberCount + 1 };
      }
      return ch;
    }));

    setConversations(prev => prev.map(conv => {
      if (conv.id === channelId && conv.participants) {
        return {
          ...conv,
          participants: [...conv.participants, currentUser.id]
        };
      }
      return conv;
    }));
  };

  const leaveChannel = (channelId: string) => {
    if (!currentUser) return;

    setChannels(prev => prev.map(ch => {
      if (ch.id === channelId) {
        return { ...ch, memberCount: Math.max(0, ch.memberCount - 1) };
      }
      return ch;
    }));

    setConversations(prev => prev.map(conv => {
      if (conv.id === channelId && conv.participants) {
        return {
          ...conv,
          participants: conv.participants.filter(id => id !== currentUser.id)
        };
      }
      return conv;
    }));
  };

  const addGroupMembers = (groupId: string, userIds: string[]) => {
    setGroups(prev => prev.map(g => {
      if (g.id === groupId) {
        return {
          ...g,
          participants: [...new Set([...g.participants, ...userIds])]
        };
      }
      return g;
    }));

    setConversations(prev => prev.map(conv => {
      if (conv.id === groupId && conv.participants) {
        return {
          ...conv,
          participants: [...new Set([...conv.participants, ...userIds])]
        };
      }
      return conv;
    }));
  };

  const removeGroupMember = (groupId: string, userId: string) => {
    setGroups(prev => prev.map(g => {
      if (g.id === groupId) {
        return {
          ...g,
          participants: g.participants.filter(id => id !== userId)
        };
      }
      return g;
    }));

    setConversations(prev => prev.map(conv => {
      if (conv.id === groupId && conv.participants) {
        return {
          ...conv,
          participants: conv.participants.filter(id => id !== userId)
        };
      }
      return conv;
    }));
  };

  const deleteConversation = (conversationId: string) => {
    setConversations(prev => prev.filter(c => c.id !== conversationId));
    if (activeConversation?.id === conversationId) {
      setActiveConversation(null);
    }
  };

  const pinConversation = (conversationId: string) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        return { ...conv, pinned: !conv.pinned };
      }
      return conv;
    }));
  };

  const muteConversation = (conversationId: string) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        return { ...conv, muted: !conv.muted };
      }
      return conv;
    }));
  };

  const archiveConversation = (conversationId: string) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        return { ...conv, archived: !conv.archived };
      }
      return conv;
    }));
  };

  const deleteMessage = (conversationId: string, messageId: string) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          messages: conv.messages.filter(msg => msg.id !== messageId)
        };
      }
      return conv;
    }));

    if (activeConversation?.id === conversationId) {
      setActiveConversation(prev => prev ? {
        ...prev,
        messages: prev.messages.filter(msg => msg.id !== messageId)
      } : null);
    }
  };

  const editMessage = (conversationId: string, messageId: string, newContent: string) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          messages: conv.messages.map(msg => 
            msg.id === messageId 
              ? { ...msg, content: newContent, edited: true, editedAt: new Date().toISOString() }
              : msg
          )
        };
      }
      return conv;
    }));

    if (activeConversation?.id === conversationId) {
      setActiveConversation(prev => prev ? {
        ...prev,
        messages: prev.messages.map(msg => 
          msg.id === messageId 
            ? { ...msg, content: newContent, edited: true, editedAt: new Date().toISOString() }
            : msg
        )
      } : null);
    }
  };

  const addReaction = (conversationId: string, messageId: string, emoji: string) => {
    if (!currentUser) return;

    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          messages: conv.messages.map(msg => {
            if (msg.id === messageId) {
              const reactions = msg.reactions || [];
              const existingReaction = reactions.find(r => r.userId === currentUser.id && r.emoji === emoji);
              
              if (existingReaction) {
                return {
                  ...msg,
                  reactions: reactions.filter(r => !(r.userId === currentUser.id && r.emoji === emoji))
                };
              } else {
                return {
                  ...msg,
                  reactions: [...reactions, { emoji, userId: currentUser.id, userName: currentUser.name }]
                };
              }
            }
            return msg;
          })
        };
      }
      return conv;
    }));
  };

  const uploadFile = async (conversationId: string, file: File) => {
    if (!currentUser) return;

    // Simulate file upload
    const fileUrl = URL.createObjectURL(file);
    
    const chatFile: ChatFile = {
      id: Date.now().toString(),
      name: file.name,
      size: file.size,
      type: file.type,
      url: fileUrl,
      uploadedBy: currentUser.id,
      uploadedByName: currentUser.name,
      uploadedAt: new Date().toISOString(),
      conversationId,
      conversationName: conversations.find(c => c.id === conversationId)?.name || 
                        conversations.find(c => c.id === conversationId)?.participantName || 'Unknown',
      messageId: Date.now().toString()
    };

    setFiles(prev => [...prev, chatFile]);

    sendMessage(conversationId, file.name, 'file', {
      url: fileUrl,
      name: file.name,
      size: file.size
    });
  };

  const getConversationFiles = (conversationId: string) => {
    return files.filter(f => f.conversationId === conversationId);
  };

  const getAllFiles = () => {
    return files;
  };

  const searchMessages = (query: string) => {
    const results: ChatMessage[] = [];
    conversations.forEach(conv => {
      conv.messages.forEach(msg => {
        if (msg.content.toLowerCase().includes(query.toLowerCase())) {
          results.push(msg);
        }
      });
    });
    return results;
  };

  return (
    <EnhancedChatContext.Provider value={{
      conversations,
      channels,
      groups,
      activeConversation,
      users,
      files,
      unreadCount,
      viewMode,
      setViewMode,
      setActiveConversation,
      sendMessage,
      markAsRead,
      startDirectChat,
      createChannel,
      createGroup,
      joinChannel,
      leaveChannel,
      addGroupMembers,
      removeGroupMember,
      deleteConversation,
      pinConversation,
      muteConversation,
      archiveConversation,
      deleteMessage,
      editMessage,
      addReaction,
      uploadFile,
      getConversationFiles,
      getAllFiles,
      searchMessages
    }}>
      {children}
    </EnhancedChatContext.Provider>
  );
};
