#!/bin/bash

# StellarEye Frontend Runner
echo "⚛️  Starting StellarEye Frontend"
echo "=============================="

cd frontend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing Node.js dependencies..."
    npm install
fi

echo "🚀 Starting React development server on http://localhost:5173"
echo "🔥 Hot reload enabled - changes will update automatically"
echo ""

npm run dev