"""
Background space image tiles system.
Creates seamless space background like Google Maps satellite view.
"""
import requests
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
import base64
from io import BytesIO
from typing import Dict, List, Tuple, Optional
import logging
from pathlib import Path
import hashlib

logger = logging.getLogger(__name__)

class SpaceBackgroundTiles:
    """Creates and manages background space image tiles."""
    
    def __init__(self):
        self.tile_cache = {}
        self.tile_size = 256  # Standard tile size
        self.cache_dir = Path("data/tiles")
        self.cache_dir.mkdir(parents=True, exist_ok=True)
        
        # Different sky surveys for background
        self.background_surveys = {
            'optical': 'DSS2 Red',
            'infrared': '2MASS-J',
            'radio': 'NVSS',
            'xray': 'RASS'
        }
    
    def get_background_tiles(self, center_ra: float, center_dec: float, 
                           zoom_level: int, survey: str = 'optical') -> List[Dict]:
        """Get background tiles for the current view."""
        try:
            view_range = 60 / (2 ** (zoom_level - 1))
            tile_degree_size = view_range / 4  # 4x4 grid of tiles
            
            tiles = []
            
            # Create a grid of tiles around the center
            for i in range(-2, 3):  # 5x5 grid for smooth scrolling
                for j in range(-2, 3):
                    tile_ra = center_ra + i * tile_degree_size
                    tile_dec = center_dec + j * tile_degree_size
                    
                    # Ensure valid coordinates
                    tile_ra = tile_ra % 360
                    tile_dec = max(-90, min(90, tile_dec))
                    
                    tile_data = self._get_or_create_tile(tile_ra, tile_dec, tile_degree_size, survey)
                    
                    if tile_data:
                        tiles.append({
                            'ra': tile_ra,
                            'dec': tile_dec,
                            'size': tile_degree_size,
                            'image_data': tile_data,
                            'x_offset': i,
                            'y_offset': j
                        })
            
            return tiles
            
        except Exception as e:
            logger.error(f"Error creating background tiles: {e}")
            return []
    
    def _get_or_create_tile(self, ra: float, dec: float, size: float, survey: str) -> Optional[str]:
        """Get cached tile or create new one."""
        try:
            # Create cache key
            cache_key = f"{survey}_{ra:.2f}_{dec:.2f}_{size:.2f}"
            cache_hash = hashlib.md5(cache_key.encode()).hexdigest()
            
            if cache_key in self.tile_cache:
                return self.tile_cache[cache_key]
            
            # Check file cache
            cache_file = self.cache_dir / f"{cache_hash}.jpg"
            if cache_file.exists():
                with open(cache_file, 'rb') as f:
                    image_data = f.read()
                base64_data = base64.b64encode(image_data).decode()
                tile_data = f"data:image/jpeg;base64,{base64_data}"
                self.tile_cache[cache_key] = tile_data
                return tile_data
            
            # Create new tile
            tile_data = self._create_space_tile(ra, dec, size, survey)
            
            if tile_data:
                # Save to cache
                self.tile_cache[cache_key] = tile_data
                
                # Save to file cache
                try:
                    if tile_data.startswith('data:image/jpeg;base64,'):
                        image_bytes = base64.b64decode(tile_data.split(',')[1])
                        with open(cache_file, 'wb') as f:
                            f.write(image_bytes)
                except Exception as e:
                    logger.warning(f"Could not cache tile to file: {e}")
            
            return tile_data
            
        except Exception as e:
            logger.error(f"Error getting/creating tile: {e}")
            return None
    
    def _create_space_tile(self, ra: float, dec: float, size: float, survey: str) -> Optional[str]:
        """Create a space background tile."""
        try:
            survey_name = self.background_surveys.get(survey, 'DSS2 Red')
            
            # Try to get real image from NASA SkyView
            params = {
                'Position': f'{ra},{dec}',
                'Survey': survey_name,
                'Pixels': f'{self.tile_size},{self.tile_size}',
                'Size': f'{size},{size}',
                'Return': 'JPEG',
                'Scaling': 'Log',
                'Sampler': 'LI'
            }
            
            url = 'https://skyview.gsfc.nasa.gov/current/cgi/runquery.pl'
            
            response = requests.get(url, params=params, timeout=30)
            
            if response.status_code == 200 and 'image' in response.headers.get('content-type', ''):
                # Process the image
                image = Image.open(BytesIO(response.content))
                
                # Enhance for background use
                enhanced_image = self._enhance_background_image(image)
                
                # Convert to base64
                buffer = BytesIO()
                enhanced_image.save(buffer, format='JPEG', quality=75)
                img_str = base64.b64encode(buffer.getvalue()).decode()
                
                return f"data:image/jpeg;base64,{img_str}"
            else:
                # Create procedural space background
                return self._create_procedural_space_tile(ra, dec, size)
                
        except Exception as e:
            logger.warning(f"Could not create real space tile: {e}")
            return self._create_procedural_space_tile(ra, dec, size)
    
    def _enhance_background_image(self, image: Image.Image) -> Image.Image:
        """Enhance image for use as background tile."""
        try:
            # Convert to RGB if needed
            if image.mode != 'RGB':
                image = image.convert('RGB')
            
            # Resize to tile size
            image = image.resize((self.tile_size, self.tile_size), Image.Resampling.LANCZOS)
            
            # Darken for background use
            img_array = np.array(image)
            img_array = (img_array * 0.6).astype(np.uint8)  # Darken to 60%
            
            # Add slight blur for seamless tiling
            enhanced_image = Image.fromarray(img_array)
            enhanced_image = enhanced_image.filter(ImageFilter.GaussianBlur(radius=0.5))
            
            return enhanced_image
            
        except Exception as e:
            logger.warning(f"Error enhancing background image: {e}")
            return image
    
    def _create_procedural_space_tile(self, ra: float, dec: float, size: float) -> str:
        """Create procedural space background when real images fail."""
        try:
            # Create base dark space
            image = Image.new('RGB', (self.tile_size, self.tile_size), color='#0a0a0a')
            draw = ImageDraw.Draw(image)
            
            # Add stars based on coordinates (deterministic)
            np.random.seed(int((ra * 1000 + dec * 1000) % 10000))
            
            # Add background stars
            num_stars = np.random.randint(20, 50)
            for _ in range(num_stars):
                x = np.random.randint(0, self.tile_size)
                y = np.random.randint(0, self.tile_size)
                brightness = np.random.randint(30, 120)
                size = np.random.choice([1, 1, 1, 2, 2, 3])  # Mostly small stars
                
                color = (brightness, brightness, brightness)
                if size == 1:
                    draw.point((x, y), fill=color)
                else:
                    draw.ellipse([x-size//2, y-size//2, x+size//2, y+size//2], fill=color)
            
            # Add some nebulosity (very subtle)
            if np.random.random() < 0.3:  # 30% chance
                nebula_x = np.random.randint(0, self.tile_size)
                nebula_y = np.random.randint(0, self.tile_size)
                nebula_size = np.random.randint(20, 60)
                nebula_color = np.random.choice([
                    (20, 10, 30),  # Purple
                    (30, 20, 10),  # Orange
                    (10, 20, 30),  # Blue
                ])
                
                draw.ellipse([
                    nebula_x - nebula_size//2, nebula_y - nebula_size//2,
                    nebula_x + nebula_size//2, nebula_y + nebula_size//2
                ], fill=nebula_color)
            
            # Apply blur for nebula effect
            image = image.filter(ImageFilter.GaussianBlur(radius=1))
            
            # Convert to base64
            buffer = BytesIO()
            image.save(buffer, format='JPEG', quality=70)
            img_str = base64.b64encode(buffer.getvalue()).decode()
            
            return f"data:image/jpeg;base64,{img_str}"
            
        except Exception as e:
            logger.error(f"Error creating procedural space tile: {e}")
            return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMGEwYTBhIi8+PC9zdmc+"

# Global background tiles manager
background_tiles = SpaceBackgroundTiles()