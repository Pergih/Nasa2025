# 🚀 **Celestial Explorer - Setup Guide**

Follow these steps to get your modern NASA Space Apps Challenge project running!

## 📋 **Prerequisites**

- **Node.js 18+** (for frontend)
- **Python 3.11+** (for backend)
- **uv** (Python package manager) - Install from: https://docs.astral.sh/uv/getting-started/installation/

## 🛠️ **Installation Steps**

### **1. Backend Setup (Python + FastAPI)**

```bash
# Navigate to backend directory
cd backend

# Initialize uv project (if not already done)
uv sync

# Copy environment file
cp .env.example .env

# Edit .env file with your settings (optional for now)
# nano .env

# Run the backend server
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The backend will be available at: **http://localhost:8000**
API docs will be at: **http://localhost:8000/docs**

### **2. Frontend Setup (React + TypeScript)**

Open a new terminal:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will be available at: **http://localhost:3000**

## 🧪 **Testing the Setup**

### **Backend Health Check**
```bash
curl http://localhost:8000/health
# Should return: {"status":"healthy","service":"celestial-explorer-api"}
```

### **API Test**
```bash
curl "http://localhost:8000/api/v1/search/?q=sirius"
# Should return search results for Sirius
```

### **Frontend Test**
- Open http://localhost:3000 in your browser
- You should see the Celestial Explorer interface
- Try searching for "Sirius" or "Andromeda"

## 🔧 **Development Commands**

### **Backend Commands**
```bash
cd backend

# Run with auto-reload
uv run uvicorn app.main:app --reload

# Run tests (when we add them)
uv run pytest

# Format code
uv run black app/
uv run isort app/

# Type checking
uv run mypy app/
```

### **Frontend Commands**
```bash
cd frontend

# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🐛 **Troubleshooting**

### **Backend Issues**

**Port already in use:**
```bash
# Kill process on port 8000
lsof -ti:8000 | xargs kill -9

# Or use different port
uv run uvicorn app.main:app --reload --port 8001
```

**Missing dependencies:**
```bash
cd backend
uv sync --reinstall
```

**Python version issues:**
```bash
# Check Python version
python --version
# Should be 3.11+

# If using older Python, install 3.11+
# On Ubuntu: sudo apt install python3.11
# On macOS: brew install python@3.11
```

### **Frontend Issues**

**Node version issues:**
```bash
# Check Node version
node --version
# Should be 18+

# Update Node if needed
# Using nvm: nvm install 18 && nvm use 18
```

**Dependency conflicts:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

**Port conflicts:**
```bash
# Frontend will auto-select next available port
# Or specify port: npm run dev -- --port 3001
```

## 🌐 **Environment Variables**

### **Backend (.env)**
```env
# Required
ENVIRONMENT=development
DEBUG=true
API_V1_STR=/api/v1

# Optional (for production)
NASA_API_KEY=your_nasa_api_key_here
DATABASE_URL=postgresql://...
REDIS_URL=redis://localhost:6379
```

### **Frontend (.env.local)**
```env
# API URL (optional, defaults to localhost:8000)
VITE_API_URL=http://localhost:8000

# MapBox token (for enhanced maps)
VITE_MAPBOX_TOKEN=your_mapbox_token_here
```

## 🚀 **Next Steps**

Once both servers are running:

1. **Test the API**: Visit http://localhost:8000/docs
2. **Explore the Frontend**: Visit http://localhost:3000
3. **Search for Objects**: Try searching for "Sirius", "Andromeda", "Hubble"
4. **Check Logs**: Both servers show detailed logs for debugging

## 📚 **Useful URLs**

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **API Health**: http://localhost:8000/health

## 🆘 **Need Help?**

If you encounter issues:

1. Check the terminal logs for error messages
2. Ensure both servers are running on different ports
3. Verify all dependencies are installed
4. Check that your Python and Node versions meet requirements

The setup should take about 5-10 minutes total. Once running, you'll have a professional NASA Space Apps Challenge application! 🌌