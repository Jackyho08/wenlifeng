import { useState } from 'react'
import {
  Settings,
  Database,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Users,
  Shield,
  FileText,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  MapPin,
  Calendar,
  RefreshCw
} from 'lucide-react'

interface PriceData {
  id: string
  date: string
  region: string
  variety: string
  guidePrice: number
  marketPrice: number
  source: string
}

interface RiskAlert {
  id: string
  type: string
  user: string
  description: string
  severity: 'low' | 'medium' | 'high'
  status: 'pending' | 'reviewed' | 'resolved'
  date: string
}

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<'prices' | 'risks' | 'users'>('prices')
  const [showAddPrice, setShowAddPrice] = useState(false)

  const priceData: PriceData[] = [
    { id: '1', date: '2026-02-16', region: '广东省', variety: '妃子笑', guidePrice: 14.6, marketPrice: 14.5, source: '农科院' },
    { id: '2', date: '2026-02-16', region: '海南省', variety: '白糖罂', guidePrice: 15.0, marketPrice: 15.2, source: '农科院' },
    { id: '3', date: '2026-02-16', region: '福建省', variety: '桂味', guidePrice: 16.5, marketPrice: 16.2, source: '农业部' },
    { id: '4', date: '2026-02-15', region: '广东省', variety: '妃子笑', guidePrice: 14.6, marketPrice: 14.2, source: '农科院' },
    { id: '5', date: '2026-02-15', region: '海南省', variety: '白糖罂', guidePrice: 15.0, marketPrice: 14.8, source: '农科院' }
  ]

  const riskAlerts: RiskAlert[] = [
    { id: '1', type: '照片重复', user: '用户***8888', description: '该用户上传的照片与历史记录高度相似', severity: 'high', status: 'pending', date: '2026-02-16' },
    { id: '2', type: '评级异常', user: '用户***6666', description: '交易评价与AI评级严重不符', severity: 'medium', status: 'pending', date: '2026-02-15' },
    { id: '3', type: '信用异常', user: '用户***9999', description: '多次取消订单，履约率低于60%', severity: 'high', status: 'reviewed', date: '2026-02-14' },
    { id: '4', type: '地址异常', user: '用户***7777', description: '果园地址与实际产地不符', severity: 'low', status: 'resolved', date: '2026-02-13' }
  ]

  const stats = [
    { label: '今日更新价格', value: '12', icon: Database, color: 'emerald' },
    { label: '待处理风险', value: '8', icon: AlertTriangle, color: 'amber' },
    { label: '注册用户', value: '1,286', icon: Users, color: 'blue' },
    { label: '活跃果园', value: '856', icon: Shield, color: 'purple' }
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-700'
      case 'medium':
        return 'bg-amber-100 text-amber-700'
      case 'low':
        return 'bg-blue-100 text-blue-700'
      default:
        return 'bg-slate-100 text-slate-700'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-100 text-amber-700'
      case 'reviewed':
        return 'bg-blue-100 text-blue-700'
      case 'resolved':
        return 'bg-emerald-100 text-emerald-700'
      default:
        return 'bg-slate-100 text-slate-700'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">后台管理系统</h1>
          <p className="text-slate-500 mt-1">数据源管理与风控监管</p>
        </div>
        <div className="flex items-center space-x-2">
          <button className="flex items-center space-x-2 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
            <RefreshCw className="w-4 h-4" />
            <span>同步数据</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</p>
                </div>
                <div className={`w-10 h-10 bg-${stat.color}-100 rounded-xl flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 text-${stat.color}-600`} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100">
        <div className="flex border-b border-slate-200">
          {[
            { id: 'prices', label: '价格数据管理', icon: Database },
            { id: 'risks', label: '风控预警台', icon: AlertTriangle },
            { id: 'users', label: '用户管理', icon: Users }
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-emerald-600 border-b-2 border-emerald-500 bg-emerald-50'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        <div className="p-6">
          {activeTab === 'prices' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <input
                      type="date"
                      className="px-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                  <select className="px-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
                    <option>全部品种</option>
                    <option>妃子笑</option>
                    <option>白糖罂</option>
                    <option>桂味</option>
                    <option>糯米糍</option>
                  </select>
                  <select className="px-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
                    <option>全部产地</option>
                    <option>广东省</option>
                    <option>海南省</option>
                    <option>福建省</option>
                  </select>
                </div>
                <button
                  onClick={() => setShowAddPrice(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>添加价格</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">日期</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">产地</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">品种</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">指导价</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">市场价</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">数据源</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {priceData.map((record) => (
                      <tr key={record.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4 text-sm text-slate-600">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            <span>{record.date}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-800">
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-slate-400" />
                            <span>{record.region}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-700">{record.variety}</td>
                        <td className="py-3 px-4 text-sm font-medium text-emerald-600">{record.guidePrice}元/斤</td>
                        <td className="py-3 px-4 text-sm">
                          <div className="flex items-center space-x-1">
                            <span className="font-medium text-slate-800">{record.marketPrice}元/斤</span>
                            {record.marketPrice >= record.guidePrice ? (
                              <TrendingUp className="w-3 h-3 text-emerald-500" />
                            ) : (
                              <TrendingDown className="w-3 h-3 text-red-500" />
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-600">{record.source}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <button className="p-1 text-slate-400 hover:text-emerald-500 transition-colors">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="p-1 text-slate-400 hover:text-red-500 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'risks' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-800">风控预警中心</h3>
                <div className="flex items-center space-x-2 text-sm">
                  <span className="px-2 py-1 bg-red-100 text-red-700 rounded">高风险: 2</span>
                  <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded">中风险: 1</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">低风险: 1</span>
                </div>
              </div>

              <div className="space-y-3">
                {riskAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        alert.severity === 'high' ? 'bg-red-100' :
                        alert.severity === 'medium' ? 'bg-amber-100' : 'bg-blue-100'
                      }`}>
                        <AlertTriangle className={`w-5 h-5 ${
                          alert.severity === 'high' ? 'text-red-600' :
                          alert.severity === 'medium' ? 'text-amber-600' : 'text-blue-600'
                        }`} />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="font-medium text-slate-800">{alert.type}</p>
                          <span className={`px-2 py-0.5 text-xs rounded-full ${getSeverityColor(alert.severity)}`}>
                            {alert.severity === 'high' ? '高' : alert.severity === 'medium' ? '中' : '低'}
                          </span>
                        </div>
                        <p className="text-sm text-slate-500 mt-1">{alert.user} - {alert.description}</p>
                        <p className="text-xs text-slate-400 mt-1">{alert.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(alert.status)}`}>
                        {alert.status === 'pending' ? '待处理' : alert.status === 'reviewed' ? '已审核' : '已解决'}
                      </span>
                      {alert.status === 'pending' && (
                        <button className="ml-2 px-3 py-1 text-sm bg-emerald-500 text-white rounded-lg hover:bg-emerald-600">
                          处理
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-800">用户管理</h3>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="搜索用户..."
                    className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">用户</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">果园数量</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">信用评分</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">注册时间</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">状态</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: '荔枝农户', phone: '138****8888', orchards: 3, score: 850, date: '2024-03-15', status: '正常' },
                      { name: '海口果农', phone: '139****9999', orchards: 2, score: 780, date: '2024-05-20', status: '正常' },
                      { name: '漳州种植户', phone: '136****6666', orchards: 1, score: 520, date: '2024-08-10', status: '限制' },
                      { name: '从化果园', phone: '137****7777', orchards: 4, score: 920, date: '2024-01-05', status: '正常' }
                    ].map((user, index) => (
                      <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-slate-800">{user.name}</p>
                            <p className="text-sm text-slate-500">{user.phone}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-600">{user.orchards}</td>
                        <td className="py-3 px-4">
                          <span className={`font-medium ${
                            user.score >= 800 ? 'text-emerald-600' :
                            user.score >= 600 ? 'text-amber-600' : 'text-red-600'
                          }`}>
                            {user.score}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-600">{user.date}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            user.status === '正常' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <button className="p-1 text-slate-400 hover:text-emerald-500 transition-colors">
                              <FileText className="w-4 h-4" />
                            </button>
                            <button className="p-1 text-slate-400 hover:text-blue-500 transition-colors">
                              <Settings className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Price Modal */}
      {showAddPrice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-800">添加价格数据</h3>
              <button
                onClick={() => setShowAddPrice(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">日期</label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">产地</label>
                  <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
                    <option>广东省</option>
                    <option>海南省</option>
                    <option>福建省</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">品种</label>
                  <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
                    <option>妃子笑</option>
                    <option>白糖罂</option>
                    <option>桂味</option>
                    <option>糯米糍</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">指导价（元/斤）</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="请输入指导价"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">市场价（元/斤）</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="请输入市场价"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">数据源</label>
                <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
                  <option>农科院</option>
                  <option>农业部</option>
                  <option>批发市场</option>
                  <option>手动录入</option>
                </select>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddPrice(false)}
                  className="flex-1 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                >
                  保存
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
