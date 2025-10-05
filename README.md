# 👁️ StellarEye - NASA Space Apps Challenge 2025

## 🎯 **"Embiggen Your Eyes" Challenge Solution**

StellarEye helps people see beyond what their eyes can naturally perceive by creating an interactive space exploration experience using real satellite and telescope data from NASA and ESA missions.

### **Challenge Goal:**
> *Help people see beyond what their eyes can naturally perceive by creating an interactive experience using satellite data*

### **Our Solution:**
- **Multi-Wavelength Vision**: View space in optical, infrared, and microwave wavelengths
- **Interactive Space Map**: Google Maps-style interface for exploring the cosmos  
- **Real NASA Images**: High-resolution images from Hubble, JWST, Cassini, and other missions
- **Educational Experience**: Learn about different celestial objects and how satellites observe them  

## 🌌 **What You Can See**

### **Different Ways Satellites See Space**
- **🔭 Optical Survey**: Stars and galaxies as human eyes would see them (ESO All-Sky)
- **⭐ Gaia Star Map**: Precise positions of over 1 billion stars (ESA Gaia)
- **🌡️ Infrared View**: Warm dust and hidden star formation (NASA WISE)
- **🔴 Near-Infrared**: See through cosmic dust clouds (2MASS Survey)
- **🌌 Microwave**: The cosmic microwave background - universe's baby picture (Planck)

### **Real NASA Mission Images**
- **Hubble Space Telescope**: Deep space galaxies and nebulae
- **James Webb Space Telescope**: Infrared views of the early universe
- **Cassini Mission**: Saturn's rings and moons
- **Mars Rovers**: High-resolution Mars surface images
- **Apollo Missions**: Historic lunar photography

## 🚀 **How to Run**

### **Requirements**
- Node.js 18+ and npm
- Python 3.11+
- uv (Python package manager)

### **Start the App**
```bash
# Quick start
./dev_stellareye.sh

# Or manually:
# Backend: cd backend && uv run uvicorn app.main:app --reload --port 8000
# Frontend: cd frontend && npm run dev
```

**Open:** http://localhost:3000

## ✨ **Features**

### **🗺️ Interactive Space Map**
- Google Maps-style interface for exploring space
- Switch between different satellite survey backgrounds
- Click on stars ⭐, galaxies 🌌, planets 🪐, and nebulae ☁️
- Search for objects by name or type
- Real astronomical coordinates

### **🖼️ Image Gallery**
- High-resolution NASA mission images
- Advanced image viewer with zoom and pan
- Multiple telescope views of the same objects
- Image details: telescope, wavelength, observation date

### **🛰️ Satellite Perspectives**
- See space in wavelengths invisible to human eyes
- Compare optical, infrared, and microwave views
- Learn how different satellites observe the universe

## 🛠️ **Built With**

- **Frontend**: React + TypeScript, Tailwind CSS, Leaflet Maps
- **Backend**: FastAPI (Python), NASA Image Proxy
- **Data**: NASA Images API, ESA Archives, Real astronomical catalogs

## 🎓 **Educational Value**

Learn about:
- How different wavelengths reveal different cosmic phenomena
- Real NASA and ESA space missions and their discoveries  
- The scale of the universe from planets to distant galaxies
- How satellites and telescopes observe space

## 📄 **Data Attribution**

- **NASA**: Images and data from NASA missions
- **ESA**: Gaia and Planck data from European Space Agency
- **ESO**: All-sky survey from European Southern Observatory
- **2MASS**: Near-infrared survey from NASA/IPAC

---

**Built for NASA Space Apps Challenge 2025 - "Embiggen Your Eyes" Challenge** 🌌