#!/bin/bash

# StellarEye Production Build Script
echo "🏭 Building StellarEye for Production"
echo "NASA Space Apps Challenge 2025"
echo "=================================="

# Check if we're in the right directory
if [ ! -d "frontend" ] || [ ! -d "backend" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "🔧 Checking dependencies..."

# Check dependencies
if ! command -v uv &> /dev/null; then
    echo "❌ Error: 'uv' is not installed"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ Error: 'npm' is not installed"
    exit 1
fi

echo "✅ Dependencies check passed"
echo ""

# Build backend
echo "🐍 Building Python backend..."
cd backend

echo "📦 Installing Python dependencies..."
uv sync --frozen
if [ $? -ne 0 ]; then
    echo "❌ Failed to install Python dependencies"
    exit 1
fi

echo "✅ Backend build complete"
cd ..

# Build frontend
echo "⚛️  Building React frontend..."
cd frontend

echo "📦 Installing Node.js dependencies..."
npm ci
if [ $? -ne 0 ]; then
    echo "❌ Failed to install Node.js dependencies"
    exit 1
fi

echo "🔨 Building frontend for production..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Failed to build frontend"
    exit 1
fi

echo "✅ Frontend build complete"
cd ..

echo ""
echo "🎉 Production build completed successfully!"
echo ""
echo "📁 Build artifacts:"
echo "   Backend: backend/ (ready for deployment)"
echo "   Frontend: frontend/dist/ (static files)"
echo ""
echo "🚀 To run in production:"
echo "   Backend:  cd backend && uv run uvicorn app.main:app --host 0.0.0.0 --port 8000"
echo "   Frontend: Serve frontend/dist/ with any static file server"