import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glassEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  glassEffect = false,
}) => {
  const baseClasses = 'rounded-lg shadow-md overflow-hidden';
  
  const glassClasses = glassEffect
    ? 'bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border border-white/20 dark:border-gray-800/30'
    : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800';
  
  return (
    <motion.div
      className={`${baseClasses} ${glassClasses} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};