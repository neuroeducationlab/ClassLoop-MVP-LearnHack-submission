import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  Check,
  CheckCircle2,
  Clock,
  FileDown,
  Flame,
  Search,
  Send,
  Sparkles,
  Star,
  Trophy,
  X,
} from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { WEEKLY_SCORES, type ActivityFormat } from '@/data/seed-data'
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

/** Short axis names so the vertical chart reads at a glance. */
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

/** Line-chart series: class average + one line per faculty, each own colour. */
const SERIES = [
  { key: 'class', th: 'ทั้งชั้น', color: INK, width: 3.5 },
  { key: 'Accounting', th: 'การบัญชี', color: '#D12E80', width: 2.5 },
  { key: 'Business Admin', th: 'บริหารธุรกิจ', color: '#8B5CF6', width: 2.5 },
  { key: 'Engineering', th: 'วิศวกรรมศาสตร์', color: '#2563EB', width: 2.5 },
  { key: 'Digital Media', th: 'ดิจิทัลมีเดีย', color: '#F59E0B', width: 2.5 },
  { key: 'Communication Arts', th: 'นิเทศศาสตร์', color: '#0D9488', width: 2.5 },
] as const

const GAME_SLOT: Record<ActivityFormat, string> = {
  'quick-game': 'เปิดคาบ',
  debate: 'กลางคาบ',
  'case-based': 'ท้ายคาบ',
}

/* ---------------------------------------------------------------- page ---- */

export default function Dashboard() {
  const navigate = useNavigate()
  const {
    course,
    students,
    responses,
    topics,
    generatedContent,
    remediation,
    remediationSent,
    sendRemediation,
    getSubmissionCount,
    getAverageScore,
    getParticipationRate,
  } = useApp()

  const [sheetOpen, setSheetOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [autoRemind, setAutoRemind] = useState(false)
  const [remindedIds, setRemindedIds] = useState<Set<string>>(new Set())
  const [scheduledReminder, setScheduledReminder] = useState<{ date: string; time: string } | null>(null)
  const [remDate, setRemDate] = useState('2026-08-20')
  const [remTime, setRemTime] = useState('18:00')
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

  useEffect(() => {
    if (!sheetOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSheetOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [sheetOpen])

  const showToast = (msg: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current)
    setToast(msg)
    toastTimer.current = setTimeout(() => setToast(null), 3200)
  }

  /* -------- live derivations: everything recomputes when responses move -- */

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

  const pending = useMemo(() => {
    const responded = new Set(responses.map((r) => r.studentId))
    return students.filter((s) => !responded.has(s.id))
  }, [students, responses])

  /** Students scoring below 60% on the live pre-test — remediation targets. */
  const lowScorers = useMemo(() => {
    const correctOf = new Map<string, number>()
    const answered = new Map<string, number>()
    for (const r of responses) {
      answered.set(r.studentId, (answered.get(r.studentId) ?? 0) + 1)
      if (r.isCorrect) correctOf.set(r.studentId, (correctOf.get(r.studentId) ?? 0) + 1)
    }
    return students
      .filter((s) => {
        const total = answered.get(s.id) ?? 0
        if (total === 0) return false
        return ((correctOf.get(s.id) ?? 0) / total) * 100 < 60
      })
      .sort((a, b) => (correctOf.get(a.id) ?? 0) - (correctOf.get(b.id) ?? 0))
  }, [students, responses])

  /**
   * Weekly line-chart rows. Weeks 1/3/4 come from WEEKLY_SCORES history;
   * week 2 (Hofstede) is LIVE from responses so it moves with the demo;
   * weeks 5-6 stay empty (not taught yet) and the lines simply stop.
   */
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

  /** Pre → Post development rows; week 2's post-test is still pending. */
  const devRows = useMemo(() => {
    const rows = WEEKLY_SCORES.map((w) => ({
      week: w.week,
      topic: TOPIC_SHORT[w.topicId] ?? w.topicId,
      pre: w.classPre,
      post: w.classPost as number | null,
    }))
    rows.push({ week: 2, topic: TOPIC_SHORT.t2, pre: hasData ? liveAverage : 0, post: null })
    return rows.sort((a, b) => a.week - b.week)
  }, [hasData, liveAverage])

  const avgDelta = useMemo(() => {
    const deltas = devRows.filter((r) => r.post !== null).map((r) => (r.post as number) - r.pre)
    return deltas.length ? Math.round(deltas.reduce((a, b) => a + b, 0) / deltas.length) : 0
  }, [devRows])

  const stats = [
    { label: 'ส่งแล้ว', value: `${getSubmissionCount()}/${students.length}` },
    { label: 'ความเข้าใจเฉลี่ย', value: `${liveAverage}%` },
    { label: 'มีส่วนร่วม', value: `${getParticipationRate()}%` },
  ]

  /* ------------------------------------------------------------- actions -- */

  const remindOne = (id: string, nickname: string) => {
    setRemindedIds((prev) => new Set(prev).add(id))
    showToast(`ส่งข้อความเตือนถึงคุณ${nickname} แล้ว`)
  }

  const confirmRemediation = () => {
    sendRemediation()
    setSheetOpen(false)
    showToast(`ส่งชุดทบทวนรายบุคคลให้ ${lowScorers.length} คนแล้ว — ดูได้ในแท็บ "เรียน" ฝั่งนักศึกษา`)
  }

  /* -------------------------------------------------------------- render -- */

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-12">
      {/* page header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink">แดชบอร์ด</h1>
          <p className="mt-1 text-[15px] text-grey-600">
            {course.code} · {course.name}
          </p>
        </div>
        <div className="group relative">
          <button
            type="button"
            disabled
            aria-disabled="true"
            className="inline-flex cursor-not-allowed items-center gap-1.5 rounded-lg border border-grey-300/70 px-3 py-2 text-sm font-medium text-grey-300"
          >
            <FileDown className="h-4 w-4" />
            ส่งออกรายงาน PDF
          </button>
          <span
            role="tooltip"
            className="pointer-events-none absolute right-0 top-full z-10 mt-1.5 hidden whitespace-nowrap rounded-md bg-ink px-2 py-1 text-xs text-paper group-hover:block"
          >
            เร็วๆ นี้
          </span>
        </div>
      </div>

      {/* stat cards — big numbers for readability */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value }) => (
          <div key={label} className="rounded-2xl border border-pink-100 bg-pink-50 p-5">
            <p className="text-[15px] font-medium text-ink">{label}</p>
            <p className="mt-2 text-4xl font-bold text-pink-500">{value}</p>
          </div>
        ))}
      </div>

      {/* ============ HERO — weekly understanding, the main display ============ */}
      <div className="rounded-2xl border border-grey-300/50 border-l-[3px] border-l-pink-600 bg-paper p-6 shadow-sm">
        <h2 className="text-lg font-bold text-ink">ความเข้าใจรายหัวข้อ (รายสัปดาห์)</h2>

        <div className="mt-4 h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weeklyData} margin={{ top: 12, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke={GREY_200} strokeDasharray="4 4" />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 14, fill: INK }}
              />
              <YAxis
                domain={[0, 100]}
                ticks={[0, 25, 50, 75, 100]}
                width={38}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6B6A70' }}
              />
              <Tooltip
                formatter={(value: any, name: any) => [`${value}%`, name]}
                labelFormatter={(_: any, payload: any) =>
                  payload?.[0]?.payload
                    ? `สัปดาห์ ${payload[0].payload.week} · ${payload[0].payload.topic}`
                    : ''
                }
                contentStyle={{ borderRadius: 12, border: `1px solid ${GREY_200}`, fontSize: 14 }}
              />
              {SERIES.filter((s) => visibleSeries[s.key]).map((s) => (
                <Line
                  key={s.key}
                  dataKey={s.key}
                  name={s.th}
                  stroke={s.color}
                  strokeWidth={s.width}
                  dot={{ r: 4, fill: s.color, strokeWidth: 0 }}
                  activeDot={{ r: 6 }}
                  animationDuration={800}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* series toggles */}
        <div className="mt-2 flex flex-wrap gap-2">
          {SERIES.map(({ key, th, color }) => {
            const on = !!visibleSeries[key]
            return (
              <button
                key={key}
                type="button"
                onClick={() => setVisibleSeries((prev) => ({ ...prev, [key]: !prev[key] }))}
                className={cn(
                  'inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-medium transition-colors cursor-pointer',
                  on ? 'bg-paper' : 'border-grey-200 text-grey-300',
                )}
                style={on ? { borderColor: color, color } : undefined}
              >
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: on ? color : GREY_200 }}
                />
                {th}
              </button>
            )
          })}
        </div>

        {/* faculty strengths & focus topics */}
        <div className="mt-4 border-t border-grey-300/40 pt-4 space-y-2">
          <p className="text-base font-bold text-ink flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-pink-600" />
            <span>จุดแข็งรายคณะ & บทเรียนที่แต่ละคณะต้องเน้นย้ำ</span>
          </p>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 pt-1">
            {[
              { faculty: 'Accounting', th: 'คณะการบัญชี', color: '#D12E80', best: 'Supply Chain (88%)', focus: "Hofstede's Cultural Dimensions (68%)" },
              { faculty: 'Communication Arts', th: 'คณะนิเทศศาสตร์', color: '#0D9488', best: 'Cross-Cultural Comm (85%)', focus: 'Foreign Entry Modes (40%)' },
              { faculty: 'Engineering', th: 'คณะวิศวกรรมศาสตร์', color: '#2563EB', best: 'Global Strategy (82%)', focus: "Int'l HRM (55%)" },
              { faculty: 'Business Admin', th: 'คณะบริหารธุรกิจ', color: '#8B5CF6', best: 'Hofstede (80%)', focus: 'Supply Chain (58%)' },
              { faculty: 'Digital Media', th: 'คณะดิจิทัลมีเดีย', color: '#F59E0B', best: 'Digital Marketing (86%)', focus: "Hofstede's Cultural Dimensions (40%)" },
            ].map((item) => (
              <div key={item.faculty} className="rounded-xl border border-grey-300/50 bg-canvas p-3 text-xs space-y-1">
                <div className="flex items-center gap-2 font-bold text-ink">
                  <span className="h-3 w-3 rounded-full shrink-0" style={{ background: item.color }} />
                  <span>{item.th}</span>
                </div>
                <p className="text-emerald-700 font-semibold pl-5">
                  ✓ ทำได้ดี: {item.best}
                </p>
                <p className="text-pink-600 font-bold pl-5">
                  📌 ต้องเน้นบท: {item.focus}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* remediation action lives with the weakness it fixes */}
        <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-grey-300/40 pt-4">
          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors cursor-pointer',
              remediationSent
                ? 'border border-pink-300 text-pink-600 hover:bg-pink-50'
                : 'bg-pink-600 text-paper hover:bg-pink-500',
            )}
          >
            {remediationSent ? '✓ ส่งชุดทบทวนแล้ว — ดูรายละเอียด' : 'ส่งชุดทบทวนรายบุคคล →'}
          </button>
          <p className="text-sm text-grey-600">
            วิธีแก้จะไปแสดงรายบุคคลในแท็บ "เรียน" ของนักศึกษา ไม่รกหน้าจอของอาจารย์
          </p>
        </div>
      </div>

      {/* faculty averages (vertical bars) + development */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-grey-300/50 bg-paper p-5 lg:col-span-2">
          <h2 className="flex items-center gap-2 text-lg font-bold text-ink">
            <Search className="h-5 w-5 text-pink-600" />
            <span>คะแนนเฉลี่ยรายคณะ</span>
          </h2>
          <p className="mt-0.5 text-sm text-grey-600">
            Pre-test ล่าสุด · {topics.find((t) => t.id === 't2')?.title ?? 'Hofstede'}
          </p>

          <div className="mt-3 h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={facultyData} margin={{ top: 24, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke={GREY_200} strokeDasharray="4 4" />
                <XAxis
                  dataKey="shortName"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 14, fill: INK }}
                />
                <YAxis domain={[0, 100]} hide />
                <Bar dataKey="percent" radius={[6, 6, 0, 0]} barSize={48} animationDuration={800}>
                  {facultyData.map((entry) => {
                    const matchColor = SERIES.find((s) => s.key === entry.faculty)?.color || '#D12E80'
                    return (
                      <Cell
                        key={entry.faculty}
                        fill={matchColor}
                        strokeWidth={0}
                      />
                    )
                  })}
                  <LabelList
                    dataKey="percent"
                    position="top"
                    formatter={(v: any) => `${v}%`}
                    style={{ fill: INK, fontSize: 14, fontWeight: 600 }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-grey-300/50 bg-paper p-5">
          <h2 className="text-lg font-bold text-ink">พัฒนาการเฉลี่ย</h2>
          <p className="mt-0.5 text-sm text-grey-600">Pre-test → Post-test ต่อสัปดาห์</p>
          <p className="mt-2 text-4xl font-bold text-pink-600">+{avgDelta} จุด</p>
          <div className="mt-3 space-y-2">
            {devRows.map((r) => (
              <div
                key={r.week}
                className="flex items-center justify-between rounded-xl border border-grey-300/40 px-3 py-2.5"
              >
                <span className="text-[15px] font-medium text-ink">
                  ส.{r.week} {r.topic}
                </span>
                {r.post !== null ? (
                  <span className="text-[15px] text-grey-600">
                    {r.pre}→{r.post}{' '}
                    <span className="font-bold text-pink-600">+{r.post - r.pre}</span>
                  </span>
                ) : (
                  <span className="rounded-full bg-pink-50 px-2.5 py-1 text-xs font-semibold text-pink-600">
                    {r.pre > 0 ? `${r.pre} → รอสอบหลังแก้` : 'รอ Pre-test'}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* pending + game ideas */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-grey-300/50 bg-paper p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-ink">ใครยังไม่ส่ง</h2>
            <span className="rounded-full bg-pink-50 px-3 py-1 text-sm font-semibold text-pink-600">
              {pending.length} คน
            </span>
          </div>

          {/* auto reminder */}
          <div className="mt-3 flex items-center justify-between rounded-xl bg-canvas px-4 py-3">
            <div>
              <p className="text-[15px] font-semibold text-ink">เตือนอัตโนมัติ</p>
              <p className="text-sm text-grey-600">เตือนซ้ำทุกวัน 18:00 จนกว่าจะส่งครบ</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={autoRemind}
              onClick={() => {
                const next = !autoRemind
                setAutoRemind(next)
                showToast(
                  next
                    ? 'เปิดเตือนอัตโนมัติแล้ว — ระบบจะเตือนทุกวัน 18:00 จนกว่าจะส่งครบ'
                    : 'ปิดเตือนอัตโนมัติแล้ว',
                )
              }}
              className={cn(
                'relative h-7 w-12 shrink-0 rounded-full transition-colors',
                autoRemind ? 'bg-pink-600' : 'bg-grey-200',
              )}
            >
              <span
                className={cn(
                  'absolute left-0.5 top-0.5 h-6 w-6 rounded-full bg-paper shadow transition-transform',
                  autoRemind && 'translate-x-5',
                )}
              />
            </button>
          </div>

          {pending.length === 0 ? (
            <p className="mt-4 text-[15px] text-grey-600 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>นักศึกษาส่งครบทุกคนแล้ว</span>
            </p>
          ) : (
            <ul className="mt-3 max-h-[264px] space-y-2 overflow-y-auto pr-1">
              {pending.map((s) => (
                <li
                  key={s.id}
                  className="flex items-center gap-3 rounded-xl border border-grey-300/40 px-3 py-2.5"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-grey-100 text-[15px] font-semibold text-grey-600">
                    {s.name.charAt(0)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[15px] font-medium text-ink">
                      {s.name} <span className="text-grey-600">({s.nickname})</span>
                    </p>
                    <span className="mt-0.5 inline-block rounded-full bg-grey-100 px-2 py-0.5 text-xs text-grey-600">
                      {FACULTY_TH[s.faculty] ?? s.faculty}
                    </span>
                  </div>
                  {remindedIds.has(s.id) ? (
                    <span className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-grey-300">
                      <Check className="h-4 w-4" />
                      เตือนแล้ว
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => remindOne(s.id, s.nickname)}
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-pink-300 px-3 py-2 text-sm font-medium text-pink-600 transition-colors hover:bg-pink-50"
                    >
                      <Send className="h-4 w-4" />
                      เตือน
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}

          {/* Automated Schedule Reminder Setter */}
          <div className="mt-4 border-t border-grey-300/40 pt-3 space-y-2">
            <p className="text-xs font-bold text-ink flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-pink-600" />
              <span>ตั้งเวลาแจ้งเตือนอัตโนมัติ (Automated Reminder Schedule)</span>
            </p>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <input
                type="date"
                value={remDate}
                onChange={(e) => setRemDate(e.target.value)}
                className="rounded-xl border border-grey-300 bg-paper px-3 py-2 text-xs font-semibold outline-none focus:border-pink-500"
              />
              <input
                type="time"
                value={remTime}
                onChange={(e) => setRemTime(e.target.value)}
                className="rounded-xl border border-grey-300 bg-paper px-3 py-2 text-xs font-semibold outline-none focus:border-pink-500"
              />
              <button
                type="button"
                onClick={() => {
                  setScheduledReminder({ date: remDate, time: remTime })
                  showToast(`ตั้งเวลาเตือนวันที่ ${remDate} เวลา ${remTime} น. เรียบร้อยแล้ว`)
                }}
                className="rounded-xl bg-pink-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-pink-700 transition-all cursor-pointer"
              >
                ตั้งเวลาเตือนอัตโนมัติ
              </button>
            </div>
            {scheduledReminder && (
              <p className="text-xs font-bold text-emerald-700 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>ตั้งระบบเตือนอัตโนมัติแล้ว: วันที่ {scheduledReminder.date} เวลา {scheduledReminder.time} น.</span>
              </p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {/* Mini Leaderboard Card for Teacher */}
          <div className="rounded-2xl border border-amber-300/80 bg-paper p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-ink flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-500 fill-amber-400" />
                <span>มินิลีดเดอร์บอร์ด (นักศึกษาขยันสูงสุด)</span>
              </h2>
              <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-700 border border-amber-200">
                Top 5
              </span>
            </div>
            <p className="text-xs text-grey-600">
              อัปเดตเรียลไทม์จากคะแนน XP และการตอบคำถามในคาบสด
            </p>

            <div className="space-y-2 pt-1">
              {[
                { rank: 1, name: 'ณัฐ', nickname: 'นัท', faculty: 'ดิจิทัลมีเดีย', xp: 240, streak: 5 },
                { rank: 2, name: 'วรรณา', nickname: 'นุ้ย', faculty: 'การบัญชี', xp: 210, streak: 4 },
                { rank: 3, name: 'ธีรวัฒน์', nickname: 'ต้น', faculty: 'วิศวกรรมศาสตร์', xp: 190, streak: 3 },
                { rank: 4, name: 'พรรณี', nickname: 'พลอย', faculty: 'บริหารธุรกิจ', xp: 160, streak: 3 },
                { rank: 5, name: 'สมชาย', nickname: 'แมน', faculty: 'นิเทศศาสตร์', xp: 140, streak: 2 },
              ].map((st) => (
                <div
                  key={st.rank}
                  className="flex items-center justify-between rounded-xl border border-grey-300/40 bg-canvas p-2.5 text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={cn(
                        'flex h-6 w-6 items-center justify-center rounded-full font-bold text-xs shrink-0',
                        st.rank === 1 && 'bg-amber-100 text-amber-800 border border-amber-300',
                        st.rank === 2 && 'bg-slate-200 text-slate-700 border border-slate-300',
                        st.rank === 3 && 'bg-amber-800/10 text-amber-900 border border-amber-700/20',
                        st.rank > 3 && 'bg-paper text-grey-600 border border-grey-300/40'
                      )}
                    >
                      {st.rank}
                    </span>
                    <div>
                      <p className="font-bold text-ink">
                        {st.name} <span className="text-pink-600">({st.nickname})</span>
                      </p>
                      <span className="text-[10px] text-grey-600">{st.faculty}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-0.5 text-[10px] font-bold text-orange-500 bg-orange-50 px-1.5 py-0.5 rounded-md border border-orange-200">
                      <Flame className="h-3 w-3 fill-orange-400" />
                      {st.streak} วัน
                    </span>
                    <span className="flex items-center gap-1 font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-500" />
                      {st.xp} XP
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Learning Activities Idea */}
          <div className="rounded-2xl border border-grey-300/50 bg-paper p-5">
            <h2 className="text-lg font-bold text-ink flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-pink-600" />
              <span>แก้คาบน่าเบื่อด้วยกิจกรรม Active Learning</span>
            </h2>
            <p className="mt-0.5 text-sm text-grey-600">แทรกช่วงไหนของคาบได้บ้าง</p>
            <div className="mt-3 space-y-2">
              {generatedContent.activities.map((a) => (
                <div key={a.name} className="rounded-xl border border-grey-300/40 px-3 py-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="min-w-0 flex-1 truncate text-[15px] font-semibold text-ink">
                      {a.name}
                    </p>
                    <span className="shrink-0 rounded-full bg-pink-50 px-2.5 py-0.5 text-xs font-semibold text-pink-600">
                      {GAME_SLOT[a.format]} · {a.durationMin} นาที
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => navigate('/teacher/studio')}
              className="mt-3 w-full rounded-xl border border-pink-300 px-3 py-2.5 text-sm font-semibold text-pink-600 transition-colors hover:bg-pink-50 cursor-pointer"
            >
              ดูสคริปต์เกมเต็มในสตูดิโอ →
            </button>
          </div>
        </div>
      </div>

      {/* remediation sheet — teacher confirms, students receive */}
      {sheetOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <button
            type="button"
            aria-label="ปิด"
            onClick={() => setSheetOpen(false)}
            className="absolute inset-0 bg-ink/30 animate-in fade-in duration-200"
          />
          <div className="relative flex h-full w-full max-w-md flex-col overflow-y-auto bg-paper p-6 shadow-xl animate-in slide-in-from-right duration-300">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-ink">ส่งชุดทบทวนรายบุคคล</h2>
                <p className="mt-0.5 text-sm text-grey-600">
                  ระบบจัดเนื้อหาให้ตามคะแนนของแต่ละคน — ไปแสดงในแท็บ "เรียน" ของนักศึกษา
                </p>
              </div>
              <button
                type="button"
                aria-label="ปิดแผง"
                onClick={() => setSheetOpen(false)}
                className="rounded-full p-1.5 text-grey-600 transition-colors hover:bg-pink-50 hover:text-pink-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="mt-5 text-sm font-semibold uppercase tracking-wider text-grey-600">
              ใครจะได้รับ
            </p>
            <div className="mt-2 rounded-2xl border border-pink-200 bg-pink-50 p-4">
              <p className="text-[15px] font-bold text-ink">
                {lowScorers.length} คนที่คะแนน Pre-test ต่ำกว่า 60%
              </p>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {lowScorers.map((s) => (
                  <span
                    key={s.id}
                    className="rounded-full border border-pink-200 bg-paper px-2.5 py-1 text-sm text-ink"
                  >
                    {s.nickname} · {FACULTY_TH[s.faculty] ?? s.faculty}
                  </span>
                ))}
              </div>
              {pending.length > 0 && (
                <p className="mt-2.5 text-sm text-grey-600">
                  อีก {pending.length} คนที่ยังไม่ส่ง จะได้รับแจ้งเตือนให้ทำ Pre-test ก่อน
                </p>
              )}
            </div>

            <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-grey-600">
              ในชุดทบทวนมี
            </p>
            <div className="mt-2 space-y-2">
              <div className="flex items-center gap-3 rounded-xl border border-grey-300/50 px-3.5 py-3">
                <Clock className="h-4 w-4 shrink-0 text-pink-600" />
                <p className="min-w-0 flex-1 text-[15px] font-medium text-ink">
                  {remediation.pairingActivity.name}
                </p>
                <span className="shrink-0 rounded-full bg-pink-50 px-2.5 py-0.5 text-xs font-semibold text-pink-600">
                  ในคาบหน้า · {remediation.pairingActivity.durationMin} นาที
                </span>
              </div>
              {remediation.resources.map((r) => (
                <div
                  key={r.title}
                  className="flex items-center gap-3 rounded-xl border border-grey-300/50 px-3.5 py-3"
                >
                  <span className="h-2 w-2 shrink-0 rounded-full bg-pink-500" />
                  <p className="min-w-0 flex-1 truncate text-[15px] text-ink">{r.title}</p>
                </div>
              ))}
            </div>

            <button
              type="button"
              disabled={remediationSent}
              onClick={confirmRemediation}
              className={cn(
                'mt-6 w-full rounded-xl px-4 py-3 text-[15px] font-semibold transition-colors',
                remediationSent
                  ? 'cursor-not-allowed bg-grey-100 text-grey-300'
                  : 'bg-pink-600 text-paper hover:bg-pink-500',
              )}
            >
              {remediationSent ? 'ส่งแล้ว ✓' : `ยืนยันส่งให้ ${lowScorers.length} คน`}
            </button>
          </div>
        </div>
      )}

      {/* toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[60] flex max-w-sm items-center gap-2 rounded-xl bg-ink px-4 py-3 text-sm text-paper shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-pink-300" />
          {toast}
        </div>
      )}
    </div>
  )
}
