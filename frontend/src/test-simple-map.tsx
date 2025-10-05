import React from 'react'
import SpaceTileMap from './components/map/SpaceTileMap'

// Simple test component to check if the map works
const TestSimpleMap: React.FC = () => {
  const testObjects = [
    { 
      id: 'sirius', 
      name: 'Sirius', 
      type: 'star' as const, 
      ra: 101.287, 
      dec: -16.716, 
      constellation: 'Canis Major', 
      magnitude: -1.46 
    },
    { 
      id: 'vega', 
      name: 'Vega', 
      type: 'star' as const, 
      ra: 279.235, 
      dec: 38.784, 
      constellation: 'Lyra', 
      magnitude: 0.03 
    }
  ]

  const handleObjectClick = (object: any) => {
    console.log('Clicked object:', object)
  }

  return (
    <div className="h-screen w-screen bg-gray-900">
      <div className="h-full w-full">
        <SpaceTileMap
          celestialObjects={testObjects}
          onObjectClick={handleObjectClick}
          selectedObject={null}
        />
      </div>
    </div>
  )
}

export default TestSimpleMap