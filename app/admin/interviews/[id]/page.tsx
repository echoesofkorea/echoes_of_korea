import { createSupabaseServerClient } from '@/lib/supabaseServer'
import { Database } from '@/lib/database.types'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Link from 'next/link'
import { ArrowLeftIcon, PencilSquareIcon } from '@heroicons/react/24/outline'
import TranscriptSection from './TranscriptSection'
import TranscribeButton from './TranscribeButton'

type Interview = Database['public']['Tables']['interviews']['Row']

async function getInterview(id: string): Promise<Interview | null> {
  const supabase = await createSupabaseServerClient()
  
  const { data: interview, error } = await supabase
    .from('interviews')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching interview:', error)
    return null
  }

  return interview
}

export default async function InterviewDetailPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const interview = await getInterview(params.id)

  if (!interview) {
    return (
      <div className="text-center py-12">
        <h3 className="text-sm font-medium text-primary">인터뷰를 찾을 수 없습니다</h3>
        <div className="mt-6">
          <Link href="/admin/interviews">
            <Button variant="secondary">인터뷰 목록으로</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/interviews" className="inline-flex items-center text-sm text-muted hover:text-primary">
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          인터뷰 목록으로
        </Link>
        <div className="flex items-center justify-between mt-2">
          <h1 className="text-4xl font-bold text-primary">{interview.title}</h1>
          <Link href={`/admin/interviews/${interview.id}/edit`}>
            <Button variant="secondary" size="small">
              <PencilSquareIcon className="h-4 w-4 mr-1" />
              수정
            </Button>
          </Link>
        </div>
      </div>

      {/* Interview Information */}
      <div className="bg-surface shadow rounded-lg mb-8">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg font-semibold text-primary mb-4">인터뷰 정보</h2>
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-muted">인터뷰이</dt>
              <dd className="mt-1 text-sm text-primary">{interview.interviewee_name}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted">출생년도</dt>
              <dd className="mt-1 text-sm text-primary">{interview.interviewee_birth_year || '-'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted">인터뷰 날짜</dt>
              <dd className="mt-1 text-sm text-primary">{interview.interview_date || '-'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted">등록일</dt>
              <dd className="mt-1 text-sm text-primary">
                {new Date(interview.created_at).toLocaleDateString('ko-KR')}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted">전사 상태</dt>
              <dd className="mt-1">
                {interview.stt_status === 'completed' && (
                  <Badge variant="success">완료</Badge>
                )}
                {interview.stt_status === 'processing' && (
                  <Badge variant="warning">진행중</Badge>
                )}
                {interview.stt_status === 'not_started' && (
                  <Badge>대기</Badge>
                )}
                {interview.stt_status === 'failed' && (
                  <Badge variant="danger">실패</Badge>
                )}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted">공개 여부</dt>
              <dd className="mt-1">
                <Badge variant={interview.is_published ? 'success' : 'default'}>
                  {interview.is_published ? '공개' : '비공개'}
                </Badge>
              </dd>
            </div>
          </dl>

          {/* Audio File & Transcription */}
          {interview.audio_file_path && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <dt className="text-sm font-medium text-muted">오디오 파일</dt>
                  <dd className="mt-1 text-sm text-primary">{interview.audio_file_path}</dd>
                </div>
                {interview.stt_status === 'not_started' && (
                  <TranscribeButton interviewId={interview.id} />
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Transcript Section */}
      {(interview.stt_status === 'completed' || interview.full_transcript) && (
        <TranscriptSection 
          interviewId={interview.id} 
          initialTranscript={interview.full_transcript || ''} 
        />
      )}
    </div>
  )
}