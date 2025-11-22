import { supabase, supabaseAdmin } from '../../config/supabase';

export interface SignUpData {
  email: string;
  password: string;
  fullName: string;
  role?: 'admin' | 'manager' | 'employee';
}

export interface SignInData {
  email: string;
  password: string;
}

export const authApi = {
  // Sign up new user
  signUp: async (data: SignUpData) => {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.fullName,
          role: data.role || 'employee'
        }
      }
    });

    if (authError) throw authError;

    // Create user profile
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: data.email,
          full_name: data.fullName,
          role: data.role || 'employee'
        });

      if (profileError) throw profileError;
    }

    return authData;
  },

  // Sign in existing user
  signIn: async (data: SignInData) => {
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password
    });

    if (error) throw error;
    return authData;
  },

  // Sign out
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Get current session
  getSession: async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  },

  // Get current user
  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },

  // Reset password
  resetPassword: async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  },

  // Admin: Create user with password (requires service role key)
  createUserAsAdmin: async (userData: {
    email: string;
    password: string;
    fullName: string;
    role: 'admin' | 'manager' | 'employee';
  }) => {
    // This requires Supabase service role key, not anon key
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: userData.email,
      password: userData.password,
      email_confirm: true,
      user_metadata: {
        full_name: userData.fullName,
        role: userData.role
      }
    });

    if (authError) throw authError;

    // Create user profile
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: userData.email,
          full_name: userData.fullName,
          role: userData.role
        });

      if (profileError) throw profileError;
    }

    return authData;
  },

  // Admin: Create user (bypasses RLS)
  createUserAsAdmin: async (userData: {
    email: string;
    password: string;
    fullName: string;
    role: 'admin' | 'manager' | 'employee';
  }) => {
    // Validate password length
    if (userData.password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    if (!supabaseAdmin) {
      throw new Error('Service role key not configured. Add VITE_SUPABASE_SERVICE_ROLE_KEY to .env.local');
    }

    // Create auth user with admin privileges (bypasses email confirmation)
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: userData.email,
      password: userData.password,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        full_name: userData.fullName,
        role: userData.role
      }
    });

    if (authError) throw authError;

    // Double-check email confirmation
    if (authData.user) {
      await supabaseAdmin.auth.admin.updateUserById(authData.user.id, {
        email_confirm: true
      });
    }

    // If auth user created, create profile using service account
    if (authData.user) {
      // Use RPC function to bypass RLS
      const { data: profileData, error: profileError } = await supabaseAdmin
        .rpc('create_user_profile', {
          user_id: authData.user.id,
          user_email: userData.email,
          user_full_name: userData.fullName,
          user_role: userData.role
        });

      if (profileError) {
        console.warn('Profile creation failed, but auth user exists:', profileError);
        // Don't throw error - auth user was created successfully
      }
    }

    return authData;
  },
  // Admin: Delete user (requires service role)
  deleteUser: async (userId: string) => {
    // Delete from auth.users (requires admin privileges)
    const { error: authError } = await supabase.auth.admin.deleteUser(userId);
    if (authError) throw authError;

    // Delete from public.users table
    const { error: profileError } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);

    if (profileError) throw profileError;

    return { success: true };
  },

  // Admin: Confirm user email
  confirmUserEmail: async (userId: string) => {
    if (!supabaseAdmin) {
      throw new Error('Service role key required');
    }

    const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      email_confirm: true
    });

    if (error) throw error;
    return { success: true };
  },

  // Admin: Update user password
  updateUserPassword: async (userId: string, newPassword: string) => {
    if (!supabaseAdmin) {
      throw new Error('Service role key required for admin operations');
    }

    const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      password: newPassword
    });

    if (error) throw error;
    return { success: true };
  },

  // Update password
  updatePassword: async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });
    if (error) throw error;
  }
};
