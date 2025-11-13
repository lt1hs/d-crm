import React, { useState } from 'react';
import { useEnhancedChat } from '../../context/EnhancedChatContext';
import ChatConversationList from './ChatConversationList';
import ChatMessageView from './ChatMessageView';
import ChatSidebar from './ChatSidebar';
import { IconMessageCircle } from '../Icons';

const ChatManagement: React.FC = () => {
  const { activeConversation, conversations } = useEnhancedChat();
  const [showSidebar, setShowSidebar] = useState(true);

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800">
      {/* Header */}
      <div className="border-b dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <IconMessageCircle className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Chat Management
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {conversations.length} conversations
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Channels/Groups */}
        {showSidebar && (
          <div className="w-64 border-r dark:border-gray-700 flex-shrink-0">
            <ChatSidebar />
          </div>
        )}

        {/* Conversations List */}
        <div className="w-80 border-r dark:border-gray-700 flex-shrink-0">
          <ChatConversationList />
        </div>

        {/* Messages View */}
        <div className="flex-1">
          {activeConversation ? (
            <ChatMessageView />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
              <div className="text-center">
                <IconMessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">Select a conversation to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatManagement;
