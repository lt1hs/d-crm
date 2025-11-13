export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: string;
  read: boolean;
  type: 'text' | 'image' | 'file';
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  replyTo?: string;
  edited?: boolean;
  editedAt?: string;
  reactions?: ChatReaction[];
}

export interface ChatReaction {
  emoji: string;
  userId: string;
  userName: string;
}

export interface ChatConversation {
  id: string;
  type: 'direct' | 'group' | 'channel';
  participantId?: string;
  participantName?: string;
  participantAvatar?: string;
  participantStatus?: 'online' | 'offline' | 'away';
  name?: string;
  description?: string;
  avatar?: string;
  participants?: string[];
  admins?: string[];
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: ChatMessage[];
  pinned?: boolean;
  muted?: boolean;
  archived?: boolean;
}

export interface ChatUser {
  id: string;
  name: string;
  avatar?: string;
  status: 'online' | 'offline' | 'away';
  role?: string;
  lastSeen?: string;
}

export interface ChatChannel {
  id: string;
  name: string;
  description: string;
  avatar?: string;
  type: 'public' | 'private';
  memberCount: number;
  createdBy: string;
  createdAt: string;
  admins: string[];
}

export interface ChatGroup {
  id: string;
  name: string;
  description?: string;
  avatar?: string;
  participants: string[];
  admins: string[];
  createdBy: string;
  createdAt: string;
}

export interface ChatFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedBy: string;
  uploadedByName: string;
  uploadedAt: string;
  conversationId: string;
  conversationName: string;
  messageId: string;
}
