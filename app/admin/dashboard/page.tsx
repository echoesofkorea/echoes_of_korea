import { createSupabaseServerClient } from '@/lib/supabaseServer'
import DashboardClient from '@/components/admin/DashboardClient'

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

  return <DashboardClient stats={stats} />
}