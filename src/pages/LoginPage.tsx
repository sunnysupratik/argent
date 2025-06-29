import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft, AlertCircle, CheckCircle, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { InteractiveHoverButton } from '../components/ui/interactive-hover-button';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { signIn, signUp, loading, user } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    email: ''
  });

  // Redirect if already authenticated - go directly to dashboard
  useEffect(() => {
    console.log('LoginPage - Auth state:', { user: user?.username, loading });
    if (user) {
      console.log('User already authenticated, redirecting to dashboard');
      navigate('/app/dashboard');
    }
  }, [user, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(null);
    setSuccessMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (isSignUp) {
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      console.log('Attempting sign up for:', formData.username);
      const { error } = await signUp(formData.username, formData.password, formData.fullName, formData.email);
      
      if (error) {
        console.error('Sign up failed:', error);
        setError(error.message);
      } else {
        console.log('Sign up successful, redirecting to dashboard...');
        navigate('/app/dashboard');
      }
    } else {
      console.log('Attempting sign in for:', formData.username);
      const { error } = await signIn(formData.username, formData.password);
      
      if (error) {
        console.error('Sign in failed:', error);
        setError(error.message);
      } else {
        console.log('Sign in successful, redirecting to dashboard...');
        navigate('/app/dashboard');
      }
    }
  };

  const handleDemoLogin = async (username: string, password: string) => {
    setError(null);
    setSuccessMessage(null);
    console.log('Attempting demo login with:', username);
    
    const { error } = await signIn(username, password);
    
    if (error) {
      setError(`Demo login failed: ${error.message}`);
      console.error('Demo login error:', error);
    } else {
      setSuccessMessage('Demo login successful!');
      console.log('Demo login successful, navigating to dashboard...');
      setTimeout(() => navigate('/app/dashboard'), 1000);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError(null);
    setSuccessMessage(null);
    setFormData({
      username: '',
      password: '',
      confirmPassword: '',
      fullName: '',
      email: ''
    });
  };

  // Only show John Doe as test user
  const demoAccount = {
    name: 'John Doe',
    username: 'johndoe',
    password: 'Demo123!',
    description: 'Marketing professional with balanced finances',
    gradient: 'from-blue-500 to-blue-600'
  };

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-4 lg:px-16 py-8 lg:py-0">
        <div className="max-w-md mx-auto w-full space-y-6 lg:space-y-8">
          {/* Header */}
          <motion.div 
            className="space-y-4 lg:space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <InteractiveHoverButton 
              variant="white" 
              text="Back to Home" 
              icon={<ArrowLeft size={14} />}
              onClick={() => navigate('/')}
              className="text-sm px-4 py-2"
            />
            
            <div>
              <h1 className="text-2xl lg:text-3xl inter-subheading text-text-primary mb-2">
                {isSignUp ? 'Create Account' : 'Welcome Back'}
              </h1>
              <p className="inter-body text-text-primary">
                {isSignUp 
                  ? 'Start your financial journey with Argent' 
                  : 'Sign in to access your dashboard'
                }
              </p>
            </div>
          </motion.div>

          {/* Demo Account - Show prominently */}
          {!isSignUp && (
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-sm font-medium text-gray-700 uppercase tracking-wide">Try Demo Account</h3>
              <motion.button
                onClick={() => handleDemoLogin(demoAccount.username, demoAccount.password)}
                disabled={loading}
                className="group relative overflow-hidden w-full p-4 border-2 border-accent-blue bg-gradient-to-r from-accent-blue/5 to-accent-blue/10 hover:from-accent-blue/10 hover:to-accent-blue/15 rounded-2xl text-left transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ y: -2, scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <div className="relative flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 bg-gradient-to-r ${demoAccount.gradient} rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
                      {demoAccount.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 group-hover:text-gray-800">
                        {demoAccount.name}
                      </p>
                      <p className="text-sm text-gray-600">@{demoAccount.username}</p>
                      <p className="text-xs text-gray-500 mt-1">{demoAccount.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-medium text-accent-blue">
                      {loading ? 'Signing in...' : 'Click to login'}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {demoAccount.password}
                    </div>
                  </div>
                </div>
              </motion.button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-background text-gray-500">Or sign in manually</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Success Message */}
          {successMessage && (
            <motion.div 
              className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <CheckCircle className="w-5 h-5 text-green-600" />
              <p className="text-green-700 text-sm">{successMessage}</p>
            </motion.div>
          )}

          {/* Error Message */}
          {error && (
            <motion.div 
              className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </motion.div>
          )}

          {/* Form */}
          <motion.form 
            onSubmit={handleSubmit} 
            className="space-y-4 lg:space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div>
              <label htmlFor="username" className="block text-sm inter-navigation text-text-primary mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-graphic-subtle bg-overlay-bg text-text-primary focus:outline-none focus:border-accent-blue transition-colors inter-body rounded-xl"
                placeholder="johndoe"
              />
            </div>

            {isSignUp && (
              <>
                <div>
                  <label htmlFor="fullName" className="block text-sm inter-navigation text-text-primary mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required={isSignUp}
                    className="w-full px-4 py-3 border border-graphic-subtle bg-overlay-bg text-text-primary focus:outline-none focus:border-accent-blue transition-colors inter-body rounded-xl"
                    placeholder="John Doe"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm inter-navigation text-text-primary mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required={isSignUp}
                    className="w-full px-4 py-3 border border-graphic-subtle bg-overlay-bg text-text-primary focus:outline-none focus:border-accent-blue transition-colors inter-body rounded-xl"
                    placeholder="john@example.com"
                  />
                </div>
              </>
            )}

            <div>
              <label htmlFor="password" className="block text-sm inter-navigation text-text-primary mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 pr-12 border border-graphic-subtle bg-overlay-bg text-text-primary focus:outline-none focus:border-accent-blue transition-colors inter-body rounded-xl"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 apple-glass-icon-dark p-1 flex items-center justify-center"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {isSignUp && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm inter-navigation text-text-primary mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required={isSignUp}
                  className="w-full px-4 py-3 border border-graphic-subtle bg-overlay-bg text-text-primary focus:outline-none focus:border-accent-blue transition-colors inter-body rounded-xl"
                  placeholder="••••••••"
                />
              </div>
            )}

            {!isSignUp && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-accent-blue border-graphic-subtle focus:ring-accent-blue rounded"
                  />
                  <span className="ml-2 text-sm inter-navigation text-text-primary">Remember me</span>
                </label>
                
                <a href="#" className="text-sm inter-navigation text-accent-blue hover:underline">
                  Forgot password?
                </a>
              </div>
            )}

            <InteractiveHoverButton
              type="submit"
              disabled={loading}
              variant="blue"
              text={loading ? 'Loading...' : (isSignUp ? 'Create Account' : 'Sign In')}
              className="w-full py-3 text-base lg:text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </motion.form>

          {/* Toggle Mode */}
          <motion.div 
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <p className="inter-body text-text-primary">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                onClick={toggleMode}
                className="inter-navigation text-accent-blue hover:underline"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Visual (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-text-primary items-center justify-center p-16">
        <motion.div 
          className="max-w-md text-center space-y-8"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative">
            <motion.div 
              className="text-5xl lg:text-7xl font-black text-overlay-bg tracking-tight inter-headline"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              AR
              <span className="relative">
                G
                <motion.div 
                  className="absolute -top-2 -right-2 w-3 h-3 bg-accent-blue transform rotate-45"
                  animate={{ rotate: [45, 90, 45] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
              </span>
              ENT
            </motion.div>
            <motion.div 
              className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-accent-blue"
              initial={{ width: 0 }}
              animate={{ width: 64 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            />
          </div>
          
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-xl lg:text-2xl inter-subheading text-overlay-bg">
              Financial Excellence
            </h2>
            <p className="inter-body text-overlay-bg leading-relaxed">
              Experience the perfect balance of simplicity and sophistication 
              in financial management.
            </p>
          </motion.div>

          {/* Demo Credentials */}
          <motion.div 
            className="bg-white bg-opacity-10 p-6 rounded-2xl backdrop-blur-sm border border-white border-opacity-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h3 className="text-lg font-bold text-overlay-bg mb-4">Demo Account</h3>
            <div className="text-sm text-overlay-bg text-left">
              <p className="font-medium">{demoAccount.name}</p>
              <p className="opacity-80">{demoAccount.username} / {demoAccount.password}</p>
            </div>
          </motion.div>

          {/* Geometric Pattern */}
          <motion.div 
            className="grid grid-cols-3 gap-4 mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            {[...Array(9)].map((_, i) => (
              <motion.div
                key={i}
                className={`aspect-square border border-overlay-bg rounded-lg ${
                  i % 2 === 0 ? 'bg-overlay-bg bg-opacity-20' : 'bg-transparent'
                }`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: 0.9 + i * 0.05 }}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;