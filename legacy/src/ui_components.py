"""
UI components and layout for the Celestial Explorer.
"""
from dash import dcc, html
from typing import Dict, List, Optional

class UIComponents:
    """Manages UI components and layouts."""
    
    @staticmethod
    def create_header() -> html.Div:
        """Create Google Maps-style header with search and layer controls."""
        return html.Div([
            # Top bar with title and main search
            html.Div([
                html.Div([
                    html.H1("🌌 Celestial Explorer", 
                           style={'color': 'white', 'margin': '0', 'font-size': '1.8em', 'font-weight': '600'}),
                    html.P("NASA Space Apps Challenge 2025 - Satellite Perspective Explorer", 
                          style={'color': '#aaa', 'margin': '2px 0 0 0', 'font-size': '12px'})
                ], style={'flex': '1'}),
                
                # Main search bar (Google Maps style)
                html.Div([
                    dcc.Input(
                        id="search-input",
                        type="text",
                        placeholder="🔍 Search celestial objects, satellites, exoplanets...",
                        style={
                            'width': '400px',
                            'padding': '12px 16px',
                            'border-radius': '24px',
                            'border': '1px solid #444',
                            'background': '#2a2a2a',
                            'color': 'white',
                            'font-size': '14px',
                            'box-shadow': '0 2px 8px rgba(0,0,0,0.3)'
                        }
                    ),
                    html.Button("Search", 
                               id="search-btn", 
                               style={
                                   'margin-left': '10px',
                                   'padding': '12px 20px',
                                   'border-radius': '20px',
                                   'border': 'none',
                                   'background': '#00bcd4',
                                   'color': 'white',
                                   'font-weight': '500',
                                   'cursor': 'pointer',
                                   'box-shadow': '0 2px 8px rgba(0,188,212,0.3)'
                               }),
                ], style={'display': 'flex', 'align-items': 'center'})
            ], style={'display': 'flex', 'align-items': 'center', 'margin-bottom': '15px'}),
            
            # Layer controls (Google Maps style)
            html.Div([
                html.Div("Layers:", style={'color': '#aaa', 'margin-right': '15px', 'font-weight': '500'}),
                
                html.Button([html.Span("🛰️", style={'margin-right': '5px'}), "Satellites"], 
                           id="toggle-satellites", 
                           className="layer-btn",
                           style=UIComponents._get_layer_button_style(False)),
                
                html.Button([html.Span("🌌", style={'margin-right': '5px'}), "Deep Sky"], 
                           id="toggle-galaxies", 
                           className="layer-btn",
                           style=UIComponents._get_layer_button_style(True)),
                
                html.Button([html.Span("🪐", style={'margin-right': '5px'}), "Exoplanets"], 
                           id="toggle-exoplanets", 
                           className="layer-btn",
                           style=UIComponents._get_layer_button_style(False)),
                
                html.Div(style={'flex': '1'}),  # Spacer
                
                html.Button([html.Span("🎯", style={'margin-right': '5px'}), "Reset View"], 
                           id="reset-view", 
                           style={
                               'padding': '8px 16px',
                               'border-radius': '16px',
                               'border': '1px solid #555',
                               'background': 'transparent',
                               'color': '#aaa',
                               'font-size': '13px',
                               'cursor': 'pointer',
                               'transition': 'all 0.2s ease'
                           }),
            ], style={
                'display': 'flex', 
                'align-items': 'center', 
                'gap': '10px',
                'padding': '10px 0'
            })
        ], style={
            'background': 'linear-gradient(135deg, #0d1117, #161b22)',
            'padding': '20px',
            'border-bottom': '1px solid #30363d',
            'box-shadow': '0 1px 3px rgba(0,0,0,0.3)'
        })
    
    @staticmethod
    def _get_layer_button_style(active: bool = False) -> Dict:
        """Get Google Maps-style layer button styling."""
        if active:
            return {
                'padding': '8px 16px',
                'border-radius': '16px',
                'border': '1px solid #00bcd4',
                'background': 'rgba(0, 188, 212, 0.2)',
                'color': '#00bcd4',
                'font-size': '13px',
                'font-weight': '500',
                'cursor': 'pointer',
                'transition': 'all 0.2s ease'
            }
        else:
            return {
                'padding': '8px 16px',
                'border-radius': '16px',
                'border': '1px solid #444',
                'background': 'transparent',
                'color': '#aaa',
                'font-size': '13px',
                'cursor': 'pointer',
                'transition': 'all 0.2s ease'
            }
    
    @staticmethod
    def create_info_panel() -> html.Div:
        """Create the information panel for object details and search results."""
        return html.Div([
            # Object info section with image
            html.Div([
                html.Div(
                    id="object-info",
                    children="🌌 Click on any celestial object to see detailed information",
                    style={
                        'color': 'white',
                        'padding': '15px',
                        'background': 'linear-gradient(135deg, #2a2a2a, #3a3a3a)',
                        'border-left': '4px solid #00bcd4',
                        'border-radius': '0 8px 8px 0',
                        'flex': '1'
                    }
                ),
                html.Div([
                    html.Div(
                        id="object-image",
                        style={
                            'width': '200px',
                            'height': '150px',
                            'background': '#1a1a1a',
                            'border': '1px solid #333',
                            'border-radius': '8px',
                            'display': 'flex',
                            'align-items': 'center',
                            'justify-content': 'center',
                            'color': '#666',
                            'font-size': '12px',
                            'cursor': 'pointer',
                            'position': 'relative'
                        },
                        children="Image will appear here"
                    ),
                    html.Button("🔍 View Gallery", 
                               id="expand-image-btn",
                               style={
                                   'margin-top': '8px',
                                   'padding': '6px 12px',
                                   'border': '1px solid #00bcd4',
                                   'background': 'transparent',
                                   'color': '#00bcd4',
                                   'border-radius': '4px',
                                   'font-size': '12px',
                                   'cursor': 'pointer',
                                   'width': '200px'
                               })
                ], style={'margin-left': '15px'})
            ], style={'display': 'flex', 'margin-bottom': '10px'}),
            
            # Search results section
            html.Div(
                id="search-results",
                style={
                    'color': 'white',
                    'padding': '10px',
                    'background': 'rgba(42, 42, 42, 0.8)',
                    'border-radius': '8px',
                    'min-height': '40px'
                }
            )
        ])
    
    @staticmethod
    def create_main_layout() -> html.Div:
        """Create the complete main layout."""
        return html.Div([
            # Header
            UIComponents.create_header(),
            
            # Info panel
            UIComponents.create_info_panel(),
            
            # Main celestial map with background (Google Maps style)
            html.Div([
                # Background space tiles layer
                html.Div(id="background-tiles", style={
                    'position': 'absolute',
                    'top': '0',
                    'left': '0',
                    'width': '100%',
                    'height': '100%',
                    'z-index': '1',
                    'pointer-events': 'none'
                }),
                
                # Main interactive map
                dcc.Graph(
                    id="sky-map",
                    style={
                        'height': '75vh',
                        'width': '100%',
                        'border-radius': '0',
                        'border': 'none',
                        'position': 'relative',
                        'z-index': '2',
                        'background': 'transparent'
                    },
                    config={
                        'displayModeBar': True,
                        'displaylogo': False,
                        'modeBarButtonsToRemove': [
                            'select2d', 'lasso2d', 'autoScale2d', 
                            'hoverClosestCartesian', 'hoverCompareCartesian',
                            'toggleSpikelines'
                        ],
                        'modeBarButtonsToAdd': ['resetScale2d'],
                        'scrollZoom': True,
                        'doubleClick': 'reset+autosize'
                    }
                ),
                
                # Zoom controls (Google Maps style)
                html.Div([
                    html.Button("+", id="zoom-in", 
                               style={
                                   'width': '40px', 'height': '40px',
                                   'border': 'none', 'background': 'rgba(42, 42, 42, 0.9)',
                                   'color': 'white', 'font-size': '20px', 'font-weight': 'bold',
                                   'cursor': 'pointer', 'border-radius': '4px 4px 0 0',
                                   'border-bottom': '1px solid #555'
                               }),
                    html.Button("−", id="zoom-out",
                               style={
                                   'width': '40px', 'height': '40px',
                                   'border': 'none', 'background': 'rgba(42, 42, 42, 0.9)',
                                   'color': 'white', 'font-size': '20px', 'font-weight': 'bold',
                                   'cursor': 'pointer', 'border-radius': '0 0 4px 4px'
                               })
                ], style={
                    'position': 'absolute',
                    'bottom': '100px',
                    'right': '20px',
                    'display': 'flex',
                    'flex-direction': 'column',
                    'box-shadow': '0 2px 10px rgba(0,0,0,0.3)'
                })
            ], style={'position': 'relative'}),
            
            # Status bar
            html.Div([
                html.Div(id="status-info", 
                        children="Ready to explore the cosmos",
                        style={'color': '#aaa', 'font-size': '12px'}),
                html.Div(id="coordinates-info",
                        style={'color': '#aaa', 'font-size': '12px', 'float': 'right'})
            ], style={
                'padding': '10px 20px',
                'background': '#1a1a1a',
                'border-top': '1px solid #333'
            }),
            
            # Image Gallery Modal
            html.Div([
                html.Div([
                    # Modal header
                    html.Div([
                        html.H3(id="modal-title", children="Image Gallery", 
                               style={'color': 'white', 'margin': '0', 'flex': '1'}),
                        html.Button("✕", id="close-modal",
                                   style={
                                       'background': 'none',
                                       'border': 'none',
                                       'color': 'white',
                                       'font-size': '24px',
                                       'cursor': 'pointer',
                                       'padding': '0',
                                       'width': '30px',
                                       'height': '30px'
                                   })
                    ], style={'display': 'flex', 'align-items': 'center', 'margin-bottom': '20px'}),
                    
                    # Modal content
                    html.Div(id="modal-content", style={'max-height': '70vh', 'overflow-y': 'auto'})
                    
                ], style={
                    'background': '#1a1a1a',
                    'padding': '30px',
                    'border-radius': '12px',
                    'border': '1px solid #333',
                    'max-width': '90vw',
                    'max-height': '90vh',
                    'width': '1000px',
                    'position': 'relative'
                })
            ], id="image-modal", style={
                'display': 'none',
                'position': 'fixed',
                'top': '0',
                'left': '0',
                'width': '100%',
                'height': '100%',
                'background': 'rgba(0,0,0,0.8)',
                'z-index': '1000',
                'justify-content': 'center',
                'align-items': 'center'
            }),
            
            # Data stores
            dcc.Store(id="zoom-level", data=1.0),
            dcc.Store(id="camera-pos", data={'x': 0, 'y': 0}),
            dcc.Store(id="show-satellites", data=False),
            dcc.Store(id="show-galaxies", data=True),
            dcc.Store(id="show-exoplanets", data=False),
            dcc.Store(id="selected-object", data=None),
            dcc.Store(id="selected-object-coords", data=None)
            
        ], style={
            'background': '#000',
            'min-height': '100vh',
            'font-family': "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
        })
    
    @staticmethod
    def _get_button_style(extra_style: str = '') -> Dict:
        """Get consistent button styling."""
        base_style = {
            'background': 'linear-gradient(45deg, #1e3c72, #2a5298)',
            'border': 'none',
            'border-radius': '5px',
            'color': 'white',
            'cursor': 'pointer',
            'padding': '10px 15px',
            'font-size': '14px',
            'font-weight': 'bold',
            'transition': 'all 0.3s ease',
            'box-shadow': '0 2px 4px rgba(0,0,0,0.3)'
        }
        
        if extra_style:
            # Parse simple CSS-like extra styles
            for style_rule in extra_style.split(';'):
                if ':' in style_rule:
                    prop, value = style_rule.split(':', 1)
                    base_style[prop.strip().replace('-', '_')] = value.strip()
        
        return base_style
    
    @staticmethod
    def format_search_results(results: List[Dict]) -> html.Div:
        """Format search results for display."""
        if not results:
            return html.Div("No objects found matching your search.", 
                          style={'color': 'orange', 'font-style': 'italic'})
        
        result_items = []
        for i, result in enumerate(results[:5]):  # Show top 5 results
            # Create info string
            info_parts = [f"📍 {result['name']} ({result['type']})"]
            
            if 'constellation' in result:
                info_parts.append(f"Constellation: {result['constellation']}")
            if 'distance' in result:
                info_parts.append(f"Distance: {result['distance']}")
            if 'status' in result:
                info_parts.append(f"Status: {result['status']}")
            if 'magnitude' in result and result['magnitude'] != 'Unknown':
                info_parts.append(f"Magnitude: {result['magnitude']}")
            
            result_items.append(
                html.Div(
                    " | ".join(info_parts),
                    style={
                        'margin': '8px 0',
                        'padding': '8px',
                        'background': 'rgba(0, 188, 212, 0.1)' if i == 0 else 'rgba(255,255,255,0.05)',
                        'border-radius': '4px',
                        'border-left': '3px solid #00bcd4' if i == 0 else '3px solid transparent'
                    }
                )
            )
        
        return html.Div([
            html.H4(f"🔍 Search Results ({len(results)} found):", 
                   style={'color': 'cyan', 'margin': '10px 0 5px 0'}),
            *result_items,
            html.P(f"Showing top {min(5, len(results))} results. First result is centered on map.",
                  style={'color': '#aaa', 'font-size': '12px', 'margin-top': '10px'})
        ])
    
    @staticmethod
    def format_object_info(obj_info: Optional[Dict]) -> html.Div:
        """Format detailed object information for display."""
        if not obj_info:
            return html.Div("🌌 Click on any celestial object to see detailed information",
                          style={'color': '#aaa', 'font-style': 'italic'})
        
        # Determine icon and color based on object type
        if obj_info['type'] == 'Star':
            icon = "⭐"
            color = 'yellow'
        elif 'Galaxy' in obj_info['type']:
            icon = "🌌"
            color = 'purple'
        elif 'Nebula' in obj_info['type']:
            icon = "☁️"
            color = 'cyan'
        elif 'Satellite' in obj_info['type']:
            icon = "🛰️"
            color = 'lime'
        elif 'Exoplanet' in obj_info['type']:
            icon = "🪐"
            color = 'lightgreen'
        elif 'Cluster' in obj_info['type']:
            icon = "✨"
            color = 'gold'
        else:
            icon = "🔭"
            color = 'white'
        
        # Create info items
        info_items = []
        for key, value in obj_info.items():
            if key != 'name' and key != 'type' and value != 'Unknown':
                formatted_key = key.replace('_', ' ').title()
                info_items.append(f"{formatted_key}: {value}")
        
        return html.Div([
            html.H4(f"{icon} {obj_info['name']}", 
                   style={'color': color, 'margin': '0 0 10px 0'}),
            html.P(" | ".join(info_items), 
                  style={'margin': '0', 'line-height': '1.4'})
        ])

# Global UI components instance
ui = UIComponents()