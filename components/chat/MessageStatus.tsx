import React from 'react';
import { IconCheck } from '../Icons';

interface MessageStatusProps {
  status: 'sending' | 'sent' | 'delivered' | 'read';
  timestamp: string;
}

const MessageStatus: React.FC<MessageStatusProps> = ({ status, timestamp }) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'sending':
        return <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin" />;
      case 'sent':
        return <IconCheck className="w-3 h-3 text-gray-400" />;
      case 'delivered':
        return (
          <div className="flex">
            <IconCheck className="w-3 h-3 text-gray-400" />
            <IconCheck className="w-3 h-3 text-gray-400 -ml-1" />
          </div>
        );
      case 'read':
        return (
          <div className="flex">
            <IconCheck className="w-3 h-3 text-blue-500" />
            <IconCheck className="w-3 h-3 text-blue-500 -ml-1" />
          </div>
        );
      default:
        return null;
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex items-center space-x-1 text-xs text-gray-400">
      <span>{formatTime(timestamp)}</span>
      {getStatusIcon()}
    </div>
  );
};

export default MessageStatus;
