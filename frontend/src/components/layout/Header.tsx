import React from 'react'
import { Menu, Eye } from 'lucide-react'
import { useCelestialStore } from '@/stores/celestialStore'

const Header: React.FC = () => {
  const { toggleSidebar } = useCelestialStore()

  return (
    <header className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between">
      {/* Left section */}
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Eye className="h-8 w-8 text-blue-400" />
            <div>
              <h1 className="text-xl font-bold text-white">StellarEye</h1>
              <p className="text-xs text-gray-400">NASA Space Apps Challenge 2025</p>
            </div>
          </div>
        </div>
      </div>

      {/* Placeholder content */}
      <div className="flex-1 max-w-2xl mx-8">
        <p className="text-gray-400 text-center">About Page Header</p>
      </div>
    </header>
  )
}

export default Header