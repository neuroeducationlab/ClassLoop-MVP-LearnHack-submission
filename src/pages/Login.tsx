import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useApp } from '@/context/AppContext'

export default function Login() {
  const { setRole } = useApp()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current)
    },
    [],
  )

  const signIn = () => {
    if (loading) return
    setLoading(true)
    setRole('teacher')
    timer.current = setTimeout(() => navigate('/teacher'), 800)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas p-6">
      <div className="w-full max-w-sm rounded-2xl border border-grey-300/60 bg-paper p-10 text-center shadow-sm">
        <p className="text-5xl font-extrabold tracking-tight text-grey-300">SPU</p>
        <h1 className="mt-1 text-3xl font-bold text-pink-600">ClassLoop</h1>
        <p className="mt-3 text-sm text-grey-600">ผู้ช่วย AI สำหรับออกแบบคาบเรียน Active Learning</p>

        <button
          type="button"
          onClick={signIn}
          disabled={loading}
          className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-pink-600 px-4 py-3 text-sm font-semibold text-paper transition-colors hover:bg-pink-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:ring-offset-2 disabled:opacity-80"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบด้วย SPU Account'}
        </button>

        <p className="mt-5 text-xs text-grey-600">สำหรับบุคลากรและนักศึกษามหาวิทยาลัยศรีปทุม</p>
      </div>
    </div>
  )
}
