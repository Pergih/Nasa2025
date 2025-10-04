// StellarEye Service Worker for Advanced Image Caching
const CACHE_NAME = 'stellareye-images-v1'
const CACHE_EXPIRY = 24 * 60 * 60 * 1000 // 24 hours

// NASA image domains to cache
const NASA_DOMAINS = [
  'webbtelescope.org',
  'hubblesite.org',
  'photojournal.jpl.nasa.gov',
  'chandra.harvard.edu',
  'apod.nasa.gov',
  'images-api.nasa.gov'
]

// Install event - cache essential resources
self.addEventListener('install', (event) => {
  console.log('🚀 StellarEye Service Worker installing...')
  self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('✅ StellarEye Service Worker activated')
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🧹 Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
})

// Fetch event - intelligent caching strategy
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)
  
  // Only cache NASA images and API responses
  if (isNASAResource(url) || isImageRequest(event.request)) {
    event.respondWith(handleImageRequest(event.request))
  }
})

// Check if URL is from NASA domains
function isNASAResource(url) {
  return NASA_DOMAINS.some(domain => url.hostname.includes(domain))
}

// Check if request is for an image
function isImageRequest(request) {
  return request.destination === 'image' || 
         request.url.match(/\.(jpg|jpeg|png|gif|webp)$/i)
}

// Handle image requests with cache-first strategy
async function handleImageRequest(request) {
  try {
    // Try cache first
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      // Check if cache is still fresh
      const cacheDate = cachedResponse.headers.get('sw-cache-date')
      if (cacheDate && Date.now() - parseInt(cacheDate) < CACHE_EXPIRY) {
        console.log('📦 Cache hit:', request.url.split('/').pop())
        return cachedResponse
      }
    }

    // Fetch from network
    console.log('🌐 Network fetch:', request.url.split('/').pop())
    const networkResponse = await fetch(request)
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME)
      const responseToCache = networkResponse.clone()
      
      // Add cache timestamp
      const headers = new Headers(responseToCache.headers)
      headers.set('sw-cache-date', Date.now().toString())
      
      const modifiedResponse = new Response(responseToCache.body, {
        status: responseToCache.status,
        statusText: responseToCache.statusText,
        headers: headers
      })
      
      cache.put(request, modifiedResponse)
      console.log('💾 Cached:', request.url.split('/').pop())
    }
    
    return networkResponse
  } catch (error) {
    console.warn('❌ Fetch failed:', error)
    
    // Return cached version even if expired
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      console.log('🔄 Serving stale cache:', request.url.split('/').pop())
      return cachedResponse
    }
    
    // Return fallback image
    return new Response('Image not available', { status: 404 })
  }
}

// Message handling for cache management
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.delete(CACHE_NAME).then(() => {
      event.ports[0].postMessage({ success: true })
    })
  }
  
  if (event.data && event.data.type === 'GET_CACHE_SIZE') {
    caches.open(CACHE_NAME).then(cache => {
      cache.keys().then(keys => {
        event.ports[0].postMessage({ size: keys.length })
      })
    })
  }
})