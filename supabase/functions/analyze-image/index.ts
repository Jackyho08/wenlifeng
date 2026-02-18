import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { image_url } = await req.json()
    
    if (!image_url) {
      return new Response(
        JSON.stringify({ error: 'image_url is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const accessKeyId = Deno.env.get('ALIYUN_ACCESS_KEY_ID')
    const accessKeySecret = Deno.env.get('ALIYUN_ACCESS_KEY_SECRET')
    
    if (!accessKeyId || !accessKeySecret) {
      return new Response(
        JSON.stringify({ error: '阿里云配置未完成' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const timestamp = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z')
    const format = 'JSON'
    const signatureMethod = 'HMAC-SHA1'
    const signatureVersion = '1.0'
    const signatureNonce = Math.random().toString(36).substring(2)
    const version = '2019-09-30'

    const params = new URLSearchParams({
      Format: format,
      Version: version,
      AccessKeyId: accessKeyId,
      SignatureMethod: signatureMethod,
      Timestamp: timestamp,
      SignatureVersion: signatureVersion,
      SignatureNonce: signatureNonce,
      Action: 'DetectFruits',
      ImageURL: image_url
    })

    const stringToSign = 'GET&' + encodeURIComponent('/') + '&' + encodeURIComponent(params.toString())
    
    const encoder = new TextEncoder()
    const key = encoder.encode(accessKeySecret + '&')
    const data = encoder.encode(stringToSign)
    
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      key,
      { name: 'HMAC', hash: 'SHA-1' },
      false,
      ['sign']
    )
    
    const signature = await crypto.subtle.sign('HMAC', cryptoKey, data)
    const signatureBase64 = btoa(String.fromCharCode(...new Uint8Array(signature)))
    
    params.append('Signature', signatureBase64)

    const response = await fetch(`https://imagerecog.cn-shanghai.aliyuncs.com/?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const result = await response.json()

    let analysisResult = {
      ripenessScore: 70,
      healthStatus: 'healthy',
      confidence: 85,
      recommendations: ['果实生长状况良好'],
      fruits: result.Data?.Elements || []
    }

    if (result.Data?.Elements && result.Data.Elements.length > 0) {
      const fruit = result.Data.Elements[0]
      if (fruit.Confidence) {
        analysisResult.confidence = Math.round(fruit.Confidence * 100)
      }
      if (fruit.Name) {
        analysisResult.fruitType = fruit.Name
      }
    }

    return new Response(
      JSON.stringify(analysisResult),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
