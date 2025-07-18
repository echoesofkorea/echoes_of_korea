'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { supabase } from '@/lib/supabaseClient'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function NewInterviewPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    interviewee_name: '',
    interviewee_birth_year: '',
    interview_date: '',
  })
  const [audioFile, setAudioFile] = useState<File | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      let audio_file_path = null

      // Upload audio file if selected
      if (audioFile) {
        console.log('📁 파일 업로드 시작:', audioFile.name)
        const fileExt = audioFile.name.split('.').pop()
        const fileName = `${Date.now()}.${fileExt}`
        console.log('📁 생성된 파일명:', fileName)
        
        const { error: uploadError } = await supabase.storage
          .from('audio-files')
          .upload(fileName, audioFile)

        if (uploadError) {
          console.error('❌ 파일 업로드 실패:', uploadError)
          throw uploadError
        }
        
        console.log('✅ 파일 업로드 성공:', fileName)
        audio_file_path = fileName
      }

      // Insert interview record
      console.log('💾 데이터베이스 저장 시작:', {
        title: formData.title,
        interviewee_name: formData.interviewee_name,
        interviewee_birth_year: formData.interviewee_birth_year ? parseInt(formData.interviewee_birth_year) : null,
        interview_date: formData.interview_date || null,
        audio_file_path,
      })
      
      const { data: insertData, error: dbError } = await supabase
        .from('interviews')
        .insert({
          title: formData.title,
          interviewee_name: formData.interviewee_name,
          interviewee_birth_year: formData.interviewee_birth_year ? parseInt(formData.interviewee_birth_year) : null,
          interview_date: formData.interview_date || null,
          audio_file_path,
          is_published: true,
        })
        .select()

      if (dbError) {
        console.error('❌ 데이터베이스 저장 실패:', dbError)
        throw dbError
      }
      
      console.log('✅ 데이터베이스 저장 성공:', insertData)
      console.log('🔄 인터뷰 목록으로 이동 중...')
      router.push('/admin/interviews')
    } catch (err) {
      setError(err instanceof Error ? err.message : t('addingInterviewError'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/interviews" className="inline-flex items-center text-sm text-muted hover:text-primary">
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          {t('backToInterviews')}
        </Link>
        <h1 className="text-4xl font-bold text-primary mt-2">{t('addNewInterviewTitle')}</h1>
      </div>

      <div className="bg-surface shadow rounded-lg">
        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          {error && (
            <div className="bg-red-50 border border-danger text-danger px-4 py-3 rounded">
              {error}
            </div>
          )}

          <Input
            label={t('interviewTitleLabel')}
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            placeholder={t('interviewTitlePlaceholder')}
          />

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Input
              label={t('intervieweeName')}
              id="interviewee_name"
              value={formData.interviewee_name}
              onChange={(e) => setFormData({ ...formData, interviewee_name: e.target.value })}
              required
              placeholder={t('intervieweeNamePlaceholder')}
            />

            <Input
              label={t('intervieweeBirthYear')}
              id="interviewee_birth_year"
              type="number"
              value={formData.interviewee_birth_year}
              onChange={(e) => setFormData({ ...formData, interviewee_birth_year: e.target.value })}
              placeholder={t('intervieweeBirthYearPlaceholder')}
              min="1900"
              max={new Date().getFullYear()}
            />
          </div>

          <Input
            label={t('interviewDateLabel')}
            id="interview_date"
            type="date"
            value={formData.interview_date}
            onChange={(e) => setFormData({ ...formData, interview_date: e.target.value })}
          />

          <div>
            <label htmlFor="audio_file" className="block text-sm font-medium text-primary">
              {t('audioFile')}
            </label>
            <div className="mt-1">
              <input
                type="file"
                id="audio_file"
                accept="audio/*"
                onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
                className="block w-full text-sm text-secondary
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-accent file:text-white
                  hover:file:bg-blue-700"
              />
              <p className="mt-1 text-xs text-muted">{t('audioFileDescription')}</p>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Link href="/admin/interviews">
              <Button variant="secondary">{t('cancel')}</Button>
            </Link>
            <Button type="submit" disabled={loading}>
              {loading ? t('saving') : t('addInterview')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}