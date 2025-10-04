from fastapi import APIRouter, Query, HTTPException
from typing import List, Optional
import logging

from app.nasa.data_manager import nasa_data_manager
from app.schemas.celestial import CelestialObjectResponse

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/", response_model=List[CelestialObjectResponse])
async def search_objects(
    q: str = Query(..., min_length=2, description="Search query"),
    limit: int = Query(10, ge=1, le=50, description="Maximum number of results"),
):
    """
    Search for celestial objects by name, type, or constellation.
    
    - **q**: Search query (minimum 2 characters)
    - **limit**: Maximum number of results (1-50)
    """
    try:
        logger.info(f"Searching for objects with query: '{q}'")
        
        results = await nasa_data_manager.search_objects(q, limit=limit)
        
        logger.info(f"Found {len(results)} objects for query '{q}'")
        return results
        
    except Exception as e:
        logger.error(f"Error searching objects: {e}")
        raise HTTPException(status_code=500, detail="Internal server error during search")

@router.get("/suggestions")
async def get_search_suggestions(
    q: str = Query(..., min_length=1, description="Partial search query"),
    limit: int = Query(5, ge=1, le=10, description="Maximum number of suggestions"),
):
    """
    Get search suggestions for autocomplete.
    
    - **q**: Partial search query
    - **limit**: Maximum number of suggestions
    """
    try:
        suggestions = await nasa_data_manager.get_search_suggestions(q, limit=limit)
        return {"suggestions": suggestions}
        
    except Exception as e:
        logger.error(f"Error getting search suggestions: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")