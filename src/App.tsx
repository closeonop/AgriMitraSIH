import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

// Components
import Header from './components/Header'
import Hero from './components/Hero'
import ChatBotPreview from './components/ChatBotPreview'
import VoiceAssistant from './components/VoiceAssistant'
import Features from './components/Features'
import StorySection from './components/StorySection'
import ContactForm from './components/ContactForm'
import Footer from './components/Footer'
import MobileMenu from './components/MobileMenu'
import SoilHealth from './components/SoilHealth'

// Pages
import Dashboard from './pages/Dashboard'
import Predictions from './pages/Predictions'
import Recommendations from './pages/Recommendations'
import ChatBot from './pages/ChatBot'
import Settings from './pages/Settings'
import WeatherForecast from './pages/WeatherForecast'
import SoilHealthAnalysis from './pages/SoilHealthAnalysis'
import CropMonitoring from './pages/CropMonitoring'
import MarketIntelligence from './pages/MarketIntelligence'

// Contexts
import { FieldProvider } from './contexts/FieldContext'

import './styles/globals.css'

function App() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState('home')

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />
      case 'predictions':
        return <Predictions />
      case 'recommendations':
        return <Recommendations />
      case 'chatbot':
        return <ChatBot />
      case 'settings':
        return <Settings />
      case 'soil-health':
        return <SoilHealth />
      case 'weather-forecast':
        return <WeatherForecast />
      case 'soil-health-analysis':
        return <SoilHealthAnalysis />
      case 'crop-monitoring':
        return <CropMonitoring />
      case 'market-intelligence':
        return <MarketIntelligence />
      case 'contact':
        return <ContactForm />
      default:
        return (
          <>
            <Hero onNavigate={setCurrentPage} />
            <ChatBotPreview onNavigate={setCurrentPage} />
            <Features onNavigate={setCurrentPage} />
            <StorySection />
            <ContactForm />
          </>
        )
    }
  }

  return (
    <FieldProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
        {/* Header */}
        <Header 
          isScrolled={isScrolled}
          onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
          onNavigate={setCurrentPage}
          currentPage={currentPage}
        />

        {/* Mobile Menu */}
        <MobileMenu 
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          onNavigate={(page) => {
            setCurrentPage(page)
            setMobileMenuOpen(false)
          }}
          currentPage={currentPage}
        />

        {/* Main Content */}
        <main className="pt-16 md:pt-20">
          {renderPage()}
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </FieldProvider>
  )
}

export default App