import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useCelestialStore } from '@/stores/celestialStore'
import { celestialAPI, CelestialObjectAPI } from '@/services/api'

// Fix for default markers in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Custom star icon
const starIcon = new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="yellow" stroke="orange" stroke-width="1">
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26 12,2"/>
    </svg>
  `),
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -10],
})

// Custom galaxy icon
const galaxyIcon = new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="purple" stroke="violet" stroke-width="1">
      <circle cx="12" cy="12" r="10"/>
      <circle cx="12" cy="12" r="6"/>
      <circle cx="12" cy="12" r="2"/>
    </svg>
  `),
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    popupAnchor: [0, -8],
})

// Custom satellite icon
const satelliteIcon = new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="cyan" stroke="blue" stroke-width="1">
      <rect x="8" y="8" width="8" height="8" rx="2"/>
      <path d="M4 4l4 4"/>
      <path d="M16 4l4 4"/>
      <path d="M4 20l4-4"/>
      <path d="M16 20l4-4"/>
    </svg>
  `),
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    popupAnchor: [0, -9],
})

// Map controller component to handle center changes
const MapController: React.FC = () => {
    const map = useMap()
    const { center } = useCelestialStore()

    useEffect(() => {
        if (center) {
            map.setView(center, map.getZoom())
        }
    }, [center, map])

    return null
}

// Sample celestial objects (will be replaced with real NASA data)
const sampleObjects = [
    {
        id: 'sirius',
        name: 'Sirius',
        type: 'star',
        position: [-16.716, 101.287], // [lat, lng] format for Leaflet
        magnitude: -1.46,
        distance: 8.6,
        constellation: 'Canis Major',
        description: 'The brightest star in the night sky'
    },
    {
        id: 'vega',
        name: 'Vega',
        type: 'star',
        position: [38.784, 279.235],
        magnitude: 0.03,
        distance: 25,
        constellation: 'Lyra',
        description: 'Former pole star and future pole star'
    },
    {
        id: 'andromeda',
        name: 'Andromeda Galaxy',
        type: 'galaxy',
        position: [41.269, 10.685],
        magnitude: 3.4,
        distance: 2537000,
        constellation: 'Andromeda',
        description: 'Nearest major galaxy to the Milky Way'
    },
    {
        id: 'hubble',
        name: 'Hubble Space Telescope',
        type: 'satellite',
        position: [30.0, 150.0],
        status: 'active',
        altitude: 547,
        description: 'Space telescope providing incredible images since 1990'
    }
]

const SpaceMap: React.FC = () => {
    const { layers } = useCelestialStore()
    const [celestialObjects, setCelestialObjects] = useState<CelestialObjectAPI[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // Load celestial objects from API
    useEffect(() => {
        const loadObjects = async () => {
            setIsLoading(true)
            try {
                // Load objects in the visible region (full sky for now)
                const objects = await celestialAPI.getObjectsInRegion(-180, 180, -90, 90, undefined, 50)
                setCelestialObjects(objects)
            } catch (error) {
                console.error('Failed to load celestial objects:', error)
                // Fall back to sample data if API fails
                setCelestialObjects(sampleObjects.map(obj => ({
                    id: obj.id,
                    name: obj.name,
                    type: obj.type as any,
                    ra: obj.position[1],
                    dec: obj.position[0],
                    magnitude: obj.magnitude,
                    distance: obj.distance,
                    constellation: obj.constellation
                })))
            } finally {
                setIsLoading(false)
            }
        }

        loadObjects()
    }, [])

    const getIcon = (type: string) => {
        switch (type) {
            case 'star':
                return starIcon
            case 'galaxy':
                return galaxyIcon
            case 'satellite':
                return satelliteIcon
            default:
                return starIcon
        }
    }

    const shouldShowObject = (type: string) => {
        switch (type) {
            case 'star':
                return layers.stars
            case 'galaxy':
                return layers.galaxies
            case 'satellite':
                return layers.satellites
            case 'nebula':
                return layers.nebulae
            case 'exoplanet':
                return layers.exoplanets
            default:
                return true
        }
    }

    return (
        <div className="h-full w-full relative">
            <MapContainer
                center={[0, 0]} // Start at celestial equator
                zoom={2}
                className="h-full w-full"
                style={{ background: '#0a0a0a' }}
                maxBounds={[[-90, -180], [90, 180]]}
                maxBoundsViscosity={1.0}
            >
                <MapController />

                {/* Space background tile layer */}
                <TileLayer
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    attribution='&copy; <a href="https://www.esri.com/">Esri</a> &copy; NASA'
                    className="space-tiles"
                />

                {/* Celestial objects */}
                {!isLoading && celestialObjects
                    .filter(obj => shouldShowObject(obj.type))
                    .map((object) => (
                        <Marker
                            key={object.id}
                            position={[object.dec, object.ra] as [number, number]}
                            icon={getIcon(object.type)}
                        >
                            <Popup>
                                <div className="text-gray-900">
                                    <h3 className="font-bold text-lg">{object.name}</h3>
                                    <p className="text-sm capitalize mb-2">{object.type}</p>
                                    {object.constellation && (
                                        <p><strong>Constellation:</strong> {object.constellation}</p>
                                    )}
                                    {object.magnitude !== undefined && (
                                        <p><strong>Magnitude:</strong> {object.magnitude}</p>
                                    )}
                                    {object.distance && (
                                        <p><strong>Distance:</strong> {object.distance} ly</p>
                                    )}
                                    {object.status && (
                                        <p><strong>Status:</strong> {object.status}</p>
                                    )}
                                    {object.spectral_type && (
                                        <p><strong>Spectral Type:</strong> {object.spectral_type}</p>
                                    )}
                                    {object.habitable_zone && (
                                        <p><strong>Habitable Zone:</strong> Yes</p>
                                    )}
                                </div>
                            </Popup>
                        </Marker>
                    ))}
            </MapContainer>

            {/* Loading indicator */}
            {isLoading && (
                <div className="absolute inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
                    <div className="text-center text-white">
                        <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-lg">Loading celestial objects...</p>
                        <p className="text-sm text-gray-300">Connecting to NASA data sources</p>
                    </div>
                </div>
            )}

            {/* Overlay info */}
            <div className="absolute top-4 right-4 bg-gray-800 bg-opacity-90 text-white p-4 rounded-lg shadow-lg">
                <h3 className="font-bold mb-2">🌌 Space Coordinates</h3>
                <p className="text-sm">This map shows celestial objects using</p>
                <p className="text-sm">Right Ascension (longitude) and</p>
                <p className="text-sm">Declination (latitude) coordinates</p>
                <div className="mt-2 text-xs text-gray-300">
                    <p>• Yellow stars: Bright stars</p>
                    <p>• Purple circles: Galaxies</p>
                    <p>• Blue squares: Satellites</p>
                </div>
                <div className="mt-2 text-xs text-blue-300">
                    Objects loaded: {celestialObjects.length}
                </div>
            </div>
        </div>
    )
}

export default SpaceMap