import React, { useState } from 'react';
import { useEnhancedChat } from '../../context/EnhancedChatContext';
import { useAuth } from '../../context/AuthContext';
import { IconSearch, IconPlus, IconPin, IconArchive } from '../Icons';
import { formatDistanceToNow } from '../../utils/chatHelpers.ts';

const ChatConversationList: React.FC = () => {
  const { 
    conversations, 
    activeConversation, 
    setActiveConversation,
    users,
    startDirectChat,
    openPersonalChat,
    markAsRead
  } = useEnhancedChat();
  const { currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewChat, setShowNewChat] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | 'pinned' | 'archived'>('all');

  const filteredConversations = conversations.filter(conv => {
    // Apply search filter
    const matchesSearch = 
      conv.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.participantName?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    // Apply status filter
    if (filter === 'unread') return conv.unreadCount > 0;
    if (filter === 'pinned') return conv.pinned;
    if (filter === 'archived') return conv.archived;
    
    return !conv.archived; // Default: show all except archived
  });

  // Sort: pinned first, then by last message time
  const sortedConversations = [...filteredConversations].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime();
  });

  const availableUsers = users.filter(u => 
    u.id !== currentUser?.id && 
    !conversations.some(c => c.type === 'direct' && c.participantId === u.id)
  );

  const handleConversationClick = (conv: any) => {
    setActiveConversation(conv);
    markAsRead(conv.id);
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800">
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

      {/* Filters */}
      <div className="flex gap-1 p-2 border-b dark:border-gray-700 overflow-x-auto">
        {(['all', 'unread', 'pinned', 'archived'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              filter === f
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Personal Chat & New Chat Buttons */}
      <div className="p-3 border-b dark:border-gray-700 space-y-2">
        {/* Personal Chat Button */}
        <button
          type="button"
          onClick={() => openPersonalChat()}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg transition-all shadow-sm hover:shadow-md"
        >
          <span className="text-lg">📝</span>
          <span className="text-sm font-medium">Personal Notes</span>
        </button>
        
        {/* New Direct Chat Button */}
        <button
          type="button"
          onClick={() => setShowNewChat(!showNewChat)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <IconPlus className="w-4 h-4" />
          <span className="text-sm font-medium">New Direct Chat</span>
        </button>
      </div>

      {/* New Chat User List */}
      {showNewChat && (
        <div className="p-3 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-900 max-h-48 overflow-y-auto">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Start a conversation</p>
          <div className="space-y-1">
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
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{user.role}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Conversations */}
      <div className="flex-1 overflow-y-auto">
        {sortedConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500 p-4">
            <p className="text-sm text-center">No conversations found</p>
          </div>
        ) : (
          <div className="divide-y dark:divide-gray-700">
            {sortedConversations.map(conv => (
              <button
                key={conv.id}
                onClick={() => handleConversationClick(conv)}
                className={`w-full p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left ${
                  activeConversation?.id === conv.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                }`}
                aria-label={`Open conversation with ${conv.name || conv.participantName}`}
              >
                <div className="flex items-start gap-3">
                  <div className="relative flex-shrink-0">
                    {conv.type === 'personal' ? (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center text-white text-xl">
                        📝
                      </div>
                    ) : conv.type === 'direct' ? (
                      <>
                        <img
                          src={conv.participantAvatar || '/imgs/default-avatar.png'}
                          alt={conv.participantName}
                          className="w-12 h-12 rounded-full"
                        />
                        <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${
                          conv.participantStatus === 'online' ? 'bg-green-500' : 'bg-gray-400'
                        }`} />
                      </>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                        {conv.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        {conv.pinned && <IconPin className="w-3 h-3 text-blue-600" />}
                        <h4 className="font-medium text-sm truncate">
                          {conv.name || conv.participantName}
                        </h4>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                        {formatDistanceToNow(conv.lastMessageTime)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate flex-1">
                        {conv.lastMessage || 'No messages yet'}
                      </p>
                      {conv.unreadCount > 0 && (
                        <span className="flex-shrink-0 ml-2 bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                          {conv.unreadCount > 9 ? '9+' : conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatConversationList;
