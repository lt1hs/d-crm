import React, { useState } from 'react';
import { supabase } from '../../config/supabase';

const SupabaseTest: React.FC = () => {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setResult('Testing connection...');
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('count');
      
      if (error) {
        setResult(`❌ Connection failed: ${error.message}`);
      } else {
        setResult(`✅ Connected to Supabase! Found ${data?.length || 0} users`);
      }
    } catch (err: any) {
      setResult(`❌ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testAuth = async () => {
    setLoading(true);
    setResult('Testing auth...');
    
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        setResult(`❌ Auth error: ${error.message}`);
      } else if (data.session) {
        setResult(`✅ Active session found for: ${data.session.user.email}`);
      } else {
        setResult(`ℹ️ No active session`);
      }
    } catch (err: any) {
      setResult(`❌ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const listUsers = async () => {
    setLoading(true);
    setResult('Fetching users...');
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, email, full_name, role');
      
      if (error) {
        setResult(`❌ Error: ${error.message}`);
      } else if (data && data.length > 0) {
        setResult(`✅ Found ${data.length} users:\n${JSON.stringify(data, null, 2)}`);
      } else {
        setResult(`⚠️ No users found in database. You need to create a user first!`);
      }
    } catch (err: any) {
      setResult(`❌ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Supabase Connection Test</h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4">
          <div className="flex gap-4">
            <button
              onClick={testConnection}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              Test Connection
            </button>
            
            <button
              onClick={testAuth}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              Test Auth
            </button>
            
            <button
              onClick={listUsers}
              disabled={loading}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
            >
              List Users
            </button>
          </div>
          
          {result && (
            <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded">
              <pre className="whitespace-pre-wrap text-sm">{result}</pre>
            </div>
          )}
          
          <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded">
            <h3 className="font-bold mb-2">📝 Instructions:</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Click "Test Connection" to verify Supabase is accessible</li>
              <li>Click "List Users" to see if you have any users in the database</li>
              <li>If no users found, create one in Supabase Dashboard:
                <ul className="list-disc list-inside ml-6 mt-2">
                  <li>Go to Authentication → Users → Add user</li>
                  <li>Then go to Table Editor → users → Insert row</li>
                  <li>Make sure the user ID matches the auth user ID</li>
                </ul>
              </li>
              <li>Click "Test Auth" to check current session</li>
            </ol>
          </div>
          
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded">
            <h3 className="font-bold mb-2">🔧 Environment Check:</h3>
            <div className="text-sm space-y-1">
              <p>Supabase URL: {import.meta.env.VITE_SUPABASE_URL ? '✅ Set' : '❌ Missing'}</p>
              <p>Supabase Key: {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupabaseTest;
