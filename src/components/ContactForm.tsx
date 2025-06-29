import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle, AlertCircle, User, Mail, Building, Phone, MessageSquare, DollarSign, Calendar, Tag, Info } from 'lucide-react';
import { useAirtable } from '../hooks/useAirtable';
import { InteractiveHoverButton } from './ui/interactive-hover-button';

interface ContactFormProps {
  onSuccess?: () => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ onSuccess }) => {
  const { createLead, loading, error } = useAirtable();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    subject: '',
    message: '',
    budget: '',
    timeline: '',
    interests: [] as string[]
  });

  const budgetOptions = [
    { value: 'under-10k', label: 'Under $10,000' },
    { value: '10k-50k', label: '$10,000 - $50,000' },
    { value: '50k-100k', label: '$50,000 - $100,000' },
    { value: '100k-500k', label: '$100,000 - $500,000' },
    { value: 'over-500k', label: 'Over $500,000' },
    { value: 'not-sure', label: 'Not sure yet' }
  ];

  const timelineOptions = [
    { value: 'immediate', label: 'Immediate (within 1 month)' },
    { value: '1-3-months', label: '1-3 months' },
    { value: '3-6-months', label: '3-6 months' },
    { value: '6-12-months', label: '6-12 months' },
    { value: 'over-year', label: 'Over a year' },
    { value: 'exploring', label: 'Just exploring' }
  ];

  const interestOptions = [
    { value: 'financial-planning', label: 'Financial Planning' },
    { value: 'investment-management', label: 'Investment Management' },
    { value: 'business-banking', label: 'Business Banking' },
    { value: 'wealth-management', label: 'Wealth Management' },
    { value: 'retirement-planning', label: 'Retirement Planning' },
    { value: 'tax-optimization', label: 'Tax Optimization' },
    { value: 'estate-planning', label: 'Estate Planning' },
    { value: 'fintech-solutions', label: 'FinTech Solutions' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const leadData = {
      ...formData,
      source: 'Website Contact Form'
    };

    const success = await createLead(leadData);
    
    if (success) {
      setSubmitted(true);
      onSuccess?.();
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          name: '',
          email: '',
          company: '',
          phone: '',
          subject: '',
          message: '',
          budget: '',
          timeline: '',
          interests: []
        });
      }, 3000);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/50 rounded-2xl p-8 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <CheckCircle size={32} className="text-white" />
        </motion.div>
        <h3 className="text-2xl font-bold text-green-900 mb-2">Thank You!</h3>
        <p className="text-green-700 mb-4">
          Your message has been received and saved. We'll get back to you within 24 hours.
        </p>
        <div className="text-sm text-green-600">
          Lead ID: #{Date.now().toString().slice(-6)}
        </div>
        {error && error.includes('demo purposes') && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <Info size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
              <p className="text-blue-700 text-sm">
                Demo mode: Your message was saved locally. To enable Airtable integration, configure your Pica credentials.
              </p>
            </div>
          </div>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/[0.08] p-6 lg:p-8"
    >
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">Get in Touch</h3>
        <p className="text-white/70">
          Tell us about your project and we'll get back to you with a personalized proposal.
        </p>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-6 p-4 border rounded-xl flex items-start space-x-3 ${
            error.includes('demo purposes') 
              ? 'bg-blue-50/10 border-blue-500/20' 
              : 'bg-red-50/10 border-red-500/20'
          }`}
        >
          {error.includes('demo purposes') ? (
            <Info size={20} className="text-blue-400 mt-0.5 flex-shrink-0" />
          ) : (
            <AlertCircle size={20} className="text-red-400 mt-0.5 flex-shrink-0" />
          )}
          <div>
            <p className={`font-medium ${error.includes('demo purposes') ? 'text-blue-300' : 'text-red-300'}`}>
              {error.includes('demo purposes') ? 'Demo Mode Active' : 'Configuration Required'}
            </p>
            <p className={`text-sm mt-1 ${error.includes('demo purposes') ? 'text-blue-400' : 'text-red-400'}`}>
              {error}
            </p>
            {error.includes('Authentication failed') && (
              <div className="mt-2 text-xs text-red-300">
                <p>To fix this:</p>
                <ol className="list-decimal list-inside mt-1 space-y-1">
                  <li>Copy .env.example to .env</li>
                  <li>Replace placeholder values with your actual Pica credentials</li>
                  <li>Restart the development server</li>
                </ol>
              </div>
            )}
          </div>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label className="block text-white/70 text-sm font-medium mb-2">
              <User size={16} className="inline mr-2" />
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-accent-blue transition-colors"
              placeholder="John Doe"
            />
          </div>
          
          <div>
            <label className="block text-white/70 text-sm font-medium mb-2">
              <Mail size={16} className="inline mr-2" />
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-accent-blue transition-colors"
              placeholder="john@company.com"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label className="block text-white/70 text-sm font-medium mb-2">
              <Building size={16} className="inline mr-2" />
              Company
            </label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-accent-blue transition-colors"
              placeholder="Your Company"
            />
          </div>
          
          <div>
            <label className="block text-white/70 text-sm font-medium mb-2">
              <Phone size={16} className="inline mr-2" />
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-accent-blue transition-colors"
              placeholder="+1 (555) 123-4567"
            />
          </div>
        </div>

        {/* Project Information */}
        <div>
          <label className="block text-white/70 text-sm font-medium mb-2">
            <MessageSquare size={16} className="inline mr-2" />
            Subject *
          </label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-accent-blue transition-colors"
            placeholder="How can we help you?"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label className="block text-white/70 text-sm font-medium mb-2">
              <DollarSign size={16} className="inline mr-2" />
              Budget Range
            </label>
            <select
              name="budget"
              value={formData.budget}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-accent-blue transition-colors"
            >
              <option value="" className="bg-gray-800">Select budget range</option>
              {budgetOptions.map(option => (
                <option key={option.value} value={option.value} className="bg-gray-800">
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-white/70 text-sm font-medium mb-2">
              <Calendar size={16} className="inline mr-2" />
              Timeline
            </label>
            <select
              name="timeline"
              value={formData.timeline}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-accent-blue transition-colors"
            >
              <option value="" className="bg-gray-800">Select timeline</option>
              {timelineOptions.map(option => (
                <option key={option.value} value={option.value} className="bg-gray-800">
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Interests */}
        <div>
          <label className="block text-white/70 text-sm font-medium mb-3">
            <Tag size={16} className="inline mr-2" />
            Areas of Interest
          </label>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            {interestOptions.map(option => (
              <motion.button
                key={option.value}
                type="button"
                onClick={() => handleInterestToggle(option.value)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  formData.interests.includes(option.value)
                    ? 'bg-accent-blue text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {option.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Message */}
        <div>
          <label className="block text-white/70 text-sm font-medium mb-2">
            Message *
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            required
            rows={5}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-accent-blue transition-colors resize-none"
            placeholder="Tell us about your project, goals, and how we can help..."
          />
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <InteractiveHoverButton
            type="submit"
            disabled={loading || !formData.name || !formData.email || !formData.subject || !formData.message}
            variant="blue"
            text={loading ? "Sending..." : "Send Message"}
            icon={<Send size={16} />}
            className="w-full py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        {/* Privacy Notice */}
        <div className="text-xs text-white/50 text-center">
          By submitting this form, you agree to our privacy policy. We'll only use your information to respond to your inquiry.
        </div>
      </form>
    </motion.div>
  );
};

export default ContactForm;