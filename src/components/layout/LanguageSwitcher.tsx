import { Globe } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { cn } from '@/lib/utils'

export default function LanguageSwitcher() {
  const { lang, setLang } = useApp()

  return (
    <div className="inline-flex items-center rounded-full bg-pink-50/80 p-0.5 border border-pink-200 shadow-2xs">
      <button
        type="button"
        onClick={() => setLang('th')}
        className={cn(
          'flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold transition-all cursor-pointer',
          lang === 'th'
            ? 'bg-pink-600 text-white shadow-2xs'
            : 'text-grey-600 hover:text-pink-600'
        )}
      >
        <span>TH</span>
      </button>
      <button
        type="button"
        onClick={() => setLang('en')}
        className={cn(
          'flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold transition-all cursor-pointer',
          lang === 'en'
            ? 'bg-pink-600 text-white shadow-2xs'
            : 'text-grey-600 hover:text-pink-600'
        )}
      >
        <Globe className="h-3 w-3" />
        <span>EN</span>
      </button>
    </div>
  )
}
