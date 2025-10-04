"""
Google Maps-style interactive celestial map.
Smooth zooming, panning, and layered visualization.
"""
import plotly.graph_objects as go
import plotly.express as px
from plotly.subplots import make_subplots
import pandas as pd
import numpy as np
from typing import Dict, List, Optional, Tuple
import logging

logger = logging.getLogger(__name__)

class GoogleMapsStyleVisualizer:
    """Google Maps-like celestial visualization with smooth interactions."""
    
    def __init__(self):
        self.zoom_levels = {
            1: {'size_multiplier': 1.0, 'text_size': 12, 'detail_level': 'basic'},
            2: {'size_multiplier': 1.5, 'text_size': 14, 'detail_level': 'medium'},
            3: {'size_multiplier': 2.0, 'text_size': 16, 'detail_level': 'detailed'},
            4: {'size_multiplier': 3.0, 'text_size': 18, 'detail_level': 'full'}
        }
        
        self.layer_styles = {
            'stars': {
                'colors': {
                    'O': '#9bb0ff', 'B': '#aabfff', 'A': '#cad7ff',
                    'F': '#fff4ea', 'G': '#ffcc6f', 'K': '#ffd2a1', 'M': '#ffad51'
                },
                'symbols': 'star',
                'opacity': 0.9
            },
            'galaxies': {
                'color': '#8e44ad',
                'symbol': 'diamond',
                'opacity': 0.8
            },
            'nebulae': {
                'color': '#00bcd4',
                'symbol': 'circle',
                'opacity': 0.7
            },
            'satellites': {
                'active': {'color': '#2ecc71', 'symbol': 'square'},
                'retired': {'color': '#95a5a6', 'symbol': 'square'},
                'opacity': 1.0
            },
            'exoplanets': {
                'habitable': {'color': '#27ae60', 'symbol': 'circle'},
                'non_habitable': {'color': '#f39c12', 'symbol': 'circle'},
                'opacity': 0.8
            }
        }
    
    def create_interactive_map(self, 
                             stars_df: pd.DataFrame,
                             deep_sky_df: pd.DataFrame,
                             satellites_df: pd.DataFrame,
                             exoplanets_df: pd.DataFrame = None,
                             zoom_level: int = 1,
                             center_ra: float = 0,
                             center_dec: float = 0,
                             layers: Dict[str, bool] = None,
                             selected_object: str = None) -> go.Figure:
        """Create Google Maps-style interactive celestial map."""
        
        if layers is None:
            layers = {'stars': True, 'galaxies': True, 'nebulae': True, 
                     'satellites': False, 'exoplanets': False}
        
        # Create figure with custom layout
        fig = go.Figure()
        
        # Add background grid (like Google Maps)
        self._add_coordinate_grid(fig, center_ra, center_dec, zoom_level)
        
        # Add celestial objects by layer
        if layers.get('stars', True):
            self._add_stars_layer(fig, stars_df, zoom_level, center_ra, center_dec)
        
        if layers.get('galaxies', True) or layers.get('nebulae', True):
            self._add_deep_sky_layer(fig, deep_sky_df, zoom_level, center_ra, center_dec, layers)
        
        if layers.get('satellites', False):
            self._add_satellites_layer(fig, satellites_df, zoom_level, center_ra, center_dec)
        
        if layers.get('exoplanets', False) and exoplanets_df is not None:
            self._add_exoplanets_layer(fig, exoplanets_df, zoom_level, center_ra, center_dec)
        
        # Highlight selected object
        if selected_object:
            self._highlight_selected_object(fig, selected_object, stars_df, deep_sky_df, 
                                          satellites_df, exoplanets_df, zoom_level, center_ra, center_dec)
        
        # Configure Google Maps-like layout
        self._configure_maps_layout(fig, zoom_level, center_ra, center_dec)
        
        return fig
    
    def _add_coordinate_grid(self, fig: go.Figure, center_ra: float, center_dec: float, zoom_level: int):
        """Add subtle coordinate grid that moves with objects."""
        try:
            zoom_factor = 2 ** (zoom_level - 1)
            grid_spacing = max(15, 60 / zoom_factor)  # Adaptive grid spacing
            
            # Calculate visible range
            view_range = 60 / zoom_factor
            
            # RA lines (vertical) - only in visible area
            ra_start = center_ra - view_range
            ra_end = center_ra + view_range
            
            for ra in np.arange(ra_start - (ra_start % grid_spacing), ra_end + grid_spacing, grid_spacing):
                fig.add_shape(
                    type="line",
                    x0=ra, y0=center_dec - view_range/2,
                    x1=ra, y1=center_dec + view_range/2,
                    line=dict(color="rgba(255,255,255,0.05)", width=1, dash="dot"),
                    layer="below"
                )
            
            # Dec lines (horizontal) - only in visible area
            dec_start = center_dec - view_range/2
            dec_end = center_dec + view_range/2
            
            for dec in np.arange(dec_start - (dec_start % grid_spacing), dec_end + grid_spacing, grid_spacing):
                if -90 <= dec <= 90:  # Valid declination range
                    fig.add_shape(
                        type="line",
                        x0=center_ra - view_range, y0=dec,
                        x1=center_ra + view_range, y1=dec,
                        line=dict(color="rgba(255,255,255,0.05)", width=1, dash="dot"),
                        layer="below"
                    )
                
        except Exception as e:
            logger.warning(f"Error adding coordinate grid: {e}")
    
    def _add_stars_layer(self, fig: go.Figure, stars_df: pd.DataFrame, zoom_level: int, center_ra: float, center_dec: float):
        """Add stars with spectral type coloring and magnitude-based sizing."""
        if stars_df.empty:
            return
        
        try:
            zoom_config = self.zoom_levels[min(zoom_level, 4)]
            
            # Calculate star properties
            star_colors = []
            star_sizes = []
            
            for _, star in stars_df.iterrows():
                # Color by spectral type
                spectral_class = star.get('spectral_type', 'G')[0] if pd.notna(star.get('spectral_type')) else 'G'
                color = self.layer_styles['stars']['colors'].get(spectral_class, '#fff4ea')
                star_colors.append(color)
                
                # Size by magnitude (brighter = larger)
                mag = star.get('mag', 5.0)
                size = max(6, (6 - mag) * 3) * zoom_config['size_multiplier']
                star_sizes.append(size)
            
            # Add stars trace (use absolute coordinates)
            fig.add_trace(go.Scatter(
                x=stars_df['ra'],
                y=stars_df['dec'],
                mode='markers+text',
                text=stars_df['name'],
                textposition="top center",
                textfont=dict(size=zoom_config['text_size'], color='white'),
                marker=dict(
                    size=star_sizes,
                    color=star_colors,
                    symbol='star',
                    opacity=self.layer_styles['stars']['opacity'],
                    line=dict(width=1, color='white')
                ),
                name='Stars',
                hovertemplate='<b>%{text}</b><br>' +
                             'RA: %{customdata[0]:.3f}°<br>' +
                             'Dec: %{customdata[1]:.3f}°<br>' +
                             'Magnitude: %{customdata[2]:.2f}<br>' +
                             'Spectral Type: %{customdata[3]}<br>' +
                             'Distance: %{customdata[4]:.1f} ly<extra></extra>',
                customdata=stars_df[['ra', 'dec', 'mag', 'spectral_type', 'distance_ly']].fillna('Unknown').values
            ))
            
        except Exception as e:
            logger.error(f"Error adding stars layer: {e}")
    
    def _add_deep_sky_layer(self, fig: go.Figure, deep_sky_df: pd.DataFrame, zoom_level: int, 
                           center_ra: float, center_dec: float, layers: Dict[str, bool]):
        """Add galaxies and nebulae with appropriate styling."""
        if deep_sky_df.empty:
            return
        
        try:
            zoom_config = self.zoom_levels[min(zoom_level, 4)]
            
            # Separate object types
            if layers.get('galaxies', True):
                galaxies = deep_sky_df[deep_sky_df['type'] == 'Galaxy']
                if not galaxies.empty:
                    fig.add_trace(go.Scatter(
                        x=galaxies['ra'],
                        y=galaxies['dec'],
                        mode='markers+text',
                        text=galaxies['name'],
                        textposition="top center",
                        textfont=dict(size=zoom_config['text_size'], color='white'),
                        marker=dict(
                            size=20 * zoom_config['size_multiplier'],
                            color=self.layer_styles['galaxies']['color'],
                            symbol=self.layer_styles['galaxies']['symbol'],
                            opacity=self.layer_styles['galaxies']['opacity'],
                            line=dict(width=2, color='white')
                        ),
                        name='Galaxies',
                        hovertemplate='<b>%{text}</b><br>' +
                                     'Type: Galaxy<br>' +
                                     'Distance: %{customdata[0]:,} ly<br>' +
                                     'Magnitude: %{customdata[1]}<extra></extra>',
                        customdata=galaxies[['distance_ly', 'magnitude']].fillna('Unknown').values
                    ))
            
            if layers.get('nebulae', True):
                nebulae = deep_sky_df[deep_sky_df['type'] == 'Nebula']
                if not nebulae.empty:
                    fig.add_trace(go.Scatter(
                        x=nebulae['ra'],
                        y=nebulae['dec'],
                        mode='markers+text',
                        text=nebulae['name'],
                        textposition="top center",
                        textfont=dict(size=zoom_config['text_size'], color='white'),
                        marker=dict(
                            size=15 * zoom_config['size_multiplier'],
                            color=self.layer_styles['nebulae']['color'],
                            symbol=self.layer_styles['nebulae']['symbol'],
                            opacity=self.layer_styles['nebulae']['opacity'],
                            line=dict(width=2, color='white')
                        ),
                        name='Nebulae',
                        hovertemplate='<b>%{text}</b><br>' +
                                     'Type: Nebula<br>' +
                                     'Distance: %{customdata[0]:,} ly<extra></extra>',
                        customdata=nebulae[['distance_ly']].fillna('Unknown').values
                    ))
                    
        except Exception as e:
            logger.error(f"Error adding deep sky layer: {e}")
    
    def _add_satellites_layer(self, fig: go.Figure, satellites_df: pd.DataFrame, zoom_level: int, 
                             center_ra: float, center_dec: float):
        """Add satellites with mission status styling."""
        if satellites_df.empty:
            return
        
        try:
            zoom_config = self.zoom_levels[min(zoom_level, 4)]
            
            # Active satellites
            active_sats = satellites_df[satellites_df['status'] == 'Active']
            if not active_sats.empty:
                fig.add_trace(go.Scatter(
                    x=active_sats['ra'],
                    y=active_sats['dec'],
                    mode='markers+text',
                    text=active_sats['name'],
                    textposition="bottom center",
                    textfont=dict(size=zoom_config['text_size'], color='lime'),
                    marker=dict(
                        size=12 * zoom_config['size_multiplier'],
                        color=self.layer_styles['satellites']['active']['color'],
                        symbol=self.layer_styles['satellites']['active']['symbol'],
                        opacity=self.layer_styles['satellites']['opacity'],
                        line=dict(width=2, color='white')
                    ),
                    name='Active Satellites',
                    hovertemplate='<b>%{text}</b><br>' +
                                 'Status: Active<br>' +
                                 'Type: %{customdata[0]}<br>' +
                                 'Launch: %{customdata[1]}<br>' +
                                 'Mission: %{customdata[2]}<extra></extra>',
                    customdata=active_sats[['type', 'launch_year', 'mission_type']].fillna('Unknown').values
                ))
            
            # Retired satellites
            retired_sats = satellites_df[satellites_df['status'] == 'Retired']
            if not retired_sats.empty:
                fig.add_trace(go.Scatter(
                    x=retired_sats['ra'],
                    y=retired_sats['dec'],
                    mode='markers+text',
                    text=retired_sats['name'],
                    textposition="bottom center",
                    textfont=dict(size=zoom_config['text_size'], color='gray'),
                    marker=dict(
                        size=10 * zoom_config['size_multiplier'],
                        color=self.layer_styles['satellites']['retired']['color'],
                        symbol=self.layer_styles['satellites']['retired']['symbol'],
                        opacity=self.layer_styles['satellites']['opacity'],
                        line=dict(width=1, color='darkgray')
                    ),
                    name='Retired Satellites',
                    hovertemplate='<b>%{text}</b><br>' +
                                 'Status: Retired<br>' +
                                 'Type: %{customdata[0]}<br>' +
                                 'Launch: %{customdata[1]}<extra></extra>',
                    customdata=retired_sats[['type', 'launch_year']].fillna('Unknown').values
                ))
                
        except Exception as e:
            logger.error(f"Error adding satellites layer: {e}")
    
    def _add_exoplanets_layer(self, fig: go.Figure, exoplanets_df: pd.DataFrame, zoom_level: int, 
                             center_ra: float, center_dec: float):
        """Add exoplanets with habitability coloring."""
        if exoplanets_df.empty:
            return
        
        try:
            zoom_config = self.zoom_levels[min(zoom_level, 4)]
            
            # Habitable zone planets
            habitable = exoplanets_df[exoplanets_df.get('habitable_zone', False) == True]
            if not habitable.empty:
                fig.add_trace(go.Scatter(
                    x=habitable['ra'],
                    y=habitable['dec'],
                    mode='markers+text',
                    text=habitable['planet_name'],
                    textposition="top center",
                    textfont=dict(size=zoom_config['text_size'], color='lightgreen'),
                    marker=dict(
                        size=8 * zoom_config['size_multiplier'],
                        color=self.layer_styles['exoplanets']['habitable']['color'],
                        symbol=self.layer_styles['exoplanets']['habitable']['symbol'],
                        opacity=self.layer_styles['exoplanets']['opacity'],
                        line=dict(width=2, color='green')
                    ),
                    name='Habitable Exoplanets',
                    hovertemplate='<b>%{text}</b><br>' +
                                 'Host Star: %{customdata[0]}<br>' +
                                 'Type: %{customdata[1]}<br>' +
                                 'Distance: %{customdata[2]} ly<br>' +
                                 'Habitable Zone: Yes<extra></extra>',
                    customdata=habitable[['host_star', 'planet_type', 'distance_ly']].fillna('Unknown').values
                ))
            
            # Non-habitable planets
            non_habitable = exoplanets_df[exoplanets_df.get('habitable_zone', False) == False]
            if not non_habitable.empty:
                fig.add_trace(go.Scatter(
                    x=non_habitable['ra'],
                    y=non_habitable['dec'],
                    mode='markers+text',
                    text=non_habitable['planet_name'],
                    textposition="top center",
                    textfont=dict(size=zoom_config['text_size'], color='orange'),
                    marker=dict(
                        size=6 * zoom_config['size_multiplier'],
                        color=self.layer_styles['exoplanets']['non_habitable']['color'],
                        symbol=self.layer_styles['exoplanets']['non_habitable']['symbol'],
                        opacity=self.layer_styles['exoplanets']['opacity'],
                        line=dict(width=1, color='darkorange')
                    ),
                    name='Other Exoplanets',
                    hovertemplate='<b>%{text}</b><br>' +
                                 'Host Star: %{customdata[0]}<br>' +
                                 'Type: %{customdata[1]}<br>' +
                                 'Distance: %{customdata[2]} ly<extra></extra>',
                    customdata=non_habitable[['host_star', 'planet_type', 'distance_ly']].fillna('Unknown').values
                ))
                
        except Exception as e:
            logger.error(f"Error adding exoplanets layer: {e}")
    
    def _highlight_selected_object(self, fig: go.Figure, selected_object: str, 
                                  stars_df: pd.DataFrame, deep_sky_df: pd.DataFrame,
                                  satellites_df: pd.DataFrame, exoplanets_df: pd.DataFrame,
                                  zoom_level: int, center_ra: float, center_dec: float):
        """Highlight selected object with Google Maps-style selection."""
        try:
            obj_data = None
            color = '#ff6b6b'
            
            # Find the object
            if selected_object in stars_df['name'].values:
                obj_data = stars_df[stars_df['name'] == selected_object].iloc[0]
            elif selected_object in deep_sky_df['name'].values:
                obj_data = deep_sky_df[deep_sky_df['name'] == selected_object].iloc[0]
            elif selected_object in satellites_df['name'].values:
                obj_data = satellites_df[satellites_df['name'] == selected_object].iloc[0]
            elif (exoplanets_df is not None and not exoplanets_df.empty and 
                  selected_object in exoplanets_df['planet_name'].values):
                obj_data = exoplanets_df[exoplanets_df['planet_name'] == selected_object].iloc[0]
            
            if obj_data is not None:
                zoom_config = self.zoom_levels[min(zoom_level, 4)]
                
                # Add pulsing selection ring
                fig.add_trace(go.Scatter(
                    x=[obj_data['ra']],
                    y=[obj_data['dec']],
                    mode='markers',
                    marker=dict(
                        size=40 * zoom_config['size_multiplier'],
                        color='rgba(0,0,0,0)',
                        symbol='circle-open',
                        line=dict(width=4, color=color)
                    ),
                    name='Selected',
                    showlegend=False,
                    hoverinfo='skip'
                ))
                
        except Exception as e:
            logger.error(f"Error highlighting selected object: {e}")
    
    def _configure_maps_layout(self, fig: go.Figure, zoom_level: int, center_ra: float, center_dec: float):
        """Configure Google Maps-style layout and interactions."""
        try:
            zoom_factor = 2 ** (zoom_level - 1)
            view_range = 60 / zoom_factor  # Degrees
            
            fig.update_layout(
                # Google Maps-style appearance
                plot_bgcolor='#0d1117',  # Dark space background
                paper_bgcolor='#0d1117',
                
                # Smooth interactions
                dragmode='pan',
                
                # Axes configuration - smooth movement
                xaxis=dict(
                    range=[center_ra - view_range, center_ra + view_range],
                    showgrid=False,  # Use custom grid instead
                    showticklabels=True,
                    tickfont=dict(size=10, color='white'),
                    title=dict(text='Right Ascension (°)', font=dict(size=12, color='white')),
                    zeroline=False,
                    fixedrange=False  # Allow zooming
                ),
                yaxis=dict(
                    range=[center_dec - view_range/2, center_dec + view_range/2],
                    showgrid=False,  # Use custom grid instead
                    showticklabels=True,
                    tickfont=dict(size=10, color='white'),
                    title=dict(text='Declination (°)', font=dict(size=12, color='white')),
                    zeroline=False,
                    scaleanchor="x",
                    scaleratio=1,
                    fixedrange=False  # Allow zooming
                ),
                
                # Legend styling
                legend=dict(
                    x=0.02, y=0.98,
                    bgcolor='rgba(13, 17, 23, 0.8)',
                    bordercolor='white',
                    borderwidth=1,
                    font=dict(color='white', size=11)
                ),
                
                # Margins and sizing
                margin=dict(l=60, r=20, t=40, b=60),
                
                # Font and colors
                font=dict(color='white', family='Inter, sans-serif'),
                
                # Hover styling
                hoverlabel=dict(
                    bgcolor='rgba(0,0,0,0.8)',
                    bordercolor='white',
                    font=dict(color='white', size=12)
                ),
                
                # Smooth animations
                transition={'duration': 300, 'easing': 'cubic-in-out'}
            )
            
        except Exception as e:
            logger.error(f"Error configuring layout: {e}")

# Global Google Maps-style visualizer
maps_visualizer = GoogleMapsStyleVisualizer()