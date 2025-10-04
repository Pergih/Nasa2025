import React, { useState, useRef, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { useCelestialStore } from '@/stores/celestialStore'
import { celestialAPI, CelestialObjectAPI } from '@/services/api'

const SearchBar: React.FC = () => {
  const { searchQuery, setSearchQuery, setSelectedObject, setCenter } = useCelestialStore()
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState(searchQuery)
  const [searchResults, setSearchResults] = useState<CelestialObjectAPI[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setInputValue(searchQuery)
  }, [searchQuery])

  const handleSearch = async (query: string) => {
    setInputValue(query)
    setSearchQuery(query)
    setIsOpen(query.length > 0)
    
    if (query.length > 2) {
      setIsLoading(true)
      try {
        const results = await celestialAPI.search(query, 10)
        setSearchResults(results)
      } catch (error) {
        console.error('Search failed:', error)
        setSearchResults([])
      } finally {
        setIsLoading(false)
      }
    } else {
      setSearchResults([])
    }
  }

  const handleSelectObject = (object: CelestialObjectAPI) => {
    setSelectedObject({
      id: object.id,
      name: object.name,
      type: object.type,
      ra: object.ra,
      dec: object.dec,
      magnitude: object.magnitude,
      distance: object.distance,
      constellation: object.constellation,
      status: object.status as 'active' | 'retired',
      spectralType: object.spectral_type,
      habitableZone: object.habitable_zone
    })
    // Convert RA/Dec to map coordinates (simplified)
    setCenter([object.dec, object.ra])
    setInputValue(object.name)
    setIsOpen(false)
    inputRef.current?.blur()
  }

  const clearSearch = () => {
    setInputValue('')
    setSearchQuery('')
    setIsOpen(false)
    inputRef.current?.focus()
  }

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setIsOpen(inputValue.length > 0)}
          placeholder="Search stars, galaxies, satellites, exoplanets..."
          className="w-full pl-10 pr-10 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {inputValue && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-400">
              <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
              Searching the cosmos...
            </div>
          ) : searchResults && searchResults.length > 0 ? (
            <div className="py-2">
              {searchResults.map((object: any, index: number) => (
                <button
                  key={`${object.name}-${index}`}
                  onClick={() => handleSelectObject(object)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-700 transition-colors border-b border-gray-700 last:border-b-0"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-white">{object.name}</div>
                      <div className="text-sm text-gray-400">
                        {object.type} • {object.constellation && `${object.constellation} • `}
                        RA: {object.ra?.toFixed(2)}° Dec: {object.dec?.toFixed(2)}°
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {object.distance && `${object.distance} ly`}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : inputValue.length > 0 ? (
            <div className="p-4 text-center text-gray-400">
              No objects found for "{inputValue}"
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}

export default SearchBar