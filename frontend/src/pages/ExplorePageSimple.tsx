import React, { useEffect, useState } from 'react'
import { celestialAPI } from '@/services/api'

const ExplorePageSimple: React.FC = () => {
  const [apiConnected, setApiConnected] = useState<boolean | null>(null)
  const [sampleData, setSampleData] = useState<any[]>([])

  useEffect(() => {
    const testConnection = async () => {
      try {
        const healthy = await celestialAPI.healthCheck()
        setApiConnected(healthy)
        
        if (healthy) {
          const results = await celestialAPI.search('sirius', 3)
          setSampleData(results)
        }
      } catch (error) {
        setApiConnected(false)
        console.error('Connection test failed:', error)
      }
    }

    testConnection()
  }, [])

  return (
    <div className="h-full bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 p-6 border-b border-gray-700">
        <div className="text-center">
          <div className="text-6xl mb-4">🌌</div>
          <h1 className="text-4xl font-bold text-white mb-4">👁️ StellarEye</h1>
          <p className="text-xl text-gray-300 mb-4">NASA Space Apps Challenge 2025</p>
          <p className="text-lg text-blue-400">"Embiggen Your Eyes"</p>
        </div>
      </div>

      {/* Status */}
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* API Status */}
            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <span className="mr-2">🔗</span>
                API Connection
              </h2>
              {apiConnected === null ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                  <span>Testing connection...</span>
                </div>
              ) : apiConnected ? (
                <div className="text-green-400">
                  <p className="text-lg">✅ Connected to NASA APIs</p>
                  <p className="text-sm text-gray-400">Backend running on port 8000</p>
                </div>
              ) : (
                <div className="text-red-400">
                  <p className="text-lg">❌ API Connection Failed</p>
                  <p className="text-sm text-gray-400">Check if backend is running</p>
                </div>
              )}
            </div>

            {/* Sample Data */}
            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <span className="mr-2">🌟</span>
                Sample Objects
              </h2>
              {sampleData.length > 0 ? (
                <div className="space-y-3">
                  {sampleData.map((obj, index) => (
                    <div key={index} className="bg-gray-700 p-3 rounded">
                      <p className="font-medium text-white">{obj.name}</p>
                      <p className="text-sm text-gray-300 capitalize">{obj.type}</p>
                      <p className="text-xs text-gray-400">
                        {obj.constellation} • Mag: {obj.magnitude}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">Loading celestial objects...</p>
              )}
            </div>

          </div>

          {/* Features */}
          <div className="mt-8 bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <span className="mr-2">🚀</span>
              StellarEye Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-700 rounded">
                <div className="text-2xl mb-2">🗺️</div>
                <p className="font-medium">Interactive Map</p>
                <p className="text-sm text-gray-400">Google Maps for space</p>
              </div>
              <div className="text-center p-4 bg-gray-700 rounded">
                <div className="text-2xl mb-2">🔍</div>
                <p className="font-medium">Smart Search</p>
                <p className="text-sm text-gray-400">Find any celestial object</p>
              </div>
              <div className="text-center p-4 bg-gray-700 rounded">
                <div className="text-2xl mb-2">🛰️</div>
                <p className="font-medium">Real NASA Data</p>
                <p className="text-sm text-gray-400">Live satellite tracking</p>
              </div>
              <div className="text-center p-4 bg-gray-700 rounded">
                <div className="text-2xl mb-2">🌌</div>
                <p className="font-medium">Multi-wavelength</p>
                <p className="text-sm text-gray-400">See space in all colors</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 text-center space-y-4">
            <div className="space-x-4">
              <a 
                href="http://localhost:8000/docs" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                📚 View API Documentation
              </a>
              <a 
                href="/debug" 
                className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                🔧 Debug Page
              </a>
            </div>
            <p className="text-sm text-gray-400">
              The interactive map will load here once all components are ready
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}

export default ExplorePageSimple