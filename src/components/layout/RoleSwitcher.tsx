import { useNavigate } from 'react-router-dom'
import { GraduationCap, Presentation } from 'lucide-react'
import { useApp, type Role } from '@/context/AppContext'
import { cn } from '@/lib/utils'

const OPTIONS: { role: Role; label: string; icon: typeof Presentation; to: string }[] = [
  { role: 'teacher', label: 'อาจารย์', icon: Presentation, to: '/teacher' },
  { role: 'student', label: 'นักศึกษา', icon: GraduationCap, to: '/student' },
]

export default function RoleSwitcher() {
  const { role, setRole } = useApp()
  const navigate = useNavigate()

  return (
    <div className="inline-flex items-center gap-1 rounded-full bg-pink-50 p-1">
      {OPTIONS.map(({ role: value, label, icon: Icon, to }) => (
        <button
          key={value}
          type="button"
          onClick={() => {
            setRole(value)
            navigate(to)
          }}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
            role === value
              ? 'bg-pink-600 text-paper'
              : 'text-grey-600 hover:text-pink-600',
          )}
        >
          <Icon className="h-4 w-4" />
          {label}
        </button>
      ))}
    </div>
  )
}
