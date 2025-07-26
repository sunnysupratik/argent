import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';

// Mock auth context
const mockAuthContext = {
  user: {
    id: 'test-user-id',
    username: 'testuser',
    email: 'test@example.com',
    full_name: 'Test User',
    created_at: '2024-01-01T00:00:00Z',
  },
  loading: false,
  signIn: vi.fn(),
  signUp: vi.fn(),
  signOut: vi.fn(),
};

// Create a custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter>
      {children}
    </BrowserRouter>
  );
};

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };

// Mock data generators
export const mockUser = {
  id: 'test-user-id',
  username: 'testuser',
  email: 'test@example.com',
  full_name: 'Test User',
  created_at: '2024-01-01T00:00:00Z',
  password: 'hashedpassword',
  user_name: 'testuser',
};

export const mockAccount = {
  id: 'test-account-id',
  custom_user_id: 'test-user-id',
  account_name: 'Test Checking',
  account_type: 'checking',
  current_balance: 5000.00,
  created_at: '2024-01-01T00:00:00Z',
  user_name: 'testuser',
};

export const mockTransaction = {
  id: 'test-transaction-id',
  custom_user_id: 'test-user-id',
  account_id: 'test-account-id',
  category_id: 'test-category-id',
  description: 'Test Transaction',
  amount: 100.00,
  type: 'expense' as const,
  transaction_date: '2024-01-01T00:00:00Z',
  user_name: 'testuser',
  category: { name: 'Food' },
  account: { account_name: 'Test Checking' },
};

export const mockInvestment = {
  id: 'test-investment-id',
  custom_user_id: 'test-user-id',
  user_name: 'testuser',
  symbol: 'AAPL',
  name: 'Apple Inc.',
  shares: 10,
  current_price: 150.00,
  total_value: 1500.00,
  day_change: 5.00,
  day_change_percent: 0.33,
  sector: 'Technology',
  market_cap: '2.5T',
  pe: 25.5,
  dividend: 0.88,
  rating: 'Buy',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

export const mockProfile = {
  id: 'test-profile-id',
  custom_user_id: 'test-user-id',
  first_name: 'Test',
  last_name: 'User',
  email: 'test@example.com',
  phone: '+1234567890',
  bio: 'Test bio',
  location: 'Test City',
  occupation: 'Software Engineer',
  profile_picture_url: null,
  credit_score: 750,
  total_balance: 10000.00,
  monthly_income: 5000.00,
  monthly_expenses: 3000.00,
  savings_rate: 40.0,
  timezone: 'America/New_York',
  currency: 'USD',
  language: 'en',
  join_date: '2024-01-01T00:00:00Z',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

// Mock auth context provider
export const MockAuthProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

// Helper function to create mock Supabase responses
export const createMockSupabaseResponse = (data: any, error: any = null) => ({
  data,
  error,
  status: error ? 400 : 200,
  statusText: error ? 'Bad Request' : 'OK',
});