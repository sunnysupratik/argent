import React, { useState } from 'react';
import { Bell, Shield, Palette, Globe, Download, Trash2, User, CreditCard, Lock, Eye, EyeOff, Save, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { InteractiveHoverButton } from './ui/interactive-hover-button';
import AnimatedSection from './AnimatedSection';

const Settings: React.FC = () => {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: true,
    marketing: false,
    transactionAlerts: true,
    budgetAlerts: true,
    investmentUpdates: false,
    weeklyReports: true
  });

  const [privacy, setPrivacy] = useState({
    dataSharing: false,
    analytics: true,
    thirdParty: false,
    locationTracking: false,
    biometricAuth: true,
    twoFactorAuth: false
  });

  const [profile, setProfile] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    timezone: 'America/New_York',
    currency: 'USD',
    language: 'en'
  });

  const [security, setSecurity] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    showCurrentPassword: false,
    showNewPassword: false,
    showConfirmPassword: false
  });

  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield },
    { id: 'preferences', label: 'Preferences', icon: Palette },
    { id: 'data', label: 'Data Management', icon: Globe },
  ];

  const ToggleSwitch = ({ checked, onChange, disabled = false }: { checked: boolean; onChange: (checked: boolean) => void; disabled?: boolean }) => (
    <motion.button
      onClick={() => !disabled && onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? 'bg-accent-blue' : 'bg-gray-300'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      whileTap={!disabled ? { scale: 0.95 } : {}}
    >
      <motion.span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
        layout
      />
    </motion.button>
  );

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
          <input
            type="text"
            value={profile.firstName}
            onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white/80 backdrop-blur-sm focus:outline-none focus:border-accent-blue transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
          <input
            type="text"
            value={profile.lastName}
            onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white/80 backdrop-blur-sm focus:outline-none focus:border-accent-blue transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
        <input
          type="email"
          value={profile.email}
          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white/80 backdrop-blur-sm focus:outline-none focus:border-accent-blue transition-colors"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
        <input
          type="tel"
          value={profile.phone}
          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white/80 backdrop-blur-sm focus:outline-none focus:border-accent-blue transition-colors"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
          <select
            value={profile.timezone}
            onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white/80 backdrop-blur-sm focus:outline-none focus:border-accent-blue transition-colors"
          >
            <option value="America/New_York">Eastern Time</option>
            <option value="America/Chicago">Central Time</option>
            <option value="America/Denver">Mountain Time</option>
            <option value="America/Los_Angeles">Pacific Time</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
          <select
            value={profile.currency}
            onChange={(e) => setProfile({ ...profile, currency: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white/80 backdrop-blur-sm focus:outline-none focus:border-accent-blue transition-colors"
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="CAD">CAD (C$)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
          <select
            value={profile.language}
            onChange={(e) => setProfile({ ...profile, language: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white/80 backdrop-blur-sm focus:outline-none focus:border-accent-blue transition-colors"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div className="bg-blue-50/80 backdrop-blur-sm border border-blue-200/50 rounded-xl p-4">
        <h4 className="font-medium text-blue-900 mb-2">Email Notifications</h4>
        <div className="space-y-4">
          {[
            { key: 'email', label: 'General Email Updates', description: 'Account updates and important announcements' },
            { key: 'transactionAlerts', label: 'Transaction Alerts', description: 'Notifications for new transactions' },
            { key: 'budgetAlerts', label: 'Budget Alerts', description: 'Alerts when approaching budget limits' },
            { key: 'weeklyReports', label: 'Weekly Reports', description: 'Weekly financial summary reports' }
          ].map(({ key, label, description }) => (
            <div key={key} className="flex items-center justify-between py-2">
              <div className="flex-1">
                <div className="font-medium text-gray-900">{label}</div>
                <div className="text-sm text-gray-600">{description}</div>
              </div>
              <ToggleSwitch
                checked={notifications[key as keyof typeof notifications]}
                onChange={(checked) => setNotifications({ ...notifications, [key]: checked })}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-green-50/80 backdrop-blur-sm border border-green-200/50 rounded-xl p-4">
        <h4 className="font-medium text-green-900 mb-2">Push Notifications</h4>
        <div className="space-y-4">
          {[
            { key: 'push', label: 'Mobile Push Notifications', description: 'Real-time notifications on your mobile device' },
            { key: 'investmentUpdates', label: 'Investment Updates', description: 'Market changes and portfolio updates' }
          ].map(({ key, label, description }) => (
            <div key={key} className="flex items-center justify-between py-2">
              <div className="flex-1">
                <div className="font-medium text-gray-900">{label}</div>
                <div className="text-sm text-gray-600">{description}</div>
              </div>
              <ToggleSwitch
                checked={notifications[key as keyof typeof notifications]}
                onChange={(checked) => setNotifications({ ...notifications, [key]: checked })}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-purple-50/80 backdrop-blur-sm border border-purple-200/50 rounded-xl p-4">
        <h4 className="font-medium text-purple-900 mb-2">SMS & Marketing</h4>
        <div className="space-y-4">
          {[
            { key: 'sms', label: 'SMS Notifications', description: 'Text messages for critical alerts' },
            { key: 'marketing', label: 'Marketing Communications', description: 'Promotional offers and product updates' }
          ].map(({ key, label, description }) => (
            <div key={key} className="flex items-center justify-between py-2">
              <div className="flex-1">
                <div className="font-medium text-gray-900">{label}</div>
                <div className="text-sm text-gray-600">{description}</div>
              </div>
              <ToggleSwitch
                checked={notifications[key as keyof typeof notifications]}
                onChange={(checked) => setNotifications({ ...notifications, [key]: checked })}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPrivacyTab = () => (
    <div className="space-y-6">
      <div className="bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-xl p-4">
        <h4 className="font-medium text-red-900 mb-2">Data Privacy</h4>
        <div className="space-y-4">
          {[
            { key: 'dataSharing', label: 'Data Sharing', description: 'Allow sharing of anonymized data for research' },
            { key: 'analytics', label: 'Usage Analytics', description: 'Help improve our service with usage analytics' },
            { key: 'thirdParty', label: 'Third-party Integrations', description: 'Allow third-party services to access your data' },
            { key: 'locationTracking', label: 'Location Tracking', description: 'Use location data for enhanced features' }
          ].map(({ key, label, description }) => (
            <div key={key} className="flex items-center justify-between py-2">
              <div className="flex-1">
                <div className="font-medium text-gray-900">{label}</div>
                <div className="text-sm text-gray-600">{description}</div>
              </div>
              <ToggleSwitch
                checked={privacy[key as keyof typeof privacy]}
                onChange={(checked) => setPrivacy({ ...privacy, [key]: checked })}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-green-50/80 backdrop-blur-sm border border-green-200/50 rounded-xl p-4">
        <h4 className="font-medium text-green-900 mb-2">Security Settings</h4>
        <div className="space-y-4">
          {[
            { key: 'biometricAuth', label: 'Biometric Authentication', description: 'Use fingerprint or face recognition' },
            { key: 'twoFactorAuth', label: 'Two-Factor Authentication', description: 'Add an extra layer of security' }
          ].map(({ key, label, description }) => (
            <div key={key} className="flex items-center justify-between py-2">
              <div className="flex-1">
                <div className="font-medium text-gray-900">{label}</div>
                <div className="text-sm text-gray-600">{description}</div>
              </div>
              <ToggleSwitch
                checked={privacy[key as keyof typeof privacy]}
                onChange={(checked) => setPrivacy({ ...privacy, [key]: checked })}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-yellow-50/80 backdrop-blur-sm border border-yellow-200/50 rounded-xl p-4">
        <h4 className="font-medium text-yellow-900 mb-4">Change Password</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
            <div className="relative">
              <input
                type={security.showCurrentPassword ? 'text' : 'password'}
                value={security.currentPassword}
                onChange={(e) => setSecurity({ ...security, currentPassword: e.target.value })}
                className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl bg-white/80 backdrop-blur-sm focus:outline-none focus:border-accent-blue transition-colors"
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => setSecurity({ ...security, showCurrentPassword: !security.showCurrentPassword })}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {security.showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
            <div className="relative">
              <input
                type={security.showNewPassword ? 'text' : 'password'}
                value={security.newPassword}
                onChange={(e) => setSecurity({ ...security, newPassword: e.target.value })}
                className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl bg-white/80 backdrop-blur-sm focus:outline-none focus:border-accent-blue transition-colors"
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => setSecurity({ ...security, showNewPassword: !security.showNewPassword })}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {security.showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
            <div className="relative">
              <input
                type={security.showConfirmPassword ? 'text' : 'password'}
                value={security.confirmPassword}
                onChange={(e) => setSecurity({ ...security, confirmPassword: e.target.value })}
                className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl bg-white/80 backdrop-blur-sm focus:outline-none focus:border-accent-blue transition-colors"
                placeholder="Confirm new password"
              />
              <button
                type="button"
                onClick={() => setSecurity({ ...security, showConfirmPassword: !security.showConfirmPassword })}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {security.showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <InteractiveHoverButton
            variant="blue"
            text="Update Password"
            icon={<Lock size={14} />}
            className="w-full lg:w-auto px-6 py-3"
          />
        </div>
      </div>
    </div>
  );

  const renderPreferencesTab = () => (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl p-6">
        <h4 className="font-medium text-gray-900 mb-4">Display Preferences</h4>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
            <select className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white/80 backdrop-blur-sm focus:outline-none focus:border-accent-blue transition-colors">
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
            <select className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white/80 backdrop-blur-sm focus:outline-none focus:border-accent-blue transition-colors">
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl p-6">
        <h4 className="font-medium text-gray-900 mb-4">Dashboard Preferences</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">Show Account Balances</div>
              <div className="text-sm text-gray-600">Display account balances on dashboard</div>
            </div>
            <ToggleSwitch checked={true} onChange={() => {}} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">Auto-refresh Data</div>
              <div className="text-sm text-gray-600">Automatically refresh financial data</div>
            </div>
            <ToggleSwitch checked={true} onChange={() => {}} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">Show Investment Performance</div>
              <div className="text-sm text-gray-600">Display investment charts on dashboard</div>
            </div>
            <ToggleSwitch checked={false} onChange={() => {}} />
          </div>
        </div>
      </div>
    </div>
  );

  const renderDataTab = () => (
    <div className="space-y-6">
      <div className="bg-blue-50/80 backdrop-blur-sm border border-blue-200/50 rounded-xl p-6">
        <h4 className="font-medium text-blue-900 mb-4">Export Data</h4>
        <p className="text-sm text-gray-600 mb-4">
          Download your financial data in various formats for backup or analysis.
        </p>
        <div className="flex flex-col lg:flex-row gap-3">
          <InteractiveHoverButton
            variant="white"
            text="Export as CSV"
            icon={<Download size={14} />}
            className="px-6 py-3"
          />
          <InteractiveHoverButton
            variant="white"
            text="Export as PDF"
            icon={<Download size={14} />}
            className="px-6 py-3"
          />
          <InteractiveHoverButton
            variant="white"
            text="Export as JSON"
            icon={<Download size={14} />}
            className="px-6 py-3"
          />
        </div>
      </div>

      <div className="bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-xl p-6">
        <h4 className="font-medium text-red-900 mb-4">Danger Zone</h4>
        <p className="text-sm text-gray-600 mb-4">
          These actions are permanent and cannot be undone. Please proceed with caution.
        </p>
        <div className="space-y-3">
          <InteractiveHoverButton
            variant="white"
            text="Clear All Data"
            icon={<Trash2 size={14} />}
            className="px-6 py-3 border-red-300 text-red-700 hover:bg-red-50"
          />
          <InteractiveHoverButton
            variant="white"
            text="Delete Account"
            icon={<Trash2 size={14} />}
            className="px-6 py-3 border-red-500 text-red-800 hover:bg-red-100"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="mobile-spacing lg:p-8 space-y-6 lg:space-y-8">
      {/* Page Header */}
      <AnimatedSection className="mb-8 lg:mb-12">
        <h1 className="text-xl lg:text-2xl mb-2 font-bold uppercase tracking-wide">SETTINGS</h1>
        <motion.div 
          className="w-12 lg:w-16 h-px bg-accent-blue"
          initial={{ width: 0 }}
          animate={{ width: window.innerWidth >= 1024 ? 64 : 48 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        />
      </AnimatedSection>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 p-2 lg:p-4">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 lg:px-4 py-3 text-left rounded-xl transition-all ${
                      activeTab === tab.id
                        ? 'bg-accent-blue text-white shadow-lg'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon size={18} />
                    <span className="font-medium text-sm lg:text-base">{tab.label}</span>
                  </motion.button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 p-6 lg:p-8"
          >
            {activeTab === 'profile' && renderProfileTab()}
            {activeTab === 'notifications' && renderNotificationsTab()}
            {activeTab === 'privacy' && renderPrivacyTab()}
            {activeTab === 'preferences' && renderPreferencesTab()}
            {activeTab === 'data' && renderDataTab()}

            {/* Save Button */}
            <div className="mt-8 pt-6 border-t border-gray-200/50">
              <InteractiveHoverButton
                variant="blue"
                text={isSaving ? "Saving..." : "Save Changes"}
                icon={isSaving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
                onClick={handleSave}
                disabled={isSaving}
                className="w-full lg:w-auto px-8 py-3 disabled:opacity-50"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Settings;