import { createSupabaseServerClient } from '@/lib/supabaseServer'
import { Database } from '@/lib/database.types'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Link from 'next/link'
import { 
  MicrophoneIcon, 
  DocumentTextIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

type Interview = Database['public']['Tables']['interviews']['Row']

async function getInterviewStats() {
  const supabase = await createSupabaseServerClient()
  
  const { data: interviews, error } = await supabase
    .from('interviews')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching interviews:', error)
    return { total: 0, completed: 0, processing: 0, recent: [] }
  }

  const stats = {
    total: interviews.length,
    completed: interviews.filter(i => i.stt_status === 'completed').length,
    processing: interviews.filter(i => i.stt_status === 'processing').length,
    recent: interviews.slice(0, 5)
  }

  return stats
}

export default async function DashboardPage() {
  const stats = await getInterviewStats()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-primary">대시보드</h1>
        <p className="mt-1 text-sm text-muted">구술사 인터뷰 관리 시스템</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
        <div className="bg-surface overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <MicrophoneIcon className="h-6 w-6 text-muted" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-muted truncate">
                    전체 인터뷰
                  </dt>
                  <dd className="text-2xl font-bold text-primary">
                    {stats.total}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-surface overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-6 w-6 text-success" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-muted truncate">
                    전사 완료
                  </dt>
                  <dd className="text-2xl font-bold text-primary">
                    {stats.completed}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-surface overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClockIcon className="h-6 w-6 text-warning" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-muted truncate">
                    전사 진행중
                  </dt>
                  <dd className="text-2xl font-bold text-primary">
                    {stats.processing}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Interviews */}
      <div className="bg-surface shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-primary">최근 인터뷰</h2>
            <Link href="/admin/interviews/new">
              <Button size="small">새 인터뷰 추가</Button>
            </Link>
          </div>

          {stats.recent.length === 0 ? (
            <div className="text-center py-12">
              <DocumentTextIcon className="mx-auto h-12 w-12 text-muted" />
              <h3 className="mt-2 text-sm font-medium text-primary">인터뷰가 없습니다</h3>
              <p className="mt-1 text-sm text-muted">새 인터뷰를 추가해보세요.</p>
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
                      날짜
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-primary">
                      상태
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {stats.recent.map((interview) => (
                    <tr key={interview.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-primary sm:pl-6">
                        <Link href={`/admin/interviews/${interview.id}`} className="hover:text-accent">
                          {interview.title}
                        </Link>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-secondary">
                        {interview.interviewee_name}
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}