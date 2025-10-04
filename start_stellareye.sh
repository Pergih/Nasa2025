#!/bin/bash

# StellarEye Startup Script
echo "👁️ Starting StellarEye - NASA Space Apps Challenge 2025"
echo "=================================================="

# Check if we're in the right directory
if [ ! -d "frontend" ] || [ ! -d "backend" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    echo "   Make sure you can see both 'frontend' and 'backend' folders"
    exit 1
fi

echo "🔧 Checking setup..."

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
echo "🚀 Starting StellarEye services..."
echo ""
echo "📋 Instructions:"
echo "1. Backend will start on: http://localhost:8000"
echo "2. Frontend will start on: http://localhost:3000"
echo "3. API docs available at: http://localhost:8000/docs"
echo ""
echo "⚠️  You need to run these commands in separate terminals:"
echo ""
echo "Terminal 1 (Backend):"
echo "cd backend && uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"
echo ""
echo "Terminal 2 (Frontend):"
echo "cd frontend && npm run dev"
echo ""
echo "🎯 Once both are running, visit: http://localhost:3000"