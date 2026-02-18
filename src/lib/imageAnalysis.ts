export interface AnalysisResult {
  ripenessScore: number
  healthStatus: 'healthy' | 'diseased' | 'pest_infected' | 'damaged'
  diseaseType?: string
  pestType?: string
  confidence: number
  recommendations: string[]
}

function getAverageColor(imageData: ImageData): { r: number; g: number; b: number } {
  const data = imageData.data
  let r = 0, g = 0, b = 0
  const pixelCount = data.length / 4
  
  for (let i = 0; i < data.length; i += 4) {
    r += data[i]
    g += data[i + 1]
    b += data[i + 2]
  }
  
  return {
    r: r / pixelCount,
    g: g / pixelCount,
    b: b / pixelCount
  }
}

function rgbToHsv(r: number, g: number, b: number): { h: number; s: number; v: number } {
  r /= 255
  g /= 255
  b /= 255
  
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const diff = max - min
  
  let h = 0
  if (diff !== 0) {
    if (max === r) h = (60 * ((g - b) / diff) + 360) % 360
    else if (max === g) h = (60 * ((b - r) / diff) + 120) % 360
    else h = (60 * ((r - g) / diff) + 240) % 360
  }
  
  const s = max === 0 ? 0 : (diff / max) * 100
  const v = max * 100
  
  return { h, s, v }
}

function detectSpots(imageData: ImageData): number {
  const data = imageData.data
  let spotPixels = 0
  const totalPixels = data.length / 4
  
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    
    const brownish = r < 100 && g < 80 && b < 60
    const darkSpots = r < 50 && g < 50 && b < 50
    
    if (brownish || darkSpots) spotPixels++
  }
  
  return spotPixels / totalPixels
}

function detectPestDamage(imageData: ImageData): number {
  const data = imageData.data
  let damagedPixels = 0
  const totalPixels = data.length / 4
  
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    
    const holes = r < 30 && g < 30 && b < 30
    const darkMarks = r < 50 && g < 40 && b < 40
    
    if (holes || darkMarks) damagedPixels++
  }
  
  return damagedPixels / totalPixels
}

export async function analyzeImage(file: File): Promise<AnalysisResult> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    
    img.onload = () => {
      URL.revokeObjectURL(url)
      
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Failed to get canvas context'))
        return
      }
      
      const maxSize = 400
      let width = img.width
      let height = img.height
      
      if (width > height) {
        if (width > maxSize) {
          height *= maxSize / width
          width = maxSize
        }
      } else {
        if (height > maxSize) {
          width *= maxSize / height
          height = maxSize
        }
      }
      
      canvas.width = width
      canvas.height = height
      ctx.drawImage(img, 0, 0, width, height)
      
      const imageData = ctx.getImageData(0, 0, width, height)
      const avgColor = getAverageColor(imageData)
      const hsv = rgbToHsv(avgColor.r, avgColor.g, avgColor.b)
      const spotRatio = detectSpots(imageData)
      const pestDamageRatio = detectPestDamage(imageData)
      
      let ripenessScore = 0
      if (hsv.h >= 0 && hsv.h <= 50 && hsv.s >= 30) {
        ripenessScore = Math.min(100, Math.max(0, 50 + (50 - hsv.h) + hsv.s * 0.3))
      } else if (hsv.h > 50) {
        ripenessScore = Math.max(0, 100 - (hsv.h - 50) * 2)
      }
      
      let healthStatus: AnalysisResult['healthStatus'] = 'healthy'
      let diseaseType: string | undefined
      let pestType: string | undefined
      const recommendations: string[] = []
      
      if (spotRatio > 0.15) {
        healthStatus = 'diseased'
        diseaseType = '炭疽病/霜霉病'
        recommendations.push('建议喷施多菌灵或代森锰锌')
        recommendations.push('及时清除病果，防止传染')
      } else if (pestDamageRatio > 0.05) {
        healthStatus = 'pest_infected'
        pestType = '荔枝霜疫霉/炭疽病'
        recommendations.push('建议使用吡虫啉防治')
        recommendations.push('加强果园通风透光')
      } else if (spotRatio > 0.05) {
        healthStatus = 'damaged'
        recommendations.push('发现少量病斑，建议加强管理')
      }
      
      if (ripenessScore < 30) {
        recommendations.push('果实未成熟，建议7-10天后采收')
      } else if (ripenessScore > 80) {
        recommendations.push('果实已成熟，建议及时采收')
      }
      
      const confidence = Math.min(95, 60 + (1 - spotRatio - pestDamageRatio) * 40)
      
      resolve({
        ripenessScore: Math.round(ripenessScore),
        healthStatus,
        diseaseType,
        pestType,
        confidence: Math.round(confidence),
        recommendations
      })
    }
    
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to load image'))
    }
    
    img.src = url
  })
}

export function getHealthStatusLabel(status: AnalysisResult['healthStatus']): string {
  const labels = {
    healthy: '健康',
    diseased: '病害',
    pest_infected: '虫害',
    damaged: '损伤'
  }
  return labels[status]
}

export function getRipenessStage(score: number): string {
  if (score < 30) return '未成熟'
  if (score < 50) return '绿熟期'
  if (score < 70) return '半熟期'
  if (score < 85) return '成熟期'
  return '完熟期'
}
