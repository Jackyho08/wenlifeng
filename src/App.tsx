import { useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'sonner'
import Dashboard from './pages/Dashboard'
import AssessmentCenter from './pages/AssessmentCenter'
import InsuranceHall from './pages/InsuranceHall'
import InsuranceCalculator from './pages/InsuranceCalculator'
import Marketplace from './pages/Marketplace'
import UserCenter from './pages/UserCenter'
import AdminPanel from './pages/AdminPanel'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
import MobileNav, { MobileHeader, MobileSidebar } from './components/MobileNav'
import { useIsMobile } from './hooks/use-mobile'
import './index.css'

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const isMobile = useIsMobile()

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />
      case 'assessment':
        return <AssessmentCenter />
      case 'insurance':
        return <InsuranceHall />
      case 'calculator':
        return <InsuranceCalculator />
      case 'marketplace':
        return <Marketplace />
      case 'user':
        return <UserCenter />
      case 'admin':
        return <AdminPanel />
      default:
        return <Dashboard />
    }
  }

  return (
    <BrowserRouter>
      <div className="flex h-screen bg-slate-50">
        {!isMobile && <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />}
        
        <div className="flex-1 flex flex-col overflow-hidden">
          {isMobile && <MobileHeader onMenuClick={() => setSidebarOpen(true)} />}
          {!isMobile && <TopBar />}
          
          <main className={`flex-1 overflow-y-auto ${isMobile ? 'pt-14 pb-20 px-4' : 'p-6'}`}>
            {renderPage()}
          </main>
        </div>

        {isMobile && <MobileNav currentPage={currentPage} setCurrentPage={setCurrentPage} />}
        <MobileSidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
        
        <Toaster position={isMobile ? 'top-center' : 'top-right'} />
      </div>
    </BrowserRouter>
  )
}

export default App
