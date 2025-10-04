import React from 'react'

const AboutPage: React.FC = () => {
  return (
    <div className="h-full bg-gray-900 p-8 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-6">About StellarEye</h1>

        <div className="prose prose-invert max-w-none">
          <p className="text-xl text-gray-300 mb-8">
            A modern web application for exploring the universe through satellite perspectives,
            built for the NASA Space Apps Challenge 2025.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-2xl font-semibold text-white mb-4">🚀 Modern Stack</h2>
              <ul className="text-gray-300 space-y-2">
                <li>• React 18 + TypeScript</li>
                <li>• FastAPI + Python</li>
                <li>• Leaflet Maps</li>
                <li>• Real NASA APIs</li>
                <li>• Tailwind CSS</li>
              </ul>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-2xl font-semibold text-white mb-4">🌌 Features</h2>
              <ul className="text-gray-300 space-y-2">
                <li>• Interactive sky maps</li>
                <li>• Real-time satellite tracking</li>
                <li>• Multi-wavelength imaging</li>
                <li>• Exoplanet exploration</li>
                <li>• NASA data integration</li>
              </ul>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold text-white mb-4">🎯 NASA Space Apps Challenge</h2>
            <p className="text-gray-300 mb-4">
              This project addresses the "Embiggen Your Eyes" challenge by creating an intuitive,
              Google Maps-like interface for exploring space through different satellite perspectives.
            </p>
            <p className="text-gray-300">
              Users can view celestial objects through the eyes of various NASA telescopes and
              satellites, making space exploration accessible to everyone.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutPage