import { createSupabaseServerClient } from '@/lib/supabaseServer'
import InterviewsListClient from '@/components/admin/InterviewsListClient'

async function getInterviews() {
  const supabase = await createSupabaseServerClient()
  
  console.log('🔍 인터뷰 목록 조회 시작')
  
  // 현재 사용자 정보 확인
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  console.log('👤 현재 사용자:', user?.id, user?.email)
  if (userError) {
    console.error('❌ 사용자 정보 조회 실패:', userError)
  }
  
  // 먼저 테이블 존재 여부 및 전체 레코드 수 확인
  const { count, error: countError } = await supabase
    .from('interviews')
    .select('*', { count: 'exact', head: true })
  
  console.log('📊 전체 레코드 수:', count, '개')
  if (countError) {
    console.error('❌ 레코드 카운트 실패:', countError)
  }
  
  const { data: interviews, error } = await supabase
    .from('interviews')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('❌ 인터뷰 조회 실패:', error)
    return []
  }

  console.log('✅ 인터뷰 조회 성공:', interviews?.length || 0, '개 발견')
  console.log('📋 조회된 인터뷰 목록:', interviews)
  
  // 각 레코드의 상세 정보 출력
  interviews?.forEach((interview, index) => {
    console.log(`📝 인터뷰 ${index + 1}:`, {
      id: interview.id,
      title: interview.title,
      is_published: interview.is_published,
      audio_file_path: interview.audio_file_path,
      created_at: interview.created_at
    })
  })
  
  return interviews
}

export default async function InterviewsPage() {
  const interviews = await getInterviews()

  return <InterviewsListClient interviews={interviews} />
}