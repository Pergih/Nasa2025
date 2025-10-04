#!/usr/bin/env python3
"""
Test script to verify the Celestial Explorer setup is working.
"""
import requests
import json
import sys
from pathlib import Path

def test_backend():
    """Test if the backend is running and responding."""
    print("🧪 Testing Backend API...")
    
    try:
        # Test health endpoint
        response = requests.get("http://localhost:8000/health", timeout=5)
        if response.status_code == 200:
            print("✅ Backend health check: PASSED")
            print(f"   Response: {response.json()}")
        else:
            print(f"❌ Backend health check: FAILED (status {response.status_code})")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Backend health check: FAILED (connection error: {e})")
        return False
    
    try:
        # Test search endpoint
        response = requests.get("http://localhost:8000/api/v1/search/?q=sirius", timeout=5)
        if response.status_code == 200:
            results = response.json()
            print("✅ Search API: PASSED")
            print(f"   Found {len(results)} results for 'sirius'")
            if results:
                print(f"   First result: {results[0]['name']} ({results[0]['type']})")
        else:
            print(f"❌ Search API: FAILED (status {response.status_code})")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Search API: FAILED (connection error: {e})")
        return False
    
    try:
        # Test API docs
        response = requests.get("http://localhost:8000/docs", timeout=5)
        if response.status_code == 200:
            print("✅ API Documentation: ACCESSIBLE")
        else:
            print(f"⚠️  API Documentation: Status {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"⚠️  API Documentation: {e}")
    
    return True

def test_frontend_files():
    """Test if frontend files are properly set up."""
    print("\n🧪 Testing Frontend Setup...")
    
    frontend_dir = Path("frontend")
    required_files = [
        "package.json",
        "src/App.tsx", 
        "src/main.tsx",
        "src/stores/celestialStore.ts",
        "src/components/layout/MainLayout.tsx",
        "src/pages/ExplorePage.tsx"
    ]
    
    all_good = True
    for file_path in required_files:
        full_path = frontend_dir / file_path
        if full_path.exists():
            print(f"✅ {file_path}: EXISTS")
        else:
            print(f"❌ {file_path}: MISSING")
            all_good = False
    
    # Check package.json dependencies
    package_json = frontend_dir / "package.json"
    if package_json.exists():
        try:
            with open(package_json) as f:
                data = json.load(f)
            
            required_deps = ["react", "react-dom", "react-router-dom", "@tanstack/react-query"]
            missing_deps = []
            
            for dep in required_deps:
                if dep not in data.get("dependencies", {}):
                    missing_deps.append(dep)
            
            if not missing_deps:
                print("✅ Frontend dependencies: ALL PRESENT")
            else:
                print(f"⚠️  Missing dependencies: {missing_deps}")
        except Exception as e:
            print(f"⚠️  Could not parse package.json: {e}")
    
    return all_good

def test_project_structure():
    """Test overall project structure."""
    print("\n🧪 Testing Project Structure...")
    
    required_dirs = [
        "backend/app",
        "frontend/src", 
        "legacy/src",
        "backend/app/api/api_v1/endpoints"
    ]
    
    all_good = True
    for dir_path in required_dirs:
        if Path(dir_path).exists():
            print(f"✅ {dir_path}/: EXISTS")
        else:
            print(f"❌ {dir_path}/: MISSING")
            all_good = False
    
    return all_good

def main():
    """Run all tests."""
    print("🌌 Celestial Explorer - Setup Verification")
    print("=" * 50)
    
    # Test project structure
    structure_ok = test_project_structure()
    
    # Test frontend files
    frontend_ok = test_frontend_files()
    
    # Test backend (only if it's running)
    backend_ok = test_backend()
    
    print("\n" + "=" * 50)
    print("📊 SUMMARY:")
    print(f"   Project Structure: {'✅ GOOD' if structure_ok else '❌ ISSUES'}")
    print(f"   Frontend Setup: {'✅ GOOD' if frontend_ok else '❌ ISSUES'}")
    print(f"   Backend API: {'✅ RUNNING' if backend_ok else '❌ NOT RUNNING'}")
    
    if all([structure_ok, frontend_ok, backend_ok]):
        print("\n🎉 ALL TESTS PASSED! Your setup is ready!")
        print("\nNext steps:")
        print("1. Start backend: cd backend && uv run uvicorn app.main:app --reload")
        print("2. Start frontend: cd frontend && npm run dev")
        print("3. Visit http://localhost:3000 to explore!")
        return 0
    else:
        print("\n⚠️  Some issues found. Check the output above.")
        if not backend_ok:
            print("\n💡 To start the backend:")
            print("   cd backend && uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000")
        return 1

if __name__ == "__main__":
    sys.exit(main())