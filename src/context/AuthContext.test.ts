import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import { supabase } from '../utils/supabase';

vi.mock('../utils/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } },
      })),
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
      signUp: vi.fn(),
      resetPasswordForEmail: vi.fn(),
      updateUser: vi.fn(),
    },
  },
}));

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (supabase.auth.getSession as any).mockResolvedValue({
      data: { session: null },
      error: null,
    });
  });

  it('initially has a loading state and then resolves the user', async () => {
    const mockUser = { id: '123', email: 'test@test.com' };
    (supabase.auth.getSession as any).mockResolvedValue({
      data: { session: { user: mockUser } },
      error: null,
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('successfully logs in a user', async () => {
    const mockUser = { id: '123', email: 'test@test.com' };
    (supabase.auth.signInWithPassword as any).mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    await act(async () => {
      await result.current.login({ email: 'test@test.com', password: 'password123' });
    });

    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'test@test.com',
      password: 'password123',
    });
  });

  it('successfully signs up a user', async () => {
    const mockUser = { id: '123', email: 'test@test.com' };
    (supabase.auth.signUp as any).mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    await act(async () => {
      await result.current.signup({ 
        email: 'test@test.com', 
        password: 'password123',
        options: { data: { first_name: 'Test' } }
      });
    });

    expect(supabase.auth.signUp).toHaveBeenCalled();
  });

  it('clears user state on logout', async () => {
    (supabase.auth.signOut as any).mockResolvedValue({ error: null });

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    await act(async () => {
      await result.current.logout();
    });

    expect(supabase.auth.signOut).toHaveBeenCalled();
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('calls resetPassword with correct parameters', async () => {
    (supabase.auth.resetPasswordForEmail as any).mockResolvedValue({ data: {}, error: null });

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    await act(async () => {
      await result.current.resetPassword('test@test.com');
    });

    expect(supabase.auth.resetPasswordForEmail).toHaveBeenCalledWith(
      'test@test.com',
      expect.objectContaining({
        redirectTo: expect.stringContaining('/update-password'),
      })
    );
  });

  it('updates password successfully', async () => {
    const mockUser = { id: '123' };
    (supabase.auth.updateUser as any).mockResolvedValue({ data: { user: mockUser }, error: null });

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    await act(async () => {
      await result.current.updatePassword('newpassword123');
    });

    expect(supabase.auth.updateUser).toHaveBeenCalledWith({
      password: 'newpassword123',
    });
  });

  it('responds to auth state changes', async () => {
    let authCallback: any;
    
    (supabase.auth.onAuthStateChange as any).mockImplementation((fn: any) => {
      authCallback = fn;
      return { data: { subscription: { unsubscribe: vi.fn() } } };
    });

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    await waitFor(() => expect(result.current.loading).toBe(false));

    const mockUser = { id: '456', email: 'new@test.com' };
    
    await act(async () => {
      authCallback('SIGNED_IN', { user: mockUser });
    });

    await waitFor(() => {
      expect(result.current.user).toEqual(mockUser);
    });
    
    expect(result.current.isAuthenticated).toBe(true);

    await act(async () => {
      authCallback('PASSWORD_RECOVERY', { user: mockUser });
    });

    expect(result.current.isRecovering).toBe(true);

    await act(async () => {
      authCallback('SIGNED_OUT', null);
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isRecovering).toBe(false);
  });
});