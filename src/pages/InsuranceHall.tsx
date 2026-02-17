import { useState } from 'react'
import {
  Shield,
  Calculator,
  FileText,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Phone,
  Mail,
  ChevronRight
} from 'lucide-react'

interface InsurancePlan {
  id: string
  name: string
  triggerPrice: string
  premium: string
  description: string
  suitableFor: string
  features: string[]
  isHighlighted?: boolean
}

export default function InsuranceHall() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [orchardSize, setOrchardSize] = useState(10)
  const [marketPrice, setMarketPrice] = useState(14.5)
  const [calculationResult, setCalculationResult] = useState<{
    maxPayout: number
    maxProfit: number
    premium: number
  } | null>(null)
  const [showContract, setShowContract] = useState(false)
  const [contractType, setContractType] = useState<'order' | 'service' | null>(null)

  const plans: InsurancePlan[] = [
    {
      id: 'basic',
      name: '成本兜底',
      triggerPrice: '指导价下浮15%',
      premium: '2.8%',
      description: '保障种植成本不受严重跌价影响',
      suitableFor: '种植新手、风险厌恶型农户',
      features: [
        '触发价格：12.4元/斤',
        '保费费率：2.8%/亩',
        '最高赔付：3000元/亩',
        '覆盖成本价风险'
      ]
    },
    {
      id: 'standard',
      name: '稳健收益',
      triggerPrice: '锚定指导价',
      premium: '4.5%',
      description: '锁定预期收益，保障基本利润',
      suitableFor: '追求稳定收益的种植户',
      features: [
        '触发价格：14.6元/斤',
        '保费费率：4.5%/亩',
        '最高赔付：5000元/亩',
        '收益保障锁定'
      ],
      isHighlighted: false
    },
    {
      id: 'premium',
      name: '优质优价',
      triggerPrice: '指导价上浮10%',
      premium: '6.8%',
      description: '高溢价保障，未出险享平台免佣',
      suitableFor: 'A级认证果园、优质供应商',
      features: [
        '触发价格：16.1元/斤',
        '保费费率：6.8%/亩',
        '最高赔付：8000元/亩',
        '未出险平台免佣',
        '优先对接采购商'
      ],
      isHighlighted: true
    }
  ]

  const calculateReturns = () => {
    const guidePrice = 14.6
    const triggerPrice = selectedPlan === 'basic' ? guidePrice * 0.85 :
                         selectedPlan === 'premium' ? guidePrice * 1.1 : guidePrice

    const basePremium = selectedPlan === 'basic' ? 280 :
                        selectedPlan === 'premium' ? 680 : 450

    const premium = basePremium * orchardSize
    const maxPayout = (selectedPlan === 'basic' ? 3000 :
                      selectedPlan === 'premium' ? 8000 : 5000) * orchardSize

    const potentialLowPrice = 10
    const potentialHighPrice = 20

    const payout = marketPrice < triggerPrice ?
                   (triggerPrice - potentialLowPrice) * orchardSize * 1000 :
                   0
    const profit = marketPrice > triggerPrice ?
                   (potentialHighPrice - triggerPrice) * orchardSize * 1000 :
                   0

    setCalculationResult({
      maxPayout,
      maxProfit: profit > 0 ? profit : 0,
      premium
    })
  }

  const contracts = [
    {
      type: 'order' as const,
      title: '订单农业预售协议',
      description: '明确产销对接双方权利义务',
      content: [
        '第一条：甲方（采购方）向乙方（供应方）预订荔枝产品',
        '第二条：预订品种、规格、数量及价格',
        '第三条：交货时间、地点及方式',
        '第四条：质量标准及验收办法',
        '第五条：违约责任及争议解决'
      ]
    },
    {
      type: 'service' as const,
      title: '价格风险管理服务协议',
      description: '明确价格保险服务条款',
      content: [
        '第一条：服务内容与范围',
        '第二条：触发条件与赔付标准',
        '第三条：保费计算与缴纳方式',
        '第四条：理赔流程与时效',
        '第五条：双方权利与义务'
      ]
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">阶梯式保障定制大厅</h1>
          <p className="text-slate-500 mt-1">选择适配的风险管理方案，保障您的收益</p>
        </div>
      </div>

      {/* Insurance Plans */}
      <div className="grid grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative bg-white rounded-xl p-6 shadow-sm border-2 transition-all cursor-pointer ${
              plan.isHighlighted
                ? 'border-emerald-500 shadow-lg'
                : selectedPlan === plan.id
                ? 'border-blue-500'
                : 'border-slate-100 hover:border-slate-300'
            }`}
            onClick={() => setSelectedPlan(plan.id)}
          >
            {plan.isHighlighted && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  热门推荐
                </span>
              </div>
            )}

            <div className="text-center mb-6">
              <div className={`w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center ${
                plan.isHighlighted
                  ? 'bg-gradient-to-br from-emerald-500 to-cyan-500'
                  : 'bg-slate-100'
              }`}>
                <Shield className={`w-6 h-6 ${plan.isHighlighted ? 'text-white' : 'text-slate-600'}`} />
              </div>
              <h3 className="text-lg font-bold text-slate-800">{plan.name}</h3>
              <p className="text-sm text-slate-500 mt-1">{plan.description}</p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">触发价格</span>
                <span className={`font-medium ${plan.isHighlighted ? 'text-emerald-600' : 'text-slate-700'}`}>
                  {plan.triggerPrice}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">保费费率</span>
                <span className="font-medium text-slate-700">{plan.premium}</span>
              </div>
            </div>

            <div className="space-y-2">
              {plan.features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-600">{feature}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100">
              <p className="text-xs text-slate-500">适用人群</p>
              <p className="text-sm text-slate-700 mt-1">{plan.suitableFor}</p>
            </div>

            {selectedPlan === plan.id && (
              <div className="absolute top-4 right-4">
                <CheckCircle className="w-5 h-5 text-blue-500" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Calculator */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center space-x-2 mb-6">
          <Calculator className="w-5 h-5 text-emerald-600" />
          <h3 className="font-semibold text-slate-800">动态收益测算器</h3>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                种植规模（亩）
              </label>
              <input
                type="number"
                value={orchardSize}
                onChange={(e) => setOrchardSize(Number(e.target.value))}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                当前市场价格（元/斤）
              </label>
              <input
                type="number"
                value={marketPrice}
                onChange={(e) => setMarketPrice(Number(e.target.value))}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={calculateReturns}
              disabled={!selectedPlan}
              className={`w-full py-3 rounded-lg font-medium transition-all ${
                selectedPlan
                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:shadow-lg'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              计算收益
            </button>
          </div>

          <div className="col-span-2">
            {calculationResult ? (
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-4 border border-red-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingDown className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-red-700">跌价时赔付</span>
                  </div>
                  <p className="text-2xl font-bold text-red-600">
                    ¥{calculationResult.maxPayout.toLocaleString()}
                  </p>
                  <p className="text-xs text-red-500 mt-1">最高赔付金额</p>
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-cyan-50 rounded-xl p-4 border border-emerald-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm text-emerald-700">涨价时收益</span>
                  </div>
                  <p className="text-2xl font-bold text-emerald-600">
                    ¥{calculationResult.maxProfit.toLocaleString()}
                  </p>
                  <p className="text-xs text-emerald-500 mt-1">预估超额收益</p>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Shield className="w-4 h-4 text-slate-500" />
                    <span className="text-sm text-slate-600">保费</span>
                  </div>
                  <p className="text-2xl font-bold text-slate-700">
                    ¥{calculationResult.premium.toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">预计保费支出</p>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400">
                <div className="text-center">
                  <Calculator className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>选择方案并输入参数后计算</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contract Preview & Reservation */}
      <div className="grid grid-cols-2 gap-6">
        {/* Contract Preview */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center space-x-2 mb-6">
            <FileText className="w-5 h-5 text-emerald-600" />
            <h3 className="font-semibold text-slate-800">协议预览</h3>
          </div>

          <div className="space-y-3">
            {contracts.map((contract) => (
              <div
                key={contract.type}
                className="p-4 border border-slate-200 rounded-lg hover:border-emerald-500 transition-colors cursor-pointer"
                onClick={() => {
                  setContractType(contract.type)
                  setShowContract(true)
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-slate-800">{contract.title}</h4>
                    <p className="text-sm text-slate-500 mt-1">{contract.description}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reservation Form */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <h3 className="font-semibold text-slate-800 mb-6">服务预约</h3>

          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  联系人
                </label>
                <input
                  type="text"
                  placeholder="请输入姓名"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  联系电话
                </label>
                <input
                  type="tel"
                  placeholder="请输入电话"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                果园地址
              </label>
              <input
                type="text"
                placeholder="请输入果园地址"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                种植品种
              </label>
              <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
                <option>妃子笑</option>
                <option>白糖罂</option>
                <option>桂味</option>
                <option>糯米糍</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                种植面积（亩）
              </label>
              <input
                type="number"
                placeholder="请输入种植面积"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-lg font-medium hover:shadow-lg transition-shadow"
            >
              提交预约申请
            </button>
          </form>
        </div>
      </div>

      {/* Contract Modal */}
      {showContract && contractType && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-800">
                {contracts.find(c => c.type === contractType)?.title}
              </h3>
              <button
                onClick={() => setShowContract(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {contracts.find(c => c.type === contractType)?.content.map((item, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <span className="w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-sm flex-shrink-0">
                    {index + 1}
                  </span>
                  <p className="text-slate-700">{item}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-slate-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowContract(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                关闭
              </button>
              <button className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600">
                确认签署
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contact Info */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">需要更多帮助？</h3>
            <p className="text-slate-300 mt-1">我们的专业团队随时为您提供咨询</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Phone className="w-5 h-5 text-emerald-400" />
              <span>400-888-8888</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-5 h-5 text-emerald-400" />
              <span>service@zhililian.com</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
