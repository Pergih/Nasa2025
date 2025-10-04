from fastapi import APIRouter, HTTPException
from typing import List
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/positions")
async def get_satellite_positions():
    """Get current positions of active satellites."""
    try:
        # Sample satellite data - will be replaced with real tracking
        satellites = [
            {
                "id": "hubble",
                "name": "Hubble Space Telescope",
                "ra": 150.0,
                "dec": 30.0,
                "altitude": 547,
                "status": "active",
                "last_updated": "2025-10-04T15:00:00Z"
            },
            {
                "id": "jwst", 
                "name": "James Webb Space Telescope",
                "ra": 180.0,
                "dec": -20.0,
                "altitude": 1500000,
                "status": "active",
                "last_updated": "2025-10-04T15:00:00Z"
            }
        ]
        
        return {"satellites": satellites, "count": len(satellites)}
        
    except Exception as e:
        logger.error(f"Error getting satellite positions: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")