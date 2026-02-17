import { Bell, Search, MessageSquare } from 'lucide-react'

export default function TopBar() {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
      {/* Search */}
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="搜索品种、产地、价格..."
            className="pl-10 pr-4 py-2 w-80 bg-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <button className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Messages */}
        <button className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg">
          <MessageSquare className="w-5 h-5" />
        </button>

        {/* Divider */}
        <div className="w-px h-8 bg-slate-200"></div>

        {/* Date/Time */}
        <div className="text-sm text-slate-600">
          <span className="font-medium">2026年2月16日</span>
          <span className="text-slate-400 ml-2">周日</span>
        </div>
      </div>
    </header>
  )
}
