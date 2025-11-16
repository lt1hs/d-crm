# FORCE BROWSER REFRESH

The browser is caching an old version of NotificationCenter.tsx that has a `formatTimestamp` function.

## Do this NOW:

1. **Hard Refresh the Browser:**
   - **Mac:** `Cmd + Shift + R` or `Cmd + Option + R`
   - **Windows/Linux:** `Ctrl + Shift + R` or `Ctrl + F5`

2. **Or Clear Cache Completely:**
   - Open DevTools (F12)
   - Right-click the refresh button
   - Select "Empty Cache and Hard Reload"

3. **Or Clear Application Storage:**
   - Open DevTools (F12)
   - Go to Application tab
   - Click "Clear site data"
   - Refresh the page

The file has been updated but your browser is still using the old cached version with the `formatTimestamp` function that doesn't exist anymore.

After refreshing, you should see the debug logs:
```
📋 Processing notification: { id: ..., title: ..., created_at: ..., type: ... }
```

If you still don't see these logs, the cache hasn't been cleared properly.
