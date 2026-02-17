import { useState, useRef, useEffect } from 'react'
import {
  Camera,
  Upload,
  Leaf,
  CheckCircle,
  AlertCircle,
  Loader2,
  Shield,
  FileText,
  Calendar,
  MapPin,
  RefreshCw,
  Wifi,
  Cpu,
  Activity,
  Thermometer,
  Droplets,
  Sun,
  Eye,
  Zap,
  Target,
  Bug,
  Apple,
  Gauge,
  Radio,
  Image,
  Layers,
  Settings,
  Play,
  Pause,
  Download,
  Maximize2,
  Grid3X3,
  EyeOff,
  Layers3,
  ScanLine,
  Timer,
  HardDrive,
  Signal,
  AlertTriangle,
  Check,
  X,
  ArrowRight,
  BarChart3
} from 'lucide-react'

// ==================== 多光谱采集设备配置 ====================
interface SensorConfig {
  id: string
  name: string
  type: 'RGB' | 'NIR' | 'Thermal' | 'Multispectral'
  status: 'active' | 'standby' | 'error'
  resolution: string
  spectralBand: string
  exposure: number // ms
  gain: number // dB
}

// ==================== 图像处理流水线 ====================
interface PipelineStep {
  id: string
  name: string
  description: string
  status: 'pending' | 'processing' | 'completed' | 'error'
  inputImage?: string
  outputImage?: string
  processingTime?: number // ms
}

// ==================== 果实检测结果 ====================
interface FruitDetection {
  id: number
  class: 'fruit_ripe' | 'fruit_unripe' | 'fruit_mature' | 'leaf' | 'branch'
  confidence: number
  bbox: [number, number, number, number] // x, y, w, h
  maturity?: number // 0-1
  defect?: string
}

// ==================== 病虫害分析 ====================
interface PestAnalysis {
  id: string
  type: 'disease' | 'pest' | 'stress'
  name: string
  severity: 'low' | 'medium' | 'high'
  location: [number, number]
  area: number // cm²
  confidence: number
  timestamp: string
}

// ==================== 边缘计算状态 ====================
interface EdgeStatus {
  device: string
  modelVersion: string
  fps: number
  latency: number // ms
  gpuLoad: number // %
  cpuTemp: number // °C
  ramUsage: number // %
  networkStatus: 'online' | 'offline' | 'syncing'
  lastSync: string
}

// ==================== 模拟数据 ====================
const mockSensors: SensorConfig[] = [
  { id: 's1', name: '可见光相机', type: 'RGB', status: 'active', resolution: '4K (3840×2160)', spectralBand: '400-700nm', exposure: 12, gain: 6 },
  { id: 's2', name: '近红外相机', type: 'NIR', status: 'active', resolution: '4K (3840×2160)', spectralBand: '850-950nm', exposure: 15, gain: 8 },
  { id: 's3', name: '热成像仪', type: 'Thermal', status: 'active', resolution: '640×512', spectralBand: '8-14μm', exposure: 30, gain: 12 },
  { id: 's4', name: '多光谱相机', type: 'Multispectral', status: 'standby', resolution: '2K (2048×2048)', spectralBand: '450-900nm', exposure: 20, gain: 10 }
]

const mockPipelineSteps: PipelineStep[] = [
  { id: 'p1', name: '原始图像采集', description: '多光谱相机原始数据获取', status: 'completed', processingTime: 45 },
  { id: 'p2', name: '光照补偿', description: 'CLAHE自适应直方图均衡', status: 'completed', processingTime: 23 },
  { id: 'p3', name: '去雾增强', description: '暗通道先验去雾算法', status: 'completed', processingTime: 18 },
  { id: 'p4', name: '几何校正', description: '透视变换与IMU姿态补偿', status: 'completed', processingTime: 12 },
  { id: 'p5', name: '果实检测', description: 'YOLO-OrchS模型推理', status: 'completed', processingTime: 42 },
  { id: 'p6', name: '成熟度分析', description: 'LAB色彩空间与NIR反射分析', status: 'completed', processingTime: 35 }
]

const mockDetections: FruitDetection[] = [
  { id: 1, class: 'fruit_ripe', confidence: 0.96, bbox: [120, 80, 85, 90], maturity: 0.92 },
  { id: 2, class: 'fruit_ripe', confidence: 0.94, bbox: [280, 150, 78, 82], maturity: 0.88 },
  { id: 3, class: 'fruit_unripe', confidence: 0.91, bbox: [450, 200, 72, 75], maturity: 0.45 },
  { id: 4, class: 'fruit_mature', confidence: 0.89, bbox: [180, 320, 68, 70], maturity: 0.78 },
  { id: 5, class: 'fruit_ripe', confidence: 0.95, bbox: [520, 280, 80, 85], maturity: 0.95, defect: '轻微日灼' },
  { id: 6, class: 'fruit_unripe', confidence: 0.88, bbox: [350, 400, 65, 68], maturity: 0.38 },
]

const mockPestAnalysis: PestAnalysis[] = [
  { id: 'p1', type: 'disease', name: '炭疽病早期', severity: 'medium', location: [200, 150], area: 2.3, confidence: 0.87, timestamp: '2026-02-17 10:23:15' },
  { id: 'p2', type: 'stress', name: '水分胁迫', severity: 'low', location: [420, 280], area: 5.8, confidence: 0.82, timestamp: '2026-02-17 10:23:15' },
  { id: 'p3', type: 'pest', name: '荔枝蝽若虫', severity: 'high', location: [350, 180], area: 0.8, confidence: 0.94, timestamp: '2026-02-17 10:22:45' },
]

const mockEdgeStatus: EdgeStatus = {
  device: 'NVIDIA Jetson Nano',
  modelVersion: 'YOLO-OrchS v2.1',
  fps: 56,
  latency: 18,
  gpuLoad: 72,
  cpuTemp: 58,
  ramUsage: 4.2,
  networkStatus: 'online',
  lastSync: '2026-02-17 10:24:00'
}

// ==================== 主组件 ====================
export default function AssessmentCenter() {
  const [activeView, setActiveView] = useState<'acquisition' | 'pipeline' | 'detection' | 'analysis'>('acquisition')
  const [selectedSensor, setSelectedSensor] = useState<string>('s1')
  const [showOverlay, setShowOverlay] = useState(true)
  const [showHeatmap, setShowHeatmap] = useState(false)
  const [isStreaming, setIsStreaming] = useState(true)
  const [selectedSpectralBand, setSelectedSpectralBand] = useState<'RGB' | 'NIR' | 'Thermal' | 'NDVI'>('RGB')

  // 统计数据
  const totalFruits = mockDetections.length
  const ripeFruits = mockDetections.filter(d => d.class === 'fruit_ripe').length
  const avgMaturity = mockDetections.reduce((sum, d) => sum + (d.maturity || 0), 0) / totalFruits
  const highSeverityPests = mockPestAnalysis.filter(p => p.severity === 'high').length

  // 获取传感器状态颜色
  const getSensorStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-500'
      case 'standby': return 'bg-amber-500'
      case 'error': return 'bg-red-500'
      default: return 'bg-slate-500'
    }
  }

  // 获取检测框颜色
  const getDetectionColor = (fruitClass: string) => {
    switch (fruitClass) {
      case 'fruit_ripe': return 'border-red-500 bg-red-500/20'
      case 'fruit_mature': return 'border-amber-500 bg-amber-500/20'
      case 'fruit_unripe': return 'border-emerald-500 bg-emerald-500/20'
      case 'leaf': return 'border-green-500 bg-green-500/20'
      default: return 'border-slate-500 bg-slate-500/20'
    }
  }

  // 获取成熟度颜色
  const getMaturityColor = (maturity: number) => {
    if (maturity >= 0.8) return 'text-red-600'
    if (maturity >= 0.5) return 'text-amber-600'
    return 'text-emerald-600'
  }

  return (
    <div className="space-y-6">
      {/* 页面头部 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">AI 物候评估中心</h1>
          <p className="text-slate-500 mt-1">多光谱图像采集与智能分析系统</p>
        </div>
        <div className="flex items-center space-x-4">
          {/* 实时状态指示 */}
          <div className="flex items-center space-x-2 px-3 py-1.5 bg-emerald-50 rounded-lg">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-emerald-700 font-medium">实时监测中</span>
          </div>
          <div className="flex items-center space-x-2 px-3 py-1.5 bg-slate-100 rounded-lg">
            <Wifi className="w-4 h-4 text-emerald-500" />
            <span className="text-sm text-slate-600">已连接边缘设备</span>
          </div>
        </div>
      </div>

      {/* 功能选项卡 */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100">
        <div className="flex border-b border-slate-200">
          {[
            { id: 'acquisition', label: '多光谱采集', icon: Radio },
            { id: 'pipeline', label: '图像处理流水线', icon: Layers },
            { id: 'detection', label: '果实检测识别', icon: ScanLine },
            { id: 'analysis', label: '病虫害分析', icon: Bug }
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id as any)}
                className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
                  activeView === tab.id
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
          {/* 多光谱采集视图 */}
          {activeView === 'acquisition' && (
            <div className="grid grid-cols-3 gap-6">
              {/* 传感器配置面板 */}
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-800 flex items-center space-x-2">
                  <Settings className="w-4 h-4" />
                  <span>传感器配置</span>
                </h3>

                <div className="space-y-3">
                  {mockSensors.map((sensor) => (
                    <div
                      key={sensor.id}
                      className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        selectedSensor === sensor.id
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-slate-200 hover:border-emerald-300'
                      }`}
                      onClick={() => setSelectedSensor(sensor.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Camera className="w-5 h-5 text-slate-600" />
                          <span className="font-medium text-slate-800">{sensor.name}</span>
                        </div>
                        <div className={`w-2 h-2 rounded-full ${getSensorStatusColor(sensor.status)}`}></div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
                        <div>分辨率: {sensor.resolution}</div>
                        <div>光谱: {sensor.spectralBand}</div>
                        <div>曝光: {sensor.exposure}ms</div>
                        <div>增益: {sensor.gain}dB</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 采集标准说明 */}
                <div className="p-4 bg-blue-50 rounded-xl">
                  <h4 className="font-medium text-blue-800 mb-2 flex items-center space-x-2">
                    <Target className="w-4 h-4" />
                    <span>采集标准</span>
                  </h4>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>• 距离作物: 1.5m ± 0.3m</li>
                    <li>• 太阳高度角: {'>'}30°</li>
                    <li>• 风速: {'<'}3m/s</li>
                    <li>• 分辨率: ≥4K (3840×2160)</li>
                  </ul>
                </div>
              </div>

              {/* 光谱波段选择 */}
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-800 flex items-center space-x-2">
                  <Layers3 className="w-4 h-4" />
                  <span>光谱波段切换</span>
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'RGB', label: '可见光', color: 'from-red-500 via-green-500 to-blue-500', active: selectedSpectralBand === 'RGB' },
                    { id: 'NIR', label: '近红外', color: 'from-red-600 to-purple-800', active: selectedSpectralBand === 'NIR' },
                    { id: 'Thermal', label: '热成像', color: 'from-blue-300 via-yellow-500 to-red-600', active: selectedSpectralBand === 'Thermal' },
                    { id: 'NDVI', label: 'NDVI指数', color: 'from-blue-500 to-green-500', active: selectedSpectralBand === 'NDVI' }
                  ].map((band) => (
                    <button
                      key={band.id}
                      onClick={() => setSelectedSpectralBand(band.id as any)}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        band.active ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className={`h-8 rounded-lg bg-gradient-to-br ${band.color} mb-2`}></div>
                      <span className="text-sm font-medium text-slate-700">{band.label}</span>
                    </button>
                  ))}
                </div>

                {/* 光谱说明 */}
                <div className="p-4 bg-slate-50 rounded-xl">
                  <h4 className="font-medium text-slate-700 mb-2 text-sm">光谱分析原理</h4>
                  <div className="space-y-2 text-xs text-slate-600">
                    <div className="flex items-center justify-between">
                      <span>近红外 (850-950nm)</span>
                      <span className="text-emerald-600">检测内腐果 (92%准确率)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>热成像 (8-14μm)</span>
                      <span className="text-amber-600">发现虫蛀空洞热斑</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>NDVI</span>
                      <span className="text-blue-600">评估植株健康状态</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 实时预览 */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-800 flex items-center space-x-2">
                    <Eye className="w-4 h-4" />
                    <span>实时预览</span>
                  </h3>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setIsStreaming(!isStreaming)}
                      className={`p-2 rounded-lg ${isStreaming ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-600'}`}
                    >
                      {isStreaming ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => setShowOverlay(!showOverlay)}
                      className={`p-2 rounded-lg ${showOverlay ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'}`}
                    >
                      {showOverlay ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* 模拟图像显示区域 */}
                <div className="relative bg-slate-900 rounded-xl overflow-hidden" style={{ height: '320px' }}>
                  {/* 模拟果实图像 */}
                  <div className="absolute inset-0 bg-gradient-to-br from-green-800 to-green-900 flex items-center justify-center">
                    {/* 模拟荔枝树冠 */}
                    <div className="relative w-full h-full">
                      {/* 模拟果实 */}
                      {mockDetections.map((det) => (
                        <div
                          key={det.id}
                          className={`absolute rounded-full ${
                            selectedSpectralBand === 'Thermal'
                              ? (det.maturity && det.maturity > 0.8 ? 'bg-red-500/60' : 'bg-blue-400/40')
                              : det.class === 'fruit_ripe' ? 'bg-red-500/60'
                              : det.class === 'fruit_unripe' ? 'bg-green-500/60'
                              : 'bg-yellow-500/60'
                          }`}
                          style={{
                            left: `${det.bbox[0]}px`,
                            top: `${det.bbox[1]}px`,
                            width: `${det.bbox[2]}px`,
                            height: `${det.bbox[3]}px`
                          }}
                        ></div>
                      ))}
                    </div>
                  </div>

                  {/* 检测叠加层 */}
                  {showOverlay && isStreaming && (
                    <div className="absolute inset-0">
                      {mockDetections.map((det) => (
                        <div
                          key={det.id}
                          className={`absolute border-2 rounded-md ${getDetectionColor(det.class)}`}
                          style={{
                            left: `${det.bbox[0]}px`,
                            top: `${det.bbox[1]}px`,
                            width: `${det.bbox[2]}px`,
                            height: `${det.bbox[3]}px`
                          }}
                        >
                          <div className="absolute -top-6 left-0 bg-black/70 text-white text-xs px-1 rounded">
                            {det.class === 'fruit_ripe' ? '成熟果' : det.class === 'fruit_unripe' ? '青果' : '待采'} {(det.confidence * 100).toFixed(0)}%
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 控制栏 */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/80 px-4 py-2 flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-xs text-white">
                      <span className="flex items-center space-x-1">
                        <Activity className="w-3 h-3" />
                        <span>{mockEdgeStatus.fps} FPS</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Timer className="w-3 h-3" />
                        <span>{mockEdgeStatus.latency}ms</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Cpu className="w-3 h-3" />
                        <span>GPU {mockEdgeStatus.gpuLoad}%</span>
                      </span>
                    </div>
                    <span className="text-xs text-white/60">{mockSensors.find(s => s.id === selectedSensor)?.name}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 图像处理流水线视图 */}
          {activeView === 'pipeline' && (
            <div className="space-y-6">
              <div className="grid grid-cols-6 gap-4">
                {mockPipelineSteps.map((step, index) => (
                  <div key={step.id} className="text-center">
                    {/* 步骤卡片 */}
                    <div className={`p-4 rounded-xl border-2 ${
                      step.status === 'completed' ? 'border-emerald-500 bg-emerald-50' :
                      step.status === 'processing' ? 'border-blue-500 bg-blue-50' :
                      step.status === 'error' ? 'border-red-500 bg-red-50' :
                      'border-slate-200 bg-slate-50'
                    }`}>
                      <div className={`w-10 h-10 mx-auto mb-2 rounded-full flex items-center justify-center ${
                        step.status === 'completed' ? 'bg-emerald-500 text-white' :
                        step.status === 'processing' ? 'bg-blue-500 text-white animate-pulse' :
                        step.status === 'error' ? 'bg-red-500 text-white' :
                        'bg-slate-300 text-slate-500'
                      }`}>
                        {step.status === 'completed' ? <Check className="w-5 h-5" /> :
                         step.status === 'processing' ? <Loader2 className="w-5 h-5 animate-spin" /> :
                         step.status === 'error' ? <X className="w-5 h-5" /> :
                         index + 1}
                      </div>
                      <p className="text-sm font-medium text-slate-700">{step.name}</p>
                      {step.processingTime && (
                        <p className="text-xs text-slate-500 mt-1">{step.processingTime}ms</p>
                      )}
                    </div>
                    {/* 连接线 */}
                    {index < mockPipelineSteps.length - 1 && (
                      <div className="flex items-center justify-center mt-2">
                        <ArrowRight className="w-4 h-4 text-slate-300" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* 算法说明 */}
              <div className="grid grid-cols-3 gap-6 mt-8">
                {/* 光照补偿 */}
                <div className="p-4 bg-slate-50 rounded-xl">
                  <h4 className="font-medium text-slate-800 mb-3 flex items-center space-x-2">
                    <Sun className="w-4 h-4 text-amber-500" />
                    <span>光照补偿模型</span>
                  </h4>
                  <p className="text-sm text-slate-600 mb-3">解决阴天/背光问题</p>
                  <div className="space-y-2 text-xs text-slate-500">
                    <div className="flex items-center justify-between">
                      <span>转换LAB空间</span>
                      <CheckCircle className="w-3 h-3 text-emerald-500" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>CLAHE直方图均衡</span>
                      <CheckCircle className="w-3 h-3 text-emerald-500" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>自适应对比度增强</span>
                      <CheckCircle className="w-3 h-3 text-emerald-500" />
                    </div>
                  </div>
                </div>

                {/* 去雾增强 */}
                <div className="p-4 bg-slate-50 rounded-xl">
                  <h4 className="font-medium text-slate-800 mb-3 flex items-center space-x-2">
                    <Droplets className="w-4 h-4 text-blue-500" />
                    <span>去雾增强算法</span>
                  </h4>
                  <p className="text-sm text-slate-600 mb-3">应对雨季水雾干扰</p>
                  <div className="space-y-2 text-xs text-slate-500">
                    <div className="flex items-center justify-between">
                      <span>暗通道先验估计</span>
                      <CheckCircle className="w-3 h-3 text-emerald-500" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>大气光成分计算</span>
                      <CheckCircle className="w-3 h-3 text-emerald-500" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>透射率图像恢复</span>
                      <CheckCircle className="w-3 h-3 text-emerald-500" />
                    </div>
                  </div>
                </div>

                {/* 几何校正 */}
                <div className="p-4 bg-slate-50 rounded-xl">
                  <h4 className="font-medium text-slate-800 mb-3 flex items-center space-x-2">
                    <Grid3X3 className="w-4 h-4 text-purple-500" />
                    <span>几何校正算法</span>
                  </h4>
                  <p className="text-sm text-slate-600 mb-3">消除无人机倾斜影响</p>
                  <div className="space-y-2 text-xs text-slate-500">
                    <div className="flex items-center justify-between">
                      <span>IMU俯仰角检测</span>
                      <CheckCircle className="w-3 h-3 text-emerald-500" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>透视变换矩阵</span>
                      <CheckCircle className="w-3 h-3 text-emerald-500" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>网格对齐校正</span>
                      <CheckCircle className="w-3 h-3 text-emerald-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 果实检测识别视图 */}
          {activeView === 'detection' && (
            <div className="grid grid-cols-3 gap-6">
              {/* 检测统计 */}
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-800 flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4" />
                  <span>检测统计</span>
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 bg-gradient-to-br from-red-50 to-orange-50 rounded-xl text-center">
                    <p className="text-3xl font-bold text-red-600">{ripeFruits}</p>
                    <p className="text-sm text-slate-500">成熟果</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl text-center">
                    <p className="text-3xl font-bold text-emerald-600">{totalFruits - ripeFruits}</p>
                    <p className="text-sm text-slate-500">青果/待采</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl text-center col-span-2">
                    <p className="text-3xl font-bold text-amber-600">{(avgMaturity * 100).toFixed(0)}%</p>
                    <p className="text-sm text-slate-500">平均成熟度</p>
                  </div>
                </div>

                {/* 成熟度分布 */}
                <div className="p-4 bg-slate-50 rounded-xl">
                  <h4 className="font-medium text-slate-700 mb-3 text-sm">成熟度分布</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-emerald-600">青果 (0-50%)</span>
                      <span className="text-slate-600">{((totalFruits - ripeFruits) / totalFruits * 100).toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${((totalFruits - ripeFruits) / totalFruits * 100)}%` }}></div>
                    </div>
                    <div className="flex items-center justify-between text-xs mt-2">
                      <span className="text-amber-600">成熟 (50-80%)</span>
                      <span className="text-slate-600">15%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div className="bg-amber-500 h-2 rounded-full" style={{ width: '15%' }}></div>
                    </div>
                    <div className="flex items-center justify-between text-xs mt-2">
                      <span className="text-red-600">完熟 (80-100%)</span>
                      <span className="text-slate-600">{((ripeFruits) / totalFruits * 100).toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: `${((ripeFruits) / totalFruits * 100)}%` }}></div>
                    </div>
                  </div>
                </div>

                {/* 采收预测 */}
                <div className="p-4 bg-gradient-to-br from-emerald-50 to-cyan-50 rounded-xl">
                  <h4 className="font-medium text-emerald-800 mb-2">采收预测</h4>
                  <p className="text-2xl font-bold text-emerald-600">6-8天</p>
                  <p className="text-sm text-emerald-700">预计最佳采收期</p>
                </div>
              </div>

              {/* 检测详情列表 */}
              <div className="col-span-2 space-y-4">
                <h3 className="font-semibold text-slate-800 flex items-center space-x-2">
                  <Apple className="w-4 h-4" />
                  <span>检测果实详情</span>
                </h3>

                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {mockDetections.map((det) => (
                    <div key={det.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          det.class === 'fruit_ripe' ? 'bg-red-100 text-red-600' :
                          det.class === 'fruit_mature' ? 'bg-amber-100 text-amber-600' :
                          'bg-emerald-100 text-emerald-600'
                        }`}>
                          <Apple className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-800">
                            果实 #{det.id} - {
                              det.class === 'fruit_ripe' ? '成熟' :
                              det.class === 'fruit_mature' ? '待采' : '青果'
                            }
                          </p>
                          <p className="text-xs text-slate-500">置信度: {(det.confidence * 100).toFixed(1)}%</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-medium ${getMaturityColor(det.maturity || 0)}`}>
                          成熟度: {((d.maturity || 0) * 100).toFixed(0)}%
                        </p>
                        {det.defect && (
                          <p className="text-xs text-amber-600">{det.defect}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* 模型信息 */}
                <div className="p-4 bg-slate-900 rounded-xl text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">YOLO-OrchS 模型</h4>
                      <p className="text-sm text-white/60">农业专用果实检测模型</p>
                    </div>
                    <div className="text-right">
                      <p className="text-emerald-400">检测精度: 96.3%</p>
                      <p className="text-sm text-white/60">小目标召回率: 89%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 病虫害分析视图 */}
          {activeView === 'analysis' && (
            <div className="grid grid-cols-3 gap-6">
              {/* 病虫害列表 */}
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-800 flex items-center space-x-2">
                  <Bug className="w-4 h-4" />
                  <span>病虫害检测</span>
                </h3>

                <div className="space-y-3">
                  {mockPestAnalysis.map((pest) => (
                    <div key={pest.id} className={`p-4 rounded-xl border-2 ${
                      pest.severity === 'high' ? 'border-red-500 bg-red-50' :
                      pest.severity === 'medium' ? 'border-amber-500 bg-amber-50' :
                      'border-blue-500 bg-blue-50'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {pest.type === 'disease' ? <Bug className="w-4 h-4 text-red-500" /> :
                           pest.type === 'pest' ? <AlertCircle className="w-4 h-4 text-orange-500" /> :
                           <Thermometer className="w-4 h-4 text-blue-500" />}
                          <span className="font-medium text-slate-800">{pest.name}</span>
                        </div>
                        <span className={`px-2 py-0.5 text-xs rounded-full ${
                          pest.severity === 'high' ? 'bg-red-500 text-white' :
                          pest.severity === 'medium' ? 'bg-amber-500 text-white' :
                          'bg-blue-500 text-white'
                        }`}>
                          {pest.severity === 'high' ? '严重' : pest.severity === 'medium' ? '中等' : '轻微'}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                        <div>影响面积: {pest.area}cm²</div>
                        <div>置信度: {(pest.confidence * 100).toFixed(0)}%</div>
                        <div className="col-span-2">{pest.timestamp}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 风险等级 */}
                <div className={`p-4 rounded-xl ${highSeverityPests > 0 ? 'bg-red-50 border border-red-200' : 'bg-emerald-50 border border-emerald-200'}`}>
                  <div className="flex items-center space-x-2">
                    {highSeverityPests > 0 ? (
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                    )}
                    <span className={`font-medium ${highSeverityPests > 0 ? 'text-red-800' : 'text-emerald-800'}`}>
                      {highSeverityPests > 0 ? `发现 ${highSeverityPests} 处严重病虫害` : '病虫害风险较低'}
                    </span>
                  </div>
                </div>
              </div>

              {/* 边缘计算状态 */}
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-800 flex items-center space-x-2">
                  <HardDrive className="w-4 h-4" />
                  <span>边缘计算状态</span>
                </h3>

                <div className="p-4 bg-slate-900 rounded-xl text-white space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Cpu className="w-8 h-8 text-emerald-400" />
                      <div>
                        <p className="font-medium">{mockEdgeStatus.device}</p>
                        <p className="text-sm text-white/60">{mockEdgeStatus.modelVersion}</p>
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs ${
                      mockEdgeStatus.networkStatus === 'online' ? 'bg-emerald-500' : 'bg-red-500'
                    }`}>
                      {mockEdgeStatus.networkStatus === 'online' ? '在线' : '离线'}
                    </div>
                  </div>

                  {/* 性能指标 */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-white/10 rounded-lg">
                      <p className="text-xs text-white/60">推理延迟</p>
                      <p className="text-lg font-bold text-emerald-400">{mockEdgeStatus.latency}ms</p>
                    </div>
                    <div className="p-3 bg-white/10 rounded-lg">
                      <p className="text-xs text-white/60">帧率</p>
                      <p className="text-lg font-bold text-blue-400">{mockEdgeStatus.fps} FPS</p>
                    </div>
                    <div className="p-3 bg-white/10 rounded-lg">
                      <p className="text-xs text-white/60">GPU负载</p>
                      <p className="text-lg font-bold text-amber-400">{mockEdgeStatus.gpuLoad}%</p>
                    </div>
                    <div className="p-3 bg-white/10 rounded-lg">
                      <p className="text-xs text-white/60">CPU温度</p>
                      <p className="text-lg font-bold text-orange-400">{mockEdgeStatus.cpuTemp}°C</p>
                    </div>
                  </div>
                </div>

                {/* 算法性能对比 */}
                <div className="p-4 bg-slate-50 rounded-xl">
                  <h4 className="font-medium text-slate-700 mb-3 text-sm">算法性能对比</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">单帧处理</span>
                      <span className="font-medium text-emerald-600">42ms (提升20.5x)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">小目标召回</span>
                      <span className="font-medium text-emerald-600">89% (+28pp)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">叠果分割</span>
                      <span className="font-medium text-emerald-600">96% (+23pp)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">虫蛀识别</span>
                      <span className="font-medium text-emerald-600">93% (+25pp)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 特征图谱 */}
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-800 flex items-center space-x-2">
                  <Image className="w-4 h-4" />
                  <span>病虫害特征图谱</span>
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { name: '蛀孔面积', value: '>400像素²', status: 'normal' },
                    { name: '病斑颜色', value: 'H<15°(褐变)', status: 'warning' },
                    { name: '叶面卷曲', value: '方差>0.35', status: 'normal' },
                    { name: 'NDVI指数', value: '0.72', status: 'good' }
                  ].map((feature, index) => (
                    <div key={index} className="p-3 bg-slate-50 rounded-lg">
                      <p className="text-xs text-slate-500">{feature.name}</p>
                      <p className={`text-sm font-medium ${
                        feature.status === 'warning' ? 'text-amber-600' :
                        feature.status === 'good' ? 'text-emerald-600' :
                        'text-slate-700'
                      }`}>{feature.value}</p>
                    </div>
                  ))}
                </div>

                {/* 技术壁垒说明 */}
                <div className="p-4 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl text-white">
                  <h4 className="font-medium mb-3">技术壁垒</h4>
                  <ul className="text-xs text-white/70 space-y-2">
                    <li className="flex items-start space-x-2">
                      <Zap className="w-3 h-3 text-amber-400 mt-0.5" />
                      <span>多光谱融合：可见光+NIR+热成像协同诊断</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Zap className="w-3 h-3 text-amber-400 mt-0.5" />
                      <span>农业专用模型：果实遮挡、粘连场景优化</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Zap className="w-3 h-3 text-amber-400 mt-0.5" />
                      <span>边缘计算：Jetson Nano实时56FPS分析</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Zap className="w-3 h-3 text-amber-400 mt-0.5" />
                      <span>农学特征编码：植保经验转化为量化算法</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 快捷操作栏 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600">
            <Camera className="w-4 h-4" />
            <span>开始采集</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50">
            <Download className="w-4 h-4" />
            <span>导出数据</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50">
            <FileText className="w-4 h-4" />
            <span>生成报告</span>
          </button>
        </div>
        <div className="flex items-center space-x-2 text-sm text-slate-500">
          <Signal className="w-4 h-4" />
          <span>边缘计算节点: {mockEdgeStatus.device}</span>
          <span className="mx-2">|</span>
          <span>模型版本: {mockEdgeStatus.modelVersion}</span>
        </div>
      </div>
    </div>
  )
}
