import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { UrlShortenerForm } from '../components/UrlShortnerForm';
import { UrlList } from '../components/UrlList';
import { useAppDispatch, useAppSelector } from '../hook/useRedux';
import { fetchUrlsStart, fetchUrlsSuccess, fetchUrlsFailure } from '../store/slices/urlSlice';
import { urlService } from '../services/api';

const Home: React.FC = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  
useEffect(() => {
  const fetchUrls = async () => {
    dispatch(fetchUrlsStart());
    try {
      const urls = await urlService.fetchUserUrls();
      dispatch(fetchUrlsSuccess(urls));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch URLs';
      dispatch(fetchUrlsFailure(message));
    }
  };

  fetchUrls();
}, []);

  
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            URL Shortener Dashboard
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Create short, memorable links in seconds
          </p>
        </div>
        
        <UrlShortenerForm className="mb-12" />
        
        <UrlList />
      </motion.div>
    </div>
  );
};

export default Home;