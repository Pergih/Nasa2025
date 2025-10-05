import React, { useState, useEffect } from 'react'
import { celestialAPI } from '@/services/api'
import { imageAPI, SpaceImage } from '@/services/imageAPI'
import { Image as ImageIcon, ChevronLeft, ChevronRight, Eye, EyeOff } from 'lucide-react'
import SpaceTileMap from '@/components/map/SpaceTileMap'
import PerformanceMonitor from '@/components/PerformanceMonitor'

const ExplorePage: React.FC = () => {
  const [apiConnected, setApiConnected] = useState<boolean | null>(null)
  const [celestialObjects, setCelestialObjects] = useState<any[]>([])
  const [selectedObject, setSelectedObject] = useState<any>(null)
  const [objectImages, setObjectImages] = useState<SpaceImage[]>([])
  const [selectedImage, setSelectedImage] = useState<SpaceImage | null>(null)
  const [viewMode, setViewMode] = useState<'map' | 'gallery'>('map')
  const [loading, setLoading] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [showUI, setShowUI] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)

        // Test API connection
        const healthy = await celestialAPI.healthCheck()
        setApiConnected(healthy)

        if (healthy) {
          try {
            // Load celestial objects using region search instead of empty search
            const objects = await celestialAPI.getObjectsInRegion(-180, 180, -90, 90, undefined, 20)

            if (objects && objects.length > 0) {
              setCelestialObjects(objects)

              // Auto-select first object and load its images
              const firstObject = objects[0]
              setSelectedObject(firstObject)
              const images = await imageAPI.getObjectImages(firstObject.name, firstObject.ra, firstObject.dec)
              setObjectImages(images)
              if (images.length > 0) {
                setSelectedImage(images[0])
              }
            } else {
              // No objects returned, use fallback
              await loadFallbackData()
            }
          } catch (apiError) {
            console.error('Region API failed, trying individual searches:', apiError)
            // Try searching for popular objects individually
            try {
              const popularSearches = ['sirius', 'vega', 'andromeda']
              const searchResults = []

              for (const term of popularSearches) {
                try {
                  const results = await celestialAPI.search(term, 1)
                  if (results.length > 0) {
                    searchResults.push(results[0])
                  }
                } catch (searchError) {
                  // Search failed for this term
                }
              }

              if (searchResults.length > 0) {
                setCelestialObjects(searchResults)
                setSelectedObject(searchResults[0])
                const images = await imageAPI.getObjectImages(searchResults[0].name, searchResults[0].ra, searchResults[0].dec)
                setObjectImages(images)
                if (images.length > 0) {
                  setSelectedImage(images[0])
                }
              } else {
                await loadFallbackData()
              }
            } catch (searchError) {
              console.error('All API calls failed, using fallback data:', searchError)
              await loadFallbackData()
            }
          }
        } else {
          // Load fallback data when API is not available
          await loadFallbackData()
        }
      } catch (error) {
        console.error('Failed to load data:', error)
        setApiConnected(false)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const loadFallbackData = async () => {
    const fallbackObjects = [
      { id: 'sirius', name: 'Sirius', type: 'star', ra: 101.287, dec: -16.716, constellation: 'Canis Major', magnitude: -1.46 },
      { id: 'vega', name: 'Vega', type: 'star', ra: 279.235, dec: 38.784, constellation: 'Lyra', magnitude: 0.03 },
      { id: 'andromeda', name: 'Andromeda Galaxy', type: 'galaxy', ra: 10.685, dec: 41.269, constellation: 'Andromeda', magnitude: 3.4 },
      { id: 'orion_nebula', name: 'Orion Nebula', type: 'nebula', ra: 83.822, dec: -5.391, constellation: 'Orion', magnitude: 4.0 },
      { id: 'moon', name: 'Moon', type: 'satellite', ra: 180.0, dec: 0.0, magnitude: -12.6, distance: 0.00257 },
      { id: 'mars', name: 'Mars', type: 'planet', ra: 200.0, dec: -15.0, magnitude: -2.9, distance: 0.52 },
      { id: 'hubble', name: 'Hubble Space Telescope', type: 'satellite', ra: 150.0, dec: 30.0, status: 'active' },
      { id: 'proxima_b', name: 'Proxima Centauri b', type: 'exoplanet', ra: 217.429, dec: -62.679, habitable_zone: true }
    ]
    setCelestialObjects(fallbackObjects)
    setSelectedObject(fallbackObjects[0])

    const images = await imageAPI.getObjectImages(fallbackObjects[0].name, fallbackObjects[0].ra, fallbackObjects[0].dec)
    setObjectImages(images)
    if (images.length > 0) {
      setSelectedImage(images[0])
    }
  }

  const handleSearch = async (query: string) => {
    if (query.length > 2) {
      try {
        const results = await celestialAPI.search(query, 10)
        setCelestialObjects(results)
      } catch (error) {
        console.error('Search failed:', error)
      }
    } else if (query.length === 0) {
      // Reset to all objects when search is cleared
      try {
        const objects = await celestialAPI.getObjectsInRegion(-180, 180, -90, 90, undefined, 20)
        setCelestialObjects(objects)
      } catch (error) {
        console.error('Failed to reload objects:', error)
      }
    }
  }

  const handleObjectSelect = async (object: any) => {
    setSelectedObject(object)
    setViewMode('gallery')

    // Load images for this object
    try {
      const images = await imageAPI.getObjectImages(object.name, object.ra, object.dec)
      setObjectImages(images)
      if (images.length > 0) {
        setSelectedImage(images[0])
      }
    } catch (error) {
      console.error('Failed to load object images:', error)
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return dateString
    }
  }

  // Show loading screen while data loads
  if (loading) {
    return (
      <div className="h-screen w-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold mb-2">🌌 StellarEye</h2>
          <p className="text-lg">Loading NASA space data...</p>
          <p className="text-sm text-gray-400 mt-2">Connecting to astronomical databases</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen w-screen bg-gray-900 flex flex-col overflow-hidden">
      {/* Simple Header - Only when UI is shown */}
      {showUI && (
        <div className="bg-gray-900 bg-opacity-95 backdrop-blur-sm border-b border-gray-700 flex-shrink-0 z-40">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-white">🌌 StellarEye</h1>
              <div className={`px-3 py-1 rounded-full text-sm ${apiConnected === null ? 'bg-yellow-600' :
                apiConnected ? 'bg-green-600' : 'bg-red-600'
                }`}>
                {apiConnected === null ? '🔄 Loading...' :
                  apiConnected ? '✅ Connected' : '❌ Offline'}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Single search bar */}
              <input
                type="text"
                placeholder="Search space..."
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
                onChange={(e) => handleSearch(e.target.value)}
              />

              {/* View toggle */}
              <div className="flex items-center bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('map')}
                  className={`px-3 py-1 rounded text-sm transition-colors ${viewMode === 'map' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'
                    }`}
                >
                  Map
                </button>
                <button
                  onClick={() => setViewMode('gallery')}
                  className={`px-3 py-1 rounded text-sm transition-colors ${viewMode === 'gallery' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'
                    }`}
                >
                  Gallery
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Collapsible Object List Sidebar - Fixed viewport height */}
        <div className={`${sidebarCollapsed ? 'w-0' : 'w-80'} transition-all duration-300 bg-gray-800 border-r border-gray-700 overflow-hidden flex-shrink-0 h-full`}>
          <div className="w-80 h-full flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-700 flex-shrink-0">
              <h2 className="text-lg font-semibold text-white">
                Objects ({celestialObjects.length})
              </h2>
              <button
                onClick={() => setSidebarCollapsed(true)}
                className="text-gray-400 hover:text-white p-1 rounded"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 scrollable-area min-h-0">
              <div className="space-y-2 pr-2">
                {celestialObjects.map((obj, index) => (
                  <div
                    key={obj.id || index}
                    onClick={() => handleObjectSelect(obj)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${selectedObject?.id === obj.id ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
                      }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl flex-shrink-0">
                        {obj.type === 'star' ? '⭐' :
                          obj.type === 'galaxy' ? '🌌' :
                            obj.type === 'satellite' ? '🛰️' :
                              obj.type === 'exoplanet' ? '🪐' :
                                obj.type === 'planet' ? '🪐' : '✨'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white truncate">{obj.name}</p>
                        <p className="text-sm text-gray-300 capitalize">{obj.type}</p>
                        {obj.constellation && (
                          <p className="text-xs text-gray-400 truncate">{obj.constellation}</p>
                        )}
                        {obj.magnitude !== undefined && (
                          <p className="text-xs text-yellow-400">Mag: {obj.magnitude}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Toggle Button (when collapsed) */}
        {sidebarCollapsed && (
          <button
            onClick={() => setSidebarCollapsed(false)}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 z-20 bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-r-lg border border-gray-600 transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        )}

        {/* Main Display Area */}
        <div className="flex-1 flex flex-col relative">
          {viewMode === 'map' ? (
            /* Interactive Space Map */
            <div className="flex-1 relative">
              <SpaceTileMap
                celestialObjects={celestialObjects}
                onObjectClick={handleObjectSelect}
                selectedObject={selectedObject}
              />

              {/* UI Toggle */}
              <button
                onClick={() => setShowUI(!showUI)}
                className="absolute top-4 right-4 z-50 bg-gray-900 bg-opacity-80 hover:bg-opacity-100 text-white p-3 rounded-lg transition-all"
                title={showUI ? 'Hide UI' : 'Show UI'}
              >
                {showUI ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>

              {/* Selected Object Info Panel */}
              {showUI && selectedObject && (
                <div className="absolute bottom-4 left-4 right-4 bg-gray-900 bg-opacity-95 text-white p-4 rounded-lg max-w-md mx-auto backdrop-blur-sm border border-gray-700 z-40">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-lg flex items-center">
                      <div className="text-2xl mr-2">
                        {selectedObject.type === 'star' ? '⭐' :
                          selectedObject.type === 'galaxy' ? '🌌' :
                            selectedObject.type === 'satellite' ? '🛰️' :
                              selectedObject.type === 'exoplanet' ? '🪐' :
                                selectedObject.type === 'nebula' ? '🌸' : '✨'}
                      </div>
                      {selectedObject.name}
                    </h3>
                    <button
                      onClick={() => setSelectedObject(null)}
                      className="text-gray-400 hover:text-white text-xl"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-300">Type: <span className="text-white capitalize">{selectedObject.type}</span></p>
                      {selectedObject.constellation && (
                        <p className="text-gray-300">Constellation: <span className="text-white">{selectedObject.constellation}</span></p>
                      )}
                    </div>
                    <div>
                      {selectedObject.magnitude !== undefined && (
                        <p className="text-gray-300">Magnitude: <span className="text-white">{selectedObject.magnitude}</span></p>
                      )}
                      {selectedObject.distance && (
                        <p className="text-gray-300">Distance: <span className="text-white">{selectedObject.distance} ly</span></p>
                      )}
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-gray-400">
                    RA: {selectedObject.ra?.toFixed(2)}° • Dec: {selectedObject.dec?.toFixed(2)}°
                  </div>
                  <button
                    onClick={() => setViewMode('gallery')}
                    className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-sm transition-colors"
                  >
                    View Telescope Images
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Image Gallery Mode - Fixed viewport height */
            <div className="flex-1 flex overflow-hidden min-h-0">
              {/* Image Thumbnails - Fixed height scrolling */}
              <div className="w-64 bg-gray-800 border-r border-gray-700 flex-shrink-0 flex flex-col h-full">
                <div className="p-4 border-b border-gray-700 flex-shrink-0" style={{ maxHeight: '30vh' }}>
                  <div className="overflow-y-auto scrollable-area h-full">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {selectedObject ? `${selectedObject.name} Images` : 'Featured Images'}
                    </h3>
                    {selectedObject && (
                      <div className="text-xs text-gray-400 space-y-1 pr-2">
                      {/* Special links for Moon */}
                      {selectedObject.name.toLowerCase().includes('moon') && (
                        <>
                          <a
                            href="https://pds-imaging.jpl.nasa.gov/volumes/lro.html"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-blue-400 hover:text-blue-300 underline"
                          >
                            🌙 Lunar Reconnaissance Orbiter
                          </a>
                          <a
                            href="https://quickmap.lroc.asu.edu/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-blue-400 hover:text-blue-300 underline"
                          >
                            🗺️ LROC QuickMap
                          </a>
                        </>
                      )}

                      {/* Special links for Mars */}
                      {selectedObject.name.toLowerCase().includes('mars') && (
                        <>
                          <a
                            href="https://pds-imaging.jpl.nasa.gov/volumes/mro.html"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-blue-400 hover:text-blue-300 underline"
                          >
                            🔴 Mars Reconnaissance Orbiter
                          </a>
                          <a
                            href="https://mars.nasa.gov/maps/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-blue-400 hover:text-blue-300 underline"
                          >
                            🗺️ Mars Trek
                          </a>
                        </>
                      )}

                      {/* General NASA links */}
                      <a
                        href={`https://pds-imaging.jpl.nasa.gov/search/?q=${encodeURIComponent(selectedObject.name)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-blue-400 hover:text-blue-300 underline"
                      >
                        🔗 NASA PDS Imaging
                      </a>
                      <a
                        href={`https://data.nasa.gov/search?q=${encodeURIComponent(selectedObject.name)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-blue-400 hover:text-blue-300 underline"
                      >
                        🔗 NASA Data Portal
                      </a>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 scrollable-area min-h-0">
                  <div className="space-y-2 pr-2">
                    {(selectedObject ? objectImages : []).map((image) => (
                      <div
                        key={image.id}
                        onClick={() => setSelectedImage(image)}
                        className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-colors ${selectedImage?.id === image.id ? 'border-blue-500' : 'border-gray-600 hover:border-gray-500'
                          }`}
                      >
                        <img
                          src={image.thumbnail || image.url}
                          alt={image.title}
                          className="w-full h-32 object-cover"
                          onError={(e) => {
                            // Use verified working NASA fallback images
                            const fallbacks = [
                              'https://stsci-opo.org/STScI-01G7JGDHYJ1K28YMHKXKMT2T5V.jpg',
                              'https://stsci-opo.org/STScI-01EVT0XPZQ2KGJDES0JBHXRBZZ.jpg',
                              'https://mars.nasa.gov/system/resources/list_files/25042_PIA24264-320.jpg',
                              'https://solarsystem.nasa.gov/system/resources/list_files/15152_PIA21046.jpg'
                            ]
                            const randomFallback = fallbacks[Math.floor(Math.random() * fallbacks.length)]
                            e.currentTarget.src = randomFallback
                          }}
                        />
                        <div className="p-2">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-medium text-white truncate flex-1">{image.telescope}</p>
                            {image.stitched_tiles && (
                              <span className="text-xs bg-purple-600 text-white px-1 rounded ml-1 flex-shrink-0">MOSAIC</span>
                            )}
                            {image.file_size && parseFloat(image.file_size.replace(/[^\d.]/g, '')) > 1 && (
                              <span className="text-xs bg-blue-600 text-white px-1 rounded ml-1 flex-shrink-0">HD</span>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 truncate">{image.wavelength}</p>
                          {image.resolution && (
                            <p className="text-xs text-green-400 truncate">{image.resolution}</p>
                          )}
                          {image.file_size && (
                            <p className="text-xs text-orange-400 truncate">{image.file_size}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Main Image Display - Fixed viewport height */}
              <div className="flex-1 flex flex-col min-w-0 h-full">
                {selectedImage ? (
                  <div className="flex-1 flex flex-col min-h-0">
                    {/* Large Image - Constrained height */}
                    <div className="flex-1 relative bg-black min-h-0" style={{ minHeight: '40vh' }}>
                      <img
                        src={selectedImage.url}
                        alt={selectedImage.title}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          // Use verified high-quality NASA fallback for main image display
                          const highResFallbacks = [
                            'https://stsci-opo.org/STScI-01G7JGDHYJ1K28YMHKXKMT2T5V.png',
                            'https://stsci-opo.org/STScI-01EVT0XPZQ2KGJDES0JBHXRBZZ.png',
                            'https://mars.nasa.gov/system/resources/detail_files/25042_PIA24264-web.jpg',
                            'https://chandra.harvard.edu/photo/2019/m87/m87_comp.jpg'
                          ]
                          const randomFallback = highResFallbacks[Math.floor(Math.random() * highResFallbacks.length)]
                          e.currentTarget.src = randomFallback
                        }}
                      />
                    </div>

                    {/* Constrained Scrollable Image Info */}
                    <div className="bg-gray-800 border-t border-gray-700 flex-shrink-0" style={{ height: '35vh', maxHeight: '300px' }}>
                      <div className="h-full overflow-y-auto overflow-x-hidden p-4 pr-2 scrollable-area">
                        <div className="pr-2">
                          <div className="flex items-start justify-between mb-2">
                            <h2 className="text-xl font-bold text-white flex-1 mr-4">{selectedImage.title}</h2>
                            <div className="flex space-x-2 flex-shrink-0">
                              <a
                                href={selectedImage.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300 text-sm underline"
                              >
                                Full Size
                              </a>
                              <a
                                href={`https://hubblesite.org/contents/media/images?keyword=${encodeURIComponent(selectedObject?.name || '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300 text-sm underline"
                              >
                                Archive
                              </a>
                            </div>
                          </div>

                          {/* Quality indicators */}
                          <div className="flex space-x-2 mb-3">
                            {selectedImage.stitched_tiles && (
                              <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded">MOSAIC</span>
                            )}
                            {selectedImage.file_size && parseFloat(selectedImage.file_size.replace(/[^\d.]/g, '')) > 1 && (
                              <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">HD</span>
                            )}
                            {selectedImage.processing_level && (
                              <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">{selectedImage.processing_level}</span>
                            )}
                          </div>

                          <p className="text-gray-300 text-sm mb-4">{selectedImage.description}</p>

                          <div className="grid grid-cols-2 gap-4 text-xs mb-4">
                            <div className="space-y-2">
                              <div>
                                <p className="text-gray-400">Telescope</p>
                                <p className="text-white font-medium">{selectedImage.telescope}</p>
                              </div>
                              <div>
                                <p className="text-gray-400">Wavelength</p>
                                <p className="text-white font-medium">{selectedImage.wavelength}</p>
                              </div>
                              <div>
                                <p className="text-gray-400">Observed</p>
                                <p className="text-white font-medium">{formatDate(selectedImage.observation_date)}</p>
                              </div>
                            </div>
                            <div className="space-y-2">
                              {selectedImage.resolution && (
                                <div>
                                  <p className="text-gray-400">Resolution</p>
                                  <p className="text-green-400 font-medium">{selectedImage.resolution}</p>
                                </div>
                              )}
                              {selectedImage.file_size && (
                                <div>
                                  <p className="text-gray-400">File Size</p>
                                  <p className="text-orange-400 font-medium">{selectedImage.file_size}</p>
                                </div>
                              )}
                              {selectedImage.exposure_time && (
                                <div>
                                  <p className="text-gray-400">Exposure</p>
                                  <p className="text-yellow-400 font-medium">{selectedImage.exposure_time}</p>
                                </div>
                              )}
                            </div>
                          </div>

                          {selectedImage.filters && (
                            <div className="mb-4">
                              <p className="text-gray-400 text-xs mb-2">Filters Used</p>
                              <div className="flex flex-wrap gap-1">
                                {selectedImage.filters.map((filter, index) => (
                                  <span key={index} className="px-2 py-1 bg-blue-600 text-white text-xs rounded">
                                    {filter}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="text-xs text-gray-400 border-t border-gray-700 pt-3 space-y-1">
                            <p><span className="text-gray-300 font-medium">Coordinates:</span> RA {selectedImage.coordinates.ra.toFixed(2)}°, Dec {selectedImage.coordinates.dec.toFixed(2)}°</p>
                            {selectedImage.field_of_view && <p><span className="text-gray-300 font-medium">Field of View:</span> {selectedImage.field_of_view}</p>}
                            {selectedImage.pds_id && <p><span className="text-gray-300 font-medium">PDS ID:</span> {selectedImage.pds_id}</p>}
                            {selectedImage.mission && <p><span className="text-gray-300 font-medium">Mission:</span> {selectedImage.mission}</p>}
                            {selectedImage.instrument && <p><span className="text-gray-300 font-medium">Instrument:</span> {selectedImage.instrument}</p>}
                            {selectedImage.stitched_tiles && (
                              <div className="mt-2">
                                <p className="font-medium text-gray-300 mb-1">Stitched Components:</p>
                                <div className="text-xs bg-gray-700 p-2 rounded max-h-20 overflow-y-auto">
                                  {selectedImage.stitched_tiles.map((tile, index) => (
                                    <p key={index} className="mb-1">{tile}</p>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center text-white">
                      <ImageIcon className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                      <p className="text-xl">Select an object to view images</p>
                      <p className="text-sm text-gray-400 mt-2">Choose from {objectImages.length} available images</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Performance Monitor */}
      <PerformanceMonitor />
    </div>
  )
}

export default ExplorePage