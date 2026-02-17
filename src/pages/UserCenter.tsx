import { useState } from 'react'
import {
  User,
  Shield,
  Star,
  Calendar,
  MapPin,
  Camera,
  FileText,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Leaf,
  History
} from 'lucide-react'

interface AssessmentRecord {
  id: string
  date: string
  grade: 'A' | 'B' | 'C'
  score: number
  capacity: string
}

interface TransactionRecord {
  id: string
  date: string
  type: 'sale' | 'purchase'
  product: string
  quantity: number
  amount: number
  status: 'completed' | 'pending' | 'cancelled'
}

interface PolicyRecord {
  id: string
  name: string
  type: string
  premium: number
  status: 'active' | 'expired' | 'claim'
  startDate: string
  endDate: string
}

export default function UserCenter() {
  const [activeTab, setActiveTab] = useState<'profile' | 'assessments' | 'transactions' | 'policies'>('profile')

  const userProfile = {
    name: '荔枝农户',
    company: '丰产荔枝专业合作社',
    location: '广东省茂名市电白区',
    phone: '138****8888',
    joinDate: '2024-03-15',
    creditScore: 850,
    creditLevel: '优秀',
    totalOrchards: 3,
    totalArea: 150,
    fulfillmentRate: 98.5
  }

  const assessmentRecords: AssessmentRecord[] = [
    { id: '1', date: '2026-02-16', grade: 'A', score: 92, capacity: '亩产约1200斤' },
    { id: '2', date: '2025-08-20', grade: 'A', score: 88, capacity: '亩产约1100斤' },
    { id: '3', date: '2025-03-10', grade: 'B', score: 78, capacity: '亩产约950斤' }
  ]

  const transactionRecords: TransactionRecord[] = [
    { id: '1', date: '2025-12-15', type: 'sale', product: '妃子笑荔枝', quantity: 10, amount: 18500, status: 'completed' },
    { id: '2', date: '2025-11-20', type: 'sale', product: '白糖罂荔枝', quantity: 8, amount: 16000, status: 'completed' },
    { id: '3', date: '2025-10-05', type: 'purchase', product: '有机肥', quantity: 5, amount: 5000, status: 'completed' },
    { id: '4', date: '2026-01-10', type: 'sale', product: '桂味荔枝', quantity: 6, amount: 13200, status: 'pending' }
  ]

  const policyRecords: PolicyRecord[] = [
    { id: '1', name: '优质优价保障', type: '价格保险', premium: 10200, status: 'active', startDate: '2025-06-01', endDate: '2026-05-31' },
    { id: '2', name: '成本兜底保障', type: '价格保险', premium: 4200, status: 'expired', startDate: '2024-06-01', endDate: '2025-05-31' }
  ]

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A':
        return 'bg-gradient-to-r from-emerald-500 to-cyan-500'
      case 'B':
        return 'bg-gradient-to-r from-blue-500 to-indigo-500'
      case 'C':
        return 'bg-gradient-to-r from-amber-500 to-orange-500'
      default:
        return 'bg-slate-500'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-100 text-emerald-700'
      case 'pending':
        return 'bg-amber-100 text-amber-700'
      case 'cancelled':
        return 'bg-red-100 text-red-700'
      case 'active':
        return 'bg-emerald-100 text-emerald-700'
      case 'expired':
        return 'bg-slate-100 text-slate-700'
      case 'claim':
        return 'bg-blue-100 text-blue-700'
      default:
        return 'bg-slate-100 text-slate-700'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">信用风控档案</h1>
          <p className="text-slate-500 mt-1">您的数字信用画像与历史记录</p>
        </div>
      </div>

      {/* Profile Overview */}
      <div className="grid grid-cols-3 gap-6">
        {/* User Info Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">{userProfile.name}</h3>
              <p className="text-sm text-slate-500">{userProfile.company}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-3 text-sm">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span className="text-slate-600">{userProfile.location}</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <Shield className="w-4 h-4 text-slate-400" />
              <span className="text-slate-600">{userProfile.phone}</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span className="text-slate-600">入驻时间: {userProfile.joinDate}</span>
            </div>
          </div>
        </div>

        {/* Credit Score Card */}
        <div className="bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl p-6 text-white">
          <div className="flex items-center space-x-2 mb-4">
            <Star className="w-5 h-5 text-amber-300" />
            <span className="text-white/80">信用评分</span>
          </div>
          <div className="flex items-baseline">
            <span className="text-5xl font-bold">{userProfile.creditScore}</span>
            <span className="text-xl ml-2 text-white/80">分</span>
          </div>
          <div className="mt-4 pt-4 border-t border-white/20">
            <div className="flex items-center justify-between">
              <span className="text-white/80">信用等级</span>
              <span className="font-medium">{userProfile.creditLevel}</span>
            </div>
          </div>

          {/* Credit Progress */}
          <div className="mt-4">
            <div className="w-full bg-white/20 rounded-full h-2">
              <div className="bg-white h-2 rounded-full" style={{ width: `${(userProfile.creditScore / 1000) * 100}%` }}></div>
            </div>
            <div className="flex justify-between text-xs text-white/60 mt-1">
              <span>300</span>
              <span>850</span>
              <span>1000</span>
            </div>
          </div>
        </div>

        {/* Stats Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-emerald-50 rounded-xl">
              <p className="text-2xl font-bold text-emerald-600">{userProfile.totalOrchards}</p>
              <p className="text-sm text-slate-500 mt-1">果园数量</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <p className="text-2xl font-bold text-blue-600">{userProfile.totalArea}</p>
              <p className="text-sm text-slate-500 mt-1">总面积(亩)</p>
            </div>
            <div className="text-center p-4 bg-amber-50 rounded-xl col-span-2">
              <p className="text-2xl font-bold text-amber-600">{userProfile.fulfillmentRate}%</p>
              <p className="text-sm text-slate-500 mt-1">履约率</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100">
        <div className="flex border-b border-slate-200">
          {[
            { id: 'profile', label: '数字果园档案', icon: Leaf },
            { id: 'assessments', label: '评估记录', icon: Camera },
            { id: 'transactions', label: '交易记录', icon: History },
            { id: 'policies', label: '保单记录', icon: Shield }
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
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-800">果园档案</h3>
                <button className="text-sm text-emerald-600 hover:text-emerald-700">编辑档案</button>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {[
                  { name: '电白基地1号', area: 50, variety: '妃子笑', status: 'A级认证' },
                  { name: '电白基地2号', area: 60, variety: '白糖罂', status: 'A级认证' },
                  { name: '海口基地', area: 40, variety: '桂味', status: 'B级认证' }
                ].map((orchard, index) => (
                  <div key={index} className="p-4 border border-slate-200 rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-slate-800">{orchard.name}</h4>
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full">
                        {orchard.status}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-500">面积</span>
                        <span className="text-slate-700">{orchard.area}亩</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">品种</span>
                        <span className="text-slate-700">{orchard.variety}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'assessments' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-800">AI评估历史记录</h3>
                <button className="text-sm text-emerald-600 hover:text-emerald-700">申请新评估</button>
              </div>

              <div className="space-y-3">
                {assessmentRecords.map((record) => (
                  <div key={record.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-full ${getGradeColor(record.grade)} flex items-center justify-center text-white font-bold`}>
                        {record.grade}
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{record.capacity}</p>
                        <p className="text-sm text-slate-500">{record.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-800">{record.score}分</p>
                      <p className="text-sm text-slate-500">综合评分</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'transactions' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-800">交易履约记录</h3>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">日期</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">类型</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">商品</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">数量</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">金额</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">状态</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactionRecords.map((record) => (
                      <tr key={record.id} className="border-b border-slate-100">
                        <td className="py-3 px-4 text-sm text-slate-600">{record.date}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            record.type === 'sale' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {record.type === 'sale' ? '销售' : '采购'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-800">{record.product}</td>
                        <td className="py-3 px-4 text-sm text-slate-600">{record.quantity}吨</td>
                        <td className="py-3 px-4 text-sm font-medium text-slate-800">¥{record.amount.toLocaleString()}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(record.status)}`}>
                            {record.status === 'completed' ? '已完成' : record.status === 'pending' ? '进行中' : '已取消'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'policies' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-800">保障保单记录</h3>

              <div className="space-y-3">
                {policyRecords.map((policy) => (
                  <div key={policy.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-xl flex items-center justify-center">
                        <Shield className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{policy.name}</p>
                        <p className="text-sm text-slate-500">{policy.type} · ¥{policy.premium.toLocaleString()}/年</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(policy.status)}`}>
                        {policy.status === 'active' ? '生效中' : policy.status === 'expired' ? '已过期' : '理赔中'}
                      </span>
                      <p className="text-xs text-slate-500 mt-1">{policy.startDate} - {policy.endDate}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Risk Warning */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start space-x-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
        <div>
          <h4 className="font-medium text-amber-800">风险提示</h4>
          <p className="text-sm text-amber-700 mt-1">
            您的信用评分良好，当前无风险记录。保持良好的交易履约行为有助于提升信用等级。
          </p>
        </div>
      </div>
    </div>
  )
}
