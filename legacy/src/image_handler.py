"""
Astronomical image handling and display.
Integrates with NASA SkyView and other image services.
"""
import requests
import base64
from io import BytesIO
from PIL import Image
import numpy as np
from typing import Optional, Dict, Tuple
import logging

logger = logging.getLogger(__name__)

class AstronomicalImageHandler:
    """Handles fetching and processing astronomical images."""
    
    def __init__(self):
        self.image_cache = {}
        self.skyview_surveys = {
            'optical': 'DSS2 Red',
            'infrared': '2MASS-J',
            'radio': 'NVSS',
            'xray': 'RASS',
            'gamma': 'Fermi 5'
        }
    
    def get_object_image(self, obj_name: str, ra: float, dec: float, 
                        survey: str = 'optical', size: float = 0.5) -> Optional[str]:
        """Get real astronomical image from NASA SkyView."""
        try:
            cache_key = f"{obj_name}_{survey}_{size}"
            
            if cache_key in self.image_cache:
                return self.image_cache[cache_key]
            
            logger.info(f"Fetching real image for {obj_name} at RA:{ra:.3f}, Dec:{dec:.3f}")
            
            # Get real image from NASA SkyView
            image_data = self._fetch_skyview_image(ra, dec, survey, size)
            
            if image_data:
                # Convert to base64 for web display
                base64_image = self._convert_to_base64(image_data)
                self.image_cache[cache_key] = base64_image
                logger.info(f"✓ Successfully loaded image for {obj_name}")
                return base64_image
            else:
                # Fallback to a simple generated image
                fallback_image = self._create_fallback_image(obj_name, ra, dec)
                self.image_cache[cache_key] = fallback_image
                return fallback_image
            
        except Exception as e:
            logger.error(f"Error getting image for {obj_name}: {e}")
            return self._create_fallback_image(obj_name, ra, dec)
    
    def _fetch_skyview_image(self, ra: float, dec: float, survey: str, size: float) -> Optional[bytes]:
        """Fetch real image from NASA SkyView service."""
        try:
            survey_name = self.skyview_surveys.get(survey, 'DSS2 Red')
            
            # NASA SkyView parameters
            params = {
                'Position': f'{ra},{dec}',
                'Survey': survey_name,
                'Pixels': '300,300',
                'Size': f'{size},{size}',
                'Return': 'JPEG',
                'Scaling': 'Log',
                'Sampler': 'LI',
                'Grid': 'J2000',
                'GridLabels': '1'
            }
            
            # Real NASA SkyView URL
            url = 'https://skyview.gsfc.nasa.gov/current/cgi/runquery.pl'
            
            logger.info(f"Requesting NASA SkyView: {survey_name} at {ra:.3f},{dec:.3f}")
            
            response = requests.get(url, params=params, timeout=45)
            
            if response.status_code == 200:
                content_type = response.headers.get('content-type', '')
                if 'image' in content_type:
                    logger.info(f"✓ Got {len(response.content)} bytes from NASA SkyView")
                    return response.content
                else:
                    logger.warning(f"SkyView returned non-image content: {content_type}")
                    return None
            else:
                logger.warning(f"SkyView returned status {response.status_code}")
                return None
                
        except requests.exceptions.Timeout:
            logger.warning("NASA SkyView request timed out")
            return None
        except Exception as e:
            logger.error(f"Error fetching SkyView image: {e}")
            return None
    
    def _convert_to_base64(self, image_data: bytes) -> str:
        """Convert image bytes to base64 string for web display."""
        try:
            # Open image with PIL
            image = Image.open(BytesIO(image_data))
            
            # Enhance the image for better visibility
            image = self._enhance_astronomical_image(image)
            
            # Convert to base64
            buffer = BytesIO()
            image.save(buffer, format='JPEG', quality=85)
            img_str = base64.b64encode(buffer.getvalue()).decode()
            
            return f"data:image/jpeg;base64,{img_str}"
            
        except Exception as e:
            logger.error(f"Error converting image to base64: {e}")
            return ""
    
    def _enhance_astronomical_image(self, image: Image.Image) -> Image.Image:
        """Enhance astronomical image for better visibility."""
        try:
            # Convert to numpy array
            img_array = np.array(image)
            
            # Apply contrast enhancement for astronomical images
            if len(img_array.shape) == 3:  # Color image
                # Enhance each channel
                for i in range(3):
                    channel = img_array[:, :, i].astype(np.float32)
                    # Stretch contrast
                    channel = (channel - channel.min()) / (channel.max() - channel.min() + 1e-8)
                    # Apply gamma correction for better visibility
                    channel = np.power(channel, 0.7)
                    img_array[:, :, i] = (channel * 255).astype(np.uint8)
            else:  # Grayscale
                img_array = img_array.astype(np.float32)
                img_array = (img_array - img_array.min()) / (img_array.max() - img_array.min() + 1e-8)
                img_array = np.power(img_array, 0.7)
                img_array = (img_array * 255).astype(np.uint8)
            
            # Convert back to PIL Image
            enhanced_image = Image.fromarray(img_array)
            
            return enhanced_image
            
        except Exception as e:
            logger.warning(f"Error enhancing image: {e}")
            return image
    
    def _create_fallback_image(self, obj_name: str, ra: float, dec: float) -> str:
        """Create a simple fallback image when NASA SkyView fails."""
        try:
            # Create a simple star field image
            img = Image.new('RGB', (200, 150), color='#0a0a0a')
            
            # Add some random "stars"
            pixels = img.load()
            np.random.seed(int(ra * dec) % 1000)  # Deterministic based on coordinates
            
            for _ in range(20):
                x = np.random.randint(0, 200)
                y = np.random.randint(0, 150)
                brightness = np.random.randint(100, 255)
                pixels[x, y] = (brightness, brightness, brightness)
            
            # Convert to base64
            buffer = BytesIO()
            img.save(buffer, format='JPEG', quality=85)
            img_str = base64.b64encode(buffer.getvalue()).decode()
            
            return f"data:image/jpeg;base64,{img_str}"
            
        except Exception as e:
            logger.error(f"Error creating fallback image: {e}")
            return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMGEwYTBhIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=="
    
    def get_telescope_view(self, telescope_name: str, target_ra: float, target_dec: float) -> Optional[str]:
        """Get simulated telescope view of a target."""
        try:
            # Determine appropriate survey based on telescope type
            telescope_surveys = {
                'Hubble Space Telescope': 'optical',
                'James Webb Space Telescope': 'infrared',
                'Chandra X-ray Observatory': 'xray',
                'Spitzer Space Telescope': 'infrared',
                'Fermi Gamma-ray Space Telescope': 'gamma'
            }
            
            survey = telescope_surveys.get(telescope_name, 'optical')
            
            return self.get_object_image(
                f"{telescope_name}_view", 
                target_ra, target_dec, 
                survey, 
                size=0.3
            )
            
        except Exception as e:
            logger.error(f"Error getting telescope view for {telescope_name}: {e}")
            return None
    
    def create_composite_image(self, ra: float, dec: float, surveys: list = None) -> Optional[str]:
        """Create composite image from multiple surveys."""
        try:
            if surveys is None:
                surveys = ['optical', 'infrared']
            
            images = []
            for survey in surveys:
                img_data = self._fetch_skyview_image(ra, dec, survey, 0.5)
                if img_data:
                    images.append(Image.open(BytesIO(img_data)))
            
            if len(images) >= 2:
                # Create simple composite (blend first two images)
                composite = Image.blend(images[0], images[1], 0.5)
                
                # Convert to base64
                buffer = BytesIO()
                composite.save(buffer, format='JPEG', quality=85)
                img_str = base64.b64encode(buffer.getvalue()).decode()
                
                return f"data:image/jpeg;base64,{img_str}"
            
            return None
            
        except Exception as e:
            logger.error(f"Error creating composite image: {e}")
            return None

# Global image handler
image_handler = AstronomicalImageHandler()