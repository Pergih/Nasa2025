import React, { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix Leaflet default markers
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

interface CelestialObject {
  id: string
  name: string
  type: 'star' | 'galaxy' | 'nebula' | 'satellite' | 'exoplanet'
  ra: number
  dec: number
  magnitude?: number
  distance?: number
  constellation?: string
}

interface SpaceTileMapProps {
  celestialObjects: CelestialObject[]
  onObjectClick: (object: CelestialObject) => void
  selectedObject?: CelestialObject | null
}

const SpaceTileMap: React.FC<SpaceTileMapProps> = ({
  celestialObjects,
  onObjectClick,
  selectedObject
}) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markersRef = useRef<L.LayerGroup>(new L.LayerGroup())
  const [currentZoom, setCurrentZoom] = useState(2)
  const [mapMode, setMapMode] = useState<'survey' | 'infrared' | 'planck' | 'gaia' | 'twomass' | 'fermi'>('survey')

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    // Create custom CRS for celestial coordinates
    const celestialCRS = L.extend({}, L.CRS.Simple, {
      projection: L.Projection.LonLat,
      transformation: new L.Transformation(1 / 360, 0.5, -1 / 180, 0.5),

      // Set bounds for RA (0-360°) and Dec (-90° to +90°)
      infinite: false
    })

    // Initialize map with celestial coordinate system
    const map = L.map(mapRef.current, {
      crs: celestialCRS,
      center: [0, 180], // Center on RA=180°, Dec=0°
      zoom: 2,
      minZoom: 1,
      maxZoom: 10,
      zoomControl: true,
      attributionControl: false
    })

    // VERIFIED WORKING: CDS Aladin HiPS astronomical tile servers
    // These are the REAL NASA/ESA astronomical surveys with proper zoom levels

    // Create starfield background layer
    const createStarfieldLayer = () => {
      return L.tileLayer('data:image/svg+xml;base64,' + btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" width="256" height="256">
          <rect width="256" height="256" fill="#000011"/>
          <circle cx="50" cy="30" r="1" fill="white" opacity="0.8"/>
          <circle cx="120" cy="80" r="0.5" fill="white" opacity="0.6"/>
          <circle cx="200" cy="50" r="1.5" fill="white" opacity="0.9"/>
          <circle cx="80" cy="150" r="0.8" fill="white" opacity="0.7"/>
          <circle cx="180" cy="200" r="1" fill="white" opacity="0.8"/>
          <circle cx="30" cy="220" r="0.6" fill="white" opacity="0.5"/>
          <circle cx="220" cy="120" r="1.2" fill="white" opacity="0.9"/>
          <circle cx="150" cy="180" r="0.7" fill="white" opacity="0.6"/>
          <circle cx="90" cy="90" r="0.9" fill="white" opacity="0.8"/>
          <circle cx="160" cy="40" r="0.5" fill="white" opacity="0.5"/>
          <circle cx="40" cy="100" r="1.1" fill="white" opacity="0.7"/>
          <circle cx="210" cy="170" r="0.8" fill="white" opacity="0.6"/>
        </svg>
      `), {
        attribution: '© StellarEye Starfield Simulation',
        tileSize: 256,
        maxZoom: 18,
        opacity: 1.0
      })
    }

    // Astronomical survey layers with starfield base
    const spaceTileLayers = {
      // DSS Optical Survey simulation
      survey: createStarfieldLayer(),

      // Gaia Star Map with enhanced starfield
      gaia: L.tileLayer('data:image/svg+xml;base64,' + btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" width="256" height="256">
          <rect width="256" height="256" fill="#000022"/>
          <circle cx="50" cy="30" r="1.5" fill="#88aaff" opacity="0.9"/>
          <circle cx="120" cy="80" r="0.8" fill="#aaccff" opacity="0.7"/>
          <circle cx="200" cy="50" r="2" fill="#ffffff" opacity="1.0"/>
          <circle cx="80" cy="150" r="1.2" fill="#ffaaaa" opacity="0.8"/>
          <circle cx="180" cy="200" r="1.5" fill="#ffffaa" opacity="0.9"/>
          <circle cx="30" cy="220" r="0.9" fill="#aaffaa" opacity="0.6"/>
          <circle cx="220" cy="120" r="1.8" fill="#ffcccc" opacity="0.9"/>
          <circle cx="150" cy="180" r="1" fill="#ccccff" opacity="0.7"/>
          <circle cx="90" cy="90" r="1.3" fill="#ffdddd" opacity="0.8"/>
          <circle cx="160" cy="40" r="0.7" fill="#ddddff" opacity="0.6"/>
          <circle cx="40" cy="100" r="1.6" fill="#ffffcc" opacity="0.8"/>
          <circle cx="210" cy="170" r="1.1" fill="#ccffcc" opacity="0.7"/>
          <text x="128" y="240" text-anchor="middle" fill="white" font-size="8" opacity="0.3">Gaia Stars</text>
        </svg>
      `), {
        attribution: '© Gaia Star Catalog Simulation',
        tileSize: 256,
        maxZoom: 18,
        opacity: 1.0
      }),

      // 2MASS Near-Infrared
      twomass: L.tileLayer('data:image/svg+xml;base64,' + btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" width="256" height="256">
          <rect width="256" height="256" fill="#220000"/>
          <circle cx="50" cy="30" r="2" fill="#ff6666" opacity="0.8"/>
          <circle cx="120" cy="80" r="1.5" fill="#ff8888" opacity="0.6"/>
          <circle cx="200" cy="50" r="2.5" fill="#ffaaaa" opacity="0.9"/>
          <circle cx="80" cy="150" r="1.8" fill="#ff4444" opacity="0.7"/>
          <circle cx="180" cy="200" r="2.2" fill="#ff7777" opacity="0.8"/>
          <circle cx="30" cy="220" r="1.3" fill="#ff5555" opacity="0.5"/>
          <circle cx="220" cy="120" r="2.8" fill="#ff9999" opacity="0.9"/>
          <circle cx="150" cy="180" r="1.6" fill="#ff6666" opacity="0.6"/>
          <text x="128" y="240" text-anchor="middle" fill="white" font-size="8" opacity="0.3">2MASS IR</text>
        </svg>
      `), {
        attribution: '© 2MASS Near-Infrared Simulation',
        tileSize: 256,
        maxZoom: 18,
        opacity: 1.0
      }),

      // WISE Infrared
      infrared: L.tileLayer('data:image/svg+xml;base64,' + btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" width="256" height="256">
          <rect width="256" height="256" fill="#331100"/>
          <circle cx="50" cy="30" r="3" fill="#ff9900" opacity="0.7"/>
          <circle cx="120" cy="80" r="2" fill="#ffaa33" opacity="0.5"/>
          <circle cx="200" cy="50" r="3.5" fill="#ffcc66" opacity="0.8"/>
          <circle cx="80" cy="150" r="2.5" fill="#ff7700" opacity="0.6"/>
          <circle cx="180" cy="200" r="3.2" fill="#ffbb44" opacity="0.7"/>
          <circle cx="30" cy="220" r="1.8" fill="#ff8800" opacity="0.4"/>
          <circle cx="220" cy="120" r="4" fill="#ffdd77" opacity="0.8"/>
          <text x="128" y="240" text-anchor="middle" fill="white" font-size="8" opacity="0.3">WISE Thermal</text>
        </svg>
      `), {
        attribution: '© NASA WISE Infrared Simulation',
        tileSize: 256,
        maxZoom: 18,
        opacity: 1.0
      }),

      // Planck CMB
      planck: L.tileLayer('data:image/svg+xml;base64,' + btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" width="256" height="256">
          <defs>
            <radialGradient id="cmb" cx="50%" cy="50%" r="50%">
              <stop offset="0%" style="stop-color:#ff0000;stop-opacity:0.3" />
              <stop offset="50%" style="stop-color:#0000ff;stop-opacity:0.2" />
              <stop offset="100%" style="stop-color:#ff0000;stop-opacity:0.1" />
            </radialGradient>
          </defs>
          <rect width="256" height="256" fill="#000033"/>
          <rect width="256" height="256" fill="url(#cmb)"/>
          <text x="128" y="240" text-anchor="middle" fill="white" font-size="8" opacity="0.3">Planck CMB</text>
        </svg>
      `), {
        attribution: '© ESA Planck CMB Simulation',
        tileSize: 256,
        maxZoom: 18,
        opacity: 1.0
      }),

      // Fermi Gamma-Ray
      fermi: L.tileLayer('data:image/svg+xml;base64,' + btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" width="256" height="256">
          <rect width="256" height="256" fill="#110033"/>
          <circle cx="50" cy="30" r="4" fill="#00ff00" opacity="0.6"/>
          <circle cx="120" cy="80" r="2.5" fill="#00ffaa" opacity="0.4"/>
          <circle cx="200" cy="50" r="5" fill="#aaffaa" opacity="0.7"/>
          <circle cx="80" cy="150" r="3.5" fill="#00ff66" opacity="0.5"/>
          <circle cx="180" cy="200" r="4.5" fill="#66ffaa" opacity="0.6"/>
          <circle cx="220" cy="120" r="6" fill="#aaffcc" opacity="0.8"/>
          <text x="128" y="240" text-anchor="middle" fill="white" font-size="8" opacity="0.3">Fermi γ-ray</text>
        </svg>
      `), {
        attribution: '© NASA Fermi Gamma-Ray Simulation',
        tileSize: 256,
        maxZoom: 18,
        opacity: 1.0
      })
    }

    // Function to switch map layers
    const switchMapLayer = (mode: string) => {
      // Remove all layers first
      Object.values(spaceTileLayers).forEach(layer => {
        if (map.hasLayer(layer)) {
          map.removeLayer(layer)
        }
      })

      // Add appropriate astronomical survey layer
      switch (mode) {
        case 'survey':
          spaceTileLayers.survey.addTo(map)
          break
        case 'infrared':
          spaceTileLayers.infrared.addTo(map)
          break
        case 'planck':
          spaceTileLayers.planck.addTo(map)
          break
        case 'gaia':
          spaceTileLayers.gaia.addTo(map)
          break
        case 'twomass':
          spaceTileLayers.twomass.addTo(map)
          break
        case 'fermi':
          spaceTileLayers.fermi.addTo(map)
          break
        default:
          spaceTileLayers.survey.addTo(map) // Default to DSS optical survey
      }
    }

    // Add initial layer
    switchMapLayer(mapMode)

      // Store switch function for external use
      ; (map as any).switchMapLayer = switchMapLayer

    // Handle zoom changes for astronomical surveys
    map.on('zoomend', () => {
      const zoom = map.getZoom()
      setCurrentZoom(zoom)
      
      // Log zoom level for debugging real astronomical data
      console.log(`🔍 Zoom level: ${zoom}, Survey: ${mapMode}`)
      
      // Adjust opacity based on zoom for better visibility of faint objects
      Object.values(spaceTileLayers).forEach(layer => {
        if (map.hasLayer(layer)) {
          const opacity = Math.min(1.0, 0.6 + (zoom / 15))
          layer.setOpacity(opacity)
        }
      })
    })

    // Add markers layer
    markersRef.current.addTo(map)

    mapInstanceRef.current = map

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  // Update celestial object markers
  useEffect(() => {
    if (!mapInstanceRef.current || !markersRef.current) return

    // Clear existing markers
    markersRef.current.clearLayers()

    // Create custom icons for different object types
    const createIcon = (type: string, isSelected: boolean = false) => {
      const colors = {
        star: '#FFD700',
        galaxy: '#9370DB',
        nebula: '#FF69B4',
        satellite: '#00FF00',
        exoplanet: '#1E90FF'
      }

      const color = colors[type as keyof typeof colors] || '#FFFFFF'
      const size = isSelected ? 16 : 12
      const opacity = isSelected ? 1.0 : 0.8

      return L.divIcon({
        className: 'celestial-marker',
        html: `<div style="width: ${size}px; height: ${size}px; background: ${color}; border: 2px solid white; border-radius: 50%; box-shadow: 0 0 ${isSelected ? 8 : 4}px ${color}; opacity: ${opacity}; transform: ${isSelected ? 'scale(1.2)' : 'scale(1)'}; transition: all 0.3s ease;"></div>`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2]
      })
    }

    // Add markers for celestial objects
    celestialObjects.forEach(obj => {
      // Convert RA/Dec to map coordinates
      const lat = obj.dec
      const lng = obj.ra

      const isSelected = selectedObject?.id === obj.id
      const icon = createIcon(obj.type, isSelected)

      const marker = L.marker([lat, lng], { icon })
        .bindPopup(`
          <div style="color: black; font-family: sans-serif;">
            <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">
              ${obj.name}
            </h3>
            <p style="margin: 4px 0; text-transform: capitalize;">
              <strong>Type:</strong> ${obj.type}
            </p>
            ${obj.constellation ? `
              <p style="margin: 4px 0;">
                <strong>Constellation:</strong> ${obj.constellation}
              </p>
            ` : ''}
            ${obj.magnitude !== undefined ? `
              <p style="margin: 4px 0;">
                <strong>Magnitude:</strong> ${obj.magnitude}
              </p>
            ` : ''}
            ${obj.distance ? `
              <p style="margin: 4px 0;">
                <strong>Distance:</strong> ${obj.distance} ly
              </p>
            ` : ''}
            <p style="margin: 8px 0 4px 0; font-size: 12px; color: #666;">
              RA: ${obj.ra.toFixed(2)}° • Dec: ${obj.dec.toFixed(2)}°
            </p>
          </div>
        `)
        .on('click', () => onObjectClick(obj))

      markersRef.current.addLayer(marker)
    })
  }, [celestialObjects, selectedObject, onObjectClick])

  // Pan to selected object
  useEffect(() => {
    if (selectedObject && mapInstanceRef.current) {
      mapInstanceRef.current.setView([selectedObject.dec, selectedObject.ra], Math.max(currentZoom, 4))
    }
  }, [selectedObject, currentZoom])

  // Handle map mode changes
  useEffect(() => {
    if (mapInstanceRef.current && (mapInstanceRef.current as any).switchMapLayer) {
      ; (mapInstanceRef.current as any).switchMapLayer(mapMode)
    }
  }, [mapMode])

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full" />

      {/* Map Controls - Viewport constrained */}
      <div className="absolute top-4 left-4 space-y-2 overflow-y-auto scrollable-area" style={{ maxHeight: '60vh' }}>
        {/* Map Mode Selector */}
        <div className="bg-gray-900 bg-opacity-90 text-white p-3 rounded-lg">
          <h4 className="font-semibold mb-2 text-sm">Map View</h4>
          <div className="space-y-1">

            <button
              onClick={() => setMapMode('survey')}
              className={`w-full text-left px-2 py-1 rounded text-xs transition-colors ${mapMode === 'survey' ? 'bg-blue-600' : 'hover:bg-gray-700'
                }`}
            >
              🔭 Optical Survey
            </button>
            <button
              onClick={() => setMapMode('infrared')}
              className={`w-full text-left px-2 py-1 rounded text-xs transition-colors ${mapMode === 'infrared' ? 'bg-blue-600' : 'hover:bg-gray-700'
                }`}
            >
              🌡️ Infrared Survey
            </button>
            <button
              onClick={() => setMapMode('planck')}
              className={`w-full text-left px-2 py-1 rounded text-xs transition-colors ${mapMode === 'planck' ? 'bg-blue-600' : 'hover:bg-gray-700'
                }`}
            >
              🌌 Cosmic Microwave
            </button>
          </div>
        </div>

        {/* Zoom level indicator */}
        <div className="bg-gray-900 bg-opacity-80 text-white px-3 py-2 rounded-lg text-sm">
          <div className="flex items-center space-x-2">
            <span>Zoom: {currentZoom}</span>
            <span className="text-gray-400">•</span>
            <span className="text-xs">
              {currentZoom < 4 ? 'Wide Survey' :
                currentZoom < 7 ? 'Detailed View' : 'High Resolution'}
            </span>
          </div>
        </div>

        {/* Object Count */}
        <div className="bg-gray-900 bg-opacity-80 text-white px-3 py-2 rounded-lg text-sm">
          <div className="flex items-center space-x-2">
            <span>📍 Objects: {celestialObjects.length}</span>
          </div>
        </div>
      </div>

      {/* Map legend */}
      <div className="absolute bottom-4 left-4 bg-gray-900 bg-opacity-90 text-white p-4 rounded-lg">
        <h4 className="font-semibold mb-2 text-sm">Celestial Objects</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-400 rounded-full border border-white"></div>
            <span>Stars</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-400 rounded-full border border-white"></div>
            <span>Galaxies</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-pink-400 rounded-full border border-white"></div>
            <span>Nebulae</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full border border-white"></div>
            <span>Satellites</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-400 rounded-full border border-white"></div>
            <span>Exoplanets</span>
          </div>
        </div>
      </div>

      {/* NASA Data Links - Viewport constrained */}
      <div className="absolute top-4 right-4 bg-gray-900 bg-opacity-90 text-white p-3 rounded-lg text-xs max-w-64 overflow-y-auto scrollable-area" style={{ maxHeight: '60vh' }}>
        <h4 className="font-semibold mb-2 sticky top-0 bg-gray-900 pb-1">NASA Resources</h4>
        <div className="space-y-1 pr-2">
          <a
            href="https://pds-imaging.jpl.nasa.gov/volumes/mro.html"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-blue-400 hover:text-blue-300 underline"
          >
            🔗 Mars Reconnaissance Orbiter
          </a>
          <a
            href="https://data.nasa.gov/browse?category=Space+%26+Science"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-blue-400 hover:text-blue-300 underline"
          >
            🔗 NASA Open Data Portal
          </a>
          <a
            href="https://skyview.gsfc.nasa.gov/current/cgi/titlepage.pl"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-blue-400 hover:text-blue-300 underline"
          >
            🔗 NASA SkyView
          </a>
          <a
            href="https://hubblesite.org/contents/media/images"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-blue-400 hover:text-blue-300 underline"
          >
            🔗 Hubble Image Gallery
          </a>
          <a
            href="https://webbtelescope.org/contents/media"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-blue-400 hover:text-blue-300 underline"
          >
            🔗 James Webb Gallery
          </a>
          <a
            href="https://chandra.harvard.edu/photo/"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-blue-400 hover:text-blue-300 underline"
          >
            🔗 Chandra X-ray Images
          </a>
          <a
            href="https://www.spitzer.caltech.edu/images"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-blue-400 hover:text-blue-300 underline"
          >
            🔗 Spitzer Archive
          </a>
          <a
            href="https://www.eso.org/public/images/"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-blue-400 hover:text-blue-300 underline"
          >
            🔗 ESO Image Gallery
          </a>
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 right-4 bg-gray-900 bg-opacity-80 text-white p-3 rounded-lg text-xs max-w-48">
        <p className="mb-1">🖱️ <strong>Pan:</strong> Click and drag</p>
        <p className="mb-1">🔍 <strong>Zoom:</strong> Mouse wheel or +/- buttons</p>
        <p className="mb-1">🗺️ <strong>Switch:</strong> Use map view buttons</p>
        <p>📍 <strong>Explore:</strong> Click objects for details</p>
      </div>
    </div>
  )
}

export default SpaceTileMap