# Supabase Connection Test

## Issue
The `authApi.signIn()` call is hanging indefinitely, which means Supabase is not responding.

## Quick Test

Open your browser console and run:
```javascript
fetch('https://wjxydyvanqojuermbblq.supabase.co/rest/v1/', {
  headers: {
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndqeHlkeXZhbnFvanVlcm1iYmxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4ODkyMzcsImV4cCI6MjA3ODQ2NTIzN30.YnlYvvwBX_Rr0ywV5N42z2RquVT3g1gYwR320eEOQbY'
  }
}).then(r => console.log('Supabase responding:', r.status))
  .catch(e => console.error('Supabase error:', e));
```

## Possible Causes

1. **Supabase Project Paused**
   - Free tier projects pause after inactivity
   - Solution: Go to https://supabase.com/dashboard and unpause the project

2. **Network/Firewall Issue**
   - Corporate firewall blocking Supabase
   - VPN interfering with connection
   - Solution: Try different network or disable VPN

3. **Supabase Service Down**
   - Check https://status.supabase.com/
   - Solution: Wait for service to recover

4. **Invalid Credentials**
   - API key expired or project deleted
   - Solution: Regenerate keys from Supabase dashboard

5. **CORS Issue**
   - Supabase not configured for your domain
   - Solution: Add your domain to allowed origins in Supabase dashboard

## Immediate Fix

I've added a 10-second timeout to the auth call. If Supabase doesn't respond within 10 seconds, you'll see an error message instead of infinite loading.

## Alternative: Use Local Mock Auth

If Supabase continues to have issues, we can temporarily use a mock authentication system for development.
