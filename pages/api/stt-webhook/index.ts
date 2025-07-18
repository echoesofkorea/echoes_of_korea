import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Verify the request is from the legitimate STT service
    // This will depend on your STT provider's webhook security mechanism
    // For example, checking a secret key in headers or verifying a signature
    
    const authHeader = req.headers['x-webhook-secret']
    if (authHeader !== process.env.STT_WEBHOOK_SECRET) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    // Parse the webhook payload
    // The structure will depend on your STT service provider
    const { interviewId, transcript, status, error } = req.body

    if (!interviewId) {
      return res.status(400).json({ error: 'Interview ID is required' })
    }

    if (status === 'failed' || error) {
      // Update interview status to failed
      await supabase
        .from('interviews')
        .update({ stt_status: 'failed' })
        .eq('id', interviewId)

      return res.status(200).json({ success: true })
    }

    if (status === 'completed' && transcript) {
      // Update interview with transcript
      const { error: updateError } = await supabase
        .from('interviews')
        .update({ 
          stt_status: 'completed',
          full_transcript: transcript
        })
        .eq('id', interviewId)

      if (updateError) {
        throw updateError
      }
    }

    return res.status(200).json({ success: true })
  } catch (error: any) {
    console.error('STT webhook error:', error)
    return res.status(500).json({ error: error.message })
  }
}