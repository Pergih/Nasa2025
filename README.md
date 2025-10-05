# 👁️ StellarEye - NASA Space Apps Challenge 2025

## 🎯 **"Embiggen Your Eyes" Challenge Solution**

**Interactive Space Exploration Through Satellite Perspectives**

StellarEye transforms how we explore the universe by providing **satellite eyes** to see beyond human vision. Using real NASA/ESA mission data, users can experience the cosmos through multiple wavelengths and perspectives impossible with natural eyesight.

---

## 🚀 **NASA Space Apps Challenge 2025 Alignment**

### **Challenge: "Embiggen Your Eyes"**
> *Help people see beyond what their eyes can naturally perceive by creating an interactive experience using satellite data*

### **Our Solution:**
✅ **Multi-Wavelength Vision**: View the sky in optical, infrared, radio, and cosmic microwave background  
✅ **Satellite Perspectives**: All data from space-based telescopes and missions  
✅ **Interactive Exploration**: Google Maps-style interface for intuitive space navigation  
✅ **Real NASA Data**: Authentic mission data from Hubble, JWST, Gaia, WISE, Planck  
✅ **Educational Impact**: Learn about different types of celestial objects and observation methods  

---

## 🌌 **Real Astronomical Survey Data**

### **Background Sky Surveys (Satellite Perspectives)**

| Survey | Mission | Wavelength | What It Reveals |
|--------|---------|------------|-----------------|
| **🔭 ESO All-Sky Optical** | European Southern Observatory | Visible Light | Stars and galaxies as human eyes would see them |
| **⭐ ESA Gaia Star Catalog** | Gaia Space Telescope | Optical + Astrometry | Precise 3D positions of 1+ billion stars |
| **🌡️ NASA WISE All-Sky** | Wide-field Infrared Survey Explorer | Mid-Infrared | Warm dust, star formation, hidden stellar populations |
| **🔴 2MASS Near-Infrared** | Two Micron All Sky Survey | Near-Infrared | Stellar populations behind dust clouds |
| **🌌 ESA Planck CMB** | Planck Space Telescope | Microwave | Cosmic microwave background - the universe's baby picture |

### **Object Image Gallery**
- **🔭 Hubble Space Telescope**: Ultra-deep field images, planetary nebulae, galaxies
- **🌌 James Webb Space Telescope**: Infrared deep fields, exoplanet atmospheres, early universe
- **🔬 Chandra X-ray Observatory**: High-energy phenomena, black holes, hot gas
- **🪐 Cassini Saturn Mission**: Detailed views of Saturn's rings and moons
- **🔴 Mars Reconnaissance Orbiter**: Ultra-high resolution Mars surface imagery
- **🌙 Lunar Reconnaissance Orbiter**: Detailed lunar surface mapping

---

## 🚀 **Quick Start**

### **Prerequisites**
- **Node.js 18+** and npm
- **Python 3.11+** 
- **uv** (Python package manager) - [Install Guide](https://docs.astral.sh/uv/getting-started/installation/)

### **Launch StellarEye**
```bash
# One-command startup
./dev_stellareye.sh

# Manual startup:
# Backend: cd backend && uv run uvicorn app.main:app --reload --port 8000
# Frontend: cd frontend && npm run dev
```

### **Access Points**
- **🌌 StellarEye App:** http://localhost:3000
- **🔧 Backend API:** http://localhost:8000
- **📚 API Documentation:** http://localhost:8000/docs

---

## ✨ **Features & Capabilities**

### **🗺️ Interactive Space Map**
- **Google Maps-style Interface**: Intuitive pan, zoom, and click interactions
- **Real Astronomical Backgrounds**: Switch between different space telescope surveys
- **Celestial Object Markers**: Stars ⭐, galaxies 🌌, planets 🪐, exoplanets 🌍, nebulae ☁️
- **Smart Zoom Scaling**: Objects scale appropriately based on stellar magnitude and zoom level
- **Coordinate System**: Proper RA/Dec astronomical coordinates

### **🔍 Advanced Search & Discovery**
- **Real-time Search**: Find objects by name, type, or constellation
- **Type Filtering**: Filter by stars, planets, exoplanets, galaxies, nebulae
- **Object Details**: Magnitude, distance, constellation, coordinates
- **Interactive Popups**: Rich information cards with astronomical data

### **🖼️ NASA Image Gallery**
- **Multi-Telescope Views**: Same object seen through different space telescopes
- **High-Resolution Images**: Direct from NASA/ESA archives
- **Progressive Loading**: Optimized image delivery with multiple resolutions
- **Metadata Rich**: Telescope, wavelength, observation date, technical details

### **🛰️ Satellite Perspective Features**
- **Multi-Wavelength Vision**: See invisible infrared, radio, X-ray emissions
- **Time-Domain Astronomy**: Images from different epochs and missions
- **3D Spatial Understanding**: Proper astronomical coordinate mapping
- **Scale Awareness**: From nearby planets to distant galaxies

---

## 🛠️ **Technology Stack**

### **Frontend Architecture**
- **React 18** + **TypeScript**: Modern, type-safe UI development
- **Tailwind CSS**: Responsive, space-themed design system
- **Leaflet Maps**: Interactive mapping with astronomical coordinate support
- **Service Worker**: Advanced image caching for offline capability

### **Backend Infrastructure**
- **FastAPI**: High-performance Python API framework
- **NASA Image Proxy**: CORS-compliant image delivery system
- **Astronomical Calculations**: Coordinate transformations and object positioning
- **Error Handling**: Graceful fallbacks for network issues

### **Data Sources & APIs**
- **NASA Images API**: Official NASA image archive access
- **ESA Science Archives**: Gaia, Planck, and other ESA mission data
- **Astronomical Catalogs**: Real stellar positions and object metadata
- **Image Processing**: Multi-resolution delivery and optimization

---

## 🎓 **Educational Impact**

### **Learning Outcomes**
- **Electromagnetic Spectrum**: Understand how different wavelengths reveal different phenomena
- **Scale of Universe**: From nearby planets to cosmic microwave background
- **Space Missions**: Learn about real NASA/ESA telescopes and their discoveries
- **Astronomical Coordinates**: Understand how we map the sky
- **Object Classification**: Distinguish between stars, galaxies, nebulae, and exoplanets

### **Target Audiences**
- **Students**: Interactive learning about astronomy and space science
- **Educators**: Teaching tool for electromagnetic spectrum and space exploration
- **Space Enthusiasts**: Explore real mission data in an engaging interface
- **General Public**: Accessible introduction to modern astronomy

---

## 🌟 **NASA Space Apps Challenge Goals Achieved**

| Challenge Requirement | StellarEye Implementation |
|----------------------|---------------------------|
| **"Embiggen Your Eyes"** | Multi-wavelength views reveal invisible universe |
| **Satellite Perspectives** | All data from space-based telescopes and missions |
| **Interactive Experience** | Google Maps-style exploration interface |
| **Educational Value** | Learn about real space missions and discoveries |
| **Technical Innovation** | Advanced image caching, coordinate mapping, progressive loading |
| **Real NASA Data** | Direct integration with NASA/ESA archives and APIs |

---

## 🔬 **Technical Innovations**

### **Astronomical Coordinate Mapping**
- Proper RA/Dec to screen coordinate transformations
- Multiple coordinate system support for different surveys
- Zoom-responsive object scaling based on stellar magnitude

### **Advanced Image Delivery**
- CORS-compliant NASA image proxy
- Progressive resolution loading (thumbnail → full → ultra-high-res)
- Service worker caching for offline capability
- Graceful fallbacks for network issues

### **Multi-Survey Integration**
- Real-time switching between different astronomical surveys
- Proper attribution and metadata for all data sources
- Error handling with procedural fallbacks

---

## 🏆 **Awards & Recognition Potential**

This project demonstrates:
- **Technical Excellence**: Advanced web technologies with astronomical data
- **Educational Impact**: Making space science accessible and engaging  
- **Innovation**: Novel approach to space data visualization
- **NASA Mission Alignment**: Direct use of real space telescope data
- **User Experience**: Intuitive interface for complex astronomical concepts

---

## 🤝 **Contributing & Development**

### **Project Structure**
```
stellareye/
├── frontend/          # React + TypeScript UI
├── backend/           # FastAPI Python backend  
├── docs/             # Documentation
└── dev_stellareye.sh # Development startup script
```

### **Development Workflow**
1. **Fork & Clone**: Standard GitHub workflow
2. **Install Dependencies**: `npm install` (frontend) + `uv sync` (backend)
3. **Start Development**: `./dev_stellareye.sh`
4. **Test Changes**: Verify both map and gallery functionality
5. **Submit PR**: Include screenshots of new features

---

## 📄 **License & Attribution**

### **Data Sources**
- **NASA**: Images and data courtesy of NASA and its missions
- **ESA**: Gaia and Planck data courtesy of European Space Agency
- **ESO**: All-sky survey courtesy of European Southern Observatory
- **2MASS**: Near-infrared survey courtesy of NASA/IPAC

### **Code License**
MIT License - See LICENSE file for details

---

## 🌌 **Future Enhancements**

- **Real-time Data**: Live satellite positions and space weather
- **3D Visualization**: WebGL-based 3D space exploration
- **Mobile App**: Native iOS/Android applications
- **VR/AR Support**: Immersive space exploration experiences
- **Collaborative Features**: Share discoveries and create custom tours

---

**🚀 Built for NASA Space Apps Challenge 2025 - "Embiggen Your Eyes" 👁️**

*Transforming how humanity explores the cosmos through satellite perspectives and real space mission data.*

---

**Built for NASA Space Apps Challenge 2025** 🌌