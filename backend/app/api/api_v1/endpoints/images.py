from fastapi import APIRouter, Query, HTTPException
from typing import List
import logging

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