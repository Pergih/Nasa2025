# 🛠️ StellarEye Build Scripts

Complete automation for the NASA Space Apps Challenge 2025 project.

## 🚀 **Quick Commands**

```bash
# 🌟 One-command development (recommended)
./dev_stellareye.sh

# 🎯 Interactive menu
./stellareye.sh

# 📋 Using npm
npm run dev
```

## 📋 **All Available Scripts**

### **🚀 Development Scripts**

| Script | Purpose | Usage |
|--------|---------|-------|
| `./dev_stellareye.sh` | **Build + Run everything** | One-command development |
| `./stellareye.sh` | **Interactive menu** | Choose what to do |
| `./build_stellareye.sh` | **Install dependencies** | Setup only |
| `./run_stellareye.sh` | **Run services** | After building |
| `./test_stellareye.sh` | **Test setup** | Verify everything works |

### **🏃 Individual Services**

| Script | Purpose | Port |
|--------|---------|------|
| `./backend.sh` | **Python FastAPI** | 8000 |
| `./frontend.sh` | **React + Vite** | 5173 |

### **🏭 Production Scripts**

| Script | Purpose | Output |
|--------|---------|--------|
| `./build_production.sh` | **Production build** | `frontend/dist/` |

### **📦 NPM Scripts**

```json
{
  "dev": "./dev_stellareye.sh",
  "build": "./build_stellareye.sh", 
  "start": "./run_stellareye.sh",
  "test": "./test_stellareye.sh",
  "build:prod": "./build_production.sh",
  "backend": "cd backend && uv run uvicorn app.main:app --reload --port 8000",
  "frontend": "cd frontend && npm run dev"
}
```

## 🌐 **Access Points**

When running, access your application at:

- **🎯 Frontend:** http://localhost:5173
- **🔧 Backend API:** http://localhost:8000
- **📚 API Documentation:** http://localhost:8000/docs
- **💚 Health Check:** http://localhost:8000/health

## ✅ **What Each Script Does**

### **`dev_stellareye.sh` - Complete Development Environment**
- ✅ Checks all dependencies (uv, npm, Node.js, Python)
- ✅ Installs/updates Python packages with uv
- ✅ Installs/updates Node.js packages with npm
- ✅ Starts backend with hot reload on port 8000
- ✅ Starts frontend with hot reload on port 5173
- ✅ Handles graceful shutdown with Ctrl+C
- ✅ Shows all access URLs and features

### **`build_stellareye.sh` - Dependency Installation**
- ✅ Checks dependencies
- ✅ Sets up Python virtual environment
- ✅ Installs Python packages
- ✅ Installs Node.js packages
- ✅ Prepares for development

### **`run_stellareye.sh` - Service Runner**
- ✅ Checks if ports are available
- ✅ Starts both services in background
- ✅ Monitors both processes
- ✅ Handles graceful shutdown

### **`test_stellareye.sh` - Setup Verification**
- ✅ Checks all dependencies and versions
- ✅ Verifies project structure
- ✅ Tests backend API endpoints
- ✅ Confirms everything is ready

### **`build_production.sh` - Production Build**
- ✅ Installs dependencies with frozen versions
- ✅ Builds optimized frontend bundle
- ✅ Prepares for deployment

## 🔧 **Dependencies**

### **Required**
- **uv** - Python package manager ([install](https://docs.astral.sh/uv/getting-started/installation/))
- **Node.js 18+** - JavaScript runtime
- **npm** - Node.js package manager

### **Automatically Handled**
- Python 3.11+ virtual environment
- All Python packages (FastAPI, Astropy, etc.)
- All Node.js packages (React, TypeScript, etc.)

## 🆘 **Troubleshooting**

### **Permission Denied**
```bash
chmod +x *.sh
```

### **Port Already in Use**
```bash
# Kill existing processes
pkill -f "uvicorn"
pkill -f "vite"

# Or use different ports
cd backend && uv run uvicorn app.main:app --port 8001
cd frontend && npm run dev -- --port 3000
```

### **Dependencies Not Found**
```bash
# Reinstall everything
./build_stellareye.sh
```

### **Backend Won't Start**
```bash
cd backend
uv sync --reinstall
uv run uvicorn app.main:app --reload
```

### **Frontend Won't Start**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

## 🎯 **Recommended Workflow**

1. **First time setup:**
   ```bash
   git clone <repo>
   cd stellareye
   ./dev_stellareye.sh
   ```

2. **Daily development:**
   ```bash
   ./dev_stellareye.sh
   # or just: npm run dev
   ```

3. **Testing changes:**
   ```bash
   ./test_stellareye.sh
   ```

4. **Production deployment:**
   ```bash
   ./build_production.sh
   ```

## 🌟 **Features**

- **🔥 Hot Reload** - Both frontend and backend update automatically
- **🛡️ Error Handling** - Graceful failure with helpful messages
- **🚀 Fast Setup** - One command gets you running
- **📱 Cross-Platform** - Works on Linux, macOS, Windows (WSL)
- **🎯 Port Management** - Automatic port conflict detection
- **💚 Health Checks** - Verify services are running correctly

---

**Built for NASA Space Apps Challenge 2025 - "Embiggen Your Eyes"** 🌌