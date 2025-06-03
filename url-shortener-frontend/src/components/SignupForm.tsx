import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock } from 'lucide-react';
import { Input } from './UI/Input';
import { Button } from './UI/Button';
import { useAppDispatch } from '../hook/useRedux';
import { signupStart, signupSuccess, signupFailure } from '../store/slices/authSlice';
import { authService } from '../services/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

interface SignupFormProps {
  className?: string;
}

export const SignupForm: React.FC<SignupFormProps> = ({ className = '' }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const validateForm = () => {
  let valid = true;
  const newErrors = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  const trimmedName = name.trim();
   
  if (!trimmedName) {
    newErrors.name = 'Name is required';
    valid = false;
  } else if (trimmedName.length < 5) {
    newErrors.name = 'Name must be at least 5 characters';
    valid = false;
  } else if (!/^[a-zA-Z\s]+$/.test(trimmedName)) {
    newErrors.name = 'Name can only contain letters and spaces';
    valid = false;
  }

  if (!email.trim()) {
    newErrors.email = 'Email is required';
    valid = false;
  } else if (!/^\S+@\S+\.\S+$/.test(email)) {
    newErrors.email = 'Email is invalid';
    valid = false;
  }

  if (!password) {
    newErrors.password = 'Password is required';
    valid = false;
  } else if (password.length < 6) {
    newErrors.password = 'Password must be at least 6 characters';
    valid = false;
  } else if (!/[0-9!@#$%^&*]/.test(password)) {
    newErrors.password = 'Password must include a number or special character';
    valid = false;
  }

  if (!confirmPassword) {
    newErrors.confirmPassword = 'Please confirm your password';
    valid = false;
  } else if (password !== confirmPassword) {
    newErrors.confirmPassword = 'Passwords do not match';
    valid = false;
  }

  setErrors(newErrors);
  return valid;
};

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('touching in form');
    if (!validateForm()) return;
    
    dispatch(signupStart());
    
    try {
      console.log(name, email, password);
      
      const user = await authService.signup(name, email, password);
      dispatch(signupSuccess(user));
      toast.success('Account created successfully!');
      navigate('/login');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Signup failed';
      dispatch(signupFailure(errorMessage));
      toast.error(errorMessage);
    }
  };
  
  const formVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };
  
  return (
    <motion.form
      initial="hidden"
      animate="visible"
      variants={formVariants}
      onSubmit={handleSubmit}
      className={`space-y-6 ${className}`}
    >
      <motion.div variants={itemVariants}>
        <Input
          id="name"
          type="text"
          label="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Doe"
          error={errors.name}
          icon={<User size={18} />}
          required
        />
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <Input
          id="email"
          type="email"
          label="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="john@example.com"
          error={errors.email}
          icon={<Mail size={18} />}
          required
        />
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <Input
          id="password"
          type="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Create a password"
          error={errors.password}
          icon={<Lock size={18} />}
          required
        />
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <Input
          id="confirmPassword"
          type="password"
          label="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm your password"
          error={errors.confirmPassword}
          icon={<Lock size={18} />}
          required
        />
      </motion.div>
      
      <motion.div variants={itemVariants} className="flex items-center">
        <input
          id="terms"
          name="terms"
          type="checkbox"
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          required
        />
        <label htmlFor="terms" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
          I agree to the{' '}
          <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
            Privacy Policy
          </a>
        </label>
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
        >
          Create Account
        </Button>
      </motion.div>
    </motion.form>
  );
};