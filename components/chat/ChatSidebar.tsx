import React, { useState } from 'react';
import { useEnhancedChat } from '../../context/EnhancedChatContext';
import { IconPlus, IconHash, IconUsers, IconFileText } from '../Icons';
import CreateChannelModal from './CreateChannelModal';
import CreateGroupModal from './CreateGroupModal';
import ChatFilesModal from './ChatFilesModal';

const ChatSidebar: React.FC = () => {
  const { channels, groups, conversations, setActiveConversation } = useEnhancedChat();
  const [showCreateChannel, setShowCreateChannel] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showFiles, setShowFiles] = useState(false);
  const [activeTab, setActiveTab] = useState<'channels' | 'groups'>('channels');

  const channelConversations = conversations.filter(c => c.type === 'channel');
  const groupConversations = conversations.filter(c => c.type === 'group');

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Tabs */}
      <div className="flex border-b dark:border-gray-700">
        <button
          onClick={() => setActiveTab('channels')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'channels'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          Channels
        </button>
        <button
          onClick={() => setActiveTab('groups')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'groups'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          Groups
        </button>
      </div>

      {/* Actions */}
      <div className="p-3 border-b dark:border-gray-700 space-y-2">
        <button
          onClick={() => activeTab === 'channels' ? setShowCreateChannel(true) : setShowCreateGroup(true)}
          className="w-full flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
        >
          <IconPlus className="w-4 h-4" />
          <span>Create {activeTab === 'channels' ? 'Channel' : 'Group'}</span>
        </button>
        <button
          onClick={() => setShowFiles(true)}
          className="w-full flex items-center gap-2 px-3 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors text-sm"
        >
          <IconFileText className="w-4 h-4" />
          <span>Files Manager</span>
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-2">
        {activeTab === 'channels' ? (
          <div className="space-y-1">
            {channelConversations.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                No channels yet
              </p>
            ) : (
              channelConversations.map(conv => (
                <button
                  key={conv.id}
                  onClick={() => setActiveConversation(conv)}
                  className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors text-left"
                >
                  <IconHash className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium truncate">{conv.name}</span>
                  {conv.unreadCount > 0 && (
                    <span className="ml-auto bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {conv.unreadCount}
                    </span>
                  )}
                </button>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-1">
            {groupConversations.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                No groups yet
              </p>
            ) : (
              groupConversations.map(conv => (
                <button
                  key={conv.id}
                  onClick={() => setActiveConversation(conv)}
                  className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors text-left"
                >
                  <IconUsers className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium truncate">{conv.name}</span>
                  {conv.unreadCount > 0 && (
                    <span className="ml-auto bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {conv.unreadCount}
                    </span>
                  )}
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {showCreateChannel && <CreateChannelModal onClose={() => setShowCreateChannel(false)} />}
      {showCreateGroup && <CreateGroupModal onClose={() => setShowCreateGroup(false)} />}
      {showFiles && <ChatFilesModal onClose={() => setShowFiles(false)} />}
    </div>
  );
};

export default ChatSidebar;
