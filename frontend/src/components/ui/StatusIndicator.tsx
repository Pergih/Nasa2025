import React, { useEffect, useState } from 'react'
import { Wifi, WifiOff } from 'lucide-react'
import { celestialAPI } from '@/services/api'

const StatusIndicator: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null)
  const [lastCheck, setLastCheck] = useState<Date | null>(null)

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const healthy = await celestialAPI.healthCheck()
        setIsConnected(healthy)
        setLastCheck(new Date())
      } catch (error) {
        setIsConnected(false)
        setLastCheck(new Date())
      }
    }

    // Check immediately
    checkConnection()

    // Check every 30 seconds
    const interval = setInterval(checkConnection, 30000)

    return () => clearInterval(interval)
  }, [])

  if (isConnected === null) {
    return (
      <div className="flex items-center space-x-2 text-gray-400">
        <div className="animate-spin h-4 w-4 border-2 border-gray-400 border-t-transparent rounded-full"></div>
        <span className="text-sm">Connecting...</span>
      </div>
    )
  }

  return (
    <div className={`flex items-center space-x-2 ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
      {isConnected ? (
        <Wifi className="h-4 w-4" />
      ) : (
        <WifiOff className="h-4 w-4" />
      )}
      <span className="text-sm">
        {isConnected ? 'API Connected' : 'API Offline'}
      </span>
      {lastCheck && (
        <span className="text-xs text-gray-500">
          {lastCheck.toLocaleTimeString()}
        </span>
      )}
    </div>
  )
}

export default StatusIndicator