import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertCircle, BookOpen, GraduationCap, Loader2, Lock, Mail } from 'lucide-react'
import LanguageSwitcher from '@/components/layout/LanguageSwitcher'
import { DEMO_ACCOUNTS, useApp } from '@/context/AppContext'
import { cn } from '@/lib/utils'

export default function Login() {
  const { signIn } = useApp()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedRole, setSelectedRole] = useState<'none' | 'teacher' | 'student'>('none')
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current)
    },
    [],
  )

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (loading) return

    if (!email.trim() || !password) {
      setError('กรุณากรอกอีเมลและรหัสผ่าน')
      return
    }

    const result = signIn(email, password)
    if (!result.ok) {
      setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง')
      return
    }

    setError(null)
    setLoading(true)
    timer.current = setTimeout(
      () => navigate(result.role === 'teacher' ? '/teacher' : '/student'),
      800,
    )
  }

  const fill = (accEmail: string, accPassword: string) => {
    setEmail(accEmail)
    setPassword(accPassword)
    setError(null)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-canvas p-6">
      <div className="w-full max-w-sm">
        {/* Language switch lives here too — a non-Thai reader must be able to
            change language before they can even sign in. */}
        <div className="mb-5 flex justify-center">
          <LanguageSwitcher />
        </div>

        {/* Logo */}
        <div className="mb-7 text-center">
          <p className="text-5xl font-extrabold tracking-tight text-grey-300">SPU</p>
          <h1 className="mt-1 text-3xl font-bold text-pink-600">ClassLoop</h1>
        </div>

        {selectedRole === 'none' ? (
          <div className="space-y-4 animate-fadeIn">
            <h2 className="text-center text-lg font-bold text-ink mb-6">กรุณาเลือกสถานะของคุณ</h2>
            
            <button
              onClick={() => setSelectedRole('teacher')}
              className="flex w-full items-center gap-4 rounded-3xl border-2 border-grey-300/60 bg-paper p-5 transition-all hover:border-pink-500 hover:bg-pink-50/40 hover:shadow-md cursor-pointer group"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-100 text-pink-600 group-hover:scale-110 transition-transform shadow-xs">
                <BookOpen className="h-7 w-7" />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-extrabold text-ink group-hover:text-pink-600 transition-colors">อาจารย์ผู้สอน</h3>
                <p className="text-sm text-grey-600 mt-1 font-medium">เข้าสู่ระบบจัดการและสร้างสื่อการสอน</p>
              </div>
            </button>

            <button
              onClick={() => setSelectedRole('student')}
              className="flex w-full items-center gap-4 rounded-3xl border-2 border-grey-300/60 bg-paper p-5 transition-all hover:border-blue-500 hover:bg-blue-50/40 hover:shadow-md cursor-pointer group"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 group-hover:scale-110 transition-transform shadow-xs">
                <GraduationCap className="h-7 w-7" />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-extrabold text-ink group-hover:text-blue-600 transition-colors">นักศึกษา</h3>
                <p className="text-sm text-grey-600 mt-1 font-medium">เข้าเรียน ทำกิจกรรม และทบทวนบทเรียน</p>
              </div>
            </button>
          </div>
        ) : (
          <div className="animate-fadeIn">
            <button 
              onClick={() => setSelectedRole('none')}
              className="mb-4 text-sm font-bold text-grey-500 hover:text-pink-600 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              ← ย้อนกลับ
            </button>
            <form
              onSubmit={submit}
              className="space-y-4 rounded-3xl border border-grey-300/60 bg-paper p-6 shadow-sm"
            >
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-ink">
              อีเมล
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-grey-400" />
              <input
                id="email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setError(null)
                }}
                placeholder="you@spu.ac.th"
                className="w-full rounded-xl border border-grey-300/80 bg-canvas py-2.5 pl-10 pr-3 text-sm text-ink outline-none transition-all focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-ink">
              รหัสผ่าน
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-grey-400" />
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError(null)
                }}
                placeholder="••••••••"
                className="w-full rounded-xl border border-grey-300/80 bg-canvas py-2.5 pl-10 pr-3 text-sm text-ink outline-none transition-all focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
              />
            </div>
          </div>

          {error && (
            <p
              role="alert"
              className="flex items-center gap-1.5 rounded-lg bg-pink-50 px-3 py-2 text-sm font-medium text-pink-600"
            >
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-pink-600 py-3 text-sm font-bold text-paper shadow-sm transition-all hover:bg-pink-500 active:scale-[0.98] disabled:opacity-80"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
          </button>
        </form>

        {/* Demo credentials — visible on purpose so the audience can sign in */}
        <div className="mt-4 rounded-2xl border border-pink-200 bg-pink-50/60 p-4">
          <p className="text-xs font-semibold text-grey-600">
            บัญชีสำหรับเดโม (คลิกเพื่อกรอกอัตโนมัติ)
          </p>
          <div className="mt-2 space-y-2">
            {DEMO_ACCOUNTS.filter(acc => acc.role === selectedRole).map((acc) => (
              <button
                key={acc.email}
                type="button"
                onClick={() => fill(acc.email, acc.password)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-xl border border-pink-200 bg-paper px-3 py-2.5 text-left transition-all',
                  'hover:border-pink-400 hover:shadow-sm active:scale-[0.98]',
                )}
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-pink-600 text-paper">
                  {acc.role === 'teacher' ? (
                    <BookOpen className="h-4 w-4" />
                  ) : (
                    <GraduationCap className="h-4 w-4" />
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-bold text-ink">
                    {acc.role === 'teacher' ? 'อาจารย์ / ผู้สอน' : 'นักเรียน / นักศึกษา'}
                  </span>
                  <span className="block truncate font-mono text-[11px] text-grey-600">
                    {acc.email} · {acc.password}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>

        <p className="mt-5 text-center text-xs text-grey-600">
          สำหรับบุคลากรและนักศึกษามหาวิทยาลัยศรีปทุม
        </p>
          </div>
        )}
      </div>
    </div>
  )
}
