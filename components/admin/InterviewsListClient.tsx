'use client'

import { useTranslation } from 'react-i18next'
import { Database } from '@/lib/database.types'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Link from 'next/link'
import { PlusIcon } from '@heroicons/react/24/outline'

type Interview = Database['public']['Tables']['interviews']['Row']

interface InterviewsListClientProps {
  interviews: Interview[]
}

export default function InterviewsListClient({ interviews }: InterviewsListClientProps) {
  const { t } = useTranslation()

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-primary">{t('interviewsList')}</h1>
          <p className="mt-1 text-sm text-muted">{t('totalInterviewsCount', { count: interviews.length })}</p>
        </div>
        <Link href="/admin/interviews/new">
          <Button>
            <PlusIcon className="h-5 w-5 mr-2" />
            {t('addNewInterview')}
          </Button>
        </Link>
      </div>

      <div className="bg-surface shadow rounded-lg">
        {interviews.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-sm font-medium text-primary">{t('noInterviewsTitle')}</h3>
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
                    {t('title')}
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-primary">
                    {t('interviewee')}
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-primary">
                    {t('birthYear')}
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-primary">
                    {t('interviewDate')}
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-primary">
                    {t('transcriptionStatus')}
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-primary">
                    {t('publicationStatus')}
                  </th>
                  <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">{t('actions')}</span>
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
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <Badge variant={interview.is_published ? 'success' : 'default'}>
                        {interview.is_published ? t('published') : t('unpublished')}
                      </Badge>
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <Link 
                        href={`/admin/interviews/${interview.id}`}
                        className="text-accent hover:text-blue-700"
                      >
                        {t('viewDetails')}
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