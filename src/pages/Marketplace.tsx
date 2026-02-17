import { useState } from 'react'
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  Star,
  Shield,
  ChevronDown,
  Plus,
  MessageSquare,
  Phone,
  BadgeCheck
} from 'lucide-react'

interface Product {
  id: string
  name: string
  variety: string
  grade: 'A' | 'B' | 'C'
  price: number
  unit: string
  location: string
  estimatedTime: string
  quantity: number
  seller: string
  sellerRating: number
  certifications: string[]
  traceability: string
}

export default function Marketplace() {
  const [filters, setFilters] = useState({
    grade: '',
    location: '',
    variety: ''
  })
  const [showPurchaseForm, setShowPurchaseForm] = useState(false)

  const products: Product[] = [
    {
      id: '1',
      name: '优质妃子笑荔枝',
      variety: '妃子笑',
      grade: 'A',
      price: 18.5,
      unit: '元/斤',
      location: '广东省茂名市电白区',
      estimatedTime: '2026-06-15',
      quantity: 50,
      seller: '丰产荔枝专业合作社',
      sellerRating: 4.8,
      certifications: ['AI认证A级', '绿色食品', '地理标志'],
      traceability: '可追溯'
    },
    {
      id: '2',
      name: '白糖罂荔枝',
      variety: '白糖罂',
      grade: 'A',
      price: 20.0,
      unit: '元/斤',
      location: '海南省海口市',
      estimatedTime: '2026-06-10',
      quantity: 30,
      seller: '海南热带果园',
      sellerRating: 4.9,
      certifications: ['AI认证A级', '有机认证'],
      traceability: '可追溯'
    },
    {
      id: '3',
      name: '桂味荔枝',
      variety: '桂味',
      grade: 'B',
      price: 22.0,
      unit: '元/斤',
      location: '广东省广州市从化区',
      estimatedTime: '2026-06-20',
      quantity: 25,
      seller: '从化荔枝基地',
      sellerRating: 4.6,
      certifications: ['AI认证B级', '地理标志'],
      traceability: '可追溯'
    },
    {
      id: '4',
      name: '糯米糍荔枝',
      variety: '糯米糍',
      grade: 'A',
      price: 25.0,
      unit: '元/斤',
      location: '广东省深圳市南山区',
      estimatedTime: '2026-06-18',
      quantity: 15,
      seller: '南山果园',
      sellerRating: 4.7,
      certifications: ['AI认证A级', '绿色食品'],
      traceability: '可追溯'
    },
    {
      id: '5',
      name: '妃子笑荔枝',
      variety: '妃子笑',
      grade: 'C',
      price: 14.0,
      unit: '元/斤',
      location: '广西壮族自治区',
      estimatedTime: '2026-06-12',
      quantity: 80,
      seller: '广西荔枝农庄',
      sellerRating: 4.3,
      certifications: ['AI认证C级'],
      traceability: '可追溯'
    },
    {
      id: '6',
      name: '优质桂味荔枝',
      variety: '桂味',
      grade: 'B',
      price: 19.5,
      unit: '元/斤',
      location: '福建省漳州市',
      estimatedTime: '2026-06-22',
      quantity: 40,
      seller: '漳州水果批发市场',
      sellerRating: 4.5,
      certifications: ['AI认证B级', '地理标志'],
      traceability: '可追溯'
    }
  ]

  const filteredProducts = products.filter(product => {
    if (filters.grade && product.grade !== filters.grade) return false
    if (filters.location && !product.location.includes(filters.location)) return false
    if (filters.variety && product.variety !== filters.variety) return false
    return true
  })

  const varieties = ['妃子笑', '白糖罂', '桂味', '糯米糍']
  const locations = ['广东省', '海南省', '广西壮族自治区', '福建省']

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">智荔链 B2B 产销大厅</h1>
          <p className="text-slate-500 mt-1">AI认证优品，产销精准对接</p>
        </div>
        <button
          onClick={() => setShowPurchaseForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-lg hover:shadow-lg transition-shadow"
        >
          <Plus className="w-4 h-4" />
          <span>发布采购需求</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-slate-600">
            <Filter className="w-4 h-4" />
            <span>筛选条件:</span>
          </div>

          <div className="flex-1 grid grid-cols-4 gap-4">
            <select
              value={filters.grade}
              onChange={(e) => setFilters({ ...filters, grade: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="">全部等级</option>
              <option value="A">A级</option>
              <option value="B">B级</option>
              <option value="C">C级</option>
            </select>

            <select
              value={filters.variety}
              onChange={(e) => setFilters({ ...filters, variety: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="">全部品种</option>
              {varieties.map(v => <option key={v} value={v}>{v}</option>)}
            </select>

            <select
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="">全部产地</option>
              {locations.map(l => <option key={l} value={l}>{l}</option>)}
            </select>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="搜索商品..."
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 hover:shadow-lg transition-shadow"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-800">{product.name}</h3>
                <p className="text-sm text-slate-500 mt-1">{product.variety}</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getGradeColor(product.grade)}`}>
                {product.grade}级
              </div>
            </div>

            {/* Price */}
            <div className="mb-4">
              <span className="text-2xl font-bold text-emerald-600">{product.price}</span>
              <span className="text-sm text-slate-500 ml-1">{product.unit}</span>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="flex items-center space-x-2 text-sm text-slate-600">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span className="truncate">{product.location}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-slate-600">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>{product.estimatedTime}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-slate-600">
                <Shield className="w-4 h-4 text-slate-400" />
                <span>可售: {product.quantity}吨</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-slate-600">
                <BadgeCheck className="w-4 h-4 text-emerald-500" />
                <span>{product.traceability}</span>
              </div>
            </div>

            {/* Certifications */}
            <div className="flex flex-wrap gap-1 mb-4">
              {product.certifications.map((cert, index) => (
                <span
                  key={index}
                  className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded"
                >
                  {cert}
                </span>
              ))}
            </div>

            {/* Seller Info */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div>
                <p className="text-sm font-medium text-slate-700">{product.seller}</p>
                <div className="flex items-center space-x-1 mt-1">
                  <Star className="w-3 h-3 text-amber-400 fill-current" />
                  <span className="text-xs text-slate-500">{product.sellerRating}</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors">
                  <MessageSquare className="w-4 h-4" />
                </button>
                <button className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                  <Phone className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* CTA */}
            <button className="w-full mt-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-lg text-sm font-medium hover:shadow-md transition-shadow">
              联系采购
            </button>
          </div>
        ))}
      </div>

      {/* Purchase Request Form Modal */}
      {showPurchaseForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-800">发布采购需求</h3>
              <button
                onClick={() => setShowPurchaseForm(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  采购商名称
                </label>
                <input
                  type="text"
                  placeholder="请输入公司/个人名称"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    期望等级
                  </label>
                  <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
                    <option>A级</option>
                    <option>B级</option>
                    <option>C级</option>
                    <option>不限</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    期望品种
                  </label>
                  <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
                    <option>妃子笑</option>
                    <option>白糖罂</option>
                    <option>桂味</option>
                    <option>糯米糍</option>
                    <option>不限</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    采购数量（吨）
                  </label>
                  <input
                    type="number"
                    placeholder="请输入数量"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    期望价格（元/斤）
                  </label>
                  <input
                    type="number"
                    placeholder="请输入价格"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  收货时间
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  收货地址
                </label>
                <input
                  type="text"
                  placeholder="请输入收货地址"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  联系方式
                </label>
                <input
                  type="tel"
                  placeholder="请输入联系电话"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  备注信息
                </label>
                <textarea
                  rows={3}
                  placeholder="请输入其他要求..."
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-lg font-medium hover:shadow-lg transition-shadow"
              >
                发布采购需求
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: '在售商品', value: '128' },
          { label: '认证供应商', value: '86' },
          { label: '今日成交', value: '35' },
          { label: 'AI认证优品', value: '92' }
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-4 text-center shadow-sm border border-slate-100">
            <p className="text-2xl font-bold text-emerald-600">{stat.value}</p>
            <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
