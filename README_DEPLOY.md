# Plot Twist - Interactive Math Visualization

An interactive web application for visualizing mathematical functions and vector operations using React, Vite, and the Google Generative AI API.

## Features

- 📊 **Function Visualization** - Explore sin, cos, tan, exp, log, sqrt, and more with interactive controls
- 🎯 **Vector Operations** - Add vectors and compute dot products with real-time visualization
- 🤖 **AI-Powered Explanations** - Get detailed mathematical explanations powered by Google's Gemini AI
- 🎨 **Interactive Controls** - Adjust amplitude, frequency, and phase for functions; modify vectors with sliders

## Tech Stack

- **Frontend**: React 19, Vite, Mafs (graphing), React-KaTeX (LaTeX rendering)
- **Backend**: Node.js, Express, Google Generative AI API
- **Styling**: Tailwind CSS
- **Deployment**: Render

## Local Development

### Prerequisites

- Node.js 16+
- npm or yarn
- Google Generative AI API key

### Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd plot-twist
```

2. Set up environment variables:
```bash
cp backend/.env.example backend/.env
# Edit backend/.env and add your GEMINI_API_KEY
```

3. Install dependencies:
```bash
npm install
# or if using root package.json
npm run install-all
```

4. Start development servers:
```bash
npm run dev
```

This starts:
- Backend: http://localhost:5000
- Frontend: http://localhost:5173

## Deployment on Render

### Automatic Deployment with render.yaml

1. Push your code to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com)
3. Click "New" → "Blueprint"
4. Connect your GitHub repository
5. Render will automatically read `render.yaml` and deploy

### Manual Deployment

1. Create a new Web Service on Render
2. Set up with these settings:
   - **Build Command**: `cd plot-twist && npm install && npm run build && cd ../backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Environment Variables**:
     - `PORT`: 5000
     - `GEMINI_API_KEY`: [Your API key]

3. Deploy and wait for the build to complete

## Environment Variables

### Backend (.env)
```
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5000 (optional, defaults to 5000)
```

### Frontend (via render.yaml)
- No additional env vars needed for basic deployment
- The frontend will use relative paths for API calls (same origin)

## Project Structure

```
plot-twist/
├── backend/
│   ├── server.js           # Express server, API endpoints
│   ├── package.json
│   └── .env
├── plot-twist/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── package.json            # Root package.json
├── Procfile               # Heroku/Render process file
├── render.yaml            # Render deployment config
└── README.md
```

## API Endpoints

### POST /api/function
Request:
```json
{
  "query": "sin(x)"
}
```

Response:
```json
{
  "type": "function",
  "operation": "sin",
  "params": { "x": 0 },
  "explanation": "Mathematical explanation with LaTeX...",
  "intuition": "Real-world intuition...",
  "title": "Sine Function"
}
```

### POST /api/vector
Request:
```json
{
  "query": "add vectors 2,3 and 1,4"
}
```

Response:
```json
{
  "type": "vector",
  "operation": "addition",
  "params": { "a": [2, 3], "b": [1, 4] },
  "explanation": "Vector addition explanation...",
  "intuition": "Intuitive explanation...",
  "title": "Vector Addition"
}
```

## Troubleshooting

### Build fails on Render
- Check that `GEMINI_API_KEY` is set in environment variables
- Ensure Node version is compatible (16+)
- Check build logs for specific errors

### Frontend can't reach API
- Ensure the backend is serving static files correctly
- Check that both are running on the same origin
- Verify API routes are not blocked by CORS

### Functions not rendering
- Ensure Mafs library is installed: `npm install mafs`
- Check browser console for errors
- Verify KaTeX CSS is properly loaded

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT
