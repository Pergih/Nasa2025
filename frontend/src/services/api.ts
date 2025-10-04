import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  timeout: 10000,
})

export interface CelestialObjectAPI {
  id: string
  name: string
  type: 'star' | 'galaxy' | 'nebula' | 'satellite' | 'exoplanet'
  ra: number
  dec: number
  magnitude?: number
  distance?: number
  constellation?: string
  status?: string
  spectral_type?: string
  habitable_zone?: boolean
}

export const celestialAPI = {
  // Search for celestial objects
  search: async (query: string, limit: number = 10): Promise<CelestialObjectAPI[]> => {
    try {
      const response = await api.get('/search/', {
        params: { q: query, limit }
      })
      return response.data
    } catch (error) {
      console.error('Search API error:', error)
      return []
    }
  },

  // Get search suggestions
  getSuggestions: async (query: string, limit: number = 5): Promise<string[]> => {
    try {
      const response = await api.get('/suggestions/', {
        params: { q: query, limit }
      })
      return response.data
    } catch (error) {
      console.error('Suggestions API error:', error)
      return []
    }
  },

  // Get objects in a region
  getObjectsInRegion: async (
    ra_min: number,
    ra_max: number,
    dec_min: number,
    dec_max: number,
    object_types?: string[],
    limit: number = 100
  ): Promise<CelestialObjectAPI[]> => {
    try {
      const response = await api.get('/objects/region/', {
        params: {
          ra_min,
          ra_max,
          dec_min,
          dec_max,
          object_types: object_types?.join(','),
          limit
        }
      })
      return response.data
    } catch (error) {
      console.error('Region API error:', error)
      return []
    }
  },

  // Health check
  healthCheck: async (): Promise<boolean> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/health`)
      return response.status === 200
    } catch (error) {
      console.error('Health check failed:', error)
      return false
    }
  }
}

export default api