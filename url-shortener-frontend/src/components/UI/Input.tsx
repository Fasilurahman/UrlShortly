import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  icon?: React.ReactNode;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export const Input: React.FC<InputProps> = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  icon,
  required = false,
  disabled = false,
  className = '',
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const inputType = type === 'password' && showPassword ? 'text' : type;

  return (
    <div className={`relative mb-4 ${className}`}>
      <label
        htmlFor={id}
        className={`absolute left-3 transition-all duration-200 pointer-events-none ${
          isFocused || value
            ? '-top-2.5 text-xs bg-white dark:bg-gray-900 px-1 text-indigo-600 dark:text-indigo-400'
            : 'top-3 text-gray-500 dark:text-gray-400'
        }`}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
            {icon}
          </div>
        )}
        
        <input
          id={id}
          type={inputType}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={isFocused ? placeholder : ''}
          disabled={disabled}
          className={`w-full py-2 px-3 ${
            icon ? 'pl-10' : ''
          } border rounded-md bg-white dark:bg-gray-800 transition-all duration-200 focus:outline-none focus:ring-2 ${
            error
              ? 'border-red-500 focus:ring-red-200 dark:focus:ring-red-900'
              : 'border-gray-300 dark:border-gray-700 focus:border-indigo-500 focus:ring-indigo-200 dark:focus:ring-indigo-900'
          } ${
            disabled ? 'bg-gray-100 dark:bg-gray-900 cursor-not-allowed' : ''
          }`}
        />
        
        {type === 'password' && (
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};