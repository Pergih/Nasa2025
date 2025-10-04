import React, { useEffect, useState } from 'react'
import { celestialAPI } from '@/services/api'

const SimpleTest: React.FC = () => {
  const [apiStatus, setApiStatus] = useState<string>('Checking...')
  const [searchResults, setSearchResults] = useState<any[]>([])

  useEffect(() => {
    const testAPI = async () => {
      try {
        // Test health check
        const healthy = await celestialAPI.healthCheck()
        setApiStatus(healthy ? 'API Connected ✅' : 'API Offline ❌')

        // Test search
        const results = await celestialAPI.search('sirius', 5)
        setSearchResults(results)
      } catch (error) {
        setApiStatus('API Error ❌')
        console.error('API Test failed:', error)
      }
    }

    testAPI()
  }, [])

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">
          🌌 StellarEye Debug Test
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* API Status */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">API Status</h2>
            <p className="text-lg">{apiStatus}</p>
            <p className="text-sm text-gray-400 mt-2">
              Backend: http://localhost:8000
            </p>
          </div>

          {/* Search Results */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Search Test</h2>
            <p className="text-sm text-gray-400 mb-2">
              Searching for "sirius"...
            </p>
            {searchResults.length > 0 ? (
              <div className="space-y-2">
                {searchResults.map((obj, index) => (
                  <div key={index} className="bg-gray-700 p-3 rounded">
                    <p className="font-medium">{obj.name}</p>
                    <p className="text-sm text-gray-300">
                      {obj.type} • {obj.constellation}
                    </p>
                    <p className="text-xs text-gray-400">
                      RA: {obj.ra}° Dec: {obj.dec}°
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No results yet...</p>
            )}
          </div>
        </div>

        {/* Map Test */}
        <div className="mt-8 bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Map Component Test</h2>
          <div className="bg-gray-700 h-64 rounded flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2">🗺️</div>
              <p>Map would render here</p>
              <p className="text-sm text-gray-400 mt-2">
                Leaflet + React-Leaflet integration
              </p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-900 bg-opacity-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">🚀 Next Steps</h2>
          <div className="space-y-2 text-sm">
            <p>✅ If API Status shows "Connected", the backend is working</p>
            <p>✅ If Search Test shows results, the NASA data is loading</p>
            <p>🗺️ The full map interface should be at the main page</p>
            <p>🔧 Check browser console for any JavaScript errors</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SimpleTest