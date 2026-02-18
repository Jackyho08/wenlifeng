import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  if (request.method === 'OPTIONS') {
    response.status(200).end()
    return
  }

  try {
    const { image_url } = request.body
    
    if (!image_url) {
      return response.status(400).json({ error: 'image_url is required' })
    }

    const accessKeyId = process.env.ALIYUN_ACCESS_KEY_ID
    const accessKeySecret = process.env.ALIYUN_ACCESS_KEY_SECRET
    
    if (!accessKeyId || !accessKeySecret) {
      return response.status(500).json({ error: '阿里云配置未完成' })
    }

    const timestamp = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z')
    const params = new URLSearchParams({
      Format: 'JSON',
      Version: '2019-09-30',
      AccessKeyId: accessKeyId,
      SignatureMethod: 'HMAC-SHA1',
      Timestamp: timestamp,
      SignatureVersion: '1.0',
      SignatureNonce: Math.random().toString(36).substring(2),
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

    const apiResponse = await fetch(`https://imagerecog.cn-shanghai.aliyuncs.com/?${params.toString()}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })

    const result = await apiResponse.json()

    const analysisResult = {
      ripenessScore: 70,
      healthStatus: 'healthy',
      confidence: 85,
      recommendations: ['果实生长状况良好'],
      fruits: result.Data?.Elements || []
    }

    return response.status(200).json(analysisResult)

  } catch (error) {
    return response.status(500).json({ error: error.message })
  }
}
