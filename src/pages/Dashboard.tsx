import { useState, useEffect } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts'
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Calendar,
  Camera,
  Shield,
  Store,
  MapPin,
  CloudRain,
  Thermometer
} from 'lucide-react'

// Mock data for price trends
const priceData = {
  dates: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  guidePrice: [18, 18, 17, 16, 15, 14, 15, 16, 17, 18, 19, 19],
  marketPrice: [17, 18.5, 16.5, 15, 14.5, 13, 14, 17, 16.5, 18, 19.5, 18.5],
  predictedPrice: [null, null, null, null, null, null, null, null, null, null, 19.2, 19.8]
}

// Transform data for recharts
const chartData = priceData.dates.map((date, index) => ({
  name: date,
  指导价: priceData.guidePrice[index],
  市场价: priceData.marketPrice[index],
  预测价: priceData.predictedPrice[index]
}))

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState('year')

  // Get current phenology stage based on date
  const getCurrentPhenology = () => {
    const month = new Date().getMonth() + 1
    if (month >= 2 && month <= 3) return { stage: '花芽分化期', tip: '适宜喷施促花肥', risk: 'low' }
    if (month >= 3 && month <= 4) return { stage: '开花期', tip: '注意防治霜霉病', risk: 'medium' }
    if (month >= 4 && month <= 5) return { stage: '幼果期', tip: '第二次生理落果稳定期', risk: 'low' }
    if (month >= 5 && month <= 6) return { stage: '果实膨大期', tip: '加强水肥管理', risk: 'low' }
    if (month >= 6 && month <= 7) return { stage: '成熟期', tip: '适时采收', risk: 'low' }
    return { stage: '秋梢管理期', tip: '修剪病虫枝', risk: 'low' }
  }

  const phenology = getCurrentPhenology()

  const stats = [
    {
      title: '今日区域均价',
      value: '14.5',
      unit: '元/斤',
      change: '+2.3%',
      trend: 'up',
      icon: TrendingUp,
      color: 'emerald'
    },
    {
      title: '价格波动率',
      value: '8.2',
      unit: '%',
      change: '-1.5%',
      trend: 'down',
      icon: TrendingDown,
      color: 'blue'
    },
    {
      title: '市场风险等级',
      value: '中等',
      unit: '',
      change: '',
      trend: 'neutral',
      icon: AlertTriangle,
      color: 'amber'
    }
  ]

  const quickActions = [
    { id: 'assessment', label: 'AI物候评估', icon: Camera, color: 'from-emerald-500 to-cyan-500' },
    { id: 'insurance', label: '保障方案定制', icon: Shield, color: 'from-blue-500 to-indigo-500' },
    { id: 'marketplace', label: '产销对接大厅', icon: Store, color: 'from-amber-500 to-orange-500' },
    { id: 'traceability', label: '溯源查询', icon: MapPin, color: 'from-purple-500 to-pink-500' }
  ]

  const weatherInfo = [
    { icon: Thermometer, label: '温度', value: '22°C' },
    { icon: CloudRain, label: '降水', value: '15mm' },
    { icon: Calendar, label: '日照', value: '6h' }
  ]

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800">智慧农业决策驾驶舱</h1>
          <p className="text-slate-500 mt-1 text-sm">实时掌握市场价格，智能决策辅助</p>
        </div>
        <div className="flex items-center space-x-2 bg-white px-3 md:px-4 py-2 rounded-lg shadow-sm text-xs md:text-sm">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span className="text-slate-600 whitespace-nowrap">2026-02-16 11:30</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">{stat.title}</p>
                  <div className="flex items-baseline mt-2">
                    <span className={`text-3xl font-bold text-${stat.color}-600`}>{stat.value}</span>
                    <span className="text-sm text-slate-400 ml-1">{stat.unit}</span>
                  </div>
                  {stat.change && (
                    <p className={`text-sm mt-1 ${stat.trend === 'up' ? 'text-emerald-600' : stat.trend === 'down' ? 'text-blue-600' : 'text-amber-600'}`}>
                      {stat.change}
                    </p>
                  )}
                </div>
                <div className={`w-12 h-12 bg-${stat.color}-100 rounded-xl flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {/* Price Chart */}
        <div className="md:col-span-2 bg-white rounded-xl p-4 md:p-6 shadow-sm border border-slate-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
            <h3 className="font-semibold text-slate-800">价格指数可视化看板</h3>
            <div className="flex space-x-2">
              {['近7天', '近30天', '全年'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1 text-xs md:text-sm rounded-lg ${
                    timeRange === range
                      ? 'bg-emerald-500 text-white'
                      : 'text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} unit="元/斤" />
              <Tooltip
                contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid #e2e8f0', borderRadius: '8px' }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="指导价"
                stroke="#059669"
                strokeWidth={3}
                fill="rgba(5, 150, 105, 0.1)"
              />
              <Line
                type="monotone"
                dataKey="市场价"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6' }}
              />
              <Line
                type="monotone"
                dataKey="预测价"
                stroke="#f59e0b"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: '#f59e0b' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Phenology Alert */}
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-slate-100">
          <h3 className="font-semibold text-slate-800 mb-3 md:mb-4">物候节点智能提醒</h3>

          <div className="bg-gradient-to-br from-emerald-50 to-cyan-50 rounded-xl p-3 md:p-4 mb-3 md:mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-500">当前物候期</span>
              <span className={`px-2 py-1 text-xs rounded-full ${
                phenology.risk === 'low' ? 'bg-emerald-100 text-emerald-700' :
                phenology.risk === 'medium' ? 'bg-amber-100 text-amber-700' :
                'bg-red-100 text-red-700'
              }`}>
                {phenology.risk === 'low' ? '低风险' : phenology.risk === 'medium' ? '中等风险' : '高风险'}
              </span>
            </div>
            <p className="text-xl font-bold text-slate-800">{phenology.stage}</p>
            <p className="text-sm text-slate-600 mt-2">{phenology.tip}</p>
          </div>

          {/* Weather Info */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {weatherInfo.map((weather, index) => {
              const Icon = weather.icon
              return (
                <div key={index} className="text-center p-2 bg-slate-50 rounded-lg">
                  <Icon className="w-4 h-4 text-slate-400 mx-auto mb-1" />
                  <p className="text-xs text-slate-500">{weather.label}</p>
                  <p className="text-sm font-medium text-slate-700">{weather.value}</p>
                </div>
              )
            })}
          </div>

          {/* AI Photo Tip */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <Camera className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-medium text-amber-800">建议行动</span>
            </div>
            <p className="text-xs text-amber-700 mt-1">当前处于果实关键生长期，建议您进行AI拍照评估，锁定投保资格</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {quickActions.map((action) => {
          const Icon = action.icon
          return (
            <button
              key={action.id}
              className={`flex items-center space-x-3 p-4 bg-gradient-to-r ${action.color} rounded-xl text-white hover:shadow-lg transition-shadow`}
            >
              <Icon className="w-6 h-6" />
              <span className="font-medium">{action.label}</span>
            </button>
          )
        })}
      </div>

      {/* Market Info */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
        <h3 className="font-semibold text-slate-800 mb-4">主要批发市场行情</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">市场名称</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">品种</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">今日均价</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">较昨日</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">成交量</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">库存状态</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: '广州江南市场', variety: '妃子笑', price: 15.2, change: '+3.2%', volume: '120吨', stock: '充足' },
                { name: '海口南北市场', variety: '白糖罂', price: 14.8, change: '+1.8%', volume: '85吨', stock: '充足' },
                { name: '深圳海吉星', variety: '桂味', price: 18.5, change: '-0.5%', volume: '45吨', stock: '偏紧' },
                { name: '北京新发地', variety: '妃子笑', price: 22.0, change: '+2.1%', volume: '30吨', stock: '充足' }
              ].map((market, index) => (
                <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-4 text-sm font-medium text-slate-800">{market.name}</td>
                  <td className="py-3 px-4 text-sm text-slate-600">{market.variety}</td>
                  <td className="py-3 px-4 text-sm font-medium text-slate-800">{market.price}元/斤</td>
                  <td className={`py-3 px-4 text-sm ${market.change.startsWith('+') ? 'text-emerald-600' : 'text-red-600'}`}>
                    {market.change}
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-600">{market.volume}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      market.stock === '充足' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {market.stock}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
