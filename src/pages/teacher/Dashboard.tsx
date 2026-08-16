import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  Calendar as CalendarIcon,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileDown,
  FileText,
  PieChart as PieIcon,
  Plus,
  Trophy,
  Users,
  X,
} from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { useReveal } from '@/hooks/useReveal'
import {
  ASSIGNMENTS,
  WEEKLY_SCORES,
  getStudentAssignments,
} from '@/data/seed-data'
import { cn } from '@/lib/utils'

/* ------------------------------------------------------------- constants -- */

const INK = '#17161A'
const GREY_200 = '#E3E3E6'

const FACULTY_TH: Record<string, string> = {
  Accounting: 'การบัญชี',
  'Communication Arts': 'นิเทศศาสตร์',
  Engineering: 'วิศวกรรมศาสตร์',
  'Business Admin': 'บริหารธุรกิจ',
  'Digital Media': 'ดิจิทัลมีเดีย',
}

const FACULTY_SHORT: Record<string, string> = {
  Accounting: 'บัญชี',
  'Communication Arts': 'นิเทศ',
  Engineering: 'วิศวะ',
  'Business Admin': 'บริหาร',
  'Digital Media': 'ดิจิทัล',
}

const TOPIC_SHORT: Record<string, string> = {
  t1: 'Globalisation',
  t2: 'Hofstede',
  t3: 'Entry Modes',
  t4: 'Supply Chain',
  t5: "Int'l HRM",
  t6: 'Ethics & CSR',
}

const SERIES = [
  { key: 'class', th: 'ทั้งชั้น', color: INK, width: 3.5 },
  { key: 'Accounting', th: 'การบัญชี', color: '#D12E80', width: 2.5 },
  { key: 'Business Admin', th: 'บริหารธุรกิจ', color: '#8B5CF6', width: 2.5 },
  { key: 'Engineering', th: 'วิศวกรรมศาสตร์', color: '#2563EB', width: 2.5 },
  { key: 'Digital Media', th: 'ดิจิทัลมีเดีย', color: '#F59E0B', width: 2.5 },
  { key: 'Communication Arts', th: 'นิเทศศาสตร์', color: '#0D9488', width: 2.5 },
] as const

/* -------------------------------------------------- MiniCalendar Component -- */

function MiniCalendar({
  onSelectDate,
}: {
  onSelectDate?: (date: number) => void
}) {
  const [selectedDay, setSelectedDay] = useState(16)
  const daysInMonth = 31
  const startDayOffset = 5 // Saturday start for Aug 2026

  const deadlineDays: Record<number, { title: string; color: string; badge: string }> = {
    12: { title: 'HW-2: 3D Flashcards', color: 'bg-emerald-500', badge: 'ปานกลาง' },
    15: { title: 'HW-3: Post-test Hofstede', color: 'bg-amber-500', badge: 'สำคัญ' },
    18: { title: 'HW-4: รายงานกลุ่ม ธุรกิจข้ามชาติ', color: 'bg-rose-500', badge: 'ด่วนที่สุด' },
    20: { title: 'คาบเรียนสด Live Quiz สัปดาห์ที่ 3', color: 'bg-purple-500', badge: 'คาบสด' },
  }

  const grid = []
  for (let i = 0; i < startDayOffset; i++) grid.push(null)
  for (let d = 1; d <= daysInMonth; d++) grid.push(d)

  return (
    <div className="rounded-3xl border border-grey-300/60 bg-paper p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-pink-600" />
          <h3 className="text-base font-extrabold text-ink">ปฏิทินกำหนดส่งงาน</h3>
        </div>
        <div className="flex items-center gap-1">
          <button type="button" className="p-1 text-grey-400 hover:text-ink transition-colors">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-xs font-extrabold text-pink-600 bg-pink-50 px-2.5 py-1 rounded-xl border border-pink-200">
            สิงหาคม 2026
          </span>
          <button type="button" className="p-1 text-grey-400 hover:text-ink transition-colors">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 text-center text-[11px] font-extrabold text-grey-400">
        <span>จ</span>
        <span>อ</span>
        <span>พ</span>
        <span>พฤ</span>
        <span>ศ</span>
        <span>ส</span>
        <span>อา</span>
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {grid.map((day, idx) => {
          if (day === null) {
            return <div key={`empty-${idx}`} className="h-8 w-8" />
          }
          const isToday = day === 16
          const isSelected = day === selectedDay
          const hasDeadline = deadlineDays[day]

          return (
            <button
              key={day}
              type="button"
              onClick={() => {
                setSelectedDay(day)
                if (onSelectDate) onSelectDate(day)
              }}
              className={cn(
                'relative flex h-8 w-8 items-center justify-center rounded-xl text-xs font-bold transition-all mx-auto cursor-pointer',
                isSelected
                  ? 'bg-pink-600 text-white shadow-md shadow-pink-600/30 font-extrabold scale-105'
                  : isToday
                  ? 'bg-pink-100 text-pink-700 font-extrabold border border-pink-300'
                  : 'text-ink hover:bg-canvas'
              )}
            >
              <span>{day}</span>
              {hasDeadline && !isSelected && (
                <span
                  className={cn(
                    'absolute bottom-1 h-1.5 w-1.5 rounded-full',
                    hasDeadline.color
                  )}
                />
              )}
            </button>
          )
        })}
      </div>

      {/* Selected Day Event Box */}
      {deadlineDays[selectedDay] ? (
        <div className="rounded-2xl bg-pink-50/80 p-3 border border-pink-200 text-xs flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <span className={cn('h-2.5 w-2.5 rounded-full shrink-0', deadlineDays[selectedDay].color)} />
            <span className="font-extrabold text-pink-700 line-clamp-1">
              {deadlineDays[selectedDay].title}
            </span>
          </div>
          <span className="text-[10px] font-extrabold text-pink-600 bg-paper px-2 py-0.5 rounded-md border border-pink-300 shrink-0">
            {selectedDay} ส.ค.
          </span>
        </div>
      ) : (
        <p className="text-[11px] text-grey-500 text-center py-1 font-medium">
          คลิกวันที่ในปฏิทินเพื่อดูภาระงานที่ต้องส่ง
        </p>
      )}
    </div>
  )
}

/* -------------------------------------------------- MultiRingChart Component -- */

function MultiRingChart({
  submissionPct = 92,
  participationPct = 83,
  comprehensionPct = 63,
  submissionCount = '22/24',
}: {
  submissionPct?: number
  participationPct?: number
  comprehensionPct?: number
  submissionCount?: string
}) {
  const rings = [
    { label: 'ส่งแล้ว', pct: submissionPct, value: submissionCount, color: '#D12E80', bg: '#FCE7F3', r: 65, strokeWidth: 9 },
    { label: 'มีส่วนร่วม', pct: participationPct, value: `${participationPct}%`, color: '#8B5CF6', bg: '#EDE9FE', r: 50, strokeWidth: 9 },
    { label: 'ความเข้าใจ', pct: comprehensionPct, value: `${comprehensionPct}%`, color: '#0D9488', bg: '#CCFBF1', r: 35, strokeWidth: 9 },
  ]

  return (
    <div className="flex flex-col items-center justify-center h-full p-1">
      <div className="relative flex items-center justify-center w-48 h-48 my-1">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
          {rings.map((ring) => {
            const circumference = 2 * Math.PI * ring.r
            const offset = circumference - (ring.pct / 100) * circumference
            return (
              <g key={ring.label}>
                <circle
                  cx="80"
                  cy="80"
                  r={ring.r}
                  fill="none"
                  stroke={ring.bg}
                  strokeWidth={ring.strokeWidth}
                />
                <circle
                  cx="80"
                  cy="80"
                  r={ring.r}
                  fill="none"
                  stroke={ring.color}
                  strokeWidth={ring.strokeWidth}
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </g>
            )
          })}
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-black text-ink">{submissionPct}%</span>
          <span className="text-[10px] font-extrabold text-pink-600 uppercase tracking-wide">ภาพรวม</span>
        </div>
      </div>

      <div className="w-full space-y-1.5 mt-1">
        {rings.map((ring) => (
          <div key={ring.label} className="flex items-center justify-between rounded-xl bg-canvas px-3 py-1.5 border border-grey-300/40 text-xs">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: ring.color }} />
              <span className="font-extrabold text-ink">{ring.label}</span>
            </div>
            <span className="font-black" style={{ color: ring.color }}>{ring.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------- page ---- */

export default function Dashboard() {
  const navigate = useNavigate()
  const revealRef = useReveal(true)
  const {
    course,
    students,
    responses,
    topics,
    getSubmissionCount,
    getAverageScore,
    getParticipationRate,
  } = useApp()

  const [toast, setToast] = useState<string | null>(null)
  const [remindedIds, setRemindedIds] = useState<Set<string>>(new Set())
  const [taskCategory, setTaskCategory] = useState<string>('all')
  const [visibleSeries, setVisibleSeries] = useState<Record<string, boolean>>({
    class: true,
    Accounting: true,
    'Communication Arts': true,
  })

  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(
    () => () => {
      if (toastTimer.current) clearTimeout(toastTimer.current)
    },
    [],
  )

  const showToast = (msg: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current)
    setToast(msg)
    toastTimer.current = setTimeout(() => setToast(null), 3200)
  }

  const facultyData = useMemo(() => {
    const facultyOf = new Map(students.map((s) => [s.id, s.faculty]))
    const agg = new Map<string, { correct: number; total: number }>()
    for (const s of students) if (!agg.has(s.faculty)) agg.set(s.faculty, { correct: 0, total: 0 })
    for (const r of responses) {
      const faculty = facultyOf.get(r.studentId)
      if (!faculty) continue
      const cell = agg.get(faculty)!
      cell.total += 1
      if (r.isCorrect) cell.correct += 1
    }
    return [...agg.entries()]
      .map(([faculty, { correct, total }]) => ({
        faculty,
        name: FACULTY_TH[faculty] ?? faculty,
        shortName: FACULTY_SHORT[faculty] ?? faculty,
        percent: total ? Math.round((correct / total) * 100) : 0,
      }))
      .sort((a, b) => b.percent - a.percent)
  }, [students, responses])

  const hasData = responses.length > 0
  const liveAverage = getAverageScore()

  const weeklyData = useMemo(() => {
    const liveByFac = Object.fromEntries(facultyData.map((f) => [f.faculty, f.percent]))
    const topicByWeek = new Map(topics.map((t) => [t.week, TOPIC_SHORT[t.id] ?? t.title]))
    return [1, 2, 3, 4, 5, 6].map((week) => {
      const row: Record<string, number | string> = { week, label: `ส.${week}` }
      row.topic = topicByWeek.get(week) ?? `สัปดาห์ ${week}`
      if (week === 2) {
        if (hasData) {
          row.class = liveAverage
          for (const s of SERIES.slice(1)) row[s.key] = liveByFac[s.key] ?? 0
        }
      } else {
        const rec = WEEKLY_SCORES.find((w) => w.week === week)
        if (rec) {
          row.class = rec.classPost
          for (const s of SERIES.slice(1)) row[s.key] = rec.byFaculty[s.key]
        }
      }
      return row
    })
  }, [facultyData, topics, hasData, liveAverage])

  const studentAssignmentData = useMemo(() => {
    return students.map((s) => {
      const hw = getStudentAssignments(s.id, s.avatarSeed)
      return {
        student: s,
        hw,
      }
    })
  }, [students])

  const missingStudents = useMemo(() => {
    return studentAssignmentData
      .filter(({ hw }) => !hw.isComplete)
      .sort((a, b) => b.hw.missingPoints - a.hw.missingPoints)
  }, [studentAssignmentData])

  const submissionPct = Math.round((getSubmissionCount() / students.length) * 100)
  const participationPct = getParticipationRate()
  const comprehensionPct = liveAverage

  const remindOne = (id: string, nickname: string) => {
    setRemindedIds((prev) => new Set(prev).add(id))
    showToast(`ส่งข้อความเตือนถึงคุณ${nickname} ผ่านระบบเรียบร้อยแล้ว`)
  }

  return (
    <div ref={revealRef} className="mx-auto max-w-7xl space-y-6 pb-16">
      {/* Top Greeting Header Row (Ref Matched) */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-ink tracking-tight flex items-center gap-2">
            <span>ยินดีต้อนรับกลับครับ, อาจารย์! 👋</span>
          </h1>
          <p className="text-sm font-medium text-grey-600 mt-0.5">
            {course.code} · {course.name} (ภาคเรียนที่ 1/2569)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => showToast('ส่งออกรายงาน PDF เรียบร้อยแล้ว!')}
            className="inline-flex items-center gap-1.5 rounded-2xl border border-grey-300/80 bg-paper px-4 py-2.5 text-xs font-extrabold text-ink shadow-xs hover:border-pink-300 hover:text-pink-600 transition-all cursor-pointer"
          >
            <FileDown className="h-4 w-4" />
            <span>ส่งออก PDF</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/teacher/studio')}
            className="inline-flex items-center gap-2 rounded-2xl bg-pink-600 px-5 py-2.5 text-xs font-extrabold text-white shadow-md shadow-pink-600/30 hover:bg-pink-700 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>+ สร้างสื่อการเรียน</span>
          </button>
        </div>
      </div>

      {/* TOP 4 PASTEL STAT CARDS ROW (Ref Layout Matched) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Purple */}
        <div className="rounded-3xl border border-purple-200/80 bg-purple-50/50 p-5 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-extrabold text-purple-700 uppercase tracking-wider">
              นักศึกษาทั้งหมด
            </span>
            <p className="text-3xl font-black text-ink">{students.length} คน</p>
            <span className="text-[11px] font-bold text-emerald-600">↑ 12% จากเทอมก่อน</span>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-purple-600 shadow-2xs">
            <Users className="h-7 w-7" />
          </div>
        </div>

        {/* Card 2: Green/Emerald */}
        <div className="rounded-3xl border border-emerald-200/80 bg-emerald-50/50 p-5 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-extrabold text-emerald-700 uppercase tracking-wider">
              ส่งงานเรียบร้อย
            </span>
            <p className="text-3xl font-black text-ink">{getSubmissionCount()} คน</p>
            <span className="text-[11px] font-bold text-emerald-600">↑ 88% จากในคลาส</span>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 shadow-2xs">
            <CheckCircle2 className="h-7 w-7" />
          </div>
        </div>

        {/* Card 3: Amber/Yellow */}
        <div className="rounded-3xl border border-amber-200/80 bg-amber-50/50 p-5 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-extrabold text-amber-700 uppercase tracking-wider">
              ค้างส่งงาน
            </span>
            <p className="text-3xl font-black text-ink">{missingStudents.length} คน</p>
            <span className="text-[11px] font-bold text-rose-600">↓ ขาด 70 คะแนนรวม</span>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 shadow-2xs">
            <Clock className="h-7 w-7" />
          </div>
        </div>

        {/* Card 4: Pink */}
        <div className="rounded-3xl border border-pink-200/80 bg-pink-50/50 p-5 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-extrabold text-pink-700 uppercase tracking-wider">
              คะแนนเฉลี่ยคลาส
            </span>
            <p className="text-3xl font-black text-pink-600">{liveAverage}%</p>
            <span className="text-[11px] font-bold text-emerald-600">↑ 5% สัปดาห์นี้</span>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-100 text-pink-600 shadow-2xs">
            <Trophy className="h-7 w-7" />
          </div>
        </div>
      </div>

      {/* MAIN 2-COLUMN GRID: Left (8 Cols) vs Right Sidebar (4 Cols) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* LEFT COLUMN (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Card A: My Class Tasks & Assignment Table (Scrollable Ref Layout) */}
          <div className="rounded-3xl border border-grey-300/60 bg-paper p-6 shadow-sm space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-grey-300/40 pb-3">
              <div>
                <h2 className="text-lg font-extrabold text-ink">
                  ภาระงาน & ติดตามรายชื่อนักศึกษาค้างส่ง
                </h2>
                <p className="text-xs text-grey-600 mt-0.5 font-medium">
                  รายการการบ้าน และรายชื่อนักศึกษาที่ต้องสะกิดเตือน
                </p>
              </div>

              {/* Task Category Tabs */}
              <div className="flex items-center gap-1 flex-wrap">
                <button
                  type="button"
                  onClick={() => setTaskCategory('all')}
                  className={cn(
                    'rounded-xl px-3 py-1.5 text-xs font-extrabold transition-all cursor-pointer',
                    taskCategory === 'all'
                      ? 'bg-pink-600 text-white shadow-xs'
                      : 'bg-canvas text-grey-600 hover:text-ink'
                  )}
                >
                  ทั้งหมด
                </button>
                <button
                  type="button"
                  onClick={() => setTaskCategory('missing')}
                  className={cn(
                    'rounded-xl px-3 py-1.5 text-xs font-extrabold transition-all cursor-pointer',
                    taskCategory === 'missing'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'bg-canvas text-grey-600 hover:text-ink'
                  )}
                >
                  ค้างส่ง ({missingStudents.length})
                </button>
              </div>
            </div>

            {/* Scrollable Table Matching Ref Layout */}
            <div className="overflow-hidden rounded-2xl border border-grey-300/60 bg-paper shadow-2xs">
              <div className="overflow-x-auto max-h-[300px] overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-canvas border-b border-grey-300/40 text-grey-600 uppercase tracking-wider font-extrabold sticky top-0 z-10 shadow-2xs">
                    <tr>
                      <th className="py-3 px-4">นักศึกษา</th>
                      <th className="py-3 px-4">คณะ</th>
                      <th className="py-3 px-4">งานที่ค้างส่ง</th>
                      <th className="py-3 px-4">ขาดคะแนน</th>
                      <th className="py-3 px-4 text-right">ดำเนินการ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-grey-300/30 font-medium">
                    {missingStudents.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-grey-500 font-bold">
                          🎉 ส่งงานครบทุกคนเรียบร้อยแล้ว!
                        </td>
                      </tr>
                    ) : (
                      missingStudents.map(({ student: s, hw }) => {
                        const isReminded = remindedIds.has(s.id)
                        return (
                          <tr key={s.id} className="hover:bg-pink-50/20 transition-colors">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2.5">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-100 font-extrabold text-pink-700 text-xs shrink-0">
                                  {s.nickname.slice(0, 2)}
                                </div>
                                <div>
                                  <p className="font-extrabold text-ink">
                                    {s.name} <span className="text-pink-600">"{s.nickname}"</span>
                                  </p>
                                  <p className="text-[10px] text-grey-500 font-mono">ID: {s.id}</p>
                                </div>
                              </div>
                            </td>

                            <td className="py-3 px-4">
                              <span className="rounded-md bg-pink-50 px-2 py-0.5 font-bold text-pink-600 border border-pink-200 text-[11px] whitespace-nowrap">
                                {s.faculty}
                              </span>
                            </td>

                            <td className="py-3 px-4">
                              <div className="flex flex-wrap gap-1">
                                {hw.missingList.map((m) => (
                                  <span
                                    key={m.id}
                                    className="rounded bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 border border-rose-200 whitespace-nowrap"
                                  >
                                    {m.code}: {m.title.split('(')[0].trim()}
                                  </span>
                                ))}
                              </div>
                            </td>

                            <td className="py-3 px-4 font-black text-rose-600 whitespace-nowrap">
                              -{hw.missingPoints} คะแนน
                            </td>

                            <td className="py-3 px-4 text-right whitespace-nowrap">
                              <button
                                type="button"
                                onClick={() => remindOne(s.id, s.nickname)}
                                disabled={isReminded}
                                className={cn(
                                  'rounded-xl px-3 py-1.5 text-xs font-extrabold transition-all cursor-pointer',
                                  isReminded
                                    ? 'bg-emerald-100 text-emerald-700 cursor-default'
                                    : 'bg-pink-600 text-white shadow-xs hover:bg-pink-700'
                                )}
                              >
                                {isReminded ? '✓ เตือนแล้ว' : '📲 สะกิดเตือน'}
                              </button>
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Card B: Tasks Overview (Weekly Line Graph Left + MultiRing Right) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Weekly Line Graph (8 Cols) */}
            <div className="rounded-3xl border border-grey-300/60 bg-paper p-6 shadow-sm md:col-span-8 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-ink">ความเข้าใจรายสัปดาห์</h3>
                  <p className="text-xs text-grey-600 font-medium">พัฒนาการแบ่งตามคณะวิชา</p>
                </div>
                <div className="flex flex-wrap gap-1">
                  {SERIES.slice(0, 3).map((s) => (
                    <button
                      key={s.key}
                      type="button"
                      onClick={() => setVisibleSeries((prev) => ({ ...prev, [s.key]: !prev[s.key] }))}
                      className={cn(
                        'rounded-full px-2.5 py-0.5 text-[10px] font-extrabold border cursor-pointer',
                        visibleSeries[s.key] ? 'bg-paper shadow-2xs' : 'opacity-40'
                      )}
                      style={{ color: s.color, borderColor: s.color }}
                    >
                      {s.th}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-56 w-full pt-1">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={GREY_200} vertical={false} />
                    <XAxis dataKey="label" stroke="#888" tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
                    <YAxis domain={[0, 100]} stroke="#888" tickLine={false} tick={{ fontSize: 10 }} />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (!active || !payload?.length) return null
                        const d = payload[0].payload
                        return (
                          <div className="rounded-2xl border border-grey-300 bg-paper p-2.5 shadow-xl text-xs space-y-1 font-bold">
                            <p className="font-extrabold text-ink">ส.{d.week} {d.topic}</p>
                            {payload.map((p) => (
                              <div key={p.name} className="flex justify-between gap-3 text-[11px]">
                                <span style={{ color: p.color }}>{p.name}:</span>
                                <span>{p.value}%</span>
                              </div>
                            ))}
                          </div>
                        )
                      }}
                    />
                    {SERIES.map((s) =>
                      visibleSeries[s.key] ? (
                        <Line
                          key={s.key}
                          name={s.th}
                          type="monotone"
                          dataKey={s.key}
                          stroke={s.color}
                          strokeWidth={s.width}
                          dot={{ r: 3, fill: s.color }}
                        />
                      ) : null
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* MultiRing Donut (4 Cols) */}
            <div className="rounded-3xl border border-grey-300/60 bg-paper p-5 shadow-sm md:col-span-4 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-extrabold text-ink flex items-center gap-1.5">
                  <PieIcon className="h-4 w-4 text-pink-600" />
                  <span>สัดส่วนภาพรวม</span>
                </h3>
                <p className="text-[11px] text-grey-500 font-medium">ส่งแล้ว/มีส่วนร่วม/เข้าใจ</p>
              </div>

              <MultiRingChart
                submissionPct={submissionPct}
                participationPct={participationPct}
                comprehensionPct={comprehensionPct}
                submissionCount={`${getSubmissionCount()}/${students.length}`}
              />
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR COLUMN (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Widget 1: Interactive Mini Calendar (Ref Matched) */}
          <MiniCalendar />

          {/* Widget 2: Overall Participation Progress (Ref Matched) */}
          <div className="rounded-3xl border border-grey-300/60 bg-paper p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-ink">การมีส่วนร่วมในคลาส</h3>
              <span className="text-sm font-black text-purple-600">{getParticipationRate()}%</span>
            </div>

            {/* Soft Green/Purple Progress Bar */}
            <div className="h-3 w-full overflow-hidden rounded-full bg-grey-200">
              <div
                className="h-full rounded-full bg-gradient-to-r from-purple-500 to-emerald-400 transition-all duration-1000"
                style={{ width: `${getParticipationRate()}%` }}
              />
            </div>

            <p className="text-xs text-grey-600 font-medium leading-relaxed">
              <strong>16 จาก 24 คน</strong> ร่วมยกมือตอบคำถามสดในคาบเรียน (Spoke Rate)
            </p>
          </div>

          {/* Widget 3: Upcoming Tasks / Deadlines List (Ref Matched) */}
          <div className="rounded-3xl border border-grey-300/60 bg-paper p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-ink">กำหนดการส่งงานถัดไป</h3>
              <span className="text-xs font-bold text-pink-600 cursor-pointer hover:underline">
                ดูทั้งหมด →
              </span>
            </div>

            <div className="space-y-3">
              {ASSIGNMENTS.map((a) => (
                <div
                  key={a.id}
                  className="flex items-center justify-between rounded-2xl bg-canvas p-3 border border-grey-300/40 hover:border-pink-300 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-pink-100 text-pink-600 font-extrabold text-xs shrink-0">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-extrabold text-ink line-clamp-1">{a.title}</p>
                      <p className="text-[10px] text-grey-500 font-medium">กำหนด {a.dueDate} 2026</p>
                    </div>
                  </div>

                  <span className="rounded-lg bg-pink-50 px-2 py-0.5 text-[10px] font-extrabold text-pink-700 border border-pink-200 shrink-0">
                    {a.code}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[60] flex max-w-sm items-center gap-2.5 rounded-2xl bg-ink px-5 py-3.5 text-xs font-bold text-paper shadow-2xl animate-bounce">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-pink-400" />
          <span>{toast}</span>
          <button type="button" onClick={() => setToast(null)} className="ml-2 text-grey-400 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  )
}
