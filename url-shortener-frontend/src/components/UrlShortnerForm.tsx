import React, { useState } from 'react';
import { Link } from 'lucide-react';
import { motion } from 'framer-motion';
import { Input } from './UI/Input';
import { Button } from './UI/Button';
import { useAppDispatch } from '../hook/useRedux';
import { addUrlStart, addUrlSuccess, addUrlFailure } from '../store/slices/urlSlice';
import { urlService } from '../services/api';
import toast from 'react-hot-toast';

interface UrlShortenerFormProps {
  className?: string;
}

export const UrlShortenerForm: React.FC<UrlShortenerFormProps> = ({ className = '' }) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const dispatch = useAppDispatch();
  
  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!url.trim()) {
    setError('Please enter a URL');
    return;
  }

  if (!validateUrl(url)) {
    setError('Please enter a valid URL');
    return;
  }

  setError('');
  setIsLoading(true);
  dispatch(addUrlStart());

  try {
    const newUrl = await urlService.createShortUrl(url);
    dispatch(addUrlSuccess(newUrl));
    toast.success('URL shortened successfully!');
    setUrl('');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to shorten URL';
    dispatch(addUrlFailure(errorMessage));
    toast.error(errorMessage);
  } finally {
    setIsLoading(false);
  }
};

  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`${className}`}
    >
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-800 dark:to-purple-800 p-8 rounded-lg shadow-lg">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white">Shorten Your URL</h2>
          <p className="text-indigo-100 mt-2">
            Enter a long URL to create a shorter, more manageable link
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-grow">
              <Input
                id="url"
                label="URL to Shorten"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/your-long-url"
                error={error}
                icon={<Link size={18} />}
                className="mb-0"
              />
            </div>
            
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="self-end bg-white text-indigo-600 hover:bg-indigo-50 shadow-md"
              isLoading={isLoading}
            >
              Shorten
            </Button>
          </div>
        </form>
        
        <div className="mt-4 text-center">
          <p className="text-xs text-indigo-100">
            By using our service, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </motion.div>
  );
};