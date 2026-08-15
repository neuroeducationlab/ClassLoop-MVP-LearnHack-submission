import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, GraduationCap, Loader2 } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { cn } from '@/lib/utils'

type RoleChoice = 'teacher' | 'student' | null

export default function Login() {
  const { setRole } = useApp()
  const navigate = useNavigate()
  const [loading, setLoading] = useState<RoleChoice>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current)
    },
    [],
  )

  const signIn = (role: 'teacher' | 'student') => {
    if (loading) return
    setLoading(role)
    setRole(role)
    timer.current = setTimeout(() => navigate(role === 'teacher' ? '/teacher' : '/student'), 800)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-canvas p-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <p className="text-5xl font-extrabold tracking-tight text-grey-300">SPU</p>
          <h1 className="mt-1 text-3xl font-bold text-pink-600">ClassLoop</h1>
          <p className="mt-2 text-sm text-grey-600">ผู้ช่วย AI สำหรับออกแบบคาบเรียน Active Learning</p>
        </div>

        {/* Login cards */}
        <div className="space-y-3">
          {/* Teacher button */}
          <button
            type="button"
            onClick={() => signIn('teacher')}
            disabled={!!loading}
            className={cn(
              'group relative flex w-full items-center gap-4 rounded-2xl border-2 border-transparent bg-paper p-5 text-left shadow-sm transition-all',
              'hover:border-pink-400 hover:shadow-md active:scale-[0.98]',
              loading === 'teacher' && 'border-pink-500 opacity-80',
            )}
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-pink-600 text-white shadow-sm">
              {loading === 'teacher' ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <BookOpen className="h-6 w-6" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-base font-bold text-ink">อาจารย์ / ผู้สอน</p>
              <p className="text-xs text-grey-600 mt-0.5">
                {loading === 'teacher' ? 'กำลังเข้าสู่ระบบ...' : 'จัดการคาบเรียน ออกข้อสอบ ดูผลลัพธ์'}
              </p>
            </div>
            <div className="text-grey-300 group-hover:text-pink-500 transition-colors">
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
              </svg>
            </div>
          </button>

          {/* Student button */}
          <button
            type="button"
            onClick={() => signIn('student')}
            disabled={!!loading}
            className={cn(
              'group relative flex w-full items-center gap-4 rounded-2xl border-2 border-transparent bg-paper p-5 text-left shadow-sm transition-all',
              'hover:border-pink-400 hover:shadow-md active:scale-[0.98]',
              loading === 'student' && 'border-pink-500 opacity-80',
            )}
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-pink-50 border-2 border-pink-200 text-pink-600">
              {loading === 'student' ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <GraduationCap className="h-6 w-6" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-base font-bold text-ink">นักเรียน / นักศึกษา</p>
              <p className="text-xs text-grey-600 mt-0.5">
                {loading === 'student' ? 'กำลังเข้าสู่ระบบ...' : 'เข้าร่วมเกม ทำแบบทดสอบ ดูคะแนน'}
              </p>
            </div>
            <div className="text-grey-300 group-hover:text-pink-500 transition-colors">
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
              </svg>
            </div>
          </button>
        </div>

        <p className="mt-6 text-center text-xs text-grey-600">
          สำหรับบุคลากรและนักศึกษามหาวิทยาลัยศรีปทุม
        </p>
      </div>
    </div>
  )
}
