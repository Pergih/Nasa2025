"""
Dash callbacks for handling user interactions.
"""
from dash import Input, Output, State, callback_context, html
from dash.exceptions import PreventUpdate
import logging
import pandas as pd
from typing import Tuple, Any

from .data_sources import data_manager
from .visualization import visualizer
from .google_maps_style import maps_visualizer
from .ui_components import ui
from .image_handler import image_handler
from .background_tiles import background_tiles
from .image_gallery import image_gallery

logger = logging.getLogger(__name__)

def register_callbacks(app):
    """Register all callbacks with the Dash app."""
    
    @app.callback(
        [Output('sky-map', 'figure'), 
         Output('zoom-level', 'data'), 
         Output('camera-pos', 'data'),
         Output('show-satellites', 'data'), 
         Output('show-galaxies', 'data'), 
         Output('show-exoplanets', 'data'),
         Output('selected-object', 'data'),
         Output('status-info', 'children')],
        [Input('sky-map', 'relayoutData'), 
         Input('toggle-satellites', 'n_clicks'),
         Input('toggle-galaxies', 'n_clicks'), 
         Input('toggle-exoplanets', 'n_clicks'),
         Input('search-btn', 'n_clicks'),
         Input('reset-view', 'n_clicks')],
        [State('zoom-level', 'data'), 
         State('camera-pos', 'data'), 
         State('show-satellites', 'data'),
         State('show-galaxies', 'data'), 
         State('show-exoplanets', 'data'),
         State('selected-object', 'data'), 
         State('search-input', 'value')]
    )
    def update_map(relayout, sat_clicks, gal_clicks, exo_clicks, search_clicks, reset_clicks,
                   zoom, camera, show_sats, show_gals, show_exos, selected_obj, search_query):
        """Main callback for updating the sky map."""
        
        ctx = callback_context
        zoom = zoom or 1.0
        camera = camera or {'x': 0, 'y': 0}
        status = "Exploring the cosmos..."
        
        try:
            # Handle different triggers
            if ctx.triggered:
                trigger_id = ctx.triggered[0]['prop_id'].split('.')[0]
                
                if trigger_id == 'toggle-satellites':
                    show_sats = not show_sats
                    status = f"Satellites {'shown' if show_sats else 'hidden'}"
                    
                elif trigger_id == 'toggle-galaxies':
                    show_gals = not show_gals
                    status = f"Deep sky objects {'shown' if show_gals else 'hidden'}"
                    
                elif trigger_id == 'toggle-exoplanets':
                    show_exos = not show_exos
                    status = f"Exoplanets {'shown' if show_exos else 'hidden'}"
                    
                elif trigger_id == 'search-btn' and search_query:
                    results = data_manager.search_objects(search_query)
                    if results:
                        selected_obj = results[0]['name']
                        coords = results[0]['coords']
                        camera = {'x': coords[0] * 500, 'y': coords[1] * 500}
                        status = f"Found {len(results)} objects, centered on {selected_obj}"
                    else:
                        status = f"No objects found for '{search_query}'"
                        
                elif trigger_id == 'reset-view':
                    camera = {'x': 0, 'y': 0}
                    zoom = 1.0
                    selected_obj = None
                    status = "View reset to origin"
            
            # Handle map pan/zoom
            if relayout:
                if 'xaxis.range[0]' in relayout:
                    camera['x'] = (relayout['xaxis.range[0]'] + relayout['xaxis.range[1]']) / (2 * zoom)
                    camera['y'] = (relayout['yaxis.range[0]'] + relayout['yaxis.range[1]']) / (2 * zoom)
                    status = f"Navigating to RA: {camera['x']:.1f}, Dec: {camera['y']:.1f}"
                    
                if 'xaxis.autorange' in relayout:
                    camera = {'x': 0, 'y': 0}
                    zoom = 1.0
                    status = "Auto-range applied"
            
            # Create Google Maps-style plot
            layers = {
                'stars': True,
                'galaxies': show_gals,
                'nebulae': show_gals,
                'satellites': show_sats,
                'exoplanets': show_exos
            }
            
            fig = maps_visualizer.create_interactive_map(
                data_manager.stars_df,
                data_manager.deep_sky_df,
                data_manager.satellites_df,
                data_manager.exoplanets_df,
                zoom_level=min(int(zoom), 4),
                center_ra=camera['x'],
                center_dec=camera['y'],
                layers=layers,
                selected_object=selected_obj
            )
            
            return fig, zoom, camera, show_sats, show_gals, show_exos, selected_obj, status
            
        except Exception as e:
            logger.error(f"Error in update_map callback: {e}")
            status = f"Error: {str(e)}"
            # Return safe defaults
            fig = maps_visualizer.create_interactive_map(
                data_manager.stars_df or pd.DataFrame(),
                data_manager.deep_sky_df or pd.DataFrame(),
                data_manager.satellites_df or pd.DataFrame(),
                data_manager.exoplanets_df or pd.DataFrame(),
                zoom_level=1,
                center_ra=0,
                center_dec=0,
                layers={'stars': True, 'galaxies': True, 'nebulae': True, 'satellites': False, 'exoplanets': False},
                selected_object=None
            )
            return fig, 1.0, {'x': 0, 'y': 0}, False, True, False, None, status
    
    @app.callback(
        Output('search-results', 'children'),
        Input('search-btn', 'n_clicks'),
        State('search-input', 'value')
    )
    def display_search_results(n_clicks, search_query):
        """Display search results."""
        if not n_clicks or not search_query:
            return ""
        
        try:
            results = data_manager.search_objects(search_query)
            return ui.format_search_results(results)
        except Exception as e:
            logger.error(f"Error in search: {e}")
            return f"Search error: {str(e)}"
    
    @app.callback(
        [Output('object-info', 'children'), 
         Output('object-image', 'children'),
         Output('selected-object-coords', 'data')],
        Input('sky-map', 'clickData')
    )
    def display_object_info(click_data):
        """Display detailed object information and image when clicked."""
        if not click_data:
            return ui.format_object_info(None), "Image will appear here", None
        
        try:
            point = click_data['points'][0]
            if 'text' in point:
                obj_name = point['text']
                obj_info = data_manager.get_object_info(obj_name)
                
                # Get object coordinates for image
                obj_data = None
                if obj_name in data_manager.stars_df['name'].values:
                    obj_data = data_manager.stars_df[data_manager.stars_df['name'] == obj_name].iloc[0]
                elif obj_name in data_manager.deep_sky_df['name'].values:
                    obj_data = data_manager.deep_sky_df[data_manager.deep_sky_df['name'] == obj_name].iloc[0]
                elif obj_name in data_manager.satellites_df['name'].values:
                    obj_data = data_manager.satellites_df[data_manager.satellites_df['name'] == obj_name].iloc[0]
                elif (data_manager.exoplanets_df is not None and not data_manager.exoplanets_df.empty and 
                      obj_name in data_manager.exoplanets_df['planet_name'].values):
                    obj_data = data_manager.exoplanets_df[data_manager.exoplanets_df['planet_name'] == obj_name].iloc[0]
                
                # Try to get astronomical image
                image_component = html.Div([
                    html.Div("🔄", style={'font-size': '24px', 'margin': '10px 0'}),
                    html.P("Loading NASA image...", style={'font-size': '12px', 'margin': '0', 'color': '#aaa'})
                ], style={'text-align': 'center', 'padding': '20px'})
                
                if obj_data is not None:
                    try:
                        image_url = image_handler.get_object_image(obj_name, obj_data['ra'], obj_data['dec'])
                        if image_url:
                            if image_url.startswith('data:image'):
                                # Base64 encoded image
                                image_component = html.Img(
                                    src=image_url,
                                    style={
                                        'width': '100%',
                                        'height': '100%',
                                        'object-fit': 'cover',
                                        'border-radius': '8px'
                                    }
                                )
                            else:
                                # URL image
                                image_component = html.Img(
                                    src=image_url,
                                    style={
                                        'width': '100%',
                                        'height': '100%',
                                        'object-fit': 'cover',
                                        'border-radius': '8px'
                                    }
                                )
                        else:
                            image_component = html.Div([
                                html.P("📡", style={'font-size': '24px', 'margin': '0'}),
                                html.P("NASA SkyView unavailable", style={'font-size': '10px', 'margin': '0', 'color': '#666'})
                            ], style={'text-align': 'center', 'padding': '20px'})
                    except Exception as img_error:
                        logger.warning(f"Could not load image for {obj_name}: {img_error}")
                        image_component = html.Div([
                            html.P("⚠️", style={'font-size': '24px', 'margin': '0'}),
                            html.P("Image error", style={'font-size': '10px', 'margin': '0', 'color': '#f39c12'})
                        ], style={'text-align': 'center', 'padding': '20px'})
                
                # Store coordinates for gallery
                coords_data = {'name': obj_name, 'ra': obj_data['ra'], 'dec': obj_data['dec']}
                
                return ui.format_object_info(obj_info), image_component, coords_data
                
        except Exception as e:
            logger.error(f"Error getting object info: {e}")
            return f"Error loading object information: {str(e)}", "Error loading image", None
        
        return ui.format_object_info(None), "Image will appear here", None
    
    @app.callback(
        Output('coordinates-info', 'children'),
        Input('sky-map', 'hoverData'),
        State('camera-pos', 'data'),
        State('zoom-level', 'data')
    )
    def update_coordinates(hover_data, camera, zoom):
        """Update coordinate display on hover."""
        if not hover_data:
            return ""
        
        try:
            # Convert screen coordinates back to sky coordinates
            x = hover_data['points'][0]['x']
            y = hover_data['points'][0]['y']
            
            # Rough conversion back to RA/Dec (simplified)
            ra = (x + camera.get('x', 0) * zoom) / (500 * zoom)
            dec = (y + camera.get('y', 0) * zoom) / (500 * zoom)
            
            return f"RA: {ra:.2f}°, Dec: {dec:.2f}°"
        except:
            return ""
    
    @app.callback(
        Output('search-input', 'value'),
        Input('sky-map', 'clickData'),
        prevent_initial_call=True
    )
    def update_search_on_click(click_data):
        """Update search input when object is clicked."""
        if click_data and 'points' in click_data:
            point = click_data['points'][0]
            if 'text' in point:
                return point['text']
        raise PreventUpdate
    
    @app.callback(
        [Output('image-modal', 'style'), Output('modal-title', 'children'), Output('modal-content', 'children')],
        [Input('expand-image-btn', 'n_clicks'), Input('close-modal', 'n_clicks')],
        [State('selected-object-coords', 'data'), State('image-modal', 'style')],
        prevent_initial_call=True
    )
    def toggle_image_modal(expand_clicks, close_clicks, coords_data, current_style):
        """Toggle the image gallery modal."""
        ctx = callback_context
        
        if not ctx.triggered:
            raise PreventUpdate
        
        trigger_id = ctx.triggered[0]['prop_id'].split('.')[0]
        
        if trigger_id == 'expand-image-btn' and coords_data:
            # Open modal with gallery
            obj_name = coords_data['name']
            ra = coords_data['ra']
            dec = coords_data['dec']
            
            # Get multi-wavelength gallery
            gallery_images = image_gallery.get_multi_wavelength_gallery(obj_name, ra, dec)
            metadata = image_gallery.get_image_metadata(obj_name, ra, dec)
            
            # Create gallery content
            gallery_content = create_image_gallery_content(gallery_images, metadata)
            
            modal_style = {
                'display': 'flex',
                'position': 'fixed',
                'top': '0',
                'left': '0',
                'width': '100%',
                'height': '100%',
                'background': 'rgba(0,0,0,0.8)',
                'z-index': '1000',
                'justify-content': 'center',
                'align-items': 'center'
            }
            
            return modal_style, f"🌌 {obj_name} - Multi-wavelength Gallery", gallery_content
        
        elif trigger_id == 'close-modal':
            # Close modal
            modal_style = current_style.copy()
            modal_style['display'] = 'none'
            return modal_style, "Image Gallery", ""
        
        raise PreventUpdate

def create_image_gallery_content(gallery_images, metadata):
    """Create the content for the image gallery modal."""
    try:
        if not gallery_images:
            return html.Div("No images available for this object.", 
                          style={'color': '#aaa', 'text-align': 'center', 'padding': '40px'})
        
        # Group images by category
        categories = {}
        for img in gallery_images:
            cat = img.get('category', 'other')
            if cat not in categories:
                categories[cat] = []
            categories[cat].append(img)
        
        content = []
        
        # Object metadata
        if metadata:
            coords = metadata.get('coordinates', {})
            content.append(
                html.Div([
                    html.H4("Object Information", style={'color': '#00bcd4', 'margin-bottom': '10px'}),
                    html.P(f"Coordinates: {coords.get('ra_hms', '')} / {coords.get('dec_dms', '')}", 
                          style={'color': '#aaa', 'margin': '5px 0'}),
                    html.P(f"Last Updated: {metadata.get('observation_info', {}).get('last_updated', '')[:19]}", 
                          style={'color': '#aaa', 'margin': '5px 0'})
                ], style={'margin-bottom': '30px', 'padding': '15px', 'background': '#2a2a2a', 'border-radius': '8px'})
            )
        
        # Image categories
        category_names = {
            'optical': '🔭 Optical Images',
            'infrared': '🌡️ Infrared Images', 
            'xray': '⚡ X-ray Images',
            'radio': '📡 Radio Images',
            'space_telescope': '🛰️ Space Telescope Images'
        }
        
        for category, images in categories.items():
            content.append(
                html.Div([
                    html.H4(category_names.get(category, category.title()), 
                           style={'color': 'white', 'margin-bottom': '15px'}),
                    
                    html.Div([
                        create_image_card(img) for img in images
                    ], style={
                        'display': 'grid',
                        'grid-template-columns': 'repeat(auto-fit, minmax(300px, 1fr))',
                        'gap': '15px'
                    })
                ], style={'margin-bottom': '30px'})
            )
        
        return html.Div(content)
        
    except Exception as e:
        logger.error(f"Error creating gallery content: {e}")
        return html.Div(f"Error loading gallery: {str(e)}", 
                       style={'color': 'red', 'text-align': 'center', 'padding': '40px'})

def create_image_card(image_data):
    """Create an individual image card."""
    try:
        return html.Div([
            # Image
            html.Div([
                html.Img(
                    src=image_data['image_url'],
                    style={
                        'width': '100%',
                        'height': '200px',
                        'object-fit': 'cover',
                        'border-radius': '8px 8px 0 0'
                    }
                ) if image_data['image_url'] else html.Div(
                    "Image not available",
                    style={
                        'width': '100%',
                        'height': '200px',
                        'display': 'flex',
                        'align-items': 'center',
                        'justify-content': 'center',
                        'background': '#333',
                        'color': '#666',
                        'border-radius': '8px 8px 0 0'
                    }
                )
            ]),
            
            # Metadata
            html.Div([
                html.H5(image_data['survey'], 
                       style={'color': 'white', 'margin': '0 0 8px 0', 'font-size': '14px'}),
                html.P(image_data['description'], 
                      style={'color': '#aaa', 'margin': '0 0 8px 0', 'font-size': '12px'}),
                html.Div([
                    html.Span(f"📏 {image_data['wavelength']}", 
                             style={'color': '#00bcd4', 'font-size': '11px', 'margin-right': '10px'}),
                    html.Span(f"🔭 {image_data['telescope']}", 
                             style={'color': '#00bcd4', 'font-size': '11px'})
                ]),
                html.Div([
                    html.Span(f"📅 {image_data['timestamp'][:10]}", 
                             style={'color': '#666', 'font-size': '10px', 'margin-right': '10px'}),
                    html.Span(f"📐 {image_data['size']}", 
                             style={'color': '#666', 'font-size': '10px'})
                ], style={'margin-top': '5px'})
            ], style={'padding': '12px'})
            
        ], style={
            'background': '#2a2a2a',
            'border-radius': '8px',
            'border': '1px solid #333',
            'overflow': 'hidden'
        })
        
    except Exception as e:
        logger.error(f"Error creating image card: {e}")
        return html.Div(f"Error: {str(e)}", style={'color': 'red'})