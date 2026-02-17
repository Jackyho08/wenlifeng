import {
  LayoutDashboard,
  Leaf,
  Shield,
  Calculator,
  Store,
  User,
  Settings,
  Sprout
} from 'lucide-react'

interface SidebarProps {
  currentPage: string
  setCurrentPage: (page: string) => void
}

const menuItems = [
  { id: 'dashboard', label: '决策驾驶舱', icon: LayoutDashboard },
  { id: 'assessment', label: 'AI物候评估', icon: Leaf },
  { id: 'insurance', label: '保障定制大厅', icon: Shield },
  { id: 'calculator', label: '智能赔付计算', icon: Calculator },
  { id: 'marketplace', label: '智荔链产销大厅', icon: Store },
  { id: 'user', label: '信用风控档案', icon: User },
  { id: 'admin', label: '后台管理系统', icon: Settings },
]

export default function Sidebar({ currentPage, setCurrentPage }: SidebarProps) {
  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-xl flex items-center justify-center">
            <Sprout className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold">智荔链</h1>
            <p className="text-xs text-slate-400">AI价格预测平台</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = currentPage === item.id

          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          )
        })}
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-slate-400" />
          </div>
          <div>
            <p className="text-sm font-medium">荔枝农户</p>
            <p className="text-xs text-slate-400">A级认证果园</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
