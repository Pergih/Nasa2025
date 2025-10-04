# 👁️ StellarEye - NASA Space Apps Challenge 2025

**"Embiggen Your Eyes" - Explore the Universe Through Satellite Perspectives**

A modern web application that provides Google Maps-like exploration of space using real NASA data and satellite imagery. Built for the NASA Space Apps Challenge 2025.

![Architecture](https://img.shields.io/badge/Architecture-Modern%20Web%20Stack-blue)
![NASA APIs](https://img.shields.io/badge/Data-Real%20NASA%20APIs-orange)
![Status](https://img.shields.io/badge/Status-Active%20Development-green)

## � **Modeern Architecture**

### **Frontend Stack**
- **React 18** - Modern UI framework with hooks and concurrent features
- **TypeScript** - Type safety for better development experience
- **Leaflet + React-Leaflet** - Professional mapping library (same as OpenStreetMap)
- **MapBox GL JS** - High-performance vector maps and satellite imagery
- **Three.js** - 3D visualization for future space views
- **Tailwind CSS** - Utility-first styling for rapid development
- **Vite** - Lightning-fast build tool and dev server

### **Backend Stack**
- **FastAPI** - High-performance Python API framework
- **Pydantic** - Data validation and serialization
- **Astropy** - Professional astronomical calculations
- **Redis** - Caching for NASA API responses and images
- **PostgreSQL + PostGIS** - Spatial database for celestial coordinates
- **Celery** - Background tasks for data processing

### **Infrastructure**
- **Docker** - Containerized deployment
- **Nginx** - Reverse proxy and static file serving
- **WebSocket** - Real-time satellite position updates
- **CDN** - Fast image delivery for astronomical photos

## 🌟 **Key Features**

### **🗺️ Google Maps-Like Experience**
- **Smooth Panning & Zooming** - Buttery smooth interactions
- **Layer Controls** - Toggle satellites, galaxies, exoplanets
- **Search & Navigation** - Find any celestial object instantly
- **Mobile-First Design** - Works perfectly on all devices

### **🛰️ Real NASA Data Integration**
- **NASA SkyView** - Multi-wavelength astronomical images
- **JPL Horizons** - Real-time spacecraft positions
- **Exoplanet Archive** - Confirmed planets with habitability data
- **Gaia Catalog** - High-precision stellar positions
- **Live Updates** - Real-time satellite tracking

### **📸 Multi-Wavelength Imaging**
- **Background Space Tiles** - Seamless space imagery like satellite maps
- **Image Gallery** - Multiple perspectives of the same object
- **Metadata Rich** - Telescope, wavelength, observation date
- **High Resolution** - Hubble and JWST images when available

### **🎯 Educational Value**
- **Satellite Perspectives** - See space through different telescopes
- **Interactive Learning** - Click to explore and learn
- **Scientific Accuracy** - Real coordinates and measurements
- **Professional Quality** - Publication-ready visualizations

## 📁 **Project Structure**

```
stellareye/
├── frontend/                 # React TypeScript frontend
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/           # Main application pages
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API communication
│   │   ├── types/           # TypeScript definitions
│   │   └── utils/           # Helper functions
│   ├── public/              # Static assets
│   └── package.json         # Frontend dependencies
├── backend/                 # FastAPI Python backend
│   ├── app/
│   │   ├── api/            # API endpoints
│   │   ├── core/           # Configuration and security
│   │   ├── models/         # Database models
│   │   ├── services/       # Business logic
│   │   └── nasa/           # NASA API integrations
│   ├── requirements.txt    # Python dependencies
│   └── Dockerfile         # Backend container
├── docker-compose.yml     # Development environment
├── legacy/                # Original Python/Dash implementation
└── docs/                  # Documentation and deployment guides
```

## 🛠️ **Quick Start**

### **Prerequisites**
- **Node.js 18+** and npm
- **Python 3.11+** 
- **uv** (Python package manager) - [Install here](https://docs.astral.sh/uv/getting-started/installation/)

### **🚀 One-Command Development Setup**

```bash
# Clone the repository
git clone <your-repo>
cd stellareye

# Build and run everything (recommended)
./dev_stellareye.sh

# Or use the interactive menu
./stellareye.sh

# Or use npm
npm run dev
```

**That's it!** The script will:
- ✅ Check all dependencies (uv, npm, Node.js, Python)
- 📦 Install Python and Node.js packages automatically
- 🚀 Start both backend and frontend with hot reload
- 🌐 Open the app at http://localhost:5173
- 🔥 Enable hot reload for instant development

### **📋 Alternative Commands**

```bash
# Just build (install dependencies)
./build_stellareye.sh

# Just run (after building)
./run_stellareye.sh

# Production build
./build_production.sh

# Manual setup (if you prefer):
# Backend
cd backend && uv run uvicorn app.main:app --reload --port 8000

# Frontend  
cd frontend && npm run dev
```

### **🌐 Access Points**
- **🎯 Frontend:** http://localhost:5173
- **🔧 Backend API:** http://localhost:8000  
- **📚 API Documentation:** http://localhost:8000/docs
- **💚 Health Check:** http://localhost:8000/health

## 🎯 **NASA Space Apps Challenge**

This project addresses the **"Embiggen Your Eyes"** challenge by:

1. **✅ Satellite Perspectives** - View space through multiple NASA telescopes
2. **✅ Interactive Exploration** - Google Maps-like navigation through space
3. **✅ Real NASA Data** - Live integration with official NASA databases
4. **✅ Multi-wavelength Views** - See objects across the electromagnetic spectrum
5. **✅ Educational Impact** - Make space exploration accessible to everyone

## 🔧 **Technology Highlights**

### **Performance Optimizations**
- **Virtual Scrolling** - Handle millions of celestial objects
- **Image Caching** - Smart caching of NASA imagery
- **WebGL Rendering** - Hardware-accelerated graphics
- **Progressive Loading** - Load data as you explore

### **Real-time Features**
- **Live Satellite Tracking** - See spacecraft move in real-time
- **WebSocket Updates** - Instant data synchronization
- **Background Processing** - Non-blocking NASA API calls

### **Accessibility**
- **Screen Reader Support** - Full accessibility compliance
- **Keyboard Navigation** - Navigate without a mouse
- **High Contrast Mode** - Better visibility options
- **Mobile Optimized** - Touch-friendly interface

## 🌍 **Deployment**

### **Production Deployment**
```bash
# Build for production
docker-compose -f docker-compose.prod.yml up -d

# Or deploy to cloud platforms:
# - Vercel (Frontend)
# - Railway/Heroku (Backend)
# - AWS/GCP/Azure (Full stack)
```

### **Environment Variables**
```env
# Backend
NASA_API_KEY=your_nasa_api_key
DATABASE_URL=postgresql://...
REDIS_URL=redis://...

# Frontend
VITE_API_URL=http://localhost:8000
VITE_MAPBOX_TOKEN=your_mapbox_token
```

## 🤝 **Contributing**

We welcome contributions! Please see our [Contributing Guide](docs/CONTRIBUTING.md) for details.

## 📄 **License**

MIT License - see [LICENSE](LICENSE) for details.

## 🙏 **Acknowledgments**

- **NASA** - For providing incredible APIs and data
- **ESA Gaia** - For high-precision stellar catalogs
- **Leaflet/MapBox** - For excellent mapping libraries
- **React Community** - For amazing ecosystem and tools

---

**Built with ❤️ for the NASA Space Apps Challenge 2025**

*"The universe is not only stranger than we imagine, it is stranger than we can imagine." - J.B.S. Haldane*