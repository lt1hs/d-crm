import React, { useState, useEffect } from 'react';
import { useEnhancedChat } from '../../context/EnhancedChatContext';
import { IconX, IconDownload, IconImage, IconFileText, IconVideo } from '../Icons';
import { formatDistanceToNow } from '../../utils/chatHelpers';

interface MediaGalleryProps {
  conversationId: string;
  onClose: () => void;
}

const MediaGallery: React.FC<MediaGalleryProps> = ({ conversationId, onClose }) => {
  const { getConversationFiles } = useEnhancedChat();
  const [files, setFiles] = useState<any[]>([]);
  const [filter, setFilter] = useState<'all' | 'images' | 'videos' | 'documents'>('all');
  const [selectedFile, setSelectedFile] = useState<any | null>(null);

  useEffect(() => {
    const conversationFiles = getConversationFiles(conversationId);
    setFiles(conversationFiles);
  }, [conversationId]);

  const filteredFiles = files.filter(file => {
    if (filter === 'all') return true;
    if (filter === 'images') return file.type.startsWith('image/');
    if (filter === 'videos') return file.type.startsWith('video/');
    if (filter === 'documents') return !file.type.startsWith('image/') && !file.type.startsWith('video/');
    return true;
  });

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleDownload = (file: any) => {
    const a = document.createElement('a');
    a.href = file.url;
    a.download = file.name;
    a.click();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-4xl max-h-[80vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
            <div>
              <h3 className="text-lg font-semibold">Media & Files</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {filteredFiles.length} file{filteredFiles.length !== 1 ? 's' : ''}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              aria-label="Close"
            >
              <IconX className="w-5 h-5" />
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 p-4 border-b dark:border-gray-700 overflow-x-auto">
            {[
              { key: 'all', label: 'All', icon: IconFileText },
              { key: 'images', label: 'Images', icon: IconImage },
              { key: 'videos', label: 'Videos', icon: IconVideo },
              { key: 'documents', label: 'Documents', icon: IconFileText }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  filter === key
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>

          {/* Files Grid */}
          <div className="flex-1 overflow-y-auto p-4">
            {filteredFiles.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400 py-12">
                <IconFileText className="w-16 h-16 mx-auto mb-3 opacity-30" />
                <p>No files found</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredFiles.map((file) => (
                  <div
                    key={file.id}
                    className="group relative border dark:border-gray-700 rounded-lg overflow-hidden hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
                  >
                    {/* Preview */}
                    <button
                      type="button"
                      onClick={() => setSelectedFile(file)}
                      className="w-full aspect-square bg-gray-100 dark:bg-gray-900 flex items-center justify-center overflow-hidden"
                    >
                      {file.type.startsWith('image/') ? (
                        <img
                          src={file.url}
                          alt={file.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : file.type.startsWith('video/') ? (
                        <div className="relative w-full h-full">
                          <video src={file.url} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                            <IconVideo className="w-12 h-12 text-white" />
                          </div>
                        </div>
                      ) : (
                        <IconFileText className="w-12 h-12 text-gray-400" />
                      )}
                    </button>

                    {/* Info */}
                    <div className="p-2 bg-white dark:bg-gray-800">
                      <p className="text-xs font-medium truncate" title={file.name}>
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatFileSize(file.size)}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        {formatDistanceToNow(file.uploadedAt)}
                      </p>
                    </div>

                    {/* Download Button */}
                    <button
                      type="button"
                      onClick={() => handleDownload(file)}
                      className="absolute top-2 right-2 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      aria-label="Download"
                    >
                      <IconDownload className="w-4 h-4 text-blue-600" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {selectedFile && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[60] p-4">
          <button
            type="button"
            onClick={() => setSelectedFile(null)}
            className="absolute top-4 right-4 p-2 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Close"
          >
            <IconX className="w-6 h-6" />
          </button>

          <button
            type="button"
            onClick={() => handleDownload(selectedFile)}
            className="absolute top-4 right-20 p-2 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Download"
          >
            <IconDownload className="w-6 h-6" />
          </button>

          <div className="max-w-5xl max-h-full">
            {selectedFile.type.startsWith('image/') ? (
              <img
                src={selectedFile.url}
                alt={selectedFile.name}
                className="max-w-full max-h-[80vh] object-contain"
              />
            ) : selectedFile.type.startsWith('video/') ? (
              <video
                src={selectedFile.url}
                controls
                className="max-w-full max-h-[80vh]"
              />
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center">
                <IconFileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="font-medium mb-2">{selectedFile.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  {formatFileSize(selectedFile.size)}
                </p>
                <button
                  type="button"
                  onClick={() => handleDownload(selectedFile)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                >
                  Download File
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default MediaGallery;
