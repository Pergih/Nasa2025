"""
Expandable image gallery for celestial objects.
Shows multiple images with metadata like Google Street View.
"""
import requests
import pandas as pd
from typing import Dict, List, Optional
import logging
from datetime import datetime
import json

logger = logging.getLogger(__name__)

class CelestialImageGallery:
    """Manages multiple images and metadata for celestial objects."""
    
    def __init__(self):
        self.image_cache = {}
        
        # Different surveys and their metadata
        self.surveys = {
            'optical': {
                'DSS2 Red': {'wavelength': '650nm', 'telescope': 'Palomar/UK Schmidt', 'description': 'Red optical light'},
                'DSS2 Blue': {'wavelength': '450nm', 'telescope': 'Palomar/UK Schmidt', 'description': 'Blue optical light'},
                'SDSS DR7': {'wavelength': '550nm', 'telescope': 'Sloan Digital Sky Survey', 'description': 'Digital sky survey'},
            },
            'infrared': {
                '2MASS-J': {'wavelength': '1.25μm', 'telescope': '2MASS', 'description': 'Near-infrared J-band'},
                '2MASS-H': {'wavelength': '1.65μm', 'telescope': '2MASS', 'description': 'Near-infrared H-band'},
                '2MASS-K': {'wavelength': '2.17μm', 'telescope': '2MASS', 'description': 'Near-infrared K-band'},
                'WISE 3.4': {'wavelength': '3.4μm', 'telescope': 'WISE', 'description': 'Mid-infrared W1'},
                'WISE 4.6': {'wavelength': '4.6μm', 'telescope': 'WISE', 'description': 'Mid-infrared W2'},
            },
            'xray': {
                'RASS': {'wavelength': '0.1-2.4keV', 'telescope': 'ROSAT', 'description': 'Soft X-ray all-sky survey'},
            },
            'radio': {
                'NVSS': {'wavelength': '20cm', 'telescope': 'VLA', 'description': 'Radio continuum survey'},
                'FIRST': {'wavelength': '20cm', 'telescope': 'VLA', 'description': 'High-resolution radio survey'},
            }
        }
    
    def get_multi_wavelength_gallery(self, obj_name: str, ra: float, dec: float) -> List[Dict]:
        """Get multiple images across different wavelengths with metadata."""
        try:
            cache_key = f"gallery_{obj_name}_{ra:.3f}_{dec:.3f}"
            
            if cache_key in self.image_cache:
                return self.image_cache[cache_key]
            
            gallery_images = []
            
            # Get images from different surveys
            for category, surveys in self.surveys.items():
                for survey_name, metadata in surveys.items():
                    try:
                        image_data = self._fetch_survey_image(ra, dec, survey_name, metadata)
                        if image_data:
                            gallery_images.append({
                                'category': category,
                                'survey': survey_name,
                                'image_url': image_data,
                                'wavelength': metadata['wavelength'],
                                'telescope': metadata['telescope'],
                                'description': metadata['description'],
                                'timestamp': datetime.now().isoformat(),
                                'coordinates': f"RA: {ra:.3f}°, Dec: {dec:.3f}°",
                                'size': '0.5° × 0.5°'
                            })
                    except Exception as e:
                        logger.warning(f"Could not fetch {survey_name} image: {e}")
                        continue
            
            # Try to get Hubble images if available
            hubble_images = self._get_hubble_images(obj_name)
            gallery_images.extend(hubble_images)
            
            # Try to get JWST images if available
            jwst_images = self._get_jwst_images(obj_name)
            gallery_images.extend(jwst_images)
            
            self.image_cache[cache_key] = gallery_images
            return gallery_images
            
        except Exception as e:
            logger.error(f"Error creating image gallery: {e}")
            return []
    
    def _fetch_survey_image(self, ra: float, dec: float, survey: str, metadata: Dict) -> Optional[str]:
        """Fetch image from a specific survey."""
        try:
            params = {
                'Position': f'{ra},{dec}',
                'Survey': survey,
                'Pixels': '400,400',
                'Size': '0.5,0.5',
                'Return': 'JPEG',
                'Scaling': 'Log',
                'Sampler': 'LI'
            }
            
            url = 'https://skyview.gsfc.nasa.gov/current/cgi/runquery.pl'
            
            response = requests.get(url, params=params, timeout=30)
            
            if response.status_code == 200 and 'image' in response.headers.get('content-type', ''):
                import base64
                img_str = base64.b64encode(response.content).decode()
                return f"data:image/jpeg;base64,{img_str}"
            
            return None
            
        except Exception as e:
            logger.warning(f"Error fetching {survey} image: {e}")
            return None
    
    def _get_hubble_images(self, obj_name: str) -> List[Dict]:
        """Try to get Hubble Space Telescope images."""
        try:
            # Search Hubble archive (simplified)
            hubble_objects = {
                'Orion Nebula': {
                    'url': 'https://hubblesite.org/files/live/sites/hubble/files/home/hubble-30th-anniversary/images/hubble_30th_orion_nebula.jpg',
                    'description': 'Hubble visible light composite',
                    'date': '2020-04-24',
                    'filters': 'F658N, F502N, F475W'
                },
                'Crab Nebula': {
                    'url': 'https://hubblesite.org/files/live/sites/hubble/files/home/science/astronomy/stars-and-nebulas/_images/crab-nebula-mosaic.jpg',
                    'description': 'Hubble optical mosaic',
                    'date': '2019-07-04',
                    'filters': 'F555W, F814W'
                },
                'Andromeda Galaxy': {
                    'url': 'https://hubblesite.org/files/live/sites/hubble/files/home/science/astronomy/galaxies/_images/andromeda-galaxy-m31.jpg',
                    'description': 'Hubble high-resolution view',
                    'date': '2015-01-05',
                    'filters': 'F475W, F814W, F160W'
                }
            }
            
            if obj_name in hubble_objects:
                hubble_data = hubble_objects[obj_name]
                return [{
                    'category': 'space_telescope',
                    'survey': 'Hubble Space Telescope',
                    'image_url': hubble_data['url'],
                    'wavelength': 'Visible',
                    'telescope': 'HST',
                    'description': hubble_data['description'],
                    'timestamp': hubble_data['date'],
                    'coordinates': 'High resolution',
                    'size': 'Variable FOV',
                    'filters': hubble_data['filters']
                }]
            
            return []
            
        except Exception as e:
            logger.warning(f"Error getting Hubble images: {e}")
            return []
    
    def _get_jwst_images(self, obj_name: str) -> List[Dict]:
        """Try to get James Webb Space Telescope images."""
        try:
            # JWST targets (simplified)
            jwst_objects = {
                'Orion Nebula': {
                    'url': 'https://webbtelescope.org/files/live/sites/webb/files/home/webb-science/early-release-observations/_images/orion-nebula-nircam.jpg',
                    'description': 'JWST near-infrared view',
                    'date': '2022-09-12',
                    'instrument': 'NIRCam'
                },
                'Crab Nebula': {
                    'url': 'https://webbtelescope.org/files/live/sites/webb/files/home/webb-science/_images/crab-nebula-miri.jpg',
                    'description': 'JWST mid-infrared view',
                    'date': '2023-07-10',
                    'instrument': 'MIRI'
                }
            }
            
            if obj_name in jwst_objects:
                jwst_data = jwst_objects[obj_name]
                return [{
                    'category': 'space_telescope',
                    'survey': 'James Webb Space Telescope',
                    'image_url': jwst_data['url'],
                    'wavelength': 'Infrared',
                    'telescope': 'JWST',
                    'description': jwst_data['description'],
                    'timestamp': jwst_data['date'],
                    'coordinates': 'Ultra high resolution',
                    'size': 'Variable FOV',
                    'instrument': jwst_data['instrument']
                }]
            
            return []
            
        except Exception as e:
            logger.warning(f"Error getting JWST images: {e}")
            return []
    
    def get_image_metadata(self, obj_name: str, ra: float, dec: float) -> Dict:
        """Get comprehensive metadata for an object."""
        try:
            return {
                'object_name': obj_name,
                'coordinates': {
                    'ra': ra,
                    'dec': dec,
                    'ra_hms': self._deg_to_hms(ra),
                    'dec_dms': self._deg_to_dms(dec)
                },
                'observation_info': {
                    'last_updated': datetime.now().isoformat(),
                    'data_sources': ['NASA SkyView', 'Hubble Archive', 'JWST Archive'],
                    'coordinate_system': 'J2000.0'
                }
            }
        except Exception as e:
            logger.error(f"Error getting metadata: {e}")
            return {}
    
    def _deg_to_hms(self, deg: float) -> str:
        """Convert degrees to hours:minutes:seconds."""
        try:
            hours = deg / 15.0
            h = int(hours)
            m = int((hours - h) * 60)
            s = ((hours - h) * 60 - m) * 60
            return f"{h:02d}h {m:02d}m {s:05.2f}s"
        except:
            return f"{deg:.3f}°"
    
    def _deg_to_dms(self, deg: float) -> str:
        """Convert degrees to degrees:arcminutes:arcseconds."""
        try:
            sign = '+' if deg >= 0 else '-'
            deg = abs(deg)
            d = int(deg)
            m = int((deg - d) * 60)
            s = ((deg - d) * 60 - m) * 60
            return f"{sign}{d:02d}° {m:02d}' {s:05.2f}\""
        except:
            return f"{deg:.3f}°"

# Global image gallery
image_gallery = CelestialImageGallery()