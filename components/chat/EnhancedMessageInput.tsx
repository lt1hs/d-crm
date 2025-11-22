import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  IconSend, IconPaperclip, IconMicrophone, IconX, IconSmile 
} from '../Icons';

interface EnhancedMessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onFileClick: () => void;
  onVoiceClick: () => void;
  onTyping?: (isTyping: boolean) => void;
  disabled?: boolean;
  placeholder?: string;
  maxLength?: number;
}

const EnhancedMessageInput: React.FC<EnhancedMessageInputProps> = ({
  value,
  onChange,
  onSend,
  onFileClick,
  onVoiceClick,
  onTyping,
  disabled = false,
  placeholder = 'Type a message...',
  maxLength = 5000
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle typing indicators
  const handleTypingStart = useCallback(() => {
    if (!isTyping && onTyping) {
      setIsTyping(true);
      onTyping(true);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      if (onTyping) onTyping(false);
    }, 2000);
  }, [isTyping, onTyping]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
    handleTypingStart();
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !disabled) {
        onSend();
      }
    }
  };

  const insertEmoji = (emoji: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newValue = value.substring(0, start) + emoji + value.substring(end);
    
    onChange(newValue);
    
    // Set cursor position after emoji
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + emoji.length, start + emoji.length);
    }, 0);
    
    setShowEmojiPicker(false);
  };

  const emojis = [
    '😊', '😂', '🤣', '😍', '🥰', '😘', '😎', '🤔', '😮', '😢', '😭', '😡',
    '👍', '👎', '👏', '🙌', '🤝', '💪', '🙏', '✨', '🎉', '🎊', '🔥', '💯',
    '❤️', '💙', '💚', '💛', '🧡', '💜', '🖤', '🤍', '💔', '❣️', '💕', '💖'
  ];

  const characterCount = value.length;
  const isNearLimit = characterCount > maxLength * 0.9;
  const isOverLimit = characterCount > maxLength;

  return (
    <div className={`relative backdrop-blur-sm bg-white/95 dark:bg-gray-800/95 rounded-2xl border transition-all duration-200 ${
      isFocused 
        ? 'border-blue-500/60 shadow-lg shadow-blue-500/10 ring-2 ring-blue-500/10' 
        : 'border-gray-200/60 dark:border-gray-700/60 shadow-sm hover:shadow-md'
    } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      
      {/* Main Input Area */}
      <div className="flex items-center gap-2 px-3 py-2">
        {/* Left Actions */}
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={onFileClick}
            disabled={disabled}
            className="group relative p-1.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/80 dark:hover:bg-blue-900/30 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
            aria-label="Attach file"
            title="Attach file"
          >
            <IconPaperclip className="w-4 h-4 transition-transform group-hover:rotate-12" />
          </button>

          <button
            type="button"
            onClick={onVoiceClick}
            disabled={disabled}
            className="group relative p-1.5 text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50/80 dark:hover:bg-red-900/30 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
            aria-label="Record voice message"
            title="Record voice message"
          >
            <IconMicrophone className="w-4 h-4" />
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              disabled={disabled}
              className={`group relative p-1.5 text-gray-400 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-amber-50/80 dark:hover:bg-amber-900/30 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 ${
                showEmojiPicker ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-500' : ''
              }`}
              aria-label="Add emoji"
              title="Add emoji"
            >
              <IconSmile className="w-4 h-4" />
            </button>

            {/* Emoji Picker Dropdown */}
            {showEmojiPicker && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowEmojiPicker(false)}
                  aria-hidden="true"
                />
                <div className="absolute bottom-full left-0 mb-2 backdrop-blur-xl bg-white/95 dark:bg-gray-800/95 rounded-xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-3 z-20 w-72 animate-in fade-in slide-in-from-bottom-2 duration-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                      Pick an emoji
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowEmojiPicker(false)}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                      aria-label="Close emoji picker"
                    >
                      <IconX className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-9 gap-0.5 max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
                    {emojis.map((emoji, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => insertEmoji(emoji)}
                        className="text-xl hover:scale-110 hover:bg-gray-100 dark:hover:bg-gray-700 rounded p-1 transition-all duration-150 active:scale-95"
                        title={emoji}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-gray-200 dark:bg-gray-700" />

        {/* Textarea */}
        <div className="flex-1 relative min-h-[32px]">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={disabled}
            placeholder={placeholder}
            maxLength={maxLength}
            rows={1}
            className="w-full px-2 py-1.5 bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 resize-none focus:outline-none text-sm leading-snug"
            style={{ minHeight: '32px', maxHeight: '100px' }}
          />
        </div>

        {/* Send Button */}
        <button
          type="button"
          onClick={onSend}
          disabled={!value.trim() || disabled || isOverLimit}
          className={`group relative p-2 rounded-xl transition-all duration-200 disabled:cursor-not-allowed flex-shrink-0 ${
            value.trim() && !isOverLimit
              ? 'bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md shadow-blue-500/30 hover:shadow-lg hover:shadow-blue-500/40 hover:scale-105 active:scale-95 disabled:opacity-50'
              : 'bg-gray-200/80 dark:bg-gray-700/80 text-gray-400 dark:text-gray-500 opacity-50'
          }`}
          aria-label="Send message"
          title="Send message (Enter)"
        >
          <IconSend className={`w-4 h-4 transition-transform ${value.trim() && !isOverLimit ? 'group-hover:translate-x-0.5 group-hover:-translate-y-0.5' : ''}`} />
        </button>
      </div>

      {/* Character Count & Hints */}
      {(characterCount > 0 || isFocused) && (
        <div className="px-3 pb-2 flex items-center justify-between text-[11px] animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="text-gray-500 dark:text-gray-400">
            {isFocused && (
              <span className="flex items-center gap-1.5 animate-in fade-in duration-300">
                <kbd className="px-1.5 py-0.5 bg-gray-100/80 dark:bg-gray-700/80 rounded text-[10px] font-medium border border-gray-200 dark:border-gray-600">
                  Enter
                </kbd>
                <span className="text-gray-600 dark:text-gray-400">send</span>
                <span className="text-gray-300 dark:text-gray-600">•</span>
                <kbd className="px-1.5 py-0.5 bg-gray-100/80 dark:bg-gray-700/80 rounded text-[10px] font-medium border border-gray-200 dark:border-gray-600">
                  Shift+Enter
                </kbd>
                <span className="text-gray-600 dark:text-gray-400">new line</span>
              </span>
            )}
          </div>
          
          {characterCount > 0 && (
            <div className={`font-semibold transition-all duration-300 ${
              isOverLimit 
                ? 'text-red-600 dark:text-red-400 scale-105' 
                : isNearLimit 
                  ? 'text-amber-600 dark:text-amber-400' 
                  : 'text-gray-500 dark:text-gray-400'
            }`}>
              {characterCount} / {maxLength}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EnhancedMessageInput;
