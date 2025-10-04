#!/usr/bin/env python3
"""
Quick test script for StellarEye setup.
"""
import requests
import sys
from pathlib import Path

def test_frontend_files():
    """Test if frontend files exist and are properly configured."""
    print("🧪 Testing StellarEye Frontend...")
    
    frontend_dir = Path("frontend")
    required_files = [
        "package.json",
        "src/test-app.tsx", 
        "src/main.tsx",
        "src/index.css",
        "index.html"
    ]
    
    all_good = True
    for file_path in required_files:
        full_path = frontend_dir / file_path
        if full_path.exists():
            print(f"✅ {file_path}: EXISTS")
        else:
            print(f"❌ {file_path}: MISSING")
            all_good = False
    
    return all_good

def test_backend():
    """Test if the backend is running."""
    print("\n🧪 Testing StellarEye Backend...")
    
    try:
        response = requests.get("http://localhost:8000/health", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print("✅ Backend health check: PASSED")
            print(f"   Service: {data.get('service', 'unknown')}")
            return True
        else:
            print(f"❌ Backend health check: FAILED (status {response.status_code})")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Backend not running: {e}")
        return False

def main():
    """Run StellarEye tests."""
    print("👁️ StellarEye - Quick Setup Test")
    print("=" * 40)
    
    frontend_ok = test_frontend_files()
    backend_ok = test_backend()
    
    print("\n" + "=" * 40)
    print("📊 SUMMARY:")
    print(f"   Frontend Files: {'✅ READY' if frontend_ok else '❌ ISSUES'}")
    print(f"   Backend API: {'✅ RUNNING' if backend_ok else '❌ NOT RUNNING'}")
    
    if frontend_ok and backend_ok:
        print("\n🎉 StellarEye is ready!")
        print("\nNext steps:")
        print("1. Frontend: cd frontend && npm run dev")
        print("2. Visit: http://localhost:3000")
        print("3. API Docs: http://localhost:8000/docs")
        return 0
    else:
        print("\n⚠️  Issues found:")
        if not backend_ok:
            print("   Start backend: cd backend && uv run uvicorn app.main:app --reload")
        if not frontend_ok:
            print("   Check frontend files")
        return 1

if __name__ == "__main__":
    sys.exit(main())