import React, { useState, useEffect } from 'react';
import { IconStar, IconX, IconTrash } from '../Icons';
import { formatDistanceToNow } from '../../utils/chatHelpers';

interface StarredMessage {
  id: string;
  conversationId: string;
  conversationName: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: string;
  starredAt: string;
}

interface StarredMessagesProps {
  onClose: () => void;
  onSelectMessage: (conversationId: string, messageId: string) => void;
}

const StarredMessages: React.FC<StarredMessagesProps> = ({ onClose, onSelectMessage }) => {
  const [starredMessages, setStarredMessages] = useState<StarredMessage[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('starredMessages');
    if (saved) {
      setStarredMessages(JSON.parse(saved));
    }
  }, []);

  const handleUnstar = (messageId: string) => {
    const updated = starredMessages.filter(msg => msg.id !== messageId);
    setStarredMessages(updated);
    localStorage.setItem('starredMessages', JSON.stringify(updated));
  };

  const handleClearAll = () => {
    if (confirm('Remove all starred messages?')) {
      setStarredMessages([]);
      localStorage.removeItem('starredMessages');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <div className="flex items-center gap-2">
            <IconStar className="w-5 h-5 text-yellow-500 fill-current" />
            <h3 className="text-lg font-semibold">Starred Messages</h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              ({starredMessages.length})
            </span>
          </div>
          <div className="flex items-center gap-2">
            {starredMessages.length > 0 && (
              <button
                type="button"
                onClick={handleClearAll}
                className="text-sm text-red-600 hover:text-red-700 px-3 py-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
              >
                Clear All
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              aria-label="Close"
            >
              <IconX className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          {starredMessages.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 py-12">
              <IconStar className="w-16 h-16 mx-auto mb-3 opacity-30" />
              <p className="text-lg font-medium mb-1">No starred messages</p>
              <p className="text-sm">Star important messages to find them easily later</p>
            </div>
          ) : (
            <div className="space-y-3">
              {starredMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="group relative p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors border dark:border-gray-700"
                >
                  <button
                    type="button"
                    onClick={() => {
                      onSelectMessage(msg.conversationId, msg.id);
                      onClose();
                    }}
                    className="w-full text-left"
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={msg.senderAvatar || '/imgs/default-avatar.png'}
                        alt={msg.senderName}
                        className="w-10 h-10 rounded-full flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm">{msg.senderName}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDistanceToNow(msg.timestamp)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                          in {msg.conversationName}
                        </p>
                        <p className="text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap break-words">
                          {msg.content}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                          Starred {formatDistanceToNow(msg.starredAt)}
                        </p>
                      </div>
                    </div>
                  </button>

                  {/* Unstar Button */}
                  <button
                    type="button"
                    onClick={() => handleUnstar(msg.id)}
                    className="absolute top-4 right-4 p-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                    aria-label="Remove star"
                  >
                    <IconTrash className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StarredMessages;

export const toggleStarMessage = (
  conversationId: string,
  conversationName: string,
  message: any
) => {
  const saved = localStorage.getItem('starredMessages');
  const starredMessages: StarredMessage[] = saved ? JSON.parse(saved) : [];
  
  const existingIndex = starredMessages.findIndex(msg => msg.id === message.id);
  
  if (existingIndex >= 0) {
    // Unstar
    starredMessages.splice(existingIndex, 1);
  } else {
    // Star
    starredMessages.unshift({
      id: message.id,
      conversationId,
      conversationName,
      senderId: message.senderId,
      senderName: message.senderName,
      senderAvatar: message.senderAvatar,
      content: message.content,
      timestamp: message.timestamp,
      starredAt: new Date().toISOString()
    });
  }
  
  localStorage.setItem('starredMessages', JSON.stringify(starredMessages));
  return existingIndex < 0; // Return true if starred, false if unstarred
};

export const isMessageStarred = (messageId: string): boolean => {
  const saved = localStorage.getItem('starredMessages');
  if (!saved) return false;
  const starredMessages: StarredMessage[] = JSON.parse(saved);
  return starredMessages.some(msg => msg.id === messageId);
};
