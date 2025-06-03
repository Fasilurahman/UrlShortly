import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clipboard, ClipboardCheck, ExternalLink, Trash2, BarChart2 } from 'lucide-react';
import { Card } from './UI/Card';
import { Button } from './UI/Button';
import { useAppDispatch, useAppSelector } from '../hook/useRedux';
import { deleteUrl, incrementUrlClicks } from '../store/slices/urlSlice';
import { urlService } from '../services/api';
import toast from 'react-hot-toast';

interface UrlListProps {
  className?: string;
}

export const UrlList: React.FC<UrlListProps> = ({ className = '' }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { urls, loading } = useAppSelector((state) => state.urls);
  const dispatch = useAppDispatch();
  
  const handleCopyToClipboard = (id: string, url: string) => {
    navigator.clipboard.writeText(url).then(
      () => {
        setCopiedId(id);
        toast.success('URL copied to clipboard!');
        setTimeout(() => setCopiedId(null), 2000);
      },
      () => {
        toast.error('Failed to copy URL');
      }
    );
  };
  
  const handleDeleteUrl = async (id: string) => {
    try {
      console.log('Deleting URL with ID:', id);
      
      await urlService.deleteUrl(id);
      dispatch(deleteUrl(id));
      toast.success('URL deleted successfully');
    } catch (error) {
      toast.error('Failed to delete URL');
    }
  };
  
  const handleUrlClick = async (id: string) => {
    try {
      await urlService.incrementClicks(id);
      dispatch(incrementUrlClicks(id));
    } catch (error) {
      console.error('Failed to update click count', error);
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };
  
  if (loading) {
    return (
      <div className={`flex justify-center py-8 ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  if (urls.length === 0) {
    return (
      <Card className={`p-8 text-center ${className}`}>
        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">No URLs yet</h3>
        <p className="text-gray-500 dark:text-gray-400">
          Shorten your first URL using the form above
        </p>
      </Card>
    );
  }
  
  return (
    <div className={`space-y-4 ${className}`}>
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Your Shortened URLs</h2>
      
      <AnimatePresence>
        {urls.map((url: any) => (
          <motion.div
            key={url.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-grow min-w-0">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                    {url.originalUrl}
                  </h3>
                  
                  <div className="mt-1 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <a
                      href={url.shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 dark:text-indigo-400 font-medium flex items-center hover:underline"
                      onClick={() => handleUrlClick(url.id)}
                    >
                      {url.shortUrl}
                      <ExternalLink size={16} className="ml-1" />
                    </a>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <BarChart2 size={16} className="mr-1" />
                        <span>{url.clicks} clicks</span>
                      </div>
                      
                      <div>
                        <span>Created {formatDate(url.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopyToClipboard(url.id, url.shortUrl)}
                    icon={copiedId === url.id ? <ClipboardCheck size={16} /> : <Clipboard size={16} />}
                  >
                    {copiedId === url.id ? 'Copied!' : 'Copy'}
                  </Button>
                  
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteUrl(url.id)}
                    icon={<Trash2 size={16} />}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};