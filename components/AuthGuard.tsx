'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

interface AuthGuardProps {
  children: React.ReactNode
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        
        console.log('AuthGuard - 사용자 체크:', { user: !!user, error })
        
        if (error || !user) {
          console.log('AuthGuard - 인증되지 않음, 로그인으로 이동')
          router.push('/login')
          return
        }
        
        console.log('AuthGuard - 인증 성공')
        setAuthenticated(true)
      } catch (error) {
        console.error('Auth check failed:', error)
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()

    // 인증 상태 변화 감지
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('AuthGuard - 인증 상태 변경:', event, !!session)
        if (event === 'SIGNED_OUT' || !session) {
          setAuthenticated(false)
          router.push('/login')
        } else if (event === 'SIGNED_IN' && session) {
          setAuthenticated(true)
          setLoading(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-muted">로딩 중...</p>
        </div>
      </div>
    )
  }

  if (!authenticated) {
    return null // 리다이렉트 중
  }

  return <>{children}</>
}