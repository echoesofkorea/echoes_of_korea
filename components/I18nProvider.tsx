'use client'

import { useEffect } from 'react'
import '@/lib/i18n'

export default function I18nProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // i18n 초기화 확인을 위한 로그
    console.log('i18n initialized')
  }, [])

  return <>{children}</>
}