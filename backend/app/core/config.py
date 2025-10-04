from pydantic_settings import BaseSettings
from typing import List, Optional
import os

class Settings(BaseSettings):
    # API Settings
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "StellarEye"
    VERSION: str = "1.0.0"
    DESCRIPTION: str = "NASA Space Apps Challenge 2025 - Backend API"
    
    # Environment
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    
    # CORS
    BACKEND_CORS_ORIGINS: str = "http://localhost:3000,http://localhost:5173,http://127.0.0.1:3000,http://127.0.0.1:5173"
    
    @property
    def cors_origins(self) -> List[str]:
        return [origin.strip() for origin in self.BACKEND_CORS_ORIGINS.split(",")]
    
    # Database
    DATABASE_URL: Optional[str] = None
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379"
    
    # NASA API Keys
    NASA_API_KEY: str = "DEMO_KEY"
    
    # External APIs
    SKYVIEW_BASE_URL: str = "https://skyview.gsfc.nasa.gov/current/cgi/runquery.pl"
    EXOPLANET_ARCHIVE_URL: str = "https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI"
    JPL_HORIZONS_URL: str = "https://ssd.jpl.nasa.gov/api/horizons.api"
    
    # Cache settings
    CACHE_TTL: int = 300  # 5 minutes
    IMAGE_CACHE_TTL: int = 3600  # 1 hour
    
    # Rate limiting
    RATE_LIMIT_PER_MINUTE: int = 60
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()