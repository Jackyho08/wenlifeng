import { useState, useRef } from 'react'
import { Upload, Loader2, CheckCircle, AlertCircle, Image as ImageIcon } from 'lucide-react'
import { analyzeLocalImage, type AnalysisResult } from '@/lib/aliyunApi'

interface ImageUploadProps {
  onAnalysisComplete?: (result: AnalysisResult) => void
}

export default function ImageUpload({ onAnalysisComplete }: ImageUploadProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)
    setResult(null)
    
    const reader = new FileReader()
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    setIsAnalyzing(true)
    try {
      const analysisResult = await analyzeLocalImage(file)
      setResult(analysisResult)
      onAnalysisComplete?.(analysisResult)
    } catch (err) {
      setError(err instanceof Error ? err.message : '分析失败，请重试')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-emerald-500'
      case 'diseased': return 'bg-red-500'
      case 'pest_infected': return 'bg-orange-500'
      case 'damaged': return 'bg-amber-500'
      default: return 'bg-slate-500'
    }
  }

  const getHealthStatusLabel = (status: string) => {
    switch (status) {
      case 'healthy': return '健康'
      case 'diseased': return '病害'
      case 'pest_infected': return '虫害'
      case 'damaged': return '损伤'
      default: return '未知'
    }
  }

  return (
    <div className="space-y-4">
      <div 
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center cursor-pointer hover:border-emerald-500 hover:bg-emerald-50 transition-colors"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        {imagePreview ? (
          <div className="relative">
            <img 
              src={imagePreview} 
              alt="Preview" 
              className="max-h-64 mx-auto rounded-lg"
            />
            {isAnalyzing && (
              <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                <div className="text-white text-center">
                  <Loader2 className="w-8 h-8 mx-auto animate-spin" />
                  <p className="mt-2">AI 分析中...</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            <Upload className="w-12 h-12 mx-auto text-slate-400 mb-4" />
            <p className="text-slate-600 font-medium">点击上传荔枝图片</p>
            <p className="text-slate-400 text-sm mt-1">支持 JPG、PNG 格式</p>
          </>
        )}
      </div>

      {error && (
        <div className="flex items-center space-x-2 p-4 bg-red-50 text-red-700 rounded-lg">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {result && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center space-x-2">
            <ImageIcon className="w-5 h-5 text-emerald-500" />
            <span>AI 分析结果</span>
          </h3>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-500">成熟度评分</p>
              <p className="text-2xl font-bold text-emerald-600">{result.ripenessScore}%</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-500">置信度</p>
              <p className="text-2xl font-bold text-blue-600">{result.confidence}%</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 mb-4">
            <span className="text-sm text-slate-500">健康状态:</span>
            <span className={`px-3 py-1 rounded-full text-white text-sm ${getHealthStatusColor(result.healthStatus)}`}>
              {getHealthStatusLabel(result.healthStatus)}
            </span>
          </div>

          {result.recommendations && result.recommendations.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-700">建议:</p>
              {result.recommendations.map((rec, index) => (
                <div key={index} className="flex items-start space-x-2 text-sm text-slate-600">
                  <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
