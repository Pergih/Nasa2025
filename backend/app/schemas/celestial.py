from pydantic import BaseModel, Field
from typing import Optional, List
from enum import Enum

class ObjectType(str, Enum):
    STAR = "star"
    GALAXY = "galaxy"
    NEBULA = "nebula"
    SATELLITE = "satellite"
    EXOPLANET = "exoplanet"
    CLUSTER = "cluster"

class CelestialObjectBase(BaseModel):
    name: str = Field(..., description="Object name")
    type: ObjectType = Field(..., description="Object type")
    ra: float = Field(..., description="Right Ascension in degrees")
    dec: float = Field(..., description="Declination in degrees")
    
class CelestialObjectResponse(CelestialObjectBase):
    id: Optional[str] = Field(None, description="Unique identifier")
    magnitude: Optional[float] = Field(None, description="Visual magnitude")
    distance: Optional[float] = Field(None, description="Distance in light years")
    constellation: Optional[str] = Field(None, description="Constellation")
    spectral_type: Optional[str] = Field(None, description="Spectral type (for stars)")
    status: Optional[str] = Field(None, description="Status (for satellites)")
    habitable_zone: Optional[bool] = Field(None, description="In habitable zone (for exoplanets)")
    
    class Config:
        from_attributes = True

class SearchResponse(BaseModel):
    results: List[CelestialObjectResponse]
    total: int
    query: str
    
class ImageResponse(BaseModel):
    url: str
    survey: str
    wavelength: str
    telescope: str
    description: str
    timestamp: str