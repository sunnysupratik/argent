import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../../test/utils/test-utils';
import LoginPage from '../../pages/LoginPage';
import userEvent from '@testing-library/user-event';

// Mock the auth hook
vi.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({
    user: null,
    loading: false,
    signIn: vi.fn(),
    signUp: vi.fn(),
  }),
}));

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render login form by default', () => {
    render(<LoginPage />);

    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('should toggle to sign up form', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    const signUpLink = screen.getByText('Sign Up');
    await user.click(signUpLink);

    expect(screen.getByText('Create Account')).toBeInTheDocument();
    expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
  });

  it('should show demo account section', () => {
    render(<LoginPage />);

    expect(screen.getByText('Try Demo Account')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('johndoe / Demo123!')).toBeInTheDocument();
  });

  it('should handle form input changes', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    const usernameInput = screen.getByLabelText('Username');
    const passwordInput = screen.getByLabelText('Password');

    await user.type(usernameInput, 'testuser');
    await user.type(passwordInput, 'testpassword');

    expect(usernameInput).toHaveValue('testuser');
    expect(passwordInput).toHaveValue('testpassword');
  });

  it('should toggle password visibility', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    const passwordInput = screen.getByLabelText('Password');
    const toggleButton = screen.getByRole('button', { name: /toggle password visibility/i });

    expect(passwordInput).toHaveAttribute('type', 'password');

    await user.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');

    await user.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('should validate required fields', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    await user.click(submitButton);

    // Form should not submit without required fields
    expect(screen.getByLabelText('Username')).toBeInvalid();
    expect(screen.getByLabelText('Password')).toBeInvalid();
  });

  it('should show remember me checkbox', () => {
    render(<LoginPage />);

    expect(screen.getByLabelText('Remember me')).toBeInTheDocument();
  });

  it('should show forgot password link', () => {
    render(<LoginPage />);

    expect(screen.getByText('Forgot password?')).toBeInTheDocument();
  });

  it('should render back to home button', () => {
    render(<LoginPage />);

    expect(screen.getByText('Back to Home')).toBeInTheDocument();
  });

  it('should show validation error for password mismatch in sign up', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    // Switch to sign up mode
    await user.click(screen.getByText('Sign Up'));

    // Fill form with mismatched passwords
    await user.type(screen.getByLabelText('Username'), 'newuser');
    await user.type(screen.getByLabelText('Full Name'), 'New User');
    await user.type(screen.getByLabelText('Email Address'), 'new@example.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.type(screen.getByLabelText('Confirm Password'), 'password456');

    const submitButton = screen.getByRole('button', { name: /create account/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
    });
  });
});