from fastapi import APIRouter, Query, HTTPException
from typing import List
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/")
async def get_exoplanets(
    habitable_only: bool = Query(False, description="Only return potentially habitable planets"),
    limit: int = Query(50, ge=1, le=200, description="Maximum number of results"),
):
    """
    Get confirmed exoplanets.
    
    - **habitable_only**: Filter to only potentially habitable planets
    - **limit**: Maximum number of results
    """
    try:
        # Sample exoplanet data - will be replaced with NASA Exoplanet Archive
        exoplanets = [
            {
                "id": "proxima_b",
                "name": "Proxima Centauri b",
                "host_star": "Proxima Centauri",
                "ra": 217.429,
                "dec": -62.679,
                "distance": 4.24,
                "planet_type": "Terrestrial",
                "habitable_zone": True,
                "discovery_year": 2016
            },
            {
                "id": "trappist_1e",
                "name": "TRAPPIST-1e", 
                "host_star": "TRAPPIST-1",
                "ra": 346.622,
                "dec": -5.041,
                "distance": 40,
                "planet_type": "Terrestrial",
                "habitable_zone": True,
                "discovery_year": 2017
            },
            {
                "id": "kepler_452b",
                "name": "Kepler-452b",
                "host_star": "Kepler-452",
                "ra": 292.258,
                "dec": 44.279,
                "distance": 1402,
                "planet_type": "Super Earth",
                "habitable_zone": True,
                "discovery_year": 2015
            }
        ]
        
        # Filter by habitable zone if requested
        if habitable_only:
            exoplanets = [p for p in exoplanets if p.get("habitable_zone", False)]
        
        # Apply limit
        exoplanets = exoplanets[:limit]
        
        return {"exoplanets": exoplanets, "count": len(exoplanets)}
        
    except Exception as e:
        logger.error(f"Error getting exoplanets: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")