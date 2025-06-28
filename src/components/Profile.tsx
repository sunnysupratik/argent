import React, { useState } from 'react';
import { User, Mail, Calendar, CreditCard, Award, Edit3, Camera, Shield, Bell, Palette, Save, RefreshCw, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useAccounts } from '../hooks/useAccounts';
import { useTransactions } from '../hooks/useTransactions';
import { InteractiveHoverButton } from './ui/interactive-hover-button';
import AnimatedSection from './AnimatedSection';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const { getTotalBalance } = useAccounts();
  const { getMonthlyIncome, getMonthlyExpenses } = useTransactions();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const [profileData, setProfileData] = useState({
    firstName: user?.full_name?.split(' ')[0] || 'John',
    lastName: user?.full_name?.split(' ')[1] || 'Doe',
    email: user?.email || 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    bio: 'Financial enthusiast focused on building long-term wealth through smart investments and disciplined budgeting.',
    location: 'San Francisco, CA',
    occupation: 'Software Engineer',
    joinDate: user?.created_at || '2024-01-01'
  });

  const getUserProfile = () => {
    const totalBalance = getTotalBalance();
    const monthlyIncome = getMonthlyIncome();
    const monthlyExpenses = getMonthlyExpenses();
    
    return {
      ...profileData,
      creditScore: 742, // Mock data
      totalBalance,
      monthlyIncome,
      monthlyExpenses,
      savingsRate: monthlyIncome > 0 ? ((monthlyIncome - monthlyExpenses) / monthlyIncome * 100) : 0
    };
  };

  const userProfile = getUserProfile();

  const achievements = [
    {
      id: 'budget_master',
      title: 'Budget Master',
      description: 'Successfully maintained budget for 3 months',
      icon: '🎯',
      unlocked: true,
      unlockedDate: '2024-01-10',
      progress: 100,
      category: 'Budgeting'
    },
    {
      id: 'debt_destroyer',
      title: 'Debt Destroyer',
      description: 'Paid off a major loan or debt',
      icon: '⚔️',
      unlocked: true,
      unlockedDate: '2024-01-05',
      progress: 100,
      category: 'Debt Management'
    },
    {
      id: 'savings_starter',
      title: 'Savings Starter',
      description: 'Built emergency fund of $1,000+',
      icon: '🌱',
      unlocked: true,
      unlockedDate: '2023-12-20',
      progress: 100,
      category: 'Savings'
    },
    {
      id: 'investment_novice',
      title: 'Investment Novice',
      description: 'Made your first investment',
      icon: '📈',
      unlocked: false,
      progress: 75,
      category: 'Investing'
    },
    {
      id: 'diversification_pro',
      title: 'Diversification Pro',
      description: 'Invest across 5+ different asset classes',
      icon: '🎲',
      unlocked: false,
      progress: 40,
      category: 'Investing'
    },
    {
      id: 'credit_champion',
      title: 'Credit Champion',
      description: 'Achieve credit score of 750+',
      icon: '👑',
      unlocked: false,
      progress: 85,
      category: 'Credit'
    }
  ];

  const financialGoals = [
    {
      id: 'emergency_fund',
      title: 'Emergency Fund',
      target: 10000,
      current: 7500,
      deadline: '2024-12-31',
      category: 'Savings'
    },
    {
      id: 'retirement_401k',
      title: 'Retirement Savings',
      target: 50000,
      current: 32000,
      deadline: '2025-12-31',
      category: 'Retirement'
    },
    {
      id: 'house_down_payment',
      title: 'House Down Payment',
      target: 80000,
      current: 25000,
      deadline: '2026-06-30',
      category: 'Real Estate'
    }
  ];

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
    setIsEditing(false);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'achievements', label: 'Achievements', icon: Award },
    { id: 'goals', label: 'Financial Goals', icon: CreditCard },
    { id: 'settings', label: 'Account Settings', icon: Shield }
  ];

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 rounded-2xl p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-4 lg:space-y-0 lg:space-x-6">
          <div className="relative">
            <div className="w-24 h-24 lg:w-32 lg:h-32 bg-gradient-to-r from-accent-blue to-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl lg:text-4xl font-bold shadow-lg">
              {userProfile.firstName.charAt(0)}{userProfile.lastName.charAt(0)}
            </div>
            <motion.button
              className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-accent-blue transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Camera size={16} />
            </motion.button>
          </div>
          
          <div className="flex-1">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
                  {userProfile.firstName} {userProfile.lastName}
                </h2>
                <p className="text-gray-600">{userProfile.occupation}</p>
                <p className="text-sm text-gray-500">{userProfile.location}</p>
              </div>
              
              <InteractiveHoverButton
                variant={isEditing ? "blue" : "white"}
                text={isEditing ? "Cancel" : "Edit Profile"}
                icon={<Edit3 size={14} />}
                onClick={() => setIsEditing(!isEditing)}
                className="mt-4 lg:mt-0 px-4 py-2"
              />
            </div>
            
            {isEditing ? (
              <textarea
                value={profileData.bio}
                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                className="w-full p-3 border border-gray-200 rounded-xl bg-white/80 backdrop-blur-sm focus:outline-none focus:border-accent-blue transition-colors resize-none"
                rows={3}
              />
            ) : (
              <p className="text-gray-700 leading-relaxed">{userProfile.bio}</p>
            )}
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Personal Information</h3>
          <div className="space-y-4">
            {[
              { icon: User, label: 'Full Name', value: `${userProfile.firstName} ${userProfile.lastName}`, editable: true },
              { icon: Mail, label: 'Email', value: userProfile.email, editable: true },
              { icon: Calendar, label: 'Member Since', value: new Date(userProfile.joinDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), editable: false },
              { icon: CreditCard, label: 'Credit Score', value: userProfile.creditScore.toString(), editable: false }
            ].map(({ icon: Icon, label, value, editable }) => (
              <div key={label} className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                  <Icon size={18} className="text-gray-600" />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-500 uppercase tracking-wide">{label}</div>
                  {isEditing && editable ? (
                    <input
                      type="text"
                      value={value}
                      className="w-full mt-1 p-2 border border-gray-200 rounded-lg bg-white/80 backdrop-blur-sm focus:outline-none focus:border-accent-blue transition-colors"
                    />
                  ) : (
                    <div className="text-gray-900 font-medium">{value}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Financial Summary</h3>
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/50 rounded-xl p-4">
              <div className="text-sm text-green-700 uppercase tracking-wide mb-1">Total Balance</div>
              <div className="text-2xl font-bold text-green-900">
                ${userProfile.totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 border border-blue-200/50 rounded-xl p-4">
                <div className="text-xs text-blue-700 uppercase tracking-wide mb-1">Monthly Income</div>
                <div className="text-lg font-bold text-blue-900">
                  ${userProfile.monthlyIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
              </div>
              
              <div className="bg-orange-50 border border-orange-200/50 rounded-xl p-4">
                <div className="text-xs text-orange-700 uppercase tracking-wide mb-1">Monthly Expenses</div>
                <div className="text-lg font-bold text-orange-900">
                  ${userProfile.monthlyExpenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
              </div>
            </div>
            
            <div className="bg-purple-50 border border-purple-200/50 rounded-xl p-4">
              <div className="text-sm text-purple-700 uppercase tracking-wide mb-1">Savings Rate</div>
              <div className="text-xl font-bold text-purple-900">
                {userProfile.savingsRate.toFixed(1)}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="flex justify-end space-x-3">
          <InteractiveHoverButton
            variant="white"
            text="Cancel"
            onClick={() => setIsEditing(false)}
            className="px-6 py-3"
          />
          <InteractiveHoverButton
            variant="blue"
            text={isSaving ? "Saving..." : "Save Changes"}
            icon={isSaving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-3 disabled:opacity-50"
          />
        </div>
      )}
    </div>
  );

  const renderAchievementsTab = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200/50 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-yellow-900 mb-2">Achievement Progress</h3>
        <p className="text-yellow-700">
          You've unlocked {achievements.filter(a => a.unlocked).length} out of {achievements.length} achievements!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {achievements.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            className={`rounded-2xl border p-6 transition-all ${
              achievement.unlocked 
                ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200/50' 
                : 'bg-white/80 backdrop-blur-xl border-gray-200/50'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ y: -2 }}
          >
            <div className="flex items-start space-x-4">
              <div className={`text-3xl ${achievement.unlocked ? 'grayscale-0' : 'grayscale opacity-50'}`}>
                {achievement.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className={`font-bold ${
                    achievement.unlocked ? 'text-green-900' : 'text-gray-700'
                  }`}>
                    {achievement.title}
                  </h4>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    achievement.unlocked 
                      ? 'bg-green-200 text-green-800' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {achievement.category}
                  </span>
                </div>
                <p className={`text-sm mb-3 ${
                  achievement.unlocked ? 'text-green-700' : 'text-gray-600'
                }`}>
                  {achievement.description}
                </p>
                
                {!achievement.unlocked && (
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{achievement.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-accent-blue h-2 rounded-full transition-all duration-300"
                        style={{ width: `${achievement.progress}%` }}
                      />
                    </div>
                  </div>
                )}
                
                {achievement.unlocked && achievement.unlockedDate && (
                  <p className="text-xs text-green-600">
                    Unlocked: {new Date(achievement.unlockedDate).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderGoalsTab = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 rounded-2xl p-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-blue-900 mb-2">Financial Goals</h3>
            <p className="text-blue-700">Track your progress towards financial milestones</p>
          </div>
          <InteractiveHoverButton
            variant="blue"
            text="Add Goal"
            icon={<Plus size={14} />}
            className="px-4 py-2"
          />
        </div>
      </div>

      <div className="space-y-4">
        {financialGoals.map((goal, index) => {
          const progress = (goal.current / goal.target) * 100;
          const remaining = goal.target - goal.current;
          const daysLeft = Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
          
          return (
            <motion.div
              key={goal.id}
              className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 p-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-gray-900">{goal.title}</h4>
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                      {goal.category}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="text-sm text-gray-600">
                      ${goal.current.toLocaleString()} / ${goal.target.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      {daysLeft > 0 ? `${daysLeft} days left` : 'Overdue'}
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                    <div 
                      className={`h-3 rounded-full transition-all duration-500 ${
                        progress >= 100 ? 'bg-green-500' : progress >= 75 ? 'bg-blue-500' : progress >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{progress.toFixed(1)}% complete</span>
                    <span className="text-gray-600">${remaining.toLocaleString()} remaining</span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <InteractiveHoverButton
                    variant="white"
                    text="Edit"
                    icon={<Edit3 size={12} />}
                    className="px-3 py-2 text-sm"
                  />
                  <InteractiveHoverButton
                    variant="blue"
                    text="Add Funds"
                    icon={<Plus size={12} />}
                    className="px-3 py-2 text-sm"
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );

  const renderSettingsTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Account Security</h3>
          <div className="space-y-4">
            <InteractiveHoverButton
              variant="white"
              text="Change Password"
              icon={<Shield size={14} />}
              className="w-full px-4 py-3"
            />
            <InteractiveHoverButton
              variant="white"
              text="Two-Factor Authentication"
              icon={<Shield size={14} />}
              className="w-full px-4 py-3"
            />
            <InteractiveHoverButton
              variant="white"
              text="Login History"
              icon={<Calendar size={14} />}
              className="w-full px-4 py-3"
            />
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Preferences</h3>
          <div className="space-y-4">
            <InteractiveHoverButton
              variant="white"
              text="Notification Settings"
              icon={<Bell size={14} />}
              className="w-full px-4 py-3"
            />
            <InteractiveHoverButton
              variant="white"
              text="Display Preferences"
              icon={<Palette size={14} />}
              className="w-full px-4 py-3"
            />
            <InteractiveHoverButton
              variant="white"
              text="Privacy Settings"
              icon={<Shield size={14} />}
              className="w-full px-4 py-3"
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="mobile-spacing lg:p-8 space-y-6 lg:space-y-8">
      {/* Page Header */}
      <AnimatedSection className="mb-8 lg:mb-12">
        <h1 className="text-xl lg:text-2xl mb-2 font-bold uppercase tracking-wide">PROFILE</h1>
        <motion.div 
          className="w-12 lg:w-16 h-px bg-accent-blue"
          initial={{ width: 0 }}
          animate={{ width: window.innerWidth >= 1024 ? 64 : 48 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        />
      </AnimatedSection>

      {/* Tab Navigation */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 p-2">
        <nav className="flex space-x-1 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-xl transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-accent-blue text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon size={16} />
                <span className="font-medium">{tab.label}</span>
              </motion.button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'achievements' && renderAchievementsTab()}
        {activeTab === 'goals' && renderGoalsTab()}
        {activeTab === 'settings' && renderSettingsTab()}
      </motion.div>
    </div>
  );
};

export default Profile;