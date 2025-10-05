import React from 'react'

const SimpleMapTest: React.FC = () => {
  return (
    <div className="h-screen w-screen bg-gray-900 text-white">
      <div className="absolute top-4 left-4 z-50 bg-gray-800 p-4 rounded">
        <h2 className="text-lg font-bold mb-2">Simple Map Test</h2>
        <p className="text-sm">Testing without Leaflet</p>
      </div>
      
      <div className="h-full w-full bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-96 h-96 bg-gray-800 rounded-lg flex items-center justify-center mb-4">
            <div className="text-center">
              <div className="text-6xl mb-4">🌌</div>
              <p className="text-xl">Simulated Star Map</p>
              <p className="text-sm text-gray-400 mt-2">No Leaflet dependencies</p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700">
              DSS Optical
            </button>
            <button className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700">
              Gaia Stars
            </button>
            <button className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700">
              WISE Infrared
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SimpleMapTest