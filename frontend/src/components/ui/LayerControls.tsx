import React from 'react'
import { Satellite, Globe, Star, Eye } from 'lucide-react'
import { useCelestialStore } from '@/stores/celestialStore'

const LayerControls: React.FC = () => {
  const { layers, toggleLayer } = useCelestialStore()

  const layerButtons = [
    { key: 'stars' as const, icon: Star, label: 'Stars', color: 'text-yellow-400' },
    { key: 'galaxies' as const, icon: Globe, label: 'Galaxies', color: 'text-purple-400' },
    { key: 'satellites' as const, icon: Satellite, label: 'Satellites', color: 'text-green-400' },
    { key: 'exoplanets' as const, icon: Eye, label: 'Exoplanets', color: 'text-blue-400' },
  ]

  return (
    <div className="flex space-x-2">
      {layerButtons.map(({ key, icon: Icon, label, color }) => (
        <button
          key={key}
          onClick={() => toggleLayer(key)}
          className={`
            flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-all
            ${layers[key] 
              ? `bg-gray-700 ${color} border border-current` 
              : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
            }
          `}
          title={`Toggle ${label}`}
        >
          <Icon className="h-4 w-4" />
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  )
}

export default LayerControls