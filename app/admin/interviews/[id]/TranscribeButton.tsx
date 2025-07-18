'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import { SpeakerWaveIcon } from '@heroicons/react/24/outline'

export default function TranscribeButton({ interviewId }: { interviewId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleTranscribe = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ interview_id: interviewId }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || '전사 시작 중 오류가 발생했습니다.')
      }

      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : '전사 시작 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {error && (
        <p className="text-sm text-danger mb-2">{error}</p>
      )}
      <Button 
        onClick={handleTranscribe} 
        disabled={loading}
        size="small"
      >
        <SpeakerWaveIcon className="h-4 w-4 mr-2" />
        {loading ? '전사 시작중...' : '전사 시작'}
      </Button>
    </div>
  )
}