import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Check,
  CheckCircle2,
  ChevronRight,
  Flame,
  RotateCcw,
  Search,
  Sparkles,
  Star,
  Trophy,
  Zap,
} from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { cn } from '@/lib/utils'
import type { Student } from '@/data/seed-data'

export default function Join() {
  const navigate = useNavigate()
  const { students, generatedContent } = useApp()

  // Game Flow Steps: 1 = Identity Selection, 2 = Question Screen, 3 = Results Screen
  const [step, setStep] = useState<1 | 2 | 3>(1)

  // Step 1: Selected Student & Search State
  const [activeStudent, setActiveStudent] = useState<Student | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Step 2: Game State
  const [qIndex, setQIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [maxStreak, setMaxStreak] = useState(0)
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  // Pretest Questions from generatedContent
  const questions = generatedContent.pretest
  const currentQuestion = questions[qIndex] || questions[0]

  // Filter students for Step 1
  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.faculty.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Step 1: Choose student identity
  const handleSelectStudent = (student: Student) => {
    setActiveStudent(student)
    setStep(2)
    setQIndex(0)
    setScore(0)
    setStreak(0)
    setMaxStreak(0)
    setSelectedChoice(null)
    setShowFeedback(false)
  }

  // Step 2: Handle Answer Selection
  const handleAnswer = (choiceIdx: number) => {
    if (selectedChoice !== null) return // prevent multi-click

    setSelectedChoice(choiceIdx)
    setShowFeedback(true)

    const correct = choiceIdx === currentQuestion.answerIndex
    setIsCorrect(correct)

    if (correct) {
      setScore((prev) => prev + 10)
      setStreak((prev) => {
        const newStreak = prev + 1
        setMaxStreak((m) => Math.max(m, newStreak))
        return newStreak
      })
    } else {
      setStreak(0)
    }

    // Auto advance after 2.5 seconds
    setTimeout(() => {
      if (qIndex < questions.length - 1) {
        setQIndex((prev) => prev + 1)
        setSelectedChoice(null)
        setShowFeedback(false)
      } else {
        setStep(3) // Proceed to Results
      }
    }, 2500)
  }

  // Restart quiz
  const handleRestart = () => {
    setStep(1)
    setActiveStudent(null)
    setQIndex(0)
    setScore(0)
    setStreak(0)
    setMaxStreak(0)
    setSelectedChoice(null)
    setShowFeedback(false)
  }

  return (
    <div className="mx-auto w-full max-w-[390px] space-y-4 pb-12">
      {/* STEP 1: IDENTITY SELECTION */}
      {step === 1 && (
        <div className="space-y-4 animate-pop">
          {/* Header Card */}
          <div className="rounded-3xl border-2 border-pink-300/80 bg-paper p-5 text-center shadow-md space-y-3">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-100 text-pink-600 shadow-inner">
              <Zap className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-ink">เข้าร่วมภารกิจรอบนี้</h1>
              <p className="text-xs text-grey-600 mt-0.5">
                เลือกชื่อของคุณเพื่อเริ่มตอบคำถามท้าดวล
              </p>
            </div>

            {/* Pre-filled Join Code */}
            <div className="flex items-center justify-between rounded-xl bg-pink-50 px-3.5 py-2 border border-pink-200">
              <span className="text-xs font-semibold text-pink-600">รหัสเข้าร่วม:</span>
              <span className="font-mono text-base font-black text-ink tracking-wider">
                HF2024
              </span>
            </div>
          </div>

          {/* Student Search */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-grey-600" />
              <input
                type="text"
                placeholder="ค้นหาชื่อ หรือ ชื่อเล่น..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl border border-grey-300/80 bg-paper pl-10 pr-4 py-3 text-sm text-ink outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all"
              />
            </div>

            {/* List of 24 Students */}
            <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
              {filteredStudents.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleSelectStudent(s)}
                  className="w-full min-h-[56px] py-3 px-4 rounded-2xl border-2 border-grey-300/60 bg-paper hover:border-pink-500 hover:bg-pink-50/50 active:scale-[0.98] transition-all flex items-center justify-between text-left cursor-pointer shadow-2xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pink-100 text-pink-700 font-bold text-xs">
                      {s.nickname.slice(0, 2)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-ink">{s.name}</span>
                        <span className="text-xs font-semibold text-pink-600">
                          "{s.nickname}"
                        </span>
                      </div>
                      <span className="inline-block rounded-md bg-canvas px-2 py-0.5 text-[10px] font-medium text-grey-600 border border-grey-300/40 mt-0.5">
                        {s.faculty}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-grey-300 group-hover:text-pink-600" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: QUESTION SCREEN */}
      {step === 2 && activeStudent && (
        <div className="space-y-4 animate-fadeIn">
          {/* Player Header Bar */}
          <div className="flex items-center justify-between rounded-2xl border border-pink-200 bg-pink-50 p-3 shadow-2xs">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-600 text-xs font-bold text-white">
                {activeStudent.nickname.slice(0, 2)}
              </div>
              <div>
                <p className="text-xs font-bold text-ink">{activeStudent.nickname}</p>
                <p className="text-[10px] text-pink-600 font-medium">{activeStudent.faculty}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 rounded-full bg-paper px-2.5 py-1 text-xs font-bold text-amber-600 border border-amber-200">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
                {score} XP
              </span>
              <span className="rounded-full bg-pink-600 px-2.5 py-1 text-xs font-bold text-white">
                {qIndex + 1} / {questions.length}
              </span>
            </div>
          </div>

          {/* Question Card */}
          <div className="space-y-4 rounded-3xl border-2 border-grey-300/60 bg-paper p-5 shadow-xs">
            <div className="flex items-center justify-between text-xs font-bold text-grey-600">
              <span>ภารกิจข้อที่ {qIndex + 1}</span>
              {streak > 1 && (
                <span className="flex items-center gap-1 text-orange-500 animate-bounce">
                  <Flame className="h-4 w-4 fill-orange-400" />
                  <span>{streak} ติดต่อกัน!</span>
                </span>
              )}
            </div>

            {/* Question Stem (18px+) */}
            <h2 className="text-lg lg:text-xl font-bold text-ink leading-snug">
              {currentQuestion.stem}
            </h2>

            {/* 4 Big Option Buttons (Alternating Pink-300 / Pink-50, min 64px height) */}
            <div className="space-y-3 pt-2">
              {currentQuestion.options.map((optionText, optIdx) => {
                const isSelected = selectedChoice === optIdx
                const isAnswer = optIdx === currentQuestion.answerIndex
                const isAlt = optIdx % 2 === 1

                let bgClass = isAlt
                  ? 'bg-pink-300 border-pink-400 text-ink'
                  : 'bg-pink-50 border-pink-200 text-ink'

                if (showFeedback) {
                  if (isAnswer) {
                    bgClass = 'bg-pink-600 border-pink-600 text-white font-bold shadow-md'
                  } else if (isSelected && !isAnswer) {
                    bgClass = 'bg-rose-100 border-rose-300 text-rose-800 opacity-90'
                  } else {
                    bgClass = 'bg-canvas border-grey-300 text-grey-600 opacity-60'
                  }
                }

                return (
                  <button
                    key={optIdx}
                    type="button"
                    onClick={() => handleAnswer(optIdx)}
                    disabled={selectedChoice !== null}
                    className={cn(
                      'w-full min-h-[64px] py-3.5 px-4 text-sm font-semibold rounded-2xl border-2 transition-all flex items-center justify-between text-left cursor-pointer active:scale-[0.98]',
                      bgClass
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold border',
                          showFeedback && isAnswer
                            ? 'bg-white text-pink-600 border-white'
                            : 'bg-paper text-grey-600 border-grey-300'
                        )}
                      >
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className="leading-snug">{optionText}</span>
                    </div>

                    {showFeedback && isAnswer && (
                      <Check className="h-5 w-5 text-white shrink-0 stroke-[3]" />
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Feedback & Confetti Container */}
          {showFeedback && (
            <div className="space-y-3 animate-pop">
              {isCorrect ? (
                /* Correct Answer Feedback */
                <div className="relative overflow-hidden rounded-2xl border-2 border-emerald-300 bg-emerald-50 p-4 text-center space-y-1 shadow-md">
                  {/* CSS Confetti Sparkle Icons */}
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <Sparkles className="animate-confetti h-6 w-6 text-amber-500 absolute" />
                    <Star className="animate-confetti h-5 w-5 text-pink-500 absolute delay-100 fill-pink-500" />
                    <CheckCircle2 className="animate-confetti h-6 w-6 text-emerald-500 absolute delay-200" />
                  </div>

                  <p className="text-base font-extrabold text-emerald-700 flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    <span>ยอดเยี่ยมมาก! ตอบถูกรอบนี้</span>
                  </p>
                  <p className="animate-bounce text-3xl font-black text-pink-600">
                    +10 XP
                  </p>
                </div>
              ) : (
                /* Gentle Wrong Answer Card (NEVER USE "ผิด") */
                <div className="rounded-2xl border-2 border-pink-300 bg-pink-50 p-4 space-y-2 shadow-xs">
                  <div className="flex items-center gap-2 text-base font-bold text-pink-600">
                    <Sparkles className="h-5 w-5" />
                    <span>ลองคิดใหม่นะ</span>
                  </div>
                  <p className="text-xs text-grey-600 leading-relaxed">
                    <strong>คำแนะนำ: </strong>{currentQuestion.misconception}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* STEP 3: RESULTS SCREEN */}
      {step === 3 && activeStudent && (
        <div className="space-y-5 animate-pop">
          {/* Header Card */}
          <div className="rounded-3xl border-2 border-pink-300/80 bg-paper p-6 text-center shadow-md space-y-3">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-pink-100 text-pink-600 shadow-inner">
              <Trophy className="h-9 w-9 text-amber-500" />
            </div>
            <div>
              <span className="inline-flex items-center gap-1 rounded-full bg-pink-50 px-3 py-1 text-xs font-bold text-pink-600 border border-pink-200">
                <Sparkles className="h-3.5 w-3.5 text-pink-600" />
                <span>ภารกิจเสร็จสิ้น</span>
              </span>
              <h1 className="mt-2 text-2xl font-bold text-ink">ผลการท้าดวลรอบนี้</h1>
              <p className="text-xs text-grey-600">
                เก่งมากคุณ {activeStudent.nickname} ทำสำเร็จแล้ว!
              </p>
            </div>

            {/* XP & Streak Stat Box */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="rounded-2xl bg-pink-50 p-3 text-center border border-pink-200">
                <span className="text-[11px] font-semibold text-grey-600">XP ที่ได้รับ</span>
                <p className="text-2xl font-black text-pink-600 flex items-center justify-center gap-1">
                  <Star className="h-5 w-5 fill-amber-400 text-amber-500" />
                  <span>{score} XP</span>
                </p>
              </div>
              <div className="rounded-2xl bg-amber-50 p-3 text-center border border-amber-200">
                <span className="text-[11px] font-semibold text-grey-600">Streak สูงสุด</span>
                <p className="text-2xl font-black text-amber-600 flex items-center justify-center gap-1">
                  <Flame className="h-5 w-5 fill-amber-500 text-amber-500" />
                  <span>{maxStreak} ข้อ</span>
                </p>
              </div>
            </div>
          </div>

          {/* Leaderboard Card (Top 5 + User's position - Never show bottom ranks!) */}
          <div className="rounded-3xl border border-grey-300/60 bg-paper p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-ink flex items-center gap-1.5">
                <Trophy className="h-4 w-4 text-amber-500" />
                <span>อันดับยอดเยี่ยมในคลาส</span>
              </h3>
              <span className="text-xs font-bold text-pink-600">
                คุณอยู่อันดับที่ 5 จาก 24
              </span>
            </div>

            <div className="space-y-2">
              {[
                { rank: 1, name: 'กิตติ', nickname: 'กิ๊ก', faculty: 'Communication Arts', xp: 50 },
                { rank: 2, name: 'วรรณา', nickname: 'นุ้ย', faculty: 'Accounting', xp: 50 },
                { rank: 3, name: 'พรรณี', nickname: 'พลอย', faculty: 'Business Admin', xp: 40 },
                { rank: 4, name: 'ธีรวัฒน์', nickname: 'ต้น', faculty: 'Engineering', xp: 40 },
                { rank: 5, name: activeStudent.name, nickname: activeStudent.nickname, faculty: activeStudent.faculty, xp: Math.max(score, 30) },
              ].map((item) => {
                const isUser = item.nickname === activeStudent.nickname
                return (
                  <div
                    key={item.rank}
                    className={cn(
                      'flex items-center justify-between rounded-2xl p-3 text-xs border font-medium',
                      isUser
                        ? 'border-pink-300 bg-pink-50 text-pink-700 font-bold'
                        : 'border-grey-300/40 bg-canvas text-ink'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className={cn(
                        'flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold shrink-0',
                        item.rank === 1 && 'bg-amber-100 text-amber-700 border border-amber-300',
                        item.rank === 2 && 'bg-slate-200 text-slate-700 border border-slate-300',
                        item.rank === 3 && 'bg-amber-700/10 text-amber-800 border border-amber-700/20',
                        item.rank > 3 && 'bg-paper text-grey-600 border border-grey-300/40'
                      )}>
                        {item.rank}
                      </span>
                      <div>
                        <span className="font-bold">{item.name} ({item.nickname})</span>
                        <p className="text-[10px] text-grey-600">
                          {item.faculty}
                        </p>
                      </div>
                    </div>
                    <span className={cn('font-black text-sm', isUser ? 'text-white' : 'text-pink-600')}>
                      {item.xp} XP
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => navigate('/student')}
              className="w-full min-h-[56px] rounded-2xl bg-pink-600 py-3.5 px-4 text-base font-bold text-white shadow-md hover:bg-pink-600/90 transition-all cursor-pointer text-center"
            >
              กลับไปหน้าหลัก (Home)
            </button>

            <button
              type="button"
              onClick={handleRestart}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-grey-300 bg-paper py-3 px-4 text-sm font-semibold text-grey-600 hover:bg-canvas transition-colors cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" />
              <span>ท้าดวลอีกรอบ</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
