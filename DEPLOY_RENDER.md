# 🚀 Deploy to Render - Step by Step

## Prerequisites
- GitHub account with your code pushed
- Render account (free at https://render.com)
- Gemini API key

## Step 1: Push Your Code
Your code is already pushed. Verify at: https://github.com/your-username/plot-twist

## Step 2: Go to Render Dashboard
1. Go to https://dashboard.render.com
2. Sign up or log in

## Step 3: Create New Web Service
1. Click **"New"** button → **"Web Service"**
2. Select **"Deploy an existing repository"**
3. Search for your `plot-twist` repo and connect it

## Step 4: Configure Deployment
Set these values:
- **Name**: `plot-twist` (or any name you want)
- **Runtime**: Node.js
- **Build Command**: 
  ```
  npm install && cd plot-twist && npm install && npm run build && cd ../backend && npm install && cd ..
  ```
- **Start Command**: 
  ```
  cd backend && npm start
  ```

## Step 5: Set Environment Variables
Click **"Advanced"** and add:
- Key: `GEMINI_API_KEY`
- Value: `AIzaSyDO8XL2TyFlPPntrgYrEcMTrVbF8X0LCWE` (your API key)

Other vars:
- `NODE_ENV`: `production`
- `PORT`: `5000` (optional)

## Step 6: Deploy
1. Click **"Create Web Service"**
2. Wait for deployment (usually 2-5 minutes)
3. You'll see your URL like: `https://plot-twist-xxxx.onrender.com`

## What Happens During Deployment

### Build Phase:
- Installs frontend dependencies
- Builds React app to `/plot-twist/dist`
- Installs backend dependencies

### Run Phase:
- Starts Node.js server on port 5000
- Backend serves:
  - `/api/function` - Function visualization API
  - `/api/vector` - Vector operations API
  - `/` and all other routes - Frontend (React app)

## Testing Your Deployment

Once deployed, visit: `https://plot-twist-xxxx.onrender.com`

You should see:
- ✅ Chat panel on the left
- ✅ Visualization panel on the right
- ✅ Greeting message

Try asking:
- "Show me sin(x)"
- "Add vectors 2,3 and 1,4"

## Troubleshooting

### Build fails
- Check build logs in Render dashboard
- Ensure `npm run build` completes successfully locally
- Verify all dependencies are in package.json

### API returns 500 error
- Check that GEMINI_API_KEY is set in environment
- View server logs in Render dashboard
- API key might be invalid or rate-limited

### Frontend shows blank page
- Check browser console for errors (F12)
- Verify backend is running (`/health` or `/api/function`)
- Check Render logs for server errors

### Frontend can't reach API
- Both are served from same origin - should work
- Check CORS settings (should be enabled)
- Verify no route conflicts

## Key Files

- **backend/server.js** - Serves frontend + API routes
- **plot-twist/dist/** - Built React app (created during build)
- **render.yaml** - (Optional) Automatic config
- **.env** - Contains GEMINI_API_KEY (not committed to git)

## After Deployment

### Enable Auto-Deploy
In Render dashboard:
1. Go to your service settings
2. Enable "Auto-Deploy" from main branch
3. Every git push auto-deploys

### Monitor Performance
- View logs in real-time
- Check resource usage
- Monitor API response times

### Scale Up (if needed)
- Render free plan has limitations
- Upgrade to Hobby tier for production

Enjoy your deployed app! 🎉
