import React, { useState, useEffect } from 'react';
import { useEnhancedChat } from '../../context/EnhancedChatContext';
import { IconSearch, IconX, IconFilter, IconCalendar, IconUser } from '../Icons';
import { formatDistanceToNow } from '../../utils/chatHelpers';

interface AdvancedSearchProps {
  onClose: () => void;
  onSelectMessage: (conversationId: string, messageId: string) => void;
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({ onClose, onSelectMessage }) => {
  const { conversations, users } = useEnhancedChat();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    sender: '',
    dateFrom: '',
    dateTo: '',
    fileType: '',
    conversationId: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const searchResults: any[] = [];
    conversations.forEach(conv => {
      conv.messages.forEach(msg => {
        const matchesQuery = msg.content.toLowerCase().includes(query.toLowerCase());
        const matchesSender = !filters.sender || msg.senderId === filters.sender;
        const matchesConversation = !filters.conversationId || conv.id === filters.conversationId;
        
        let matchesDate = true;
        if (filters.dateFrom) {
          matchesDate = matchesDate && new Date(msg.timestamp) >= new Date(filters.dateFrom);
        }
        if (filters.dateTo) {
          matchesDate = matchesDate && new Date(msg.timestamp) <= new Date(filters.dateTo);
        }

        const matchesFileType = !filters.fileType || 
          (msg.type === 'file' && msg.fileName?.toLowerCase().includes(filters.fileType.toLowerCase()));

        if (matchesQuery && matchesSender && matchesConversation && matchesDate && matchesFileType) {
          searchResults.push({
            ...msg,
            conversationId: conv.id,
            conversationName: conv.name || conv.participantName || 'Unknown'
          });
        }
      });
    });

    setResults(searchResults.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    ));
  }, [query, filters, conversations]);

  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;
    
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === highlight.toLowerCase() 
        ? <mark key={i} className="bg-yellow-200 dark:bg-yellow-800">{part}</mark>
        : part
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-3xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h3 className="text-lg font-semibold">Search Messages</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            aria-label="Close"
          >
            <IconX className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-4 border-b dark:border-gray-700">
          <div className="relative">
            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search messages..."
              className="w-full pl-10 pr-12 py-3 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded ${
                showFilters ? 'bg-blue-100 dark:bg-blue-900 text-blue-600' : 'hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              aria-label="Toggle filters"
            >
              <IconFilter className="w-5 h-5" />
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="sender-filter" className="block text-sm font-medium mb-1">Sender</label>
                <select
                  id="sender-filter"
                  value={filters.sender}
                  onChange={(e) => setFilters({ ...filters, sender: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Filter by sender"
                >
                  <option value="">All senders</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>{user.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="conversation-filter" className="block text-sm font-medium mb-1">Conversation</label>
                <select
                  id="conversation-filter"
                  value={filters.conversationId}
                  onChange={(e) => setFilters({ ...filters, conversationId: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Filter by conversation"
                >
                  <option value="">All conversations</option>
                  {conversations.map(conv => (
                    <option key={conv.id} value={conv.id}>
                      {conv.name || conv.participantName || 'Unknown'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="date-from" className="block text-sm font-medium mb-1">From Date</label>
                <input
                  id="date-from"
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Filter from date"
                />
              </div>

              <div>
                <label htmlFor="date-to" className="block text-sm font-medium mb-1">To Date</label>
                <input
                  id="date-to"
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Filter to date"
                />
              </div>

              <div className="col-span-2">
                <button
                  type="button"
                  onClick={() => setFilters({ sender: '', dateFrom: '', dateTo: '', fileType: '', conversationId: '' })}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Clear filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-4">
          {query.length < 2 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 py-12">
              <IconSearch className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Type at least 2 characters to search</p>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 py-12">
              <IconSearch className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No messages found</p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                Found {results.length} message{results.length !== 1 ? 's' : ''}
              </p>
              {results.map((result) => (
                <button
                  key={result.id}
                  type="button"
                  onClick={() => {
                    onSelectMessage(result.conversationId, result.id);
                    onClose();
                  }}
                  className="w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors border dark:border-gray-700"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={result.senderAvatar || '/imgs/default-avatar.png'}
                      alt={result.senderName}
                      className="w-10 h-10 rounded-full flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{result.senderName}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDistanceToNow(result.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        in {result.conversationName}
                      </p>
                      <p className="text-sm line-clamp-2">
                        {highlightText(result.content, query)}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdvancedSearch;
