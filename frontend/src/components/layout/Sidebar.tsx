import React from 'react'
import { useCelestialStore } from '@/stores/celestialStore'

const Sidebar: React.FC = () => {
  const { selectedObject } = useCelestialStore()

  return (
    <div className="h-full bg-gray-800 text-white p-4">
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">👁️ StellarEye</h2>
        <p className="text-sm text-gray-400">NASA Space Apps Challenge 2025</p>
      </div>

      {selectedObject ? (
        <div className="bg-gray-700 rounded-lg p-4">
          <h3 className="font-semibold mb-2">{selectedObject.name}</h3>
          <div className="text-sm text-gray-300 space-y-1">
            <p>Type: {selectedObject.type}</p>
            <p>RA: {selectedObject.ra.toFixed(3)}°</p>
            <p>Dec: {selectedObject.dec.toFixed(3)}°</p>
            {selectedObject.magnitude && (
              <p>Magnitude: {selectedObject.magnitude}</p>
            )}
            {selectedObject.constellation && (
              <p>Constellation: {selectedObject.constellation}</p>
            )}
          </div>
        </div>
      ) : (
        <div className="text-gray-400 text-sm">
          Click on an object to see details
        </div>
      )}
    </div>
  )
}

export default Sidebar