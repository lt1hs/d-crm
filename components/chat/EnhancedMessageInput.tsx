import React, { useState, useRef, useEffect } from 'react';
import { 
  IconSend, IconPaperclip, IconMicrophone, IconX, IconSmile 
} from '../Icons';

interface EnhancedMessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onFileClick: () => void;
  onVoiceClick: () => void;
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
  disabled = false,
  placeholder = 'Type a message...',
  maxLength = 5000
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
    <div className={`relative bg-white dark:bg-gray-800 rounded-2xl border-2 transition-all duration-200 ${
      isFocused 
        ? 'border-blue-500 shadow-lg shadow-blue-500/10' 
        : 'border-gray-200 dark:border-gray-700'
    } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      
      {/* Main Input Area */}
      <div className="flex items-end gap-2 p-3">
        {/* Left Actions */}
        <div className="flex items-center gap-1 pb-1">
          <button
            type="button"
            onClick={onFileClick}
            disabled={disabled}
            className="p-2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Attach file"
            title="Attach file"
          >
            <IconPaperclip className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={onVoiceClick}
            disabled={disabled}
            className="p-2 text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Record voice message"
            title="Record voice message"
          >
            <IconMicrophone className="w-5 h-5" />
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              disabled={disabled}
              className="p-2 text-gray-500 hover:text-yellow-600 dark:hover:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Add emoji"
              title="Add emoji"
            >
              <IconSmile className="w-5 h-5" />
            </button>

            {/* Emoji Picker Dropdown */}
            {showEmojiPicker && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowEmojiPicker(false)}
                />
                <div className="absolute bottom-full left-0 mb-2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border dark:border-gray-700 p-3 z-20 w-80">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Pick an emoji
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowEmojiPicker(false)}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    >
                      <IconX className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-9 gap-1 max-h-48 overflow-y-auto">
                    {emojis.map((emoji, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => insertEmoji(emoji)}
                        className="text-2xl hover:scale-125 hover:bg-gray-100 dark:hover:bg-gray-700 rounded p-1 transition-all duration-200"
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

        {/* Textarea */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={disabled}
            placeholder={placeholder}
            maxLength={maxLength}
            rows={1}
            className="w-full px-3 py-2 bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 resize-none focus:outline-none text-sm leading-relaxed"
            style={{ minHeight: '40px', maxHeight: '120px' }}
          />
        </div>

        {/* Send Button */}
        <div className="pb-1">
          <button
            type="button"
            onClick={onSend}
            disabled={!value.trim() || disabled || isOverLimit}
            className={`p-2.5 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
              value.trim() && !isOverLimit
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105 active:scale-95'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
            }`}
            aria-label="Send message"
            title="Send message (Enter)"
          >
            <IconSend className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Character Count & Hints */}
      {(characterCount > 0 || isFocused) && (
        <div className="px-4 pb-2 flex items-center justify-between text-xs">
          <div className="text-gray-500 dark:text-gray-400">
            {isFocused && (
              <span className="flex items-center gap-2">
                <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">Enter</kbd>
                <span>to send</span>
                <span className="text-gray-400">•</span>
                <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">Shift + Enter</kbd>
                <span>for new line</span>
              </span>
            )}
          </div>
          
          {characterCount > 0 && (
            <div className={`font-medium transition-colors ${
              isOverLimit 
                ? 'text-red-600 dark:text-red-400' 
                : isNearLimit 
                  ? 'text-yellow-600 dark:text-yellow-400' 
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
