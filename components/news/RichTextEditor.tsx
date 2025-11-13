import React, { useState, useRef } from 'react';
import {
  IconBold,
  IconItalic,
  IconUnderline,
  IconList,
  IconListOrdered,
  IconLink,
  IconCode,
  IconQuote,
  IconHeading,
} from '../Icons';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Start writing your post...',
  minHeight = '400px',
}) => {
  const [showPreview, setShowPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertFormatting = (before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newText =
      value.substring(0, start) +
      before +
      selectedText +
      after +
      value.substring(end);

    onChange(newText);

    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        end + before.length
      );
    }, 0);
  };

  const formatButtons = [
    {
      icon: IconHeading,
      label: 'Heading',
      action: () => insertFormatting('## ', '\n'),
      tooltip: 'Add heading',
    },
    {
      icon: IconBold,
      label: 'Bold',
      action: () => insertFormatting('**', '**'),
      tooltip: 'Bold text',
    },
    {
      icon: IconItalic,
      label: 'Italic',
      action: () => insertFormatting('*', '*'),
      tooltip: 'Italic text',
    },
    {
      icon: IconUnderline,
      label: 'Underline',
      action: () => insertFormatting('<u>', '</u>'),
      tooltip: 'Underline text',
    },
    {
      icon: IconList,
      label: 'Bullet List',
      action: () => insertFormatting('- ', '\n'),
      tooltip: 'Bullet list',
    },
    {
      icon: IconListOrdered,
      label: 'Numbered List',
      action: () => insertFormatting('1. ', '\n'),
      tooltip: 'Numbered list',
    },
    {
      icon: IconLink,
      label: 'Link',
      action: () => insertFormatting('[', '](url)'),
      tooltip: 'Insert link',
    },
    {
      icon: IconQuote,
      label: 'Quote',
      action: () => insertFormatting('> ', '\n'),
      tooltip: 'Block quote',
    },
    {
      icon: IconCode,
      label: 'Code',
      action: () => insertFormatting('`', '`'),
      tooltip: 'Inline code',
    },
  ];

  const renderPreview = () => {
    // Simple markdown-like preview
    let html = value;

    // Headings
    html = html.replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold mt-4 mb-2">$1</h2>');
    html = html.replace(/^### (.+)$/gm, '<h3 class="text-xl font-bold mt-3 mb-2">$1</h3>');

    // Bold
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

    // Italic
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

    // Underline
    html = html.replace(/<u>(.+?)<\/u>/g, '<u>$1</u>');

    // Links
    html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-blue-600 hover:underline">$1</a>');

    // Code
    html = html.replace(/`(.+?)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm">$1</code>');

    // Quotes
    html = html.replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-gray-300 pl-4 italic text-gray-700">$1</blockquote>');

    // Lists
    html = html.replace(/^- (.+)$/gm, '<li class="ml-4">• $1</li>');
    html = html.replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal">$1</li>');

    // Paragraphs
    html = html.split('\n\n').map(p => `<p class="mb-4">${p}</p>`).join('');

    return html;
  };

  const wordCount = value.trim().split(/\s+/).filter(Boolean).length;
  const charCount = value.length;
  const readTime = Math.ceil(wordCount / 200); // 200 words per minute

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Content *
        </label>
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span>{wordCount} words</span>
          <span>{charCount} characters</span>
          <span>{readTime} min read</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 bg-gray-50 border border-gray-300 rounded-t-lg flex-wrap">
        {formatButtons.map((button, index) => (
          <button
            key={index}
            type="button"
            onClick={button.action}
            className="p-2 hover:bg-gray-200 rounded transition-colors"
            title={button.tooltip}
          >
            <button.icon className="w-4 h-4 text-gray-700" />
          </button>
        ))}

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className={`px-3 py-1 text-sm rounded ${
              showPreview
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {showPreview ? 'Edit' : 'Preview'}
          </button>
        </div>
      </div>

      {/* Editor/Preview */}
      {showPreview ? (
        <div
          className="w-full px-4 py-3 border border-gray-300 rounded-b-lg bg-white prose max-w-none overflow-y-auto"
          style={{ minHeight }}
          dangerouslySetInnerHTML={{ __html: renderPreview() }}
        />
      ) : (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 border border-gray-300 rounded-b-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
          style={{ minHeight }}
          required
        />
      )}

      {/* Help Text */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>💡 <strong>Formatting tips:</strong></p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 ml-4">
          <span>**bold** for <strong>bold</strong></span>
          <span>*italic* for <em>italic</em></span>
          <span>## Heading for headings</span>
          <span>[text](url) for links</span>
          <span>- item for bullet lists</span>
          <span>&gt; quote for quotes</span>
        </div>
      </div>
    </div>
  );
};

export default RichTextEditor;
