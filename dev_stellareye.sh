#!/bin/bash

# StellarEye Development Script - Build and Run
echo "🌌 StellarEye Development Environment"
echo "NASA Space Apps Challenge 2025 - Embiggen Your Eyes!"
echo "=================================================="

# Check if we're in the right directory
if [ ! -d "frontend" ] || [ ! -d "backend" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    echo "   Make sure you can see both 'frontend' and 'backend' folders"
    exit 1
fi

# Function to cleanup background processes
cleanup() {
    echo ""
    echo "🛑 Shutting down StellarEye development environment..."
    if [ ! -z "$BACKEND_PID" ]; then
        echo "   Stopping backend (PID: $BACKEND_PID)..."
        kill $BACKEND_PID 2>/dev/null
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        echo "   Stopping frontend (PID: $FRONTEND_PID)..."
        kill $FRONTEND_PID 2>/dev/null
    fi
    echo "✅ All services stopped"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

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

# Check if ports are already in use
echo "🔍 Checking ports..."
if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Port 8000 is already in use (backend)"
    echo "   Please stop the existing service or use a different port"
    exit 1
fi

if lsof -Pi :5173 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Port 5173 is already in use (frontend)"
    echo "   Please stop the existing service or use a different port"
    exit 1
fi

echo "✅ Ports are available"
echo ""

# Setup backend
echo "🐍 Setting up Python backend..."
cd backend

# Check if virtual environment exists, if not create it
if [ ! -d ".venv" ]; then
    echo "📦 Creating Python virtual environment..."
    uv venv
fi

# Install/update dependencies
echo "📦 Installing/updating Python dependencies..."
uv sync
if [ $? -ne 0 ]; then
    echo "❌ Failed to install Python dependencies"
    exit 1
fi

echo "✅ Backend setup complete"
cd ..

# Setup frontend
echo "⚛️  Setting up React frontend..."
cd frontend

# Install/update Node.js dependencies
echo "📦 Installing/updating Node.js dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install Node.js dependencies"
    exit 1
fi

echo "✅ Frontend setup complete"
cd ..

echo ""
echo "🚀 Starting StellarEye development servers..."
echo ""

# Start backend in development mode
echo "🐍 Starting Python backend on http://localhost:8000..."
cd backend
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 3

# Check if backend started successfully
if ! kill -0 $BACKEND_PID 2>/dev/null; then
    echo "❌ Failed to start backend"
    exit 1
fi

echo "✅ Backend started successfully (PID: $BACKEND_PID)"

# Start frontend in development mode
echo "⚛️  Starting React frontend on http://localhost:5173..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

# Wait for frontend to start
sleep 3

# Check if frontend started successfully
if ! kill -0 $FRONTEND_PID 2>/dev/null; then
    echo "❌ Failed to start frontend"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

echo "✅ Frontend started successfully (PID: $FRONTEND_PID)"
echo ""
echo "🌌 StellarEye Development Environment is Ready!"
echo "=================================================="
echo "🎯 Frontend:     http://localhost:5173"
echo "🔧 Backend API:  http://localhost:8000"
echo "📚 API Docs:     http://localhost:8000/docs"
echo "📊 Health Check: http://localhost:8000/health"
echo ""
echo "🔥 Features:"
echo "   • Hot reload enabled for both frontend and backend"
echo "   • Real NASA data integration"
echo "   • Interactive 3D space visualization"
echo "   • Celestial object search and exploration"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID