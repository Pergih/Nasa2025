import React, { useEffect, useState } from 'react'

const DebugApp: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([])
  const [step, setStep] = useState(0)

  const addLog = (message: string) => {
    console.log(message)
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  useEffect(() => {
    addLog('DebugApp mounted')
    
    const timer = setTimeout(() => {
      setStep(1)
      addLog('Step 1: Basic React working')
    }, 100)

    return () => {
      clearTimeout(timer)
      addLog('DebugApp unmounting')
    }
  }, [])

  useEffect(() => {
    if (step === 1) {
      addLog('Step 2: useEffect working')
      const timer = setTimeout(() => {
        setStep(2)
        addLog('Step 3: Timers working')
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [step])

  return (
    <div className="h-screen w-screen bg-gray-900 text-white p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">StellarEye Debug</h1>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-800 p-4 rounded">
            <h2 className="text-xl font-bold mb-2">Status</h2>
            <div className="space-y-2">
              <div className={`flex items-center space-x-2 ${step >= 0 ? 'text-green-400' : 'text-gray-400'}`}>
                <span>✓</span>
                <span>React Rendering</span>
              </div>
              <div className={`flex items-center space-x-2 ${step >= 1 ? 'text-green-400' : 'text-gray-400'}`}>
                <span>{step >= 1 ? '✓' : '○'}</span>
                <span>useEffect Working</span>
              </div>
              <div className={`flex items-center space-x-2 ${step >= 2 ? 'text-green-400' : 'text-gray-400'}`}>
                <span>{step >= 2 ? '✓' : '○'}</span>
                <span>Timers Working</span>
              </div>
            </div>
            
            <div className="mt-4">
              <p className="text-sm text-gray-400">Current Step: {step}</p>
              <p className="text-sm text-gray-400">Logs: {logs.length}</p>
            </div>
          </div>
          
          <div className="bg-gray-800 p-4 rounded">
            <h2 className="text-xl font-bold mb-2">Console Logs</h2>
            <div className="bg-black p-2 rounded text-xs font-mono max-h-64 overflow-y-auto">
              {logs.map((log, index) => (
                <div key={index} className="text-green-400">
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-6 bg-blue-900 p-4 rounded">
          <h2 className="text-xl font-bold mb-2">Instructions</h2>
          <p className="text-sm">
            This debug component tests basic React functionality. 
            If you see this and the steps complete, React is working fine.
            The issue is likely in a specific component or import.
          </p>
        </div>
      </div>
    </div>
  )
}

export default DebugApp