import React, { useState, useRef, useEffect } from 'react';
import { useEnhancedChat } from '../../context/EnhancedChatContext';
import { useAuth } from '../../context/AuthContext';
import { 
  IconMessageCircle, IconX, IconSend, IconPaperclip, 
  IconSearch, IconPlus, IconMoreVertical, IconTrash,
  IconChevronLeft
} from '../Icons';
import { formatDistanceToNow } from '../../utils/chatHelpers.ts';

interface ChatPanelProps {
  isExpanded: boolean;
  onToggle: () => void;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ isExpanded, onToggle }) => {
  const { 
    conversations, 
    activeConversation, 
    users, 
    unreadCount,
    setActiveConversation,
    sendMessage,
    markAsRead,
    startDirectChat,
    deleteConversation
  } = useEnhancedChat();
  const { currentUser } = useAuth();
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewChat, setShowNewChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (activeConversation) {
      scrollToBottom();
      markAsRead(activeConversation.id);
    }
  }, [activeConversation?.messages]);

  const handleSendMessage = () => {
    if (!messageInput.trim() || !activeConversation) return;
    
    sendMessage(activeConversation.id, messageInput.trim());
    setMessageInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Only show direct messages in compact panel
  const directConversations = conversations.filter(conv => conv.type === 'direct');
  
  const filteredConversations = directConversations.filter(conv =>
    conv.participantName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const availableUsers = users.filter(u => 
    u.id !== currentUser?.id && 
    !conversations.some(c => c.type === 'direct' && c.participantId === u.id)
  );

  // Compact view - Enhanced with pulse animation
  if (!isExpanded) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          type="button"
          onClick={onToggle}
          className="relative bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-full p-4 shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95"
          aria-label="Open chat"
        >
          <IconMessageCircle className="w-6 h-6" />
          {unreadCount > 0 && (
            <>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse shadow-lg">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
              <span className="absolute inset-0 rounded-full bg-red-500 opacity-75 animate-ping"></span>
            </>
          )}
        </button>
      </div>
    );
  }

  // Expanded view
  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 h-[600px] bg-white dark:bg-gray-800 rounded-lg shadow-2xl flex flex-col border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b dark:border-gray-700 bg-blue-600 text-white rounded-t-lg">
        <div className="flex items-center gap-2">
          {activeConversation && (
            <button
              onClick={() => setActiveConversation(null)}
              className="p-1 hover:bg-blue-700 rounded transition-colors"
              aria-label="Back to conversations"
            >
              <IconChevronLeft className="w-5 h-5" />
            </button>
          )}
          <IconMessageCircle className="w-5 h-5" />
          <h3 className="font-semibold">
            {activeConversation ? activeConversation.participantName : 'Messages'}
          </h3>
        </div>
        <button
          onClick={onToggle}
          className="p-1 hover:bg-blue-700 rounded transition-colors"
          aria-label="Close chat"
        >
          <IconX className="w-5 h-5" />
        </button>
      </div>

      {/* Conversations List */}
      {!activeConversation && (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Search */}
          <div className="p-3 border-b dark:border-gray-700">
            <div className="relative">
              <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* New Chat Button */}
          <div className="p-3 border-b dark:border-gray-700">
            <button
              onClick={() => setShowNewChat(!showNewChat)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <IconPlus className="w-4 h-4" />
              <span className="text-sm font-medium">New Chat</span>
            </button>
          </div>

          {/* New Chat User List */}
          {showNewChat && (
            <div className="p-3 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Start a conversation</p>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {availableUsers.map(user => (
                  <button
                    key={user.id}
                    onClick={() => {
                      startDirectChat(user.id);
                      setShowNewChat(false);
                    }}
                    className="w-full flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    aria-label={`Start conversation with ${user.name}`}
                  >
                    <div className="relative">
                      <img
                        src={user.avatar || '/imgs/default-avatar.png'}
                        alt={user.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-gray-800 ${
                        user.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                      }`} />
                    </div>
                    <span className="text-sm font-medium">{user.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500">
                <IconMessageCircle className="w-12 h-12 mb-2" />
                <p className="text-sm">No conversations yet</p>
              </div>
            ) : (
              <div className="divide-y dark:divide-gray-700">
                {filteredConversations.map(conv => (
                  <button
                    key={conv.id}
                    onClick={() => setActiveConversation(conv)}
                    className="w-full p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                    aria-label={`Open conversation with ${conv.participantName}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative flex-shrink-0">
                        <img
                          src={conv.participantAvatar || '/imgs/default-avatar.png'}
                          alt={conv.participantName}
                          className="w-12 h-12 rounded-full"
                        />
                        <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${
                          conv.participantStatus === 'online' ? 'bg-green-500' : 'bg-gray-400'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-sm truncate">{conv.participantName}</h4>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDistanceToNow(conv.lastMessageTime)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                          {conv.lastMessage || 'No messages yet'}
                        </p>
                      </div>
                      {conv.unreadCount > 0 && (
                        <span className="flex-shrink-0 bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Active Conversation */}
      {activeConversation && (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {activeConversation.messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-500">
                <p className="text-sm">Start the conversation</p>
              </div>
            ) : (
              activeConversation.messages.map(msg => {
                const isOwn = msg.senderId === currentUser?.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex gap-2 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    <img
                      src={msg.senderAvatar || '/imgs/default-avatar.png'}
                      alt={msg.senderName}
                      className="w-8 h-8 rounded-full flex-shrink-0"
                    />
                    <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} max-w-[70%]`}>
                      <div className={`px-4 py-2 rounded-lg ${
                        isOwn 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                      }`}>
                        <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {formatDistanceToNow(msg.timestamp)}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t dark:border-gray-700">
            <div className="flex items-end gap-2">
              <button 
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                aria-label="Attach file"
              >
                <IconPaperclip className="w-5 h-5" />
              </button>
              <textarea
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                rows={1}
                className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSendMessage}
                disabled={!messageInput.trim()}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Send message"
              >
                <IconSend className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPanel;
