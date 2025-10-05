from fastapi import APIRouter, Query, HTTPException
from fastapi.responses import StreamingResponse
from typing import List
import logging
import httpx
import asyncio
from urllib.parse import urlparse

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/skyview")
async def get_skyview_image(
    ra: float = Query(..., description="Right Ascension in degrees"),
    dec: float = Query(..., description="Declination in degrees"),
    survey: str = Query("DSS2 Red", description="Survey name"),
    size: float = Query(0.5, description="Image size in degrees"),
):
    """
    Get astronomical image from NASA SkyView.
    
    - **ra**: Right Ascension in degrees
    - **dec**: Declination in degrees  
    - **survey**: Survey name (DSS2 Red, 2MASS-J, etc.)
    - **size**: Image size in degrees
    """
    try:
        # For now, return a placeholder response
        # Will be replaced with actual NASA SkyView integration
        
        image_url = f"https://skyview.gsfc.nasa.gov/current/cgi/runquery.pl?Position={ra},{dec}&Survey={survey}&Pixels=400,400&Size={size},{size}&Return=JPEG"
        
        return {
            "url": image_url,
            "survey": survey,
            "coordinates": {"ra": ra, "dec": dec},
            "size": size,
            "format": "JPEG"
        }
        
    except Exception as e:
        logger.error(f"Error getting SkyView image: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/gallery/{object_id}")
async def get_object_image_gallery(object_id: str):
    """Get multi-wavelength image gallery for an object."""
    try:
        # Sample gallery data - will be replaced with real implementation
        gallery = {
            "object_id": object_id,
            "images": [
                {
                    "url": f"https://example.com/images/{object_id}_optical.jpg",
                    "survey": "DSS2 Red",
                    "wavelength": "650nm",
                    "telescope": "Palomar Observatory",
                    "description": "Optical red light image"
                },
                {
                    "url": f"https://example.com/images/{object_id}_infrared.jpg", 
                    "survey": "2MASS-J",
                    "wavelength": "1.25μm",
                    "telescope": "2MASS",
                    "description": "Near-infrared J-band image"
                }
            ]
        }
        
        return gallery
        
    except Exception as e:
        logger.error(f"Error getting image gallery: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/proxy")
async def proxy_nasa_image(
    url: str = Query(..., description="NASA image URL to proxy"),
):
    """
    Proxy NASA images to avoid CORS issues.
    
    - **url**: The NASA image URL to fetch
    """
    try:
        # Validate that it's a NASA domain
        parsed_url = urlparse(url)
        nasa_domains = [
            'webbtelescope.org',
            'hubblesite.org', 
            'photojournal.jpl.nasa.gov',
            'chandra.harvard.edu',
            'apod.nasa.gov',
            'images-api.nasa.gov',
            'science.nasa.gov',
            'stsci-opo.org',
            'static.uahirise.org',
            'uahirise.org',
            'lroc.sese.asu.edu',
            'spitzer.caltech.edu',
            'missionjuno.swri.edu'
        ]
        
        if not any(domain in parsed_url.netloc for domain in nasa_domains):
            raise HTTPException(status_code=400, detail="Only NASA domains are allowed")
        
        # Fetch the image with proper headers
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(
                url,
                headers={
                    'User-Agent': 'StellarEye/1.0 (NASA Space Apps Challenge)',
                    'Accept': 'image/*,*/*;q=0.8',
                },
                follow_redirects=True
            )
            
            if response.status_code != 200:
                raise HTTPException(
                    status_code=response.status_code, 
                    detail=f"Failed to fetch image: {response.status_code}"
                )
            
            # Stream the image back with proper headers
            def generate():
                for chunk in response.iter_bytes(chunk_size=8192):
                    yield chunk
            
            return StreamingResponse(
                generate(),
                media_type=response.headers.get('content-type', 'image/jpeg'),
                headers={
                    'Cache-Control': 'public, max-age=86400',  # Cache for 24 hours
                    'Access-Control-Allow-Origin': '*',
                }
            )
            
    except httpx.TimeoutException:
        logger.error(f"Timeout fetching image: {url}")
        raise HTTPException(status_code=504, detail="Image fetch timeout")
    except Exception as e:
        logger.error(f"Error proxying image {url}: {e}")
        raise HTTPException(status_code=500, detail="Failed to proxy image")