import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export interface CelestialObject {
  id: string
  name: string
  type: 'star' | 'galaxy' | 'nebula' | 'satellite' | 'exoplanet'
  ra: number
  dec: number
  magnitude?: number
  distance?: number
  constellation?: string
  status?: 'active' | 'retired'
  spectralType?: string
  habitableZone?: boolean
}

export interface MapState {
  center: [number, number] // [lat, lng] - note: we'll convert RA/Dec
  zoom: number
  selectedObject: CelestialObject | null
  searchQuery: string
  layers: {
    stars: boolean
    galaxies: boolean
    nebulae: boolean
    satellites: boolean
    exoplanets: boolean
  }
  sidebarOpen: boolean
  imageGalleryOpen: boolean
}

interface CelestialStore extends MapState {
  // Actions
  setCenter: (center: [number, number]) => void
  setZoom: (zoom: number) => void
  setSelectedObject: (object: CelestialObject | null) => void
  setSearchQuery: (query: string) => void
  toggleLayer: (layer: keyof MapState['layers']) => void
  toggleSidebar: () => void
  toggleImageGallery: () => void
  resetView: () => void
}

const initialState: MapState = {
  center: [0, 0],
  zoom: 2,
  selectedObject: null,
  searchQuery: '',
  layers: {
    stars: true,
    galaxies: true,
    nebulae: true,
    satellites: false,
    exoplanets: false,
  },
  sidebarOpen: false,
  imageGalleryOpen: false,
}

export const useCelestialStore = create<CelestialStore>()(
  devtools(
    (set) => ({
      ...initialState,

      setCenter: (center) => set({ center }),
      
      setZoom: (zoom) => set({ zoom }),
      
      setSelectedObject: (object) => set({ selectedObject: object }),
      
      setSearchQuery: (query) => set({ searchQuery: query }),
      
      toggleLayer: (layer) => set((state) => ({
        layers: {
          ...state.layers,
          [layer]: !state.layers[layer],
        },
      })),
      
      toggleSidebar: () => set((state) => ({
        sidebarOpen: !state.sidebarOpen,
      })),
      
      toggleImageGallery: () => set((state) => ({
        imageGalleryOpen: !state.imageGalleryOpen,
      })),
      
      resetView: () => set({
        center: initialState.center,
        zoom: initialState.zoom,
        selectedObject: null,
      }),
    }),
    {
      name: 'celestial-store',
    }
  )
)