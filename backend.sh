#!/bin/bash

# StellarEye Backend Runner
echo "🐍 Starting StellarEye Backend"
echo "============================="

cd backend

# Check if virtual environment exists
if [ ! -d ".venv" ]; then
    echo "📦 Setting up Python environment..."
    uv sync
fi

echo "🚀 Starting FastAPI server on http://localhost:8000"
echo "📚 API docs will be available at http://localhost:8000/docs"
echo ""

uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000