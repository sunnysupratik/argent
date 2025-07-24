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
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 lg:px-20 py-8 lg:py-0">
        <div className="max-w-sm mx-auto w-full space-y-8">
          {/* Minimal Header */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <button 
              onClick={() => navigate('/')}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors flex items-center space-x-2 font-inter"
            >
              <ArrowLeft size={16} />
              <span>Back to Home</span>
            </button>
            
            <div>
              <h1 className="text-3xl font-inter font-medium text-gray-900 mb-2">
                {isSignUp ? 'Create Account' : 'Welcome Back'}
              </h1>
              <p className="text-gray-500 text-sm font-inter">
                {isSignUp 
                  ? 'Start your financial journey' 
                  : 'Sign in to your dashboard'
                }
              </p>
            </div>
          </motion.div>

          {/* Subtle Demo Account - Only for sign in */}
          {!isSignUp && (
            <motion.div 
              className="space-y-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="text-xs text-gray-400 uppercase tracking-wide">Try Demo</div>
              <motion.button
                onClick={() => handleDemoLogin(demoAccount.username, demoAccount.password)}
                disabled={loading}
                className="w-full p-4 border border-gray-100 hover:border-gray-200 rounded-2xl text-left transition-all duration-300 hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed group font-inter"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600 font-inter font-medium text-sm">
                      JD
                    </div>
                    <div>
                      <div className="font-inter font-medium text-gray-900 text-sm">
                        {demoAccount.name}
                      </div>
                      <div className="text-xs text-gray-500 font-inter">@{demoAccount.username}</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 group-hover:text-gray-600 transition-colors font-inter">
                    {loading ? 'Signing in...' : 'Click to login'}
                  </div>
                </div>
              </motion.button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-100"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-3 bg-white text-gray-400 font-inter">Or continue with</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Success/Error Messages */}
          {successMessage && (
            <motion.div 
              className="p-3 bg-green-50 border border-green-100 rounded-xl flex items-center space-x-2"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <CheckCircle className="w-4 h-4 text-green-600" />
              <p className="text-green-700 text-sm font-inter">{successMessage}</p>
            </motion.div>
          )}

          {error && (
            <motion.div 
              className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-start space-x-2"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-red-700 text-sm font-inter">{error}</p>
            </motion.div>
          )}

          {/* Minimal Form */}
          <motion.form 
            onSubmit={handleSubmit} 
            className="space-y-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border-0 border-b border-gray-200 bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors text-sm font-inter"
                  placeholder="Username"
                />
              </div>

              {isSignUp && (
                <>
                  <div>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required={isSignUp}
                      className="w-full px-4 py-3 border-0 border-b border-gray-200 bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors text-sm font-inter"
                      placeholder="Full Name"
                    />
                  </div>
                  
                  <div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required={isSignUp}
                      className="w-full px-4 py-3 border-0 border-b border-gray-200 bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors text-sm font-inter"
                      placeholder="Email Address"
                    />
                  </div>
                </>
              )}

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 pr-10 border-0 border-b border-gray-200 bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors text-sm font-inter"
                  placeholder="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {isSignUp && (
                <div>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required={isSignUp}
                    className="w-full px-4 py-3 border-0 border-b border-gray-200 bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors text-sm font-inter"
                    placeholder="Confirm Password"
                  />
                </div>
              )}
            </div>

            {!isSignUp && (
              <div className="flex items-center justify-between text-sm font-inter">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 border-gray-200 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-500">Remember me</span>
                </label>
                
                <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                  Forgot password?
                </a>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-inter font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {loading ? 'Loading...' : (isSignUp ? 'Create Account' : 'Sign In')}
            </button>
          </motion.form>

          {/* Toggle Mode */}
          <motion.div 
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <p className="text-sm text-gray-500 font-inter">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                onClick={toggleMode}
                className="text-gray-700 hover:text-gray-900 font-inter font-medium transition-colors"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Minimal Visual */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-900 items-center justify-center p-16 relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-transparent to-purple-500"></div>
        </div>
        
        <motion.div 
          className="max-w-md text-center space-y-8 relative z-10"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Minimal Logo */}
          <div className="relative">
            <motion.div 
              className="text-6xl font-inter font-black text-white tracking-tight"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              AR
              <span className="relative">
                G
                <motion.div 
                  className="absolute -top-1 -right-1 w-2 h-2 bg-accent-blue transform rotate-45"
                  animate={{ rotate: [45, 90, 45] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
              </span>
              ENT
            </motion.div>
            <motion.div 
              className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-0.5 bg-accent-blue"
              initial={{ width: 0 }}
              animate={{ width: 64 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            />
          </div>
          
          {/* Minimal Text */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-xl font-inter font-medium text-white">
              Financial Excellence
            </h2>
            <p className="text-white/70 text-sm leading-relaxed font-inter">
              Experience the perfect balance of simplicity and sophistication 
              in financial management.
            </p>
          </motion.div>

          {/* Minimal Grid Pattern */}
          <motion.div 
            className="grid grid-cols-4 gap-2 mt-12 opacity-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="aspect-square border border-white/20 rounded-sm"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: 0.9 + i * 0.02 }}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;