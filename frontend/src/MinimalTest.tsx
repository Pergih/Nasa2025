import React from 'react'

const MinimalTest: React.FC = () => {
  return (
    <div className="h-screen w-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">StellarEye</h1>
        <p className="text-xl">Minimal Test - Working!</p>
        <div className="mt-8 p-4 bg-gray-800 rounded-lg">
          <p className="text-sm">If you can see this, React is working.</p>
          <p className="text-sm">The issue is likely in a specific component.</p>
        </div>
      </div>
    </div>
  )
}

export default MinimalTest