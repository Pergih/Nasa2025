import React, { useState, useRef, useEffect } from 'react'

interface ImageViewerProps {
  src: string
  alt: string
  className?: string
}

const ImageViewer: React.FC<ImageViewerProps> = ({ src, alt, className = '' }) => {
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [isLoaded, setIsLoaded] = useState(false)
  const [lastTouchDistance, setLastTouchDistance] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  // Reset view when image changes
  useEffect(() => {
    setScale(1)
    setPosition({ x: 0, y: 0 })
    setIsLoaded(false)
  }, [src])

  // Essential keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target !== document.body) return // Only when not in input fields
      
      switch (e.key) {
        case 'f':
        case 'F':
          e.preventDefault()
          if (e.shiftKey) {
            toggleFullscreen()
          } else {
            fitToScreen()
          }
          break
        case 'Escape':
          if (isFullscreen) {
            e.preventDefault()
            toggleFullscreen()
          }
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isFullscreen])

  // Handle wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    
    if (!containerRef.current || !imageRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    // Calculate zoom
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1
    const newScale = Math.max(0.1, Math.min(10, scale * zoomFactor))

    // Calculate new position to zoom towards mouse
    const scaleChange = newScale / scale
    const newX = mouseX - (mouseX - position.x) * scaleChange
    const newY = mouseY - (mouseY - position.y) * scaleChange

    setScale(newScale)
    setPosition({ x: newX, y: newY })
  }

  // Handle mouse down for dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    })
  }

  // Handle mouse move for dragging
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    })
  }

  // Handle mouse up
  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Handle double click to reset
  const handleDoubleClick = () => {
    setScale(1)
    setPosition({ x: 0, y: 0 })
  }



  const fitToScreen = () => {
    if (!containerRef.current || !imageRef.current) return

    const containerRect = containerRef.current.getBoundingClientRect()
    
    const scaleX = containerRect.width / imageRef.current.naturalWidth
    const scaleY = containerRect.height / imageRef.current.naturalHeight
    const newScale = Math.min(scaleX, scaleY, 1) // Don't scale up beyond 100%

    setScale(newScale)
    setPosition({ x: 0, y: 0 })
  }

  // Touch event handlers for mobile
  const getTouchDistance = (touches: React.TouchList) => {
    if (touches.length < 2) return 0
    const touch1 = touches[0]
    const touch2 = touches[1]
    return Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) + 
      Math.pow(touch2.clientY - touch1.clientY, 2)
    )
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      // Single touch - start dragging
      setIsDragging(true)
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y
      })
    } else if (e.touches.length === 2) {
      // Two touches - start pinch zoom
      setLastTouchDistance(getTouchDistance(e.touches))
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault()
    
    if (e.touches.length === 1 && isDragging) {
      // Single touch - drag
      setPosition({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y
      })
    } else if (e.touches.length === 2) {
      // Two touches - pinch zoom
      const currentDistance = getTouchDistance(e.touches)
      if (lastTouchDistance > 0) {
        const scaleChange = currentDistance / lastTouchDistance
        const newScale = Math.max(0.1, Math.min(10, scale * scaleChange))
        setScale(newScale)
      }
      setLastTouchDistance(currentDistance)
    }
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
    setLastTouchDistance(0)
  }

  // Fullscreen functionality
  const toggleFullscreen = () => {
    if (!containerRef.current) return

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true)
      }).catch(err => {
        // Fullscreen failed
      })
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false)
      })
    }
  }

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  return (
    <div className={`relative overflow-hidden bg-black ${className}`}>
      {/* Image Container */}
      <div
        ref={containerRef}
        className="w-full h-full relative cursor-grab active:cursor-grabbing touch-none"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onDoubleClick={handleDoubleClick}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <img
          ref={imageRef}
          src={src}
          alt={alt}
          className="absolute top-1/2 left-1/2 max-w-none select-none"
          style={{
            transform: `translate(-50%, -50%) translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.1s ease-out'
          }}
          onLoad={() => setIsLoaded(true)}
          onError={(e) => {
            console.error('Image failed to load:', src)
            const target = e.target as HTMLImageElement
            target.style.display = 'none'
          }}
          draggable={false}
        />

        {/* Loading indicator */}
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-white text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
              <div className="text-sm">Loading image...</div>
            </div>
          </div>
        )}
      </div>

      {/* Essential Controls */}
      <div className="absolute top-4 right-4 flex space-x-2 z-10">
        <button
          onClick={fitToScreen}
          className="bg-black bg-opacity-70 hover:bg-opacity-90 text-white px-3 py-2 rounded-lg transition-colors text-sm"
          title="Fit to Screen (F)"
        >
          Fit
        </button>
        
        <button
          onClick={toggleFullscreen}
          className="bg-black bg-opacity-70 hover:bg-opacity-90 text-white px-3 py-2 rounded-lg transition-colors text-sm"
          title="Fullscreen (Shift+F)"
        >
          {isFullscreen ? 'Exit' : 'Full'}
        </button>
      </div>

      {/* Zoom Info - only show when not at 100% */}
      {scale !== 1 && (
        <div className="absolute bottom-4 right-4 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs z-10">
          {Math.round(scale * 100)}%
        </div>
      )}

      {/* Simple Instructions - only show initially */}
      {scale === 1 && position.x === 0 && position.y === 0 && (
        <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded text-xs z-10">
          Scroll to zoom • Drag to pan
        </div>
      )}
    </div>
  )
}

export default ImageViewer