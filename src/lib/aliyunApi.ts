import { supabase } from '../supabase'

export interface AnalysisResult {
  ripenessScore: number
  healthStatus: 'healthy' | 'diseased' | 'pest_infected' | 'damaged'
  fruitType?: string
  confidence: number
  recommendations: string[]
  fruits?: any[]
}

export async function analyzeImageWithAI(imageUrl: string): Promise<AnalysisResult> {
  const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-image`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ image_url: imageUrl }),
    }
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || '分析失败')
  }

  return response.json()
}

export async function analyzeLocalImage(file: File): Promise<AnalysisResult> {
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('images')
    .upload(`assessments/${Date.now()}-${file.name}`, file)

  if (uploadError) throw uploadError

  const { data: { publicUrl } } = supabase.storage
    .from('images')
    .getPublicUrl(uploadData.path)

  return analyzeImageWithAI(publicUrl)
}
