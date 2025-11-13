import React, { useState, useEffect } from 'react';
import { IconExternalLink, IconX } from '../Icons';

interface LinkPreviewProps {
  url: string;
}

interface PreviewData {
  title: string;
  description: string;
  image: string;
  domain: string;
}

const LinkPreview: React.FC<LinkPreviewProps> = ({ url }) => {
  const [preview, setPreview] = useState<PreviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchPreview();
  }, [url]);

  const fetchPreview = async () => {
    try {
      // In a real app, you'd call an API to fetch Open Graph data
      // For demo, we'll simulate with mock data based on domain
      const domain = new URL(url).hostname.replace('www.', '');
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Mock preview data
      const mockPreviews: { [key: string]: PreviewData } = {
        'youtube.com': {
          title: 'Video Title',
          description: 'Watch this amazing video on YouTube',
          image: 'https://via.placeholder.com/400x300/FF0000/FFFFFF?text=YouTube',
          domain: 'youtube.com'
        },
        'github.com': {
          title: 'GitHub Repository',
          description: 'Check out this awesome project on GitHub',
          image: 'https://via.placeholder.com/400x300/181717/FFFFFF?text=GitHub',
          domain: 'github.com'
        },
        'twitter.com': {
          title: 'Tweet',
          description: 'See what\'s happening on Twitter',
          image: 'https://via.placeholder.com/400x300/1DA1F2/FFFFFF?text=Twitter',
          domain: 'twitter.com'
        }
      };

      const previewData = mockPreviews[domain] || {
        title: domain,
        description: 'Click to open link',
        image: '',
        domain
      };

      setPreview(previewData);
      setLoading(false);
    } catch (err) {
      setError(true);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="mt-2 border dark:border-gray-700 rounded-lg p-3 bg-gray-50 dark:bg-gray-800 animate-pulse">
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
      </div>
    );
  }

  if (error || !preview) {
    return null;
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-2 block border dark:border-gray-700 rounded-lg overflow-hidden hover:border-blue-500 dark:hover:border-blue-500 transition-colors group"
    >
      {preview.image && (
        <div className="aspect-video bg-gray-200 dark:bg-gray-700 overflow-hidden">
          <img
            src={preview.image}
            alt={preview.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <div className="p-3 bg-gray-50 dark:bg-gray-800">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate mb-1">
              {preview.title}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-1">
              {preview.description}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 flex items-center gap-1">
              <IconExternalLink className="w-3 h-3" />
              {preview.domain}
            </p>
          </div>
        </div>
      </div>
    </a>
  );
};

export default LinkPreview;

// Helper function to detect URLs in text
export const detectUrls = (text: string): string[] => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.match(urlRegex) || [];
};
