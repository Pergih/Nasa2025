import React, { useState, useEffect } from 'react'
import { celestialAPI } from '@/services/api'
import { imageAPI, SpaceImage } from '@/services/imageAPI'
import { Clock, Layers, MapPin, Image as ImageIcon, Map, Grid, Satellite } from 'lucide-react'

const ExplorePage: React.FC = () => {
  const [apiConnected, setApiConnected] = useState<boolean | null>(null)
  const [celestialObjects, setCelestialObjects] = useState<any[]>([])
  const [selectedObject, setSelectedObject] = useState<any>(null)
  const [objectImages, setObjectImages] = useState<SpaceImage[]>([])
  const [selectedImage, setSelectedImage] = useState<SpaceImage | null>(null)
  const [viewMode, setViewMode] = useState<'map' | 'gallery'>('map')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        
        // Test API connection
        const healthy = await celestialAPI.healthCheck()
        setApiConnected(healthy)
        
        if (healthy) {
          // Load celestial objects
          const objects = await celestialAPI.search('', 20)
          setCelestialObjects(objects)
          
          // Auto-select first object and load its images
          if (objects.length > 0) {
            const firstObject = objects[0]
            setSelectedObject(firstObject)
            const images = await imageAPI.getObjectImages(firstObject.name, firstObject.ra, firstObject.dec)
            setObjectImages(images)
            if (images.length > 0) {
              setSelectedImage(images[0])
            }
          }
        } else {
          // Load fallback data
          const fallbackObjects = [
            { id: 'sirius', name: 'Sirius', type: 'star', ra: 101.287, dec: -16.716, constellation: 'Canis Major', magnitude: -1.46 },
            { id: 'vega', name: 'Vega', type: 'star', ra: 279.235, dec: 38.784, constellation: 'Lyra', magnitude: 0.03 },
            { id: 'andromeda', name: 'Andromeda Galaxy', type: 'galaxy', ra: 10.685, dec: 41.269, constellation: 'Andromeda', magnitude: 3.4 }
          ]
          setCelestialObjects(fallbackObjects)
          setSelectedObject(fallbackObjects[0])
          
          const images = await imageAPI.getObjectImages(fallbackObjects[0].name, fallbackObjects[0].ra, fallbackObjects[0].dec)
          setObjectImages(images)
          if (images.length > 0) {
            setSelectedImage(images[0])
          }
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

  const handleSearch = async (query: string) => {
    if (query.length > 2) {
      try {
        const results = await celestialAPI.search(query, 10)
        setCelestialObjects(results)
      } catch (error) {
        console.error('Search failed:', error)
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
      <div className="h-full w-full bg-gray-900 flex items-center justify-center">
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
    <div className="h-full w-full bg-gray-900 flex flex-col">
      {/* Enhanced Header */}
      <div className="bg-gray-800 p-4 border-b border-gray-700">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-white">🌌 StellarEye</h1>
            <div className={`px-3 py-1 rounded-full text-sm ${
              apiConnected === null ? 'bg-yellow-600' : 
              apiConnected ? 'bg-green-600' : 'bg-red-600'
            }`}>
              {apiConnected === null ? '🔄 Connecting...' : 
               apiConnected ? '✅ NASA APIs Connected' : '❌ API Offline'}
            </div>
          </div>
          
          <div className="flex-1 max-w-md mx-8">
            <input
              type="text"
              placeholder="Search stars, galaxies, satellites..."
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center space-x-2 bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'map' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'
              }`}
            >
              <Map className="h-4 w-4 inline mr-1" />
              Map
            </button>
            <button
              onClick={() => setViewMode('gallery')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'gallery' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'
              }`}
            >
              <Grid className="h-4 w-4 inline mr-1" />
              Gallery
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Object List Sidebar */}
        <div className="w-80 bg-gray-800 border-r border-gray-700 overflow-y-auto">
          <div className="p-4">
            <h2 className="text-lg font-semibold text-white mb-4">
              Celestial Objects ({celestialObjects.length})
            </h2>
            <div className="space-y-2">
              {celestialObjects.map((obj, index) => (
                <div
                  key={obj.id || index}
                  onClick={() => handleObjectSelect(obj)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedObject?.id === obj.id ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">
                      {obj.type === 'star' ? '⭐' : 
                       obj.type === 'galaxy' ? '🌌' : 
                       obj.type === 'satellite' ? '🛰️' : 
                       obj.type === 'exoplanet' ? '🪐' : '✨'}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-white">{obj.name}</p>
                      <p className="text-sm text-gray-300 capitalize">{obj.type}</p>
                      {obj.constellation && (
                        <p className="text-xs text-gray-400">{obj.constellation}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Display Area */}
        <div className="flex-1 flex flex-col">
          {viewMode === 'map' ? (
            /* Interactive Sky Map */
            <div className="flex-1 relative bg-black">
              {selectedImage ? (
                <div className="relative h-full">
                  <img 
                    src={selectedImage.url} 
                    alt={selectedImage.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to a space background
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=1200&h=800&fit=crop'
                    }}
                  />
                  
                  {/* Overlay celestial objects */}
                  {celestialObjects.map((obj, index) => {
                    const x = ((obj.ra / 360) * 100) % 100
                    const y = ((90 - obj.dec) / 180) * 100
                    
                    return (
                      <div
                        key={obj.id || index}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                        style={{ left: `${x}%`, top: `${y}%` }}
                        onClick={() => handleObjectSelect(obj)}
                      >
                        <div className="relative group">
                          <div className={`w-3 h-3 rounded-full border-2 border-white ${
                            obj.type === 'star' ? 'bg-yellow-400' :
                            obj.type === 'galaxy' ? 'bg-purple-400' :
                            obj.type === 'satellite' ? 'bg-green-400' :
                            'bg-blue-400'
                          } animate-pulse`}></div>
                          
                          {/* Tooltip */}
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                            {obj.name}
                          </div>
                        </div>
                      </div>
                    )
                  })}

                  {/* Map Info Overlay */}
                  <div className="absolute top-4 right-4 bg-gray-900 bg-opacity-90 text-white p-4 rounded-lg max-w-sm">
                    <h3 className="font-bold mb-2 flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      {selectedImage.title}
                    </h3>
                    <div className="space-y-1 text-sm">
                      <p className="flex items-center">
                        <Satellite className="h-3 w-3 mr-2" />
                        {selectedImage.telescope}
                      </p>
                      <p className="flex items-center">
                        <Layers className="h-3 w-3 mr-2" />
                        {selectedImage.wavelength}
                      </p>
                      <p className="flex items-center">
                        <Clock className="h-3 w-3 mr-2" />
                        {formatDate(selectedImage.observation_date)}
                      </p>
                      {selectedImage.coordinates && (
                        <p className="text-xs text-gray-300">
                          RA: {selectedImage.coordinates.ra.toFixed(2)}° 
                          Dec: {selectedImage.coordinates.dec.toFixed(2)}°
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-white">
                    <div className="text-6xl mb-4">🌌</div>
                    <p className="text-xl">Loading space imagery...</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Image Gallery Mode */
            <div className="flex-1 flex">
              {/* Image Thumbnails */}
              <div className="w-64 bg-gray-800 border-r border-gray-700 overflow-y-auto">
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    {selectedObject ? `${selectedObject.name} Images` : 'Featured Images'}
                  </h3>
                  <div className="space-y-2">
                    {(selectedObject ? objectImages : []).map((image) => (
                      <div
                        key={image.id}
                        onClick={() => setSelectedImage(image)}
                        className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-colors ${
                          selectedImage?.id === image.id ? 'border-blue-500' : 'border-gray-600 hover:border-gray-500'
                        }`}
                      >
                        <img 
                          src={image.thumbnail || image.url} 
                          alt={image.title}
                          className="w-full h-32 object-cover"
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=300&h=200&fit=crop'
                          }}
                        />
                        <div className="p-2">
                          <p className="text-sm font-medium text-white truncate">{image.telescope}</p>
                          <p className="text-xs text-gray-400">{image.wavelength}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Main Image Display */}
              <div className="flex-1 flex flex-col">
                {selectedImage ? (
                  <>
                    {/* Large Image */}
                    <div className="flex-1 relative bg-black">
                      <img 
                        src={selectedImage.url} 
                        alt={selectedImage.title}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=1200&h=800&fit=crop'
                        }}
                      />
                    </div>

                    {/* Image Metadata */}
                    <div className="bg-gray-800 p-6 border-t border-gray-700">
                      <div className="max-w-4xl mx-auto">
                        <h2 className="text-2xl font-bold text-white mb-4">{selectedImage.title}</h2>
                        <p className="text-gray-300 mb-6">{selectedImage.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="space-y-3">
                            <h3 className="text-lg font-semibold text-white">Observation Details</h3>
                            <div className="space-y-2 text-sm">
                              <p className="flex items-center text-gray-300">
                                <Satellite className="h-4 w-4 mr-2" />
                                <span className="font-medium">Telescope:</span>
                                <span className="ml-2">{selectedImage.telescope}</span>
                              </p>
                              <p className="flex items-center text-gray-300">
                                <Layers className="h-4 w-4 mr-2" />
                                <span className="font-medium">Wavelength:</span>
                                <span className="ml-2">{selectedImage.wavelength}</span>
                              </p>
                              <p className="flex items-center text-gray-300">
                                <Clock className="h-4 w-4 mr-2" />
                                <span className="font-medium">Observed:</span>
                                <span className="ml-2">{formatDate(selectedImage.observation_date)}</span>
                              </p>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <h3 className="text-lg font-semibold text-white">Technical Info</h3>
                            <div className="space-y-2 text-sm text-gray-300">
                              {selectedImage.field_of_view && (
                                <p><span className="font-medium">Field of View:</span> {selectedImage.field_of_view}</p>
                              )}
                              {selectedImage.exposure_time && (
                                <p><span className="font-medium">Exposure:</span> {selectedImage.exposure_time}</p>
                              )}
                              {selectedImage.coordinates && (
                                <p><span className="font-medium">Coordinates:</span> RA {selectedImage.coordinates.ra.toFixed(2)}°, Dec {selectedImage.coordinates.dec.toFixed(2)}°</p>
                              )}
                            </div>
                          </div>

                          <div className="space-y-3">
                            <h3 className="text-lg font-semibold text-white">Filters Used</h3>
                            <div className="flex flex-wrap gap-2">
                              {selectedImage.filters?.map((filter, index) => (
                                <span key={index} className="px-2 py-1 bg-blue-600 text-white text-xs rounded">
                                  {filter}
                                </span>
                              )) || <span className="text-gray-400 text-sm">No filter data</span>}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center text-white">
                      <ImageIcon className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                      <p className="text-xl">Select an object to view images</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ExplorePage