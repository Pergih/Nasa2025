"""
Visualization components for the celestial map.
Handles plotting, styling, and interactive elements.
"""
import plotly.graph_objects as go
import numpy as np
from typing import Optional, Dict, Any
import pandas as pd

class SkyMapVisualizer:
    """Handles all visualization aspects of the sky map."""
    
    def __init__(self):
        self.background_tiles = self._generate_background_tiles()
    
    def _generate_background_tiles(self):
        """Generate background tiles for space regions."""
        tiles = []
        for tx in range(-3, 4):
            for ty in range(-3, 4):
                tiles.append({
                    'x': tx * 256,
                    'y': ty * 256,
                    'color': f'rgb({np.random.randint(20,80)},{np.random.randint(20,80)},{np.random.randint(40,120)})'
                })
        return tiles
    
    def create_sky_plot(self, 
                       stars_df: pd.DataFrame,
                       deep_sky_df: pd.DataFrame, 
                       satellites_df: pd.DataFrame,
                       exoplanets_df: pd.DataFrame = None,
                       zoom: float = 1.0,
                       camera_x: float = 0.0,
                       camera_y: float = 0.0,
                       show_satellites: bool = False,
                       show_galaxies: bool = True,
                       show_exoplanets: bool = False,
                       selected_object: Optional[str] = None) -> go.Figure:
        """Create the main sky map visualization."""
        
        fig = go.Figure()
        
        # Add background
        self._add_background(fig, zoom, camera_x, camera_y)
        
        # Add celestial objects
        self._add_stars(fig, stars_df, zoom, camera_x, camera_y)
        
        if show_galaxies:
            self._add_deep_sky_objects(fig, deep_sky_df, zoom, camera_x, camera_y)
        
        if show_satellites:
            self._add_satellites(fig, satellites_df, zoom, camera_x, camera_y)
        
        if show_exoplanets and exoplanets_df is not None and not exoplanets_df.empty:
            self._add_exoplanets(fig, exoplanets_df, zoom, camera_x, camera_y)
        
        # Highlight selected object
        if selected_object:
            self._highlight_object(fig, selected_object, stars_df, deep_sky_df, satellites_df, exoplanets_df, zoom, camera_x, camera_y)
        
        # Configure layout
        self._configure_layout(fig, zoom, camera_x, camera_y)
        
        return fig
    
    def _add_background(self, fig: go.Figure, zoom: float, camera_x: float, camera_y: float):
        """Add background tiles to represent space regions."""
        for tile in self.background_tiles:
            screen_x = (tile['x'] - camera_x) * zoom
            screen_y = (tile['y'] - camera_y) * zoom
            fig.add_shape(
                type="rect",
                x0=screen_x, y0=screen_y,
                x1=screen_x + 256*zoom, y1=screen_y + 256*zoom,
                fillcolor=tile['color'],
                opacity=0.2,
                layer="below",
                line=dict(width=0)
            )
    
    def _add_stars(self, fig: go.Figure, stars_df: pd.DataFrame, zoom: float, camera_x: float, camera_y: float):
        """Add stars to the plot."""
        if stars_df.empty:
            return
        
        # Calculate star properties based on magnitude
        star_colors = []
        star_sizes = []
        
        for _, star in stars_df.iterrows():
            mag = star.get('mag', 5.0)
            spectral_type = star.get('spectral_type', 'G')
            
            # Color based on spectral type
            if spectral_type.startswith('O') or spectral_type.startswith('B'):
                color = '#9bb0ff'  # Blue
            elif spectral_type.startswith('A'):
                color = '#aabfff'  # Blue-white
            elif spectral_type.startswith('F'):
                color = '#cad7ff'  # White
            elif spectral_type.startswith('G'):
                color = '#fff4ea'  # Yellow-white
            elif spectral_type.startswith('K'):
                color = '#ffd2a1'  # Orange
            elif spectral_type.startswith('M'):
                color = '#ffad51'  # Red
            else:
                color = 'white'
            
            star_colors.append(color)
            
            # Size based on magnitude (brighter = larger)
            size = max(6, 20 - mag*3) / max(zoom, 0.3)
            star_sizes.append(size)
        
        fig.add_trace(go.Scatter(
            x=stars_df.x * 500 * zoom - camera_x * zoom,
            y=stars_df.y * 500 * zoom - camera_y * zoom,
            mode='markers+text',
            text=stars_df.name,
            textposition="top center",
            textfont=dict(size=max(8, 12/zoom), color='white'),
            marker=dict(
                size=star_sizes,
                color=star_colors,
                symbol='star',
                line=dict(width=0.5, color='white')
            ),
            name='Stars',
            hovertemplate='<b>%{text}</b><br>' +
                         'Type: Star<br>' +
                         'Magnitude: %{customdata[0]:.2f}<br>' +
                         'Constellation: %{customdata[1]}<br>' +
                         'Distance: %{customdata[2]}<extra></extra>',
            customdata=stars_df[['mag', 'constellation', 'distance_ly']].fillna('Unknown').values
        ))
    
    def _add_deep_sky_objects(self, fig: go.Figure, deep_sky_df: pd.DataFrame, zoom: float, camera_x: float, camera_y: float):
        """Add galaxies, nebulae, and other deep-sky objects."""
        if deep_sky_df.empty:
            return
        
        # Separate by type
        galaxies = deep_sky_df[deep_sky_df['type'] == 'Galaxy']
        nebulae = deep_sky_df[deep_sky_df['type'] == 'Nebula']
        clusters = deep_sky_df[deep_sky_df['type'].str.contains('Cluster', na=False)]
        
        # Add galaxies
        if not galaxies.empty:
            fig.add_trace(go.Scatter(
                x=galaxies.x * 500 * zoom - camera_x * zoom,
                y=galaxies.y * 500 * zoom - camera_y * zoom,
                mode='markers+text',
                text=galaxies.name,
                textposition="top center",
                textfont=dict(size=max(8, 10/zoom), color='white'),
                marker=dict(
                    size=max(15, 25/zoom),
                    color='purple',
                    symbol='diamond',
                    line=dict(width=1, color='white')
                ),
                name='Galaxies',
                hovertemplate='<b>%{text}</b><br>' +
                             'Type: %{customdata[0]}<br>' +
                             'Distance: %{customdata[1]:,} ly<br>' +
                             'Magnitude: %{customdata[2]}<extra></extra>',
                customdata=galaxies[['type', 'distance_ly', 'magnitude']].fillna('Unknown').values
            ))
        
        # Add nebulae
        if not nebulae.empty:
            fig.add_trace(go.Scatter(
                x=nebulae.x * 500 * zoom - camera_x * zoom,
                y=nebulae.y * 500 * zoom - camera_y * zoom,
                mode='markers+text',
                text=nebulae.name,
                textposition="top center",
                textfont=dict(size=max(8, 10/zoom), color='white'),
                marker=dict(
                    size=max(12, 20/zoom),
                    color='cyan',
                    symbol='circle',
                    line=dict(width=1, color='white')
                ),
                name='Nebulae',
                hovertemplate='<b>%{text}</b><br>' +
                             'Type: %{customdata[0]}<br>' +
                             'Distance: %{customdata[1]:,} ly<extra></extra>',
                customdata=nebulae[['type', 'distance_ly']].fillna('Unknown').values
            ))
        
        # Add clusters
        if not clusters.empty:
            fig.add_trace(go.Scatter(
                x=clusters.x * 500 * zoom - camera_x * zoom,
                y=clusters.y * 500 * zoom - camera_y * zoom,
                mode='markers+text',
                text=clusters.name,
                textposition="top center",
                textfont=dict(size=max(8, 10/zoom), color='white'),
                marker=dict(
                    size=max(10, 18/zoom),
                    color='gold',
                    symbol='hexagon',
                    line=dict(width=1, color='white')
                ),
                name='Star Clusters',
                hovertemplate='<b>%{text}</b><br>' +
                             'Type: %{customdata[0]}<br>' +
                             'Distance: %{customdata[1]:,} ly<extra></extra>',
                customdata=clusters[['type', 'distance_ly']].fillna('Unknown').values
            ))
    
    def _add_satellites(self, fig: go.Figure, satellites_df: pd.DataFrame, zoom: float, camera_x: float, camera_y: float):
        """Add satellites and space telescopes."""
        if satellites_df.empty:
            return
        
        active_sats = satellites_df[satellites_df['status'] == 'Active']
        retired_sats = satellites_df[satellites_df['status'] == 'Retired']
        
        # Active satellites
        if not active_sats.empty:
            fig.add_trace(go.Scatter(
                x=active_sats.x * 500 * zoom - camera_x * zoom,
                y=active_sats.y * 500 * zoom - camera_y * zoom,
                mode='markers+text',
                text=active_sats.name,
                textposition="bottom center",
                textfont=dict(size=max(8, 10/zoom), color='lime'),
                marker=dict(
                    size=max(10, 15/zoom),
                    color='lime',
                    symbol='square',
                    line=dict(width=1, color='white')
                ),
                name='Active Satellites',
                hovertemplate='<b>%{text}</b><br>' +
                             'Status: %{customdata[0]}<br>' +
                             'Type: %{customdata[1]}<br>' +
                             'Altitude: %{customdata[2]:,} km<br>' +
                             'Launch: %{customdata[3]}<extra></extra>',
                customdata=active_sats[['status', 'type', 'altitude', 'launch_year']].fillna('Unknown').values
            ))
        
        # Retired satellites
        if not retired_sats.empty:
            fig.add_trace(go.Scatter(
                x=retired_sats.x * 500 * zoom - camera_x * zoom,
                y=retired_sats.y * 500 * zoom - camera_y * zoom,
                mode='markers+text',
                text=retired_sats.name,
                textposition="bottom center",
                textfont=dict(size=max(8, 10/zoom), color='gray'),
                marker=dict(
                    size=max(8, 12/zoom),
                    color='gray',
                    symbol='square',
                    line=dict(width=1, color='darkgray')
                ),
                name='Retired Satellites',
                hovertemplate='<b>%{text}</b><br>' +
                             'Status: %{customdata[0]}<br>' +
                             'Type: %{customdata[1]}<br>' +
                             'Launch: %{customdata[2]}<extra></extra>',
                customdata=retired_sats[['status', 'type', 'launch_year']].fillna('Unknown').values
            ))
    
    def _add_exoplanets(self, fig: go.Figure, exoplanets_df: pd.DataFrame, zoom: float, camera_x: float, camera_y: float):
        """Add exoplanets to the plot."""
        if exoplanets_df.empty:
            return
        
        # Separate by habitable zone
        habitable = exoplanets_df[exoplanets_df.get('habitable_zone', False) == True]
        non_habitable = exoplanets_df[exoplanets_df.get('habitable_zone', False) == False]
        
        # Habitable zone exoplanets
        if not habitable.empty:
            fig.add_trace(go.Scatter(
                x=habitable.x * 500 * zoom - camera_x * zoom,
                y=habitable.y * 500 * zoom - camera_y * zoom,
                mode='markers+text',
                text=habitable.planet_name,
                textposition="top center",
                textfont=dict(size=max(8, 10/zoom), color='lightgreen'),
                marker=dict(
                    size=max(8, 12/zoom),
                    color='lightgreen',
                    symbol='circle',
                    line=dict(width=1, color='green')
                ),
                name='Habitable Exoplanets',
                hovertemplate='<b>%{text}</b><br>' +
                             'Host Star: %{customdata[0]}<br>' +
                             'Type: %{customdata[1]}<br>' +
                             'Distance: %{customdata[2]} ly<br>' +
                             'Discovery: %{customdata[3]}<extra></extra>',
                customdata=habitable[['host_star', 'planet_type', 'distance_ly', 'discovery_year']].fillna('Unknown').values
            ))
        
        # Non-habitable exoplanets
        if not non_habitable.empty:
            fig.add_trace(go.Scatter(
                x=non_habitable.x * 500 * zoom - camera_x * zoom,
                y=non_habitable.y * 500 * zoom - camera_y * zoom,
                mode='markers+text',
                text=non_habitable.planet_name,
                textposition="top center",
                textfont=dict(size=max(8, 10/zoom), color='orange'),
                marker=dict(
                    size=max(6, 10/zoom),
                    color='orange',
                    symbol='circle',
                    line=dict(width=1, color='darkorange')
                ),
                name='Other Exoplanets',
                hovertemplate='<b>%{text}</b><br>' +
                             'Host Star: %{customdata[0]}<br>' +
                             'Type: %{customdata[1]}<br>' +
                             'Distance: %{customdata[2]} ly<br>' +
                             'Discovery: %{customdata[3]}<extra></extra>',
                customdata=non_habitable[['host_star', 'planet_type', 'distance_ly', 'discovery_year']].fillna('Unknown').values
            ))
    
    def _highlight_object(self, fig: go.Figure, selected_object: str, 
                         stars_df: pd.DataFrame, deep_sky_df: pd.DataFrame, satellites_df: pd.DataFrame,
                         exoplanets_df: pd.DataFrame, zoom: float, camera_x: float, camera_y: float):
        """Highlight the selected object with a colored ring."""
        obj_data = None
        color = 'orange'
        
        # Find the object
        if selected_object in stars_df['name'].values:
            obj_data = stars_df[stars_df['name'] == selected_object].iloc[0]
            color = 'orange'
        elif selected_object in deep_sky_df['name'].values:
            obj_data = deep_sky_df[deep_sky_df['name'] == selected_object].iloc[0]
            color = 'red'
        elif selected_object in satellites_df['name'].values:
            obj_data = satellites_df[satellites_df['name'] == selected_object].iloc[0]
            color = 'yellow'
        elif (exoplanets_df is not None and not exoplanets_df.empty and 
              selected_object in exoplanets_df['planet_name'].values):
            obj_data = exoplanets_df[exoplanets_df['planet_name'] == selected_object].iloc[0]
            color = 'lightgreen'
        
        if obj_data is not None:
            fig.add_trace(go.Scatter(
                x=[obj_data.x * 500 * zoom - camera_x * zoom],
                y=[obj_data.y * 500 * zoom - camera_y * zoom],
                mode='markers',
                marker=dict(
                    size=max(25, 40/zoom),
                    color='rgba(0,0,0,0)',
                    symbol='circle-open',
                    line=dict(width=3, color=color)
                ),
                name='Selected',
                showlegend=False,
                hoverinfo='skip'
            ))
    
    def _configure_layout(self, fig: go.Figure, zoom: float, camera_x: float, camera_y: float):
        """Configure the plot layout and styling."""
        fig.update_layout(
            showlegend=True,
            legend=dict(
                x=0.02, y=0.98,
                bgcolor='rgba(0,0,0,0.8)',
                font=dict(color='white', size=12),
                bordercolor='white',
                borderwidth=1
            ),
            dragmode='pan',
            xaxis=dict(
                range=[-400*zoom + camera_x*zoom, 400*zoom + camera_x*zoom],
                showgrid=False,
                showticklabels=False,
                zeroline=False,
                showspikes=False
            ),
            yaxis=dict(
                range=[-400*zoom + camera_y*zoom, 400*zoom + camera_y*zoom],
                showgrid=False,
                showticklabels=False,
                zeroline=False,
                showspikes=False
            ),
            plot_bgcolor='black',
            paper_bgcolor='black',
            margin=dict(l=0, r=0, t=0, b=0),
            font=dict(color='white'),
            hovermode='closest'
        )
        
        # Add subtle grid for navigation reference
        fig.add_shape(
            type="line",
            x0=-1000, y0=0, x1=1000, y1=0,
            line=dict(color="rgba(255,255,255,0.1)", width=1)
        )
        fig.add_shape(
            type="line",
            x0=0, y0=-1000, x1=0, y1=1000,
            line=dict(color="rgba(255,255,255,0.1)", width=1)
        )

# Global visualizer instance
visualizer = SkyMapVisualizer()