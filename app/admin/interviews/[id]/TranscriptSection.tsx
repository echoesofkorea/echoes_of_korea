'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Button from '@/components/ui/Button'
import { PencilIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface TranscriptSectionProps {
  interviewId: string
  initialTranscript: string
}

export default function TranscriptSection({ 
  interviewId, 
  initialTranscript 
}: TranscriptSectionProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [transcript, setTranscript] = useState(initialTranscript)
  const [editedTranscript, setEditedTranscript] = useState(initialTranscript)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSave = async () => {
    setSaving(true)
    setError('')

    try {
      const { error: updateError } = await supabase
        .from('interviews')
        .update({ full_transcript: editedTranscript })
        .eq('id', interviewId)

      if (updateError) throw updateError

      setTranscript(editedTranscript)
      setIsEditing(false)
    } catch (err: any) {
      setError(err.message || '저장 중 오류가 발생했습니다.')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setEditedTranscript(transcript)
    setIsEditing(false)
    setError('')
  }

  return (
    <div className="bg-surface shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-primary">전사문</h2>
          {!isEditing && (
            <Button 
              variant="secondary" 
              size="small"
              onClick={() => setIsEditing(true)}
            >
              <PencilIcon className="h-4 w-4 mr-1" />
              편집
            </Button>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-danger text-danger px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {isEditing ? (
          <div>
            <textarea
              value={editedTranscript}
              onChange={(e) => setEditedTranscript(e.target.value)}
              className="w-full h-96 p-4 border border-gray-300 rounded-md focus:ring-accent focus:border-accent"
              placeholder="전사문을 입력하세요..."
            />
            <div className="mt-4 flex justify-end space-x-3">
              <Button 
                variant="secondary" 
                onClick={handleCancel}
                disabled={saving}
              >
                <XMarkIcon className="h-4 w-4 mr-1" />
                취소
              </Button>
              <Button 
                onClick={handleSave}
                disabled={saving}
              >
                <CheckIcon className="h-4 w-4 mr-1" />
                {saving ? '저장 중...' : '저장'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="prose prose-sm max-w-none">
            <pre className="whitespace-pre-wrap font-sans text-sm text-secondary bg-gray-50 p-4 rounded-md">
              {transcript || '전사문이 없습니다.'}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}