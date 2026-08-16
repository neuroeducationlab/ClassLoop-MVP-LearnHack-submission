import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Check,
  CheckCircle2,
  ChevronRight,
  Flame,
  RotateCcw,
  Sparkles,
  Star,
  Swords,
  Trophy,
  Zap,
} from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { cn } from '@/lib/utils'
import type { PretestQuestion } from '@/data/seed-data'

/**
 * Challenge modes. The student is already signed in, so this screen asks what
 * they want to play rather than who they are — each mode just picks a different
 * slice of the question bank and its own XP weight.
 */
const CHALLENGES = [
  {
    id: 'speed',
    name: 'สปีดควิซรวมทุกระดับ',
    tagline: 'ครบทุกข้อ ตั้งแต่ง่ายถึงยาก',
    xpPerQuestion: 10,
    icon: Zap,
    accent: 'border-pink-400 bg-pink-50',
    badge: 'bg-pink-600 text-paper',
    match: () => true,
  },
  {
    id: 'warmup',
    name: 'วอร์มอัพ เก็บพื้นฐาน',
    tagline: 'เฉพาะข้อง่าย เหมาะกับการเริ่มต้น',
    xpPerQuestion: 5,
    icon: Sparkles,
    accent: 'border-pink-200 bg-paper',
    badge: 'bg-pink-100 text-pink-700',
    match: (q: PretestQuestion) => q.difficulty === 'easy',
  },
  {
    id: 'boss',
    name: 'บอสไฟต์ ข้อท้าทาย',
    tagline: 'เฉพาะข้อปานกลางถึงยาก XP คูณสอง',
    xpPerQuestion: 20,
    icon: Flame,
    accent: 'border-amber-300 bg-amber-50',
    badge: 'bg-amber-500 text-paper',
    match: (q: PretestQuestion) => q.difficulty !== 'easy',
  },
] as const

type Challenge = (typeof CHALLENGES)[number]

export default function Join() {
  const navigate = useNavigate()
  const { currentStudent, generatedContent } = useApp()

  // 1 = challenge selection, 2 = question screen, 3 = results
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [challenge, setChallenge] = useState<Challenge | null>(null)
  const [questions, setQuestions] = useState<PretestQuestion[]>([])

  const [qIndex, setQIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [maxStreak, setMaxStreak] = useState(0)
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  const currentQuestion = questions[qIndex]

  const startChallenge = (c: Challenge) => {
    const set = generatedContent.pretest.filter(c.match)
    if (set.length === 0) return
    setChallenge(c)
    setQuestions(set)
    setStep(2)
    setQIndex(0)
    setScore(0)
    setStreak(0)
    setMaxStreak(0)
    setSelectedChoice(null)
    setShowFeedback(false)
  }

  const handleAnswer = (choiceIdx: number) => {
    if (selectedChoice !== null || !currentQuestion || !challenge) return

    setSelectedChoice(choiceIdx)
    setShowFeedback(true)

    const correct = choiceIdx === currentQuestion.answerIndex
    setIsCorrect(correct)

    if (correct) {
      setScore((prev) => prev + challenge.xpPerQuestion)
      setStreak((prev) => {
        const next = prev + 1
        setMaxStreak((m) => Math.max(m, next))
        return next
      })
    } else {
      setStreak(0)
    }

    setTimeout(() => {
      if (qIndex < questions.length - 1) {
        setQIndex((prev) => prev + 1)
        setSelectedChoice(null)
        setShowFeedback(false)
      } else {
        setStep(3)
      }
    }, 2500)
  }

  const handleRestart = () => {
    setStep(1)
    setChallenge(null)
    setQuestions([])
    setQIndex(0)
    setScore(0)
    setStreak(0)
    setMaxStreak(0)
    setSelectedChoice(null)
    setShowFeedback(false)
  }

  return (
    <div className="mx-auto w-full max-w-[390px] space-y-4 pb-12">
      {/* STEP 1: CHALLENGE SELECTION */}
      {step === 1 && (
        <div className="animate-pop space-y-4">
          <div className="space-y-3 rounded-3xl border-2 border-pink-300/80 bg-paper p-5 text-center shadow-md">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-100 text-pink-600 shadow-inner">
              <Swords className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-ink">เลือกชาเลนจ์ที่อยากลุย</h1>
              <p className="mt-0.5 text-xs text-grey-600">
                หัวข้อ: Hofstede's Cultural Dimensions
              </p>
            </div>

            {/* Identity comes from the signed-in session — no name picking */}
            <div className="flex items-center justify-center gap-2 rounded-xl border border-pink-200 bg-pink-50 px-3.5 py-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-pink-600 text-[11px] font-bold text-paper">
                {currentStudent.nickname.slice(0, 2)}
              </span>
              <span className="text-xs font-semibold text-ink">
                เข้าแข่งในชื่อ {currentStudent.name} ({currentStudent.nickname})
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {CHALLENGES.map((c) => {
              const count = generatedContent.pretest.filter(c.match).length
              const Icon = c.icon
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => startChallenge(c)}
                  disabled={count === 0}
                  className={cn(
                    'flex w-full items-center gap-3.5 rounded-2xl border-2 p-4 text-left shadow-2xs transition-all',
                    'hover:shadow-md active:scale-[0.98] disabled:opacity-50',
                    c.accent,
                  )}
                >
                  <span
                    className={cn(
                      'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl',
                      c.badge,
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold text-ink">{c.name}</span>
                    <span className="mt-0.5 block text-[11px] leading-snug text-grey-600">
                      {c.tagline}
                    </span>
                    <span className="mt-1.5 flex flex-wrap items-center gap-1.5">
                      <span className="rounded-md border border-grey-300/50 bg-paper px-1.5 py-0.5 text-[10px] font-semibold text-grey-600">
                        {count} ข้อ
                      </span>
                      <span className="rounded-md border border-amber-200 bg-amber-50 px-1.5 py-0.5 text-[10px] font-bold text-amber-600">
                        +{c.xpPerQuestion} XP/ข้อ
                      </span>
                      <span className="rounded-md border border-pink-200 bg-pink-50 px-1.5 py-0.5 text-[10px] font-bold text-pink-600">
                        เต็ม {count * c.xpPerQuestion} XP
                      </span>
                    </span>
                  </span>

                  <ChevronRight className="h-5 w-5 shrink-0 text-grey-300" />
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* STEP 2: QUESTION SCREEN */}
      {step === 2 && challenge && currentQuestion && (
        <div className="animate-fadeIn space-y-4">
          <div className="flex items-center justify-between rounded-2xl border border-pink-200 bg-pink-50 p-3 shadow-2xs">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-600 text-xs font-bold text-white">
                {currentStudent.nickname.slice(0, 2)}
              </div>
              <div>
                <p className="text-xs font-bold text-ink">{currentStudent.nickname}</p>
                <p className="text-[10px] font-medium text-pink-600">{challenge.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 rounded-full border border-amber-200 bg-paper px-2.5 py-1 text-xs font-bold text-amber-600">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
                {score} XP
              </span>
              <span className="rounded-full bg-pink-600 px-2.5 py-1 text-xs font-bold text-white">
                {qIndex + 1} / {questions.length}
              </span>
            </div>
          </div>

          <div className="space-y-4 rounded-3xl border-2 border-grey-300/60 bg-paper p-5 shadow-xs">
            <div className="flex items-center justify-between text-xs font-bold text-grey-600">
              <span>ภารกิจข้อที่ {qIndex + 1}</span>
              {streak > 1 && (
                <span className="flex animate-bounce items-center gap-1 text-orange-500">
                  <Flame className="h-4 w-4 fill-orange-400" />
                  <span>{streak} ติดต่อกัน!</span>
                </span>
              )}
            </div>

            <h2 className="text-lg font-bold leading-snug text-ink lg:text-xl">
              {currentQuestion.stem}
            </h2>

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
                      'flex min-h-[64px] w-full cursor-pointer items-center justify-between rounded-2xl border-2 px-4 py-3.5 text-left text-sm font-semibold transition-all active:scale-[0.98]',
                      bgClass,
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold',
                          showFeedback && isAnswer
                            ? 'border-white bg-white text-pink-600'
                            : 'border-grey-300 bg-paper text-grey-600',
                        )}
                      >
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className="leading-snug">{optionText}</span>
                    </div>

                    {showFeedback && isAnswer && (
                      <Check className="h-5 w-5 shrink-0 stroke-[3] text-white" />
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {showFeedback && (
            <div className="animate-pop space-y-3">
              {isCorrect ? (
                <div className="relative space-y-1 overflow-hidden rounded-2xl border-2 border-emerald-300 bg-emerald-50 p-4 text-center shadow-md">
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <Sparkles className="animate-confetti absolute h-6 w-6 text-amber-500" />
                    <Star className="animate-confetti absolute h-5 w-5 fill-pink-500 text-pink-500 delay-100" />
                    <CheckCircle2 className="animate-confetti absolute h-6 w-6 text-emerald-500 delay-200" />
                  </div>

                  <p className="flex items-center justify-center gap-1.5 text-base font-extrabold text-emerald-700">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    <span>ยอดเยี่ยมมาก! ตอบถูกรอบนี้</span>
                  </p>
                  <p className="animate-bounce text-3xl font-black text-pink-600">
                    +{challenge.xpPerQuestion} XP
                  </p>
                </div>
              ) : (
                <div className="space-y-2 rounded-2xl border-2 border-pink-300 bg-pink-50 p-4 shadow-xs">
                  <div className="flex items-center gap-2 text-base font-bold text-pink-600">
                    <Sparkles className="h-5 w-5" />
                    <span>ลองคิดใหม่นะ</span>
                  </div>
                  <p className="text-xs leading-relaxed text-grey-600">
                    <strong>คำแนะนำ: </strong>
                    {currentQuestion.misconception}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* STEP 3: RESULTS SCREEN */}
      {step === 3 && challenge && (
        <div className="animate-pop space-y-5">
          <div className="space-y-3 rounded-3xl border-2 border-pink-300/80 bg-paper p-6 text-center shadow-md">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-pink-100 text-pink-600 shadow-inner">
              <Trophy className="h-9 w-9 text-amber-500" />
            </div>
            <div>
              <span className="inline-flex items-center gap-1 rounded-full border border-pink-200 bg-pink-50 px-3 py-1 text-xs font-bold text-pink-600">
                <Sparkles className="h-3.5 w-3.5 text-pink-600" />
                <span>ภารกิจเสร็จสิ้น</span>
              </span>
              <h1 className="mt-2 text-2xl font-bold text-ink">ผลการท้าดวลรอบนี้</h1>
              <p className="text-xs text-grey-600">
                เก่งมากคุณ {currentStudent.nickname} จบ{challenge.name}แล้ว!
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="rounded-2xl border border-pink-200 bg-pink-50 p-3 text-center">
                <span className="text-[11px] font-semibold text-grey-600">XP ที่ได้รับ</span>
                <p className="flex items-center justify-center gap-1 text-2xl font-black text-pink-600">
                  <Star className="h-5 w-5 fill-amber-400 text-amber-500" />
                  <span>{score} XP</span>
                </p>
              </div>
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-center">
                <span className="text-[11px] font-semibold text-grey-600">Streak สูงสุด</span>
                <p className="flex items-center justify-center gap-1 text-2xl font-black text-amber-600">
                  <Flame className="h-5 w-5 fill-amber-500 text-amber-500" />
                  <span>{maxStreak} ข้อ</span>
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3 rounded-3xl border border-grey-300/60 bg-paper p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-1.5 text-sm font-bold text-ink">
                <Trophy className="h-4 w-4 text-amber-500" />
                <span>อันดับยอดเยี่ยมในคลาส</span>
              </h3>
              <span className="text-xs font-bold text-pink-600">คุณอยู่อันดับที่ 5 จาก 24</span>
            </div>

            <div className="space-y-2">
              {[
                { rank: 1, name: 'กิตติ', nickname: 'กิ๊ก', faculty: 'Communication Arts', xp: 50 },
                { rank: 2, name: 'วรรณา', nickname: 'นุ้ย', faculty: 'Accounting', xp: 50 },
                { rank: 3, name: 'พรรณี', nickname: 'พลอย', faculty: 'Business Admin', xp: 40 },
                { rank: 4, name: 'ธีรวัฒน์', nickname: 'ต้น', faculty: 'Engineering', xp: 40 },
                {
                  rank: 5,
                  name: currentStudent.name,
                  nickname: currentStudent.nickname,
                  faculty: currentStudent.faculty,
                  xp: Math.max(score, 30),
                },
              ].map((item) => {
                const isUser = item.nickname === currentStudent.nickname
                return (
                  <div
                    key={item.rank}
                    className={cn(
                      'flex items-center justify-between rounded-2xl border p-3 text-xs font-medium',
                      isUser
                        ? 'border-pink-300 bg-pink-50 font-bold text-pink-700'
                        : 'border-grey-300/40 bg-canvas text-ink',
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                          item.rank === 1 && 'border border-amber-300 bg-amber-100 text-amber-700',
                          item.rank === 2 && 'border border-slate-300 bg-slate-200 text-slate-700',
                          item.rank === 3 && 'border border-amber-700/20 bg-amber-700/10 text-amber-800',
                          item.rank > 3 && 'border border-grey-300/40 bg-paper text-grey-600',
                        )}
                      >
                        {item.rank}
                      </span>
                      <div>
                        <span className="font-bold">
                          {item.name} ({item.nickname})
                        </span>
                        <p className="text-[10px] text-grey-600">{item.faculty}</p>
                      </div>
                    </div>
                    <span className={cn('text-sm font-black', isUser ? 'text-pink-700' : 'text-pink-600')}>
                      {item.xp} XP
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="space-y-2">
            <button
              type="button"
              onClick={handleRestart}
              className="flex min-h-[56px] w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-pink-600 px-4 py-3.5 text-base font-bold text-white shadow-md transition-all hover:bg-pink-600/90"
            >
              <Swords className="h-5 w-5" />
              <span>เลือกชาเลนจ์อื่น</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/student')}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border border-grey-300 bg-paper px-4 py-3 text-sm font-semibold text-grey-600 transition-colors hover:bg-canvas"
            >
              <RotateCcw className="h-4 w-4" />
              <span>กลับไปหน้าหลัก (Home)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
