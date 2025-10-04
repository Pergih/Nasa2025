"""
Celestial Explorer - A Google Maps-like interface for exploring space.
NASA Space Apps Challenge 2025 - "Embiggen Your Eyes"
"""
import dash
import logging
from src.ui_components import ui
from src.callbacks import register_callbacks

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def create_app():
    """Create and configure the Dash application."""
    app = dash.Dash(
        __name__,
        title="🌌 Celestial Explorer",
        update_title="Loading...",
        external_stylesheets=[
            "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
        ]
    )
    
    # Set the layout
    app.layout = ui.create_main_layout()
    
    # Register all callbacks
    register_callbacks(app)
    
    logger.info("Celestial Explorer app created successfully")
    return app

def main():
    """Main entry point."""
    try:
        app = create_app()
        logger.info("Starting Celestial Explorer...")
        logger.info("🌌 Navigate to http://localhost:8050 to explore the cosmos!")
        
        app.run(
            debug=True,
            host='0.0.0.0',
            port=8050,
            dev_tools_hot_reload=True
        )
        
    except Exception as e:
        logger.error(f"Failed to start application: {e}")
        raise

if __name__ == '__main__':
    main()