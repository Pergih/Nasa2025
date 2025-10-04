#!/bin/bash

# StellarEye Test Script
echo "🧪 Testing StellarEye Setup"
echo "=========================="

# Check if we're in the right directory
if [ ! -d "frontend" ] || [ ! -d "backend" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "🔧 Checking dependencies..."

# Check uv
if ! command -v uv &> /dev/null; then
    echo "❌ uv is not installed"
    echo "   Install from: https://docs.astral.sh/uv/getting-started/installation/"
    exit 1
else
    echo "✅ uv is installed: $(uv --version)"
fi

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed"
    echo "   Install Node.js from: https://nodejs.org/"
    exit 1
else
    echo "✅ npm is installed: $(npm --version)"
fi

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "⚠️  Node.js version is $NODE_VERSION, but 18+ is recommended"
else
    echo "✅ Node.js version is compatible: $(node --version)"
fi

# Check Python version
PYTHON_VERSION=$(python3 --version 2>/dev/null | cut -d' ' -f2 | cut -d'.' -f1,2)
if [ -z "$PYTHON_VERSION" ]; then
    echo "❌ Python 3 is not installed"
    exit 1
else
    echo "✅ Python version: $(python3 --version)"
fi

echo ""
echo "📦 Checking project structure..."

# Check backend files
if [ ! -f "backend/pyproject.toml" ]; then
    echo "❌ Backend pyproject.toml not found"
    exit 1
else
    echo "✅ Backend configuration found"
fi

# Check frontend files
if [ ! -f "frontend/package.json" ]; then
    echo "❌ Frontend package.json not found"
    exit 1
else
    echo "✅ Frontend configuration found"
fi

# Check if dependencies are installed
echo ""
echo "🔍 Checking installed dependencies..."

# Check backend dependencies
cd backend
if [ ! -d ".venv" ]; then
    echo "⚠️  Backend virtual environment not found"
    echo "   Run: ./build_stellareye.sh to install dependencies"
else
    echo "✅ Backend virtual environment exists"
fi
cd ..

# Check frontend dependencies
cd frontend
if [ ! -d "node_modules" ]; then
    echo "⚠️  Frontend node_modules not found"
    echo "   Run: ./build_stellareye.sh to install dependencies"
else
    echo "✅ Frontend dependencies installed"
fi
cd ..

echo ""
echo "🌐 Testing API endpoints..."

# Start backend temporarily for testing
cd backend
echo "🐍 Starting backend for testing..."
uv run uvicorn app.main:app --host 0.0.0.0 --port 8001 &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 5

# Test health endpoint
if curl -s http://localhost:8001/health > /dev/null; then
    echo "✅ Backend health check passed"
else
    echo "❌ Backend health check failed"
fi

# Test root endpoint
if curl -s http://localhost:8001/ > /dev/null; then
    echo "✅ Backend root endpoint accessible"
else
    echo "❌ Backend root endpoint failed"
fi

# Stop test backend
kill $BACKEND_PID 2>/dev/null
wait $BACKEND_PID 2>/dev/null

echo ""
echo "🎉 StellarEye test completed!"
echo ""
echo "🚀 Ready to run? Execute:"
echo "   ./dev_stellareye.sh"