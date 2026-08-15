import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  Bell,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  FileText,
  LayoutDashboard,
  Lock,
  LogOut,
  Menu,
  MessagesSquare,
  Radio,
  RotateCcw,
  Settings,
  User,
  Users,
  Wand2,
  X,
} from 'lucide-react'
import RoleSwitcher from '@/components/layout/RoleSwitcher'
import LanguageSwitcher from '@/components/layout/LanguageSwitcher'
import DarkModeToggle from '@/components/layout/DarkModeToggle'
import { useApp } from '@/context/AppContext'
import { cn } from '@/lib/utils'

const NAV = [
  { to: '/teacher', label: 'แดชบอร์ด', icon: LayoutDashboard, end: true },
  { to: '/teacher/studio', label: 'สตูดิโอ', icon: Wand2 },
  { to: '/teacher/exams', label: 'ข้อสอบ', icon: FileText },
  { to: '/teacher/live', label: 'คาบเรียน', icon: Radio },
  { to: '/teacher/class', label: 'รายชื่อ', icon: Users },
  { to: '/teacher/community', label: 'คอมมูนิตี้', icon: MessagesSquare },
]

const LOCKED_COURSES = ['Organisational Behaviour', 'Strategic Management']

const NOTIFICATIONS = [
  'นักศึกษา 3 คนยังไม่ส่ง Pre-test สัปดาห์ที่ 5',
  'มีคำถามใหม่ 5 ข้อในคอมมูนิตี้',
  'ถึงเวลาสร้างกิจกรรมสำหรับสัปดาห์ที่ 6',
]

/** Avatar initial for the demo teacher (อ.ดร.ธนพร). */
const TEACHER_INITIAL = 'ธ'

function ComingSoonBadge() {
  return (
    <span className="shrink-0 rounded-full bg-grey-300/25 px-1.5 py-0.5 text-[10px] font-medium text-grey-600">
      เร็วๆ นี้
    </span>
  )
}

function Brand() {
  return (
    <span className="text-lg">
      <span className="font-extrabold tracking-tight text-grey-300">SPU</span>{' '}
      <span className="font-bold text-pink-600">ClassLoop</span>
    </span>
  )
}

export default function TeacherShell() {
  const { course, teacherName, resetDemo, setRole } = useApp()
  const navigate = useNavigate()
  const location = useLocation()

  // keep the role switcher honest when this shell is reached by direct URL
  useEffect(() => setRole('teacher'), [setRole])

  const [openMenu, setOpenMenu] = useState<'bell' | 'account' | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const bellRef = useRef<HTMLDivElement>(null)
  const accountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!openMenu) return
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node
      if (bellRef.current?.contains(target) || accountRef.current?.contains(target)) return
      setOpenMenu(null)
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenMenu(null)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [openMenu])

  return (
    <div className="flex min-h-screen bg-canvas">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-grey-300/60 bg-paper md:flex">
        <div className="flex h-16 items-center px-6">
          <Brand />
        </div>

        {/* courses */}
        <div className="px-3 pt-2">
          <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-grey-600">
            รายวิชา
          </p>
          <div className="mt-2 flex flex-col gap-1">
            <Link
              to="/teacher"
              className="rounded-lg bg-pink-50 px-3 py-2 ring-1 ring-pink-300/50 transition-colors hover:bg-pink-50/70"
            >
              <p className="truncate text-sm font-medium text-pink-600">{course.name}</p>
              <p className="mt-0.5 text-[11px] text-grey-600">{course.code}</p>
            </Link>
            {LOCKED_COURSES.map((name) => (
              <div
                key={name}
                aria-disabled="true"
                className="cursor-not-allowed select-none rounded-lg px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  <p className="min-w-0 flex-1 truncate text-sm text-grey-300">{name}</p>
                  <ComingSoonBadge />
                  <Lock className="h-3.5 w-3.5 shrink-0 text-grey-300" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* nav */}
        <nav className="mt-4 flex flex-1 flex-col gap-1 border-t border-grey-300/40 px-3 pt-4">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-pink-50 text-pink-600'
                    : 'text-grey-600 hover:bg-pink-50/60 hover:text-pink-600',
                )
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
          <div
            aria-disabled="true"
            className="flex cursor-not-allowed select-none items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-grey-300"
          >
            <ClipboardCheck className="h-4 w-4" />
            <span className="min-w-0 flex-1">เช็คชื่อ</span>
            <ComingSoonBadge />
            <Lock className="h-3.5 w-3.5 shrink-0" />
          </div>
        </nav>

        {/* e-learning card */}
        <div className="mx-3 mb-4 rounded-xl border border-grey-300/50 bg-canvas px-3 py-2.5">
          <div className="flex items-center gap-2 text-xs text-grey-600">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-pink-600" />
            เชื่อมต่อกับ SPU e-Learning
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-grey-300/60 bg-paper px-4 md:px-6">
          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-1.5 text-grey-600 hover:bg-pink-50 hover:text-pink-600 focus:outline-none cursor-pointer"
              aria-label="เปิดเมนู"
            >
              <Menu className="h-6 w-6" />
            </button>
            <Brand />
          </div>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={resetDemo}
              className="hidden items-center gap-1.5 rounded-lg border border-grey-300/70 px-2.5 py-1.5 text-xs text-grey-600 transition-colors hover:bg-canvas hover:text-ink sm:inline-flex"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset demo data
            </button>

            <DarkModeToggle />
            <RoleSwitcher />
            <LanguageSwitcher />

            {/* notifications */}
            <div className="relative" ref={bellRef}>
              <button
                type="button"
                aria-label="การแจ้งเตือน"
                aria-expanded={openMenu === 'bell'}
                onClick={() => setOpenMenu(openMenu === 'bell' ? null : 'bell')}
                className="relative rounded-full p-2 text-grey-600 transition-colors hover:bg-pink-50 hover:text-pink-600"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-pink-500 px-1 text-[10px] font-semibold text-paper">
                  3
                </span>
              </button>
              {openMenu === 'bell' && (
                <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-xl border border-grey-300/60 bg-paper p-2 shadow-lg">
                  <p className="px-3 pb-1 pt-2 text-xs font-semibold text-grey-600">การแจ้งเตือน</p>
                  {NOTIFICATIONS.map((text) => (
                    <div
                      key={text}
                      className="flex gap-2.5 rounded-lg px-3 py-2.5 text-sm text-ink transition-colors hover:bg-pink-50/60"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-pink-500" />
                      {text}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* account */}
            <div className="relative" ref={accountRef}>
              <button
                type="button"
                aria-expanded={openMenu === 'account'}
                onClick={() => setOpenMenu(openMenu === 'account' ? null : 'account')}
                className="flex items-center gap-2 rounded-full p-1 pr-2 transition-colors hover:bg-pink-50"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-600 text-sm font-semibold text-paper">
                  {TEACHER_INITIAL}
                </span>
                <span className="hidden text-sm font-medium text-ink lg:inline">{teacherName}</span>
                <ChevronDown className="h-4 w-4 text-grey-600" />
              </button>
              {openMenu === 'account' && (
                <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-grey-300/60 bg-paper p-2 shadow-lg">
                  <div
                    aria-disabled="true"
                    className="flex cursor-not-allowed select-none items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-grey-300"
                  >
                    <User className="h-4 w-4" />
                    <span className="min-w-0 flex-1">โปรไฟล์</span>
                    <ComingSoonBadge />
                    <Lock className="h-3.5 w-3.5 shrink-0" />
                  </div>
                  <div
                    aria-disabled="true"
                    className="flex cursor-not-allowed select-none items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-grey-300"
                  >
                    <Settings className="h-4 w-4" />
                    <span className="min-w-0 flex-1">ตั้งค่า</span>
                    <ComingSoonBadge />
                    <Lock className="h-3.5 w-3.5 shrink-0" />
                  </div>
                  <div className="my-1.5 border-t border-grey-300/40" />
                  <button
                    type="button"
                    onClick={() => {
                      setOpenMenu(null)
                      navigate('/login')
                    }}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-ink transition-colors hover:bg-pink-50/60"
                  >
                    <LogOut className="h-4 w-4 text-grey-600" />
                    ออกจากระบบ
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-x-auto p-4 md:p-6">
          <div key={location.pathname} className="animate-page-fade">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Drawer Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden animate-fade-in">
          <div
            className="fixed inset-0 bg-ink/40 backdrop-blur-xs transition-opacity"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative flex w-64 max-w-xs flex-col bg-paper h-full shadow-2xl p-4 animate-slide-in-left">
            <div className="flex items-center justify-between pb-4 border-b border-grey-300/40">
              <Brand />
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="rounded-full bg-canvas p-1.5 text-grey-600 hover:text-ink cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* courses */}
            <div className="px-1 pt-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-grey-600">
                รายวิชา
              </p>
              <div className="mt-2 flex flex-col gap-1">
                <Link
                  to="/teacher"
                  onClick={() => setSidebarOpen(false)}
                  className="rounded-lg bg-pink-50 px-3 py-2 ring-1 ring-pink-300/50 transition-colors hover:bg-pink-50/70"
                >
                  <p className="truncate text-sm font-medium text-pink-600">{course.name}</p>
                  <p className="mt-0.5 text-[11px] text-grey-600">{course.code}</p>
                </Link>
                {LOCKED_COURSES.map((name) => (
                  <div
                    key={name}
                    aria-disabled="true"
                    className="cursor-not-allowed select-none rounded-lg px-3 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <p className="min-w-0 flex-1 truncate text-sm text-grey-300">{name}</p>
                      <ComingSoonBadge />
                      <Lock className="h-3.5 w-3.5 shrink-0 text-grey-300" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* navigation */}
            <nav className="mt-4 flex flex-1 flex-col gap-1 border-t border-grey-300/40 pt-4">
              {NAV.map(({ to, label, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-pink-50 text-pink-600'
                        : 'text-grey-600 hover:bg-pink-50/60 hover:text-pink-600',
                    )
                  }
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </NavLink>
              ))}
              <div
                aria-disabled="true"
                className="flex cursor-not-allowed select-none items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-grey-300"
              >
                <ClipboardCheck className="h-4 w-4" />
                <span className="min-w-0 flex-1">เช็คชื่อ</span>
                <ComingSoonBadge />
                <Lock className="h-3.5 w-3.5 shrink-0" />
              </div>
            </nav>

            {/* SPU E-learning info */}
            <div className="mt-auto pt-4 border-t border-grey-300/40">
              <div className="rounded-xl border border-grey-300/50 bg-canvas px-3 py-2.5">
                <div className="flex items-center gap-2 text-xs text-grey-600">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-pink-600" />
                  <span>เชื่อมต่อกับ SPU e-Learning</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}
