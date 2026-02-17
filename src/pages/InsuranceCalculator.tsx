import { useState, useEffect, useMemo } from 'react'
import {
  Cloud,
  CloudRain,
  Wind,
  Thermometer,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  DollarSign,
  MapPin,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  RefreshCw,
  Shield,
  Leaf,
  Camera,
  Users,
  BarChart3,
  CloudLightning,
  Droplets,
  Sun,
  Calculator
} from 'lucide-react'

// ==================== 气象数据类型定义 ====================
interface WeatherData {
  stationId: string
  stationName: string
  temperature: number // 温度
  humidity: number // 湿度
  windSpeed: number // 风速 (m/s)
  precipitation: number // 降水量 (mm)
  pressure: number // 气压
  timestamp: string
}

interface DisasterEvent {
  id: string
  type: 'typhoon' | 'rainstorm' | 'drought' | 'frost' | 'heat'
  severity: 'low' | 'medium' | 'high' | 'extreme'
  affectedArea: string
  startTime: string
  endTime?: string
  windSpeed?: number
  precipitation?: number
  description: string
}

// ==================== 价格数据类型定义 ====================
interface PriceData {
  date: string
  variety: string
  marketPrice: number // 市场批发价
  predictedPrice: number // AI预测保护价
  triggerPrice: number // 触发价格
  region: string
}

// ==================== 农户行为数据类型定义 ====================
interface FarmerBehavior {
  farmerId: string
  preventionMeasures: {
    hasWindproofNet: boolean // 防风网
    hasSprayPrevention: boolean // 喷洒防落素
    hasDrainage: boolean // 排水措施
    hasGroupInsurance: boolean // 参保互助组
  }
  uploadRecords: {
    date: string
    type: 'photo' | 'video'
    description: string
    verified: boolean
  }[]
  score: number // 行为评分 0-100
}

// ==================== 区域数据类型定义 ====================
interface RegionData {
  id: string
  name: string
  type: 'typhoon_corridor' | 'flood_risk' | 'drought_prone' | 'shelter_benefit'
  riskLevel: number // 0.8 - 1.3
  historicalDisasterCount: number
  soilDrainage: 'good' | 'moderate' | 'poor'
  trafficAccessibility: number // 0-1
}

// ==================== 赔付计算结果 ====================
interface PayoutResult {
  disasterIndex: number // 灾害指数 0-1
  priceIndex: number // 价格指数 0-1
  behaviorIndex: number // 行为指数 0-1
  regionIndex: number // 区域指数 0-1
  totalPayoutIndex: number // 总赔付指数
  payoutAmount: number // 赔付金额
  prePayoutAmount: number // 预赔付金额
  governmentSubsidy: number // 政府补贴
  maxPayout: number // 最高赔付
  recommendation: string
}

// ==================== 模拟数据 - 中国气象局数据 ====================
const mockWeatherStations: WeatherData[] = [
  { stationId: '59292', stationName: '茂名', temperature: 28, humidity: 75, windSpeed: 12, precipitation: 45, pressure: 1005, timestamp: '2026-02-17T10:00:00Z' },
  { stationId: '59287', stationName: '阳江', temperature: 27, humidity: 80, windSpeed: 15, precipitation: 65, pressure: 1002, timestamp: '2026-02-17T10:00:00Z' },
  { stationId: '59663', stationName: '海口', temperature: 29, humidity: 70, windSpeed: 8, precipitation: 20, pressure: 1008, timestamp: '2026-02-17T10:00:00Z' },
  { stationId: '59278', stationName: '湛江', temperature: 26, humidity: 85, windSpeed: 18, precipitation: 80, pressure: 998, timestamp: '2026-02-17T10:00:00Z' },
  { stationId: '59134', stationName: '惠州', temperature: 25, humidity: 78, windSpeed: 6, precipitation: 15, pressure: 1012, timestamp: '2026-02-17T10:00:00Z' },
  { stationId: '59356', stationName: '漳州', temperature: 24, humidity: 72, windSpeed: 5, precipitation: 10, pressure: 1015, timestamp: '2026-02-17T10:00:00Z' },
]

const mockDisasterEvents: DisasterEvent[] = [
  { id: 'D001', type: 'typhoon', severity: 'high', affectedArea: '湛江、阳江', startTime: '2026-02-15T08:00:00Z', windSpeed: 35, description: '2026年第3号台风"蝴蝶"登陆粤西地区' },
  { id: 'D002', type: 'rainstorm', severity: 'medium', affectedArea: '茂名', startTime: '2026-02-10T14:00:00Z', precipitation: 85, description: '持续性强降雨导致部分果园积水' },
]

const mockPriceData: PriceData[] = [
  { date: '2026-02-17', variety: '妃子笑', marketPrice: 12.5, predictedPrice: 18.0, triggerPrice: 16.1, region: '广东' },
  { date: '2026-02-16', variety: '妃子笑', marketPrice: 13.2, predictedPrice: 18.0, triggerPrice: 16.1, region: '广东' },
  { date: '2026-02-15', variety: '妃子笑', marketPrice: 14.8, predictedPrice: 18.0, triggerPrice: 16.1, region: '广东' },
  { date: '2026-02-14', variety: '妃子笑', marketPrice: 15.5, predictedPrice: 18.0, triggerPrice: 16.1, region: '广东' },
  { date: '2026-02-13', variety: '妃子笑', marketPrice: 16.2, predictedPrice: 18.0, triggerPrice: 16.1, region: '广东' },
]

const mockRegions: RegionData[] = [
  { id: 'R001', name: '湛江', type: 'typhoon_corridor', riskLevel: 1.25, historicalDisasterCount: 15, soilDrainage: 'moderate', trafficAccessibility: 0.9 },
  { id: 'R002', name: '阳江', type: 'typhoon_corridor', riskLevel: 1.2, historicalDisasterCount: 12, soilDrainage: 'good', trafficAccessibility: 0.85 },
  { id: 'R003', name: '茂名', type: 'typhoon_corridor', riskLevel: 1.1, historicalDisasterCount: 8, soilDrainage: 'good', trafficAccessibility: 0.9 },
  { id: 'R004', name: '惠州', type: 'flood_risk', riskLevel: 1.05, historicalDisasterCount: 5, soilDrainage: 'poor', trafficAccessibility: 0.95 },
  { id: 'R005', name: '云浮', type: 'shelter_benefit', riskLevel: 0.92, historicalDisasterCount: 2, soilDrainage: 'good', trafficAccessibility: 0.8 },
  { id: 'R006', name: '漳州', type: 'shelter_benefit', riskLevel: 0.88, historicalDisasterCount: 1, soilDrainage: 'good', trafficAccessibility: 0.9 },
]

// ==================== 计算引擎 ====================
const calculateDisasterIndex = (weather: WeatherData, disaster: DisasterEvent | null): number => {
  // 灾害强度因子 (35%权重)
  let wdf = 0

  // 风力计算 (权重 0.4)
  const windFactor = Math.min(weather.windSpeed / 35, 1) * 0.4

  // 降水计算 (权重 0.3)
  const precipFactor = Math.min(weather.precipitation / 100, 1) * 0.3

  // 灾害事件加成 (权重 0.3)
  const disasterFactor = disaster ? (disaster.severity === 'extreme' ? 0.3 : disaster.severity === 'high' ? 0.25 : disaster.severity === 'medium' ? 0.15 : 0.05) : 0

  wdf = windFactor + precipFactor + disasterFactor

  // 转换为灾损指数
  if (wdf <= 0.4) return 0
  if (wdf <= 0.6) return 0.3
  if (wdf <= 0.8) return 0.7
  return 0.95
}

const calculatePriceIndex = (priceData: PriceData): number => {
  // 价格风险因子 (40%权重)
  const priceDropRate = (priceData.triggerPrice - priceData.marketPrice) / priceData.triggerPrice

  if (priceDropRate <= 0.1) return 0
  if (priceDropRate <= 0.25) return 0.6
  if (priceDropRate <= 0.4) return 0.8
  return 0.95
}

const calculateBehaviorIndex = (behavior: FarmerBehavior): number => {
  // 农户行为因子 (15%权重)
  let score = 0

  // 基础防护
  if (behavior.preventionMeasures.hasSprayPrevention) score += 25
  else score -= 10

  // 主动防风
  if (behavior.preventionMeasures.hasWindproofNet) score += 35
  else score -= 5

  // 互助组
  if (behavior.preventionMeasures.hasGroupInsurance) score += 20

  // 排水措施
  if (behavior.preventionMeasures.hasDrainage) score += 20

  // 归一化到 0-1
  return Math.max(0, Math.min(1, score / 100))
}

const calculateRegionIndex = (region: RegionData): number => {
  // 区域特性因子 (10%权重)
  // 基于风险等级计算，范围 0.8-1.3 -> 转换为 0-1
  return (region.riskLevel - 0.8) / 0.5
}

const calculatePayout = (
  weather: WeatherData,
  disaster: DisasterEvent | null,
  price: PriceData,
  behavior: FarmerBehavior,
  region: RegionData,
  orchardArea: number,
  yieldPerMu: number,
  basePrice: number
): PayoutResult => {
  // 计算各因子指数
  const disasterIndex = calculateDisasterIndex(weather, disaster)
  const priceIndex = calculatePriceIndex(price)
  const behaviorIndex = calculateBehaviorIndex(behavior)
  const regionIndex = calculateRegionIndex(region)

  // 加权计算总赔付指数
  const totalPayoutIndex =
    disasterIndex * 0.35 +
    priceIndex * 0.40 +
    behaviorIndex * 0.15 +
    regionIndex * 0.10

  // 计算预期产量
  const expectedYield = orchardArea * yieldPerMu

  // 计算赔付金额
  const basePayout = expectedYield * basePrice
  const maxPayout = basePayout * 0.95
  const payoutAmount = basePayout * totalPayoutIndex

  // 预赔付 (50%)
  const prePayoutAmount = payoutAmount * 0.5

  // 政府补贴
  const priceDropRate = (price.triggerPrice - price.marketPrice) / price.triggerPrice
  let governmentSubsidy = 0
  if (priceDropRate > 0.25) governmentSubsidy = payoutAmount * 0.5
  else if (priceDropRate > 0.1) governmentSubsidy = payoutAmount * 0.3

  // 建议
  let recommendation = ''
  if (disasterIndex > 0.7) {
    recommendation = '建议立即启动预赔付通道'
  } else if (priceIndex > 0.6) {
    recommendation = '价格下跌显著，建议激活价格保障'
  } else if (behaviorIndex < 0.5) {
    recommendation = '建议加强防灾措施以提升赔付比例'
  } else {
    recommendation = '继续监控，各项指标正常'
  }

  return {
    disasterIndex,
    priceIndex,
    behaviorIndex,
    regionIndex,
    totalPayoutIndex,
    payoutAmount,
    prePayoutAmount,
    governmentSubsidy,
    maxPayout,
    recommendation
  }
}

// ==================== 主组件 ====================
export default function InsuranceCalculator() {
  const [selectedRegion, setSelectedRegion] = useState<RegionData>(mockRegions[0])
  const [selectedWeather, setSelectedWeather] = useState<WeatherData>(mockWeatherStations[0])
  const [selectedPrice, setSelectedPrice] = useState<PriceData>(mockPriceData[0])
  const [orchardArea, setOrchardArea] = useState(10)
  const [yieldPerMu, setYieldPerMu] = useState(1200)
  const [basePrice, setBasePrice] = useState(18)
  const [showPayoutOption, setShowPayoutOption] = useState(false)
  const [selectedOption, setSelectedOption] = useState<'cash' | 'swap' | null>(null)
  const [activeTab, setActiveTab] = useState<'calculator' | 'weather' | 'map'>('calculator')

  // 模拟农户行为数据
  const farmerBehavior: FarmerBehavior = {
    farmerId: 'F001',
    preventionMeasures: {
      hasWindproofNet: true,
      hasSprayPrevention: true,
      hasDrainage: true,
      hasGroupInsurance: true
    },
    uploadRecords: [
      { date: '2026-02-10', type: 'photo', description: '防风网加固完成', verified: true },
      { date: '2026-02-05', type: 'photo', description: '喷洒防落素', verified: true },
    ],
    score: 85
  }

  // 查找当前区域的灾害事件
  const currentDisaster = mockDisasterEvents.find(d =>
    d.affectedArea.includes(selectedRegion.name)
  ) || null

  // 计算赔付
  const payoutResult = useMemo(() => {
    return calculatePayout(
      selectedWeather,
      currentDisaster,
      selectedPrice,
      farmerBehavior,
      selectedRegion,
      orchardArea,
      yieldPerMu,
      basePrice
    )
  }, [selectedRegion, selectedWeather, selectedPrice, orchardArea, yieldPerMu, basePrice, currentDisaster])

  // 获取风险等级颜色
  const getRiskColor = (level: number) => {
    if (level >= 1.2) return 'text-red-600 bg-red-100'
    if (level >= 1.0) return 'text-amber-600 bg-amber-100'
    return 'text-emerald-600 bg-emerald-100'
  }

  // 获取灾害等级颜色
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'extreme': return 'text-red-600 bg-red-100'
      case 'high': return 'text-orange-600 bg-orange-100'
      case 'medium': return 'text-amber-600 bg-amber-100'
      default: return 'text-blue-600 bg-blue-100'
    }
  }

  return (
    <div className="space-y-6">
      {/* 页面头部 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">荔枝卫士 - 智能保险赔付系统</h1>
          <p className="text-slate-500 mt-1">基于四大核心因子的动态风险评估与赔付计算</p>
        </div>
        <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-lg">
          <CloudLightning className="w-5 h-5" />
          <span className="font-medium">实时气象数据已同步</span>
        </div>
      </div>

      {/* 选项卡 */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100">
        <div className="flex border-b border-slate-200">
          {[
            { id: 'calculator', label: '赔付计算器', icon: Calculator },
            { id: 'weather', label: '气象监控', icon: Cloud },
            { id: 'map', label: '风险地图', icon: MapPin }
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
          {activeTab === 'calculator' && (
            <div className="space-y-6">
              {/* 输入参数 */}
              <div className="grid grid-cols-4 gap-6">
                {/* 区域选择 */}
                <div className="bg-slate-50 rounded-xl p-4">
                  <label className="block text-sm font-medium700 mb-2 text-slate-">
                    投保区域
                  </label>
                  <select
                    value={selectedRegion.id}
                    onChange={(e) => {
                      const region = mockRegions.find(r => r.id === e.target.value)
                      if (region) {
                        setSelectedRegion(region)
                        const weather = mockWeatherStations.find(w => w.stationName === region.name)
                        if (weather) setSelectedWeather(weather)
                      }
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                  >
                    {mockRegions.map(region => (
                      <option key={region.id} value={region.id}>
                        {region.name}
                      </option>
                    ))}
                  </select>
                  <div className="mt-2 flex items-center justify-between text-xs">
                    <span className="text-slate-500">风险等级</span>
                    <span className={`px-2 py-0.5 rounded ${getRiskColor(selectedRegion.riskLevel)}`}>
                      {selectedRegion.riskLevel}
                    </span>
                  </div>
                </div>

                {/* 果园面积 */}
                <div className="bg-slate-50 rounded-xl p-4">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    果园面积 (亩)
                  </label>
                  <input
                    type="number"
                    value={orchardArea}
                    onChange={(e) => setOrchardArea(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* 预估产量 */}
                <div className="bg-slate-50 rounded-xl p-4">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    预估亩产 (斤)
                  </label>
                  <input
                    type="number"
                    value={yieldPerMu}
                    onChange={(e) => setYieldPerMu(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* 基础价格 */}
                <div className="bg-slate-50 rounded-xl p-4">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    基础价格 (元/斤)
                  </label>
                  <input
                    type="number"
                    value={basePrice}
                    onChange={(e) => setBasePrice(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* 四大因子可视化 */}
              <div className="grid grid-cols-4 gap-4">
                {/* 灾害因子 */}
                <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-4 border border-red-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Wind className="w-5 h-5 text-red-500" />
                      <span className="font-medium text-slate-700">灾害强度</span>
                    </div>
                    <span className="text-xs text-slate-500">权重35%</span>
                  </div>
                  <div className="text-2xl font-bold text-red-600">
                    {(payoutResult.disasterIndex * 100).toFixed(0)}%
                  </div>
                  <div className="mt-2 w-full bg-red-200 rounded-full h-2">
                    <div
                      className="bg-red-500 h-2 rounded-full transition-all"
                      style={{ width: `${payoutResult.disasterIndex * 100}%` }}
                    ></div>
                  </div>
                  <div className="mt-3 text-xs text-slate-600">
                    <div>风速: {selectedWeather.windSpeed}m/s</div>
                    <div>降水: {selectedWeather.precipitation}mm</div>
                    {currentDisaster && (
                      <div className="mt-1 flex items-center space-x-1">
                        <AlertTriangle className="w-3 h-3 text-red-500" />
                        <span className="text-red-600">{currentDisaster.description}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 价格因子 */}
                <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-4 border border-amber-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <TrendingDown className="w-5 h-5 text-amber-500" />
                      <span className="font-medium text-slate-700">价格风险</span>
                    </div>
                    <span className="text-xs text-slate-500">权重40%</span>
                  </div>
                  <div className="text-2xl font-bold text-amber-600">
                    {(payoutResult.priceIndex * 100).toFixed(0)}%
                  </div>
                  <div className="mt-2 w-full bg-amber-200 rounded-full h-2">
                    <div
                      className="bg-amber-500 h-2 rounded-full transition-all"
                      style={{ width: `${payoutResult.priceIndex * 100}%` }}
                    ></div>
                  </div>
                  <div className="mt-3 text-xs text-slate-600">
                    <div>市场价: ¥{selectedPrice.marketPrice}/斤</div>
                    <div>触发价: ¥{selectedPrice.triggerPrice}/斤</div>
                    <div className="text-red-500 mt-1">
                      跌幅: {((selectedPrice.triggerPrice - selectedPrice.marketPrice) / selectedPrice.triggerPrice * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>

                {/* 行为因子 */}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Users className="w-5 h-5 text-blue-500" />
                      <span className="font-medium text-slate-700">农户行为</span>
                    </div>
                    <span className="text-xs text-slate-500">权重15%</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    {(payoutResult.behaviorIndex * 100).toFixed(0)}%
                  </div>
                  <div className="mt-2 w-full bg-blue-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all"
                      style={{ width: `${payoutResult.behaviorIndex * 100}%` }}
                    ></div>
                  </div>
                  <div className="mt-3 text-xs text-slate-600 space-y-1">
                    <div className="flex items-center space-x-1">
                      {farmerBehavior.preventionMeasures.hasWindproofNet ? (
                        <CheckCircle className="w-3 h-3 text-emerald-500" />
                      ) : (
                        <AlertTriangle className="w-3 h-3 text-amber-500" />
                      )}
                      <span>防风网</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {farmerBehavior.preventionMeasures.hasSprayPrevention ? (
                        <CheckCircle className="w-3 h-3 text-emerald-500" />
                      ) : (
                        <AlertTriangle className="w-3 h-3 text-amber-500" />
                      )}
                      <span>防落素</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {farmerBehavior.preventionMeasures.hasGroupInsurance ? (
                        <CheckCircle className="w-3 h-3 text-emerald-500" />
                      ) : (
                        <AlertTriangle className="w-3 h-3 text-amber-500" />
                      )}
                      <span>互助组</span>
                    </div>
                  </div>
                </div>

                {/* 区域因子 */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-5 h-5 text-purple-500" />
                      <span className="font-medium text-slate-700">区域特性</span>
                    </div>
                    <span className="text-xs text-slate-500">权重10%</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-600">
                    {(payoutResult.regionIndex * 100).toFixed(0)}%
                  </div>
                  <div className="mt-2 w-full bg-purple-200 rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full transition-all"
                      style={{ width: `${payoutResult.regionIndex * 100}%` }}
                    ></div>
                  </div>
                  <div className="mt-3 text-xs text-slate-600">
                    <div>区域: {selectedRegion.name}</div>
                    <div>类型: {
                      selectedRegion.type === 'typhoon_corridor' ? '台风走廊' :
                      selectedRegion.type === 'flood_risk' ? '洪涝风险' :
                      selectedRegion.type === 'shelter_benefit' ? '避风优势区' : '干旱易发区'
                    }</div>
                    <div>历史灾害: {selectedRegion.historicalDisasterCount}次</div>
                  </div>
                </div>
              </div>

              {/* 赔付结果显示 */}
              <div className="bg-gradient-to-br from-emerald-50 to-cyan-50 rounded-xl p-6 border border-emerald-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-slate-800">赔付评估结果</h3>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    payoutResult.totalPayoutIndex > 0.5 ? 'bg-red-100 text-red-700' :
                    payoutResult.totalPayoutIndex > 0.2 ? 'bg-amber-100 text-amber-700' :
                    'bg-emerald-100 text-emerald-700'
                  }`}>
                    总赔付指数: {(payoutResult.totalPayoutIndex * 100).toFixed(1)}%
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-emerald-600">
                      ¥{payoutResult.payoutAmount.toLocaleString()}
                    </div>
                    <div className="text-sm text-slate-500 mt-1">预估赔付金额</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      ¥{payoutResult.prePayoutAmount.toLocaleString()}
                    </div>
                    <div className="text-sm text-slate-500 mt-1">预赔付金额 (50%)</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-amber-600">
                      ¥{payoutResult.governmentSubsidy.toLocaleString()}
                    </div>
                    <div className="text-sm text-slate-500 mt-1">政府补贴</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-slate-600">
                      ¥{payoutResult.maxPayout.toLocaleString()}
                    </div>
                    <div className="text-sm text-slate-500 mt-1">最高赔付</div>
                  </div>
                </div>

                {/* 建议 */}
                <div className="mt-6 p-4 bg-white rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-emerald-600" />
                    <span className="font-medium text-emerald-800">系统建议</span>
                  </div>
                  <p className="text-sm text-emerald-700 mt-2">{payoutResult.recommendation}</p>
                </div>

                {/* 预赔付通道按钮 */}
                {payoutResult.disasterIndex > 0.3 && (
                  <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <AlertTriangle className="w-6 h-6 text-red-600" />
                        <div>
                          <p className="font-medium text-red-800">预赔付通道已激活</p>
                          <p className="text-sm text-red-600">灾害等级达到触发条件，可快速获得50%预赔付</p>
                        </div>
                      </div>
                      <button className="px-6 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600">
                        申请预赔付
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* 收益置换选项 */}
              <div className="bg-white rounded-xl p-6 border border-slate-200">
                <h3 className="font-semibold text-slate-800 mb-4">收益置换选择权</h3>
                <p className="text-sm text-slate-500 mb-4">
                  当市场价格低于触发价格时，您可以选择现金赔付或收益置换
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      selectedOption === 'cash' ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-emerald-300'
                    }`}
                    onClick={() => setSelectedOption('cash')}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <DollarSign className="w-6 h-6 text-emerald-600" />
                      <span className="font-medium text-slate-800">现金赔付</span>
                    </div>
                    <p className="text-sm text-slate-600">直接获得现金赔付</p>
                  </div>
                  <div
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      selectedOption === 'swap' ? 'border-cyan-500 bg-cyan-50' : 'border-slate-200 hover:border-cyan-300'
                    }`}
                    onClick={() => setSelectedOption('swap')}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <RefreshCw className="w-6 h-6 text-cyan-600" />
                      <span className="font-medium text-slate-800">收益置换</span>
                    </div>
                    <p className="text-sm text-slate-600">120%价值抵扣券 + 农资大礼包</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'weather' && (
            <div className="space-y-6">
              {/* 气象站数据 */}
              <div>
                <h3 className="font-semibold text-slate-800 mb-4">实时气象数据 (中国气象局)</h3>
                <div className="grid grid-cols-3 gap-4">
                  {mockWeatherStations.map((station) => (
                    <div
                      key={station.stationId}
                      className={`p-4 border rounded-xl cursor-pointer transition-all ${
                        selectedWeather.stationId === station.stationId
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-slate-200 hover:border-emerald-300'
                      }`}
                      onClick={() => setSelectedWeather(station)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-medium text-slate-800">{station.stationName}</span>
                        <Cloud className="w-5 h-5 text-slate-400" />
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center space-x-1">
                          <Thermometer className="w-4 h-4 text-red-500" />
                          <span>{station.temperature}°C</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Wind className="w-4 h-4 text-blue-500" />
                          <span>{station.windSpeed}m/s</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <CloudRain className="w-4 h-4 text-cyan-500" />
                          <span>{station.precipitation}mm</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Droplets className="w-4 h-4 text-purple-500" />
                          <span>{station.humidity}%</span>
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-slate-400">
                        更新时间: {new Date(station.timestamp).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 灾害事件 */}
              <div>
                <h3 className="font-semibold text-slate-800 mb-4">当前灾害预警</h3>
                <div className="space-y-3">
                  {mockDisasterEvents.map((event) => (
                    <div key={event.id} className="p-4 border border-slate-200 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <AlertTriangle className="w-5 h-5 text-red-500" />
                          <div>
                            <p className="font-medium text-slate-800">{event.type === 'typhoon' ? '台风' : event.type === 'rainstorm' ? '暴雨' : '其他'}</p>
                            <p className="text-sm text-slate-500">{event.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`px-2 py-1 text-xs rounded-full ${getSeverityColor(event.severity)}`}>
                            {event.severity === 'extreme' ? '极严重' :
                             event.severity === 'high' ? '严重' :
                             event.severity === 'medium' ? '中等' : '轻微'}
                          </span>
                          <span className="text-sm text-slate-500">{event.affectedArea}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 价格走势 */}
              <div>
                <h3 className="font-semibold text-slate-800 mb-4">市场价格走势</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">日期</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">品种</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">市场批发价</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">AI预测保护价</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">触发价格</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">状态</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockPriceData.map((price, index) => (
                        <tr key={index} className="border-b border-slate-100">
                          <td className="py-3 px-4 text-sm text-slate-600">{price.date}</td>
                          <td className="py-3 px-4 text-sm text-slate-800">{price.variety}</td>
                          <td className="py-3 px-4 text-sm font-medium text-slate-800">¥{price.marketPrice}</td>
                          <td className="py-3 px-4 text-sm text-emerald-600">¥{price.predictedPrice}</td>
                          <td className="py-3 px-4 text-sm text-amber-600">¥{price.triggerPrice}</td>
                          <td className="py-3 px-4">
                            {price.marketPrice < price.triggerPrice ? (
                              <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full">触发赔付</span>
                            ) : (
                              <span className="px-2 py-1 text-xs bg-emerald-100 text-emerald-700 rounded-full">正常</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'map' && (
            <div className="space-y-6">
              <h3 className="font-semibold text-slate-800 mb-4">区域风险地图</h3>
              <div className="grid grid-cols-3 gap-4">
                {mockRegions.map((region) => (
                  <div
                    key={region.id}
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      selectedRegion.id === region.id
                        ? 'border-emerald-500 shadow-lg'
                        : 'border-slate-200 hover:border-emerald-300'
                    }`}
                    onClick={() => {
                      setSelectedRegion(region)
                      const weather = mockWeatherStations.find(w => w.stationName === region.name)
                      if (weather) setSelectedWeather(weather)
                    }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-bold text-slate-800">{region.name}</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${getRiskColor(region.riskLevel)}`}>
                        风险系数: {region.riskLevel}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-500">区域类型</span>
                        <span className="text-slate-700">
                          {region.type === 'typhoon_corridor' ? '台风走廊' :
                           region.type === 'flood_risk' ? '洪涝风险' :
                           region.type === 'shelter_benefit' ? '避风优势区' : '干旱易发'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">历史灾害</span>
                        <span className="text-slate-700">{region.historicalDisasterCount}次</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">土壤排水</span>
                        <span className="text-slate-700">
                          {region.soilDrainage === 'good' ? '良好' :
                           region.soilDrainage === 'moderate' ? '一般' : '较差'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">交通可达性</span>
                        <span className="text-slate-700">{(region.trafficAccessibility * 100).toFixed(0)}%</span>
                      </div>
                    </div>

                    {/* 风险进度条 */}
                    <div className="mt-3 pt-3 border-t border-slate-100">
                      <div className="text-xs text-slate-500 mb-1">风险等级</div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            region.riskLevel >= 1.2 ? 'bg-red-500' :
                            region.riskLevel >= 1.0 ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${(region.riskLevel / 1.5) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 图例说明 */}
              <div className="p-4 bg-slate-50 rounded-xl">
                <h4 className="font-medium text-slate-700 mb-3">风险等级说明</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                    <span className="text-slate-600">高风险区 (系数 ≥ 1.2)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-amber-500 rounded"></div>
                    <span className="text-slate-600">中风险区 (系数 1.0-1.2)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-emerald-500 rounded"></div>
                    <span className="text-slate-600">低风险区 (系数 {'<'} 1.0)</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 权重说明 */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
        <h3 className="font-semibold text-slate-800 mb-4">四大核心因子权重设计说明</h3>
        <div className="grid grid-cols-4 gap-4">
          <div className="p-4 bg-red-50 rounded-lg">
            <div className="font-medium text-red-800">灾害强度 (35%)</div>
            <p className="text-xs text-red-600 mt-2">
              聚焦灾害直接冲击，采用多源数据（卫星+无人机）校准。包含风力、降水量、灾害事件等因素。
            </p>
          </div>
          <div className="p-4 bg-amber-50 rounded-lg">
            <div className="font-medium text-amber-800">价格风险 (40%)</div>
            <p className="text-xs text-amber-600 mt-2">
              占比最高，因价格波动是农户核心痛点。荔枝在丰收年跌幅可达50%，是果农破产主因。
            </p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="font-medium text-blue-800">农户行为 (15%)</div>
            <p className="text-xs text-blue-600 mt-2">
              行为经济学验证：正向激励可降低整体赔付率。防灾投入直接转化为赔付溢价（最高+15%）。
            </p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="font-medium text-purple-800">区域特性 (10%)</div>
            <p className="text-xs text-purple-600 mt-2">
              体现空间差异性，兼顾公平性。避免低风险区补贴高风险区，符合精算协会分区定价标准。
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
