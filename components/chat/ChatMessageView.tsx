import React, { useState, useRef, useEffect } from 'react';
import { useEnhancedChat } from '../../context/EnhancedChatContext';
import { useAuth } from '../../context/AuthContext';
import { 
  IconSend, IconPaperclip, IconMoreVertical, IconPin,
  IconArchive, IconTrash, IconEdit, IconX, IconChevronLeft,
  IconMicrophone, IconSearch, IconStar, IconShare, IconDownload, IconImage,
  IconCalendar, IconClock
} from '../Icons';
import { formatDistanceToNow } from '../../utils/chatHelpers.ts';
import VoiceRecorder from './VoiceRecorder';
import AdvancedSearch from './AdvancedSearch';
import StarredMessages, { toggleStarMessage, isMessageStarred } from './StarredMessages';
import ForwardMessage from './ForwardMessage';
import LinkPreview, { detectUrls } from './LinkPreview';
import MediaGallery from './MediaGallery';
import ExportChat from './ExportChat';
import MentionInput from './MentionInput';
import EnhancedMessageInput from './EnhancedMessageInput';
import TimeOffRequest, { TimeOffRequestData } from './TimeOffRequest';

const ChatMessageView: React.FC = () => {
  const { 
    activeConversation, 
    sendMessage, 
    uploadFile,
    deleteMessage,
    editMessage,
    addReaction,
    pinConversation,
    archiveConversation,
    deleteConversation,
    setActiveConversation
  } = useEnhancedChat();
  const { currentUser } = useAuth();
  const [messageInput, setMessageInput] = useState('');
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showStarred, setShowStarred] = useState(false);
  const [forwardingMessage, setForwardingMessage] = useState<any | null>(null);
  const [showMediaGallery, setShowMediaGallery] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showTimeOffRequest, setShowTimeOffRequest] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    scrollToBottom();
  }, [activeConversation?.messages]);

  if (!activeConversation) return null;

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    
    sendMessage(activeConversation.id, messageInput.trim());
    setMessageInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleEnhancedSend = () => {
    handleSendMessage();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadFile(activeConversation.id, file);
    }
  };

  const handleEditMessage = (messageId: string, content: string) => {
    setEditingMessageId(messageId);
    setEditingContent(content);
  };

  const saveEdit = () => {
    if (editingMessageId && editingContent.trim()) {
      editMessage(activeConversation.id, editingMessageId, editingContent.trim());
      setEditingMessageId(null);
      setEditingContent('');
    }
  };

  const cancelEdit = () => {
    setEditingMessageId(null);
    setEditingContent('');
  };

  const handleVoiceSend = (audioBlob: Blob, duration: number) => {
    const audioUrl = URL.createObjectURL(audioBlob);
    sendMessage(activeConversation.id, `🎤 Voice message (${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')})`, 'file', {
      url: audioUrl,
      name: `voice-${Date.now()}.webm`,
      size: audioBlob.size
    });
    setShowVoiceRecorder(false);
  };

  const handleForward = (conversationIds: string[]) => {
    if (!forwardingMessage) return;
    conversationIds.forEach(convId => {
      sendMessage(convId, forwardingMessage.content);
    });
  };

  const handleSelectMessage = (conversationId: string, messageId: string) => {
    // Find and scroll to message
    const messageElement = document.getElementById(`message-${messageId}`);
    if (messageElement) {
      messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      messageElement.classList.add('highlight-message');
      setTimeout(() => {
        messageElement.classList.remove('highlight-message');
      }, 2000);
    }
  };

  const handleTimeOffRequest = (request: TimeOffRequestData) => {
    // Format the time off request message with special marker
    const message = `[TIME_OFF_REQUEST]${JSON.stringify(request)}`;
    
    sendMessage(activeConversation.id, message);
  };

  const renderMessageContent = (msg: any) => {
    // Check if it's a time-off request message
    if (msg.content.startsWith('[TIME_OFF_REQUEST]')) {
      try {
        const data = JSON.parse(msg.content.replace('[TIME_OFF_REQUEST]', ''));
        const isOwn = msg.senderId === currentUser?.id;
        
        return (
          <div className={`rounded-xl overflow-hidden shadow-lg border-2 ${
            isOwn 
              ? 'border-blue-400 dark:border-blue-500' 
              : 'border-green-400 dark:border-green-500'
          }`}>
            {/* Header */}
            <div className={`px-4 py-3 ${
              isOwn
                ? 'bg-gradient-to-r from-blue-500 to-blue-600'
                : 'bg-gradient-to-r from-green-500 to-green-600'
            }`}>
              <div className="flex items-center gap-2 text-white">
                <IconCalendar className="w-5 h-5" />
                <span className="font-semibold text-base">Time Off Request</span>
              </div>
            </div>
            
            {/* Content */}
            <div className={`px-4 py-4 ${
              isOwn
                ? 'bg-blue-50 dark:bg-blue-900/20'
                : 'bg-green-50 dark:bg-green-900/20'
            }`}>
              <div className="space-y-3">
                {/* Date */}
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    isOwn
                      ? 'bg-blue-100 dark:bg-blue-800/30'
                      : 'bg-green-100 dark:bg-green-800/30'
                  }`}>
                    <IconCalendar className={`w-4 h-4 ${
                      isOwn
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-green-600 dark:text-green-400'
                    }`} />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Date</div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {new Date(data.date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </div>
                  </div>
                </div>
                
                {/* Time Range */}
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    isOwn
                      ? 'bg-blue-100 dark:bg-blue-800/30'
                      : 'bg-green-100 dark:bg-green-800/30'
                  }`}>
                    <IconClock className={`w-4 h-4 ${
                      isOwn
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-green-600 dark:text-green-400'
                    }`} />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Time</div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {data.startTime} - {data.endTime}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className={`px-4 py-2 text-xs text-center ${
              isOwn
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
            }`}>
              {isOwn ? 'Request sent' : 'Request received'}
            </div>
          </div>
        );
      } catch (e) {
        return <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>;
      }
    }
    
    // Regular message
    if (msg.type === 'file') {
      return (
        <div className="flex items-center gap-2">
          <IconPaperclip className="w-4 h-4" />
          <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer" className="underline hover:opacity-80">
            {msg.fileName}
          </a>
        </div>
      );
    }
    
    return <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>;
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b dark:border-gray-700 bg-white dark:bg-gray-800 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveConversation(null)}
            className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            aria-label="Back to conversations"
          >
            <IconChevronLeft className="w-5 h-5" />
          </button>
          {activeConversation.type === 'direct' ? (
            <>
              <img
                src={activeConversation.participantAvatar || '/imgs/default-avatar.png'}
                alt={activeConversation.participantName}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <h3 className="font-semibold">{activeConversation.participantName}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {activeConversation.participantStatus === 'online' ? 'Online' : 'Offline'}
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                {activeConversation.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-semibold">{activeConversation.name}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {activeConversation.participants?.length || 0} members
                </p>
              </div>
            </>
          )}
        </div>
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            aria-label="More options"
          >
            <IconMoreVertical className="w-5 h-5" />
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 py-1 z-10">
              <button
                onClick={() => {
                  pinConversation(activeConversation.id);
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
              >
                <IconPin className="w-4 h-4" />
                {activeConversation.pinned ? 'Unpin' : 'Pin'} Conversation
              </button>
              <button
                onClick={() => {
                  archiveConversation(activeConversation.id);
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
              >
                <IconArchive className="w-4 h-4" />
                {activeConversation.archived ? 'Unarchive' : 'Archive'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowMediaGallery(true);
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
              >
                <IconImage className="w-4 h-4" />
                Media & Files
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowExport(true);
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
              >
                <IconDownload className="w-4 h-4" />
                Export Chat
              </button>
              <button
                type="button"
                onClick={() => {
                  if (confirm('Delete this conversation?')) {
                    deleteConversation(activeConversation.id);
                    setShowMenu(false);
                  }
                }}
                className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-red-600"
              >
                <IconTrash className="w-4 h-4" />
                Delete Conversation
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4 bg-gray-50 dark:bg-gray-900"
        style={{ height: 0 }}
      >
        {activeConversation.messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-500">
            <p className="text-sm">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          activeConversation.messages.map(msg => {
            const isOwn = msg.senderId === currentUser?.id;
            const isEditing = editingMessageId === msg.id;

            return (
              <div
                key={msg.id}
                id={`message-${msg.id}`}
                className={`flex gap-2 ${isOwn ? 'flex-row-reverse' : 'flex-row'} transition-all duration-300`}
              >
                <img
                  src={msg.senderAvatar || '/imgs/default-avatar.png'}
                  alt={msg.senderName}
                  className="w-8 h-8 rounded-full flex-shrink-0"
                />
                <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} max-w-[70%]`}>
                  {!isOwn && (
                    <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      {msg.senderName}
                    </span>
                  )}
                  {isEditing ? (
                    <div className="w-full">
                      <textarea
                        value={editingContent}
                        onChange={(e) => setEditingContent(e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={2}
                        aria-label="Edit message"
                      />
                      <div className="flex gap-2 mt-2">
                        <button
                          type="button"
                          onClick={saveEdit}
                          className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="px-3 py-1 bg-gray-300 dark:bg-gray-700 rounded text-xs hover:bg-gray-400 dark:hover:bg-gray-600"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="group relative">
                      {/* Check if it's a time-off request */}
                      {msg.content.startsWith('[TIME_OFF_REQUEST]') ? (
                        <div>
                          {renderMessageContent(msg)}
                        </div>
                      ) : (
                        /* Modern Message Bubble with Shadow & Animation */
                        <div className={`px-4 py-2 rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md ${
                          isOwn 
                            ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white' 
                            : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-100 dark:border-gray-700'
                        }`}>
                          {renderMessageContent(msg)}
                          {msg.edited && (
                            <span className="text-xs opacity-70 ml-2">(edited)</span>
                          )}
                        </div>
                      )}
                      
                      {/* Quick Reactions on Hover */}
                      <div className={`absolute ${isOwn ? 'left-0' : 'right-0'} -bottom-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-white dark:bg-gray-800 rounded-full shadow-lg border dark:border-gray-700 px-2 py-1`}>
                        {['👍', '❤️', '😂', '😮'].map(emoji => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => addReaction(activeConversation.id, msg.id, emoji)}
                            className="hover:scale-125 transition-transform text-sm"
                            aria-label={`React with ${emoji}`}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                      
                      {/* Action Buttons */}
                      <div className={`absolute top-0 ${isOwn ? 'right-full mr-2' : 'left-full ml-2'} opacity-0 group-hover:opacity-100 transition-opacity flex gap-1`}>
                        <button
                          type="button"
                          onClick={() => {
                            const starred = toggleStarMessage(
                              activeConversation.id,
                              activeConversation.name || activeConversation.participantName || 'Unknown',
                              msg
                            );
                          }}
                          className={`p-1 bg-white dark:bg-gray-700 rounded shadow hover:bg-gray-100 dark:hover:bg-gray-600 ${
                            isMessageStarred(msg.id) ? 'text-yellow-500' : ''
                          }`}
                          aria-label="Star message"
                        >
                          <IconStar className={`w-3 h-3 ${isMessageStarred(msg.id) ? 'fill-current' : ''}`} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setForwardingMessage(msg)}
                          className="p-1 bg-white dark:bg-gray-700 rounded shadow hover:bg-gray-100 dark:hover:bg-gray-600"
                          aria-label="Forward message"
                        >
                          <IconShare className="w-3 h-3" />
                        </button>
                        {isOwn && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleEditMessage(msg.id, msg.content)}
                              className="p-1 bg-white dark:bg-gray-700 rounded shadow hover:bg-gray-100 dark:hover:bg-gray-600"
                              aria-label="Edit message"
                            >
                              <IconEdit className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm('Delete this message?')) {
                                  deleteMessage(activeConversation.id, msg.id);
                                }
                              }}
                              className="p-1 bg-white dark:bg-gray-700 rounded shadow hover:bg-gray-100 dark:hover:bg-gray-600"
                              aria-label="Delete message"
                            >
                              <IconTrash className="w-3 h-3" />
                            </button>
                          </>
                        )}
                      </div>
                      
                      {/* Link Previews */}
                      {msg.type === 'text' && detectUrls(msg.content).map((url, idx) => (
                        <LinkPreview key={idx} url={url} />
                      ))}
                      
                      {/* Reactions Display */}
                      {msg.reactions && msg.reactions.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {Object.entries(
                            msg.reactions.reduce((acc: any, r: any) => {
                              acc[r.emoji] = (acc[r.emoji] || 0) + 1;
                              return acc;
                            }, {})
                          ).map(([emoji, count]) => (
                            <button
                              key={emoji}
                              type="button"
                              onClick={() => addReaction(activeConversation.id, msg.id, emoji)}
                              className="flex items-center gap-1 px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full text-xs hover:bg-gray-200 dark:hover:bg-gray-600"
                            >
                              <span>{emoji}</span>
                              <span className="text-gray-600 dark:text-gray-400">{String(count)}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Timestamp and Read Receipt */}
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDistanceToNow(msg.timestamp)}
                    </span>
                    {isOwn && (
                      <span className="text-xs text-blue-500">
                        {msg.read ? '✓✓' : '✓'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Typing Indicator */}
      {activeConversation.type === 'direct' && activeConversation.participantStatus === 'online' && Math.random() > 0.7 && (
        <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900 border-t dark:border-gray-700 flex-shrink-0">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <span>{activeConversation.participantName} is typing</span>
            <span className="flex gap-1">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </span>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="px-4 py-2 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex-shrink-0">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowSearch(true)}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Search messages"
          >
            <IconSearch className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => setShowStarred(true)}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Starred messages"
          >
            <IconStar className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => setShowMediaGallery(true)}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Media gallery"
          >
            <IconImage className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => setShowTimeOffRequest(true)}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Request time off"
          >
            <IconCalendar className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Enhanced Input */}
      <div className="p-4 bg-gray-50 dark:bg-gray-900 flex-shrink-0">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          className="hidden"
          aria-label="File upload"
        />
        <EnhancedMessageInput
          value={messageInput}
          onChange={setMessageInput}
          onSend={handleEnhancedSend}
          onFileClick={() => fileInputRef.current?.click()}
          onVoiceClick={() => setShowVoiceRecorder(true)}
          placeholder="Type a message... (@mention users)"
          maxLength={5000}
        />
      </div>
      
      {/* Modals */}
      {showVoiceRecorder && (
        <VoiceRecorder
          onSend={handleVoiceSend}
          onCancel={() => setShowVoiceRecorder(false)}
        />
      )}
      
      {showSearch && (
        <AdvancedSearch
          onClose={() => setShowSearch(false)}
          onSelectMessage={handleSelectMessage}
        />
      )}
      
      {showStarred && (
        <StarredMessages
          onClose={() => setShowStarred(false)}
          onSelectMessage={handleSelectMessage}
        />
      )}
      
      {forwardingMessage && (
        <ForwardMessage
          message={forwardingMessage}
          onClose={() => setForwardingMessage(null)}
          onForward={handleForward}
        />
      )}
      
      {showMediaGallery && (
        <MediaGallery
          conversationId={activeConversation.id}
          onClose={() => setShowMediaGallery(false)}
        />
      )}
      
      {showExport && (
        <ExportChat
          conversation={activeConversation}
          onClose={() => setShowExport(false)}
        />
      )}
      
      {showTimeOffRequest && (
        <TimeOffRequest
          onClose={() => setShowTimeOffRequest(false)}
          onSubmit={handleTimeOffRequest}
        />
      )}
    </div>
  );
};

export default ChatMessageView;
