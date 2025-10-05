import React, { useState, useEffect } from 'react'
import SimpleExplorePage from './pages/SimpleExplorePage'

// Interactive star map with real astronomical background
const SimpleStarMap: React.FC<{ onObjectSelect?: (name: string) => void }> = ({ onObjectSelect }) => {
  const [zoom, setZoom] = useState(2)
  const [backgroundImage, setBackgroundImage] = useState('allsky')

  // Background image options
  const backgroundImages = {
    allsky: {
      name: 'All-Sky Survey',
      url: 'https://www.eso.org/public/archives/images/large/eso0932a.jpg',
      description: 'Complete 360° view of the night sky'
    },
    milkyway: {
      name: 'Milky Way Panorama',
      url: 'https://www.eso.org/public/archives/images/large/eso1242a.jpg',
      description: 'Our galaxy from horizon to horizon'
    },
    deepfield: {
      name: 'Deep Space Field',
      url: 'https://hubblesite.org/files/live/sites/hubble/files/home/science/universe/galaxies/deep-fields/_images/hubble_ultra_deep_field.jpg',
      description: 'Ultra-deep view of distant galaxies'
    },
    constellation: {
      name: 'Constellation View',
      url: 'https://www.eso.org/public/archives/images/large/eso1006a.jpg',
      description: 'Clear constellation patterns'
    }
  }

  // Accurate star positions based on real RA/Dec coordinates
  // Converted to screen coordinates (RA 0-24h = x 0-100%, Dec -90° to +90° = y 100-0%)
  const stars = [
    // Orion constellation (Winter, RA ~5-6h, Dec ~-10° to +20°)
    { name: 'Betelgeuse', x: 22, y: 35, brightness: 1.0, color: '#ff6666', constellation: 'Orion', magnitude: 0.5, ra: 5.92, dec: 7.4 },
    { name: 'Rigel', x: 21, y: 45, brightness: 0.9, color: '#aaffff', constellation: 'Orion', magnitude: 0.1, ra: 5.24, dec: -8.2 },
    { name: 'Bellatrix', x: 20.5, y: 38, brightness: 0.6, color: '#aaccff', constellation: 'Orion', magnitude: 1.6, ra: 5.42, dec: 6.3 },
    { name: 'Mintaka', x: 21.2, y: 42, brightness: 0.5, color: '#ffffff', constellation: 'Orion', magnitude: 2.2, ra: 5.53, dec: -0.3 },
    { name: 'Alnilam', x: 21.4, y: 43, brightness: 0.6, color: '#ffffff', constellation: 'Orion', magnitude: 1.7, ra: 5.60, dec: -1.2 },
    { name: 'Alnitak', x: 21.6, y: 44, brightness: 0.5, color: '#ffffff', constellation: 'Orion', magnitude: 2.0, ra: 5.68, dec: -1.9 },
    
    // Ursa Major (Big Dipper) (Spring, RA ~8-14h, Dec ~50-60°)
    { name: 'Dubhe', x: 45, y: 17, brightness: 0.7, color: '#ffaa66', constellation: 'Ursa Major', magnitude: 1.8, ra: 11.06, dec: 61.8 },
    { name: 'Merak', x: 46, y: 19, brightness: 0.6, color: '#ffffff', constellation: 'Ursa Major', magnitude: 2.4, ra: 11.03, dec: 56.4 },
    { name: 'Phecda', x: 47.5, y: 21, brightness: 0.6, color: '#ffffff', constellation: 'Ursa Major', magnitude: 2.4, ra: 11.90, dec: 53.7 },
    { name: 'Megrez', x: 49, y: 20, brightness: 0.5, color: '#ffffff', constellation: 'Ursa Major', magnitude: 3.3, ra: 12.26, dec: 57.0 },
    { name: 'Alioth', x: 50.5, y: 19, brightness: 0.6, color: '#ffffff', constellation: 'Ursa Major', magnitude: 1.8, ra: 12.90, dec: 55.9 },
    { name: 'Mizar', x: 52, y: 18, brightness: 0.6, color: '#ffffff', constellation: 'Ursa Major', magnitude: 2.1, ra: 13.42, dec: 54.9 },
    { name: 'Alkaid', x: 53.5, y: 17, brightness: 0.7, color: '#aaccff', constellation: 'Ursa Major', magnitude: 1.9, ra: 13.79, dec: 49.3 },
    
    // Bright individual stars across the sky
    { name: 'Sirius', x: 27, y: 58, brightness: 1.0, color: '#ffffff', constellation: 'Canis Major', magnitude: -1.5, ra: 6.75, dec: -16.7 },
    { name: 'Vega', x: 77, y: 11, brightness: 0.9, color: '#aaccff', constellation: 'Lyra', magnitude: 0.0, ra: 18.62, dec: 38.8 },
    { name: 'Polaris', x: 8, y: 6, brightness: 0.6, color: '#ffffaa', constellation: 'Ursa Minor', magnitude: 2.0, ra: 2.53, dec: 89.3 },
    { name: 'Antares', x: 68, y: 64, brightness: 0.8, color: '#ff4444', constellation: 'Scorpius', magnitude: 1.1, ra: 16.49, dec: -26.6 },
    { name: 'Spica', x: 55, y: 45, brightness: 0.7, color: '#aaccff', constellation: 'Virgo', magnitude: 1.0, ra: 13.42, dec: -11.2 },
    { name: 'Aldebaran', x: 18, y: 38, brightness: 0.7, color: '#ffaa66', constellation: 'Taurus', magnitude: 0.9, ra: 4.60, dec: 16.5 },
    { name: 'Capella', x: 23, y: 23, brightness: 0.8, color: '#ffffaa', constellation: 'Auriga', magnitude: 0.1, ra: 5.28, dec: 45.9 },
    { name: 'Arcturus', x: 58, y: 31, brightness: 0.9, color: '#ffaa66', constellation: 'Boötes', magnitude: -0.1, ra: 14.26, dec: 19.2 }
  ]

  // Accurate constellation line connections
  const constellationLines = [
    // Orion constellation pattern
    { from: 'Betelgeuse', to: 'Bellatrix', constellation: 'Orion' },
    { from: 'Betelgeuse', to: 'Mintaka', constellation: 'Orion' },
    { from: 'Bellatrix', to: 'Mintaka', constellation: 'Orion' },
    { from: 'Mintaka', to: 'Alnilam', constellation: 'Orion' },
    { from: 'Alnilam', to: 'Alnitak', constellation: 'Orion' },
    { from: 'Rigel', to: 'Alnitak', constellation: 'Orion' },
    { from: 'Rigel', to: 'Bellatrix', constellation: 'Orion' },
    
    // Big Dipper (Ursa Major) - classic dipper pattern
    { from: 'Dubhe', to: 'Merak', constellation: 'Ursa Major' },
    { from: 'Merak', to: 'Phecda', constellation: 'Ursa Major' },
    { from: 'Phecda', to: 'Megrez', constellation: 'Ursa Major' },
    { from: 'Megrez', to: 'Alioth', constellation: 'Ursa Major' },
    { from: 'Alioth', to: 'Mizar', constellation: 'Ursa Major' },
    { from: 'Mizar', to: 'Alkaid', constellation: 'Ursa Major' },
    { from: 'Megrez', to: 'Dubhe', constellation: 'Ursa Major' },
    
    // Pointer stars to Polaris
    { from: 'Dubhe', to: 'Polaris', constellation: 'Navigation' },
    { from: 'Merak', to: 'Polaris', constellation: 'Navigation' }
  ]

  // Get star by name for constellation lines
  const getStarByName = (name: string) => stars.find(star => star.name === name)

  return (
    <div className="h-full w-full relative overflow-hidden">
      {/* Real astronomical background images */}
      <div 
        className="absolute inset-0 bg-black bg-cover bg-center transition-all duration-500"
        style={{
          backgroundImage: `url('${backgroundImages[backgroundImage as keyof typeof backgroundImages].url}')`,
          filter: 'brightness(0.4) contrast(1.2)',
          opacity: 0.8
        }}
      />
      
      {/* Fallback star field if image doesn't load */}
      <div 
        className="absolute inset-0 bg-black"
        style={{
          backgroundImage: `
            radial-gradient(1px 1px at 20% 30%, white, transparent),
            radial-gradient(0.5px 0.5px at 40% 70%, rgba(255,255,255,0.8), transparent),
            radial-gradient(1px 1px at 90% 40%, white, transparent),
            radial-gradient(0.5px 0.5px at 15% 80%, rgba(255,255,255,0.6), transparent),
            radial-gradient(1px 1px at 80% 20%, rgba(255,255,255,0.7), transparent),
            radial-gradient(0.5px 0.5px at 10% 60%, white, transparent),
            radial-gradient(1px 1px at 85% 85%, rgba(255,255,255,0.5), transparent)
          `,
          backgroundSize: '300px 300px, 400px 400px, 250px 250px, 500px 500px, 200px 200px, 350px 350px, 280px 280px'
        }}
      />
      
      {/* Astronomical coordinate grid and constellation map */}
      <svg className="absolute inset-0 w-full h-full">
        {/* Coordinate grid */}
        <defs>
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" opacity="0.3" />
        
        {/* RA/Dec coordinate lines */}
        {[0, 20, 40, 60, 80, 100].map(x => (
          <line key={`ra-${x}`} x1={`${x}%`} y1="0%" x2={`${x}%`} y2="100%" 
                stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="2,2" />
        ))}
        {[0, 20, 40, 60, 80, 100].map(y => (
          <line key={`dec-${y}`} x1="0%" y1={`${y}%`} x2="100%" y2={`${y}%`} 
                stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="2,2" />
        ))}
        
        {/* Constellation lines */}
        {constellationLines.map((line, index) => {
          const fromStar = getStarByName(line.from)
          const toStar = getStarByName(line.to)
          if (!fromStar || !toStar) return null
          
          return (
            <line
              key={index}
              x1={`${fromStar.x}%`}
              y1={`${fromStar.y}%`}
              x2={`${toStar.x}%`}
              y2={`${toStar.y}%`}
              stroke="rgba(100,150,255,0.4)"
              strokeWidth="1"
              className="constellation-line"
            />
          )
        })}
        
        {/* Stars with proper astronomical sizing */}
        {stars.map((star, index) => {
          // Calculate star size based on magnitude (brighter stars = lower magnitude = larger size)
          const starSize = Math.max(1, (6 - (star.magnitude || 2)) * zoom * 0.8)
          
          return (
            <g key={index}>
              <circle
                cx={`${star.x}%`}
                cy={`${star.y}%`}
                r={starSize}
                fill={star.color}
                opacity={star.brightness}
                className="cursor-pointer hover:opacity-100 transition-all duration-300"
                onClick={() => onObjectSelect?.(star.name)}
                style={{
                  filter: `drop-shadow(0 0 ${starSize}px ${star.color})`,
                  strokeWidth: '0.5',
                  stroke: star.color
                }}
              >
                <animate
                  attributeName="r"
                  values={`${starSize};${starSize * 1.3};${starSize}`}
                  dur="3s"
                  repeatCount="indefinite"
                />
              </circle>
              
              {/* Star label with magnitude */}
              <text
                x={`${star.x}%`}
                y={`${star.y - 4}%`}
                fill="white"
                fontSize="9"
                fontWeight="bold"
                textAnchor="middle"
                className="opacity-0 hover:opacity-100 transition-opacity pointer-events-none"
                style={{ textShadow: '2px 2px 4px black' }}
              >
                {star.name}
              </text>
              <text
                x={`${star.x}%`}
                y={`${star.y + 3}%`}
                fill="#aaaaaa"
                fontSize="7"
                textAnchor="middle"
                className="opacity-0 hover:opacity-100 transition-opacity pointer-events-none"
                style={{ textShadow: '1px 1px 2px black' }}
              >
                mag {star.magnitude?.toFixed(1)}
              </text>
            </g>
          )
        })}
        
        {/* Constellation labels positioned accurately */}
        <text x="21%" y="48%" fill="rgba(100,150,255,0.7)" fontSize="11" fontWeight="bold" textAnchor="middle">ORION</text>
        <text x="48%" y="15%" fill="rgba(100,150,255,0.7)" fontSize="10" fontWeight="bold" textAnchor="middle">URSA MAJOR</text>
        <text x="77%" y="8%" fill="rgba(100,150,255,0.6)" fontSize="8" fontWeight="bold" textAnchor="middle">LYRA</text>
        <text x="27%" y="65%" fill="rgba(100,150,255,0.6)" fontSize="8" fontWeight="bold" textAnchor="middle">CANIS MAJOR</text>
        <text x="68%" y="72%" fill="rgba(100,150,255,0.6)" fontSize="8" fontWeight="bold" textAnchor="middle">SCORPIUS</text>
        <text x="55%" y="52%" fill="rgba(100,150,255,0.6)" fontSize="8" fontWeight="bold" textAnchor="middle">VIRGO</text>
        
        {/* Coordinate labels */}
        <text x="2%" y="8%" fill="rgba(255,255,255,0.4)" fontSize="8">+60°</text>
        <text x="2%" y="28%" fill="rgba(255,255,255,0.4)" fontSize="8">+30°</text>
        <text x="2%" y="48%" fill="rgba(255,255,255,0.4)" fontSize="8">0°</text>
        <text x="2%" y="68%" fill="rgba(255,255,255,0.4)" fontSize="8">-30°</text>
        <text x="2%" y="88%" fill="rgba(255,255,255,0.4)" fontSize="8">-60°</text>
        
        <text x="8%" y="95%" fill="rgba(255,255,255,0.4)" fontSize="8">0h</text>
        <text x="28%" y="95%" fill="rgba(255,255,255,0.4)" fontSize="8">6h</text>
        <text x="48%" y="95%" fill="rgba(255,255,255,0.4)" fontSize="8">12h</text>
        <text x="68%" y="95%" fill="rgba(255,255,255,0.4)" fontSize="8">18h</text>
        <text x="88%" y="95%" fill="rgba(255,255,255,0.4)" fontSize="8">24h</text>
      </svg>

      {/* Background selector */}
      <div className="absolute top-2 left-2 bg-gray-900 bg-opacity-90 p-2 rounded max-w-xs">
        <h4 className="text-white font-bold text-xs mb-1">Sky Survey</h4>
        <select
          value={backgroundImage}
          onChange={(e) => setBackgroundImage(e.target.value)}
          className="w-full bg-gray-700 text-white text-xs rounded px-2 py-1 border border-gray-600"
        >
          {Object.entries(backgroundImages).map(([key, bg]) => (
            <option key={key} value={key}>{bg.name}</option>
          ))}
        </select>
        <p className="text-gray-400 text-xs mt-1 truncate">
          {backgroundImages[backgroundImage as keyof typeof backgroundImages].description}
        </p>
      </div>

      {/* Zoom controls */}
      <div className="absolute top-2 right-2 bg-gray-900 bg-opacity-80 rounded flex items-center">
        <button
          onClick={() => setZoom(Math.max(1, zoom - 1))}
          className="px-2 py-1 text-white hover:bg-gray-700 text-sm rounded-l"
        >
          -
        </button>
        <span className="px-2 py-1 text-white text-xs">{zoom}x</span>
        <button
          onClick={() => setZoom(Math.min(4, zoom + 1))}
          className="px-2 py-1 text-white hover:bg-gray-700 text-sm rounded-r"
        >
          +
        </button>
      </div>

      {/* Astronomical info panel */}
      <div className="absolute bottom-2 left-2 bg-gray-900 bg-opacity-90 p-3 rounded max-w-xs">
        <h3 className="text-white font-bold text-sm mb-1">Star Chart</h3>
        <p className="text-gray-300 text-xs mb-1">
          {stars.length} stars • {constellationLines.length} connections
        </p>
        <p className="text-gray-400 text-xs mb-1">
          Zoom: {zoom}x • Grid: RA/Dec coordinates
        </p>
        <p className="text-blue-400 text-xs">
          Constellations: Orion, Ursa Major, Lyra
        </p>
      </div>
    </div>
  )
}

// Optimized Gallery Component with image loading optimization
const SimpleGallery: React.FC<{ selectedObject: string | null }> = ({ selectedObject }) => {
  const [selectedImage, setSelectedImage] = useState<any>(null)
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set())
  const [loadingImages, setLoadingImages] = useState<Set<string>>(new Set())
  const [imageCache, setImageCache] = useState<Map<string, HTMLImageElement>>(new Map())
  
  // Zoom and pan state
  const [zoomLevel, setZoomLevel] = useState(1)
  const [panX, setPanX] = useState(0)
  const [panY, setPanY] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const imageContainerRef = React.useRef<HTMLDivElement>(null)
  
  // Progressive resolution state
  const [currentResolution, setCurrentResolution] = useState<'thumbnail' | 'url' | 'highRes' | 'ultraRes'>('url')
  const [resolutionLoading, setResolutionLoading] = useState<string | null>(null)

  // Multi-resolution NASA images for progressive loading
  const nasaImages = [
    {
      id: 'jwst_deep_field',
      title: 'JWST Deep Field',
      thumbnail: 'https://webbtelescope.org/files/live/sites/webb/files/home/webb-science/early-release-observations/_documents/ERO-SMACS-0723-NIRCam-color-high-res.png',
      url: 'https://webbtelescope.org/files/live/sites/webb/files/home/webb-science/early-release-observations/_documents/ERO-SMACS-0723-NIRCam-color-high-res.png',
      highRes: 'https://stsci-opo.org/STScI-01G7JGDHYJ1K28YMHKXKMT2T5V.png', // Ultra high-res
      ultraRes: 'https://webbtelescope.org/files/live/sites/webb/files/home/webb-science/early-release-observations/_documents/ERO-SMACS-0723-NIRCam-color-high-res.png', // Maximum resolution
      description: 'Deepest infrared view of the universe showing thousands of galaxies',
      telescope: 'James Webb Space Telescope',
      wavelength: 'Near-Infrared',
      category: 'deep_space'
    },
    {
      id: 'hubble_pillars',
      title: 'Pillars of Creation',
      thumbnail: 'https://cdn.esahubble.org/archives/images/thumb300y/heic1501a.jpg',
      url: 'https://cdn.esahubble.org/archives/images/large/heic1501a.jpg',
      highRes: 'https://cdn.esahubble.org/archives/images/original/heic1501a.jpg',
      ultraRes: 'https://stsci-opo.org/STScI-01EVT0XPZQ2KGJDES0JBHXRBZZ.png',
      description: 'Iconic star-forming region in the Eagle Nebula',
      telescope: 'Hubble Space Telescope',
      wavelength: 'Optical',
      category: 'nebula'
    },
    {
      id: 'mars_surface',
      title: 'Mars Perseverance Panorama',
      thumbnail: 'https://mars.nasa.gov/system/resources/list_files/25042_PIA24264-320.jpg',
      url: 'https://mars.nasa.gov/system/resources/detail_files/25042_PIA24264-web.jpg',
      highRes: 'https://mars.nasa.gov/system/resources/detail_files/25042_PIA24264-full.jpg',
      ultraRes: 'https://mars.nasa.gov/system/resources/detail_files/25042_PIA24264-full2.jpg',
      description: '360-degree panorama from Perseverance rover in Jezero Crater',
      telescope: 'Mars Perseverance Rover',
      wavelength: 'Visible Light',
      category: 'mars'
    },
    {
      id: 'saturn_rings',
      title: 'Saturn Rings',
      thumbnail: 'https://solarsystem.nasa.gov/system/resources/list_files/15152_PIA21046.jpg',
      url: 'https://solarsystem.nasa.gov/system/resources/detail_files/15152_PIA21046.jpg',
      highRes: 'https://photojournal.jpl.nasa.gov/jpeg/PIA21046.jpg',
      ultraRes: 'https://photojournal.jpl.nasa.gov/tiff/PIA21046.tif',
      description: 'Spectacular view of Saturn and its ring system',
      telescope: 'Cassini Spacecraft',
      wavelength: 'Visible Light',
      category: 'saturn'
    },
    {
      id: 'andromeda_galaxy',
      title: 'Andromeda Galaxy',
      thumbnail: 'https://cdn.esahubble.org/archives/images/thumb300y/heic1502a.jpg',
      url: 'https://cdn.esahubble.org/archives/images/large/heic1502a.jpg',
      highRes: 'https://cdn.esahubble.org/archives/images/original/heic1502a.jpg',
      ultraRes: 'https://stsci-opo.org/STScI-01EVT8ABQY1B1Q2PH8QZWZJX8E.png',
      description: 'Our nearest major galactic neighbor',
      telescope: 'Hubble Space Telescope',
      wavelength: 'Optical',
      category: 'galaxy'
    },
    {
      id: 'orion_nebula',
      title: 'Orion Nebula',
      thumbnail: 'https://cdn.esahubble.org/archives/images/thumb300y/heic0601a.jpg',
      url: 'https://cdn.esahubble.org/archives/images/large/heic0601a.jpg',
      highRes: 'https://cdn.esahubble.org/archives/images/original/heic0601a.jpg',
      ultraRes: 'https://hubblesite.org/files/live/sites/hubble/files/home/hubble-30th-anniversary/images/hubble_30th_orion_nebula.jpg',
      description: 'Stellar nursery in the constellation Orion',
      telescope: 'Hubble Space Telescope',
      wavelength: 'Optical',
      category: 'nebula'
    },
    {
      id: 'crab_nebula',
      title: 'Crab Nebula',
      thumbnail: 'https://cdn.esahubble.org/archives/images/thumb300y/heic0515a.jpg',
      url: 'https://cdn.esahubble.org/archives/images/large/heic0515a.jpg',
      highRes: 'https://cdn.esahubble.org/archives/images/original/heic0515a.jpg',
      ultraRes: 'https://hubblesite.org/files/live/sites/hubble/files/home/science/universe/stars/stellar-death/supernovas/_images/crab_nebula.jpg',
      description: 'Supernova remnant with a pulsar at its center',
      telescope: 'Hubble Space Telescope',
      wavelength: 'Optical',
      category: 'nebula'
    },
    {
      id: 'earth_from_space',
      title: 'Earth from ISS',
      thumbnail: 'https://eoimages.gsfc.nasa.gov/images/imagerecords/57000/57723/globe_west_540.jpg',
      url: 'https://eoimages.gsfc.nasa.gov/images/imagerecords/57000/57723/globe_west_2048.jpg',
      highRes: 'https://eoimages.gsfc.nasa.gov/images/imagerecords/57000/57723/globe_west_4096.jpg',
      ultraRes: 'https://eoimages.gsfc.nasa.gov/images/imagerecords/57000/57723/globe_west_8192.jpg',
      description: 'Our home planet as seen from the International Space Station',
      telescope: 'International Space Station',
      wavelength: 'Visible Light',
      category: 'earth'
    }
  ]

  const getRelevantImages = () => {
    if (!selectedObject) return nasaImages.slice(0, 3)
    
    const objectName = selectedObject.toLowerCase()
    if (objectName.includes('mars')) {
      return nasaImages.filter(img => img.category === 'mars' || img.category === 'deep_space')
    } else if (objectName.includes('sirius') || objectName.includes('vega')) {
      return nasaImages.filter(img => img.category === 'nebula' || img.category === 'deep_space')
    } else if (objectName.includes('andromeda')) {
      return nasaImages.filter(img => img.category === 'galaxy' || img.category === 'deep_space')
    }
    return nasaImages
  }

  const relevantImages = getRelevantImages()

  // Preload images for better performance
  const preloadImage = (url: string, id: string) => {
    if (loadedImages.has(id) || loadingImages.has(id) || imageCache.has(url)) {
      return Promise.resolve()
    }

    setLoadingImages(prev => new Set(prev).add(id))

    return new Promise<void>((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      
      img.onload = () => {
        setImageCache(prev => new Map(prev).set(url, img))
        setLoadedImages(prev => new Set(prev).add(id))
        setLoadingImages(prev => {
          const newSet = new Set(prev)
          newSet.delete(id)
          return newSet
        })
        resolve()
      }
      
      img.onerror = () => {
        setLoadingImages(prev => {
          const newSet = new Set(prev)
          newSet.delete(id)
          return newSet
        })
        reject()
      }
      
      img.src = url
    })
  }

  // Preload visible images on mount and when images change
  React.useEffect(() => {
    // Preload first 3 images immediately (all resolutions)
    relevantImages.slice(0, 3).forEach(image => {
      preloadImage(image.thumbnail, `thumb_${image.id}`)
      preloadImage(image.url, `url_${image.id}`)
    })

    // Preload remaining images with delay
    const timer = setTimeout(() => {
      relevantImages.slice(3).forEach((image, index) => {
        setTimeout(() => {
          preloadImage(image.thumbnail, `thumb_${image.id}`)
          preloadImage(image.url, `url_${image.id}`)
        }, index * 200) // Stagger loading
      })
    }, 500)

    return () => clearTimeout(timer)
  }, [relevantImages])

  // Auto-select first image if none selected
  React.useEffect(() => {
    if (!selectedImage && relevantImages.length > 0) {
      setSelectedImage(relevantImages[0])
    }
  }, [relevantImages, selectedImage])

  // Reset zoom when image changes
  React.useEffect(() => {
    setZoomLevel(1)
    setPanX(0)
    setPanY(0)
    setCurrentResolution('url')
    setResolutionLoading(null)
  }, [selectedImage])

  // Progressive resolution loading based on zoom level
  React.useEffect(() => {
    if (!selectedImage) return

    const loadHigherResolution = async () => {
      let targetResolution: 'url' | 'highRes' | 'ultraRes' = 'url'
      let targetUrl = selectedImage.url

      // Determine required resolution based on zoom level
      if (zoomLevel >= 3 && selectedImage.ultraRes) {
        targetResolution = 'ultraRes'
        targetUrl = selectedImage.ultraRes
      } else if (zoomLevel >= 1.5 && selectedImage.highRes) {
        targetResolution = 'highRes'
        targetUrl = selectedImage.highRes
      }

      // Only load if we need higher resolution than current
      if (targetResolution !== currentResolution && !loadedImages.has(`${targetResolution}_${selectedImage.id}`)) {
        setResolutionLoading(targetResolution)
        
        try {
          await preloadImage(targetUrl, `${targetResolution}_${selectedImage.id}`)
          setCurrentResolution(targetResolution)
          setResolutionLoading(null)
        } catch (error) {
          console.warn(`Failed to load ${targetResolution} for ${selectedImage.id}`)
          setResolutionLoading(null)
        }
      }
    }

    // Debounce resolution loading to avoid excessive requests
    const timer = setTimeout(loadHigherResolution, 300)
    return () => clearTimeout(timer)
  }, [zoomLevel, selectedImage, currentResolution, loadedImages])

  // Get the best available image URL for current zoom level
  const getBestImageUrl = () => {
    if (!selectedImage) return ''
    
    // Return the highest resolution that's loaded
    if (loadedImages.has(`ultraRes_${selectedImage.id}`) && selectedImage.ultraRes) {
      return selectedImage.ultraRes
    } else if (loadedImages.has(`highRes_${selectedImage.id}`) && selectedImage.highRes) {
      return selectedImage.highRes
    } else if (loadedImages.has(`url_${selectedImage.id}`)) {
      return selectedImage.url
    }
    
    return selectedImage.url
  }

  // Zoom functions
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev * 1.5, 5)) // Max 5x zoom
  }

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev / 1.5, 0.5)) // Min 0.5x zoom
  }

  const handleZoomReset = () => {
    setZoomLevel(1)
    setPanX(0)
    setPanY(0)
  }

  // Pan functions
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel > 1) {
      setIsDragging(true)
      setDragStart({ x: e.clientX - panX, y: e.clientY - panY })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoomLevel > 1) {
      setPanX(e.clientX - dragStart.x)
      setPanY(e.clientY - dragStart.y)
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? 0.9 : 1.1
    setZoomLevel(prev => Math.max(0.5, Math.min(5, prev * delta)))
  }

  // Get image sharpening filter based on zoom level
  const getImageFilter = () => {
    if (zoomLevel > 2) {
      return 'contrast(1.1) saturate(1.1) unsharp-mask(1px 1px 0.5)'
    } else if (zoomLevel > 1.5) {
      return 'contrast(1.05) saturate(1.05)'
    }
    return 'none'
  }

  // Keyboard shortcuts for zoom
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImage) {
        switch (e.key) {
          case '+':
          case '=':
            e.preventDefault()
            handleZoomIn()
            break
          case '-':
            e.preventDefault()
            handleZoomOut()
            break
          case '0':
            e.preventDefault()
            handleZoomReset()
            break
          case 'ArrowLeft':
            if (zoomLevel > 1) {
              e.preventDefault()
              setPanX(prev => prev + 50)
            }
            break
          case 'ArrowRight':
            if (zoomLevel > 1) {
              e.preventDefault()
              setPanX(prev => prev - 50)
            }
            break
          case 'ArrowUp':
            if (zoomLevel > 1) {
              e.preventDefault()
              setPanY(prev => prev + 50)
            }
            break
          case 'ArrowDown':
            if (zoomLevel > 1) {
              e.preventDefault()
              setPanY(prev => prev - 50)
            }
            break
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedImage, zoomLevel])

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      // Clear image cache to free memory
      setImageCache(new Map())
      setLoadedImages(new Set())
      setLoadingImages(new Set())
    }
  }, [])

  return (
    <div className="h-full w-full flex overflow-hidden">
      {/* Image Thumbnails - fixed width, scrollable */}
      <div className="w-44 bg-gray-800 border-r border-gray-700 flex flex-col flex-shrink-0">
        <div className="p-2 border-b border-gray-700 flex-shrink-0">
          <h3 className="text-sm font-semibold text-white truncate">
            {selectedObject ? `${selectedObject}` : 'Gallery'}
          </h3>
          <p className="text-xs text-gray-400">{relevantImages.length} images</p>
        </div>
        
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="p-2 space-y-2">
            {relevantImages.map((image, index) => {
              const isLoaded = loadedImages.has(`thumb_${image.id}`)
              const isLoading = loadingImages.has(`thumb_${image.id}`)
              
              return (
                <div
                  key={image.id}
                  onClick={() => setSelectedImage(image)}
                  onMouseEnter={() => {
                    // Prefetch all resolution levels on hover
                    if (!loadedImages.has(`url_${image.id}`) && !loadingImages.has(`url_${image.id}`)) {
                      preloadImage(image.url, `url_${image.id}`)
                    }
                    // Also prefetch high-res if available
                    if (image.highRes && !loadedImages.has(`highRes_${image.id}`) && !loadingImages.has(`highRes_${image.id}`)) {
                      setTimeout(() => preloadImage(image.highRes!, `highRes_${image.id}`), 100)
                    }
                  }}
                  className={`cursor-pointer rounded overflow-hidden border transition-all duration-200 ${
                    selectedImage?.id === image.id ? 'border-blue-500 shadow-lg' : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <div className="w-full h-16 bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center relative overflow-hidden">
                    {/* Loading indicator */}
                    {isLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
                        <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                      </div>
                    )}
                    
                    {/* Optimized image with lazy loading */}
                    <img
                      src={image.thumbnail}
                      alt={image.title}
                      loading={index > 2 ? 'lazy' : 'eager'} // Lazy load images after first 3
                      className={`w-full h-full object-cover absolute inset-0 transition-opacity duration-300 ${
                        isLoaded ? 'opacity-100' : 'opacity-0'
                      }`}
                      onLoad={(e) => {
                        const parent = e.currentTarget.parentElement
                        if (parent) {
                          parent.style.background = 'none'
                        }
                        setLoadedImages(prev => new Set(prev).add(`thumb_${image.id}`))
                      }}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                        setLoadingImages(prev => {
                          const newSet = new Set(prev)
                          newSet.delete(`thumb_${image.id}`)
                          return newSet
                        })
                      }}
                    />
                    

                  </div>
                  
                  <div className="p-1">
                    <p className="text-xs font-medium text-white truncate">{image.telescope}</p>
                    <p className="text-xs text-gray-400 truncate">{image.wavelength}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Main Image Display - constrained to remaining space */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden">
        {selectedImage ? (
          <>
            <div className="flex-1 relative bg-black min-h-0 overflow-hidden">
              {/* Zoom Controls */}
              <div className="absolute top-2 right-2 z-30 bg-gray-900 bg-opacity-90 rounded-lg p-2 flex flex-col space-y-1">
                <button
                  onClick={handleZoomIn}
                  className="px-2 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 text-xs"
                  title="Zoom In"
                >
                  +
                </button>
                <button
                  onClick={handleZoomOut}
                  className="px-2 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 text-xs"
                  title="Zoom Out"
                >
                  -
                </button>
                <button
                  onClick={handleZoomReset}
                  className="px-2 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 text-xs"
                  title="Reset Zoom"
                >
                  ⌂
                </button>
              </div>

              {/* Zoom Level & Resolution Indicator */}
              <div className="absolute top-2 left-2 z-30 bg-gray-900 bg-opacity-90 rounded px-2 py-1">
                <div className="text-white text-xs">
                  <div>{Math.round(zoomLevel * 100)}%</div>
                  <div className="text-xs">
                    {resolutionLoading ? (
                      <span className="text-yellow-400">Loading...</span>
                    ) : (
                      <>
                        {loadedImages.has(`ultraRes_${selectedImage?.id}`) && zoomLevel >= 3 && (
                          <span className="text-purple-400">Ultra HD</span>
                        )}
                        {loadedImages.has(`highRes_${selectedImage?.id}`) && zoomLevel >= 1.5 && zoomLevel < 3 && (
                          <span className="text-blue-400">High Res</span>
                        )}
                        {zoomLevel < 1.5 && (
                          <span className="text-green-400">Standard</span>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div 
                ref={imageContainerRef}
                className="w-full h-full bg-black flex items-center justify-center relative overflow-hidden"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onWheel={handleWheel}
                style={{ cursor: zoomLevel > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
              >
                {/* Loading state for main image */}
                {loadingImages.has(`full_${selectedImage.id}`) && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 z-20">
                    <div className="text-center text-white">
                      <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                      <p className="text-sm">Loading high-resolution image...</p>
                    </div>
                  </div>
                )}
                
                {/* Progressive resolution loading - all images perfectly centered */}
                {/* Thumbnail layer (lowest quality, loads first) */}
                {loadedImages.has(`thumb_${selectedImage.id}`) && (
                  <img
                    src={selectedImage.thumbnail}
                    alt={selectedImage.title}
                    className="absolute top-1/2 left-1/2 max-w-full max-h-full object-contain z-5"
                    style={{
                      transform: `translate(-50%, -50%) scale(${zoomLevel}) translate(${panX / zoomLevel}px, ${panY / zoomLevel}px)`,
                      filter: 'blur(1px)',
                      opacity: loadedImages.has(`url_${selectedImage.id}`) ? 0 : 1
                    }}
                  />
                )}
                
                {/* Standard resolution layer */}
                {loadedImages.has(`url_${selectedImage.id}`) && (
                  <img
                    src={selectedImage.url}
                    alt={selectedImage.title}
                    className="absolute top-1/2 left-1/2 max-w-full max-h-full object-contain z-10"
                    style={{
                      transform: `translate(-50%, -50%) scale(${zoomLevel}) translate(${panX / zoomLevel}px, ${panY / zoomLevel}px)`,
                      filter: getImageFilter(),
                      imageRendering: zoomLevel > 2 ? 'crisp-edges' : 'auto',
                      opacity: (loadedImages.has(`highRes_${selectedImage.id}`) && zoomLevel >= 1.5) ? 0 : 1
                    }}
                  />
                )}
                
                {/* High resolution layer (loads at 1.5x zoom) */}
                {selectedImage.highRes && loadedImages.has(`highRes_${selectedImage.id}`) && (
                  <img
                    src={selectedImage.highRes}
                    alt={selectedImage.title}
                    className="absolute top-1/2 left-1/2 max-w-full max-h-full object-contain z-15"
                    style={{
                      transform: `translate(-50%, -50%) scale(${zoomLevel}) translate(${panX / zoomLevel}px, ${panY / zoomLevel}px)`,
                      filter: getImageFilter(),
                      imageRendering: zoomLevel > 2 ? 'crisp-edges' : 'auto',
                      opacity: (loadedImages.has(`ultraRes_${selectedImage.id}`) && zoomLevel >= 3) ? 0 : 1
                    }}
                  />
                )}
                
                {/* Ultra high resolution layer (loads at 3x zoom) */}
                {selectedImage.ultraRes && loadedImages.has(`ultraRes_${selectedImage.id}`) && (
                  <img
                    src={selectedImage.ultraRes}
                    alt={selectedImage.title}
                    className="absolute top-1/2 left-1/2 max-w-full max-h-full object-contain z-20"
                    style={{
                      transform: `translate(-50%, -50%) scale(${zoomLevel}) translate(${panX / zoomLevel}px, ${panY / zoomLevel}px)`,
                      filter: getImageFilter(),
                      imageRendering: 'crisp-edges'
                    }}
                  />
                )}
                
                {/* Resolution loading indicator */}
                {resolutionLoading && (
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-25 bg-black bg-opacity-75 rounded-lg p-3">
                    <div className="flex items-center space-x-2 text-white">
                      <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                      <span className="text-sm">Loading {resolutionLoading === 'ultraRes' ? 'Ultra HD' : 'High Res'}...</span>
                    </div>
                  </div>
                )}
                
                {/* Simple loading indicator only */}
                {!loadedImages.has(`url_${selectedImage.id}`) && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-spin h-8 w-8 border-4 border-white border-t-transparent rounded-full"></div>
                  </div>
                )}

                {/* Pan instructions */}
                {zoomLevel > 1 && (
                  <div className="absolute bottom-2 left-2 bg-gray-900 bg-opacity-90 rounded px-2 py-1">
                    <span className="text-white text-xs">Click and drag to pan</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-gray-800 border-t border-gray-700 p-2 flex-shrink-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-bold text-white truncate flex-1 mr-2">{selectedImage.title}</h3>
                <div className="flex items-center space-x-2">
                  {loadedImages.has(`full_${selectedImage.id}`) && (
                    <span className="text-green-400 text-xs">✓ HD</span>
                  )}
                  {loadingImages.has(`full_${selectedImage.id}`) && (
                    <span className="text-yellow-400 text-xs">⏳ Loading</span>
                  )}
                  {zoomLevel > 1 && (
                    <span className="text-purple-400 text-xs">🔍 {Math.round(zoomLevel * 100)}%</span>
                  )}
                  <span className="text-blue-400 text-xs">NASA</span>
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-2 text-xs">
                <div>
                  <p className="text-gray-400">Telescope</p>
                  <p className="text-white font-medium truncate">{selectedImage.telescope}</p>
                </div>
                <div>
                  <p className="text-gray-400">Wavelength</p>
                  <p className="text-white font-medium truncate">{selectedImage.wavelength}</p>
                </div>
                <div>
                  <p className="text-gray-400">Resolution</p>
                  <p className="text-white font-medium text-xs">
                    {resolutionLoading ? (
                      <span className="text-yellow-400">Loading...</span>
                    ) : (
                      <>
                        {loadedImages.has(`ultraRes_${selectedImage.id}`) && zoomLevel >= 3 ? (
                          <span className="text-purple-400">Ultra HD</span>
                        ) : loadedImages.has(`highRes_${selectedImage.id}`) && zoomLevel >= 1.5 ? (
                          <span className="text-blue-400">High Res</span>
                        ) : (
                          <span className="text-green-400">Standard</span>
                        )}
                      </>
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Cache</p>
                  <p className="text-white font-medium">{loadedImages.size}/{relevantImages.length * 2}</p>
                </div>
              </div>

              {/* Zoom instructions */}
              <div className="mt-1 text-xs text-gray-400">
                Mouse wheel to zoom • Click +/- buttons • Drag to pan when zoomed
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-black">
            <div className="text-center text-gray-500">
              <p className="text-sm">Select an image to view</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const BulletproofApp: React.FC = () => {
  return <SimpleExplorePage />
}

export default BulletproofApp