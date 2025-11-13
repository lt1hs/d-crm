import React, { useState } from 'react';
import { useEnhancedChat } from '../../context/EnhancedChatContext';
import ChatConversationList from './ChatConversationList';
import ChatMessageView from './ChatMessageView';
import ChatSidebar from './ChatSidebar';
import { IconMessageCircle, IconUsers, IconHash, IconBell, IconSettings } from '../Icons';

const ChatManagement: React.FC = () => {
  const { activeConversation, conversations, channels, groups } = useEnhancedChat();
  const [showSidebar, setShowSidebar] = useState(true);

  // Calculate stats
  const unreadCount = conversations.filter(c => c.unreadCount > 0).length;
  const activeChannels = channels?.length || 0;
  const activeGroups = groups?.length || 0;

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Sleek Compact Header */}
      <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
        <div className="px-4 py-2.5">
          <div className="flex items-center justify-between">
            {/* Left: Title & Stats */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                  <IconMessageCircle className="w-4 h-4 text-white" />
                </div>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Chat & Messaging
                </h1>
              </div>
              
              {/* Inline Stats */}
              <div className="flex items-center gap-3 pl-3 border-l dark:border-gray-700">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {conversations.length} chats
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {activeChannels} channels
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {activeGroups} groups
                  </span>
                </div>
                {unreadCount > 0 && (
                  <div className="flex items-center gap-1.5 px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                    <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
                    <span className="text-xs font-medium text-orange-700 dark:text-orange-400">
                      {unreadCount} unread
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowSidebar(!showSidebar)}
                className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors text-xs font-medium"
              >
                {showSidebar ? 'Hide' : 'Show'} Sidebar
              </button>
              <button
                type="button"
                className="p-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                aria-label="Notifications"
              >
                <IconBell className="w-4 h-4" />
              </button>
              <button
                type="button"
                className="p-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                aria-label="Settings"
              >
                <IconSettings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden p-4 gap-4">
        {/* Sidebar - Channels/Groups */}
        {showSidebar && (
          <div className="w-64 flex-shrink-0">
            <div className="h-full bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <ChatSidebar />
            </div>
          </div>
        )}

        {/* Conversations List */}
        <div className={`${showSidebar ? 'w-80' : 'w-96'} flex-shrink-0 transition-all duration-300`}>
          <div className="h-full bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <ChatConversationList />
          </div>
        </div>

        {/* Messages View */}
        <div className="flex-1 min-w-0">
          <div className="h-full bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            {activeConversation ? (
              <ChatMessageView />
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="inline-flex p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-full mb-4">
                    <IconMessageCircle className="w-16 h-16 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    No conversation selected
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 max-w-sm">
                    Choose a conversation from the list to start chatting, or create a new one
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatManagement;
