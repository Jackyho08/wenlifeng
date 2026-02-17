import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
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
import './index.css'

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')

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
        <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopBar />
          <main className="flex-1 overflow-y-auto p-6">
            {renderPage()}
          </main>
        </div>
        <Toaster position="top-right" />
      </div>
    </BrowserRouter>
  )
}

export default App
