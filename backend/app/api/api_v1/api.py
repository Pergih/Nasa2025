from fastapi import APIRouter
from app.api.api_v1.endpoints import search, objects, satellites, exoplanets, images

api_router = APIRouter()

api_router.include_router(search.router, prefix="/search", tags=["search"])
api_router.include_router(objects.router, prefix="/objects", tags=["objects"])
api_router.include_router(satellites.router, prefix="/satellites", tags=["satellites"])
api_router.include_router(exoplanets.router, prefix="/exoplanets", tags=["exoplanets"])
api_router.include_router(images.router, prefix="/images", tags=["images"])