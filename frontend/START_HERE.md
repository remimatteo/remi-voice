# IMPORTANT: How to Start the Server Correctly

The infinite reload issue was caused by:
1. Browser cache from a previous project
2. A bug in PhoneDemo.js that has now been fixed

## Steps to Start Fresh:

### Option 1: Use the Clean Start Script (RECOMMENDED)
```bash
.\clean-start.bat
```

### Option 2: Manual Steps
```bash
# 1. Clean the cache
rm -rf .next
rm -rf out

# 2. Start the dev server
npm run dev

# 3. Open browser in INCOGNITO/PRIVATE MODE
# Visit: http://localhost:3000
```

## CRITICAL: Use Incognito Mode!

**The first time you run this**, you MUST use incognito/private browsing mode to avoid browser cache issues from other projects.

### Chrome/Edge
- Press `Ctrl + Shift + N`
- Navigate to `http://localhost:3000`

### Firefox
- Press `Ctrl + Shift + P`
- Navigate to `http://localhost:3000`

## What Was Fixed

1. **PhoneDemo.js** - Moved `demoCaptions` array outside the component to prevent re-creation on every render
2. **useEffect cleanup** - Added proper cleanup for all setTimeout calls
3. **Cache cleaning** - Created script to remove .next folder before starting

## Expected Behavior

When working correctly:
- Page loads once
- No console errors about `/api/jobs`
- Phone demo animates captions smoothly
- All scroll buttons work
- No infinite refreshing

## Troubleshooting

If you still see issues:

1. **Close ALL browser tabs** with localhost:3000
2. **Stop the dev server** (Ctrl+C in terminal)
3. **Delete .next folder manually**
   ```
   Remove-Item -Recurse -Force .next
   ```
4. **Start fresh** with `npm run dev`
5. **Use incognito mode** to open localhost:3000

## Port Already in Use?

If you get "port 3000 is already in use":

```bash
# Find and kill the process
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F

# Then restart
npm run dev
```
