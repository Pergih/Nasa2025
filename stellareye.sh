#!/bin/bash

# StellarEye Command Center
echo "🌌 StellarEye - NASA Space Apps Challenge 2025"
echo "=============================================="
echo "\"Embiggen Your Eyes\" - Explore space through satellite perspectives"
echo ""

# Check if we're in the right directory
if [ ! -d "frontend" ] || [ ! -d "backend" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Show available commands
echo "🚀 Available Commands:"
echo ""
echo "📋 Quick Start:"
echo "   ./dev_stellareye.sh      - Build and run everything (recommended)"
echo "   npm run dev              - Same as above using npm"
echo ""
echo "🔧 Build & Setup:"
echo "   ./build_stellareye.sh    - Install all dependencies"
echo "   ./test_stellareye.sh     - Test the setup"
echo "   npm run build            - Build for development"
echo "   npm run test             - Test the setup"
echo ""
echo "🏃 Run Services:"
echo "   ./run_stellareye.sh      - Run both services (after building)"
echo "   ./backend.sh             - Run only backend"
echo "   ./frontend.sh            - Run only frontend"
echo "   npm run start            - Run both services"
echo "   npm run backend          - Run only backend"
echo "   npm run frontend         - Run only frontend"
echo ""
echo "🏭 Production:"
echo "   ./build_production.sh    - Build for production deployment"
echo "   npm run build:prod       - Same as above using npm"
echo ""
echo "🌐 Access Points (when running):"
echo "   Frontend:     http://localhost:5173"
echo "   Backend API:  http://localhost:8000"
echo "   API Docs:     http://localhost:8000/docs"
echo "   Health Check: http://localhost:8000/health"
echo ""

# If no arguments, show interactive menu
if [ $# -eq 0 ]; then
    echo "🎯 What would you like to do?"
    echo ""
    echo "1) 🚀 Start development environment (build + run)"
    echo "2) 🔧 Just build (install dependencies)"
    echo "3) 🏃 Just run (after building)"
    echo "4) 🧪 Test setup"
    echo "5) 🏭 Production build"
    echo "6) ❌ Exit"
    echo ""
    read -p "Choose an option (1-6): " choice
    
    case $choice in
        1)
            echo "🚀 Starting development environment..."
            ./dev_stellareye.sh
            ;;
        2)
            echo "🔧 Building StellarEye..."
            ./build_stellareye.sh
            ;;
        3)
            echo "🏃 Running StellarEye..."
            ./run_stellareye.sh
            ;;
        4)
            echo "🧪 Testing setup..."
            ./test_stellareye.sh
            ;;
        5)
            echo "🏭 Building for production..."
            ./build_production.sh
            ;;
        6)
            echo "👋 Goodbye!"
            exit 0
            ;;
        *)
            echo "❌ Invalid option. Please choose 1-6."
            exit 1
            ;;
    esac
else
    # Handle command line arguments
    case $1 in
        "dev"|"start")
            ./dev_stellareye.sh
            ;;
        "build")
            ./build_stellareye.sh
            ;;
        "run")
            ./run_stellareye.sh
            ;;
        "test")
            ./test_stellareye.sh
            ;;
        "prod"|"production")
            ./build_production.sh
            ;;
        "backend")
            ./backend.sh
            ;;
        "frontend")
            ./frontend.sh
            ;;
        *)
            echo "❌ Unknown command: $1"
            echo ""
            echo "Available commands: dev, build, run, test, prod, backend, frontend"
            exit 1
            ;;
    esac
fi