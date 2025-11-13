import React, { useState } from 'react';
import { useEnhancedChat } from '../../context/EnhancedChatContext';
import { IconX, IconSearch, IconCheck } from '../Icons';

interface ForwardMessageProps {
  message: any;
  onClose: () => void;
  onForward: (conversationIds: string[]) => void;
}

const ForwardMessage: React.FC<ForwardMessageProps> = ({ message, onClose, onForward }) => {
  const { conversations } = useEnhancedChat();
  const [selectedConversations, setSelectedConversations] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConversations = conversations.filter(conv =>
    (conv.name || conv.participantName || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleConversation = (convId: string) => {
    setSelectedConversations(prev =>
      prev.includes(convId)
        ? prev.filter(id => id !== convId)
        : [...prev, convId]
    );
  };

  const handleForward = () => {
    if (selectedConversations.length > 0) {
      onForward(selectedConversations);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h3 className="text-lg font-semibold">Forward Message</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            aria-label="Close"
          >
            <IconX className="w-5 h-5" />
          </button>
        </div>

        {/* Message Preview */}
        <div className="p-4 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Message to forward:</p>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border dark:border-gray-700">
            <p className="text-sm line-clamp-3">{message.content}</p>
          </div>
        </div>

        {/* Search */}
        <div className="p-4 border-b dark:border-gray-700">
          <div className="relative">
            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredConversations.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
              <p className="text-sm">No conversations found</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredConversations.map((conv) => {
                const isSelected = selectedConversations.includes(conv.id);
                return (
                  <button
                    key={conv.id}
                    type="button"
                    onClick={() => toggleConversation(conv.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700 border-2 border-transparent'
                    }`}
                  >
                    {conv.type === 'direct' ? (
                      <img
                        src={conv.participantAvatar || '/imgs/default-avatar.png'}
                        alt={conv.participantName}
                        className="w-10 h-10 rounded-full flex-shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                        {(conv.name || 'U').charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 text-left min-w-0">
                      <p className="font-medium text-sm truncate">
                        {conv.name || conv.participantName || 'Unknown'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {conv.type === 'direct' ? 'Direct message' : 
                         conv.type === 'group' ? `Group • ${conv.participants?.length || 0} members` :
                         'Channel'}
                      </p>
                    </div>
                    {isSelected && (
                      <div className="flex-shrink-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                        <IconCheck className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {selectedConversations.length} selected
            </span>
          </div>
          <button
            type="button"
            onClick={handleForward}
            disabled={selectedConversations.length === 0}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Forward to {selectedConversations.length} conversation{selectedConversations.length !== 1 ? 's' : ''}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForwardMessage;
