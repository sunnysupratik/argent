import React, { useState } from 'react';
import { User, Mail, Calendar, CreditCard, Award, Edit3, Camera, Shield, Bell, Palette, Save, RefreshCw, Plus, MapPin, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useUserProfile } from '../hooks/useUserProfile';
import { useAccounts } from '../hooks/useAccounts';
import { useTransactions } from '../hooks/useTransactions';
import { InteractiveHoverButton } from './ui/interactive-hover-button';
import AnimatedSection from './AnimatedSection';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const { profile, loading: profileLoading, updateProfile } = useUserProfile();
  const { getAccountsCount } = useAccounts();
  const { getTransactionsCount } = useTransactions();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const [editData, setEditData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    bio: '',
    location: '',
    occupation: ''
  });

  // Update edit data when profile loads
  React.useEffect(() => {
    if (profile && !isEditing) {
      setEditData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        bio: profile.bio || '',
        location: profile.location || '',
        occupation: profile.occupation || ''
      });
    }
  }, [profile, isEditing]);

  // Real achievements based on actual data
  const achievements = [
    {
      id: 'account_holder',
      title: 'Account Holder',
      description: `Successfully connected ${getAccountsCount()} financial accounts`,
      icon: '🏦',
      unlocked: getAccountsCount() > 0,
      unlockedDate: profile?.join_date || new Date().toISOString(),
      progress: 100,
      category: 'Banking'
    },
    {
      id: 'transaction_tracker',
      title: 'Transaction Tracker',
      description: `Recorded ${getTransactionsCount()} transactions`,
      icon: '📊',
      unlocked: getTransactionsCount() > 0,
      unlockedDate: profile?.join_date || new Date().toISOString(),
      progress: 100,
      category: 'Tracking'
    },
    {
      id: 'income_earner',
      title: 'Income Earner',
      description: 'Generated monthly income',
      icon: '💰',
      unlocked: (profile?.monthly_income || 0) > 0,
      unlockedDate: profile?.join_date || new Date().toISOString(),
      progress: (profile?.monthly_income || 0) > 0 ? 100 : 0,
      category: 'Income'
    },
    {
      id: 'budget_conscious',
      title: 'Budget Conscious',
      description: 'Maintaining positive savings rate',
      icon: '🎯',
      unlocked: (profile?.savings_rate || 0) > 0,
      progress: Math.max(0, profile?.savings_rate || 0),
      category: 'Budgeting'
    },
    {
      id: 'wealth_builder',
      title: 'Wealth Builder',
      description: 'Built substantial net worth',
      icon: '🌱',
      unlocked: (profile?.total_balance || 0) > 10000,
      progress: Math.min(100, ((profile?.total_balance || 0) / 10000) * 100),
      category: 'Wealth'
    },
    {
      id: 'financial_planner',
      title: 'Financial Planner',
      description: 'Actively managing finances',
      icon: '📈',
      unlocked: getAccountsCount() >= 2 && getTransactionsCount() >= 5,
      progress: Math.min(100, ((getAccountsCount() * 20) + (getTransactionsCount() * 4))),
      category: 'Planning'
    }
  ];

  // Real financial goals based on current data
  const financialGoals = [
    {
      id: 'emergency_fund',
      title: 'Emergency Fund',
      target: 10000,
      current: Math.max(0, (profile?.total_balance || 0) * 0.3), // Assume 30% is emergency fund
      deadline: '2024-12-31',
      category: 'Savings'
    },
    {
      id: 'monthly_savings',
      title: 'Monthly Savings Target',
      target: (profile?.monthly_income || 0) * 0.2, // 20% savings rate
      current: Math.max(0, (profile?.monthly_income || 0) - (profile?.monthly_expenses || 0)),
      deadline: '2024-12-31',
      category: 'Budgeting'
    },
    {
      id: 'net_worth_growth',
      title: 'Net Worth Growth',
      target: (profile?.total_balance || 0) * 1.1, // 10% growth
      current: profile?.total_balance || 0,
      deadline: '2025-12-31',
      category: 'Wealth'
    }
  ];

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const result = await updateProfile(editData);
      if (result.success) {
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Failed to save profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset edit data to current profile values
    if (profile) {
      setEditData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        bio: profile.bio || '',
        location: profile.location || '',
        occupation: profile.occupation || ''
      });
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'achievements', label: 'Achievements', icon: Award },
    { id: 'goals', label: 'Financial Goals', icon: CreditCard },
    { id: 'settings', label: 'Account Settings', icon: Shield }
  ];

  if (profileLoading) {
    return (
      <div className="mobile-spacing lg:p-8 space-y-6 lg:space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300/50 rounded w-48 mb-4"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-300/50 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 rounded-xl lg:rounded-2xl p-4 lg:p-6 xl:p-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-3 lg:space-y-0 lg:space-x-4 xl:space-x-6">
          <div className="relative">
            <div className="w-20 h-20 lg:w-24 lg:h-24 xl:w-32 xl:h-32 bg-gradient-to-r from-accent-blue to-blue-600 rounded-xl lg:rounded-2xl flex items-center justify-center text-white text-lg lg:text-2xl xl:text-4xl font-bold shadow-lg">
              {(profile?.first_name?.charAt(0) || 'U')}{(profile?.last_name?.charAt(0) || '')}
            </div>
            <motion.button
              className="absolute -bottom-1 -right-1 lg:-bottom-2 lg:-right-2 w-6 h-6 lg:w-8 lg:h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-accent-blue transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Camera size={12} className="lg:hidden" />
              <Camera size={16} className="hidden lg:block" />
            </motion.button>
          </div>
          
          <div className="flex-1">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-3 lg:mb-4">
              <div>
                <h2 className="text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900">
                  {profile?.first_name || 'User'} {profile?.last_name || ''}
                </h2>
                <div className="flex items-center space-x-2 text-gray-600 mt-1 text-sm lg:text-base">
                  <Briefcase size={14} className="lg:hidden" />
                  <Briefcase size={16} className="hidden lg:block" />
                  <span className="text-sm lg:text-base">{profile?.occupation || 'Not specified'}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-500 mt-1 text-sm lg:text-base">
                  <MapPin size={14} className="lg:hidden" />
                  <MapPin size={16} className="hidden lg:block" />
                  <span className="text-sm lg:text-base">{profile?.location || 'Not specified'}</span>
                </div>
              </div>
              
              <InteractiveHoverButton
                variant={isEditing ? "blue" : "white"}
                text={isEditing ? "Cancel" : "Edit Profile"}
                icon={<Edit3 size={14} />}
                onClick={isEditing ? handleCancel : () => setIsEditing(true)}
                className="mt-3 lg:mt-0 px-3 py-2 text-xs lg:text-sm"
              />
            </div>
            
            {isEditing ? (
              <textarea
                value={editData.bio}
                onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                className="w-full p-2 lg:p-3 border border-gray-200 rounded-lg lg:rounded-xl bg-white/80 backdrop-blur-sm focus:outline-none focus:border-accent-blue transition-colors resize-none text-sm lg:text-base"
                rows={2}
                placeholder="Tell us about yourself..."
              />
            ) : (
              <p className="text-gray-700 leading-relaxed text-sm lg:text-base">{profile?.bio || 'No bio available'}</p>
            )}
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <div className="bg-white/80 backdrop-blur-xl rounded-xl lg:rounded-2xl border border-gray-200/50 p-4 lg:p-6">
          <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-3 lg:mb-4">Personal Information</h3>
          <div className="space-y-3 lg:space-y-4">
            {[
              { 
                icon: User, 
                label: 'Full Name', 
                value: `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() || 'Not specified',
                editKey: 'name',
                editable: true 
              },
              { 
                icon: Mail, 
                label: 'Email', 
                value: profile?.email || 'Not specified',
                editKey: 'email',
                editable: true 
              },
              { 
                icon: Calendar, 
                label: 'Member Since', 
                value: profile?.join_date ? new Date(profile.join_date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                }) : 'Not available',
                editable: false 
              },
              { 
                icon: CreditCard, 
                label: 'Credit Score', 
                value: profile?.credit_score?.toString() || '700',
                editable: false 
              }
            ].map(({ icon: Icon, label, value, editKey, editable }) => (
              <div key={label} className="flex items-center space-x-3">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gray-100 rounded-lg lg:rounded-xl flex items-center justify-center">
                  <Icon size={14} className="text-gray-600 lg:hidden" />
                  <Icon size={18} className="text-gray-600 hidden lg:block" />
                </div>
                <div className="flex-1">
                  <div className="text-xs lg:text-sm text-gray-500 uppercase tracking-wide">{label}</div>
                  {isEditing && editable ? (
                    editKey === 'name' ? (
                      <div className="flex space-x-1 lg:space-x-2 mt-1">
                        <input
                          type="text"
                          value={editData.first_name}
                          onChange={(e) => setEditData({ ...editData, first_name: e.target.value })}
                          placeholder="First name"
                          className="flex-1 p-1 lg:p-2 border border-gray-200 rounded-md lg:rounded-lg bg-white/80 backdrop-blur-sm focus:outline-none focus:border-accent-blue transition-colors text-sm"
                        />
                        <input
                          type="text"
                          value={editData.last_name}
                          onChange={(e) => setEditData({ ...editData, last_name: e.target.value })}
                          placeholder="Last name"
                          className="flex-1 p-1 lg:p-2 border border-gray-200 rounded-md lg:rounded-lg bg-white/80 backdrop-blur-sm focus:outline-none focus:border-accent-blue transition-colors text-sm"
                        />
                      </div>
                    ) : (
                      <input
                        type={editKey === 'email' ? 'email' : 'text'}
                        value={editData[editKey as keyof typeof editData]}
                        onChange={(e) => setEditData({ ...editData, [editKey]: e.target.value })}
                        className="w-full mt-1 p-1 lg:p-2 border border-gray-200 rounded-md lg:rounded-lg bg-white/80 backdrop-blur-sm focus:outline-none focus:border-accent-blue transition-colors text-sm"
                      />
                    )
                  ) : (
                    <div className="text-gray-900 font-medium text-sm lg:text-base">{value}</div>
                  )}
                </div>
              </div>
            ))}

            {/* Additional editable fields */}
            {isEditing && (
              <>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gray-100 rounded-lg lg:rounded-xl flex items-center justify-center">
                    <MapPin size={14} className="text-gray-600 lg:hidden" />
                    <MapPin size={18} className="text-gray-600 hidden lg:block" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs lg:text-sm text-gray-500 uppercase tracking-wide">Location</div>
                    <input
                      type="text"
                      value={editData.location}
                      onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                      placeholder="City, State"
                      className="w-full mt-1 p-1 lg:p-2 border border-gray-200 rounded-md lg:rounded-lg bg-white/80 backdrop-blur-sm focus:outline-none focus:border-accent-blue transition-colors text-sm"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gray-100 rounded-lg lg:rounded-xl flex items-center justify-center">
                    <Briefcase size={14} className="text-gray-600 lg:hidden" />
                    <Briefcase size={18} className="text-gray-600 hidden lg:block" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs lg:text-sm text-gray-500 uppercase tracking-wide">Occupation</div>
                    <input
                      type="text"
                      value={editData.occupation}
                      onChange={(e) => setEditData({ ...editData, occupation: e.target.value })}
                      placeholder="Your job title"
                      className="w-full mt-1 p-1 lg:p-2 border border-gray-200 rounded-md lg:rounded-lg bg-white/80 backdrop-blur-sm focus:outline-none focus:border-accent-blue transition-colors text-sm"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gray-100 rounded-lg lg:rounded-xl flex items-center justify-center">
                    <User size={14} className="text-gray-600 lg:hidden" />
                    <User size={18} className="text-gray-600 hidden lg:block" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs lg:text-sm text-gray-500 uppercase tracking-wide">Phone</div>
                    <input
                      type="tel"
                      value={editData.phone}
                      onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                      placeholder="+1 (555) 123-4567"
                      className="w-full mt-1 p-1 lg:p-2 border border-gray-200 rounded-md lg:rounded-lg bg-white/80 backdrop-blur-sm focus:outline-none focus:border-accent-blue transition-colors text-sm"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-xl lg:rounded-2xl border border-gray-200/50 p-4 lg:p-6">
          <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-3 lg:mb-4">Financial Summary</h3>
          <div className="space-y-3 lg:space-y-4">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/50 rounded-lg lg:rounded-xl p-3 lg:p-4">
              <div className="text-xs lg:text-sm text-green-700 uppercase tracking-wide mb-1">Total Balance</div>
              <div className="text-lg lg:text-xl xl:text-2xl font-bold text-green-900">
                ${(profile?.total_balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 lg:gap-4">
              <div className="bg-blue-50 border border-blue-200/50 rounded-lg lg:rounded-xl p-3 lg:p-4">
                <div className="text-xs lg:text-sm text-blue-700 uppercase tracking-wide mb-1">Monthly Income</div>
                <div className="text-sm lg:text-base xl:text-lg font-bold text-blue-900">
                  ${(profile?.monthly_income || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
              </div>
              
              <div className="bg-orange-50 border border-orange-200/50 rounded-lg lg:rounded-xl p-3 lg:p-4">
                <div className="text-xs lg:text-sm text-orange-700 uppercase tracking-wide mb-1">Monthly Expenses</div>
                <div className="text-sm lg:text-base xl:text-lg font-bold text-orange-900">
                  ${(profile?.monthly_expenses || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
              </div>
            </div>
            
            <div className="bg-purple-50 border border-purple-200/50 rounded-lg lg:rounded-xl p-3 lg:p-4">
              <div className="text-xs lg:text-sm text-purple-700 uppercase tracking-wide mb-1">Savings Rate</div>
              <div className="text-base lg:text-lg xl:text-xl font-bold text-purple-900">
                {(profile?.savings_rate || 0).toFixed(1)}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="flex flex-col lg:flex-row justify-end space-y-2 lg:space-y-0 lg:space-x-3">
          <InteractiveHoverButton
            variant="white"
            text="Cancel"
            onClick={handleCancel}
            className="px-4 py-2 text-sm"
          />
          <InteractiveHoverButton
            variant="blue"
            text={isSaving ? "Saving..." : "Save Changes"}
            icon={isSaving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 disabled:opacity-50 text-sm"
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
                      <span>{achievement.progress.toFixed(0)}%</span>
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
          const progress = goal.target > 0 ? (goal.current / goal.target) * 100 : 0;
          const remaining = Math.max(0, goal.target - goal.current);
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
        <h1 className="text-base md:text-lg lg:text-xl xl:text-2xl mb-2 font-bold tracking-wide">Profile</h1>
        <motion.div 
          className="w-8 md:w-10 lg:w-12 xl:w-16 h-px bg-accent-blue"
          initial={{ width: 0 }}
          animate={{ width: window.innerWidth >= 1280 ? 64 : window.innerWidth >= 1024 ? 48 : window.innerWidth >= 768 ? 40 : 32 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        />
        <p className="text-gray-600 mt-2 text-xs md:text-sm lg:text-base">Manage your personal information and preferences</p>
      </AnimatedSection>

      {/* Tab Navigation */}
      <div className="bg-white/80 backdrop-blur-xl rounded-xl lg:rounded-2xl border border-gray-200/50 p-1">
        <nav className="flex space-x-1 overflow-x-auto scrollbar-hide min-w-0">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-1 lg:space-x-2 px-2 md:px-3 lg:px-4 py-2 lg:py-3 rounded-lg lg:rounded-xl transition-all whitespace-nowrap flex-shrink-0 ${
                  activeTab === tab.id
                    ? 'bg-accent-blue text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon size={12} className="md:hidden" />
                <Icon size={14} className="hidden md:block lg:hidden" />
                <Icon size={16} className="hidden lg:block" />
                <span className="font-medium text-xs">{tab.label}</span>
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