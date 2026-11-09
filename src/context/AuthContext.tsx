import React, { createContext, useContext, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  type StaffRole,
  type StaffUser,
  DEMO_STAFF_ACCOUNTS,
} from '../lib/staffRoster';

export type { StaffRole, StaffUser };

interface AuthContextType {
  user: StaffUser | null;
  role: StaffRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  switchRole: (role: StaffRole) => void;
}

const STORAGE_KEY = 'foxbat_staff_session';

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  isAuthenticated: false,
  isLoading: false,
  login: async () => ({ success: false }),
  logout: () => {},
  switchRole: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<StaffUser | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      return stored ? (JSON.parse(stored) as StaffUser) : null;
    } catch {
      sessionStorage.removeItem(STORAGE_KEY);
      return null;
    }
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    const cleanEmail = email.trim().toLowerCase();

    // 1. If Supabase is live and configured, attempt Supabase Auth first
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

        if (error) {
          setIsLoading(false);
          return { success: false, error: error.message };
        }

        // Query user's staff role from user_metadata
        const userRole = (data.user?.user_metadata?.role as StaffRole) || null;
        if (!userRole || !['owner', 'admin', 'moderator', 'crew'].includes(userRole)) {
          await supabase.auth.signOut();
          setIsLoading(false);
          return {
            success: false,
            error: 'Access Denied: Your account does not possess staff clearance (Owner, Admin, Moderator, or Crew).',
          };
        }

        const authenticatedUser: StaffUser = {
          id: data.user.id,
          email: data.user.email || cleanEmail,
          name: data.user.user_metadata?.name || 'Staff Member',
          role: userRole,
          callsign: data.user.user_metadata?.callsign || 'FOX-SEC',
          clearanceLevel: `LEVEL ${userRole === 'owner' ? '5' : userRole === 'admin' ? '4' : '3'} — ${userRole.toUpperCase()}`,
        };

        setUser(authenticatedUser);
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(authenticatedUser));
        setIsLoading(false);
        return { success: true };
      } catch (err: unknown) {
        setIsLoading(false);
        return {
          success: false,
          error: err instanceof Error ? err.message : 'Supabase authentication failed.',
        };
      }
    }

    // 2. Fallback / Localhost Development Roster
    await new Promise((resolve) => setTimeout(resolve, 350));

    const staffAccount = DEMO_STAFF_ACCOUNTS[cleanEmail];

    if (!staffAccount) {
      setIsLoading(false);
      return {
        success: false,
        error:
          'Access Denied: Unrecognized or non-staff account. Only Admin, Moderator, Crew, and Owner personnel may enter.',
      };
    }

    if (!password || password.length < 6) {
      setIsLoading(false);
      return {
        success: false,
        error: 'Authentication failed: Password must be at least 6 characters.',
      };
    }

    setUser(staffAccount);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(staffAccount));
    setIsLoading(false);
    return { success: true };
  };

  const logout = () => {
    if (isSupabaseConfigured && supabase) {
      supabase.auth.signOut().catch(() => {});
    }
    setUser(null);
    sessionStorage.removeItem(STORAGE_KEY);
  };

  const switchRole = (newRole: StaffRole) => {
    const matchingAccount = Object.values(DEMO_STAFF_ACCOUNTS).find(
      (acc) => acc.role === newRole
    );
    if (matchingAccount) {
      setUser(matchingAccount);
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(matchingAccount));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isAuthenticated: Boolean(user),
        isLoading,
        login,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
