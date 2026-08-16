import { useEffect, useMemo, useRef, useState } from 'react'
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
  AlertCircle,
  CheckCircle2,
  FileDown,
  FileText,
  PieChart as PieIcon,
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
    { label: 'ส่งแล้ว', pct: submissionPct, value: submissionCount, color: '#D12E80', bg: '#FCE7F3', r: 72, strokeWidth: 10 },
    { label: 'มีส่วนร่วมในคลาส', pct: participationPct, value: `${participationPct}%`, color: '#8B5CF6', bg: '#EDE9FE', r: 56, strokeWidth: 10 },
    { label: 'ความเข้าใจเฉลี่ย', pct: comprehensionPct, value: `${comprehensionPct}%`, color: '#0D9488', bg: '#CCFBF1', r: 40, strokeWidth: 10 },
  ]

  return (
    <div className="flex flex-col items-center justify-between h-full p-2">
      <div className="relative flex items-center justify-center w-56 h-56 my-2">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 180 180">
          {rings.map((ring) => {
            const circumference = 2 * Math.PI * ring.r
            const offset = circumference - (ring.pct / 100) * circumference
            return (
              <g key={ring.label}>
                <circle
                  cx="90"
                  cy="90"
                  r={ring.r}
                  fill="none"
                  stroke={ring.bg}
                  strokeWidth={ring.strokeWidth}
                />
                <circle
                  cx="90"
                  cy="90"
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
          <span className="text-3xl font-black text-ink">{submissionPct}%</span>
          <span className="text-[11px] font-extrabold text-pink-600 uppercase tracking-wide mt-0.5">ภาพรวมการเรียน</span>
        </div>
      </div>

      <div className="w-full space-y-2 mt-2">
        {rings.map((ring) => (
          <div key={ring.label} className="flex items-center justify-between rounded-2xl bg-canvas px-3.5 py-2.5 border border-grey-300/40">
            <div className="flex items-center gap-2.5">
              <span className="h-3.5 w-3.5 rounded-full shrink-0 shadow-2xs" style={{ backgroundColor: ring.color }} />
              <span className="text-xs font-extrabold text-ink">{ring.label}</span>
            </div>
            <span className="text-xs font-black" style={{ color: ring.color }}>{ring.value} ({ring.pct}%)</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------- page ---- */

export default function Dashboard() {
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
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string>('all')
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

  // Derive assignment completion stats for each student
  const studentAssignmentData = useMemo(() => {
    return students.map((s) => {
      const hw = getStudentAssignments(s.id, s.avatarSeed)
      return {
        student: s,
        hw,
      }
    })
  }, [students])

  // Filter missing students based on selected assignment filter
  const missingStudents = useMemo(() => {
    return studentAssignmentData
      .filter(({ hw }) => {
        if (hw.isComplete) return false
        if (selectedAssignmentId === 'all') return true
        return hw.missingHwIds.includes(selectedAssignmentId)
      })
      .sort((a, b) => b.hw.missingPoints - a.hw.missingPoints)
  }, [studentAssignmentData, selectedAssignmentId])

  const submissionPct = Math.round((getSubmissionCount() / students.length) * 100)
  const participationPct = getParticipationRate()
  const comprehensionPct = liveAverage

  const remindOne = (id: string, nickname: string) => {
    setRemindedIds((prev) => new Set(prev).add(id))
    showToast(`ส่งข้อความเตือนถึงคุณ${nickname} ผ่านระบบแจ้งเตือนเรียบร้อยแล้ว`)
  }

  return (
    <div ref={revealRef} className="mx-auto max-w-7xl space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-grey-300/40 pb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-ink tracking-tight">
            แดชบอร์ดภาพรวมการเรียน (Analytics Dashboard)
          </h1>
          <p className="text-sm font-medium text-grey-600 mt-0.5">
            {course.code} · {course.name}
          </p>
        </div>
        <button
          type="button"
          onClick={() => showToast('ส่งออกรายงานสรุปย่อ PDF เรียบร้อยแล้ว!')}
          className="inline-flex items-center gap-2 rounded-2xl border border-grey-300/80 bg-paper px-4 py-2 text-xs font-bold text-ink shadow-xs hover:border-pink-300 hover:text-pink-600 transition-all cursor-pointer self-start sm:self-auto"
        >
          <FileDown className="h-4 w-4" />
          <span>ส่งออกรายงาน PDF</span>
        </button>
      </div>

      {/* SECTION 1: TOP ROW — Multi-ring Circle (Left) & Weekly Graph (Right) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* LEFT: Multi-ring Circular Progress Chart */}
        <div className="rounded-3xl border border-grey-300/60 bg-paper p-6 shadow-sm lg:col-span-4 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-ink flex items-center gap-2">
              <PieIcon className="h-5 w-5 text-pink-600" />
              <span>สรุปภาพรวมการเรียน</span>
            </h2>
            <p className="text-xs text-grey-600 mt-0.5 font-medium">
              สถิติการส่งงาน การมีส่วนร่วม และคะแนนเฉลี่ย
            </p>
          </div>

          <MultiRingChart
            submissionPct={submissionPct}
            participationPct={participationPct}
            comprehensionPct={comprehensionPct}
            submissionCount={`${getSubmissionCount()}/${students.length}`}
          />
        </div>

        {/* RIGHT: Weekly Line Graph */}
        <div className="rounded-3xl border border-grey-300/60 bg-paper p-6 shadow-sm lg:col-span-8 space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-ink">
                ความเข้าใจรายหัวข้อ (รายสัปดาห์)
              </h2>
              <p className="text-xs text-grey-600 mt-0.5 font-medium">
                เปรียบเทียบพัฒนาการความเข้าใจรายสัปดาห์แยกตามคณะ
              </p>
            </div>

            {/* Interactive Filter Pills */}
            <div className="flex flex-wrap gap-1.5">
              {SERIES.map((s) => {
                const active = visibleSeries[s.key] ?? false
                return (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() =>
                      setVisibleSeries((prev) => ({ ...prev, [s.key]: !prev[s.key] }))
                    }
                    className={cn(
                      'rounded-full px-3 py-1 text-xs font-extrabold transition-all border cursor-pointer',
                      active
                        ? 'bg-paper shadow-2xs'
                        : 'border-transparent bg-grey-100 text-grey-400 opacity-60'
                    )}
                    style={{
                      borderColor: active ? s.color : undefined,
                      color: active ? s.color : undefined,
                    }}
                  >
                    {s.th}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData} margin={{ top: 12, right: 12, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={GREY_200} vertical={false} />
                <XAxis dataKey="label" stroke="#888" tickLine={false} tick={{ fontSize: 11, fontWeight: 700 }} />
                <YAxis domain={[0, 100]} stroke="#888" tickLine={false} tick={{ fontSize: 11 }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null
                    const d = payload[0].payload
                    return (
                      <div className="rounded-2xl border border-grey-300 bg-paper p-3 shadow-xl text-xs space-y-1.5 font-bold">
                        <p className="font-extrabold text-ink">
                          สัปดาห์ {d.week} · {d.topic}
                        </p>
                        {payload.map((p) => (
                          <div key={p.name} className="flex items-center justify-between gap-4">
                            <span style={{ color: p.color }}>{p.name}:</span>
                            <span className="font-black text-ink">{p.value}%</span>
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
                      dot={{ r: 4, fill: s.color }}
                      activeDot={{ r: 6 }}
                    />
                  ) : null
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* SECTION 2: ASSIGNMENT & HOMEWORK TRACKER (โหมดเช็คการงาน การบ้าน แยกงาน) */}
      <div className="rounded-3xl border border-grey-300/60 bg-paper p-6 shadow-sm space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-grey-300/40 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-pink-100 text-pink-600 font-bold">
                <FileText className="h-4.5 w-4.5" />
              </span>
              <h2 className="text-xl font-extrabold text-ink">
                โหมดเช็คการงาน & การบ้าน (Assignment Tracker)
              </h2>
            </div>
            <p className="text-xs text-grey-600 mt-1 font-medium">
              ติดตามรายละเอียดยอดส่งงาน แยกตามภาระงาน บอกชัดเจนว่าใครขาดงานไหนและขาดกี่คะแนน
            </p>
          </div>

          {/* Filter Pills for Assignments */}
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => setSelectedAssignmentId('all')}
              className={cn(
                'rounded-xl px-3 py-1.5 text-xs font-extrabold transition-all border cursor-pointer',
                selectedAssignmentId === 'all'
                  ? 'border-pink-500 bg-pink-600 text-white shadow-xs'
                  : 'border-grey-300/60 bg-canvas text-grey-600 hover:border-grey-300'
              )}
            >
              งานทั้งหมด (4 งาน)
            </button>
            {ASSIGNMENTS.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => setSelectedAssignmentId(a.id)}
                className={cn(
                  'rounded-xl px-3 py-1.5 text-xs font-extrabold transition-all border cursor-pointer',
                  selectedAssignmentId === a.id
                    ? 'border-pink-500 bg-pink-600 text-white shadow-xs'
                    : 'border-grey-300/60 bg-canvas text-grey-600 hover:border-grey-300'
                )}
              >
                {a.code} ({a.fullScore} คะแนน)
              </button>
            ))}
          </div>
        </div>

        {/* 4 Assignment Cards Overview */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {ASSIGNMENTS.map((a) => {
            const submittedCount = studentAssignmentData.filter(
              ({ hw }) => !hw.missingHwIds.includes(a.id)
            ).length
            const isSelected = selectedAssignmentId === a.id

            return (
              <div
                key={a.id}
                onClick={() => setSelectedAssignmentId(a.id)}
                className={cn(
                  'rounded-2xl border p-4 transition-all cursor-pointer space-y-2',
                  isSelected
                    ? 'border-pink-500 bg-pink-50/40 ring-2 ring-pink-500/20 shadow-xs'
                    : 'border-grey-300/60 bg-canvas hover:border-pink-300 hover:bg-paper'
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-lg bg-pink-100 px-2 py-0.5 font-extrabold text-pink-700 text-xs">
                    {a.code}
                  </span>
                  <span className="text-xs font-bold text-grey-500">กำหนดส่ง {a.dueDate}</span>
                </div>

                <p className="text-sm font-extrabold text-ink line-clamp-1">{a.title}</p>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs font-bold text-grey-600">
                    ส่งแล้ว <strong className="text-pink-600 font-extrabold">{submittedCount}</strong>/{students.length} คน
                  </span>
                  <span className="text-xs font-extrabold text-ink bg-paper border border-grey-300/60 px-2 py-0.5 rounded-md">
                    {a.fullScore} คะแนน
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Detailed Table of Missing Students */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-ink flex items-center gap-1.5">
              <AlertCircle className="h-4 w-4 text-rose-500" />
              <span>รายชื่อนักศึกษาที่ยังส่งงานไม่ครบ ({missingStudents.length} คน)</span>
            </h3>
            {missingStudents.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  missingStudents.forEach(({ student }) =>
                    setRemindedIds((prev) => new Set(prev).add(student.id))
                  )
                  showToast(`ส่งข้อความเตือนรวม ${missingStudents.length} คนเรียบร้อยแล้ว!`)
                }}
                className="rounded-xl border border-pink-300 bg-pink-50 px-3 py-1.5 text-xs font-extrabold text-pink-700 hover:bg-pink-100 transition-colors cursor-pointer"
              >
                📲 สะกิดเตือนทุกคนที่ค้างงาน
              </button>
            )}
          </div>

          <div className="overflow-hidden rounded-2xl border border-grey-300/60 bg-paper shadow-xs">
            <div className="overflow-x-auto max-h-[340px] overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-canvas border-b border-grey-300/40 text-grey-600 uppercase tracking-wider font-extrabold sticky top-0 z-10 shadow-2xs">
                  <tr>
                    <th className="py-3 px-4">นักศึกษา</th>
                    <th className="py-3 px-4">คณะ</th>
                    <th className="py-3 px-4">งานที่ยังไม่ได้ส่ง</th>
                    <th className="py-3 px-4">ขาดคะแนนรวม</th>
                    <th className="py-3 px-4">คะแนนสะสมปัจจุบัน</th>
                    <th className="py-3 px-4 text-right">ดำเนินการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-grey-300/30 font-medium">
                  {missingStudents.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-grey-500 font-bold">
                        🎉 ส่งงานครบหมดทุกคนสำหรับรายการที่เลือก!
                      </td>
                    </tr>
                  ) : (
                    missingStudents.map(({ student: s, hw }) => {
                      const isReminded = remindedIds.has(s.id)

                      return (
                        <tr key={s.id} className="hover:bg-pink-50/20 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2.5">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-100 font-bold text-pink-700 text-xs shrink-0">
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
                                  title={m.title}
                                >
                                  {m.code}: {m.title.split('(')[0].trim()}
                                </span>
                              ))}
                            </div>
                          </td>

                          <td className="py-3 px-4 font-black text-rose-600">
                            -{hw.missingPoints} คะแนน
                          </td>

                          <td className="py-3 px-4 font-bold text-ink">
                            <span className="text-sm font-black text-ink">{hw.totalScore}</span>
                            <span className="text-grey-400 text-xs">/100</span>
                          </td>

                          <td className="py-3 px-4 text-right">
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
      </div>

      {/* SECTION 3: FACULTY STRENGTHS & GAP ANALYSIS */}
      <div className="rounded-3xl border border-grey-300/60 bg-paper p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-extrabold text-ink flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          <span>จุดแข็งรายคณะ & บทเรียนที่แต่ละคณะต้องเน้นย้ำ</span>
        </h2>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-canvas p-4 border border-grey-300/40 space-y-1">
            <p className="text-xs font-bold text-pink-600">คณะการบัญชี</p>
            <p className="text-xs font-extrabold text-ink">✓ ทำได้ดี: Supply Chain (88%)</p>
            <p className="text-xs text-grey-500 font-medium">⚠️ ควรเน้นย้ำ: Cross-Cultural Comm</p>
          </div>
          <div className="rounded-2xl bg-canvas p-4 border border-grey-300/40 space-y-1">
            <p className="text-xs font-bold text-teal-600">คณะนิเทศศาสตร์</p>
            <p className="text-xs font-extrabold text-ink">✓ ทำได้ดี: Cross-Cultural Comm (85%)</p>
            <p className="text-xs text-grey-500 font-medium">⚠️ ควรเน้นย้ำ: Entry Modes & Financials</p>
          </div>
          <div className="rounded-2xl bg-canvas p-4 border border-grey-300/40 space-y-1">
            <p className="text-xs font-bold text-blue-600">คณะวิศวกรรมศาสตร์</p>
            <p className="text-xs font-extrabold text-ink">✓ ทำได้ดี: Global Strategy (82%)</p>
            <p className="text-xs text-grey-500 font-medium">⚠️ ควรเน้นย้ำ: CSR & Soft Skills</p>
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
