import { useEffect } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { BookOpen, Brain, FileCheck, MessagesSquare, User } from 'lucide-react'
import RoleSwitcher from '@/components/layout/RoleSwitcher'
import LanguageSwitcher from '@/components/layout/LanguageSwitcher'
import { useApp } from '@/context/AppContext'
import { cn } from '@/lib/utils'

const TABS = [
  { to: '/student', label: 'เรียน', icon: BookOpen, end: true },
  { to: '/student/review', label: 'ทบทวน', icon: Brain },
  { to: '/student/assignments', label: 'งาน', icon: FileCheck },
  { to: '/student/community', label: 'คอมมู', icon: MessagesSquare },
  { to: '/student/profile', label: 'ฉัน', icon: User },
]

export default function StudentShell() {
  const { setRole } = useApp()
  const location = useLocation()
  // keep the role switcher honest when this shell is reached by direct URL
  useEffect(() => setRole('student'), [setRole])

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <header className="shrink-0 border-b border-grey-300/60 bg-paper">
        <div className="mx-auto flex h-14 w-full max-w-lg items-center justify-between px-4">
          <span className="text-base">
            <span className="font-extrabold tracking-tight text-grey-300">SPU</span>{' '}
            <span className="font-bold text-pink-600">ClassLoop</span>
          </span>
          <div className="flex items-center gap-1.5">
            <LanguageSwitcher />
            <RoleSwitcher />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-lg flex-1 p-4 pb-24">
        <div key={location.pathname} className="animate-page-fade">
          <Outlet />
        </div>
      </main>

      <nav className="fixed inset-x-0 bottom-0 border-t border-grey-300/60 bg-paper z-30">
        <div className="mx-auto flex max-w-lg">
          {TABS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  'flex flex-1 flex-col items-center gap-1 py-2 text-[11px] font-semibold transition-colors',
                  isActive ? 'text-pink-600' : 'text-grey-600',
                )
              }
            >
              <Icon className="h-5 w-5" />
              {label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
