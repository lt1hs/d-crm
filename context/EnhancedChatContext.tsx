import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { ChatConversation, ChatMessage, ChatUser, ChatChannel, ChatGroup, ChatFile } from '../types/chat';
import { useAuth } from './AuthContext';
import { chatApi, uploadFile as uploadToStorage, usersApi } from '../utils/api';
import { supabase } from '../config/supabase';
import { useChatNotifications } from '../hooks/useChatNotifications';

interface EnhancedChatContextType {
  conversations: ChatConversation[];
  channels: ChatChannel[];
  groups: ChatGroup[];
  activeConversation: ChatConversation | null;
  users: ChatUser[];
  files: ChatFile[];
  unreadCount: number;
  loading: boolean;
  conversationLoading: boolean;
  loadingMore: boolean;
  hasMoreMessages: boolean;
  onlineUsers: Set<string>;
  typingUsers: Map<string, string[]>;
  viewMode: 'compact' | 'fullpage';
  setViewMode: (mode: 'compact' | 'fullpage') => void;
  setActiveConversation: (conversation: ChatConversation | null) => void;
  loadMoreMessages: () => Promise<void>;
  setTyping: (conversationId: string, isTyping: boolean) => void;
  sendMessage: (conversationId: string, content: string, type?: 'text' | 'image' | 'file', fileData?: any) => Promise<void>;
  markAsRead: (conversationId: string) => Promise<void>;
  startDirectChat: (userId: string) => Promise<void>;
  openPersonalChat: () => Promise<void>;
  createChannel: (name: string, description: string, type: 'public' | 'private') => Promise<void>;
  createGroup: (name: string, participantIds: string[], description?: string) => Promise<void>;
  joinChannel: (channelId: string) => Promise<void>;
  leaveChannel: (channelId: string) => Promise<void>;
  addGroupMembers: (groupId: string, userIds: string[]) => Promise<void>;
  removeGroupMember: (groupId: string, userId: string) => Promise<void>;
  deleteConversation: (conversationId: string) => Promise<void>;
  pinConversation: (conversationId: string) => Promise<void>;
  muteConversation: (conversationId: string) => Promise<void>;
  archiveConversation: (conversationId: string) => Promise<void>;
  deleteMessage: (conversationId: string, messageId: string) => Promise<void>;
  editMessage: (conversationId: string, messageId: string, newContent: string) => Promise<void>;
  addReaction: (conversationId: string, messageId: string, emoji: string) => Promise<void>;
  uploadFile: (conversationId: string, file: File) => Promise<void>;
  getConversationFiles: (conversationId: string) => ChatFile[];
  getAllFiles: () => ChatFile[];
  searchMessages: (query: string) => Promise<ChatMessage[]>;
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
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const [typingUsers, setTypingUsers] = useState<Map<string, string[]>>(new Map());
  const [messageCache, setMessageCache] = useState<Map<string, ChatMessage[]>>(new Map());
  const [conversationLoading, setConversationLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'compact' | 'fullpage'>('compact');
  const subscriptionRef = useRef<any>(null);

  // Enable chat notifications
  useChatNotifications();

  useEffect(() => {
    if (currentUser) {
      loadData();
      const cleanup = subscribeToMessages();
      return cleanup;
    }
  }, [currentUser]);

  // Online status tracking
  useEffect(() => {
    if (!currentUser) return;

    const channel = supabase.channel('online-users')
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const online = new Set(Object.keys(state));
        setOnlineUsers(online);
      })
      .on('presence', { event: 'join' }, ({ key }) => {
        setOnlineUsers(prev => new Set([...prev, key]));
      })
      .on('presence', { event: 'leave' }, ({ key }) => {
        setOnlineUsers(prev => {
          const newSet = new Set(prev);
          newSet.delete(key);
          return newSet;
        });
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({ user_id: currentUser.id, online_at: new Date().toISOString() });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser]);

  const loadData = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      
      // Load conversations
      const conversationsData = await chatApi.getMyConversations(currentUser.id);
      
      // Map Supabase data to local format
      const mappedConversations: ChatConversation[] = conversationsData.map((c: any) => {
        const conv = c.conversation;
        const isDirect = conv.type === 'direct';
        const isPersonal = conv.type === 'personal';
        const otherParticipant = isDirect 
          ? conv.participants?.find((p: any) => p.user.id !== currentUser.id)?.user
          : null;

        return {
          id: conv.id,
          type: conv.type,
          name: isPersonal ? '📝 Personal Notes' : conv.name,
          description: conv.description,
          participantId: isPersonal ? currentUser.id : otherParticipant?.id,
          participantName: isPersonal ? 'You' : otherParticipant?.full_name,
          participantAvatar: isPersonal ? currentUser.avatar : otherParticipant?.avatar_url,
          participantStatus: isPersonal ? 'online' : otherParticipant?.status,
          participants: conv.participants?.map((p: any) => p.user.id) || [],
          admins: conv.participants?.filter((p: any) => p.role === 'admin').map((p: any) => p.user.id) || [],
          lastMessage: conv.last_message?.[0]?.content || '',
          lastMessageTime: conv.last_message?.[0]?.created_at || conv.created_at,
          unreadCount: 0, // Calculate based on last_read_at
          pinned: conv.pinned,
          archived: conv.archived,
          messages: []
        };
      });

      setConversations(mappedConversations);

      // Load users
      const allUsers = await usersApi.getAllUsers();
      setUsers(allUsers.map((u: any) => ({
        id: u.id,
        name: u.full_name,
        avatar: u.avatar_url || '/imgs/default-avatar.png',
        status: u.status,
        role: u.role
      })));

    } catch (error) {
      console.error('Failed to load chat data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadConversationMessages = async (conversationId: string, offset = 0, limit = 50) => {
    try {
      // Check cache first for initial load
      if (offset === 0 && messageCache.has(conversationId)) {
        return messageCache.get(conversationId)!;
      }

      const messages = await chatApi.getMessages(conversationId, limit, offset);
      
      const mappedMessages: ChatMessage[] = messages.map((m: any) => ({
        id: m.id,
        senderId: m.sender_id,
        senderName: m.sender.full_name,
        senderAvatar: m.sender.avatar_url || '/imgs/default-avatar.png',
        content: m.content,
        timestamp: m.created_at,
        read: m.read,
        type: m.type,
        fileUrl: m.file_url,
        fileName: m.file_name,
        fileSize: m.file_size,
        edited: m.edited,
        reactions: m.reactions?.map((r: any) => ({
          emoji: r.emoji,
          userId: r.user_id,
          userName: r.user.full_name
        })) || []
      }));

      // Update cache for initial load
      if (offset === 0) {
        messageCache.set(conversationId, mappedMessages);
        setMessageCache(new Map(messageCache));
      }

      setHasMoreMessages(messages.length === limit);
      return mappedMessages;
    } catch (error) {
      console.error('Failed to load messages:', error);
      return [];
    }
  };

  const loadMoreMessages = async () => {
    if (!activeConversation || loadingMore || !hasMoreMessages) return;
    
    setLoadingMore(true);
    try {
      const offset = activeConversation.messages.length;
      const olderMessages = await loadConversationMessages(activeConversation.id, offset);
      
      setActiveConversation(prev => prev ? {
        ...prev,
        messages: [...olderMessages, ...prev.messages]
      } : null);
    } finally {
      setLoadingMore(false);
    }
  };

  const setTyping = (conversationId: string, isTyping: boolean) => {
    if (!currentUser) return;
    
    setTypingUsers(prev => {
      const newMap = new Map(prev);
      const currentTypers = newMap.get(conversationId) || [];
      
      if (isTyping) {
        if (!currentTypers.includes(currentUser.id)) {
          newMap.set(conversationId, [...currentTypers, currentUser.id]);
        }
      } else {
        newMap.set(conversationId, currentTypers.filter(id => id !== currentUser.id));
      }
      
      return newMap;
    });
  };

  // Debounce timer for conversation list updates
  let updateConversationsTimer: NodeJS.Timeout | null = null;

  const subscribeToMessages = () => {
    if (!currentUser || subscriptionRef.current) return () => {};

    console.log('🔔 Setting up real-time message subscription');

    const channel = supabase
      .channel('messages-realtime', {
        config: {
          broadcast: { self: false }, // Don't receive own messages via broadcast
          presence: { key: currentUser.id }
        }
      })
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages'
        },
        async (payload) => {
          const newMessage = payload.new as any;
          console.log('📨 New message:', newMessage.id.substring(0, 8));
          
          // Check if message is for active conversation
          setActiveConversation(prev => {
            if (!prev || prev.id !== newMessage.conversation_id) {
              console.log('ℹ️ Message for different conversation');
              return prev;
            }

            console.log('✅ Message for active conversation');
            
            // Optimistically add the message immediately
            const optimisticMessage = {
              id: newMessage.id,
              senderId: newMessage.sender_id,
              senderName: newMessage.sender_id === currentUser.id ? currentUser.fullName : prev.participantName || 'User',
              senderAvatar: newMessage.sender_id === currentUser.id ? currentUser.avatar : prev.participantAvatar || '/imgs/default-avatar.png',
              content: newMessage.content,
              timestamp: newMessage.created_at,
              read: false,
              type: newMessage.type || 'text',
              fileUrl: newMessage.file_url,
              fileName: newMessage.file_name,
              fileSize: newMessage.file_size,
              edited: false,
              reactions: []
            };

            // Check if message already exists (avoid duplicates)
            const messageExists = prev.messages.some(m => m.id === newMessage.id);
            if (messageExists) {
              console.log('⚠️ Message already exists, skipping');
              return prev;
            }

            // Remove any temporary optimistic messages with similar content and timestamp
            const filteredMessages = prev.messages.filter(m => {
              if (m.id.startsWith('temp-') && 
                  m.content === newMessage.content && 
                  m.senderId === newMessage.sender_id) {
                console.log('🗑️ Removing optimistic message');
                return false;
              }
              return true;
            });

            // Add message to the list
            return {
              ...prev,
              messages: [...filteredMessages, optimisticMessage],
              lastMessage: newMessage.content,
              lastMessageTime: newMessage.created_at
            };
          });
          
          // Debounce conversation list updates (avoid excessive reloads)
          if (updateConversationsTimer) {
            clearTimeout(updateConversationsTimer);
          }
          updateConversationsTimer = setTimeout(() => {
            console.log('🔄 Updating conversations list');
            loadData();
          }, 1000); // Wait 1 second before updating
        }
      )
      .subscribe((status, err) => {
        if (status === 'SUBSCRIBED') {
          console.log('✅ Real-time connected');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('❌ Channel error:', err);
          // Auto-reconnect after 5 seconds
          setTimeout(() => {
            console.log('🔄 Attempting to reconnect...');
            channel.subscribe();
          }, 5000);
        } else if (status === 'TIMED_OUT') {
          console.error('⏱️ Connection timed out, reconnecting...');
          channel.subscribe();
        } else if (status === 'CLOSED') {
          console.warn('⚠️ Connection closed');
        }
      });

    subscriptionRef.current = channel;

    return () => {
      console.log('👋 Cleaning up real-time subscription');
      if (updateConversationsTimer) {
        clearTimeout(updateConversationsTimer);
      }
      channel.unsubscribe();
      subscriptionRef.current = null;
    };
  };

  const unreadCount = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  const sendMessage = async (conversationId: string, content: string, type: 'text' | 'image' | 'file' = 'text', fileData?: any) => {
    if (!currentUser) return;

    try {
      const messageType = type === 'image' ? 'file' : type;
      await chatApi.sendMessage(
        conversationId,
        currentUser.id,
        content,
        messageType,
        fileData?.url,
        fileData?.name,
        fileData?.size
      );

      // Real-time listener will handle adding the message to UI
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  };

  const markAsRead = async (conversationId: string) => {
    if (!currentUser) return;

    try {
      await chatApi.markAsRead(conversationId, currentUser.id);
      
      setConversations(prev => prev.map(conv => {
        if (conv.id === conversationId) {
          return { ...conv, unreadCount: 0 };
        }
        return conv;
      }));
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const startDirectChat = async (userId: string) => {
    if (!currentUser) return;

    try {
      const conversationId = await chatApi.createDirectConversation(currentUser.id, userId);
      await loadData();
      
      const conversation = conversations.find(c => c.id === conversationId);
      if (conversation) {
        const messages = await loadConversationMessages(conversationId);
        setActiveConversation({ ...conversation, messages });
      }
    } catch (error) {
      console.error('Failed to start direct chat:', error);
    }
  };

  const openPersonalChat = async () => {
    if (!currentUser) return;

    try {
      console.log('Opening personal chat for user:', currentUser.id);
      
      // First check if personal chat already exists in loaded conversations
      const existingPersonal = conversations.find(c => c.type === 'personal');
      if (existingPersonal) {
        console.log('Found existing personal chat:', existingPersonal.id);
        const messages = await loadConversationMessages(existingPersonal.id);
        setActiveConversation({ ...existingPersonal, messages });
        return;
      }

      // Create new personal chat
      console.log('Creating new personal chat...');
      const conversationId = await chatApi.createPersonalChat(currentUser.id);
      console.log('Personal chat created:', conversationId);
      
      // Reload conversations to get the new one
      await loadData();
      
      // Wait a bit for state to update, then load the conversation directly
      console.log('Loading messages for personal chat...');
      const messages = await loadConversationMessages(conversationId);
      
      // Create a temporary conversation object to display immediately
      const tempConversation: ChatConversation = {
        id: conversationId,
        type: 'personal',
        name: '📝 Personal Notes',
        participantId: currentUser.id,
        participantName: 'You',
        participantAvatar: currentUser.avatar,
        participantStatus: 'online',
        participants: [currentUser.id],
        admins: [currentUser.id],
        lastMessage: '',
        lastMessageTime: new Date().toISOString(),
        unreadCount: 0,
        pinned: false,
        archived: false,
        messages
      };
      
      setActiveConversation(tempConversation);
      console.log('Personal chat opened successfully!');
    } catch (error) {
      console.error('Failed to open personal chat:', error);
      alert('Failed to open personal chat. Please check the console for details.');
    }
  };

  const createChannel = async (name: string, description: string, type: 'public' | 'private') => {
    if (!currentUser) return;

    try {
      await chatApi.createGroupConversation(name, currentUser.id, [currentUser.id]);
      await loadData();
    } catch (error) {
      console.error('Failed to create channel:', error);
    }
  };

  const createGroup = async (name: string, participantIds: string[], description?: string) => {
    if (!currentUser) return;

    try {
      await chatApi.createGroupConversation(name, currentUser.id, participantIds);
      await loadData();
    } catch (error) {
      console.error('Failed to create group:', error);
    }
  };

  const joinChannel = async (channelId: string) => {
    // Implement channel joining logic
    console.log('Join channel:', channelId);
  };

  const leaveChannel = async (channelId: string) => {
    // Implement channel leaving logic
    console.log('Leave channel:', channelId);
  };

  const addGroupMembers = async (groupId: string, userIds: string[]) => {
    // Implement add members logic
    console.log('Add members:', groupId, userIds);
  };

  const removeGroupMember = async (groupId: string, userId: string) => {
    // Implement remove member logic
    console.log('Remove member:', groupId, userId);
  };

  const deleteConversation = async (conversationId: string) => {
    try {
      // Note: This might need admin permissions
      setConversations(prev => prev.filter(c => c.id !== conversationId));
      if (activeConversation?.id === conversationId) {
        setActiveConversation(null);
      }
    } catch (error) {
      console.error('Failed to delete conversation:', error);
    }
  };

  const pinConversation = async (conversationId: string) => {
    try {
      const conv = conversations.find(c => c.id === conversationId);
      if (conv) {
        await chatApi.togglePin(conversationId, !conv.pinned);
        setConversations(prev => prev.map(c => 
          c.id === conversationId ? { ...c, pinned: !c.pinned } : c
        ));
      }
    } catch (error) {
      console.error('Failed to pin conversation:', error);
    }
  };

  const muteConversation = async (conversationId: string) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        return { ...conv, muted: !conv.muted };
      }
      return conv;
    }));
  };

  const archiveConversation = async (conversationId: string) => {
    try {
      const conv = conversations.find(c => c.id === conversationId);
      if (conv) {
        await chatApi.toggleArchive(conversationId, !conv.archived);
        setConversations(prev => prev.map(c => 
          c.id === conversationId ? { ...c, archived: !c.archived } : c
        ));
      }
    } catch (error) {
      console.error('Failed to archive conversation:', error);
    }
  };

  const deleteMessage = async (conversationId: string, messageId: string) => {
    try {
      await chatApi.deleteMessage(messageId);
      
      if (activeConversation?.id === conversationId) {
        setActiveConversation(prev => prev ? {
          ...prev,
          messages: prev.messages.filter(msg => msg.id !== messageId)
        } : null);
      }
    } catch (error) {
      console.error('Failed to delete message:', error);
    }
  };

  const editMessage = async (conversationId: string, messageId: string, newContent: string) => {
    try {
      await chatApi.editMessage(messageId, newContent);
      
      if (activeConversation?.id === conversationId) {
        setActiveConversation(prev => prev ? {
          ...prev,
          messages: prev.messages.map(msg => 
            msg.id === messageId 
              ? { ...msg, content: newContent, edited: true }
              : msg
          )
        } : null);
      }
    } catch (error) {
      console.error('Failed to edit message:', error);
    }
  };

  const addReaction = async (conversationId: string, messageId: string, emoji: string) => {
    if (!currentUser) return;

    try {
      await chatApi.addReaction(messageId, currentUser.id, emoji);
      
      // Update will come through real-time subscription
    } catch (error) {
      console.error('Failed to add reaction:', error);
    }
  };

  const uploadFile = async (conversationId: string, file: File) => {
    if (!currentUser) return;

    try {
      const path = `${currentUser.id}/${Date.now()}-${file.name}`;
      const { url } = await uploadToStorage('chat-files', path, file);
      
      if (url) {
        await sendMessage(conversationId, file.name, 'file', {
          url,
          name: file.name,
          size: file.size
        });
      }
    } catch (error) {
      console.error('Failed to upload file:', error);
      throw error;
    }
  };

  const getConversationFiles = (conversationId: string) => {
    return files.filter(f => f.conversationId === conversationId);
  };

  const getAllFiles = () => {
    return files;
  };

  const searchMessages = async (query: string): Promise<ChatMessage[]> => {
    if (!activeConversation || !query.trim()) return [];
    
    try {
      // Search in the database for the active conversation
      const results = await chatApi.searchMessages(activeConversation.id, query);
      
      // Map to ChatMessage format
      return results.map((m: any) => ({
        id: m.id,
        senderId: m.sender_id,
        senderName: m.sender.full_name,
        senderAvatar: m.sender.avatar_url || '/imgs/default-avatar.png',
        content: m.content,
        timestamp: m.created_at,
        read: m.read,
        type: m.type,
        fileUrl: m.file_url,
        fileName: m.file_name,
        fileSize: m.file_size,
        edited: m.edited,
        reactions: []
      }));
    } catch (error) {
      console.error('Failed to search messages:', error);
      return [];
    }
  };

  // Load messages when active conversation changes
  useEffect(() => {
    if (activeConversation && activeConversation.messages.length === 0) {
      setConversationLoading(true);
      loadConversationMessages(activeConversation.id).then(messages => {
        setActiveConversation(prev => prev ? { ...prev, messages } : null);
        setConversationLoading(false);
      }).catch(() => {
        setConversationLoading(false);
      });
    }
  }, [activeConversation?.id]);

  return (
    <EnhancedChatContext.Provider value={{
      conversations,
      channels,
      groups,
      activeConversation,
      users,
      files,
      unreadCount,
      loading,
      conversationLoading,
      loadingMore,
      hasMoreMessages,
      onlineUsers,
      typingUsers,
      viewMode,
      setViewMode,
      setActiveConversation,
      loadMoreMessages,
      setTyping,
      sendMessage,
      markAsRead,
      startDirectChat,
      openPersonalChat,
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
