import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserAccount, ActivityLog } from '../types/user';
import { authApi, usersApi } from '../utils/api';
import { supabase } from '../config/supabase';

interface AuthContextType {
  currentUser: UserAccount | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUserProfile: (updates: Partial<UserAccount>) => void;
  hasPermission: (resource: string, action: 'create' | 'read' | 'update' | 'delete') => boolean;
  logActivity: (action: string, resource: string, resourceId?: string, details?: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [loading, setLoading] = useState(true); // Start with true to check session

  useEffect(() => {
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          await loadUserProfile(session.user.id);
        } else {
          setCurrentUser(null);
          setLoading(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkSession = async () => {
    try {
      const session = await authApi.getSession();
      if (session?.user) {
        // Create basic user from session immediately
        const basicUser: UserAccount = {
          id: session.user.id,
          username: session.user.email?.split('@')[0] || 'user',
          email: session.user.email || '',
          fullName: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
          avatar: '/imgs/default-avatar.png',
          role: 'employee' as any,
          status: 'active',
          permissions: [],
          createdAt: session.user.created_at || new Date().toISOString(),
          lastLogin: new Date().toISOString()
        };
        
        // Set basic user immediately so app can proceed
        setCurrentUser(basicUser);
        setLoading(false);
        
        // Try to load full profile in background
        loadUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Session check error:', error);
      setLoading(false);
    }
  };

  const loadUserProfile = async (userId: string) => {
    try {
      // Add timeout to prevent hanging
      const profilePromise = usersApi.getUser(userId);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Profile load timeout')), 3000)
      );
      
      const profile = await Promise.race([profilePromise, timeoutPromise]) as any;
      
      if (profile) {
        const userAccount: UserAccount = {
          id: profile.id,
          username: profile.email.split('@')[0],
          email: profile.email,
          fullName: profile.full_name,
          avatar: profile.avatar_url || '/imgs/default-avatar.png',
          role: profile.role as any,
          status: 'active',
          permissions: [],
          createdAt: profile.created_at,
          lastLogin: new Date().toISOString()
        };
        setCurrentUser(userAccount);
      }
    } catch (error) {
      console.log('Using basic account (full profile unavailable)');
      // Don't clear currentUser - keep the basic one from session
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const result = await authApi.signIn({ email, password });
      
      if (result && result.user) {
        await loadUserProfile(result.user.id);
        logActivity('login', 'auth', undefined, 'User logged in');
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (currentUser) {
        logActivity('logout', 'auth', undefined, 'User logged out');
      }
      await authApi.signOut();
      setCurrentUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const updateUserProfile = (updates: Partial<UserAccount>) => {
    if (!currentUser) return;
    setCurrentUser({ ...currentUser, ...updates });
  };

  const hasPermission = (resource: string, action: 'create' | 'read' | 'update' | 'delete'): boolean => {
    if (!currentUser) return false;
    
    // Admin and super_admin have all permissions
    if (currentUser.role === 'super_admin' || currentUser.role === 'admin') return true;
    
    // Boss has most permissions except user management
    if (currentUser.role === 'boss') {
      if (resource === 'users' || resource === 'logs') return false;
      return true;
    }
    
    // Editor and Author have content permissions
    if (currentUser.role === 'editor' || currentUser.role === 'author') {
      const contentResources = ['menu', 'slider', 'books', 'news', 'activities', 'magazine', 'articles', 'courses', 'publications', 'infographics', 'videos', 'testimonials'];
      return contentResources.includes(resource);
    }
    
    if (currentUser.permissions) {
      const permission = currentUser.permissions.find(p => p.resource === resource);
      return permission ? permission.actions.includes(action) : false;
    }
    
    return false;
  };

  const logActivity = (action: string, resource: string, resourceId?: string, details?: string) => {
    try {
      if (!currentUser) return;
      
      const log: ActivityLog = {
        id: Date.now().toString(),
        userId: currentUser.id,
        username: currentUser.username,
        action,
        resource,
        resourceId,
        details,
        timestamp: new Date().toISOString(),
      };
      
      const logs = JSON.parse(localStorage.getItem('activityLogs') || '[]');
      logs.unshift(log);
      
      if (logs.length > 1000) {
        logs.splice(1000);
      }
      
      localStorage.setItem('activityLogs', JSON.stringify(logs));
    } catch (error) {
      console.error('Failed to log activity:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, login, logout, updateUserProfile, hasPermission, logActivity }}>
      {children}
    </AuthContext.Provider>
  );
};
