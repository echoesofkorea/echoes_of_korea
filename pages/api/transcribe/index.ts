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

  const { interview_id } = req.body

  if (!interview_id) {
    return res.status(400).json({ error: 'Interview ID is required' })
  }

  try {
    // Get interview data
    const { data: interview, error: fetchError } = await supabase
      .from('interviews')
      .select('*')
      .eq('id', interview_id)
      .single()

    if (fetchError || !interview) {
      return res.status(404).json({ error: 'Interview not found' })
    }

    if (!interview.audio_file_path) {
      return res.status(400).json({ error: 'No audio file found for this interview' })
    }

    // Update status to processing
    const { error: updateError } = await supabase
      .from('interviews')
      .update({ stt_status: 'processing' })
      .eq('id', interview_id)

    if (updateError) {
      throw updateError
    }

    // Generate signed URL for the audio file
    const { data: signedUrlData, error: urlError } = await supabase
      .storage
      .from('audio-files')
      .createSignedUrl(interview.audio_file_path, 3600) // 1 hour expiry

    if (urlError || !signedUrlData) {
      throw new Error('Failed to generate signed URL')
    }

    // TODO: Call STT service API
    // For now, we'll simulate the API call
    // In production, replace this with actual STT service call
    
    // Example for Naver CLOVA Speech:
    /*
    const sttResponse = await fetch(process.env.STT_API_URL!, {
      method: 'POST',
      headers: {
        'X-NCP-APIGW-API-KEY-ID': process.env.STT_API_KEY!,
        'X-NCP-APIGW-API-KEY': process.env.STT_API_SECRET!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: signedUrlData.signedUrl,
        language: 'ko-KR',
        completion: 'async',
        callback: `${process.env.NEXT_PUBLIC_APP_URL}/api/stt-webhook`,
        interviewId: interview_id,
      }),
    })
    */

    // Simulate async processing for demo
    setTimeout(async () => {
      // Simulate STT completion
      const demoTranscript = `[자동 생성된 데모 전사문]
      
인터뷰어: 안녕하세요. 오늘은 한국 전쟁 당시의 경험에 대해 들려주실 수 있으신가요?

인터뷰이: 네, 그때가 1950년이었습니다. 저는 스무 살이었고, 서울에 살고 있었습니다. 6월 25일 새벽에 포성이 들렸는데, 처음에는 무슨 일인지 몰랐습니다.

인터뷰어: 그 당시 상황이 어땠나요?

인터뷰이: 매우 혼란스러웠습니다. 사람들이 남쪽으로 피난을 가기 시작했고, 저희 가족도 짐을 싸서 떠나야 했습니다. 한강 다리를 건너면서 뒤를 돌아보니 서울에서 연기가 피어오르고 있었습니다.

[이하 생략...]`

      await supabase
        .from('interviews')
        .update({ 
          stt_status: 'completed',
          full_transcript: demoTranscript
        })
        .eq('id', interview_id)
    }, 5000)

    return res.status(200).json({ 
      success: true, 
      message: 'Transcription started successfully' 
    })
  } catch (error) {
    console.error('Transcription error:', error)
    
    // Update status to failed
    await supabase
      .from('interviews')
      .update({ stt_status: 'failed' })
      .eq('id', interview_id)

    return res.status(500).json({ error: error instanceof Error ? error.message : 'Internal server error' })
  }
}