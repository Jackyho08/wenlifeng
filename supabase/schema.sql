-- 创建评估记录表
CREATE TABLE IF NOT EXISTS assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id),
  image_url TEXT NOT NULL,
  fruit_type TEXT DEFAULT '荔枝',
  ripeness_score NUMERIC(5,2),
  health_status TEXT CHECK (health_status IN ('healthy', 'diseased', 'pest_infected', 'damaged')),
  disease_type TEXT,
  pest_type TEXT,
  confidence NUMERIC(5,2),
  recommendations TEXT[],
  location JSONB
);

-- 启用 RLS
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;

-- 创建策略
CREATE POLICY "Users can view own assessments" ON assessments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own assessments" ON assessments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own assessments" ON assessments
  FOR DELETE USING (auth.uid() = user_id);

-- 创建存储桶
INSERT INTO storage.buckets (id, name, public) 
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- 存储策略
CREATE POLICY "Public images are viewable by everyone" ON storage.objects
  FOR SELECT USING (bucket_id = 'images');

CREATE POLICY "Users can upload images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_assessments_user_id ON assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_assessments_created_at ON assessments(created_at DESC);
