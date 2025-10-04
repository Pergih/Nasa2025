# 🚀 **Quick Start Guide - StellarEye**

Your modern NASA Space Apps Challenge project is ready! Follow these simple steps:

## ✅ **Setup Status**
- ✅ Project Structure: EXCELLENT
- ✅ Frontend Setup: READY  
- ✅ Backend Dependencies: READY
- ✅ Build Scripts: AUTOMATED
- 🚧 Servers: Ready to start

## 🛠️ **Start the Application**

### **🌟 One-Command Start (Recommended)**
```bash
# Build and run everything automatically
./dev_stellareye.sh
```

### **📋 Alternative Methods**

#### **Using npm scripts:**
```bash
npm run dev        # Build and run everything
npm run build      # Just install dependencies  
npm run start      # Just run (after building)
npm run test       # Test the setup
```

#### **Manual (two terminals):**
```bash
# Terminal 1 - Backend
./backend.sh
# or: cd backend && uv run uvicorn app.main:app --reload --port 8000

# Terminal 2 - Frontend  
./frontend.sh
# or: cd frontend && npm run dev
```

## 🌐 **Access Your Application**

- **🎯 Frontend**: http://localhost:5173
- **🔧 Backend API**: http://localhost:8000
- **📚 API Docs**: http://localhost:8000/docs
- **💚 Health Check**: http://localhost:8000/health

## 🧪 **Test Everything Works**

```bash
# Test the setup
python3 test_setup.py

# Test API directly
curl "http://localhost:8000/api/v1/search/?q=sirius"
```

## 📁 **What You Have**

### **Modern Architecture**
```
celestial-explorer/
├── frontend/          # React + TypeScript
├── backend/           # FastAPI + Python  
├── legacy/            # Original Dash version
└── docs/              # Documentation
```

### **Key Features Ready**
- ✅ **FastAPI Backend** with NASA data integration
- ✅ **React Frontend** with TypeScript and Tailwind
- ✅ **Search API** for celestial objects
- ✅ **Modular Architecture** for easy scaling
- ✅ **Real NASA APIs** integration ready

## 🎯 **Next Development Steps**

1. **Add Leaflet Map Component** (replace the placeholder)
2. **Integrate Real NASA APIs** (move from legacy/)
3. **Add Image Gallery** with multi-wavelength views
4. **Implement Real-time Satellite Tracking**
5. **Add 3D Visualization** with Three.js

## 🆘 **Troubleshooting**

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

### **Port Conflicts**
```bash
# Use different ports
uv run uvicorn app.main:app --reload --port 8001
npm run dev -- --port 3001
```

## 🌟 **What's Different from Legacy**

| Feature | Legacy (Dash) | Modern (React) |
|---------|---------------|----------------|
| **Performance** | Limited | Excellent |
| **Mobile** | Poor | Responsive |
| **Scalability** | Difficult | Easy |
| **UI/UX** | Basic | Professional |
| **Real-time** | Limited | WebSocket ready |