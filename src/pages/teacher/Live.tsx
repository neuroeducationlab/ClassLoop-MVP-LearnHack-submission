import { useEffect, useRef, useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Brain,
  Check,
  CheckCircle2,
  Dices,
  FileText,
  Layers,
  Lightbulb,
  LogOut,
  Package,
  Sparkles,
  Users,
  X,
  Zap,
} from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { cn } from '@/lib/utils'
import type { Student } from '@/data/seed-data'

export default function Live() {
  const {
    course,
    topics,
    generatedContent,
    students,
    responses,
    currentSession,
    isSimulating,
    activeActivity,
    simulateStudents,
    nextQuestion,
    prevQuestion,
    revealAnswer,
    startSession,
    endSession,
    pickRandomSpeaker,
  } = useApp()

  // View Mode: 'plan' (ตารางการเรียน & เตรียมสื่อ) or 'live' (สอนเรียลไทม์)
  const [viewMode, setViewMode] = useState<'live' | 'plan'>('plan')

  // Realtime start popup: which topic, pre or post
  const [startModal, setStartModal] = useState(false)
  const [startTopicId, setStartTopicId] = useState('t2')
  const [testPhase, setTestPhase] = useState<'pre' | 'post'>('pre')

  // Modal State for Picked Speaker
  const [pickedSpeaker, setPickedSpeaker] = useState<Student | null>(null)
  const [showModal, setShowModal] = useState(false)

  // Toast Notification State
  const [toastMsg, setToastMsg] = useState<string | null>(null)
  const prevSimulatingRef = useRef(isSimulating)

  // Detect when simulation completes to trigger toast
  useEffect(() => {
    if (prevSimulatingRef.current && !isSimulating) {
      setToastMsg('จำลอง 22 คนเสร็จเรียบร้อย')
      const timer = setTimeout(() => setToastMsg(null), 3500)
      return () => clearTimeout(timer)
    }
    prevSimulatingRef.current = isSimulating
  }, [isSimulating])

  // Current Question Data
  const questions = generatedContent.pretest
  const currentIndex = currentSession.currentQuestionIndex
  const currentQuestion = questions[currentIndex] || questions[0]
  const isAnswerRevealed = currentSession.revealedIndexes.includes(currentIndex)

  // Calculate vote counts for options A, B, C, D of the current question
  const currentResponses = responses.filter(
    (r) => r.questionId === currentQuestion.id
  )
  const totalVotesForQuestion = currentResponses.length

  const chartData = currentQuestion.options.map((optText, optIdx) => {
    const votesCount = currentResponses.filter(
      (r) => r.choiceIndex === optIdx
    ).length
    const labelLetter = String.fromCharCode(65 + optIdx)
    return {
      label: `ข้อ ${labelLetter}`,
      optionLetter: labelLetter,
      fullText: optText,
      count: votesCount,
      isCorrect: optIdx === currentQuestion.answerIndex,
    }
  })

  // Joined students count & list
  const joinedStudentIds = currentSession.joinedStudents

  // Trigger random speaker handler
  const handlePickRandomSpeaker = () => {
    const speaker = pickRandomSpeaker()
    setPickedSpeaker(speaker)
    setShowModal(true)
  }

  // Avatar color generator based on avatarSeed
  const getAvatarStyle = (seed: number) => {
    const colors = [
      'bg-pink-100 text-pink-700 border-pink-300',
      'bg-purple-100 text-purple-700 border-purple-300',
      'bg-blue-100 text-blue-700 border-blue-300',
      'bg-emerald-100 text-emerald-700 border-emerald-300',
      'bg-amber-100 text-amber-700 border-amber-300',
      'bg-rose-100 text-rose-700 border-rose-300',
      'bg-indigo-100 text-indigo-700 border-indigo-300',
      'bg-teal-100 text-teal-700 border-teal-300',
    ]
    return colors[seed % colors.length]
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-24">
      {/* TOP BAR WITH VIEW MODE TOGGLE */}
      <div className="flex flex-col gap-4 rounded-2xl border border-grey-300/60 bg-paper p-5 shadow-xs md:flex-row md:items-center md:justify-between">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-pink-600 animate-ping" />
            <span className="text-xs font-semibold uppercase tracking-wider text-pink-600">
              {viewMode === 'live' ? 'Live Session (โหมดสอน)' : 'Lesson Planning & Media Hub'}
            </span>
          </div>
          <h1 className="text-xl font-bold text-ink">
            คาบเรียน: Hofstede's Cultural Dimensions
          </h1>
          <p className="text-xs text-grey-600">
            {course.name} ({course.code}) • {course.university}
          </p>
        </div>

        {/* TOP BAR CONTROLS & MODE TOGGLE */}
        <div className="flex flex-wrap items-center gap-3">
          {/* View Mode Toggle Switch */}
          <div className="flex items-center rounded-xl bg-canvas p-1 border border-grey-300/60">
            <button
              type="button"
              onClick={() => (viewMode === 'live' ? undefined : setStartModal(true))}
              className={cn(
                'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer',
                viewMode === 'live'
                  ? 'bg-pink-600 text-white shadow-xs'
                  : 'text-grey-600 hover:text-ink'
              )}
            >
              <Zap className="h-3.5 w-3.5" />
              <span>สอนเรียลไทม์</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('plan')}
              className={cn(
                'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer',
                viewMode === 'plan'
                  ? 'bg-pink-600 text-white shadow-xs'
                  : 'text-grey-600 hover:text-ink'
              )}
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>ตาราง & สื่อการสอน</span>
            </button>
          </div>

          {/* CRITICAL BUTTONS IN TOP BAR */}
          <button
            type="button"
            onClick={simulateStudents}
            disabled={isSimulating}
            className="flex items-center gap-1.5 rounded-xl bg-pink-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-pink-600/90 active:scale-[0.98] disabled:opacity-50 transition-all cursor-pointer"
          >
            <Sparkles className="h-4 w-4" />
            <span>{isSimulating ? 'กำลังจำลอง...' : 'จำลองผู้เรียน'}</span>
          </button>

          <button
            type="button"
            onClick={handlePickRandomSpeaker}
            className="flex items-center gap-1.5 rounded-xl border border-grey-300 bg-paper px-4 py-2 text-xs font-bold text-ink shadow-2xs hover:bg-canvas active:scale-[0.98] transition-all cursor-pointer"
          >
            <Dices className="h-4 w-4 text-pink-600" />
            <span>สุ่มคนที่ยังไม่ได้พูด</span>
          </button>
        </div>
      </div>

      {/* VIEW MODE 1: LESSON PLANNING & MEDIA HUB (ตารางการเรียน การเตรียมเนื้อหา กิจกรรม สื่อ) */}
      {viewMode === 'plan' && (
        <div className="space-y-6 animate-fadeIn">
          {/* SECTION 1: 6-WEEK COURSE SCHEDULE TABLE */}
          <div className="rounded-2xl border border-grey-300/60 bg-paper p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-grey-300/40 pb-3">
              <h2 className="text-base font-bold text-ink flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-pink-600" />
                <span>ตารางแผนการสอน 6 สัปดาห์ (Course Plan Schedule)</span>
              </h2>
              <span className="text-xs font-semibold text-pink-600 bg-pink-50 px-3 py-1 rounded-full border border-pink-200">
                สัปดาห์ปัจจุบัน: W2 (Hofstede)
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-ink">
                <thead className="bg-canvas text-grey-600 uppercase font-semibold border-b border-grey-300/40">
                  <tr>
                    <th className="py-3 px-4">สัปดาห์</th>
                    <th className="py-3 px-4">หัวข้อบทเรียน</th>
                    <th className="py-3 px-4">วัตถุประสงค์การเรียนรู้</th>
                    <th className="py-3 px-4">กิจกรรมที่เลือก</th>
                    <th className="py-3 px-4">สถานะ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-grey-300/30">
                  {topics.map((t) => (
                    <tr
                      key={t.id}
                      className={cn(
                        'hover:bg-pink-50/40 transition-colors',
                        t.week === 2 && 'bg-pink-50/70 font-semibold'
                      )}
                    >
                      <td className="py-3.5 px-4 font-bold text-pink-600">
                        สัปดาห์ที่ {t.week}
                      </td>
                      <td className="py-3.5 px-4 font-bold">{t.title}</td>
                      <td className="py-3.5 px-4 text-grey-600 max-w-xs leading-relaxed">
                        {t.learningObjective}
                      </td>
                      <td className="py-3.5 px-4">
                        {t.week === 2 ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-pink-100 px-2.5 py-1 text-[11px] font-bold text-pink-700 border border-pink-300">
                            <Sparkles className="h-3 w-3 text-pink-600" />
                            <span>{activeActivity?.name || 'Cultural Clash Debate'}</span>
                          </span>
                        ) : (
                          <span className="text-grey-600">เตรียมไว้จาก Studio</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        {t.week === 2 ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                            <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                            <span>พร้อมสอน</span>
                          </span>
                        ) : (
                          <span className="rounded-full bg-canvas px-2.5 py-0.5 text-[10px] text-grey-600 border border-grey-300">
                            วางแผนแล้ว
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* SECTION 2 & 3: CONTENT PREPARATION & ACTIVE ACTIVITY DETAILS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Content Preparation */}
            <div className="rounded-2xl border border-grey-300/60 bg-paper p-6 shadow-xs space-y-4">
              <h2 className="text-base font-extrabold text-ink flex items-center gap-2">
                <Brain className="h-5 w-5 text-pink-600" />
                <span>การเตรียมเนื้อหาการสอน</span>
              </h2>

              <div className="space-y-3 text-xs">
                <div className="rounded-xl bg-canvas p-3.5 border border-grey-300/40 space-y-1">
                  <p className="font-bold text-ink">มิติวัฒนธรรม 6 ด้านของ Hofstede:</p>
                  <p className="text-grey-600 leading-relaxed font-medium">
                    1. Power Distance Index (PDI) • 2. Individualism (IDV) • 3. Masculinity (MAS) • 4. Uncertainty Avoidance (UAI) • 5. Long Term Orientation (LTO) • 6. Indulgence (IND)
                  </p>
                </div>

                <div className="rounded-xl bg-pink-50 p-3.5 border border-pink-200 space-y-1">
                  <p className="font-bold text-pink-600">จุดเด่นที่เน้นในคลาสข้ามคณะ:</p>
                  <p className="text-ink leading-relaxed font-medium">
                    เน้นเปรียบเทียบระหว่าง คณะบริหารฯ (ชอบความตรงไปตรงมา) vs คณะดิจิทัลมีเดียฯ (เน้นความคิดสร้างสรรค์แบบเปิด) เพื่อสร้างบรรยากาศแลกเปลี่ยนจริง
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Active Activity Details */}
            <div className="rounded-2xl border-2 border-pink-500/80 bg-paper p-6 shadow-md space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-extrabold text-ink flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-pink-600" />
                  <span>กิจกรรมการเรียนรู้ที่เลือก</span>
                </h2>
                <span className="rounded-full bg-pink-600 px-3 py-1 text-xs font-extrabold text-white shadow-2xs">
                  {activeActivity?.durationMin || 25} นาที
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <h3 className="text-lg font-bold text-ink">{activeActivity?.name || 'Cultural Clash Debate'}</h3>
                  <p className="text-grey-600 mt-1 leading-relaxed font-medium">{activeActivity?.whyItWorks}</p>
                </div>

                <div className="rounded-xl bg-canvas p-3 border border-grey-300/40 space-y-1">
                  <p className="font-bold text-ink flex items-center gap-1.5">
                    <Lightbulb className="h-4 w-4 text-pink-600" />
                    <span>ทำไมกิจกรรมนี้ถึงเวิร์ก:</span>
                  </p>
                  <p className="text-grey-600 leading-relaxed font-medium">{activeActivity?.whyItWorks}</p>
                </div>

                {activeActivity?.materialsNeeded && (
                  <p className="text-grey-600 font-semibold pt-1 flex items-center gap-1.5">
                    <Package className="h-3.5 w-3.5 text-pink-600 shrink-0" />
                    <span>สื่อที่ต้องใช้: {activeActivity.materialsNeeded}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 4: PREPARED MEDIA & RESOURCES */}
          <div className="rounded-2xl border border-grey-300/60 bg-paper p-6 shadow-xs space-y-4">
            <h2 className="text-base font-extrabold text-ink flex items-center gap-2">
              <Layers className="h-5 w-5 text-pink-600" />
              <span>สื่อการสอนและเครื่องมือ</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Media Card 1 */}
              <div className="rounded-xl border border-grey-300/50 bg-canvas p-4 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-pink-600">
                  <span className="flex items-center gap-1.5 font-extrabold">
                    <Layers className="h-4 w-4 text-pink-600" />
                    <span>สรุป Flashcards 8 ใบ</span>
                  </span>
                  <span className="text-[11px] bg-pink-100 text-pink-700 px-2 py-0.5 rounded-md font-bold">8 การ์ด</span>
                </div>
                <p className="text-xs text-grey-600 leading-relaxed font-medium">
                  การ์ด 3D พลิกอ่านสรุปมิติวัฒนธรรม พร้อมคำใบ้และตัวอย่างจริง
                </p>
              </div>

              {/* Media Card 2 */}
              <div className="rounded-xl border border-grey-300/50 bg-canvas p-4 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-pink-600">
                  <span className="flex items-center gap-1.5 font-extrabold">
                    <FileText className="h-4 w-4 text-pink-600" />
                    <span>แบบทดสอบ Pre-test</span>
                  </span>
                  <span className="text-[11px] bg-pink-100 text-pink-700 px-2 py-0.5 rounded-md font-bold">5 ข้อ</span>
                </div>
                <p className="text-xs text-grey-600 leading-relaxed font-medium">
                  โจทย์ทดสอบความเข้าใจ พร้อมข้อสังเกตและแนวคิดการวิเคราะห์
                </p>
              </div>

              {/* Media Card 3 */}
              <div className="rounded-xl border border-grey-300/50 bg-canvas p-4 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-pink-600">
                  <span className="flex items-center gap-1.5 font-extrabold">
                    <BarChart className="h-4 w-4 text-pink-600" />
                    <span>กราฟคำตอบเรียลไทม์</span>
                  </span>
                  <span className="text-[11px] bg-pink-100 text-pink-700 px-2 py-0.5 rounded-md font-bold">กราฟสด</span>
                </div>
                <p className="text-xs text-grey-600 leading-relaxed font-medium">
                  กราฟแท่งสีชมพูแสดงสัดส่วนการตอบของนักศึกษาแบบเรียลไทม์
                </p>
              </div>
            </div>

            {/* Launch Button to Switch to Live Screen */}
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => setStartModal(true)}
                className="inline-flex items-center gap-2.5 rounded-2xl bg-pink-600 py-3.5 px-8 text-base font-black text-white shadow-lg shadow-pink-600/30 hover:bg-pink-700 active:scale-[0.98] transition-all cursor-pointer"
              >
                <Zap className="h-5 w-5 fill-white" />
                <span>เข้าสู่โหมดสอนเรียลไทม์</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE 2: INTERACTIVE LIVE CONTROL SCREEN */}
      {viewMode === 'live' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 animate-fadeIn">
          {/* LEFT 60% (col-span-7) */}
          <div className="space-y-6 lg:col-span-7">
            {/* Question Container Card */}
            <div className="rounded-2xl border border-grey-300/60 bg-paper p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-pink-50 px-3 py-1 text-xs font-bold text-pink-600 border border-pink-200">
                  คำถามข้อที่ {currentIndex + 1} / {questions.length}
                </span>
                <span className="text-xs font-medium text-grey-600">
                  ความยาก: {currentQuestion.difficulty}
                </span>
              </div>

              {/* Question Text displayed large (24px+) */}
              <h2 className="text-2xl font-bold leading-tight text-ink">
                {currentQuestion.stem}
              </h2>

              {/* 4 Option Cards */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {currentQuestion.options.map((optionText, optIdx) => {
                  const isCorrectChoice = optIdx === currentQuestion.answerIndex
                  const isRevealedCorrect = isAnswerRevealed && isCorrectChoice
                  const labelLetter = String.fromCharCode(65 + optIdx)

                  return (
                    <div
                      key={optIdx}
                      className={cn(
                        'flex items-start gap-3 rounded-xl p-4 text-sm font-semibold transition-all border',
                        isRevealedCorrect
                          ? 'bg-pink-600 text-white border-pink-600 shadow-md ring-2 ring-pink-500/30'
                          : 'bg-canvas text-ink border-grey-300/60 hover:border-pink-300'
                      )}
                    >
                      <span
                        className={cn(
                          'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold',
                          isRevealedCorrect
                            ? 'bg-white text-pink-600'
                            : 'bg-pink-100 text-pink-700'
                        )}
                      >
                        {labelLetter}
                      </span>
                      <span className="flex-1 pt-0.5 leading-snug">{optionText}</span>
                      {isRevealedCorrect && (
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-pink-600">
                          <Check className="h-4 w-4 stroke-[3]" />
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Below Options: Recharts BarChart */}
            <div className="rounded-2xl border border-grey-300/60 bg-paper p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-ink flex items-center gap-2">
                    <BarChart className="h-5 w-5 text-pink-600" />
                    <span>ผลการตอบคำถามของผู้เรียน (Live Chart)</span>
                  </h3>
                  <p className="text-xs text-grey-600">
                    อัปเดตแบบเรียลไทม์เมื่อมีการจำลอง/ตอบคำถาม ({totalVotesForQuestion} คำตอบ)
                  </p>
                </div>
              </div>

              <div className="h-[220px] w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis
                      dataKey="label"
                      tick={{ fill: '#2A262E', fontSize: 12, fontWeight: 600 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fill: '#64748B', fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload
                          return (
                            <div className="rounded-xl bg-ink p-3 text-xs text-paper shadow-xl space-y-1">
                              <p className="font-bold text-pink-400">
                                {data.label}: {data.fullText}
                              </p>
                              <p className="font-semibold text-white">
                                จำนวนคนตอบ: {data.count} คน
                              </p>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Bar dataKey="count" radius={[8, 8, 0, 0]} barSize={40} animationDuration={400}>
                      {chartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={isAnswerRevealed && entry.isCorrect ? '#DB2777' : '#EC4899'}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* RIGHT 40% (col-span-5) */}
          <div className="space-y-6 lg:col-span-5">
            {/* Join Code Card */}
            <div className="rounded-2xl border-2 border-pink-500/80 bg-paper p-6 shadow-md space-y-4 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-grey-600">
                รหัสเข้าร่วมกิจกรรม (Join Code)
              </span>

              {/* Code displayed in very large mono type */}
              <div className="rounded-2xl bg-canvas py-4 font-mono text-5xl font-black tracking-widest text-ink border-2 border-pink-200 shadow-inner">
                HF2024
              </div>

              {/* Counter */}
              <div className="flex items-center justify-center gap-2 text-sm font-bold text-pink-600">
                <Users className="h-4 w-4" />
                <span>
                  เข้าร่วมแล้ว {joinedStudentIds.length} / {students.length} คน
                </span>
              </div>

              {/* Grid of small avatar circles */}
              <div className="pt-2">
                <div className="grid grid-cols-6 gap-2 sm:grid-cols-8">
                  {students.map((student) => {
                    const isJoined = joinedStudentIds.includes(student.id)
                    const colorStyle = getAvatarStyle(student.avatarSeed)

                    return (
                      <div
                        key={student.id}
                        title={`${student.name} (${student.nickname}) - ${student.faculty}`}
                        className={cn(
                          'relative flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 border',
                          isJoined
                            ? `${colorStyle} scale-100 opacity-100 shadow-2xs`
                            : 'bg-canvas text-grey-300 border-grey-300/40 scale-75 opacity-40'
                        )}
                      >
                        {student.nickname.slice(0, 2)}
                        {isJoined && (
                          <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-pink-600 text-[8px] text-white">
                            ✓
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM CONTROLS STICKY BAR */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-grey-300/60 bg-paper py-3.5 shadow-lg">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={prevQuestion}
              disabled={currentIndex === 0}
              className="flex items-center gap-1.5 rounded-xl border border-grey-300 bg-paper px-4 py-2 text-xs font-bold text-ink hover:bg-canvas disabled:opacity-40 transition-all cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>ก่อนหน้า</span>
            </button>

            <button
              type="button"
              onClick={nextQuestion}
              disabled={currentIndex === questions.length - 1}
              className="flex items-center gap-1.5 rounded-xl border border-grey-300 bg-paper px-4 py-2 text-xs font-bold text-ink hover:bg-canvas disabled:opacity-40 transition-all cursor-pointer"
            >
              <span>ถัดไป</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={revealAnswer}
              className={cn(
                'flex items-center gap-1.5 rounded-xl px-5 py-2 text-xs font-bold transition-all cursor-pointer',
                isAnswerRevealed
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-pink-600 text-white shadow-md hover:bg-pink-600/90'
              )}
            >
              <Check className="h-4 w-4" />
              <span>{isAnswerRevealed ? 'เฉลยแล้ว ✓' : 'เฉลย'}</span>
            </button>

            <button
              type="button"
              onClick={endSession}
              className="flex items-center gap-1.5 rounded-xl border border-grey-300 bg-paper px-4 py-2 text-xs font-bold text-grey-600 hover:bg-rose-50 hover:text-rose-600 transition-all cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span>จบกิจกรรม</span>
            </button>
          </div>
        </div>
      </div>

      {/* MODAL FOR RANDOM SPEAKER */}
      {showModal && pickedSpeaker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="w-full max-w-md space-y-5 rounded-3xl border-2 border-pink-500 bg-paper p-6 shadow-2xl text-center">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-full bg-canvas p-1.5 text-grey-600 hover:text-ink cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-pink-600 font-black text-3xl text-white shadow-lg shadow-pink-600/30">
                {pickedSpeaker.nickname.slice(0, 2)}
              </div>

              <div>
                <h3 className="text-2xl font-black text-ink">{pickedSpeaker.name}</h3>
                <p className="text-base font-bold text-pink-600 mt-0.5">
                  "{pickedSpeaker.nickname}"
                </p>
              </div>

              <div className="pt-1">
                <span className="inline-block rounded-full bg-pink-50 px-4 py-1.5 text-xs font-bold text-pink-600 border border-pink-200">
                  คณะ: {pickedSpeaker.faculty}
                </span>
              </div>

              <p className="text-xs text-grey-600 pt-2">
                พูดไปแล้วทั้งหมด {pickedSpeaker.spokeCount} ครั้ง
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="flex w-full min-h-[48px] items-center justify-center rounded-2xl bg-pink-600 py-3 text-sm font-bold text-white shadow-md hover:bg-pink-600/90 transition-all cursor-pointer"
            >
              ตกลง (เชิญแสดงความคิดเห็น)
            </button>
          </div>
        </div>
      )}

      {/* MODAL: START REALTIME TEST (which topic, pre or post) */}
      {startModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="w-full max-w-md space-y-5 rounded-3xl border-2 border-pink-500 bg-paper p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-xl font-black text-ink">เริ่มแบบทดสอบเรียลไทม์</h3>
                <p className="mt-1 text-xs text-grey-600">
                  เลือกบทและช่วงการวัดผล — คะแนนจะไหลเข้าแดชบอร์ดทันที
                </p>
              </div>
              <button
                type="button"
                onClick={() => setStartModal(false)}
                className="rounded-full bg-canvas p-1.5 text-grey-600 hover:text-ink cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-grey-600">บทเรียน</p>
              <select
                value={startTopicId}
                onChange={(e) => setStartTopicId(e.target.value)}
                className="w-full rounded-xl border border-grey-300/80 bg-canvas px-3 py-2.5 text-sm font-semibold text-ink outline-none focus:border-pink-500 cursor-pointer"
              >
                {topics.map((t) => (
                  <option key={t.id} value={t.id}>
                    สัปดาห์ {t.week} · {t.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-grey-600">ช่วงการวัดผล</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTestPhase('pre')}
                  className={cn(
                    'rounded-xl border-2 px-4 py-3 text-sm font-bold transition-all cursor-pointer',
                    testPhase === 'pre'
                      ? 'border-pink-600 bg-pink-50 text-pink-600'
                      : 'border-grey-300/60 text-grey-600 hover:border-pink-300'
                  )}
                >
                  Pre-test
                  <span className="block text-[10px] font-semibold text-grey-600">ก่อนเริ่มสอน</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTestPhase('post')}
                  className={cn(
                    'rounded-xl border-2 px-4 py-3 text-sm font-bold transition-all cursor-pointer',
                    testPhase === 'post'
                      ? 'border-pink-600 bg-pink-50 text-pink-600'
                      : 'border-grey-300/60 text-grey-600 hover:border-pink-300'
                  )}
                >
                  Post-test
                  <span className="block text-[10px] font-semibold text-grey-600">หลังสอนจบบท</span>
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                const topic = topics.find((t) => t.id === startTopicId)
                startSession()
                setViewMode('live')
                setStartModal(false)
                setToastMsg(
                  `เริ่ม ${testPhase === 'pre' ? 'Pre-test' : 'Post-test'}: ${topic?.title ?? ''}`
                )
                setTimeout(() => setToastMsg(null), 3500)
              }}
              className="flex w-full min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-pink-600 py-3 text-sm font-bold text-white shadow-md hover:bg-pink-600/90 transition-all cursor-pointer"
            >
              <Zap className="h-4 w-4" />
              เริ่มแบบทดสอบ
            </button>
          </div>
        </div>
      )}

      {/* FLOATING TOAST */}
      {toastMsg && (
        <div className="fixed bottom-20 right-6 z-50 flex items-center gap-2 rounded-2xl bg-ink px-5 py-3 text-xs font-bold text-white shadow-2xl animate-bounce">
          <Check className="h-4 w-4 text-pink-500" />
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  )
}
