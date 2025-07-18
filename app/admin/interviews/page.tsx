import { createSupabaseServerClient } from '@/lib/supabaseServer'
import { Database } from '@/lib/database.types'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Link from 'next/link'
import { PlusIcon } from '@heroicons/react/24/outline'

type Interview = Database['public']['Tables']['interviews']['Row']

async function getInterviews() {
  const supabase = await createSupabaseServerClient()
  
  const { data: interviews, error } = await supabase
    .from('interviews')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching interviews:', error)
    return []
  }

  return interviews
}

export default async function InterviewsPage() {
  const interviews = await getInterviews()

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-primary">인터뷰 목록</h1>
          <p className="mt-1 text-sm text-muted">전체 {interviews.length}개의 인터뷰</p>
        </div>
        <Link href="/admin/interviews/new">
          <Button>
            <PlusIcon className="h-5 w-5 mr-2" />
            새 인터뷰 추가
          </Button>
        </Link>
      </div>

      <div className="bg-surface shadow rounded-lg">
        {interviews.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-sm font-medium text-primary">인터뷰가 없습니다</h3>
            <p className="mt-1 text-sm text-muted">첫 인터뷰를 추가해보세요.</p>
            <div className="mt-6">
              <Link href="/admin/interviews/new">
                <Button>첫 인터뷰 추가하기</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-primary sm:pl-6">
                    제목
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-primary">
                    인터뷰이
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-primary">
                    출생년도
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-primary">
                    인터뷰 날짜
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-primary">
                    전사 상태
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-primary">
                    공개 여부
                  </th>
                  <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">작업</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {interviews.map((interview) => (
                  <tr key={interview.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-primary sm:pl-6">
                      {interview.title}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-secondary">
                      {interview.interviewee_name}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-secondary">
                      {interview.interviewee_birth_year || '-'}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-secondary">
                      {interview.interview_date || '-'}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
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
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <Badge variant={interview.is_published ? 'success' : 'default'}>
                        {interview.is_published ? '공개' : '비공개'}
                      </Badge>
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <Link 
                        href={`/admin/interviews/${interview.id}`}
                        className="text-accent hover:text-blue-700"
                      >
                        상세보기
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}