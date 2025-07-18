'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { 
  HomeIcon, 
  MicrophoneIcon, 
  DocumentTextIcon,
  ArrowRightOnRectangleIcon 
} from '@heroicons/react/24/outline'

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const navigation = [
    { name: '대시보드', href: '/admin/dashboard', icon: HomeIcon },
    { name: '인터뷰', href: '/admin/interviews', icon: MicrophoneIcon },
    { name: '새 인터뷰', href: '/admin/interviews/new', icon: DocumentTextIcon },
  ]

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/login')
    } catch (error) {
      console.error('로그아웃 실패:', error)
    }
  }

  return (
    <div className="flex h-full w-64 flex-col bg-surface border-r border-gray-200">
      <div className="flex h-16 items-center justify-center border-b border-gray-200">
        <h1 className="text-xl font-bold text-primary">Echoes of Korea</h1>
      </div>
      
      <nav className="flex-1 space-y-1 px-2 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                isActive
                  ? 'bg-accent text-white'
                  : 'text-secondary hover:bg-gray-50 hover:text-primary'
              }`}
            >
              <item.icon
                className={`mr-3 h-5 w-5 ${
                  isActive ? 'text-white' : 'text-muted group-hover:text-secondary'
                }`}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-gray-200 p-4">
        <button 
          onClick={handleLogout}
          className="group flex w-full items-center px-2 py-2 text-sm font-medium text-secondary rounded-md hover:bg-gray-50 hover:text-primary"
        >
          <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5 text-muted group-hover:text-secondary" />
          로그아웃
        </button>
      </div>
    </div>
  )
}