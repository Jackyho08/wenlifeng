import {
  LayoutDashboard,
  Leaf,
  Shield,
  Calculator,
  Store,
  User,
  Settings,
  Sprout,
  Menu,
  X
} from 'lucide-react'
import { useState } from 'react'

interface MobileNavProps {
  currentPage: string
  setCurrentPage: (page: string) => void
}

const menuItems = [
  { id: 'dashboard', label: '首页', icon: LayoutDashboard },
  { id: 'assessment', label: '评估', icon: Leaf },
  { id: 'insurance', label: '保险', icon: Shield },
  { id: 'calculator', label: '计算', icon: Calculator },
  { id: 'marketplace', label: '商城', icon: Store },
  { id: 'user', label: '我的', icon: User },
]

export default function MobileNav({ currentPage, setCurrentPage }: MobileNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-pb">
      <div className="flex justify-around items-center h-16">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = currentPage === item.id
          
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`flex flex-col items-center justify-center flex-1 h-full space-y-1 transition-colors ${
                isActive ? 'text-emerald-600' : 'text-gray-500'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs">{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

interface MobileHeaderProps {
  onMenuClick: () => void
}

export function MobileHeader({ onMenuClick }: MobileHeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 bg-slate-900 text-white z-40 h-14 flex items-center px-4">
      <button onClick={onMenuClick} className="p-2 -ml-2">
        <Menu className="w-6 h-6" />
      </button>
      <div className="flex items-center space-x-2 ml-2">
        <Sprout className="w-6 h-6 text-emerald-400" />
        <span className="font-bold">智荔链</span>
      </div>
    </header>
  )
}

interface MobileSidebarProps {
  isOpen: boolean
  onClose: () => void
  currentPage: string
  setCurrentPage: (page: string) => void
}

export function MobileSidebar({ isOpen, onClose, currentPage, setCurrentPage }: MobileSidebarProps) {
  if (!isOpen) return null

  const allItems = [
    { id: 'dashboard', label: '决策驾驶舱', icon: LayoutDashboard },
    { id: 'assessment', label: 'AI物候评估', icon: Leaf },
    { id: 'insurance', label: '保障定制大厅', icon: Shield },
    { id: 'calculator', label: '智能赔付计算', icon: Calculator },
    { id: 'marketplace', label: '智荔链产销大厅', icon: Store },
    { id: 'user', label: '信用风控档案', icon: User },
    { id: 'admin', label: '后台管理系统', icon: Settings },
  ]

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <aside className="absolute left-0 top-0 bottom-0 w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Sprout className="w-6 h-6 text-emerald-400" />
            <span className="font-bold">智荔链</span>
          </div>
          <button onClick={onClose} className="p-2">
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {allItems.map((item) => {
            const Icon = item.icon
            const isActive = currentPage === item.id
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentPage(item.id)
                  onClose()
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500 to-cyan-500'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            )
          })}
        </nav>
      </aside>
    </div>
  )
}
