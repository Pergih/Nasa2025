import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MainLayout from './components/layout/MainLayout'
import ExplorePage from './pages/ExplorePage'
import ExplorePageSimple from './pages/ExplorePageSimple'
import AboutPage from './pages/AboutPage'
import SimpleTest from './components/debug/SimpleTest'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white">
        <Routes>
          <Route path="/debug" element={<SimpleTest />} />
          <Route path="/simple" element={<ExplorePageSimple />} />
          <Route path="/" element={<MainLayout />}>
            <Route index element={<ExplorePage />} />
            <Route path="about" element={<AboutPage />} />
          </Route>
        </Routes>
      </div>
    </Router>
  )
}

export default App