import { Moon, Sun } from 'lucide-react'
import { useDarkMode } from '@/hooks/useDarkMode'
import { cn } from '@/lib/utils'

interface DarkModeToggleProps {
  className?: string
}

export default function DarkModeToggle({ className }: DarkModeToggleProps) {
  const { dark, toggle } = useDarkMode()

  return (
    <button
      onClick={toggle}
      aria-label={dark ? 'เปลี่ยนเป็นโหมดสว่าง' : 'เปลี่ยนเป็นโหมดมืด'}
      className={cn(
        'relative flex h-8 w-8 items-center justify-center rounded-full',
        'bg-grey-100 text-grey-600 hover:bg-pink-100 hover:text-pink-600',
        'dark:bg-white/10 dark:text-grey-400 dark:hover:bg-pink-500/20 dark:hover:text-pink-300',
        'transition-all duration-200',
        className,
      )}
    >
      {/* Sun */}
      <Sun
        className={cn(
          'absolute h-4 w-4 transition-all duration-300',
          dark ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100',
        )}
      />
      {/* Moon */}
      <Moon
        className={cn(
          'absolute h-4 w-4 transition-all duration-300',
          dark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0',
        )}
      />
    </button>
  )
}
