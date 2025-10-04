#!/bin/bash

# StellarEye Build Script
echo "🔨 Building StellarEye - NASA Space Apps Challenge 2025"
echo "=================================================="

# Check if we're in the right directory
if [ ! -d "frontend" ] || [ ! -d "backend" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    echo "   Make sure you can see both 'frontend' and 'backend' folders"
    exit 1
fi

echo "🔧 Checking dependencies..."

# Check if uv is available
if ! command -v uv &> /dev/null; then
    echo "❌ Error: 'uv' is not installed"
    echo "   Install from: https://docs.astral.sh/uv/getting-started/installation/"
    exit 1
fi

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "❌ Error: 'npm' is not installed"
    echo "   Install Node.js from: https://nodejs.org/"
    exit 1
fi

echo "✅ Dependencies check passed"
echo ""

# Build backend
echo "🐍 Setting up Python backend..."
cd backend

# Install Python dependencies
echo "📦 Installing Python dependencies..."
uv sync
if [ $? -ne 0 ]; then
    echo "❌ Failed to install Python dependencies"
    exit 1
fi

echo "✅ Backend setup complete"
cd ..

# Build frontend
echo "⚛️  Setting up React frontend..."
cd frontend

# Install Node.js dependencies
echo "📦 Installing Node.js dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install Node.js dependencies"
    exit 1
fi

echo "✅ Frontend setup complete"
cd ..

echo ""
echo "🎉 StellarEye build completed successfully!"
echo ""
echo "🚀 To start the application, run:"
echo "   ./run_stellareye.sh"
echo ""
echo "Or start services manually:"
echo "Backend:  cd backend && uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"
echo "Frontend: cd frontend && npm run dev"