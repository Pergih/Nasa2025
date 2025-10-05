import React, { useState, useEffect } from 'react'
import { imageAPI } from '@/services/imageAPI'

interface PerformanceStats {
  memoryEntries: number
  preloadedImages: number
  loadTime: number
  cacheHitRate: number
}

const PerformanceMonitor: React.FC = () => {
  const [stats, setStats] = useState<PerformanceStats>({
    memoryEntries: 0,
    preloadedImages: 0,
    loadTime: 0,
    cacheHitRate: 0
  })
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const updateStats = () => {
      const cacheStats = imageAPI.getCacheStats()
      setStats(prev => ({
        ...prev,
        memoryEntries: cacheStats.memoryEntries,
        preloadedImages: cacheStats.preloadedImages
      }))
    }

    // Update stats every 5 seconds
    const interval = setInterval(updateStats, 5000)
    updateStats() // Initial update

    return () => clearInterval(interval)
  }, [])

  const clearCache = async () => {
    await imageAPI.clearCache()
    // Cache cleared
  }

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 left-4 bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-lg text-xs z-50 opacity-50 hover:opacity-100 transition-opacity"
        title="Show Performance Stats"
      >
        📊
      </button>
    )
  }

  return (
    <div className="fixed bottom-4 left-4 bg-gray-900 bg-opacity-95 text-white p-4 rounded-lg text-xs z-50 max-w-64">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold">Performance Stats</h4>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Memory Cache:</span>
          <span className="text-green-400">{stats.memoryEntries} entries</span>
        </div>
        
        <div className="flex justify-between">
          <span>Preloaded:</span>
          <span className="text-blue-400">{stats.preloadedImages} images</span>
        </div>
        
        <div className="flex justify-between">
          <span>Load Time:</span>
          <span className="text-yellow-400">{stats.loadTime}ms</span>
        </div>
        
        <div className="flex justify-between">
          <span>Cache Hit Rate:</span>
          <span className="text-purple-400">{stats.cacheHitRate}%</span>
        </div>
      </div>

      <div className="mt-3 pt-2 border-t border-gray-700">
        <button
          onClick={clearCache}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-1 px-2 rounded text-xs transition-colors"
        >
          Clear Cache
        </button>
      </div>

      <div className="mt-2 text-xs text-gray-400">
        <p>🚀 Optimized image loading</p>
        <p>💾 IndexedDB + Memory cache</p>
        <p>⚡ Background preloading</p>
      </div>
    </div>
  )
}

export default PerformanceMonitor