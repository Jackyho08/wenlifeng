import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface AssessmentRecord {
  id: string
  created_at: string
  user_id: string
  image_url: string
  fruit_type: string
  ripeness_score: number
  health_status: 'healthy' | 'diseased' | 'pest_infected' | 'damaged'
  disease_type?: string
  pest_type?: string
  confidence: number
  recommendations: string[]
  location?: {
    latitude: number
    longitude: number
  }
}

export async function uploadAssessmentImage(file: File): Promise<string> {
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
  const filePath = `assessments/${fileName}`
  
  const { data, error } = await supabase.storage
    .from('images')
    .upload(filePath, file)
  
  if (error) throw error
  
  const { data: { publicUrl } } = supabase.storage
    .from('images')
    .getPublicUrl(filePath)
  
  return publicUrl
}

export async function saveAssessment(record: Omit<AssessmentRecord, 'id' | 'created_at'>): Promise<AssessmentRecord> {
  const { data, error } = await supabase
    .from('assessments')
    .insert(record)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function getAssessmentHistory(userId: string): Promise<AssessmentRecord[]> {
  const { data, error } = await supabase
    .from('assessments')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data || []
}

export async function getAssessmentById(id: string): Promise<AssessmentRecord | null> {
  const { data, error } = await supabase
    .from('assessments')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) return null
  return data
}

export async function deleteAssessment(id: string): Promise<void> {
  const { error } = await supabase
    .from('assessments')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

export async function getAssessmentStats(userId: string) {
  const { data, error } = await supabase
    .from('assessments')
    .select('health_status, ripeness_score')
    .eq('user_id', userId)
  
  if (error) throw error
  
  const stats = {
    total: data?.length || 0,
    healthy: 0,
    diseased: 0,
    pest_infected: 0,
    damaged: 0,
    avgRipeness: 0
  }
  
  if (data) {
    data.forEach(item => {
      stats[item.health_status]++
    })
    const validScores = data.filter(d => d.ripeness_score != null)
    if (validScores.length > 0) {
      stats.avgRipeness = validScores.reduce((sum, d) => sum + d.ripeness_score, 0) / validScores.length
    }
  }
  
  return stats
}
