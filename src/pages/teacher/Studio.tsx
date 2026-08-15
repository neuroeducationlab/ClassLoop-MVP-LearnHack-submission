import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BookOpen,
  Brain,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  Eye,
  EyeOff,
  FileCheck,
  FileText,
  HelpCircle,
  Lightbulb,
  Layers,
  Package,
  Radio,
  Sparkles,
  Upload,
  Users,
  Zap,
  X,
  MessageSquare,
  RotateCw,
} from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { cn } from '@/lib/utils'
import type { ActivityFormat, PretestQuestion } from '@/data/seed-data'

export default function Studio() {
  const navigate = useNavigate()
  const { topics, generatedContent, startGeneration, isGenerating, setActiveActivity } = useApp()

  // Left Panel Input State
  const [usingSampleSyllabus, setUsingSampleSyllabus] = useState(false)
  const [selectedTopicId, setSelectedTopicId] = useState<string>(
    topics[1]?.id || 't2'
  )
  const [studentCount, setStudentCount] = useState<number>(24)
  const [fileName, setFileName] = useState<string | null>(null)
  
  const allFaculties = [
    { id: 'Accounting', name: 'การบัญชี (Accounting)' },
    { id: 'Communication Arts', name: 'นิเทศศาสตร์ (Comm Arts)' },
    { id: 'Engineering', name: 'วิศวกรรมศาสตร์ (Engineering)' },
    { id: 'Business Admin', name: 'บริหารธุรกิจ (Business Admin)' },
    { id: 'Digital Media', name: 'ดิจิทัลมีเดีย (Digital Media)' },
  ]
  
  const [selectedFaculties, setSelectedFaculties] = useState<string[]>(
    allFaculties.map((f) => f.id)
  )

  // Right Panel & Flow State
  const [hasGenerated, setHasGenerated] = useState(true)
  const [activeTab, setActiveTab] = useState<'activities' | 'flashcards' | 'pretest'>('activities')

  // Cycling Loader & Progress State
  const [generationStep, setGenerationStep] = useState(0)
  const [progressPercent, setProgressPercent] = useState(0)

  // Interactive Card States
  const [openWhyItWorks, setOpenWhyItWorks] = useState<Record<number, boolean>>({
    0: true,
    1: false,
    2: false,
  })
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({})
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({})

  // Toast Notification State
  const [toastMsg, setToastMsg] = useState<string | null>(null)

  // Selected topic metadata
  const currentTopic = topics.find((t) => t.id === selectedTopicId) || topics[1] || topics[0]

  // Auto fill sample syllabus handler
  const handleUseSampleSyllabus = () => {
    setUsingSampleSyllabus(true)
    setFileName('Course_Syllabus_PIBM3301_2026.pdf')
    setSelectedTopicId(topics[1]?.id || 't2') // Hofstede's Cultural Dimensions
    setStudentCount(24)
    setSelectedFaculties(allFaculties.map((f) => f.id))
  }

  // Toggle faculty chip selection
  const toggleFaculty = (id: string) => {
    if (selectedFaculties.includes(id)) {
      if (selectedFaculties.length > 1) {
        setSelectedFaculties(selectedFaculties.filter((f) => f !== id))
      }
    } else {
      setSelectedFaculties([...selectedFaculties, id])
    }
  }

  // Click handler for "สร้างสื่อการสอน"
  const handleGenerate = () => {
    setHasGenerated(true)
    startGeneration()
    setGenerationStep(0)
    setProgressPercent(0)
  }

  // Progress Bar & Step Cycling effect (3 seconds total, 750ms per step)
  useEffect(() => {
    let progressInterval: ReturnType<typeof setInterval>

    if (isGenerating) {
      const startTime = Date.now()
      const totalDuration = 3000

      progressInterval = setInterval(() => {
        const elapsed = Date.now() - startTime
        const pct = Math.min(100, Math.floor((elapsed / totalDuration) * 100))
        setProgressPercent(pct)
        
        // 4 steps at 0ms, 750ms, 1500ms, 2250ms
        if (elapsed < 750) setGenerationStep(0)
        else if (elapsed < 1500) setGenerationStep(1)
        else if (elapsed < 2250) setGenerationStep(2)
        else setGenerationStep(3)
      }, 50)
    } else if (hasGenerated) {
      setProgressPercent(100)
    }

    return () => {
      if (progressInterval) clearInterval(progressInterval)
    }
  }, [isGenerating, hasGenerated])

  // Toast trigger helper
  const showToast = (msg: string) => {
    setToastMsg(msg)
    setTimeout(() => {
      setToastMsg((current) => (current === msg ? null : current))
    }, 3200)
  }

  const generationStepTexts = [
    'กำลังวิเคราะห์ syllabus...',
    'กำลังออกแบบกิจกรรม...',
    'กำลังสร้าง flashcards...',
    'กำลังสร้างข้อสอบ...',
  ]

  const getFormatBadge = (format: ActivityFormat) => {
    switch (format) {
      case 'debate':
        return { label: 'Debate', icon: MessageSquare, class: 'bg-purple-100 text-purple-700 border-purple-200' }
      case 'case-based':
        return { label: 'Case-based', icon: BookOpen, class: 'bg-blue-100 text-blue-700 border-blue-200' }
      case 'quick-game':
        return { label: 'Quick Game', icon: Zap, class: 'bg-amber-100 text-amber-700 border-amber-200' }
      default:
        return { label: format, icon: Sparkles, class: 'bg-grey-100 text-grey-700 border-grey-200' }
    }
  }

  const getDifficultyBadge = (difficulty: PretestQuestion['difficulty']) => {
    // Strictly following prompt specification:
    // NO green/red! Use pink intensity:
    // ง่าย = pink-50 chip
    // ปานกลาง = pink-300
    // ยาก = pink-600 white text
    switch (difficulty) {
      case 'easy':
        return { label: 'ง่าย', class: 'bg-pink-50 text-pink-600 border border-pink-200 font-medium' }
      case 'medium':
        return { label: 'ปานกลาง', class: 'bg-pink-300 text-ink border border-pink-400 font-medium' }
      case 'hard':
        return { label: 'ยาก', class: 'bg-pink-600 text-white font-semibold shadow-xs' }
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col gap-1 border-b border-grey-300/40 pb-4">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-pink-50 p-1.5 text-pink-600">
            <Sparkles className="h-5 w-5" />
          </span>
          <h1 className="text-2xl font-bold text-ink">Syllabus Studio</h1>
        </div>
        <p className="text-sm text-grey-600">
          อัปโหลด Course Syllabus เพื่อสร้างกิจกรรมการเรียนรู้, Flashcards และ Pre-test สำหรับห้องเรียนข้ามคณะอัตโนมัติ
        </p>
      </div>

      {/* Main Grid: Left Panel (40%) & Right Panel (60%) */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        
        {/* LEFT PANEL (40%) */}
        <div className="w-full shrink-0 space-y-5 rounded-2xl border border-grey-300/60 bg-paper p-5 shadow-xs lg:w-[40%]">
          
          {/* Dropzone */}
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-grey-600">
               Course Syllabus
            </label>
            <div
              onClick={() => {
                setFileName('Course_Syllabus_PIBM3301.pdf')
              }}
              className={cn(
                'group relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition-all cursor-pointer',
                fileName
                  ? 'border-pink-500 bg-pink-50/40'
                  : 'border-pink-300/80 bg-pink-50/20 hover:border-pink-500 hover:bg-pink-50/50'
              )}
            >
              {fileName ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-pink-100 text-pink-600">
                    <FileCheck className="h-6 w-6" />
                  </div>
                  <span className="text-sm font-semibold text-ink">{fileName}</span>
                  <span className="text-xs text-pink-600 font-medium">พร้อมใช้งานแล้ว</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100/70 text-pink-600 group-hover:scale-110 transition-transform">
                    <Upload className="h-5 w-5" />
                  </div>
                  <p className="text-sm font-medium text-ink">
                    ลากไฟล์ Course Syllabus มาวางที่นี่
                  </p>
                  <p className="text-xs text-grey-600">รองรับ PDF, DOCX, TXT (สูงสุด 20MB)</p>
                </div>
              )}
            </div>
          </div>

          {/* Prominent Sample Syllabus Button */}
          <button
            type="button"
            onClick={handleUseSampleSyllabus}
            className={cn(
              'flex w-full items-center justify-center gap-2 rounded-xl border py-2.5 px-4 text-sm font-medium transition-all shadow-xs',
              usingSampleSyllabus
                ? 'border-pink-500 bg-pink-50 text-pink-600 ring-2 ring-pink-500/20'
                : 'border-grey-300/80 bg-canvas text-ink hover:border-pink-300 hover:bg-pink-50/30'
            )}
          >
            {usingSampleSyllabus ? (
              <>
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-pink-600 text-white">
                  <Check className="h-3.5 w-3.5" />
                </span>
                <span>ใช้ syllabus ตัวอย่าง (PIBM) แล้ว</span>
              </>
            ) : (
              <>
                <FileText className="h-4 w-4 text-pink-600" />
                <span>ใช้ syllabus ตัวอย่าง (PIBM)</span>
              </>
            )}
          </button>

          <hr className="border-grey-300/40" />

          {/* Topic Picker Dropdown */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-grey-600">
              หัวข้อบทเรียน (Topic)
            </label>
            <select
              value={selectedTopicId}
              onChange={(e) => setSelectedTopicId(e.target.value)}
              className="w-full rounded-xl border border-grey-300/80 bg-paper px-3.5 py-2.5 text-sm font-medium text-ink outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all cursor-pointer"
            >
              {topics.map((t) => (
                <option key={t.id} value={t.id}>
                  สัปดาห์ที่ {t.week}: {t.title}
                </option>
              ))}
            </select>
            {currentTopic && (
              <p className="rounded-lg bg-canvas p-2.5 text-xs text-grey-600 border border-grey-300/40">
                <strong className="text-ink">วัตถุประสงค์: </strong>
                {currentTopic.learningObjective}
              </p>
            )}
          </div>

          {/* Number of Students Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-grey-600">
              จำนวนนักศึกษา
            </label>
            <div className="relative">
              <input
                type="number"
                min={1}
                max={200}
                value={studentCount}
                onChange={(e) => setStudentCount(Number(e.target.value))}
                className="w-full rounded-xl border border-grey-300/80 bg-paper pl-10 pr-4 py-2.5 text-sm font-medium text-ink outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all"
              />
              <Users className="absolute left-3.5 top-3 h-4 w-4 text-grey-600" />
            </div>
          </div>

          {/* Faculty Chips */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold uppercase tracking-wider text-grey-600">
                คณะที่มาเรียน ({selectedFaculties.length} คณะ)
              </label>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {allFaculties.map((f) => {
                const isSelected = selectedFaculties.includes(f.id)
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => toggleFaculty(f.id)}
                    className={cn(
                      'rounded-full px-3 py-1 text-xs font-medium transition-all border',
                      isSelected
                        ? 'border-pink-500 bg-pink-50 text-pink-600 font-semibold shadow-2xs'
                        : 'border-grey-300/60 bg-canvas text-grey-600 hover:border-grey-300'
                    )}
                  >
                    {f.name}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Big Pink Generate Button */}
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-pink-600 py-3.5 px-6 text-base font-semibold text-white shadow-md shadow-pink-600/20 hover:bg-pink-600/90 active:scale-[0.99] disabled:opacity-50 transition-all cursor-pointer mt-4"
          >
            <Sparkles className="h-5 w-5 animate-pulse" />
            <span>สร้างสื่อการสอน</span>
          </button>
        </div>

        {/* RIGHT PANEL (60%) */}
        <div className="w-full flex-1 lg:w-[60%]">

          {/* STATE 1: Skeleton Loader with Cycling Text */}
          {isGenerating && (
            <div className="space-y-6 rounded-2xl border border-grey-300/60 bg-paper p-6 shadow-xs">
              {/* Cycling Status Header */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-pink-500 opacity-75"></span>
                      <span className="relative inline-flex h-3 w-3 rounded-full bg-pink-600"></span>
                    </span>
                    <span className="text-base font-bold text-ink">
                      {generationStepTexts[generationStep]}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-pink-600">
                    {progressPercent}%
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-grey-300/30">
                  <div
                    className="h-full rounded-full bg-pink-600 transition-all duration-150 ease-out"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Skeleton UI Placeholders */}
              <div className="space-y-4 pt-2">
                <div className="flex gap-2 border-b border-grey-300/40 pb-3">
                  <div className="h-9 w-24 animate-pulse rounded-lg bg-grey-300/40" />
                  <div className="h-9 w-28 animate-pulse rounded-lg bg-grey-300/30" />
                  <div className="h-9 w-24 animate-pulse rounded-lg bg-grey-300/30" />
                </div>

                <div className="space-y-4">
                  {[1, 2, 3].map((n) => (
                    <div
                      key={n}
                      className="space-y-3 rounded-xl border border-grey-300/40 p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="h-5 w-48 animate-pulse rounded-md bg-grey-300/40" />
                        <div className="h-5 w-16 animate-pulse rounded-full bg-pink-100" />
                      </div>
                      <div className="h-3.5 w-full animate-pulse rounded-md bg-grey-300/20" />
                      <div className="h-3.5 w-3/4 animate-pulse rounded-md bg-grey-300/20" />
                      <div className="flex justify-end pt-2">
                        <div className="h-8 w-28 animate-pulse rounded-lg bg-pink-200" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STATE 2: Initial Prompt State (before generating for first time) */}
          {!hasGenerated && !isGenerating && (
            <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-dashed border-grey-300/80 bg-paper p-8 text-center shadow-2xs">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-pink-50 text-pink-600 shadow-inner">
                <Sparkles className="h-8 w-8" />
              </div>
              <h2 className="mt-4 text-xl font-bold text-ink">พร้อมสร้างสื่อการสอน</h2>
              <p className="mt-2 max-w-md text-sm text-grey-600">
                คลิกปุ่ม <strong className="text-pink-600">"สร้างสื่อการสอน"</strong> ทางด้านซ้าย
                เพื่อวิเคราะห์ syllabus และสร้างกิจกรรมการสอน, Flashcards และ Pre-test
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2 text-xs font-medium text-grey-600">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-canvas px-3 py-1.5 border border-grey-300/40">
                  <Sparkles className="h-3.5 w-3.5 text-pink-600" />
                  <span>3 กิจกรรมเรียนรู้</span>
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-canvas px-3 py-1.5 border border-grey-300/40 font-mono">
                  <Layers className="h-3.5 w-3.5 text-pink-600" />
                  <span>8 Flashcards</span>
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-canvas px-3 py-1.5 border border-grey-300/40">
                  <FileText className="h-3.5 w-3.5 text-pink-600" />
                  <span>5 ข้อสอบลองสอบ</span>
                </span>
              </div>
            </div>
          )}

          {/* STATE 3: Revealed Results (After 3 Seconds Generation) */}
          {hasGenerated && !isGenerating && (
            <div className="space-y-6">
              
              {/* Tabs Navigation */}
              <div className="flex items-center gap-1 rounded-xl border border-grey-300/60 bg-paper p-1.5 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setActiveTab('activities')}
                  className={cn(
                    'flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-semibold transition-all cursor-pointer',
                    activeTab === 'activities'
                      ? 'bg-pink-600 text-white shadow-xs'
                      : 'text-grey-600 hover:bg-pink-50/50 hover:text-pink-600'
                  )}
                >
                  <Sparkles className="h-4 w-4" />
                  <span>กิจกรรม</span>
                  <span className={cn(
                    'rounded-full px-1.5 py-0.5 text-xs font-bold',
                    activeTab === 'activities' ? 'bg-white/20 text-white' : 'bg-pink-100 text-pink-600'
                  )}>
                    {generatedContent.activities.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('flashcards')}
                  className={cn(
                    'flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-semibold transition-all cursor-pointer',
                    activeTab === 'flashcards'
                      ? 'bg-pink-600 text-white shadow-xs'
                      : 'text-grey-600 hover:bg-pink-50/50 hover:text-pink-600'
                  )}
                >
                  <Layers className="h-4 w-4" />
                  <span>Flashcards</span>
                  <span className={cn(
                    'rounded-full px-1.5 py-0.5 text-xs font-bold',
                    activeTab === 'flashcards' ? 'bg-white/20 text-white' : 'bg-pink-100 text-pink-600'
                  )}>
                    {generatedContent.flashcards.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('pretest')}
                  className={cn(
                    'flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-semibold transition-all cursor-pointer',
                    activeTab === 'pretest'
                      ? 'bg-pink-600 text-white shadow-xs'
                      : 'text-grey-600 hover:bg-pink-50/50 hover:text-pink-600'
                  )}
                >
                  <FileText className="h-4 w-4" />
                  <span>ลองสอบ</span>
                  <span className={cn(
                    'rounded-full px-1.5 py-0.5 text-xs font-bold',
                    activeTab === 'pretest' ? 'bg-white/20 text-white' : 'bg-pink-100 text-pink-600'
                  )}>
                    {generatedContent.pretest.length}
                  </span>
                </button>
              </div>

              {/* TAB 1: กิจกรรม (Activities) */}
              {activeTab === 'activities' && (
                <div className="space-y-5">
                  {generatedContent.activities.map((act, idx) => {
                    const formatBadge = getFormatBadge(act.format)
                    const FormatIcon = formatBadge.icon
                    const isWhyOpen = openWhyItWorks[idx] ?? false

                    return (
                      <div
                        key={idx}
                        className="rounded-2xl border border-grey-300/60 bg-paper p-5 shadow-2xs hover:shadow-xs transition-all space-y-4"
                      >
                        {/* Heading & Chips */}
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <h3 className="text-lg font-bold text-ink flex items-center gap-2">
                            <span>{act.name}</span>
                          </h3>
                          <div className="flex items-center gap-2">
                            <span className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium border', formatBadge.class)}>
                              <FormatIcon className="h-3 w-3" />
                              {formatBadge.label}
                            </span>
                            <span className="inline-flex items-center gap-1 rounded-full bg-pink-50 px-2.5 py-0.5 text-xs font-semibold text-pink-600 border border-pink-200">
                              <Clock className="h-3 w-3" />
                              {act.durationMin} นาที
                            </span>
                          </div>
                        </div>

                        {/* Steps List */}
                        <div className="space-y-2">
                          <p className="text-xs font-semibold text-grey-600 uppercase tracking-wider">
                            ขั้นตอนกิจกรรม ({act.steps.length} ขั้นตอน)
                          </p>
                          <ol className="space-y-2">
                            {act.steps.map((step, sIdx) => (
                              <li key={sIdx} className="flex items-start gap-2.5 text-sm text-ink">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-pink-100 text-xs font-bold text-pink-600 mt-0.5">
                                  {sIdx + 1}
                                </span>
                                <span>{step}</span>
                              </li>
                            ))}
                          </ol>
                        </div>

                        {/* Collapsible "ทำไมถึงเวิร์ก" */}
                        <div className="rounded-xl border border-grey-300/40 bg-canvas overflow-hidden">
                          <button
                            type="button"
                            onClick={() =>
                              setOpenWhyItWorks((prev) => ({
                                ...prev,
                                [idx]: !prev[idx],
                              }))
                            }
                            className="flex w-full items-center justify-between px-4 py-2.5 text-xs font-semibold text-ink hover:bg-grey-300/10 transition-colors"
                          >
                            <span className="flex items-center gap-1.5 text-pink-600">
                              <Brain className="h-4 w-4" />
                              <span>ทำไมถึงเวิร์ก</span>
                            </span>
                            {isWhyOpen ? (
                              <ChevronUp className="h-4 w-4 text-grey-600" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-grey-600" />
                            )}
                          </button>

                          {isWhyOpen && (
                            <div className="px-4 pb-3 pt-1 text-xs text-grey-600 space-y-2 border-t border-grey-300/30">
                              <p className="leading-relaxed text-ink/90">{act.whyItWorks}</p>
                              {act.materialsNeeded && (
                                <p className="text-xs text-grey-600 pt-1 flex items-center gap-1.5">
                                  <Package className="h-3.5 w-3.5 text-pink-600 shrink-0" />
                                  <span><strong className="text-ink">สื่อที่ใช้: </strong>{act.materialsNeeded}</span>
                                </p>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Action Button: "ใช้กิจกรรมนี้" */}
                        <div className="flex justify-end pt-1">
                          <button
                            type="button"
                            onClick={() => {
                              setActiveActivity(act)
                              showToast(`พร้อมเริ่มกิจกรรม "${act.name}" ในคาบแล้ว!`)
                            }}
                            className="flex items-center gap-1.5 rounded-xl bg-pink-600 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-pink-600/90 active:scale-[0.98] transition-all cursor-pointer"
                          >
                            <Check className="h-4 w-4" />
                            <span>ใช้กิจกรรมนี้</span>
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* TAB 2: Flashcards (8 Grid Cards with 3D Flip) */}
              {activeTab === 'flashcards' && (
                <div className="space-y-3">
                  <p className="text-xs text-grey-600 flex items-center gap-1">
                    <RotateCw className="h-3.5 w-3.5 text-pink-600" />
                    <span>คลิกที่การ์ดเพื่อพลิกดูคำอธิบาย (Flashcard Flip)</span>
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {generatedContent.flashcards.map((card, idx) => {
                      const isFlipped = flippedCards[idx] ?? false

                      return (
                        <div key={idx} className="flex flex-col space-y-2">
                          {/* 3D Flip Container */}
                          <div
                            onClick={() =>
                              setFlippedCards((prev) => ({
                                ...prev,
                                [idx]: !prev[idx],
                              }))
                            }
                            className="perspective-1000 h-44 w-full cursor-pointer select-none"
                          >
                            <div
                              className={cn(
                                'relative h-full w-full rounded-2xl transition-transform duration-500 transform-style-3d shadow-xs hover:shadow-md border border-grey-300/60',
                                isFlipped ? 'rotate-y-180 bg-pink-50/60' : 'bg-paper'
                              )}
                            >
                              {/* FRONT FACE */}
                              <div className="backface-hidden absolute inset-0 flex flex-col justify-between p-4 rounded-2xl bg-paper">
                                <div className="flex items-start justify-between">
                                  <span className="rounded-md bg-pink-50 p-1.5 text-pink-600 text-xs font-bold">
                                    #{idx + 1}
                                  </span>
                                  <span className="text-[10px] font-semibold uppercase tracking-wider text-pink-600 bg-pink-50 px-2 py-0.5 rounded-full">
                                    Front
                                  </span>
                                </div>
                                <h4 className="text-center font-bold text-ink text-sm leading-snug my-auto px-1">
                                  {card.front}
                                </h4>
                                <div className="flex items-center justify-center gap-1 text-[11px] font-medium text-pink-600">
                                  <RotateCw className="h-3 w-3" />
                                  <span>แตะเพื่อพลิก</span>
                                </div>
                              </div>

                              {/* BACK FACE */}
                              <div className="backface-hidden rotate-y-180 absolute inset-0 flex flex-col justify-between p-4 rounded-2xl bg-pink-50/90 text-ink">
                                <div className="flex items-start justify-between">
                                  <span className="text-[10px] font-semibold uppercase tracking-wider text-pink-600 bg-paper px-2 py-0.5 rounded-full border border-pink-200">
                                    Back
                                  </span>
                                  <RotateCw className="h-3.5 w-3.5 text-pink-600" />
                                </div>
                                <p className="text-xs text-center font-medium leading-relaxed my-auto text-ink">
                                  {card.back}
                                </p>
                                <span className="text-[10px] text-center text-grey-600 font-medium">
                                  แตะเพื่อพลิกกลับ
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Hint text shown below each when flipped */}
                          {isFlipped && (
                            <div className="rounded-lg bg-pink-50 p-2 text-xs text-pink-600 border border-pink-200 flex items-start gap-1.5 animate-fadeIn">
                              <Lightbulb className="h-3.5 w-3.5 shrink-0 mt-0.5 text-pink-600" />
                              <span><strong>Hint:</strong> {card.hint}</span>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* TAB 3: Pre-test (5 Questions) */}
              {activeTab === 'pretest' && (
                <div className="space-y-4">
                  {generatedContent.pretest.map((q, qIdx) => {
                    const diffBadge = getDifficultyBadge(q.difficulty)
                    const isRevealed = revealedAnswers[q.id] ?? false

                    return (
                      <div
                        key={q.id}
                        className="rounded-2xl border border-grey-300/60 bg-paper p-5 shadow-2xs space-y-4"
                      >
                        {/* Question Header & Difficulty Chip */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-2.5">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-pink-600 text-xs font-bold text-white mt-0.5">
                              {qIdx + 1}
                            </span>
                            <h4 className="text-base font-bold text-ink leading-snug">
                              {q.stem}
                            </h4>
                          </div>

                          {/* Difficulty chip strictly using pink intensity */}
                          <span className={cn('shrink-0 rounded-full px-3 py-1 text-xs', diffBadge.class)}>
                            {diffBadge.label}
                          </span>
                        </div>

                        {/* Options Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                          {q.options.map((opt, optIdx) => {
                            const isCorrectChoice = optIdx === q.answerIndex
                            return (
                              <div
                                key={optIdx}
                                className={cn(
                                  'flex items-center gap-2.5 rounded-xl border p-3 text-xs transition-all',
                                  isRevealed && isCorrectChoice
                                    ? 'border-pink-500 bg-pink-50 text-pink-600 font-bold ring-1 ring-pink-500/30'
                                    : 'border-grey-300/50 bg-canvas text-ink'
                                )}
                              >
                                <span
                                  className={cn(
                                    'flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold border',
                                    isRevealed && isCorrectChoice
                                      ? 'border-pink-600 bg-pink-600 text-white'
                                      : 'border-grey-300 bg-paper text-grey-600'
                                  )}
                                >
                                  {String.fromCharCode(65 + optIdx)}
                                </span>
                                <span className="flex-1">{opt}</span>
                                {isRevealed && isCorrectChoice && (
                                  <Check className="h-4 w-4 text-pink-600 shrink-0" />
                                )}
                              </div>
                            )
                          })}
                        </div>

                        {/* Answer Reveal Toggle & Misconception */}
                        <div className="flex flex-col gap-3 pt-2 border-t border-grey-300/30">
                          <div className="flex justify-end">
                            <button
                              type="button"
                              onClick={() =>
                                setRevealedAnswers((prev) => ({
                                  ...prev,
                                  [q.id]: !prev[q.id],
                                }))
                              }
                              className="flex items-center gap-1.5 rounded-lg border border-pink-300/80 bg-pink-50/60 px-3 py-1.5 text-xs font-semibold text-pink-600 hover:bg-pink-50 transition-colors cursor-pointer"
                            >
                              {isRevealed ? (
                                <>
                                  <EyeOff className="h-3.5 w-3.5" />
                                  <span>ซ่อนเฉลย</span>
                                </>
                              ) : (
                                <>
                                  <Eye className="h-3.5 w-3.5" />
                                  <span>ดูเฉลย</span>
                                </>
                              )}
                            </button>
                          </div>

                          {/* Misconception Note shown when answer revealed */}
                          {isRevealed && (
                            <div className="rounded-xl border border-pink-300/60 bg-pink-50/80 p-3.5 text-xs text-ink space-y-1 animate-fadeIn">
                              <div className="flex items-center gap-1.5 font-bold text-pink-600">
                                <HelpCircle className="h-4 w-4" />
                                <span>ข้อควรระวัง (Misconception Note):</span>
                              </div>
                              <p className="text-grey-600 pl-5 leading-relaxed">
                                {q.misconception}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* BOTTOM OF RESULTS: เคล็ดลับสำหรับห้องเรียนหลายคณะ */}
              <div className="rounded-2xl border border-pink-300/50 bg-pink-50 p-5 shadow-xs space-y-2 mt-8">
                <div className="flex items-center gap-2 text-base font-bold text-pink-600">
                  <Lightbulb className="h-5 w-5 text-pink-600" />
                  <span>เคล็ดลับสำหรับห้องเรียนหลายคณะ</span>
                </div>
                <p className="text-sm text-ink leading-relaxed pl-7">
                  {generatedContent.mixedClassTip}
                </p>
              </div>

            </div>
          )}

        </div>
      </div>

      {/* Floating Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-wrap items-center gap-3 rounded-2xl bg-ink px-5 py-3.5 text-sm font-semibold text-white shadow-2xl animate-bounce">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-pink-600 text-white shrink-0">
            <Check className="h-4 w-4" />
          </span>
          <span>{toastMsg}</span>
          <button
            type="button"
            onClick={() => navigate('/teacher/live')}
            className="flex items-center gap-1.5 rounded-xl bg-pink-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-pink-500 transition-colors ml-2 cursor-pointer shadow-xs"
          >
            <Radio className="h-3.5 w-3.5" />
            <span>ไปยังคาบเรียน</span>
          </button>
          <button
            type="button"
            onClick={() => setToastMsg(null)}
            className="ml-1 text-grey-300 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  )
}
