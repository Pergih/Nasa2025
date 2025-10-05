import React, { useState } from 'react'
import SpaceTileMap from './components/map/SpaceTileMap'

const MapTest: React.FC = () => {
  const [error, setError] = useState<string | null>(null)

  const testObjects = [
    { 
      id: 'sirius', 
      name: 'Sirius', 
      type: 'star' as const, 
      ra: 101.287, 
      dec: -16.716, 
      constellation: 'Canis Major', 
      magnitude: -1.46 
    }
  ]

  const handleObjectClick = (object: any) => {
    console.log('Clicked object:', object)
  }

  try {
    return (
      <div className="h-screen w-screen bg-gray-900 text-white">
        <div className="absolute top-4 left-4 z-50 bg-gray-800 p-4 rounded">
          <h2 className="text-lg font-bold mb-2">Map Test</h2>
          <p className="text-sm">Testing SpaceTileMap component</p>
          {error && <p className="text-red-400 text-sm mt-2">Error: {error}</p>}
        </div>
        
        <div className="h-full w-full">
          <SpaceTileMap
            celestialObjects={testObjects}
            onObjectClick={handleObjectClick}
            selectedObject={null}
          />
        </div>
      </div>
    )
  } catch (err) {
    return (
      <div className="h-screen w-screen bg-red-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Map Component Error</h1>
          <p className="text-lg">{err instanceof Error ? err.message : 'Unknown error'}</p>
        </div>
      </div>
    )
  }
}

export default MapTest