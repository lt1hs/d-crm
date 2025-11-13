import React, { useState } from 'react';
import { IconX, IconDownload, IconFileText, IconFileCode } from '../Icons';
import { formatDistanceToNow } from '../../utils/chatHelpers';

interface ExportChatProps {
  conversation: any;
  onClose: () => void;
}

const ExportChat: React.FC<ExportChatProps> = ({ conversation, onClose }) => {
  const [format, setFormat] = useState<'txt' | 'json' | 'html'>('txt');
  const [includeTimestamps, setIncludeTimestamps] = useState(true);
  const [includeMetadata, setIncludeMetadata] = useState(true);

  const exportToTxt = () => {
    let content = '';
    
    if (includeMetadata) {
      content += `Chat Export\n`;
      content += `Conversation: ${conversation.name || conversation.participantName || 'Unknown'}\n`;
      content += `Type: ${conversation.type}\n`;
      content += `Exported: ${new Date().toLocaleString()}\n`;
      content += `Total Messages: ${conversation.messages.length}\n`;
      content += `\n${'='.repeat(50)}\n\n`;
    }

    conversation.messages.forEach((msg: any) => {
      if (includeTimestamps) {
        content += `[${new Date(msg.timestamp).toLocaleString()}] `;
      }
      content += `${msg.senderName}: ${msg.content}\n`;
      if (msg.edited) {
        content += `  (edited)\n`;
      }
      content += '\n';
    });

    return content;
  };

  const exportToJson = () => {
    const data = {
      conversation: {
        id: conversation.id,
        name: conversation.name || conversation.participantName,
        type: conversation.type,
        exportedAt: new Date().toISOString()
      },
      messages: conversation.messages.map((msg: any) => ({
        id: msg.id,
        sender: {
          id: msg.senderId,
          name: msg.senderName
        },
        content: msg.content,
        timestamp: msg.timestamp,
        edited: msg.edited || false,
        type: msg.type || 'text',
        reactions: msg.reactions || []
      })),
      metadata: includeMetadata ? {
        totalMessages: conversation.messages.length,
        participants: conversation.participants || [],
        createdAt: conversation.createdAt
      } : undefined
    };

    return JSON.stringify(data, null, 2);
  };

  const exportToHtml = () => {
    let html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Chat Export - ${conversation.name || conversation.participantName}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      background: #f5f5f5;
    }
    .header {
      background: white;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .header h1 {
      margin: 0 0 10px 0;
      color: #333;
    }
    .header p {
      margin: 5px 0;
      color: #666;
      font-size: 14px;
    }
    .message {
      background: white;
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 10px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .message-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
    }
    .sender {
      font-weight: 600;
      color: #333;
    }
    .timestamp {
      color: #999;
      font-size: 12px;
    }
    .content {
      color: #333;
      line-height: 1.5;
      white-space: pre-wrap;
    }
    .edited {
      color: #999;
      font-size: 12px;
      font-style: italic;
      margin-top: 5px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Chat Export</h1>
    ${includeMetadata ? `
    <p><strong>Conversation:</strong> ${conversation.name || conversation.participantName || 'Unknown'}</p>
    <p><strong>Type:</strong> ${conversation.type}</p>
    <p><strong>Exported:</strong> ${new Date().toLocaleString()}</p>
    <p><strong>Total Messages:</strong> ${conversation.messages.length}</p>
    ` : ''}
  </div>
`;

    conversation.messages.forEach((msg: any) => {
      html += `
  <div class="message">
    <div class="message-header">
      <span class="sender">${msg.senderName}</span>
      ${includeTimestamps ? `<span class="timestamp">${new Date(msg.timestamp).toLocaleString()}</span>` : ''}
    </div>
    <div class="content">${msg.content}</div>
    ${msg.edited ? '<div class="edited">(edited)</div>' : ''}
  </div>
`;
    });

    html += `
</body>
</html>
`;

    return html;
  };

  const handleExport = () => {
    let content = '';
    let filename = '';
    let mimeType = '';

    switch (format) {
      case 'txt':
        content = exportToTxt();
        filename = `chat-export-${Date.now()}.txt`;
        mimeType = 'text/plain';
        break;
      case 'json':
        content = exportToJson();
        filename = `chat-export-${Date.now()}.json`;
        mimeType = 'application/json';
        break;
      case 'html':
        content = exportToHtml();
        filename = `chat-export-${Date.now()}.html`;
        mimeType = 'text/html';
        break;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h3 className="text-lg font-semibold">Export Chat</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            aria-label="Close"
          >
            <IconX className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Conversation Info */}
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
            <p className="text-sm font-medium mb-1">
              {conversation.name || conversation.participantName || 'Unknown'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {conversation.messages.length} message{conversation.messages.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Format Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Export Format</label>
            <div className="space-y-2">
              {[
                { value: 'txt', label: 'Plain Text (.txt)', icon: IconFileText, desc: 'Simple text format' },
                { value: 'json', label: 'JSON (.json)', icon: IconFileCode, desc: 'Structured data format' },
                { value: 'html', label: 'HTML (.html)', icon: IconFileText, desc: 'Formatted web page' }
              ].map(({ value, label, icon: Icon, desc }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFormat(value as any)}
                  className={`w-full flex items-start gap-3 p-3 rounded-lg border-2 transition-colors ${
                    format === value
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div className="text-left">
                    <p className="font-medium text-sm">{label}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Options */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeTimestamps}
                onChange={(e) => setIncludeTimestamps(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm">Include timestamps</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeMetadata}
                onChange={(e) => setIncludeMetadata(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm">Include metadata</span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t dark:border-gray-700">
          <button
            type="button"
            onClick={handleExport}
            className="w-full flex items-center justify-center gap-2 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            <IconDownload className="w-5 h-5" />
            Export Chat
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportChat;
