'use client'

import { useTranslation } from 'react-i18next'
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

interface DashboardClientProps {
  stats: {
    total: number
    completed: number
    processing: number
    recent: Interview[]
  }
}

export default function DashboardClient({ stats }: DashboardClientProps) {
  const { t } = useTranslation()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-primary">{t('dashboard')}</h1>
        <p className="mt-1 text-sm text-muted">구술사 프로젝트 관리</p>
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
                    {t('totalInterviews')}
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
                    {t('completedInterviews')}
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
                    {t('pendingInterviews')}
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
            <h2 className="text-xl font-semibold text-primary">{t('recentActivity')}</h2>
            <Link href="/admin/interviews/new">
              <Button size="small">{t('newInterview')}</Button>
            </Link>
          </div>

          {stats.recent.length === 0 ? (
            <div className="text-center py-12">
              <DocumentTextIcon className="mx-auto h-12 w-12 text-muted" />
              <h3 className="mt-2 text-sm font-medium text-primary">{t('noInterviewsTitle')}</h3>
              <p className="mt-1 text-sm text-muted">{t('noInterviewsMessage')}</p>
              <div className="mt-6">
                <Link href="/admin/interviews/new">
                  <Button>{t('addFirstInterview')}</Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-primary sm:pl-6">
                      {t('interviewTitle')}
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-primary">
                      {t('interviewee')}
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-primary">
                      {t('interviewDate')}
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-primary">
                      {t('interviewStatus')}
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
                          <Badge variant="success">{t('completed')}</Badge>
                        )}
                        {interview.stt_status === 'processing' && (
                          <Badge variant="warning">{t('processing')}</Badge>
                        )}
                        {interview.stt_status === 'not_started' && (
                          <Badge>{t('waiting')}</Badge>
                        )}
                        {interview.stt_status === 'failed' && (
                          <Badge variant="danger">{t('failed')}</Badge>
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