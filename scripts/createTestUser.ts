/**
 * Script to create a test user in Supabase
 * Run this after setting up your Supabase database
 * 
 * Usage:
 * 1. Make sure your .env.local has correct Supabase credentials
 * 2. Run: npx tsx scripts/createTestUser.ts
 */

import { authApi } from '../utils/api';

async function createTestUser() {
  try {
    console.log('Creating test user...');
    
    const testUser = {
      email: 'test@aspire.com',
      password: 'Test123456!',
      fullName: 'Test User',
      role: 'employee' as const
    };

    const result = await authApi.signUp(testUser);
    
    console.log('✅ Test user created successfully!');
    console.log('Email:', testUser.email);
    console.log('Password:', testUser.password);
    console.log('User ID:', result.user?.id);
    console.log('\nYou can now log in with these credentials.');
    
  } catch (error: any) {
    console.error('❌ Failed to create test user:', error.message);
    
    if (error.message.includes('already registered')) {
      console.log('\n💡 User already exists. You can log in with:');
      console.log('Email: test@aspire.com');
      console.log('Password: Test123456!');
    }
  }
}

createTestUser();
