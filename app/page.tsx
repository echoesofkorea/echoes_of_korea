import Link from 'next/link'
import Button from '@/components/ui/Button'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary mb-4">
          Echoes of Korea
        </h1>
        <p className="text-lg text-muted mb-8">
          한국 구술사 아카이브 관리 시스템
        </p>
        <Link href="/admin/login">
          <Button>관리자 로그인</Button>
        </Link>
      </div>
    </div>
  )
}