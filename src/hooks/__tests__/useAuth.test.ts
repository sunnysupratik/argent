import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuth } from '../useAuth';
import { customAuth } from '../../lib/supabase';

// Mock the supabase module
vi.mock('../../lib/supabase', () => ({
  customAuth: {
    signIn: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
    getCurrentUser: vi.fn(),
  },
}));

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should initialize with no user and loading false', () => {
    vi.mocked(customAuth.getCurrentUser).mockReturnValue(null);
    
    const { result } = renderHook(() => useAuth());
    
    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('should load existing user from localStorage', () => {
    const mockUser = {
      id: 'test-id',
      username: 'testuser',
      email: 'test@example.com',
      full_name: 'Test User',
      created_at: '2024-01-01T00:00:00Z',
      password: 'hashedpassword',
    };
    
    vi.mocked(customAuth.getCurrentUser).mockReturnValue(mockUser);
    
    const { result } = renderHook(() => useAuth());
    
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.loading).toBe(false);
  });

  it('should sign in successfully', async () => {
    const mockUser = {
      id: 'test-id',
      username: 'testuser',
      email: 'test@example.com',
      full_name: 'Test User',
      created_at: '2024-01-01T00:00:00Z',
      password: 'hashedpassword',
    };
    
    vi.mocked(customAuth.getCurrentUser).mockReturnValue(null);
    vi.mocked(customAuth.signIn).mockResolvedValue({ user: mockUser, error: null });
    
    const { result } = renderHook(() => useAuth());
    
    await act(async () => {
      const response = await result.current.signIn('testuser', 'password');
      expect(response.data?.user).toEqual(mockUser);
      expect(response.error).toBeNull();
    });
    
    expect(result.current.user).toEqual(mockUser);
    expect(customAuth.signIn).toHaveBeenCalledWith('testuser', 'password');
  });

  it('should handle sign in error', async () => {
    const mockError = { message: 'Invalid credentials' };
    
    vi.mocked(customAuth.getCurrentUser).mockReturnValue(null);
    vi.mocked(customAuth.signIn).mockResolvedValue({ user: null, error: mockError });
    
    const { result } = renderHook(() => useAuth());
    
    await act(async () => {
      const response = await result.current.signIn('testuser', 'wrongpassword');
      expect(response.data).toBeNull();
      expect(response.error).toEqual(mockError);
    });
    
    expect(result.current.user).toBeNull();
  });

  it('should sign up successfully', async () => {
    const mockUser = {
      id: 'test-id',
      username: 'newuser',
      email: 'new@example.com',
      full_name: 'New User',
      created_at: '2024-01-01T00:00:00Z',
      password: 'hashedpassword',
    };
    
    vi.mocked(customAuth.getCurrentUser).mockReturnValue(null);
    vi.mocked(customAuth.signUp).mockResolvedValue({ user: mockUser, error: null });
    
    const { result } = renderHook(() => useAuth());
    
    await act(async () => {
      const response = await result.current.signUp('newuser', 'password', 'New User', 'new@example.com');
      expect(response.data?.user).toEqual(mockUser);
      expect(response.error).toBeNull();
    });
    
    expect(result.current.user).toEqual(mockUser);
    expect(customAuth.signUp).toHaveBeenCalledWith('newuser', 'password', 'New User', 'new@example.com');
  });

  it('should sign out successfully', async () => {
    const mockUser = {
      id: 'test-id',
      username: 'testuser',
      email: 'test@example.com',
      full_name: 'Test User',
      created_at: '2024-01-01T00:00:00Z',
      password: 'hashedpassword',
    };
    
    vi.mocked(customAuth.getCurrentUser).mockReturnValue(mockUser);
    vi.mocked(customAuth.signOut).mockResolvedValue({ error: null });
    
    const { result } = renderHook(() => useAuth());
    
    // Initially should have user
    expect(result.current.user).toEqual(mockUser);
    
    await act(async () => {
      const response = await result.current.signOut();
      expect(response.error).toBeNull();
    });
    
    expect(result.current.user).toBeNull();
    expect(customAuth.signOut).toHaveBeenCalled();
  });

  it('should handle loading state during sign in', async () => {
    vi.mocked(customAuth.getCurrentUser).mockReturnValue(null);
    vi.mocked(customAuth.signIn).mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({ user: null, error: null }), 100))
    );
    
    const { result } = renderHook(() => useAuth());
    
    act(() => {
      result.current.signIn('testuser', 'password');
    });
    
    expect(result.current.loading).toBe(true);
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 150));
    });
    
    expect(result.current.loading).toBe(false);
  });
});