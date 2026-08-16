import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  BookOpen,
  Brain,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Copy,
  Eye,
  EyeOff,
  FileCheck,
  FileText,
  Flame,
  HelpCircle,
  Info,
  Layers,
  Lightbulb,
  MessageSquare,
  Package,
  Radio,
  RotateCw,
  Share2,
  ShieldCheck,
  Sparkles,
  Target,
  Upload,
  Users,
  Wand2,
  X,
  Zap,
} from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { useReveal } from '@/hooks/useReveal'
import { cn } from '@/lib/utils'
import type { ActivityFormat, PretestQuestion } from '@/data/seed-data'

export default function Studio() {
  const navigate = useNavigate()
  const revealRef = useReveal(true)
  const { topics, generatedContent, startGeneration, isGenerating, setActiveActivity } = useApp()

  // Presets / Recipes to solve teacher pain points instantly
  const PAIN_POINT_PRESETS = [
    {
      id: 'preset-cross-faculty',
      title: '🏆 คลาสเรียนข้ามคณะ (Cross-Faculty Synergy)',
      desc: 'สกัดโจทย์ที่ให้เด็ก บัญชี x นิเทศ x วิศวะ x บริหาร จับคู่ดึงจุดแข็งร่วมกัน',
      syllabusFile: 'Syllabus_PIBM3301_CrossFaculty.pdf',
      topicId: 't2',
      promptText: 'เน้นให้เด็กบัญชีคิดงบ เด็กนิเทศทำ Pitching และเด็กวิศวะวางโครงสร้างระบบ',
    },
    {
      id: 'preset-engagement',
      title: '🔥 กระตุ้นเด็กเงียบ (High Engagement Quiz)',
      desc: 'เกมสปีดเปิดคาบ 5 นาที ดึงความสนใจเด็กไม่ให้หลับในคลาส',
      syllabusFile: 'Syllabus_MKT201_ActiveClass.pdf',
      topicId: 't1',
      promptText: 'เน้นคำถามท้าทายสั้นๆ มีเวลาถอยหลัง ชวนคิด ไม่เน้นท่องจำ',
    },
    {
      id: 'preset-debate',
      title: '💬 ถกเถียงประเด็นร้อน (Debate & Real Cases)',
      desc: 'เคสศึกษาธุรกิจเทคในไทยที่มีข้อถกเถียง 2 ฝ่าย เพื่อฝึก Critical Thinking',
      syllabusFile: 'Syllabus_BUS402_EthicsDebate.docx',
      topicId: 't3',
      promptText: 'สร้างสถานการณ์จำลองจริยธรรมธุรกิจ AI ในไทย ให้แบ่งกลุ่มอภิปราย',
    },
    {
      id: 'preset-pretest',
      title: '📝 เช็คพื้นฐานก่อนเรียน (5-Min Rapid Diagnostic)',
      desc: 'ข้อสอบ 5 ข้อดักจุดที่เด็กมักเข้าใจผิด (Misconception Buster)',
      syllabusFile: 'Syllabus_GEN101_PretestDiagnostic.pdf',
      topicId: 't4',
      promptText: 'เน้นเฉลยละเอียดยืนยันเหตุผลที่ตัวเลือกหลอกผิด เพื่อเคลียร์ข้อสงสัยทันที',
    },
  ]

  // Left Panel Input State
  const [activePresetId, setActivePresetId] = useState<string>('preset-cross-faculty')
  const [selectedTopicId, setSelectedTopicId] = useState<string>(topics[1]?.id || 't2')
  const [studentCount, setStudentCount] = useState<number>(24)
  const [fileName, setFileName] = useState<string | null>('Course_Syllabus_PIBM3301.pdf')
  const [customPrompt, setCustomPrompt] = useState<string>(
    'เน้นให้เด็กบัญชีคิดงบ เด็กนิเทศทำ Pitching และเด็กวิศวะวางโครงสร้างระบบ'
  )

  const allFaculties = [
    { id: 'Accounting', name: 'การบัญชี', color: '#D12E80', role: 'คิดงบประมาณ & ROI' },
    { id: 'Communication Arts', name: 'นิเทศศาสตร์', color: '#0D9488', role: 'สร้างสตอรี่ & Pitching' },
    { id: 'Engineering', name: 'วิศวกรรมศาสตร์', color: '#2563EB', role: 'วางระบบ & Feasibility' },
    { id: 'Business Admin', name: 'บริหารธุรกิจ', color: '#8B5CF6', role: 'วางแผนกลยุทธ์การตลาด' },
    { id: 'Digital Media', name: 'ดิจิทัลมีเดีย', color: '#F59E0B', role: 'ออกแบบ UI/UX Concept' },
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

  // Apply preset handler
  const handleApplyPreset = (preset: (typeof PAIN_POINT_PRESETS)[0]) => {
    setActivePresetId(preset.id)
    setFileName(preset.syllabusFile)
    setSelectedTopicId(preset.topicId)
    setCustomPrompt(preset.promptText)
    showToast(`โหลดสูตรสำเร็จ "${preset.title}" เรียบร้อยแล้ว`)
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
    }, 3500)
  }

  const generationStepTexts = [
    '📄 กำลังวิเคราะห์ Course Syllabus & สกัดวัตถุประสงค์การเรียนรู้...',
    '🌉 กำลังคำนวณสะพานเชื่อมโยงความรู้ข้ามคณะ (AI Bridge Engine)...',
    '🎮 กำลังออกแบบกิจกรรม Active Learning (Debate, Case, Quiz)...',
    '🧠 กำลังสร้าง 3D Flashcards & Diagnostic Pre-test Exam...',
  ]

  const getFormatBadge = (format: ActivityFormat) => {
    switch (format) {
      case 'debate':
        return { label: 'Debate อภิปราย', icon: MessageSquare, class: 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800' }
      case 'case-based':
        return { label: 'Case Study เคสสัดส่วนจริง', icon: BookOpen, class: 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800' }
      case 'quick-game':
        return { label: 'Quick Game เกมสปีด', icon: Zap, class: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800' }
      default:
        return { label: format, icon: Sparkles, class: 'bg-grey-100 text-grey-700 border-grey-200' }
    }
  }

  const getDifficultyBadge = (difficulty: PretestQuestion['difficulty']) => {
    switch (difficulty) {
      case 'easy':
        return { label: 'ระดับง่าย', class: 'bg-pink-50 text-pink-600 border border-pink-200 font-medium dark:bg-pink-950/40 dark:border-pink-800' }
      case 'medium':
        return { label: 'ระดับปานกลาง', class: 'bg-pink-300 text-ink border border-pink-400 font-medium dark:bg-pink-800 dark:text-white' }
      case 'hard':
        return { label: 'ระดับยาก (วิเคราะห์ซับซ้อน)', class: 'bg-pink-600 text-white font-semibold shadow-xs' }
    }
  }

  return (
    <div ref={revealRef} className="mx-auto max-w-7xl space-y-6 pb-24 animate-slide-up">
      {/* 👑 HERO BANNER — SOLVING TEACHER PAIN POINTS */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-pink-500/80 bg-paper p-6 md:p-8 shadow-xl">
        <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-pink-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-pink-600 text-white shadow-md shadow-pink-600/30">
                <Wand2 className="h-5 w-5" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl md:text-3xl font-extrabold text-ink tracking-tight">
                    Syllabus AI Studio
                  </h1>
                  <span className="rounded-full bg-pink-600 px-3 py-0.5 text-xs font-bold text-white shadow-xs">
                    🔥 พระเอกผู้ช่วยสอน
                  </span>
                </div>
                <p className="text-xs md:text-sm text-grey-600 mt-0.5">
                  เครื่องมือสกัด Syllabus แปลงเป็นกิจกรรม Active Learning, Flashcards และข้อสอบข้ามคณะใน 3 วินาที
                </p>
              </div>
            </div>

            <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shadow-2xs">
              <Sparkles className="h-4 w-4 text-emerald-600" />
              <span>ประหยัดเวลาอาจารย์ 90% (3 ชม. → 3 วินาที)</span>
            </span>
          </div>

          {/* 3 PAIN-POINT FIX HIGHLIGHT CARDS */}
          <div className="grid gap-3 sm:grid-cols-3 pt-2">
            <div className="rounded-2xl border border-pink-200 dark:border-pink-900 bg-pink-50/60 dark:bg-pink-950/30 p-3.5 space-y-1">
              <div className="flex items-center gap-2 font-bold text-pink-700 dark:text-pink-300 text-xs">
                <Clock className="h-4 w-4 text-pink-600" />
                <span>1. ขจัดงานถ่วงเวลาเตรียมสอน</span>
              </div>
              <p className="text-[11px] text-grey-600 dark:text-grey-300 leading-relaxed">
                อัปโหลด Syllabus ครั้งเดียว AI เจนกิจกรรม ควิซ และ Flashcard ครบจบไม่ต้องนั่งแต่งเอง
              </p>
            </div>

            <div className="rounded-2xl border border-amber-200 dark:border-amber-900 bg-amber-50/60 dark:bg-amber-950/30 p-3.5 space-y-1">
              <div className="flex items-center gap-2 font-bold text-amber-700 dark:text-amber-300 text-xs">
                <BridgeIcon className="h-4 w-4 text-amber-600" />
                <span>2. ทลายช่องว่างเด็กต่างคณะ</span>
              </div>
              <p className="text-[11px] text-grey-600 dark:text-grey-300 leading-relaxed">
                คำนวณภูมิหลังเด็ก บัญชี x นิเทศ x วิศวะ x บริหาร x ดิจิทัล ดึงจุดแข็งทุกคนมาช่วยกันทำเคส
              </p>
            </div>

            <div className="rounded-2xl border border-blue-200 dark:border-blue-900 bg-blue-50/60 dark:bg-blue-950/30 p-3.5 space-y-1">
              <div className="flex items-center gap-2 font-bold text-blue-700 dark:text-blue-300 text-xs">
                <Radio className="h-4 w-4 text-blue-600" />
                <span>3. 1-Click Live Deploy</span>
              </div>
              <p className="text-[11px] text-grey-600 dark:text-grey-300 leading-relaxed">
                กดปุ่มเดียวส่งกิจกรรมเข้าห้องเรียนสดทันที พร้อมส่งออกไฟล์ SPU e-Learning
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 🎯 PAIN-POINT PRESET RECIPES BAR */}
      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-wider text-grey-600 flex items-center gap-1.5">
          <Flame className="h-4 w-4 text-pink-600" />
          <span>สูตรสำเร็จแก้ Pain Point การสอน (เลือกเพื่อลองทดสอบทันที)</span>
        </p>
        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
          {PAIN_POINT_PRESETS.map((preset) => {
            const isActive = activePresetId === preset.id
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                className={cn(
                  'flex flex-col justify-between text-left rounded-2xl p-3.5 border transition-all cursor-pointer relative overflow-hidden',
                  isActive
                    ? 'border-pink-500 bg-pink-50 dark:bg-pink-950/50 shadow-md ring-2 ring-pink-500/30'
                    : 'border-grey-300/60 bg-paper hover:border-pink-300 hover:bg-pink-50/30'
                )}
              >
                <div>
                  <h4 className="text-xs font-bold text-ink flex items-center justify-between">
                    <span>{preset.title}</span>
                    {isActive && (
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-pink-600 text-white">
                        <Check className="h-3 w-3" />
                      </span>
                    )}
                  </h4>
                  <p className="text-[11px] text-grey-600 mt-1 leading-relaxed line-clamp-2">
                    {preset.desc}
                  </p>
                </div>
                <span className="text-[10px] font-semibold text-pink-600 mt-2 flex items-center gap-1">
                  <span>เลือกสูตรนี้</span>
                  <ArrowRight className="h-3 w-3" />
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* MAIN CONTENT GRID: LEFT CONTROL PANEL (40%) & RIGHT GENERATION OUTPUT (60%) */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        
        {/* LEFT CONTROL PANEL (40%) */}
        <div className="w-full shrink-0 space-y-5 rounded-3xl border border-grey-300/60 bg-paper p-5 md:p-6 shadow-sm lg:w-[40%]">
          
          {/* Dropzone */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-grey-600 flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-pink-600" />
                <span>Course Syllabus Document</span>
              </label>
              {fileName && (
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  ✓ พร้อมประมวลผล
                </span>
              )}
            </div>

            <div
              onClick={() => {
                setFileName('Course_Syllabus_PIBM3301.pdf')
                showToast('อัปโหลด Course_Syllabus_PIBM3301.pdf แล้ว')
              }}
              className={cn(
                'group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition-all cursor-pointer',
                fileName
                  ? 'border-pink-500 bg-pink-50/40 dark:bg-pink-950/20'
                  : 'border-pink-300/80 bg-pink-50/20 hover:border-pink-500 hover:bg-pink-50/50'
              )}
            >
              {fileName ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-600 text-white shadow-md shadow-pink-600/30">
                    <FileCheck className="h-6 w-6" />
                  </div>
                  <span className="text-sm font-bold text-ink">{fileName}</span>
                  <span className="text-xs text-pink-600 font-semibold bg-pink-50 px-2.5 py-0.5 rounded-full border border-pink-200">
                    สกัดโครงสร้างวิชาเรียบร้อยแล้ว
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-100 text-pink-600 group-hover:scale-110 transition-transform">
                    <Upload className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-bold text-ink">
                    วางไฟล์ Course Syllabus ที่นี่
                  </p>
                  <p className="text-xs text-grey-600">รองรับ PDF, DOCX, TXT (สูงสุด 20MB)</p>
                </div>
              )}
            </div>
          </div>

          <hr className="border-grey-300/40" />

          {/* Topic Picker Dropdown */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-grey-600 flex items-center gap-1.5">
              <BookOpen className="h-4 w-4 text-pink-600" />
              <span>เลือกบทเรียนที่ต้องการเน้น (Topic)</span>
            </label>
            <select
              value={selectedTopicId}
              onChange={(e) => setSelectedTopicId(e.target.value)}
              className="w-full rounded-2xl border border-grey-300/80 bg-paper px-4 py-3 text-sm font-semibold text-ink outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all cursor-pointer shadow-2xs"
            >
              {topics.map((t) => (
                <option key={t.id} value={t.id}>
                  สัปดาห์ที่ {t.week}: {t.title}
                </option>
              ))}
            </select>
            {currentTopic && (
              <div className="rounded-xl bg-canvas p-3 text-xs text-grey-600 border border-grey-300/40 space-y-1">
                <p className="font-bold text-ink flex items-center gap-1 text-pink-600">
                  <Target className="h-3.5 w-3.5" />
                  <span>วัตถุประสงค์การเรียนรู้ประจำบท:</span>
                </p>
                <p className="text-[11px] leading-relaxed text-ink/90">
                  {currentTopic.learningObjective}
                </p>
              </div>
            )}
          </div>

          {/* Student Count Input & Faculty Mix */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-grey-600 flex items-center gap-1.5">
                <Users className="h-4 w-4 text-pink-600" />
                <span>จำนวนนักศึกษาในคลาส</span>
              </label>
              <span className="text-xs font-bold text-pink-600 bg-pink-50 px-2.5 py-0.5 rounded-full border border-pink-200">
                {studentCount} คน
              </span>
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
          </div>

          {/* Faculty Mix & Synergy Engine Rating */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-grey-600 flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-pink-600" />
                <span>องค์ประกอบคณะในห้องเรียน ({selectedFaculties.length} คณะ)</span>
              </label>
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                <Sparkles className="h-3 w-3 fill-emerald-400" />
                <span>Bridge Score: 98%</span>
              </span>
            </div>

            {/* Faculty Chip Selectors */}
            <div className="flex flex-wrap gap-1.5">
              {allFaculties.map((f) => {
                const isSelected = selectedFaculties.includes(f.id)
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => toggleFaculty(f.id)}
                    className={cn(
                      'rounded-full px-3 py-1.5 text-xs font-semibold transition-all border cursor-pointer flex items-center gap-1.5',
                      isSelected
                        ? 'border-pink-500 bg-pink-50 text-pink-600 shadow-2xs dark:bg-pink-950/60'
                        : 'border-grey-300/60 bg-canvas text-grey-600 hover:border-grey-300'
                    )}
                  >
                    <span className="h-2 w-2 rounded-full shrink-0" style={{ background: f.color }} />
                    <span>{f.name}</span>
                  </button>
                )
              })}
            </div>

            {/* Role Synergy Preview */}
            <div className="rounded-xl bg-canvas p-3 border border-grey-300/40 text-[11px] space-y-1.5">
              <p className="font-bold text-ink flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-pink-600" />
                <span>การแบ่งบทเรียนตามจุดแข็งแต่ละคณะ:</span>
              </p>
              <div className="grid grid-cols-1 gap-1 pt-0.5">
                {allFaculties
                  .filter((f) => selectedFaculties.includes(f.id))
                  .map((f) => (
                    <div key={f.id} className="flex items-center justify-between text-grey-600">
                      <span className="font-semibold text-ink flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full" style={{ background: f.color }} />
                        {f.name}:
                      </span>
                      <span className="text-pink-600 font-bold">{f.role}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Custom AI Instruction Bar */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-grey-600 flex items-center gap-1.5">
              <Brain className="h-4 w-4 text-pink-600" />
              <span>คำสั่งพิเศษเพิ่มเติมสำหรับ AI (Custom Focus)</span>
            </label>
            <textarea
              rows={2}
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="เช่น เน้นกรณีศึกษาจากบริษัทเทคไทย หรือเน้นให้เด็กบัญชีจับคู่กับเด็กนิเทศ"
              className="w-full rounded-2xl border border-grey-300/80 bg-paper p-3 text-xs font-medium text-ink outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all resize-none shadow-2xs"
            />
          </div>

          {/* Big Pink Generate Button */}
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex w-full items-center justify-center gap-2.5 rounded-2xl bg-pink-600 py-4 px-6 text-base font-extrabold text-white shadow-xl shadow-pink-600/30 hover:bg-pink-600/90 active:scale-[0.98] disabled:opacity-50 transition-all cursor-pointer mt-4"
          >
            <Sparkles className="h-5 w-5 animate-pulse" />
            <span>✨ สกัด Syllabus & สร้างสื่อการสอน (3 วินาที)</span>
          </button>
        </div>

        {/* RIGHT GENERATION OUTPUT PANEL (60%) */}
        <div className="w-full flex-1 lg:w-[60%]">

          {/* STATE 1: Skeleton Loader with Realtime Cycling Progress */}
          {isGenerating && (
            <div className="space-y-6 rounded-3xl border border-grey-300/60 bg-paper p-6 md:p-8 shadow-md">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="relative flex h-3.5 w-3.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-pink-500 opacity-75"></span>
                      <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-pink-600"></span>
                    </span>
                    <span className="text-base font-extrabold text-ink">
                      {generationStepTexts[generationStep]}
                    </span>
                  </div>
                  <span className="text-sm font-extrabold text-pink-600">
                    {progressPercent}%
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="h-3 w-full overflow-hidden rounded-full bg-grey-300/30">
                  <div
                    className="h-full rounded-full bg-pink-600 transition-all duration-150 ease-out shadow-sm"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Skeleton Cards Placeholder */}
              <div className="space-y-4 pt-2">
                <div className="flex gap-2 border-b border-grey-300/40 pb-3">
                  <div className="h-10 w-28 animate-pulse rounded-xl bg-pink-200/50" />
                  <div className="h-10 w-32 animate-pulse rounded-xl bg-grey-300/30" />
                  <div className="h-10 w-28 animate-pulse rounded-xl bg-grey-300/30" />
                </div>

                <div className="space-y-4">
                  {[1, 2, 3].map((n) => (
                    <div
                      key={n}
                      className="space-y-3 rounded-2xl border border-grey-300/40 p-5 bg-canvas/50"
                    >
                      <div className="flex items-center justify-between">
                        <div className="h-6 w-56 animate-pulse rounded-lg bg-grey-300/40" />
                        <div className="h-6 w-20 animate-pulse rounded-full bg-pink-100" />
                      </div>
                      <div className="h-4 w-full animate-pulse rounded-md bg-grey-300/20" />
                      <div className="h-4 w-4/5 animate-pulse rounded-md bg-grey-300/20" />
                      <div className="flex justify-end pt-2">
                        <div className="h-9 w-32 animate-pulse rounded-xl bg-pink-200" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STATE 2: Revealed Generated Results */}
          {hasGenerated && !isGenerating && (
            <div className="space-y-6">

              {/* Time Saved Alert Banner */}
              <div className="flex items-center justify-between rounded-2xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/40 p-4 shadow-2xs">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white font-bold">
                    <CheckCircle2 className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                      สกัดสื่อการสอนเรียบร้อยแล้ว!
                    </h3>
                    <p className="text-xs text-emerald-700 dark:text-emerald-400">
                      ประหยัดเวลาเตรียมสอนให้อาจารย์ไปแล้ว <strong className="underline">2 ชั่วโมง 45 นาที</strong>
                    </p>
                  </div>
                </div>

                <span className="hidden sm:inline-flex text-xs font-bold text-emerald-700 bg-paper px-3 py-1 rounded-full border border-emerald-300 shadow-2xs">
                  ✨ พร้อมใช้งาน 100%
                </span>
              </div>

              {/* Tabs Navigation */}
              <div className="flex items-center gap-1.5 rounded-2xl border border-grey-300/60 bg-paper p-2 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setActiveTab('activities')}
                  className={cn(
                    'flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-xs md:text-sm font-bold transition-all cursor-pointer',
                    activeTab === 'activities'
                      ? 'bg-pink-600 text-white shadow-md'
                      : 'text-grey-600 hover:bg-pink-50/50 hover:text-pink-600'
                  )}
                >
                  <Sparkles className="h-4 w-4" />
                  <span>กิจกรรมการสอน</span>
                  <span
                    className={cn(
                      'rounded-full px-2 py-0.5 text-[11px] font-extrabold',
                      activeTab === 'activities'
                        ? 'bg-white/20 text-white'
                        : 'bg-pink-100 text-pink-600'
                    )}
                  >
                    {generatedContent.activities.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('flashcards')}
                  className={cn(
                    'flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-xs md:text-sm font-bold transition-all cursor-pointer',
                    activeTab === 'flashcards'
                      ? 'bg-pink-600 text-white shadow-md'
                      : 'text-grey-600 hover:bg-pink-50/50 hover:text-pink-600'
                  )}
                >
                  <Layers className="h-4 w-4" />
                  <span>Flashcards 3D</span>
                  <span
                    className={cn(
                      'rounded-full px-2 py-0.5 text-[11px] font-extrabold',
                      activeTab === 'flashcards'
                        ? 'bg-white/20 text-white'
                        : 'bg-pink-100 text-pink-600'
                    )}
                  >
                    {generatedContent.flashcards.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('pretest')}
                  className={cn(
                    'flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-xs md:text-sm font-bold transition-all cursor-pointer',
                    activeTab === 'pretest'
                      ? 'bg-pink-600 text-white shadow-md'
                      : 'text-grey-600 hover:bg-pink-50/50 hover:text-pink-600'
                  )}
                >
                  <FileText className="h-4 w-4" />
                  <span>ข้อสอบลองสอบ</span>
                  <span
                    className={cn(
                      'rounded-full px-2 py-0.5 text-[11px] font-extrabold',
                      activeTab === 'pretest'
                        ? 'bg-white/20 text-white'
                        : 'bg-pink-100 text-pink-600'
                    )}
                  >
                    {generatedContent.pretest.length}
                  </span>
                </button>
              </div>

              {/* TAB 1: กิจกรรม (Active Learning Activities) */}
              {activeTab === 'activities' && (
                <div className="space-y-5">
                  {generatedContent.activities.map((act, idx) => {
                    const formatBadge = getFormatBadge(act.format)
                    const FormatIcon = formatBadge.icon
                    const isWhyOpen = openWhyItWorks[idx] ?? false

                    return (
                      <div
                        key={idx}
                        className="rounded-3xl border border-grey-300/60 bg-paper p-5 md:p-6 shadow-sm hover:shadow-md transition-all space-y-4 relative"
                      >
                        {/* Heading & Badges */}
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-pink-600 bg-pink-50 px-2 py-0.5 rounded-md border border-pink-200">
                              กิจกรรมที่ {idx + 1}
                            </span>
                            <h3 className="text-lg md:text-xl font-bold text-ink mt-1">
                              {act.name}
                            </h3>
                          </div>

                          <div className="flex items-center gap-2">
                            <span
                              className={cn(
                                'inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold border shadow-2xs',
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

                        {/* Steps List */}
                        <div className="space-y-2">
                          <p className="text-xs font-bold text-grey-600 uppercase tracking-wider">
                            ขั้นตอนการดำเนินกิจกรรม ({act.steps.length} ขั้นตอน)
                          </p>
                          <ol className="space-y-2">
                            {act.steps.map((step, sIdx) => (
                              <li key={sIdx} className="flex items-start gap-3 text-sm text-ink leading-relaxed">
                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-pink-600 text-xs font-extrabold text-white mt-0.5">
                                  {sIdx + 1}
                                </span>
                                <span className="pt-0.5">{step}</span>
                              </li>
                            ))}
                          </ol>
                        </div>

                        {/* Faculty Synergy Roles Breakdown */}
                        <div className="rounded-2xl border border-pink-200 dark:border-pink-900 bg-pink-50/50 dark:bg-pink-950/30 p-3.5 space-y-1.5 text-xs">
                          <p className="font-bold text-pink-700 dark:text-pink-300 flex items-center gap-1.5">
                            <Users className="h-4 w-4 text-pink-600" />
                            <span>บทบาทเด็กต่างคณะในกิจกรรมนี้ (Faculty Synergy):</span>
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] pt-1">
                            <span className="bg-paper p-2 rounded-xl border border-pink-100 font-medium text-ink">
                              📊 <strong>การบัญชี:</strong> ช่วยวิเคราะห์งบประมาณและคำนวณ ROI
                            </span>
                            <span className="bg-paper p-2 rounded-xl border border-pink-100 font-medium text-ink">
                              🎨 <strong>นิเทศศาสตร์:</strong> ออกแบบการสื่อสารและนำเสนอ Pitching
                            </span>
                            <span className="bg-paper p-2 rounded-xl border border-pink-100 font-medium text-ink">
                              ⚙️ <strong>วิศวกรรมศาสตร์:</strong> วางโครงสร้างระบบและความเป็นไปได้
                            </span>
                            <span className="bg-paper p-2 rounded-xl border border-pink-100 font-medium text-ink">
                              💼 <strong>บริหารธุรกิจ:</strong> วางกลยุทธ์การตลาดและข้อได้เปรียบ
                            </span>
                          </div>
                        </div>

                        {/* Collapsible Why It Works */}
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
                              <span>ทำไมกิจกรรมนี้ถึงเวิร์ก (Pedagogical Insight)</span>
                            </span>
                            {isWhyOpen ? (
                              <ChevronUp className="h-4 w-4 text-grey-600" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-grey-600" />
                            )}
                          </button>

                          {isWhyOpen && (
                            <div className="px-4 pb-4 pt-1 text-xs text-grey-600 space-y-2 border-t border-grey-300/30">
                              <p className="leading-relaxed text-ink/90">{act.whyItWorks}</p>
                              {act.materialsNeeded && (
                                <p className="text-xs text-grey-600 pt-1 flex items-center gap-1.5">
                                  <Package className="h-4 w-4 text-pink-600 shrink-0" />
                                  <span><strong className="text-ink">สื่ออุปกรณ์ที่ใช้: </strong>{act.materialsNeeded}</span>
                                </p>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Action Bar */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-grey-300/30">
                          <span className="text-xs text-grey-600 flex items-center gap-1">
                            <Info className="h-3.5 w-3.5 text-pink-600" />
                            <span>พร้อมบรรจุเข้าคลาสเรียนสด</span>
                          </span>

                          <button
                            type="button"
                            onClick={() => {
                              setActiveActivity(act)
                              showToast(`ตั้งค่ากิจกรรม "${act.name}" เป็นกิจกรรมหลักในคาบสดแล้ว!`)
                              navigate('/teacher/live')
                            }}
                            className="flex items-center gap-2 rounded-2xl bg-pink-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-pink-600/20 hover:bg-pink-600/90 active:scale-[0.98] transition-all cursor-pointer"
                          >
                            <Radio className="h-4 w-4" />
                            <span>⚡ ส่งเข้าคาบเรียนสด (Live Class)</span>
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* TAB 2: Flashcards 3D (8 Cards) */}
              {activeTab === 'flashcards' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-2xl bg-pink-50 p-3.5 border border-pink-200">
                    <p className="text-xs font-bold text-pink-600 flex items-center gap-1.5">
                      <RotateCw className="h-4 w-4 text-pink-600" />
                      <span>คลิกที่การ์ดเพื่อพลิกดูคำอธิบาย (3D Interactive Flashcards)</span>
                    </p>

                    <button
                      type="button"
                      onClick={() => showToast('ส่งชุด Flashcards 8 ใบ ไปยังแอปพลิเคชันฝั่งนักศึกษาเรียบร้อย!')}
                      className="flex items-center gap-1.5 rounded-xl bg-pink-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-pink-700 transition-colors cursor-pointer"
                    >
                      <Share2 className="h-3.5 w-3.5" />
                      <span>ส่งให้นักศึกษาทบทวน</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                            className="perspective-1000 h-48 w-full cursor-pointer select-none"
                          >
                            <div
                              className={cn(
                                'relative h-full w-full rounded-3xl transition-transform duration-500 transform-style-3d shadow-sm hover:shadow-md border border-grey-300/60',
                                isFlipped ? 'rotate-y-180 bg-pink-50/80' : 'bg-paper'
                              )}
                            >
                              {/* FRONT FACE */}
                              <div className="backface-hidden absolute inset-0 flex flex-col justify-between p-4 rounded-3xl bg-paper">
                                <div className="flex items-start justify-between">
                                  <span className="rounded-lg bg-pink-50 px-2 py-1 text-pink-600 text-xs font-extrabold">
                                    #{idx + 1}
                                  </span>
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-pink-600 bg-pink-50 px-2 py-0.5 rounded-full">
                                    Front / หัวข้อ
                                  </span>
                                </div>
                                <h4 className="text-center font-extrabold text-ink text-sm leading-snug my-auto px-1">
                                  {card.front}
                                </h4>
                                <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-pink-600">
                                  <RotateCw className="h-3.5 w-3.5" />
                                  <span>แตะเพื่อพลิก</span>
                                </div>
                              </div>

                              {/* BACK FACE */}
                              <div className="backface-hidden rotate-y-180 absolute inset-0 flex flex-col justify-between p-4 rounded-3xl bg-pink-50/90 text-ink">
                                <div className="flex items-start justify-between">
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-pink-600 bg-paper px-2 py-0.5 rounded-full border border-pink-200">
                                    Back / คำอธิบาย
                                  </span>
                                  <RotateCw className="h-4 w-4 text-pink-600" />
                                </div>
                                <p className="text-xs text-center font-semibold leading-relaxed my-auto text-ink">
                                  {card.back}
                                </p>
                                <span className="text-[10px] text-center text-grey-600 font-medium">
                                  แตะเพื่อพลิกกลับ
                                </span>
                              </div>
                            </div>
                          </div>

                          {isFlipped && (
                            <div className="rounded-xl bg-pink-50 p-2.5 text-xs text-pink-600 border border-pink-200 flex items-start gap-1.5 animate-fadeIn">
                              <Lightbulb className="h-4 w-4 shrink-0 mt-0.5 text-pink-600" />
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
                  <div className="flex items-center justify-between rounded-2xl bg-pink-50 p-3.5 border border-pink-200">
                    <p className="text-xs font-bold text-pink-600 flex items-center gap-1.5">
                      <FileText className="h-4 w-4 text-pink-600" />
                      <span>ชุดข้อสอบวัดพื้นฐานก่อนเรียน (5-Min Diagnostic Quiz)</span>
                    </p>

                    <button
                      type="button"
                      onClick={() => showToast('คัดลอกข้อสอบ 5 ข้อ สำหรับนำไปใส่ระบบ SPU LMS เรียบร้อย!')}
                      className="flex items-center gap-1.5 rounded-xl bg-pink-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-pink-700 transition-colors cursor-pointer"
                    >
                      <Copy className="h-3.5 w-3.5" />
                      <span>คัดลอกโจทย์ทั้งหมด</span>
                    </button>
                  </div>

                  {generatedContent.pretest.map((q, qIdx) => {
                    const diffBadge = getDifficultyBadge(q.difficulty)
                    const isRevealed = revealedAnswers[q.id] ?? false

                    return (
                      <div
                        key={q.id}
                        className="rounded-3xl border border-grey-300/60 bg-paper p-5 md:p-6 shadow-2xs space-y-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-pink-600 text-xs font-extrabold text-white mt-0.5">
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
                                  'flex items-center gap-3 rounded-2xl border p-3.5 text-xs transition-all',
                                  isRevealed && isCorrectChoice
                                    ? 'border-pink-500 bg-pink-50 text-pink-600 font-bold ring-1 ring-pink-500/30 dark:bg-pink-950/60'
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
                                <span className="flex-1 font-semibold">{opt}</span>
                                {isRevealed && isCorrectChoice && (
                                  <Check className="h-4 w-4 text-pink-600 shrink-0" />
                                )}
                              </div>
                            )
                          })}
                        </div>

                        {/* Answer Reveal Toggle & Misconception Note */}
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
                                  <span>ซ่อนเฉลย & คำอธิบาย</span>
                                </>
                              ) : (
                                <>
                                  <Eye className="h-4 w-4" />
                                  <span>ดูเฉลย & คำอธิบาย</span>
                                </>
                              )}
                            </button>
                          </div>

                          {isRevealed && (
                            <div className="rounded-2xl border border-pink-300/60 bg-pink-50/80 p-4 text-xs text-ink space-y-1 animate-fadeIn">
                              <div className="flex items-center gap-1.5 font-bold text-pink-600">
                                <HelpCircle className="h-4 w-4" />
                                <span>ข้อควรระวังสำหรับเด็กต่างคณะ (Misconception Note):</span>
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
              <div className="rounded-3xl border border-pink-300/50 bg-pink-50 p-6 shadow-xs space-y-2 mt-8">
                <div className="flex items-center gap-2 text-base font-extrabold text-pink-600">
                  <Lightbulb className="h-5 w-5 text-pink-600" />
                  <span>เคล็ดลับการสอนสำหรับคลาสเรียนข้ามคณะ</span>
                </div>
                <p className="text-sm text-ink leading-relaxed pl-7 font-medium">
                  {generatedContent.mixedClassTip}
                </p>
              </div>

            </div>
          )}

        </div>
      </div>

      {/* 🚀 HERO STICKY BOTTOM DEPLOYMENT BAR */}
      {hasGenerated && !isGenerating && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-grey-300/60 bg-paper/95 backdrop-blur-md p-3.5 shadow-2xl">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-pink-600 text-white font-bold text-xs">
                <Sparkles className="h-4 w-4" />
              </span>
              <div>
                <p className="text-xs font-extrabold text-ink">
                  สื่อการสอนพร้อมใช้งาน ({generatedContent.activities.length} กิจกรรม · {generatedContent.flashcards.length} Flashcards · {generatedContent.pretest.length} ข้อสอบ)
                </p>
                <p className="text-[10px] text-grey-600">
                  คลิกเพื่อส่งเข้าห้องเรียนสด หรือส่งออกระบบ SPU e-Learning ทันที
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  showToast('ส่งชุดทบทวนให้นักศึกษาในระบบเรียบร้อยแล้ว!')
                }}
                className="flex items-center gap-1.5 rounded-xl border border-pink-300 px-3.5 py-2 text-xs font-bold text-pink-600 hover:bg-pink-50 transition-colors cursor-pointer"
              >
                <Share2 className="h-3.5 w-3.5" />
                <span>ส่งให้นักศึกษาทบทวน</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveActivity(generatedContent.activities[0])
                  showToast('ส่งกิจกรรมเข้าคาบเรียนสดเรียบร้อยแล้ว!')
                  navigate('/teacher/live')
                }}
                className="flex items-center gap-2 rounded-xl bg-pink-600 px-4 py-2 text-xs font-extrabold text-white shadow-md shadow-pink-600/30 hover:bg-pink-700 active:scale-[0.98] transition-all cursor-pointer"
              >
                <Radio className="h-4 w-4" />
                <span>⚡ ส่งเข้าคาบสดทันที</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-16 right-6 z-50 flex flex-wrap items-center gap-3 rounded-2xl bg-ink px-5 py-3.5 text-sm font-bold text-white shadow-2xl animate-bounce">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-pink-600 text-white shrink-0">
            <Check className="h-4 w-4" />
          </span>
          <span>{toastMsg}</span>
          <button
            type="button"
            onClick={() => navigate('/teacher/live')}
            className="flex items-center gap-1.5 rounded-xl bg-pink-600 px-3 py-1.5 text-xs font-extrabold text-white hover:bg-pink-500 transition-colors ml-2 cursor-pointer shadow-xs"
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

function BridgeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 19V9a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10" />
      <path d="M4 15h16" />
      <path d="M10 15v4" />
      <path d="M14 15v4" />
    </svg>
  )
}
