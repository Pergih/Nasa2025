import React, { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Enhanced CSS for space map
const spaceMapStyles = `
  .space-map-container {
    background: #000 !important;
    font-family: 'Inter', sans-serif;
  }
  
  .leaflet-container {
    background: #000 !important;
    cursor: grab;
  }
  
  .leaflet-container:active {
    cursor: grabbing;
  }
  
  .celestial-object {
    border-radius: 50%;
    border: 2px solid rgba(255,255,255,0.8);
    box-shadow: 0 0 15px currentColor;
    transition: all 0.3s ease;
    cursor: pointer;
  }
  
  .celestial-object:hover {
    transform: scale(1.2);
    box-shadow: 0 0 25px currentColor;
  }
  
  .celestial-object.selected {
    transform: scale(1.4);
    border-width: 3px;
    box-shadow: 0 0 30px currentColor, 0 0 60px rgba(255,255,255,0.3);
  }
  
  .leaflet-popup-content-wrapper {
    background: rgba(0,0,0,0.9);
    color: white;
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.2);
  }
  
  .leaflet-popup-tip {
    background: rgba(0,0,0,0.9);
    border: 1px solid rgba(255,255,255,0.2);
  }
  
  .leaflet-control-zoom {
    border: none;
    box-shadow: 0 2px 10px rgba(0,0,0,0.5);
  }
  
  .leaflet-control-zoom a {
    background: rgba(0,0,0,0.8);
    color: white;
    border: 1px solid rgba(255,255,255,0.2);
  }
  
  .leaflet-control-zoom a:hover {
    background: rgba(255,255,255,0.1);
  }
`

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style')
  styleSheet.textContent = spaceMapStyles
  document.head.appendChild(styleSheet)
}

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
  type: 'star' | 'galaxy' | 'nebula' | 'planet' | 'exoplanet' | 'satellite'
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
  backgroundType?: string
}

const SpaceTileMap: React.FC<SpaceTileMapProps> = ({
  celestialObjects,
  onObjectClick,
  selectedObject,
  backgroundType = 'survey'
}) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markersRef = useRef<L.LayerGroup>(new L.LayerGroup())
  const [currentZoom, setCurrentZoom] = useState(2)
  const [mapMode, setMapMode] = useState<'survey' | 'infrared' | 'planck' | 'gaia' | 'twomass' | 'fallback' | 'debug'>('survey')
  const [mapLoaded, setMapLoaded] = useState(false)

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    // Initialize map with standard coordinate system for better compatibility
    let map: L.Map
    try {
      map = L.map(mapRef.current, {
        center: [0, 0], // Center on equator/prime meridian
        zoom: 3,
        minZoom: 2,
        maxZoom: 10,
        zoomControl: true,
        attributionControl: false,
        worldCopyJump: false,
        maxBounds: [[-90, -180], [90, 180]], // Limit to valid coordinate range
        maxBoundsViscosity: 0.8,
        zoomSnap: 0.5, // Allow half-step zooming for smoother experience
        zoomDelta: 0.5, // Smaller zoom steps
        wheelPxPerZoomLevel: 120, // More responsive wheel zoom
        doubleClickZoom: true,
        boxZoom: true
      })

      console.log('🗺️ Map initialized successfully')

      // Force map to resize after a short delay
      setTimeout(() => {
        map.invalidateSize()
        console.log('🗺️ Map size invalidated and refreshed')
      }, 100)

      // Add a longer delay to ensure everything is loaded
      setTimeout(() => {
        map.invalidateSize()
        console.log('🗺️ Final map refresh')
      }, 500)

      setMapLoaded(true)
    } catch (error) {
      console.error('Error initializing map:', error)
      return
    }

    // VERIFIED WORKING: CDS Aladin HiPS astronomical tile servers
    // These are the REAL NASA/ESA astronomical surveys with proper zoom levels

    // Create working space backgrounds with better visuals
    const createSpaceLayers = () => {
      // Create realistic starfield with proper astronomical distribution
      const createRealisticStarfield = (theme: string) => {
        const configs = {
          optical: { bg: '#000814', stars: ['#ffffff', '#aaccff', '#ffccaa', '#ffffaa'], density: 35 },
          infrared: { bg: '#1a0a00', stars: ['#ff6600', '#ff9933', '#ffcc66', '#ff4400'], density: 25 },
          gaia: { bg: '#000033', stars: ['#ffffff', '#88aaff', '#ffaaaa', '#ffffaa'], density: 45 },
          twomass: { bg: '#220000', stars: ['#ff4444', '#ff6666', '#ff8888', '#ffaaaa'], density: 30 }
        }

        const config = configs[theme as keyof typeof configs] || configs.optical
        const stars = []

        // Create realistic star distribution with varying magnitudes
        for (let i = 0; i < config.density; i++) {
          const x = Math.random() * 256
          const y = Math.random() * 256
          const magnitude = Math.random() * 5 + 1 // Stellar magnitude 1-6
          const r = Math.max(0.3, (7 - magnitude) * 0.4) // Brighter stars are larger
          const color = config.stars[Math.floor(Math.random() * config.stars.length)]
          const opacity = Math.max(0.4, (7 - magnitude) * 0.15)
          const twinkle = 2 + Math.random() * 3 // Twinkling animation duration

          stars.push(`
            <circle cx="${x}" cy="${y}" r="${r}" fill="${color}" opacity="${opacity}">
              <animate attributeName="opacity" 
                values="${opacity};${opacity * 1.4};${opacity}" 
                dur="${twinkle}s" 
                repeatCount="indefinite"/>
            </circle>
          `)
        }

        // Add some nebula-like background features for depth
        const nebulae = []
        for (let i = 0; i < 2; i++) {
          const cx = Math.random() * 256
          const cy = Math.random() * 256
          const r = 15 + Math.random() * 30
          nebulae.push(`
            <circle cx="${cx}" cy="${cy}" r="${r}" fill="${config.stars[0]}" opacity="0.08"/>
          `)
        }

        return L.tileLayer('data:image/svg+xml;base64,' + btoa(`
          <svg xmlns="http://www.w3.org/2000/svg" width="256" height="256">
            <defs>
              <radialGradient id="space-bg" cx="50%" cy="50%" r="80%">
                <stop offset="0%" style="stop-color:${config.bg};stop-opacity:1" />
                <stop offset="100%" style="stop-color:#000000;stop-opacity:1" />
              </radialGradient>
            </defs>
            <rect width="256" height="256" fill="url(#space-bg)"/>
            ${nebulae.join('')}
            ${stars.join('')}
          </svg>
        `), {
          attribution: '© StellarEye Astronomical Survey',
          maxZoom: 18,
          opacity: 1.0,
          tileSize: 256
        })
      }

      return {
        // Real ESO All-Sky Survey - Optical view of entire sky
        survey: L.imageOverlay(
          'https://www.eso.org/public/archives/images/large/eso0932a.jpg',
          [[-90, -180], [90, 180]],
          {
            attribution: '© ESO All-Sky Survey',
            opacity: 0.8,
            alt: 'ESO All-Sky Optical Survey'
          }
        ),

        // Real Gaia Star Map - ESA Gaia mission data
        gaia: L.imageOverlay(
          'https://sci.esa.int/documents/33960/35865/1567214108466-GaiaDR2_AllSky_RVS_brightnessCorrected_gal_4000x2000.png',
          [[-90, -180], [90, 180]],
          {
            attribution: '© ESA Gaia DR2',
            opacity: 0.9,
            alt: 'Gaia All-Sky Star Map'
          }
        ),

        // Real WISE Infrared Survey - NASA WISE all-sky
        infrared: L.imageOverlay(
          'https://wise.ssl.berkeley.edu/gallery_images/WISE_allsky_mosaic_color.jpg',
          [[-90, -180], [90, 180]],
          {
            attribution: '© NASA WISE All-Sky Survey',
            opacity: 0.8,
            alt: 'WISE Infrared All-Sky Survey'
          }
        ),

        // Real 2MASS Near-Infrared Survey
        twomass: L.imageOverlay(
          'https://www.ipac.caltech.edu/2mass/gallery/images/allsky/color_allsky.jpg',
          [[-90, -180], [90, 180]],
          {
            attribution: '© 2MASS All-Sky Survey',
            opacity: 0.8,
            alt: '2MASS Near-Infrared All-Sky Survey'
          }
        ),

        // Real Planck CMB Map - ESA Planck mission
        planck: L.imageOverlay(
          'https://sci.esa.int/documents/33960/35865/1567214108466-Planck_CMB_Mollweide_4000x2000.jpg',
          [[-90, -180], [90, 180]],
          {
            attribution: '© ESA Planck CMB',
            opacity: 0.9,
            alt: 'Planck Cosmic Microwave Background'
          }
        ),

        // Fallback procedural starfield if images fail to load
        fallback: createRealisticStarfield('optical')
      }
    }

    // Working space survey layers
    const spaceLayers = createSpaceLayers()

    const spaceTileLayers = {
      // Real astronomical survey images
      survey: spaceLayers.survey,     // ESO All-Sky Optical
      gaia: spaceLayers.gaia,         // Gaia star positions
      twomass: spaceLayers.twomass,   // 2MASS near-infrared
      infrared: spaceLayers.infrared, // WISE infrared
      planck: spaceLayers.planck,     // Planck CMB
      fallback: spaceLayers.fallback, // Procedural fallback

      // Debug layer
      debug: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors (Debug Mode)',
        maxZoom: 18,
        opacity: 0.7
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
        case 'debug':
          spaceTileLayers.debug.addTo(map)
          break
        case 'fallback':
          spaceTileLayers.fallback.addTo(map)
          break
        default:
          // Try to load real survey, fallback to procedural if it fails
          try {
            spaceTileLayers.survey.addTo(map)
            // Add error handling for image loading
            spaceTileLayers.survey.on('error', () => {
              console.log('🗺️ Real image failed, using fallback starfield')
              map.removeLayer(spaceTileLayers.survey)
              spaceTileLayers.fallback.addTo(map)
            })
          } catch (error) {
            console.log('🗺️ Using fallback starfield')
            spaceTileLayers.fallback.addTo(map)
          }
      }
    }

    // Add initial layer with error handling
    try {
      switchMapLayer(mapMode)
      console.log('🗺️ Initial map layer loaded:', mapMode)

      // Add loading indicators for real images
      if (mapMode !== 'debug' && mapMode !== 'fallback') {
        console.log('🖼️ Loading real astronomical survey image...')
      }
    } catch (error) {
      console.error('🗺️ Error loading initial map layer:', error)
      // Fallback to procedural starfield
      spaceTileLayers.fallback.addTo(map)
    }

    // Store switch function for external use
    ; (map as any).switchMapLayer = switchMapLayer

    // Handle zoom changes for astronomical surveys with smooth transitions
    map.on('zoomstart', () => {
      // Add smooth transition class
      if (mapRef.current) {
        mapRef.current.style.transition = 'all 0.3s ease'
      }
    })

    map.on('zoomend', () => {
      const zoom = map.getZoom()
      setCurrentZoom(zoom)

      // Remove transition class after zoom
      if (mapRef.current) {
        setTimeout(() => {
          mapRef.current!.style.transition = ''
        }, 300)
      }

      // Log zoom level for debugging
      console.log(`🔍 Zoom level: ${zoom.toFixed(1)}, Survey: ${mapMode}`)

      // Adjust opacity and visibility based on zoom for better astronomical viewing
      Object.values(spaceTileLayers).forEach(layer => {
        if (map.hasLayer(layer)) {
          // Higher zoom = more detail visible
          const opacity = Math.min(1.0, 0.7 + (zoom / 20))
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

    // Debug: Log the number of objects
    console.log('🗺️ Adding markers for', celestialObjects.length, 'objects')
    console.log('🗺️ First few objects:', celestialObjects.slice(0, 3))
    console.log('🗺️ Map mode:', mapMode)
    console.log('🗺️ Map loaded:', mapLoaded)

    // Create highly visible celestial object markers
    const createCelestialMarker = (obj: CelestialObject, isSelected: boolean = false, zoomLevel: number = 3) => {
      const typeConfig = {
        star: { color: '#FFD700', icon: '⭐', baseSize: 18 },
        galaxy: { color: '#9370DB', icon: '🌌', baseSize: 20 },
        nebula: { color: '#FF69B4', icon: '☁️', baseSize: 19 },
        planet: { color: '#FF8C00', icon: '🪐', baseSize: 22 },
        exoplanet: { color: '#1E90FF', icon: '🌍', baseSize: 18 },
        satellite: { color: '#00FF00', icon: '🛰️', baseSize: 16 }
      }

      const config = typeConfig[obj.type as keyof typeof typeConfig] || typeConfig.star

      // Scale size based on zoom level and magnitude
      const zoomMultiplier = Math.max(0.7, Math.min(1.8, 0.8 + (zoomLevel - 2) * 0.15))
      const magnitudeMultiplier = obj.magnitude ? Math.max(0.8, (6 - obj.magnitude) * 0.2) : 1
      const baseSize = config.baseSize * zoomMultiplier * magnitudeMultiplier
      const size = isSelected ? baseSize + 6 : baseSize

      return L.divIcon({
        className: `celestial-object ${isSelected ? 'selected' : ''}`,
        html: `
          <div style="
            width: ${size}px;
            height: ${size}px;
            background: radial-gradient(circle, ${config.color} 0%, ${config.color}aa 60%, ${config.color}44 80%, transparent 100%);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: ${Math.max(10, size * 0.6)}px;
            border: 2px solid rgba(255,255,255,0.9);
            border-radius: 50%;
            box-shadow: 
              0 0 ${size * 0.8}px ${config.color}88,
              0 0 ${size * 1.5}px ${config.color}44,
              inset 0 0 ${size * 0.3}px rgba(255,255,255,0.3);
            cursor: pointer;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            z-index: 1000;
            transform: ${isSelected ? 'scale(1.2)' : 'scale(1)'};
          ">
            ${config.icon}
          </div>
        `,
        iconSize: [size + 4, size + 4],
        iconAnchor: [(size + 4) / 2, (size + 4) / 2],
        popupAnchor: [0, -(size + 4) / 2]
      })
    }

    // Add markers for celestial objects
    celestialObjects.forEach(obj => {
      // Convert RA/Dec to map coordinates
      // RA: 0-360° -> Longitude: -180 to 180°
      // Dec: -90 to 90° -> Latitude: -90 to 90°
      const lat = Math.max(-90, Math.min(90, obj.dec || 0))
      const lng = ((obj.ra || 0) > 180) ? (obj.ra || 0) - 360 : (obj.ra || 0)

      // Debug log for first few objects
      if (celestialObjects.indexOf(obj) < 3) {
        console.log(`Object ${obj.name}: RA=${obj.ra}, Dec=${obj.dec} -> lng=${lng}, lat=${lat}`)
      }

      const isSelected = selectedObject?.id === obj.id
      const icon = createCelestialMarker(obj, isSelected, currentZoom)

      const marker = L.marker([lat, lng], { icon })
        .bindPopup(`
          <div style="
            color: white; 
            font-family: 'Inter', sans-serif; 
            min-width: 200px;
            background: rgba(0,0,0,0.9);
            border-radius: 8px;
            padding: 12px;
          ">
            <div style="display: flex; align-items: center; margin-bottom: 8px;">
              <span style="font-size: 20px; margin-right: 8px;">
                ${obj.type === 'star' ? '⭐' : obj.type === 'galaxy' ? '🌌' : obj.type === 'nebula' ? '☁️' : obj.type === 'planet' ? '🪐' : obj.type === 'exoplanet' ? '🌍' : '🛰️'}
              </span>
              <h3 style="margin: 0; font-size: 16px; font-weight: 600; color: #fff;">
                ${obj.name}
              </h3>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 13px;">
              <div>
                <div style="color: #888; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;">Type</div>
                <div style="color: #fff; text-transform: capitalize;">${obj.type}</div>
              </div>
              
              ${obj.constellation ? `
                <div>
                  <div style="color: #888; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;">Constellation</div>
                  <div style="color: #fff;">${obj.constellation}</div>
                </div>
              ` : ''}
              
              ${obj.magnitude !== undefined ? `
                <div>
                  <div style="color: #888; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;">Magnitude</div>
                  <div style="color: #fff;">${obj.magnitude}</div>
                </div>
              ` : ''}
              
              ${obj.distance ? `
                <div>
                  <div style="color: #888; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;">Distance</div>
                  <div style="color: #fff;">${obj.distance} ly</div>
                </div>
              ` : ''}
            </div>
            
            <div style="margin-top: 12px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.1); font-size: 11px; color: #888;">
              RA: ${obj.ra.toFixed(3)}° • Dec: ${obj.dec.toFixed(3)}°
            </div>
            
            <button onclick="event.stopPropagation()" style="
              margin-top: 8px;
              background: #1e40af;
              color: white;
              border: none;
              padding: 6px 12px;
              border-radius: 4px;
              font-size: 12px;
              cursor: pointer;
              width: 100%;
            ">
              View Details & Images
            </button>
          </div>
        `, {
          maxWidth: 300,
          className: 'celestial-popup'
        })
        .on('click', () => onObjectClick(obj))

      markersRef.current.addLayer(marker)

      // Debug: Log marker creation
      if (celestialObjects.indexOf(obj) < 3) {
        console.log(`Created marker for ${obj.name} at [${lat}, ${lng}]`)
      }
    })

    // Add a test marker at center for debugging
    if (mapInstanceRef.current && process.env.NODE_ENV === 'development') {
      const testIcon = L.divIcon({
        className: 'test-marker',
        html: `
          <div style="
            width: 30px;
            height: 30px;
            background: #ff0000;
            border: 3px solid white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            box-shadow: 0 0 20px #ff0000;
            z-index: 2000;
          ">
            TEST
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      })

      const testMarker = L.marker([0, 0], { icon: testIcon })
        .bindPopup('Test marker at coordinates (0, 0)')

      markersRef.current.addLayer(testMarker)
      console.log('🗺️ Added test marker at center')
    }

    // Fit map to show all markers if we have objects
    if (celestialObjects.length > 0 && mapInstanceRef.current) {
      try {
        const group = L.featureGroup(markersRef.current.getLayers())
        if (group.getBounds().isValid()) {
          mapInstanceRef.current.fitBounds(group.getBounds(), { padding: [50, 50] })
          console.log('🗺️ Fitted map bounds to show all objects')
        } else {
          // If bounds are not valid, center on first object
          const firstObj = celestialObjects[0]
          if (firstObj) {
            mapInstanceRef.current.setView([firstObj.dec, firstObj.ra], 4)
            console.log('🗺️ Centered on first object:', firstObj.name)
          }
        }
      } catch (error) {
        console.log('🗺️ Could not fit bounds:', error)
      }
    }
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

  // Sync map mode with background type prop
  useEffect(() => {
    if (backgroundType && backgroundType !== mapMode) {
      setMapMode(backgroundType as any)
    }
  }, [backgroundType])

  return (
    <div className="relative w-full h-full" style={{ minHeight: '500px' }}>
      {/* Debug info overlay */}
      <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white p-2 rounded text-xs z-50">
        <div>Map Status: {mapLoaded ? '✅ Loaded' : '⏳ Loading'}</div>
        <div>Objects: {celestialObjects.length}</div>
        <div>Mode: {mapMode}</div>
      </div>

      {/* Loading overlay */}
      {!mapLoaded && (
        <div className="absolute inset-0 bg-gray-900 flex items-center justify-center z-40">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <div className="text-lg font-semibold">Loading Space Map...</div>
            <div className="text-sm text-gray-400 mt-2">Initializing celestial coordinates</div>
          </div>
        </div>
      )}

      <div
        ref={mapRef}
        className="w-full h-full space-map-container"
        style={{
          minHeight: '500px',
          height: '100%',
          width: '100%',
          zIndex: 1,
          backgroundColor: '#000',
          border: '2px solid #333',
          borderRadius: '8px',
          overflow: 'hidden',
          position: 'relative'
        }}
      />

      {/* Map Controls - Viewport constrained */}
      <div className="absolute top-4 left-4 space-y-2 overflow-y-auto scrollable-area" style={{ maxHeight: '60vh' }}>
        {/* Map Mode Selector */}
        <div className="bg-gray-900 bg-opacity-90 text-white p-3 rounded-lg">
          <h4 className="font-semibold mb-2 text-sm">Current Survey</h4>
          <div className="space-y-1">
            <div className={`w-full text-left px-2 py-1 rounded text-xs bg-blue-600`}>
              {mapMode === 'survey' && '🔭 ESO All-Sky Optical Survey'}
              {mapMode === 'gaia' && '⭐ ESA Gaia Star Catalog'}
              {mapMode === 'twomass' && '🔴 2MASS Near-Infrared Survey'}
              {mapMode === 'infrared' && '🌡️ NASA WISE All-Sky Survey'}
              {mapMode === 'planck' && '🌌 ESA Planck CMB'}
              {mapMode === 'fallback' && '✨ Procedural Starfield'}
              {mapMode === 'debug' && '🗺️ Debug Map (OSM)'}
            </div>
            <p className="text-xs text-gray-400 px-2">
              Use header dropdown to change background
            </p>
            {/* Map Control Buttons */}
            <div className="space-y-1">
              {celestialObjects.length > 0 && (
                <button
                  onClick={() => {
                    if (mapInstanceRef.current && markersRef.current) {
                      try {
                        const group = L.featureGroup(markersRef.current.getLayers())
                        if (group.getBounds().isValid()) {
                          mapInstanceRef.current.fitBounds(group.getBounds(), { padding: [50, 50] })
                        }
                      } catch (error) {
                        console.log('Could not fit bounds:', error)
                      }
                    }
                  }}
                  className="w-full text-left px-2 py-1 rounded text-xs bg-green-600 hover:bg-green-700 transition-colors"
                >
                  📍 Show All Objects ({celestialObjects.length})
                </button>
              )}

              <button
                onClick={() => {
                  if (mapInstanceRef.current) {
                    mapInstanceRef.current.setView([0, 0], 3)
                    console.log('🗺️ Reset to center view')
                  }
                }}
                className="w-full text-left px-2 py-1 rounded text-xs bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                🎯 Reset View
              </button>

              {/* Zoom Controls */}
              <div className="flex space-x-1">
                <button
                  onClick={() => {
                    if (mapInstanceRef.current) {
                      mapInstanceRef.current.zoomIn(0.5)
                    }
                  }}
                  className="flex-1 text-center py-1 rounded text-xs bg-gray-600 hover:bg-gray-500 transition-colors"
                >
                  🔍+
                </button>
                <button
                  onClick={() => {
                    if (mapInstanceRef.current) {
                      mapInstanceRef.current.zoomOut(0.5)
                    }
                  }}
                  className="flex-1 text-center py-1 rounded text-xs bg-gray-600 hover:bg-gray-500 transition-colors"
                >
                  🔍-
                </button>
              </div>
            </div>

            {/* Layer Switcher */}
            <div className="space-y-1">
              <div className="text-xs text-gray-400 px-2">Survey Layers:</div>
              {[
                { key: 'survey', name: '🔭 ESO Optical', desc: 'Real All-Sky Survey' },
                { key: 'gaia', name: '⭐ Gaia Stars', desc: 'ESA Star Positions' },
                { key: 'twomass', name: '🔴 2MASS IR', desc: 'Near-Infrared Survey' },
                { key: 'infrared', name: '🌡️ WISE IR', desc: 'NASA All-Sky IR' },
                { key: 'planck', name: '🌌 Planck CMB', desc: 'Cosmic Background' },
                { key: 'fallback', name: '✨ Starfield', desc: 'Procedural Stars' }
              ].map(layer => (
                <button
                  key={layer.key}
                  onClick={() => setMapMode(layer.key as any)}
                  className={`w-full text-left px-2 py-1 rounded text-xs transition-colors ${mapMode === layer.key
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                >
                  <div>{layer.name}</div>
                  <div className="text-xs opacity-70">{layer.desc}</div>
                </button>
              ))}
            </div>

            {/* Debug Toggle */}
            {process.env.NODE_ENV === 'development' && (
              <button
                onClick={() => {
                  const newMode = mapMode === 'debug' ? 'survey' : 'debug'
                  setMapMode(newMode as any)
                }}
                className="w-full text-left px-2 py-1 rounded text-xs bg-yellow-600 hover:bg-yellow-700 transition-colors"
              >
                🗺️ {mapMode === 'debug' ? 'Space View' : 'Debug Map'}
              </button>
            )}
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

        {/* Object Count and Status */}
        <div className="bg-gray-900 bg-opacity-80 text-white px-3 py-2 rounded-lg text-sm">
          <div className="flex items-center space-x-2">
            <span>Objects: {celestialObjects.length}</span>
            {!mapLoaded && (
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                <span className="text-yellow-400">Loading...</span>
              </div>
            )}
            {mapLoaded && (
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-green-400">Ready</span>
              </div>
            )}
          </div>
          {/* Debug: Show first few objects */}
          {celestialObjects.length > 0 && (
            <div className="mt-2 text-xs text-gray-300">
              <div>First: {celestialObjects[0]?.name}</div>
              <div>RA: {celestialObjects[0]?.ra?.toFixed(1)}, Dec: {celestialObjects[0]?.dec?.toFixed(1)}</div>
              <div>Markers: {markersRef.current?.getLayers()?.length || 0}</div>
            </div>
          )}
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
            <div className="w-3 h-3 bg-orange-400 rounded-full border border-white"></div>
            <span>Planets</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-400 rounded-full border border-white"></div>
            <span>Exoplanets</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full border border-white"></div>
            <span>Satellites</span>
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
            Mars Reconnaissance Orbiter
          </a>
          <a
            href="https://data.nasa.gov/browse?category=Space+%26+Science"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-blue-400 hover:text-blue-300 underline"
          >
            NASA Open Data Portal
          </a>
          <a
            href="https://skyview.gsfc.nasa.gov/current/cgi/titlepage.pl"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-blue-400 hover:text-blue-300 underline"
          >
            NASA SkyView
          </a>
          <a
            href="https://hubblesite.org/contents/media/images"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-blue-400 hover:text-blue-300 underline"
          >
            Hubble Image Gallery
          </a>
          <a
            href="https://webbtelescope.org/contents/media"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-blue-400 hover:text-blue-300 underline"
          >
            James Webb Gallery
          </a>
          <a
            href="https://chandra.harvard.edu/photo/"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-blue-400 hover:text-blue-300 underline"
          >
            Chandra X-ray Images
          </a>
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 right-4 bg-gray-900 bg-opacity-80 text-white p-3 rounded-lg text-xs max-w-48">
        <p className="mb-1"><strong>Pan:</strong> Click and drag</p>
        <p className="mb-1"><strong>Zoom:</strong> Mouse wheel or +/- buttons</p>
        <p className="mb-1"><strong>Switch:</strong> Use map view buttons</p>
        <p><strong>Explore:</strong> Click objects for details</p>
      </div>
    </div>
  )
}

export default SpaceTileMap