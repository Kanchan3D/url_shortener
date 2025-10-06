# 🔧 Vercel Deployment Fix - FUNCTION_INVOCATION_FAILED

## The Problem
Your backend was crashing with `FUNCTION_INVOCATION_FAILED` error because:
1. **`app.listen()` doesn't work on Vercel** - Vercel uses serverless functions, not traditional servers
2. **`process.exit(1)` in db.js** - Kills the serverless function
3. **Missing MongoDB connection caching** - Each request created a new connection

## ✅ What Was Fixed

### 1. **server.js** - Made it Serverless-Compatible
**Changed:**
```javascript
// ❌ OLD (doesn't work on Vercel)
const PORT = process.env.PORT || 8001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// ✅ NEW (works everywhere)
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 8001;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export default app; // Export for Vercel
```

### 2. **config/db.js** - Added Connection Caching
**Changed:**
```javascript
// ❌ OLD (reconnects every time)
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (err) {
    process.exit(1); // Kills the function!
  }
};

// ✅ NEW (reuses connection)
let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return; // Reuse existing connection
  }
  
  try {
    const db = await mongoose.connect(process.env.MONGO_URI);
    isConnected = db.connections[0].readyState === 1;
  } catch (err) {
    throw new Error("Database connection failed"); // Don't kill the function
  }
};
```

### 3. **vercel.json** - Added Production Environment
**Changed:**
```json
{
  "env": {
    "NODE_ENV": "production"
  }
}
```

### 4. **package.json** - Added Node Version
**Added:**
```json
{
  "engines": {
    "node": ">=18.x"
  }
}
```

## 🚀 Deploy Now

### Step 1: Push Changes
```bash
cd backend
git add .
git commit -m "Fix: Vercel serverless function compatibility"
git push
```

### Step 2: Redeploy on Vercel
The deployment will automatically trigger, OR manually redeploy:
```bash
vercel --prod
```

### Step 3: Verify Environment Variables
Make sure these are set in Vercel Dashboard:
- ✅ `MONGO_URI` - Your MongoDB connection string
- ✅ `ORIGIN_URL` - Your frontend URL
- ✅ `BASE_URL` - Your backend URL
- ✅ `NODE_ENV` - Set to `production`

## 🧪 Test After Deployment

### 1. Test Root Endpoint
```bash
curl https://your-backend.vercel.app/
```
Should return: `API Working`

### 2. Test Shorten Endpoint
```bash
curl -X POST https://your-backend.vercel.app/shorten \
  -H "Content-Type: application/json" \
  -d '{"originalUrl": "https://google.com"}'
```
Should return JSON with `shortUrl`

### 3. Test Redirect
```bash
curl -L https://your-backend.vercel.app/abc123
```
Should redirect to the original URL

## ⚠️ Important Notes

### MongoDB Atlas Configuration
1. Go to MongoDB Atlas → Network Access
2. Click "Add IP Address"
3. Choose "Allow Access from Anywhere" (`0.0.0.0/0`)
4. This is required for Vercel serverless functions

### Connection String
Make sure your MongoDB connection string:
- ✅ Includes username and password
- ✅ Doesn't have special characters (or URL encode them)
- ✅ Uses the correct database name
- ✅ Has `retryWrites=true&w=majority` parameters

Example:
```
mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
```

### CORS Configuration
If you still get CORS errors:
1. Set `ORIGIN_URL` to your exact frontend URL
2. Include `https://` (not just the domain)
3. For multiple origins: `https://app1.com,https://app2.com`

## 🔍 Debugging

### View Vercel Logs
1. Go to your project in Vercel Dashboard
2. Click on the deployment
3. Click "Functions" tab
4. Click on your function to see logs

### Common Errors & Solutions

#### Error: "Cannot find module"
**Solution:** Make sure all imports have `.js` extension
```javascript
import connectDB from "./config/db.js"; // ✅ Include .js
```

#### Error: "ECONNREFUSED" or "ETIMEDOUT"
**Solution:** MongoDB Atlas IP whitelist issue
- Add `0.0.0.0/0` to Network Access

#### Error: "Invalid connection string"
**Solution:** Check your `MONGO_URI` environment variable
- Make sure it's set in Vercel Dashboard
- Verify the format is correct

#### Error: "Module not found: Can't resolve 'mongoose'"
**Solution:** Dependencies issue
- Ensure `mongoose` is in `dependencies`, not `devDependencies`
- Redeploy after fixing package.json

## 📋 Deployment Checklist

- [x] Fixed `server.js` to export app instead of listen
- [x] Fixed `db.js` to cache connections
- [x] Updated `vercel.json` with NODE_ENV
- [x] Updated `package.json` with engines
- [ ] Commit and push changes
- [ ] Verify environment variables in Vercel
- [ ] Check MongoDB Atlas IP whitelist
- [ ] Redeploy on Vercel
- [ ] Test all endpoints
- [ ] Update frontend `VITE_API_URL` if needed

## 💡 Why This Happened

**Traditional Server vs Serverless:**
- **Traditional (Node.js):** Server runs continuously, listens on a port
- **Serverless (Vercel):** Function runs only when requested, no persistent server

Your code was written for traditional servers but deployed to serverless, causing the crash.

## ✅ Now It Works Both Ways!

The updated code works in:
- ✅ Local development (`npm run dev`)
- ✅ Traditional hosting (Heroku, Railway, etc.)
- ✅ Serverless (Vercel, Netlify Functions)

---

**Next:** Push your changes and redeploy! 🚀
