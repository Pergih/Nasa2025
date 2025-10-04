from fastapi import APIRouter, Query, HTTPException
from typing import List, Optional
import logging

from app.nasa.data_manager import nasa_data_manager
from app.schemas.celestial import CelestialObjectResponse

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/", response_model=List[CelestialObjectResponse])
async def get_objects(
    ra_min: Optional[float] = Query(None, description="Minimum Right Ascension"),
    ra_max: Optional[float] = Query(None, description="Maximum Right Ascension"),
    dec_min: Optional[float] = Query(None, description="Minimum Declination"),
    dec_max: Optional[float] = Query(None, description="Maximum Declination"),
    types: Optional[List[str]] = Query(None, description="Object types to include"),
    limit: int = Query(100, ge=1, le=1000, description="Maximum number of results"),
):
    """
    Get celestial objects in a specific region or all objects.
    
    - **ra_min/ra_max**: Right Ascension range in degrees (0-360)
    - **dec_min/dec_max**: Declination range in degrees (-90 to 90)
    - **types**: Filter by object types (star, galaxy, nebula, satellite, exoplanet)
    - **limit**: Maximum number of results
    """
    try:
        if ra_min is not None and ra_max is not None and dec_min is not None and dec_max is not None:
            results = await nasa_data_manager.get_objects_in_region(
                ra_min, ra_max, dec_min, dec_max, types, limit
            )
        else:
            # Return all objects if no region specified
            results = await nasa_data_manager.search_objects("", limit=limit)
        
        logger.info(f"Returning {len(results)} objects")
        return results
        
    except Exception as e:
        logger.error(f"Error getting objects: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/{object_id}", response_model=CelestialObjectResponse)
async def get_object_details(object_id: str):
    """Get detailed information about a specific object."""
    try:
        # For now, search by ID in our sample data
        results = await nasa_data_manager.search_objects(object_id, limit=1)
        
        if not results:
            raise HTTPException(status_code=404, detail="Object not found")
        
        return results[0]
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting object details: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")