import { useEffect, useState } from 'react'
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
  Layers,
  Lightbulb,
  MessageSquare,
  Package,
  Radio,
  RotateCw,
  Sparkles,
  Upload,
  Users,
  Wand2,
  X,
  Zap,
} from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { cn } from '@/lib/utils'
import type { ActivityFormat, PretestQuestion } from '@/data/seed-data'

export default function Studio() {
  const { topics, generatedContent, startGeneration, isGenerating, activeActivity, setActiveActivity } = useApp()

  // Left Panel Input State
  const [usingSampleSyllabus, setUsingSampleSyllabus] = useState(true)
  const [selectedTopicId, setSelectedTopicId] = useState<string>(topics[1]?.id || 't2')
  const [studentCount, setStudentCount] = useState<number>(24)
  const [fileName, setFileName] = useState<string | null>('Course_Syllabus_PIBM3301.pdf')

  const allFaculties = [
    { id: 'Accounting', name: 'การบัญชี' },
    { id: 'Communication Arts', name: 'นิเทศศาสตร์' },
    { id: 'Engineering', name: 'วิศวกรรมศาสตร์' },
    { id: 'Business Admin', name: 'บริหารธุรกิจ' },
    { id: 'Digital Media', name: 'ดิจิทัลมีเดีย' },
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

  // Progress Bar & Step Cycling effect (3 seconds total)
  useEffect(() => {
    let progressInterval: ReturnType<typeof setInterval>

    if (isGenerating) {
      const startTime = Date.now()
      const totalDuration = 3000

      progressInterval = setInterval(() => {
        const elapsed = Date.now() - startTime
        const pct = Math.min(100, Math.floor((elapsed / totalDuration) * 100))
        setProgressPercent(pct)

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
    'กำลังวิเคราะห์ Course Syllabus...',
    'กำลังออกแบบกิจกรรม Active Learning...',
    'กำลังสร้าง 3D Flashcards...',
    'กำลังสร้างชุดข้อสอบลองสอบ...',
  ]

  const getFormatBadge = (format: ActivityFormat) => {
    switch (format) {
      case 'debate':
        return { label: 'Debate อภิปราย', icon: MessageSquare, class: 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200' }
      case 'case-based':
        return { label: 'Case Study เคสศึกษา', icon: BookOpen, class: 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200' }
      case 'quick-game':
        return { label: 'Quick Game เกมสปีด', icon: Zap, class: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200' }
      default:
        return { label: format, icon: Sparkles, class: 'bg-grey-100 text-grey-700 border-grey-200' }
    }
  }

  const getDifficultyBadge = (difficulty: PretestQuestion['difficulty']) => {
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
    <div className="mx-auto max-w-7xl space-y-6 pb-16">
      {/* Clean Page Header — Easy to Read for Senior Instructors */}
      <div className="flex flex-col gap-1 border-b border-grey-300/40 pb-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-pink-600 text-white shadow-md shadow-pink-600/20">
            <Wand2 className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-ink tracking-tight">
              Learning Studio
            </h1>
          </div>
        </div>
      </div>

      {/* Main Layout Grid: Left Form Panel (40%) & Right Output Panel (60%) */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        
        {/* LEFT FORM PANEL (40%) — Extremely Clean & Friendly */}
        <div className="w-full shrink-0 space-y-5 rounded-3xl border border-grey-300/60 bg-paper p-6 shadow-sm lg:w-[40%]">
          
          {/* Section 1: MAIN HERO CALL TO ACTION — Course Syllabus Dropzone */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-base font-extrabold text-ink flex items-center gap-2">
                <FileText className="h-5 w-5 text-pink-600" />
                <span>1. อัปโหลด Course Syllabus</span>
              </label>
              <span className="text-[11px] font-extrabold text-pink-600 bg-pink-50 dark:bg-pink-950/60 px-2.5 py-0.5 rounded-full border border-pink-200">
                Hero CTA
              </span>
            </div>

            {/* Prominent Hero Dropzone Box */}
            <div
              onClick={() => {
                setFileName('Course_Syllabus_PIBM3301.pdf')
                setUsingSampleSyllabus(false)
                showToast('อัปโหลดไฟล์ Syllabus เรียบร้อยแล้ว')
              }}
              className={cn(
                'group relative flex flex-col items-center justify-center rounded-3xl border-2 border-dashed p-6 text-center transition-all cursor-pointer shadow-sm',
                fileName
                  ? 'border-pink-500 bg-pink-50/50 dark:bg-pink-950/30 ring-2 ring-pink-500/20'
                  : 'border-pink-300 bg-pink-50/20 hover:border-pink-500 hover:bg-pink-50/40'
              )}
            >
              {fileName ? (
                <div className="flex flex-col items-center gap-2.5 w-full">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-600 text-white shadow-md shadow-pink-600/30">
                    <FileCheck className="h-7 w-7" />
                  </div>
                  <div>
                    <span className="inline-block rounded-full bg-emerald-100 text-emerald-700 font-extrabold text-xs px-3 py-0.5 border border-emerald-300 mb-1">
                      ✓ พร้อมประมวลผล
                    </span>
                    <h3 className="text-base font-extrabold text-ink">{fileName}</h3>
                    <p className="text-xs text-grey-600 mt-0.5">
                      สกัดวัตถุประสงค์และเนื้อหาประจำวิชาเรียบร้อยแล้ว
                    </p>
                  </div>
                  <span className="text-xs font-bold text-pink-600 underline pt-1 group-hover:text-pink-700">
                    คลิกเพื่อเปลี่ยนไฟล์ใหม่
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 py-2">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-100 text-pink-600 group-hover:scale-110 transition-transform shadow-xs">
                    <Upload className="h-7 w-7" />
                  </div>
                  <div>
                    <p className="text-base font-extrabold text-ink">
                      ลากและวางไฟล์ Course Syllabus ที่นี่
                    </p>
                    <p className="text-xs text-grey-600 mt-1">
                      หรือคลิกเพื่อเลือกไฟล์จากเครื่อง (รองรับ PDF, DOCX, TXT สูงสุด 20MB)
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Demo Sample Files Section for Quick System Testing */}
            <div className="rounded-2xl bg-canvas p-3.5 border border-grey-300/50 space-y-2">
              <p className="text-xs font-bold text-grey-600 flex items-center gap-1.5">
                <span>🧪 ทดลองระบบด้วยไฟล์ตัวอย่าง:</span>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setUsingSampleSyllabus(true)
                    setFileName('Course_Syllabus_PIBM3301.pdf')
                    setSelectedTopicId(topics[1]?.id || 't2')
                    showToast('เลือกไฟล์ตัวอย่าง PIBM3301 (ธุรกิจข้ามชาติ)')
                  }}
                  className={cn(
                    'flex items-center justify-between rounded-xl p-2.5 text-left border text-xs transition-all cursor-pointer',
                    usingSampleSyllabus && fileName === 'Course_Syllabus_PIBM3301.pdf'
                      ? 'border-pink-500 bg-pink-50 text-pink-600 font-bold dark:bg-pink-950/60'
                      : 'border-grey-300/60 bg-paper text-ink hover:border-pink-300'
                  )}
                >
                  <span className="truncate pr-1">วิชา PIBM3301 (ธุรกิจข้ามชาติ)</span>
                  {usingSampleSyllabus && fileName === 'Course_Syllabus_PIBM3301.pdf' && (
                    <Check className="h-4 w-4 shrink-0 text-pink-600" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setUsingSampleSyllabus(true)
                    setFileName('Course_Syllabus_MKT201.docx')
                    setSelectedTopicId(topics[0]?.id || 't1')
                    showToast('เลือกไฟล์ตัวอย่าง MKT201 (การตลาดดิจิทัล)')
                  }}
                  className={cn(
                    'flex items-center justify-between rounded-xl p-2.5 text-left border text-xs transition-all cursor-pointer',
                    usingSampleSyllabus && fileName === 'Course_Syllabus_MKT201.docx'
                      ? 'border-pink-500 bg-pink-50 text-pink-600 font-bold dark:bg-pink-950/60'
                      : 'border-grey-300/60 bg-paper text-ink hover:border-pink-300'
                  )}
                >
                  <span className="truncate pr-1">วิชา MKT201 (การตลาดดิจิทัล)</span>
                  {usingSampleSyllabus && fileName === 'Course_Syllabus_MKT201.docx' && (
                    <Check className="h-4 w-4 shrink-0 text-pink-600" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <hr className="border-grey-300/40" />

          {/* Section 2: Topic Selector */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-ink flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-pink-600" />
              <span>2. เลือกบทเรียนประจำสัปดาห์</span>
            </label>

            <select
              value={selectedTopicId}
              onChange={(e) => setSelectedTopicId(e.target.value)}
              className="w-full rounded-2xl border border-grey-300/80 bg-paper px-4 py-3 text-base font-bold text-ink outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all cursor-pointer shadow-2xs"
            >
              {topics.map((t) => (
                <option key={t.id} value={t.id}>
                  สัปดาห์ที่ {t.week}: {t.title}
                </option>
              ))}
            </select>

            {currentTopic && (
              <div className="rounded-2xl bg-canvas p-3.5 text-xs text-grey-600 border border-grey-300/40 space-y-1">
                <p className="font-bold text-ink">วัตถุประสงค์บทเรียน:</p>
                <p className="leading-relaxed text-ink/90 font-medium">
                  {currentTopic.learningObjective}
                </p>
              </div>
            )}
          </div>

          {/* Section 3: Faculty Selection & Student Count */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-bold text-ink flex items-center gap-2">
                <Users className="h-4 w-4 text-pink-600" />
                <span>3. คณะผู้เรียนในห้อง ({studentCount} คน)</span>
              </label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="range"
                min={10}
                max={150}
                step={2}
                value={studentCount}
                onChange={(e) => setStudentCount(Number(e.target.value))}
                className="w-full accent-pink-600 cursor-pointer"
              />
            </div>

            {/* Simple Faculty Chips */}
            <div className="flex flex-wrap gap-1.5">
              {allFaculties.map((f) => {
                const isSelected = selectedFaculties.includes(f.id)
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => toggleFaculty(f.id)}
                    className={cn(
                      'rounded-full px-3.5 py-1.5 text-xs font-bold transition-all border cursor-pointer',
                      isSelected
                        ? 'border-pink-500 bg-pink-50 text-pink-600 shadow-2xs dark:bg-pink-950/60'
                        : 'border-grey-300/60 bg-canvas text-grey-600 hover:border-grey-300'
                    )}
                  >
                    {f.name}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Big Friendly Pink Generate Button */}
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex w-full items-center justify-center gap-2.5 rounded-2xl bg-pink-600 py-4 px-6 text-lg font-extrabold text-white shadow-lg shadow-pink-600/30 hover:bg-pink-600/90 active:scale-[0.98] disabled:opacity-50 transition-all cursor-pointer mt-4"
          >
            <Sparkles className="h-5 w-5 animate-pulse" />
            <span>สร้างสื่อการสอน</span>
          </button>
        </div>

        {/* RIGHT OUTPUT PANEL (60%) — Clean & Uncluttered */}
        <div className="w-full flex-1 lg:w-[60%]">

          {/* STATE 1: Simple Loading State */}
          {isGenerating && (
            <div className="space-y-6 rounded-3xl border border-grey-300/60 bg-paper p-8 text-center shadow-md">
              <div className="space-y-3 max-w-sm mx-auto">
                <div className="flex items-center justify-center gap-3">
                  <div className="h-4 w-4 rounded-full bg-pink-600 animate-ping" />
                  <span className="text-lg font-bold text-ink">
                    {generationStepTexts[generationStep]}
                  </span>
                </div>

                <div className="h-3 w-full overflow-hidden rounded-full bg-grey-300/30">
                  <div
                    className="h-full rounded-full bg-pink-600 transition-all duration-150 ease-out"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <p className="text-xs font-bold text-pink-600">{progressPercent}%</p>
              </div>
            </div>
          )}

          {/* STATE 2: Revealed Generated Results */}
          {hasGenerated && !isGenerating && (
            <div className="space-y-6">

              {/* 3 Main Tabs Navigation */}
              <div className="flex items-center gap-2 rounded-2xl border border-grey-300/60 bg-paper p-2 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setActiveTab('activities')}
                  className={cn(
                    'flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-extrabold transition-all cursor-pointer',
                    activeTab === 'activities'
                      ? 'bg-pink-600 text-white shadow-md'
                      : 'text-grey-600 hover:bg-pink-50/50 hover:text-pink-600'
                  )}
                >
                  <Sparkles className="h-4 w-4" />
                  <span>กิจกรรมการสอน ({generatedContent.activities.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('flashcards')}
                  className={cn(
                    'flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-extrabold transition-all cursor-pointer',
                    activeTab === 'flashcards'
                      ? 'bg-pink-600 text-white shadow-md'
                      : 'text-grey-600 hover:bg-pink-50/50 hover:text-pink-600'
                  )}
                >
                  <Layers className="h-4 w-4" />
                  <span>Flashcards ({generatedContent.flashcards.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('pretest')}
                  className={cn(
                    'flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-extrabold transition-all cursor-pointer',
                    activeTab === 'pretest'
                      ? 'bg-pink-600 text-white shadow-md'
                      : 'text-grey-600 hover:bg-pink-50/50 hover:text-pink-600'
                  )}
                >
                  <FileText className="h-4 w-4" />
                  <span>ข้อสอบ ({generatedContent.pretest.length})</span>
                </button>
              </div>

              {/* TAB 1: Activities */}
              {activeTab === 'activities' && (
                <div className="space-y-5">
                  {generatedContent.activities.map((act, idx) => {
                    const formatBadge = getFormatBadge(act.format)
                    const FormatIcon = formatBadge.icon
                    const isWhyOpen = openWhyItWorks[idx] ?? false
                    const isApplied = activeActivity?.name === act.name

                    return (
                      <div
                        key={idx}
                        className="rounded-3xl border border-grey-300/60 bg-paper p-6 shadow-sm space-y-4"
                      >
                        {/* Heading & Badges */}
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <span className="text-xs font-bold text-pink-600 bg-pink-50 px-2.5 py-0.5 rounded-md border border-pink-200">
                              กิจกรรมที่ {idx + 1}
                            </span>
                            <h3 className="text-xl font-bold text-ink mt-1">
                              {act.name}
                            </h3>
                          </div>

                          <div className="flex items-center gap-2">
                            <span
                              className={cn(
                                'inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold border',
                                formatBadge.class
                              )}
                            >
                              <FormatIcon className="h-3.5 w-3.5" />
                              {formatBadge.label}
                            </span>
                            <span className="inline-flex items-center gap-1 rounded-full bg-pink-50 px-3 py-1 text-xs font-bold text-pink-600 border border-pink-200">
                              <Clock className="h-3.5 w-3.5" />
                              {act.durationMin} นาที
                            </span>
                          </div>
                        </div>

                        {/* Steps List Header with Circular Apply Button on the Right */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-bold text-grey-600 uppercase tracking-wider">
                              ขั้นตอนกิจกรรม ({act.steps.length} ขั้นตอน)
                            </p>

                            {/* Circular / Rounded Pill Apply Button */}
                            <button
                              type="button"
                              onClick={() => {
                                setActiveActivity(act)
                                showToast(`ใช้กิจกรรม "${act.name}" สำหรับคาบเรียนสดแล้ว`)
                              }}
                              className={cn(
                                'flex h-9 items-center justify-center gap-1.5 rounded-full px-4 text-xs font-extrabold transition-all duration-300 cursor-pointer shadow-xs',
                                isApplied
                                  ? 'bg-emerald-600 text-white shadow-emerald-600/20 ring-2 ring-emerald-600/30 scale-105'
                                  : 'bg-pink-600 text-white hover:bg-pink-700 active:scale-95 shadow-pink-600/20'
                              )}
                            >
                              {isApplied ? (
                                <>
                                  <Check className="h-4 w-4 stroke-[3]" />
                                  <span>Applied</span>
                                </>
                              ) : (
                                <>
                                  <Radio className="h-3.5 w-3.5" />
                                  <span>Apply</span>
                                </>
                              )}
                            </button>
                          </div>

                          <ol className="space-y-2">
                            {act.steps.map((step, sIdx) => (
                              <li key={sIdx} className="flex items-start gap-3 text-base text-ink leading-relaxed font-medium">
                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-pink-600 text-xs font-bold text-white mt-0.5">
                                  {sIdx + 1}
                                </span>
                                <span>{step}</span>
                              </li>
                            ))}
                          </ol>
                        </div>

                        {/* Why It Works Collapsible */}
                        <div className="rounded-2xl border border-grey-300/40 bg-canvas overflow-hidden">
                          <button
                            type="button"
                            onClick={() =>
                              setOpenWhyItWorks((prev) => ({
                                ...prev,
                                [idx]: !prev[idx],
                              }))
                            }
                            className="flex w-full items-center justify-between px-4 py-3 text-xs font-bold text-ink hover:bg-grey-300/10 transition-colors cursor-pointer"
                          >
                            <span className="flex items-center gap-2 text-pink-600">
                              <Brain className="h-4 w-4" />
                              <span>ทำไมกิจกรรมนี้ถึงได้ผล</span>
                            </span>
                            {isWhyOpen ? (
                              <ChevronUp className="h-4 w-4 text-grey-600" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-grey-600" />
                            )}
                          </button>

                          {isWhyOpen && (
                            <div className="px-4 pb-4 pt-1 text-xs text-grey-600 space-y-2 border-t border-grey-300/30">
                              <p className="leading-relaxed text-ink/90 font-medium">{act.whyItWorks}</p>
                              {act.materialsNeeded && (
                                <p className="text-xs text-grey-600 pt-1 flex items-center gap-1.5">
                                  <Package className="h-4 w-4 text-pink-600 shrink-0" />
                                  <span><strong className="text-ink">สื่ออุปกรณ์: </strong>{act.materialsNeeded}</span>
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* TAB 2: Flashcards 3D (8 Cards) */}
              {activeTab === 'flashcards' && (
                <div className="space-y-4">
                  <p className="text-xs font-bold text-pink-600 flex items-center gap-1.5 bg-pink-50 p-3 rounded-2xl border border-pink-200">
                    <RotateCw className="h-4 w-4" />
                    <span>คลิกที่การ์ดเพื่อพลิกดูคำอธิบาย (Flashcard Flip)</span>
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {generatedContent.flashcards.map((card, idx) => {
                      const isFlipped = flippedCards[idx] ?? false

                      return (
                        <div key={idx} className="flex flex-col space-y-2">
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
                                'relative h-full w-full rounded-3xl transition-transform duration-500 transform-style-3d shadow-sm border border-grey-300/60',
                                isFlipped ? 'rotate-y-180 bg-pink-50/80' : 'bg-paper'
                              )}
                            >
                              {/* FRONT FACE */}
                              <div className="backface-hidden absolute inset-0 flex flex-col justify-between p-5 rounded-3xl bg-paper">
                                <span className="rounded-lg bg-pink-50 px-2.5 py-1 text-pink-600 text-xs font-bold w-fit">
                                  #{idx + 1}
                                </span>
                                <h4 className="text-center font-bold text-ink text-base leading-snug my-auto px-1">
                                  {card.front}
                                </h4>
                                <span className="text-[11px] text-center font-bold text-pink-600">
                                  แตะเพื่อพลิก
                                </span>
                              </div>

                              {/* BACK FACE */}
                              <div className="backface-hidden rotate-y-180 absolute inset-0 flex flex-col justify-between p-5 rounded-3xl bg-pink-50/90 text-ink">
                                <span className="text-xs font-bold text-pink-600">คำอธิบาย:</span>
                                <p className="text-sm text-center font-bold leading-relaxed my-auto text-ink">
                                  {card.back}
                                </p>
                                <span className="text-[10px] text-center text-grey-600 font-medium">
                                  แตะเพื่อพลิกกลับ
                                </span>
                              </div>
                            </div>
                          </div>

                          {isFlipped && (
                            <div className="rounded-xl bg-pink-50 p-2 text-xs text-pink-600 border border-pink-200 flex items-start gap-1.5">
                              <Lightbulb className="h-4 w-4 shrink-0 mt-0.5" />
                              <span><strong>Hint:</strong> {card.hint}</span>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* TAB 3: Diagnostic Pre-test (5 Questions) */}
              {activeTab === 'pretest' && (
                <div className="space-y-4">
                  {generatedContent.pretest.map((q, qIdx) => {
                    const diffBadge = getDifficultyBadge(q.difficulty)
                    const isRevealed = revealedAnswers[q.id] ?? false

                    return (
                      <div
                        key={q.id}
                        className="rounded-3xl border border-grey-300/60 bg-paper p-6 shadow-2xs space-y-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-pink-600 text-xs font-bold text-white mt-0.5">
                              {qIdx + 1}
                            </span>
                            <h4 className="text-base font-bold text-ink leading-snug">
                              {q.stem}
                            </h4>
                          </div>

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
                                  'flex items-center gap-3 rounded-2xl border p-3.5 text-xs transition-all font-semibold',
                                  isRevealed && isCorrectChoice
                                    ? 'border-pink-500 bg-pink-50 text-pink-600 font-bold dark:bg-pink-950/60'
                                    : 'border-grey-300/50 bg-canvas text-ink'
                                )}
                              >
                                <span
                                  className={cn(
                                    'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold border',
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

                        {/* Answer Reveal Toggle */}
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
                              className="flex items-center gap-1.5 rounded-xl border border-pink-300/80 bg-pink-50/60 px-3.5 py-1.5 text-xs font-bold text-pink-600 hover:bg-pink-50 transition-colors cursor-pointer"
                            >
                              {isRevealed ? (
                                <>
                                  <EyeOff className="h-4 w-4" />
                                  <span>ซ่อนเฉลย</span>
                                </>
                              ) : (
                                <>
                                  <Eye className="h-4 w-4" />
                                  <span>ดูเฉลย</span>
                                </>
                              )}
                            </button>
                          </div>

                          {isRevealed && (
                            <div className="rounded-2xl border border-pink-300/60 bg-pink-50/80 p-4 text-xs text-ink space-y-1 animate-fadeIn">
                              <div className="flex items-center gap-1.5 font-bold text-pink-600">
                                <HelpCircle className="h-4 w-4" />
                                <span>ข้อควรระวังสำหรับเด็กต่างคณะ:</span>
                              </div>
                              <p className="text-grey-600 pl-5 leading-relaxed font-medium">
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

              {/* Bottom Tip Card */}
              <div className="rounded-3xl border border-pink-300/50 bg-pink-50 p-5 shadow-xs space-y-2 mt-6">
                <div className="flex items-center gap-2 text-sm font-bold text-pink-600">
                  <Lightbulb className="h-5 w-5 text-pink-600" />
                  <span>คำแนะนำการสอนคลาสเรียนข้ามคณะ</span>
                </div>
                <p className="text-xs text-ink leading-relaxed pl-7 font-medium">
                  {generatedContent.mixedClassTip}
                </p>
              </div>

            </div>
          )}

        </div>
      </div>

      {/* Floating Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-wrap items-center gap-3 rounded-2xl bg-ink px-5 py-3.5 text-sm font-bold text-white shadow-2xl animate-bounce">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-pink-600 text-white shrink-0">
            <Check className="h-4 w-4" />
          </span>
          <span>{toastMsg}</span>
          <button
            type="button"
            onClick={() => setToastMsg(null)}
            className="ml-2 text-grey-300 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  )
}
