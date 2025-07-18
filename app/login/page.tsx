'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // 이미 로그인된 사용자는 대시보드로 리다이렉트
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        router.push('/admin/dashboard')
      }
    }
    checkAuth()
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    console.log('🔐 로그인 시도:', { email, password: '***' })

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      console.log('🔐 로그인 응답:', { data, error })

      if (error) {
        console.error('❌ 로그인 실패:', error)
        throw error
      }

      console.log('✅ 로그인 성공:', data.user?.email)
      console.log('🍪 세션 정보:', data.session?.access_token ? '토큰 있음' : '토큰 없음')

      // 클라이언트에서 쿠키 확인
      const cookies = document.cookie
      console.log('🍪 브라우저 쿠키:', cookies)
      
      // 세션이 제대로 설정될 때까지 잠시 대기
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 세션 확인
      const { data: sessionCheck } = await supabase.auth.getSession()
      console.log('🔍 세션 재확인:', sessionCheck.session ? '세션 있음' : '세션 없음')
      
      console.log('🔄 대시보드로 이동...')
      router.push('/admin/dashboard')
    } catch (error: any) {
      console.error('❌ 로그인 에러:', error)
      setError(error.message || '로그인에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="max-w-md w-full space-y-8 px-4">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-primary">
            로그인
          </h2>
          <p className="mt-2 text-center text-sm text-muted">
            Echoes of Korea 관리자 로그인
          </p>
        </div>
        
        <form className="mt-8 space-y-6 bg-surface p-8 rounded-lg shadow" onSubmit={handleLogin}>
          {error && (
            <div className="bg-red-50 border border-danger text-danger px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <Input
              label="이메일"
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@example.com"
            />
            
            <Input
              label="비밀번호"
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="비밀번호를 입력하세요"
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? '로그인 중...' : '로그인'}
          </Button>
        </form>
      </div>
    </div>
  )
}