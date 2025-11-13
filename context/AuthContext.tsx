import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserAccount, ActivityLog } from '../types/user';

interface AuthContextType {
  currentUser: UserAccount | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
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

  useEffect(() => {
    // Load user from localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Mock login - replace with actual API call
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: UserAccount) => u.username === username);
    
    if (user && user.status === 'active') {
      const updatedUser = { ...user, lastLogin: new Date().toISOString() };
      setCurrentUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      logActivity('login', 'auth', undefined, 'User logged in');
      return true;
    }
    return false;
  };

  const logout = () => {
    if (currentUser) {
      logActivity('logout', 'auth', undefined, 'User logged out');
    }
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const hasPermission = (resource: string, action: 'create' | 'read' | 'update' | 'delete'): boolean => {
    if (!currentUser) return false;
    
    // Super admin has all permissions
    if (currentUser.role === 'super_admin') return true;
    
    // Check custom permissions if defined
    if (currentUser.permissions) {
      const permission = currentUser.permissions.find(p => p.resource === resource);
      return permission ? permission.actions.includes(action) : false;
    }
    
    return false;
  };

  const logActivity = (action: string, resource: string, resourceId?: string, details?: string) => {
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
    
    // Keep only last 1000 logs
    if (logs.length > 1000) {
      logs.splice(1000);
    }
    
    localStorage.setItem('activityLogs', JSON.stringify(logs));
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, hasPermission, logActivity }}>
      {children}
    </AuthContext.Provider>
  );
};
