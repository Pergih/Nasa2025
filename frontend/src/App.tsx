import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import MainLayout from './components/layout/MainLayout'
import ExplorePage from './pages/ExplorePage'
import AboutPage from './pages/AboutPage'
import { registerServiceWorker } from './utils/serviceWorker'
import './styles/scrollbar.css'

function App() {
  useEffect(() => {
    // Register service worker for advanced caching
    registerServiceWorker()
  }, [])

  return (
    <Router>
      <div className="h-screen w-screen bg-gray-900 text-white overflow-hidden">
        <Routes>
          <Route path="/" element={<ExplorePage />} />
          <Route path="/about" element={<MainLayout />}>
            <Route index element={<AboutPage />} />
          </Route>
        </Routes>
      </div>
    </Router>
  )
}

export default App