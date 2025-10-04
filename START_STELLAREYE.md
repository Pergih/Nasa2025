# 👁️ **StellarEye - Quick Start**

**NASA Space Apps Challenge 2025 - "Embiggen Your Eyes"**

## 🚀 **Start StellarEye in 2 Steps**

### **Step 1: Start Backend**
```bash
cd backend
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### **Step 2: Start Frontend** 
```bash
cd frontend
npm run dev
```

## 🌐 **Access StellarEye**

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000  
- **API Docs**: http://localhost:8000/docs

## ✅ **What's Fixed**

- ✅ **Project Name**: Updated to StellarEye throughout
- ✅ **Frontend Issues**: Fixed white screen (removed problematic imports)
- ✅ **Icons**: Updated to use Eye icon (👁️) for StellarEye branding
- ✅ **Simple Test App**: Created working React component
- ✅ **Dependencies**: Cleaned up package.json

## 🧪 **Test Your Setup**

```bash
# Test everything
python3 test_stellareye.py

# Test backend only
curl http://localhost:8000/health
```

## 🎯 **What You'll See**

### **Frontend (http://localhost:3000)**
- StellarEye branding with eye icon
- Dark space theme
- "Embiggen Your Eyes" messaging
- Status indicators

### **Backend (http://localhost:8000/docs)**
- StellarEye API documentation
- Search endpoints for celestial objects
- NASA data integration ready

## 🔧 **If Frontend Still Shows White Screen**

1. **Check browser console** (F12) for errors
2. **Clear browser cache** (Ctrl+Shift+R)
3. **Restart frontend server**:
   ```bash
   cd frontend
   npm run dev
   ```

## 🌟 **Next Development Steps**

1. **Replace test app** with full StellarEye interface
2. **Add interactive map** with Leaflet
3. **Integrate NASA APIs** from legacy code
4. **Add satellite tracking** and image galleries

Your **StellarEye** project is now ready to embiggen eyes and impress NASA judges! 👁️🌌