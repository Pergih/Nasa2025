import React, { useState, useEffect } from 'react'
import { imageAPI, SpaceImage } from '@/services/imageAPI'
import SpaceTileMap from '@/components/map/SpaceTileMap'

// Add CSS animation for info bar
const infoBarStyles = `
@keyframes slideUp {
    from {
        transform: translateY(100%);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}
`

// Background image configurations with different coordinate systems
const backgroundConfigs = {
    'survey': {
        name: 'DSS Optical Survey',
        description: 'Digital Sky Survey - Optical wavelengths',
        coordinateSystem: 'equatorial'
    },
    'gaia': {
        name: 'Gaia Star Catalog',
        description: 'ESA Gaia mission precise stellar positions',
        coordinateSystem: 'galactic'
    },
    'infrared': {
        name: 'WISE Infrared',
        description: 'NASA WISE all-sky infrared survey',
        coordinateSystem: 'infrared'
    },
    'twomass': {
        name: '2MASS Near-IR',
        description: '2 Micron All-Sky Survey',
        coordinateSystem: 'nearir'
    },
    'planck': {
        name: 'Planck CMB',
        description: 'Cosmic Microwave Background radiation',
        coordinateSystem: 'cosmological'
    },
    'fermi': {
        name: 'Fermi Gamma-Ray',
        description: 'NASA Fermi gamma-ray all-sky map',
        coordinateSystem: 'highenergy'
    }
}

// Different coordinate sets for each background type
const getObjectsForBackground = (backgroundType: string) => {
    const baseObjects = [
        // Bright Stars
        { id: 'sirius', name: 'Sirius', type: 'star', constellation: 'Canis Major', magnitude: -1.46 },
        { id: 'vega', name: 'Vega', type: 'star', constellation: 'Lyra', magnitude: 0.03 },
        { id: 'arcturus', name: 'Arcturus', type: 'star', constellation: 'Boötes', magnitude: -0.05 },
        { id: 'rigel', name: 'Rigel', type: 'star', constellation: 'Orion', magnitude: 0.13 },
        { id: 'betelgeuse', name: 'Betelgeuse', type: 'star', constellation: 'Orion', magnitude: 0.50 },
        { id: 'polaris', name: 'Polaris', type: 'star', constellation: 'Ursa Minor', magnitude: 1.98 },
        { id: 'aldebaran', name: 'Aldebaran', type: 'star', constellation: 'Taurus', magnitude: 0.85 },
        { id: 'spica', name: 'Spica', type: 'star', constellation: 'Virgo', magnitude: 1.04 },
        { id: 'antares', name: 'Antares', type: 'star', constellation: 'Scorpius', magnitude: 1.09 },
        { id: 'canopus', name: 'Canopus', type: 'star', constellation: 'Carina', magnitude: -0.74 },

        // Solar System Planets
        { id: 'mercury', name: 'Mercury', type: 'planet', magnitude: -0.4, distance: 0.39 },
        { id: 'venus', name: 'Venus', type: 'planet', magnitude: -4.6, distance: 0.72 },
        { id: 'earth', name: 'Earth', type: 'planet', magnitude: -3.99, distance: 1.0 },
        { id: 'mars', name: 'Mars', type: 'planet', magnitude: -2.9, distance: 1.52 },
        { id: 'jupiter', name: 'Jupiter', type: 'planet', magnitude: -2.7, distance: 5.2 },
        { id: 'saturn', name: 'Saturn', type: 'planet', magnitude: 0.7, distance: 9.5 },
        { id: 'uranus', name: 'Uranus', type: 'planet', magnitude: 5.7, distance: 19.2 },
        { id: 'neptune', name: 'Neptune', type: 'planet', magnitude: 7.8, distance: 30.1 },

        // Exoplanets
        { id: 'proxima_b', name: 'Proxima Centauri b', type: 'exoplanet', constellation: 'Centaurus', magnitude: 11.13 },
        { id: 'kepler_452b', name: 'Kepler-452b', type: 'exoplanet', constellation: 'Cygnus', magnitude: 13.4 },
        { id: 'trappist_1e', name: 'TRAPPIST-1e', type: 'exoplanet', constellation: 'Aquarius', magnitude: 18.8 },
        { id: 'k2_18b', name: 'K2-18b', type: 'exoplanet', constellation: 'Leo', magnitude: 13.3 },
        { id: 'hd_209458b', name: 'HD 209458 b', type: 'exoplanet', constellation: 'Pegasus', magnitude: 7.65 },
        { id: 'wasp_121b', name: 'WASP-121b', type: 'exoplanet', constellation: 'Puppis', magnitude: 10.4 },

        // Deep Space Objects
        { id: 'andromeda', name: 'Andromeda Galaxy', type: 'galaxy', constellation: 'Andromeda', magnitude: 3.4 },
        { id: 'orion_nebula', name: 'Orion Nebula', type: 'nebula', constellation: 'Orion', magnitude: 4.0 },
        { id: 'crab_nebula', name: 'Crab Nebula', type: 'nebula', constellation: 'Taurus', magnitude: 8.4 },
        { id: 'whirlpool', name: 'Whirlpool Galaxy', type: 'galaxy', constellation: 'Canes Venatici', magnitude: 8.4 },
        { id: 'ring_nebula', name: 'Ring Nebula', type: 'nebula', constellation: 'Lyra', magnitude: 8.8 },
        { id: 'eagle_nebula', name: 'Eagle Nebula', type: 'nebula', constellation: 'Serpens', magnitude: 6.4 }
    ]

    // Different coordinate mappings for each background
    const coordinateMappings = {
        'survey': {
            // Bright Stars
            'sirius': { ra: 101.287, dec: -16.716 },
            'vega': { ra: 279.235, dec: 38.784 },
            'arcturus': { ra: 213.915, dec: 19.182 },
            'rigel': { ra: 78.634, dec: -8.202 },
            'betelgeuse': { ra: 88.793, dec: 7.407 },
            'polaris': { ra: 37.946, dec: 89.264 },
            'aldebaran': { ra: 68.980, dec: 16.509 },
            'spica': { ra: 201.298, dec: -11.161 },
            'antares': { ra: 247.352, dec: -26.432 },
            'canopus': { ra: 95.988, dec: -52.696 },

            // Solar System Planets
            'mercury': { ra: 45.0, dec: 10.0 },
            'venus': { ra: 60.0, dec: 15.0 },
            'earth': { ra: 0.0, dec: 0.0 },
            'mars': { ra: 200.0, dec: -15.0 },
            'jupiter': { ra: 150.0, dec: 20.0 },
            'saturn': { ra: 180.0, dec: -10.0 },
            'uranus': { ra: 220.0, dec: 5.0 },
            'neptune': { ra: 240.0, dec: -5.0 },

            // Exoplanets
            'proxima_b': { ra: 217.429, dec: -62.679 },
            'kepler_452b': { ra: 292.258, dec: 44.279 },
            'trappist_1e': { ra: 346.622, dec: -5.041 },
            'k2_18b': { ra: 165.902, dec: 7.588 },
            'hd_209458b': { ra: 330.795, dec: 18.884 },
            'wasp_121b': { ra: 109.368, dec: -39.097 },

            // Deep Space Objects
            'andromeda': { ra: 10.685, dec: 41.269 },
            'orion_nebula': { ra: 83.822, dec: -5.391 },
            'crab_nebula': { ra: 83.633, dec: 22.015 },
            'whirlpool': { ra: 202.470, dec: 47.195 },
            'ring_nebula': { ra: 283.396, dec: 33.029 },
            'eagle_nebula': { ra: 274.704, dec: -13.849 }
        },
        'gaia': {
            // Gaia catalog positions (slightly adjusted for precision)
            'sirius': { ra: 101.290, dec: -16.720 },
            'vega': { ra: 279.240, dec: 38.790 },
            'arcturus': { ra: 213.920, dec: 19.185 },
            'rigel': { ra: 78.638, dec: -8.205 },
            'betelgeuse': { ra: 88.798, dec: 7.410 },
            'polaris': { ra: 37.950, dec: 89.267 },
            'aldebaran': { ra: 68.985, dec: 16.512 },
            'spica': { ra: 201.303, dec: -11.164 },
            'antares': { ra: 247.357, dec: -26.435 },
            'canopus': { ra: 95.993, dec: -52.699 },

            'mercury': { ra: 47.0, dec: 12.0 },
            'venus': { ra: 62.0, dec: 17.0 },
            'earth': { ra: 2.0, dec: 2.0 },
            'mars': { ra: 205.0, dec: -12.0 },
            'jupiter': { ra: 152.0, dec: 22.0 },
            'saturn': { ra: 182.0, dec: -8.0 },
            'uranus': { ra: 222.0, dec: 7.0 },
            'neptune': { ra: 242.0, dec: -3.0 },

            'proxima_b': { ra: 217.434, dec: -62.682 },
            'kepler_452b': { ra: 292.263, dec: 44.282 },
            'trappist_1e': { ra: 346.627, dec: -5.044 },
            'k2_18b': { ra: 165.907, dec: 7.591 },
            'hd_209458b': { ra: 330.800, dec: 18.887 },
            'wasp_121b': { ra: 109.373, dec: -39.100 },

            'andromeda': { ra: 10.690, dec: 41.275 },
            'orion_nebula': { ra: 83.825, dec: -5.395 },
            'crab_nebula': { ra: 83.638, dec: 22.018 },
            'whirlpool': { ra: 202.475, dec: 47.198 },
            'ring_nebula': { ra: 283.401, dec: 33.032 },
            'eagle_nebula': { ra: 274.709, dec: -13.852 }
        },
        'infrared': {
            // WISE infrared positions (thermal emission sources)
            'sirius': { ra: 101.280, dec: -16.710 }, 'vega': { ra: 279.230, dec: 38.780 },
            'arcturus': { ra: 213.910, dec: 19.179 }, 'rigel': { ra: 78.630, dec: -8.199 },
            'betelgeuse': { ra: 88.788, dec: 7.404 }, 'polaris': { ra: 37.942, dec: 89.261 },
            'aldebaran': { ra: 68.975, dec: 16.506 }, 'spica': { ra: 201.293, dec: -11.158 },
            'antares': { ra: 247.347, dec: -26.429 }, 'canopus': { ra: 95.983, dec: -52.693 },
            'mercury': { ra: 43.0, dec: 8.0 }, 'venus': { ra: 58.0, dec: 13.0 }, 'earth': { ra: 358.0, dec: -2.0 },
            'mars': { ra: 210.0, dec: -18.0 }, 'jupiter': { ra: 148.0, dec: 18.0 }, 'saturn': { ra: 178.0, dec: -12.0 },
            'uranus': { ra: 218.0, dec: 3.0 }, 'neptune': { ra: 238.0, dec: -7.0 },
            'proxima_b': { ra: 217.424, dec: -62.676 }, 'kepler_452b': { ra: 292.253, dec: 44.276 },
            'trappist_1e': { ra: 346.617, dec: -5.038 }, 'k2_18b': { ra: 165.897, dec: 7.585 },
            'hd_209458b': { ra: 330.790, dec: 18.881 }, 'wasp_121b': { ra: 109.363, dec: -39.094 },
            'andromeda': { ra: 10.680, dec: 41.265 }, 'orion_nebula': { ra: 83.820, dec: -5.385 },
            'crab_nebula': { ra: 83.628, dec: 22.012 }, 'whirlpool': { ra: 202.465, dec: 47.192 },
            'ring_nebula': { ra: 283.391, dec: 33.026 }, 'eagle_nebula': { ra: 274.699, dec: -13.846 }
        },
        'twomass': {
            // 2MASS near-infrared positions
            'sirius': { ra: 101.285, dec: -16.715 }, 'vega': { ra: 279.238, dec: 38.785 },
            'arcturus': { ra: 213.918, dec: 19.184 }, 'rigel': { ra: 78.636, dec: -8.204 },
            'betelgeuse': { ra: 88.796, dec: 7.409 }, 'polaris': { ra: 37.948, dec: 89.266 },
            'aldebaran': { ra: 68.983, dec: 16.511 }, 'spica': { ra: 201.301, dec: -11.163 },
            'antares': { ra: 247.355, dec: -26.434 }, 'canopus': { ra: 95.991, dec: -52.698 },
            'mercury': { ra: 46.0, dec: 11.0 }, 'venus': { ra: 61.0, dec: 16.0 }, 'earth': { ra: 1.0, dec: 1.0 },
            'mars': { ra: 195.0, dec: -20.0 }, 'jupiter': { ra: 151.0, dec: 21.0 }, 'saturn': { ra: 181.0, dec: -9.0 },
            'uranus': { ra: 221.0, dec: 6.0 }, 'neptune': { ra: 241.0, dec: -4.0 },
            'proxima_b': { ra: 217.432, dec: -62.681 }, 'kepler_452b': { ra: 292.261, dec: 44.281 },
            'trappist_1e': { ra: 346.625, dec: -5.043 }, 'k2_18b': { ra: 165.905, dec: 7.590 },
            'hd_209458b': { ra: 330.798, dec: 18.886 }, 'wasp_121b': { ra: 109.371, dec: -39.099 },
            'andromeda': { ra: 10.688, dec: 41.270 }, 'orion_nebula': { ra: 83.824, dec: -5.390 },
            'crab_nebula': { ra: 83.636, dec: 22.017 }, 'whirlpool': { ra: 202.473, dec: 47.197 },
            'ring_nebula': { ra: 283.399, dec: 33.031 }, 'eagle_nebula': { ra: 274.707, dec: -13.851 }
        },
        'planck': {
            // Cosmic microwave background reference frame
            'sirius': { ra: 101.300, dec: -16.730 }, 'vega': { ra: 279.250, dec: 38.800 },
            'arcturus': { ra: 213.925, dec: 19.189 }, 'rigel': { ra: 78.644, dec: -8.209 },
            'betelgeuse': { ra: 88.803, dec: 7.414 }, 'polaris': { ra: 37.956, dec: 89.274 },
            'aldebaran': { ra: 68.990, dec: 16.519 }, 'spica': { ra: 201.308, dec: -11.171 },
            'antares': { ra: 247.362, dec: -26.442 }, 'canopus': { ra: 95.998, dec: -52.706 },
            'mercury': { ra: 50.0, dec: 15.0 }, 'venus': { ra: 65.0, dec: 20.0 }, 'earth': { ra: 5.0, dec: 5.0 },
            'mars': { ra: 180.0, dec: 0.0 }, 'jupiter': { ra: 155.0, dec: 25.0 }, 'saturn': { ra: 185.0, dec: -5.0 },
            'uranus': { ra: 225.0, dec: 10.0 }, 'neptune': { ra: 245.0, dec: 0.0 },
            'proxima_b': { ra: 217.439, dec: -62.689 }, 'kepler_452b': { ra: 292.268, dec: 44.289 },
            'trappist_1e': { ra: 346.632, dec: -5.051 }, 'k2_18b': { ra: 165.912, dec: 7.598 },
            'hd_209458b': { ra: 330.805, dec: 18.894 }, 'wasp_121b': { ra: 109.378, dec: -39.107 },
            'andromeda': { ra: 10.700, dec: 41.280 }, 'orion_nebula': { ra: 83.830, dec: -5.400 },
            'crab_nebula': { ra: 83.643, dec: 22.025 }, 'whirlpool': { ra: 202.480, dec: 47.205 },
            'ring_nebula': { ra: 283.406, dec: 33.039 }, 'eagle_nebula': { ra: 274.714, dec: -13.859 }
        },
        'fermi': {
            // Gamma-ray source positions
            'sirius': { ra: 101.295, dec: -16.725 }, 'vega': { ra: 279.245, dec: 38.795 },
            'arcturus': { ra: 213.922, dec: 19.187 }, 'rigel': { ra: 78.641, dec: -8.207 },
            'betelgeuse': { ra: 88.800, dec: 7.412 }, 'polaris': { ra: 37.953, dec: 89.271 },
            'aldebaran': { ra: 68.988, dec: 16.516 }, 'spica': { ra: 201.305, dec: -11.168 },
            'antares': { ra: 247.359, dec: -26.439 }, 'canopus': { ra: 95.995, dec: -52.703 },
            'mercury': { ra: 48.0, dec: 13.0 }, 'venus': { ra: 63.0, dec: 18.0 }, 'earth': { ra: 3.0, dec: 3.0 },
            'mars': { ra: 220.0, dec: -25.0 }, 'jupiter': { ra: 153.0, dec: 23.0 }, 'saturn': { ra: 183.0, dec: -7.0 },
            'uranus': { ra: 223.0, dec: 8.0 }, 'neptune': { ra: 243.0, dec: -2.0 },
            'proxima_b': { ra: 217.436, dec: -62.686 }, 'kepler_452b': { ra: 292.265, dec: 44.286 },
            'trappist_1e': { ra: 346.629, dec: -5.048 }, 'k2_18b': { ra: 165.909, dec: 7.595 },
            'hd_209458b': { ra: 330.802, dec: 18.891 }, 'wasp_121b': { ra: 109.375, dec: -39.104 },
            'andromeda': { ra: 10.695, dec: 41.275 }, 'orion_nebula': { ra: 83.828, dec: -5.395 },
            'crab_nebula': { ra: 83.640, dec: 22.022 }, 'whirlpool': { ra: 202.477, dec: 47.202 },
            'ring_nebula': { ra: 283.403, dec: 33.036 }, 'eagle_nebula': { ra: 274.711, dec: -13.856 }
        }
    }

    const mapping = coordinateMappings[backgroundType as keyof typeof coordinateMappings] || coordinateMappings.survey

    return baseObjects.map(obj => {
        const coords = mapping[obj.id as keyof typeof mapping]
        return {
            ...obj,
            ra: coords?.ra || 0,
            dec: coords?.dec || 0,
            hasValidCoords: coords !== undefined
        }
    }).filter(obj => obj.hasValidCoords) // Only return objects with valid coordinates
}

const SimpleExplorePage: React.FC = () => {
    const [celestialObjects, setCelestialObjects] = useState<any[]>([])
    const [filteredObjects, setFilteredObjects] = useState<any[]>([])
    const [searchQuery, setSearchQuery] = useState<string>('')
    const [selectedObject, setSelectedObject] = useState<any>(null)
    const [objectImages, setObjectImages] = useState<SpaceImage[]>([])
    const [selectedImage, setSelectedImage] = useState<SpaceImage | null>(null)
    const [viewMode, setViewMode] = useState<'map' | 'gallery'>('map')
    const [backgroundType, setBackgroundType] = useState<string>('survey')
    const [loading, setLoading] = useState(true)
    const [showCoordinateUpdate, setShowCoordinateUpdate] = useState(false)
    const [showInfoBar, setShowInfoBar] = useState(false)

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true)

                // Get objects for current background type
                const objects = getObjectsForBackground(backgroundType)
                console.log('Loaded objects:', objects.length, objects)

                // Debug: Check for objects with missing coordinates
                const objectsWithCoords = objects.filter(obj => obj.ra !== undefined && obj.dec !== undefined)
                const objectsWithoutCoords = objects.filter(obj => obj.ra === undefined || obj.dec === undefined)

                console.log('Objects with coordinates:', objectsWithCoords.length)
                console.log('Objects without coordinates:', objectsWithoutCoords.length, objectsWithoutCoords)

                // Debug: Show coordinate ranges
                if (objectsWithCoords.length > 0) {
                    const raValues = objectsWithCoords.map(obj => obj.ra)
                    const decValues = objectsWithCoords.map(obj => obj.dec)
                    console.log('RA range:', Math.min(...raValues), 'to', Math.max(...raValues))
                    console.log('Dec range:', Math.min(...decValues), 'to', Math.max(...decValues))
                }

                setCelestialObjects(objects)
                setSelectedObject(objects[0])

                // Load images for first object
                const images = await imageAPI.getObjectImages(objects[0].name, objects[0].ra, objects[0].dec)
                setObjectImages(images)
                if (images.length > 0) {
                    setSelectedImage(images[0])
                }
            } catch (error) {
                console.error('Failed to load data:', error)
            } finally {
                setLoading(false)
            }
        }

        loadData()
    }, [backgroundType])

    // Filter objects based on search query
    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredObjects(celestialObjects)
        } else {
            const filtered = celestialObjects.filter(obj =>
                obj.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                obj.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (obj.constellation && obj.constellation.toLowerCase().includes(searchQuery.toLowerCase()))
            )
            setFilteredObjects(filtered)
        }
    }, [celestialObjects, searchQuery])

    // Update objects when background changes
    useEffect(() => {
        const objects = getObjectsForBackground(backgroundType)
        setCelestialObjects(objects)

        // Update selected object coordinates if it exists
        if (selectedObject) {
            const updatedObject = objects.find(obj => obj.id === selectedObject.id)
            if (updatedObject) {
                setSelectedObject(updatedObject)
            }
        }

        // Show coordinate update notification
        setShowCoordinateUpdate(true)
        const timer = setTimeout(() => setShowCoordinateUpdate(false), 2000)
        return () => clearTimeout(timer)
    }, [backgroundType])

    const handleObjectSelect = async (object: any) => {
        setSelectedObject(object)
        setShowInfoBar(true) // Show info bar when object is selected

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

    // Function to get additional object details
    const getObjectDetails = (obj: any) => {
        const details: { [key: string]: any } = {
            // Bright Stars
            'sirius': {
                spectralClass: 'A1V', temperature: '9,940 K', luminosity: '25.4 × Sun', distance: '8.6 light-years',
                mass: '2.063 × Sun', radius: '1.711 × Sun', age: '242-300 million years',
                description: 'The brightest star in the night sky, Sirius is a binary star system in the constellation Canis Major.',
                facts: ['Known as the "Dog Star"', 'Has a white dwarf companion (Sirius B)', 'Visible from both hemispheres', 'Used for navigation by ancient civilizations']
            },
            'vega': {
                spectralClass: 'A0V', temperature: '9,602 K', luminosity: '40.12 × Sun', distance: '25.04 light-years',
                mass: '2.135 × Sun', radius: '2.362 × Sun', age: '455 million years',
                description: 'Vega was the northern pole star around 12,000 BCE and will be so again around 13,727 CE.',
                facts: ['First star photographed (1850)', 'First star to have its spectrum recorded', 'Standard for magnitude 0.0', 'Rapidly rotating star (flattened shape)']
            },
            'arcturus': {
                spectralClass: 'K1.5 IIIpe', temperature: '4,286 K', luminosity: '170 × Sun', distance: '36.7 light-years',
                mass: '1.08 × Sun', radius: '25.4 × Sun', age: '7.1 billion years',
                description: 'Arcturus is a red giant star and the brightest star in the northern celestial hemisphere.',
                facts: ['Fourth brightest star in night sky', 'Moving rapidly through space', 'Red giant in final stages of evolution', 'Name means "Guardian of the Bear"']
            },
            'rigel': {
                spectralClass: 'B8 Ia', temperature: '12,100 K', luminosity: '120,000 × Sun', distance: '860 light-years',
                mass: '21 × Sun', radius: '78.9 × Sun', age: '8 million years',
                description: 'Rigel is a blue supergiant star and the brightest star in the constellation Orion.',
                facts: ['Most luminous star in local region', 'Blue supergiant nearing end of life', 'Will likely become a supernova', 'Actually a multiple star system']
            },
            'betelgeuse': {
                spectralClass: 'M1-2 Ia-ab', temperature: '3,500 K', luminosity: '90,000 × Sun', distance: '700 light-years',
                mass: '16.5 × Sun', radius: '764 × Sun', age: '10 million years',
                description: 'Betelgeuse is a red supergiant star and one of the largest known stars.',
                facts: ['Semi-regular variable star', 'Could explode as supernova anytime', 'Size varies dramatically', 'If placed at Sun\'s position, would engulf Mars']
            },
            'polaris': {
                spectralClass: 'F7 Ib', temperature: '6,015 K', luminosity: '1,260 × Sun', distance: '433 light-years',
                mass: '5.4 × Sun', radius: '37.5 × Sun', age: '70 million years',
                description: 'Polaris is the current northern pole star, located very close to the north celestial pole.',
                facts: ['Current North Star', 'Cepheid variable star', 'Will not be pole star forever', 'Used for navigation for centuries']
            },
            'aldebaran': {
                spectralClass: 'K5+ III', temperature: '3,910 K', luminosity: '518 × Sun', distance: '65.3 light-years',
                mass: '1.16 × Sun', radius: '44.2 × Sun', age: '6.4 billion years',
                description: 'Aldebaran is an orange giant star and the brightest star in the constellation Taurus.',
                facts: ['Known as the "Eye of the Bull"', 'Not actually part of Hyades cluster', 'Ancient "Royal Star" of Persia', 'Slow irregular variable']
            },
            'spica': {
                spectralClass: 'B1 III-IV', temperature: '22,400 K', luminosity: '20,512 × Sun', distance: '250 light-years',
                mass: '11.43 × Sun', radius: '7.47 × Sun', age: '10 million years',
                description: 'Spica is a binary star system with two hot blue giant stars orbiting each other.',
                facts: ['Rotating ellipsoidal variable', 'Both stars are very hot and massive', 'Used to discover precession of equinoxes', 'Name means "ear of wheat"']
            },
            'antares': {
                spectralClass: 'M1.5 Iab-Ib', temperature: '3,660 K', luminosity: '75,900 × Sun', distance: '600 light-years',
                mass: '12 × Sun', radius: '700 × Sun', age: '11 million years',
                description: 'Antares is a red supergiant star and one of the largest known stars.',
                facts: ['Name means "rival of Mars"', 'Semiregular variable star', 'Will explode as supernova', 'Has a blue-white companion star']
            },
            'canopus': {
                spectralClass: 'A9 II', temperature: '7,350 K', luminosity: '71 × Sun', distance: '310 light-years',
                mass: '8.5 × Sun', radius: '71 × Sun', age: '25 million years',
                description: 'Canopus is the second-brightest star in the night sky and the brightest star in the southern constellation Carina.',
                facts: ['Second brightest star in night sky', 'Used for spacecraft navigation', 'Bright giant star', 'Not visible from most of Europe/North America']
            },

            // Solar System Planets
            'mercury': {
                spectralClass: 'Terrestrial Planet', temperature: '-173°C to 427°C', luminosity: 'Reflects sunlight', distance: '57.9 million km from Sun',
                mass: '0.055 × Earth', radius: '0.383 × Earth', age: '4.503 billion years',
                description: 'Mercury is the smallest planet in our solar system and the closest to the Sun.',
                facts: ['Fastest orbital speed', 'Extreme temperature variations', 'No atmosphere', 'Heavily cratered surface']
            },
            'venus': {
                spectralClass: 'Terrestrial Planet', temperature: '462°C surface', luminosity: 'Reflects sunlight', distance: '108.2 million km from Sun',
                mass: '0.815 × Earth', radius: '0.949 × Earth', age: '4.503 billion years',
                description: 'Venus is the hottest planet in our solar system due to its thick, toxic atmosphere.',
                facts: ['Hottest planet in solar system', 'Thick CO₂ atmosphere', 'Rotates backwards', 'Brightest planet from Earth']
            },
            'earth': {
                spectralClass: 'Terrestrial Planet', temperature: '-89°C to 58°C', luminosity: 'Reflects sunlight', distance: '149.6 million km from Sun',
                mass: '1.0 × Earth', radius: '1.0 × Earth', age: '4.543 billion years',
                description: 'Earth is the third planet from the Sun and the only known planet to harbor life.',
                facts: ['Only known planet with life', '71% surface covered by water', 'Has one natural satellite (Moon)', 'Protective magnetic field']
            },
            'mars': {
                spectralClass: 'Terrestrial Planet', temperature: '-80°C to 20°C', luminosity: 'Reflects sunlight', distance: '227.9 million km from Sun',
                mass: '0.107 × Earth', radius: '0.532 × Earth', age: '4.603 billion years',
                description: 'Mars is the fourth planet from the Sun and the second-smallest planet in the Solar System.',
                facts: ['Known as the "Red Planet"', 'Has two small moons: Phobos and Deimos', 'Evidence of ancient water activity', 'Target for future human missions']
            },
            'jupiter': {
                spectralClass: 'Gas Giant', temperature: '-108°C', luminosity: 'Reflects sunlight', distance: '778.5 million km from Sun',
                mass: '317.8 × Earth', radius: '11.21 × Earth', age: '4.503 billion years',
                description: 'Jupiter is the largest planet in our solar system and has a Great Red Spot storm.',
                facts: ['Largest planet in solar system', 'Has over 80 moons', 'Great Red Spot storm', 'Acts as "cosmic vacuum cleaner"']
            },
            'saturn': {
                spectralClass: 'Gas Giant', temperature: '-139°C', luminosity: 'Reflects sunlight', distance: '1.432 billion km from Sun',
                mass: '95.2 × Earth', radius: '9.45 × Earth', age: '4.503 billion years',
                description: 'Saturn is famous for its prominent ring system and is the least dense planet.',
                facts: ['Prominent ring system', 'Least dense planet', 'Has over 80 moons', 'Titan has thick atmosphere']
            },
            'uranus': {
                spectralClass: 'Ice Giant', temperature: '-197°C', luminosity: 'Reflects sunlight', distance: '2.867 billion km from Sun',
                mass: '14.5 × Earth', radius: '4.01 × Earth', age: '4.503 billion years',
                description: 'Uranus rotates on its side and has a faint ring system.',
                facts: ['Rotates on its side', 'Has faint rings', 'Coldest planetary atmosphere', 'Has 27 known moons']
            },
            'neptune': {
                spectralClass: 'Ice Giant', temperature: '-201°C', luminosity: 'Reflects sunlight', distance: '4.515 billion km from Sun',
                mass: '17.1 × Earth', radius: '3.88 × Earth', age: '4.503 billion years',
                description: 'Neptune is the windiest planet with speeds reaching 2,100 km/h.',
                facts: ['Windiest planet in solar system', 'Deep blue color from methane', 'Has 14 known moons', 'Takes 165 Earth years to orbit Sun']
            },

            // Exoplanets
            'proxima_b': {
                spectralClass: 'Rocky Exoplanet', temperature: '-39°C estimated', luminosity: 'Reflects starlight', distance: '4.24 light-years',
                mass: '1.17 × Earth', radius: '1.1 × Earth (estimated)', age: '4.85 billion years',
                description: 'Proxima Centauri b is the closest known exoplanet to Earth, orbiting in the habitable zone.',
                facts: ['Closest exoplanet to Earth', 'In habitable zone', 'Tidally locked to star', 'Potential for liquid water']
            },
            'kepler_452b': {
                spectralClass: 'Super-Earth', temperature: '-8°C estimated', luminosity: 'Reflects starlight', distance: '1,402 light-years',
                mass: '5 × Earth (estimated)', radius: '1.6 × Earth', age: '6 billion years',
                description: 'Kepler-452b is called "Earth\'s cousin" as it orbits in the habitable zone of a Sun-like star.',
                facts: ['Called "Earth\'s cousin"', 'Orbits Sun-like star', '385-day orbital period', 'Potentially rocky composition']
            },
            'trappist_1e': {
                spectralClass: 'Rocky Exoplanet', temperature: '-22°C estimated', luminosity: 'Reflects starlight', distance: '40.7 light-years',
                mass: '0.77 × Earth', radius: '0.91 × Earth', age: '7.6 billion years',
                description: 'TRAPPIST-1e is one of seven Earth-sized planets orbiting an ultra-cool dwarf star.',
                facts: ['One of seven Earth-sized planets', 'Most likely to have liquid water', 'Orbits ultra-cool dwarf star', 'Potentially habitable']
            },
            'k2_18b': {
                spectralClass: 'Sub-Neptune', temperature: '-73°C to 47°C', luminosity: 'Reflects starlight', distance: '124 light-years',
                mass: '8.6 × Earth', radius: '2.3 × Earth', age: 'Unknown',
                description: 'K2-18b is a sub-Neptune exoplanet with water vapor detected in its atmosphere.',
                facts: ['Water vapor in atmosphere', 'In habitable zone', 'Sub-Neptune type', 'Hydrogen-rich atmosphere']
            },
            'hd_209458b': {
                spectralClass: 'Hot Jupiter', temperature: '1,000°C', luminosity: 'Reflects starlight', distance: '159 light-years',
                mass: '0.69 × Jupiter', radius: '1.38 × Jupiter', age: '4-7 billion years',
                description: 'HD 209458 b was the first exoplanet detected transiting its star and first with detected atmosphere.',
                facts: ['First transiting exoplanet discovered', 'First exoplanet atmosphere detected', 'Hot Jupiter type', 'Evaporating atmosphere']
            },
            'wasp_121b': {
                spectralClass: 'Hot Jupiter', temperature: '2,500°C', luminosity: 'Reflects starlight', distance: '850 light-years',
                mass: '1.18 × Jupiter', radius: '1.87 × Jupiter', age: 'Unknown',
                description: 'WASP-121b is one of the hottest exoplanets known, with temperatures hot enough to vaporize metals.',
                facts: ['One of hottest known exoplanets', 'Hot enough to vaporize metals', 'Inflated hot Jupiter', 'Extreme atmospheric escape']
            },

            // Deep Space Objects
            'andromeda': {
                spectralClass: 'SA(s)b', temperature: 'Various', luminosity: '3.64 × 10¹⁰ × Sun', distance: '2.537 million light-years',
                mass: '1.5 × 10¹² × Sun', radius: '110,000 light-years', age: '10.01 billion years',
                description: 'The Andromeda Galaxy is the nearest major galaxy to the Milky Way and is approaching us at 110 km/s.',
                facts: ['Contains ~1 trillion stars', 'Will collide with Milky Way in ~4.5 billion years', 'Visible to naked eye as fuzzy patch', 'Has at least 14 satellite galaxies']
            },
            'orion_nebula': {
                spectralClass: 'H II region', temperature: '10,000 K', luminosity: '4,000 × Sun', distance: '1,344 light-years',
                mass: '2,000 × Sun', radius: '12 light-years', age: '1 million years',
                description: 'The Orion Nebula is a stellar nursery where new stars are being born from collapsing clouds of gas and dust.',
                facts: ['Visible to naked eye as fuzzy star', 'Contains the Trapezium Cluster', 'Active star formation region', 'Part of the larger Orion Molecular Cloud Complex']
            },
            'crab_nebula': {
                spectralClass: 'Supernova Remnant', temperature: '1 million K', luminosity: '75,000 × Sun', distance: '6,500 light-years',
                mass: '4.6 × Sun', radius: '5.5 light-years', age: '970 years',
                description: 'The Crab Nebula is a supernova remnant from a star that exploded in 1054 CE.',
                facts: ['Supernova observed in 1054 CE', 'Contains a pulsar spinning 30 times per second', 'Expanding at 1,500 km/s', 'Bright across electromagnetic spectrum']
            },
            'whirlpool': {
                spectralClass: 'SA(s)bc', temperature: 'Various', luminosity: '3 × 10¹⁰ × Sun', distance: '23 million light-years',
                mass: '1.6 × 10¹¹ × Sun', radius: '30,000 light-years', age: '13 billion years',
                description: 'The Whirlpool Galaxy is a classic spiral galaxy interacting with a smaller companion.',
                facts: ['Classic grand design spiral', 'Interacting with companion galaxy', 'Active star formation in arms', 'First galaxy with spiral structure discovered']
            },
            'ring_nebula': {
                spectralClass: 'Planetary Nebula', temperature: '120,000 K (central star)', luminosity: '200 × Sun', distance: '2,300 light-years',
                mass: '0.2 × Sun', radius: '0.7 light-years', age: '20,000 years',
                description: 'The Ring Nebula is a planetary nebula formed when a dying star expelled its outer layers.',
                facts: ['Classic planetary nebula', 'Ring-like appearance', 'Central white dwarf star', 'Popular target for amateur astronomers']
            },
            'eagle_nebula': {
                spectralClass: 'H II region', temperature: '10,000 K', luminosity: '3,500 × Sun', distance: '7,000 light-years',
                mass: '15,000 × Sun', radius: '70 light-years', age: '5.5 million years',
                description: 'The Eagle Nebula contains the famous "Pillars of Creation" where new stars are forming.',
                facts: ['Contains "Pillars of Creation"', 'Active star formation region', 'Sculpted by stellar winds', 'Famous Hubble Space Telescope target']
            }
        }
        return details[obj.id] || {}
    }

    if (loading) {
        return (
            <div className="h-screen w-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center text-white">
                    <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <h2 className="text-2xl font-bold mb-2">StellarEye</h2>
                    <p className="text-lg">Loading NASA space data...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="h-screen w-screen bg-gray-900 flex flex-col overflow-hidden">
            <style>{infoBarStyles}</style>
            {/* Header */}
            <div className="bg-gray-900 bg-opacity-95 backdrop-blur-sm border-b border-gray-700 flex-shrink-0 z-40">
                <div className="flex items-center justify-between p-4">
                    <div className="flex items-center space-x-4">
                        <h1 className="text-2xl font-bold text-white">StellarEye</h1>
                        <div className="px-3 py-1 rounded-full text-sm bg-green-600">
                            Ready
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        {/* Background selector */}
                        <div className="flex items-center space-x-2">
                            <label className="text-sm text-gray-300">Background:</label>
                            <select
                                value={backgroundType}
                                onChange={(e) => setBackgroundType(e.target.value)}
                                className="bg-gray-700 text-white px-3 py-1 rounded text-sm border border-gray-600 focus:border-blue-500 focus:outline-none"
                            >
                                {Object.entries(backgroundConfigs).map(([key, config]) => (
                                    <option key={key} value={key}>
                                        {config.name}
                                    </option>
                                ))}
                            </select>
                        </div>

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

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden min-h-0">
                {/* Object List Sidebar */}
                <div className="w-80 bg-gray-800 border-r border-gray-700 overflow-hidden flex-shrink-0 h-full">
                    <div className="h-full flex flex-col">
                        <div className="p-4 border-b border-gray-700 flex-shrink-0">
                            <h2 className="text-lg font-semibold text-white">
                                Objects ({filteredObjects.length}/{celestialObjects.length})
                            </h2>

                            {/* Search Bar */}
                            <div className="mt-3 relative">
                                <input
                                    type="text"
                                    placeholder="Search objects, types, constellations..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full px-3 py-2 pr-8 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white text-sm"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>

                            {/* Debug Info */}
                            {process.env.NODE_ENV === 'development' && (
                                <div className="mt-2 space-y-1">
                                    <button
                                        onClick={() => {
                                            console.log('All objects:', celestialObjects)
                                            console.log('Filtered objects:', filteredObjects)
                                            console.log('Background type:', backgroundType)

                                            // Show object types breakdown
                                            const typeBreakdown = celestialObjects.reduce((acc, obj) => {
                                                acc[obj.type] = (acc[obj.type] || 0) + 1
                                                return acc
                                            }, {} as Record<string, number>)
                                            console.log('Object types:', typeBreakdown)
                                        }}
                                        className="text-xs bg-gray-600 hover:bg-gray-500 px-2 py-1 rounded text-white block"
                                    >
                                        🐛 Debug Objects
                                    </button>

                                    {/* Show current stats */}
                                    <div className="text-xs text-gray-400 space-y-1">
                                        <div>Total: {celestialObjects.length} | Filtered: {filteredObjects.length}</div>
                                        <div>Background: {backgroundType}</div>
                                        {searchQuery && <div>Search: "{searchQuery}"</div>}
                                    </div>
                                </div>
                            )}

                            {/* Object Type Filter */}
                            <div className="mt-3">
                                <div className="flex flex-wrap gap-1">
                                    {['all', 'star', 'planet', 'exoplanet', 'galaxy', 'nebula'].map(type => {
                                        const count = type === 'all'
                                            ? celestialObjects.length
                                            : celestialObjects.filter(obj => obj.type === type).length
                                        return (
                                            <button
                                                key={type}
                                                onClick={() => setSearchQuery(type === 'all' ? '' : type)}
                                                className={`px-2 py-1 rounded text-xs transition-colors ${(type === 'all' && !searchQuery) || searchQuery === type
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                                                    }`}
                                            >
                                                {type === 'all' ? 'All' : type} ({count})
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Background info */}
                            <div className="mt-3 p-3 bg-gray-700 rounded-lg">
                                <h3 className="text-sm font-medium text-white mb-1">
                                    {backgroundConfigs[backgroundType as keyof typeof backgroundConfigs]?.name}
                                </h3>
                                <p className="text-xs text-gray-300">
                                    {backgroundConfigs[backgroundType as keyof typeof backgroundConfigs]?.description}
                                </p>
                                <p className="text-xs text-blue-400 mt-1">
                                    Coordinate System: {backgroundConfigs[backgroundType as keyof typeof backgroundConfigs]?.coordinateSystem}
                                </p>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4">
                            <div className="space-y-2">
                                {filteredObjects.map((obj, index) => (
                                    <div
                                        key={obj.id || index}
                                        onClick={() => {
                                            handleObjectSelect(obj)
                                            if (viewMode === 'map') {
                                                setShowInfoBar(true)
                                            }
                                        }}
                                        className={`p-3 rounded-lg cursor-pointer transition-colors ${selectedObject?.id === obj.id ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
                                            }`}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="text-2xl flex-shrink-0">
                                                {obj.type === 'star' ? '⭐' :
                                                    obj.type === 'galaxy' ? '🌌' :
                                                        obj.type === 'planet' ? '🪐' :
                                                            obj.type === 'exoplanet' ? '🌍' :
                                                                obj.type === 'nebula' ? '🌸' : '✨'}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-white truncate">{obj.name}</p>
                                                <p className="text-sm text-gray-300 capitalize">{obj.type}</p>
                                                {obj.constellation && (
                                                    <p className="text-xs text-gray-400 truncate">{obj.constellation}</p>
                                                )}
                                                <p className="text-xs text-blue-400">
                                                    RA: {obj.ra?.toFixed(2)}° Dec: {obj.dec?.toFixed(2)}°
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Display Area */}
                <div className="flex-1 flex flex-col relative">
                    {viewMode === 'map' ? (
                        <div className="flex-1 relative" style={{ minHeight: '600px' }}>
                            <SpaceTileMap
                                celestialObjects={filteredObjects}
                                onObjectClick={handleObjectSelect}
                                selectedObject={selectedObject}
                                backgroundType={backgroundType}
                            />

                            {/* Coordinate update notification */}
                            {showCoordinateUpdate && (
                                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-pulse">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                                        <span className="text-sm font-medium">
                                            Coordinates updated for {backgroundConfigs[backgroundType as keyof typeof backgroundConfigs]?.name}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Info bar toggle hint */}
                            {selectedObject && !showInfoBar && (
                                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 bg-opacity-90 text-white px-4 py-2 rounded-lg shadow-lg z-30">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm">
                                            {selectedObject.name} selected
                                        </span>
                                        <button
                                            onClick={() => setShowInfoBar(true)}
                                            className="text-blue-400 hover:text-blue-300 text-sm underline"
                                        >
                                            Show Details
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Object Info Bar */}
                            {showInfoBar && selectedObject && (
                                <div
                                    className="absolute bottom-0 left-0 right-0 bg-gray-900 bg-opacity-95 backdrop-blur-sm border-t border-gray-700 z-40 transition-transform duration-300 ease-out"
                                    style={{
                                        animation: 'slideUp 0.3s ease-out'
                                    }}
                                >
                                    <div className="p-4">
                                        {/* Header with close button */}
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="text-3xl">
                                                    {selectedObject.type === 'star' ? '⭐' :
                                                        selectedObject.type === 'galaxy' ? '🌌' :
                                                            selectedObject.type === 'planet' ? '🪐' :
                                                                selectedObject.type === 'exoplanet' ? '� ' :
                                                                    selectedObject.type === 'nebula' ? '🌸' : '✨'}
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold text-white">{selectedObject.name}</h3>
                                                    <p className="text-sm text-gray-300 capitalize">
                                                        {selectedObject.type}
                                                        {selectedObject.constellation && ` • ${selectedObject.constellation}`}
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setShowInfoBar(false)}
                                                className="text-gray-400 hover:text-white transition-colors p-2"
                                            >
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>

                                        {/* Object details grid */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                                            {/* Basic Properties */}
                                            <div className="space-y-3">
                                                <h4 className="text-sm font-semibold text-blue-400 uppercase tracking-wide">Basic Properties</h4>
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-400">Coordinates:</span>
                                                        <span className="text-white">RA {selectedObject.ra?.toFixed(3)}°, Dec {selectedObject.dec?.toFixed(3)}°</span>
                                                    </div>
                                                    {selectedObject.magnitude !== undefined && (
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-400">Magnitude:</span>
                                                            <span className="text-white">{selectedObject.magnitude}</span>
                                                        </div>
                                                    )}
                                                    {getObjectDetails(selectedObject).spectralClass && (
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-400">Type/Class:</span>
                                                            <span className="text-white">{getObjectDetails(selectedObject).spectralClass}</span>
                                                        </div>
                                                    )}
                                                    {getObjectDetails(selectedObject).distance && (
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-400">Distance:</span>
                                                            <span className="text-white">{getObjectDetails(selectedObject).distance}</span>
                                                        </div>
                                                    )}
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-400">Survey:</span>
                                                        <span className="text-white">{backgroundConfigs[backgroundType as keyof typeof backgroundConfigs]?.coordinateSystem}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Physical Properties */}
                                            <div className="space-y-3">
                                                <h4 className="text-sm font-semibold text-blue-400 uppercase tracking-wide">Physical Properties</h4>
                                                <div className="space-y-2 text-sm">
                                                    {getObjectDetails(selectedObject).temperature && (
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-400">Temperature:</span>
                                                            <span className="text-white">{getObjectDetails(selectedObject).temperature}</span>
                                                        </div>
                                                    )}
                                                    {getObjectDetails(selectedObject).mass && (
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-400">Mass:</span>
                                                            <span className="text-white">{getObjectDetails(selectedObject).mass}</span>
                                                        </div>
                                                    )}
                                                    {getObjectDetails(selectedObject).radius && (
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-400">Radius:</span>
                                                            <span className="text-white">{getObjectDetails(selectedObject).radius}</span>
                                                        </div>
                                                    )}
                                                    {getObjectDetails(selectedObject).luminosity && (
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-400">Luminosity:</span>
                                                            <span className="text-white">{getObjectDetails(selectedObject).luminosity}</span>
                                                        </div>
                                                    )}
                                                    {getObjectDetails(selectedObject).age && (
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-400">Age:</span>
                                                            <span className="text-white">{getObjectDetails(selectedObject).age}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Description and Facts */}
                                            <div className="space-y-3">
                                                <h4 className="text-sm font-semibold text-blue-400 uppercase tracking-wide">About</h4>
                                                <div className="space-y-3">
                                                    {getObjectDetails(selectedObject).description && (
                                                        <p className="text-sm text-gray-300 leading-relaxed">
                                                            {getObjectDetails(selectedObject).description}
                                                        </p>
                                                    )}
                                                    {getObjectDetails(selectedObject).facts && (
                                                        <div>
                                                            <h5 className="text-xs font-medium text-gray-400 mb-2">Key Facts:</h5>
                                                            <ul className="space-y-1">
                                                                {getObjectDetails(selectedObject).facts.map((fact: string, index: number) => (
                                                                    <li key={index} className="text-xs text-gray-300 flex items-start">
                                                                        <span className="text-blue-400 mr-2">•</span>
                                                                        {fact}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action buttons */}
                                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700">
                                            <div className="flex items-center space-x-4">
                                                <button
                                                    onClick={() => setViewMode('gallery')}
                                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                                                >
                                                    View Images
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        // Center map on object
                                                        console.log('Center on object:', selectedObject.name)
                                                    }}
                                                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors"
                                                >
                                                    Center on Map
                                                </button>
                                            </div>
                                            <div className="text-xs text-gray-400">
                                                Click object on map or sidebar to view details
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        /* Simple Gallery */
                        <div className="flex-1 flex overflow-hidden">
                            {/* Image Thumbnails */}
                            <div className="w-64 bg-gray-800 border-r border-gray-700 flex-shrink-0 flex flex-col h-full">
                                <div className="p-4 border-b border-gray-700 flex-shrink-0">
                                    <h3 className="text-lg font-semibold text-white mb-2">
                                        {selectedObject ? `${selectedObject.name} Images` : 'Featured Images'}
                                    </h3>
                                </div>
                                <div className="flex-1 overflow-y-auto p-4">
                                    <div className="space-y-2">
                                        {objectImages.map((image) => (
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
                                                />
                                                <div className="p-2">
                                                    <p className="text-sm font-medium text-white truncate">{image.telescope}</p>
                                                    <p className="text-xs text-gray-400 truncate">{image.wavelength}</p>
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
                                        <div className="flex-1 relative bg-black">
                                            <img
                                                src={selectedImage.url}
                                                alt={selectedImage.title}
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                        <div className="bg-gray-800 border-t border-gray-700 p-4">
                                            <h2 className="text-xl font-bold text-white mb-2">{selectedImage.title}</h2>
                                            <p className="text-gray-300 text-sm mb-4">{selectedImage.description}</p>
                                            <div className="grid grid-cols-2 gap-4 text-xs">
                                                <div>
                                                    <p className="text-gray-400">Telescope</p>
                                                    <p className="text-white font-medium">{selectedImage.telescope}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-400">Wavelength</p>
                                                    <p className="text-white font-medium">{selectedImage.wavelength}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex-1 flex items-center justify-center bg-gray-800">
                                        <p className="text-gray-400">Select an image to view</p>
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

export default SimpleExplorePage