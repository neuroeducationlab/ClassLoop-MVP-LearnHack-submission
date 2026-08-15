import { useState } from 'react'
import {
  BookOpen,
  Brain,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FileText,
  Layers,
  Lightbulb,
  Lock,
  Pin,
  RotateCw,
  Sparkles,
  Star,
  Trophy,
  Tv,
} from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { cn } from '@/lib/utils'
import type { ExpectationSticky } from '@/data/seed-data'

export default function Review() {
  const {
    topics,
    generatedContent,
    expectations,
    addExpectation,
    studentXP,
    addXP,
  } = useApp()

  // Selected Topic State (default week 2 Hofstede)
  const [selectedTopicId, setSelectedTopicId] = useState<string>('t2')

  // Main Call-To-Action Mode Selector: 'flashcards' | 'mocktest'
  const [activeReviewMode, setActiveReviewMode] = useState<'flashcards' | 'mocktest'>('flashcards')

  // Flashcards Index & Flip State (Single card focus view)
  const [activeCardIndex, setActiveCardIndex] = useState<number>(0)
  const [isCardFlipped, setIsCardFlipped] = useState<boolean>(false)
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set())
  const [showHint, setShowHint] = useState<boolean>(false)

  // Selected Practice Level for Mock Test ('easy' | 'medium' | 'hard')
  const [selectedLevel, setSelectedLevel] = useState<'easy' | 'medium' | 'hard'>('easy')

  // Track answered quiz questions: { [qId]: selectedChoiceIndex }
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({})

  // Toast / XP notification state
  const [xpToast, setXpToast] = useState<string | null>(null)

  // Post-It sticky composer state
  const [stickyText, setStickyText] = useState('')
  const [selectedColor, setSelectedColor] = useState<ExpectationSticky['color']>('yellow')
  const [showSyllabusDetails, setShowSyllabusDetails] = useState(false)

  // Trigger XP Toast helper
  const triggerXpGain = (amount: number, msg: string) => {
    addXP(amount)
    setXpToast(`+${amount} XP ${msg}`)
    setTimeout(() => setXpToast(null), 3000)
  }

  // Handle Minimal Flashcard Flip
  const handleToggleFlipCard = () => {
    const nextFlippedState = !isCardFlipped
    setIsCardFlipped(nextFlippedState)

    if (nextFlippedState && !flippedCards.has(activeCardIndex)) {
      const nextSet = new Set(flippedCards)
      nextSet.add(activeCardIndex)
      setFlippedCards(nextSet)
      triggerXpGain(5, 'ทบทวน Flashcard!')
    }
  }

  // Navigate Flashcards
  const handleNextCard = () => {
    setIsCardFlipped(false)
    setShowHint(false)
    setActiveCardIndex((prev) => (prev + 1) % generatedContent.flashcards.length)
  }

  const handlePrevCard = () => {
    setIsCardFlipped(false)
    setShowHint(false)
    setActiveCardIndex((prev) => (prev - 1 + generatedContent.flashcards.length) % generatedContent.flashcards.length)
  }

  // Handle Practice Quiz Selection
  const handleAnswerQuestion = (qId: string, choiceIdx: number, correctIdx: number) => {
    if (userAnswers[qId] !== undefined) return // already answered
    setUserAnswers((prev) => ({ ...prev, [qId]: choiceIdx }))
    if (choiceIdx === correctIdx) {
      triggerXpGain(10, 'ตอบลองสอบถูกต้อง!')
    }
  }

  // Handle Add Sticky Expectation
  const handleAddSticky = (e: React.FormEvent) => {
    e.preventDefault()
    if (!stickyText.trim()) return
    addExpectation(stickyText.trim(), selectedColor)
    triggerXpGain(5, 'แปะโพสต์อิทความคาดหวัง!')
    setStickyText('')
  }

  // Current selected topic details
  const currentTopic = topics.find((t) => t.id === selectedTopicId) || topics[1]

  // Filter pretest questions by selected level
  const filteredQuestions = generatedContent.pretest.filter(
    (q) => q.difficulty === selectedLevel
  )

  const currentFlashcard = generatedContent.flashcards[activeCardIndex] || generatedContent.flashcards[0]

  const getStickyColorStyle = (color: ExpectationSticky['color']) => {
    switch (color) {
      case 'yellow':
        return 'bg-amber-100/90 border-amber-300 text-amber-950 shadow-md rotate-1'
      case 'pink':
        return 'bg-pink-100/90 border-pink-300 text-pink-950 shadow-md -rotate-1'
      case 'blue':
        return 'bg-sky-100/90 border-sky-300 text-sky-950 shadow-md rotate-2'
      case 'green':
        return 'bg-emerald-100/90 border-emerald-300 text-emerald-950 shadow-md -rotate-2'
      case 'purple':
        return 'bg-purple-100/90 border-purple-300 text-purple-950 shadow-md rotate-1'
    }
  }

  return (
    <div className="mx-auto w-full max-w-[390px] space-y-5 pb-16">
      {/* HEADER BANNER WITH LIVE XP STATUS */}
      <div className="rounded-3xl border-2 border-pink-300/80 bg-paper p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-pink-600 text-white shadow-md">
              <Brain className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-ink">ศูนย์ทบทวนบทเรียน</h1>
              <p className="text-[11px] font-semibold text-pink-600">
                เลือกบทเรียน & ทำกิจกรรมรับ XP
              </p>
            </div>
          </div>

          {/* Live Player XP Badge */}
          <div className="flex flex-col items-end">
            <span className="flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-black text-amber-600 border border-amber-200 shadow-2xs animate-pulse">
              <Star className="h-4 w-4 fill-amber-400 text-amber-500" />
              <span>{studentXP} XP</span>
            </span>
            <span className="text-[9px] font-bold text-emerald-600 mt-1">
              ทบทวนได้ XP!
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 1: TOPIC SCHEDULE BREAKDOWN (ตารางเรียนแยกรายหัวข้อ) */}
      <div className="rounded-3xl border-2 border-pink-500/80 bg-paper p-4 shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-ink flex items-center gap-1.5">
            <BookOpen className="h-4 w-4 text-pink-600" />
            <span>เลือกบทเรียนที่ต้องการทบทวน</span>
          </span>
          <span className="text-[10px] font-bold text-pink-600 bg-pink-50 px-2.5 py-0.5 rounded-full border border-pink-200">
            6 สัปดาห์
          </span>
        </div>

        {/* Horizontal Topic Pills Selector */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {topics.map((t) => {
            const isSelected = t.id === selectedTopicId
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  setSelectedTopicId(t.id)
                  setActiveCardIndex(0)
                  setIsCardFlipped(false)
                }}
                className={cn(
                  'flex shrink-0 items-center gap-1.5 rounded-2xl px-3.5 py-2 text-xs font-bold transition-all border cursor-pointer',
                  isSelected
                    ? 'bg-pink-600 text-white border-pink-600 shadow-sm'
                    : 'bg-canvas text-grey-600 border-grey-300/50 hover:border-pink-300'
                )}
              >
                <span>ส.{t.week}</span>
                <span className="max-w-[110px] truncate">{t.title}</span>
              </button>
            )
          })}
        </div>

        {/* Active Topic Summary */}
        <div className="rounded-2xl bg-pink-50/80 p-3 border border-pink-200/80 space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-pink-600">
              สัปดาห์ที่ {currentTopic.week}: {currentTopic.title}
            </span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
              พร้อมทบทวน
            </span>
          </div>
          <p className="text-[11px] text-grey-600 leading-relaxed">
            {currentTopic.learningObjective}
          </p>
        </div>


        {/* MAIN CALL TO ACTION 3 MODES GRID */}
        <div className="pt-2">
          <p className="text-[11px] font-bold text-grey-600 mb-2">เลือกโหมดการทบทวน:</p>
          <div className="grid grid-cols-3 gap-2">
            {/* 1. Flashcards (Minimal Flip View) */}
            <button
              type="button"
              onClick={() => setActiveReviewMode('flashcards')}
              className={cn(
                'flex flex-col items-center justify-center rounded-2xl p-3 text-center transition-all border cursor-pointer shadow-2xs',
                activeReviewMode === 'flashcards'
                  ? 'bg-purple-600 text-white border-purple-600 shadow-md ring-2 ring-purple-600/30'
                  : 'bg-paper text-ink border-purple-200 hover:border-purple-400'
              )}
            >
              <div className={cn(
                'flex h-9 w-9 items-center justify-center rounded-xl font-bold mb-1.5',
                activeReviewMode === 'flashcards' ? 'bg-white/20 text-white' : 'bg-purple-100 text-purple-600'
              )}>
                <Layers className="h-5 w-5" />
              </div>
              <span className="text-xs font-extrabold">1. Flashcards</span>
              <span className="text-[9px] opacity-80 mt-0.5">การ์ด Flip Minimal</span>
            </button>

            {/* 2. Mock Test (ลองสอบ) */}
            <button
              type="button"
              onClick={() => setActiveReviewMode('mocktest')}
              className={cn(
                'flex flex-col items-center justify-center rounded-2xl p-3 text-center transition-all border cursor-pointer shadow-2xs',
                activeReviewMode === 'mocktest'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-600/30'
                  : 'bg-paper text-ink border-emerald-200 hover:border-emerald-400'
              )}
            >
              <div className={cn(
                'flex h-9 w-9 items-center justify-center rounded-xl font-bold mb-1.5',
                activeReviewMode === 'mocktest' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-600'
              )}>
                <Trophy className="h-5 w-5" />
              </div>
              <span className="text-xs font-extrabold">2. Mock Test</span>
              <span className="text-[9px] opacity-80 mt-0.5">ลองสอบไต่ระดับ</span>
            </button>

            {/* 3. Audio Book (Locked) */}
            <button
              type="button"
              disabled
              className="flex flex-col items-center justify-center rounded-2xl p-3 text-center transition-all border bg-canvas/70 border-grey-300/40 text-grey-400 cursor-not-allowed opacity-75 relative"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-grey-200 text-grey-500 font-bold mb-1.5">
                <Lock className="h-4 w-4" />
              </div>
              <span className="text-xs font-bold text-grey-600">3. Audio Book</span>
              <span className="text-[9px] text-pink-600 font-bold mt-0.5">🔒 ล็อคไว้อยู่</span>
            </button>
          </div>
        </div>
      </div>

      {/* MODE 1: MINIMAL 3D FLIP FLASHCARD FOCUS VIEW */}
      {activeReviewMode === 'flashcards' && (
        <div className="rounded-3xl border-2 border-purple-300 bg-paper p-5 shadow-md space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-100 text-purple-600 font-bold">
                <Layers className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-ink">Flashcards Flip Minimal</h3>
                <p className="text-[10px] text-grey-600">พลิกการ์ดทบทวน รับ +5 XP ต่อใบ</p>
              </div>
            </div>
            <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
              การ์ดที่ {activeCardIndex + 1} / {generatedContent.flashcards.length}
            </span>
          </div>

          {/* MINIMAL SINGLE FLIP CARD FOCUS CONTAINER (NON-MIRRORED 3D FLIP) */}
          <div
            onClick={handleToggleFlipCard}
            className="relative min-h-[230px] w-full cursor-pointer perspective-1000 select-none group"
          >
            <div
              className={cn(
                'relative h-full min-h-[230px] w-full transition-transform duration-500 transform-style-3d',
                isCardFlipped && 'rotate-y-180'
              )}
            >
              {/* FRONT FACE (Shown when NOT flipped) */}
              <div className="absolute inset-0 h-full w-full rounded-3xl p-5 border-2 bg-paper text-ink border-purple-200 hover:border-purple-400 shadow-md flex flex-col justify-between text-center backface-hidden">
                {/* Top Header */}
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="rounded-full bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-0.5 text-[10px] font-bold">
                    คำถามมิติวัฒนธรรม
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-bold text-purple-600">
                    <RotateCw className="h-3.5 w-3.5" />
                    <span>แตะเพื่อพลิกอ่าน</span>
                  </span>
                </div>

                {/* Front Content */}
                <div className="py-4 space-y-1">
                  <h4 className="text-lg font-bold leading-snug tracking-tight text-ink">
                    {currentFlashcard.front}
                  </h4>
                  <p className="text-[11px] text-grey-500">
                    แตะที่การ์ดเพื่อดูคำอธิบายสรุป
                  </p>
                </div>

                {/* Bottom Status */}
                <div className="flex items-center justify-between pt-2 border-t border-grey-300/30 text-[10px] text-grey-500">
                  <span>มิติทางวัฒนธรรม</span>
                  <span>{flippedCards.has(activeCardIndex) ? 'อ่านแล้ว ✓' : 'ยังไม่ได้อ่าน'}</span>
                </div>
              </div>

              {/* BACK FACE (Rotated 180deg so Thai text is 100% readable and NOT mirrored when flipped!) */}
              <div className="absolute inset-0 h-full w-full rounded-3xl p-5 border-2 bg-purple-600 text-white border-purple-700 shadow-purple-600/20 flex flex-col justify-between text-center backface-hidden rotate-y-180">
                {/* Top Header */}
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="rounded-full bg-white/20 text-white border border-white/30 px-2.5 py-0.5 text-[10px] font-bold">
                    เฉลยบทเรียน (+5 XP)
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-bold text-purple-200">
                    <RotateCw className="h-3.5 w-3.5" />
                    <span>แตะเพื่อพลิกกลับ</span>
                  </span>
                </div>

                {/* Back Explanation (Readable Non-Mirrored Thai Text) */}
                <div className="py-4 space-y-1">
                  <h4 className="text-base font-bold leading-relaxed tracking-tight text-white">
                    {currentFlashcard.back}
                  </h4>
                  <p className="text-[11px] text-purple-100/90 leading-relaxed max-w-xs mx-auto">
                    สรุปมิติวัฒนธรรมจากอาจารย์ประจำวิชา
                  </p>
                </div>

                {/* Bottom Status */}
                <div className="flex items-center justify-between pt-2 border-t border-white/20 text-[10px] text-purple-200">
                  <span>สรุปคำอธิบาย</span>
                  <span>อ่านแล้ว (+5 XP)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Hint Card Drawer */}
          {showHint && (
            <div className="rounded-2xl bg-purple-50 p-3 border border-purple-200 text-xs text-purple-900 animate-fadeIn">
              <p className="font-bold flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5 text-purple-600" />
                <span>คำใบ้การวิเคราะห์:</span>
              </p>
              <p className="mt-1 text-purple-800 leading-relaxed pl-4">
                {currentFlashcard.hint}
              </p>
            </div>
          )}

          {/* FLASHCARD NAVIGATION CONTROLS */}
          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={handlePrevCard}
              className="flex items-center gap-1 rounded-xl bg-canvas px-3.5 py-2 text-xs font-bold text-grey-700 border border-grey-300/50 hover:bg-grey-100 transition-all cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>ก่อนหน้า</span>
            </button>

            {/* Card Dots Indicator */}
            <div className="flex items-center gap-1">
              {generatedContent.flashcards.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setIsCardFlipped(false)
                    setShowHint(false)
                    setActiveCardIndex(idx)
                  }}
                  className={cn(
                    'h-2 rounded-full transition-all cursor-pointer',
                    idx === activeCardIndex
                      ? 'w-6 bg-purple-600'
                      : flippedCards.has(idx)
                      ? 'w-2 bg-purple-300'
                      : 'w-2 bg-grey-300'
                  )}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={handleNextCard}
              className="flex items-center gap-1 rounded-xl bg-purple-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-purple-700 transition-all cursor-pointer"
            >
              <span>ถัดไป</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* MODE 2: MOCK TEST (ลองสอบไต่ระดับ + รับ +10 XP) */}
      {activeReviewMode === 'mocktest' && (
        <div className="rounded-3xl border-2 border-emerald-300 bg-paper p-5 shadow-md space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 font-bold">
                <Trophy className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-ink">Mock Test ลองสอบไต่ระดับ</h3>
                <p className="text-[10px] text-grey-600">ทำตามเลเวลก่อนสอบจริง +10 XP/ข้อ</p>
              </div>
            </div>
          </div>

          {/* Level Tabs: Easy -> Medium -> Hard */}
          <div className="grid grid-cols-3 gap-2">
            {(['easy', 'medium', 'hard'] as const).map((lvl) => {
              const isSelected = selectedLevel === lvl
              const labels = { easy: 'Level 1: ง่าย', medium: 'Level 2: ปานกลาง', hard: 'Level 3: ท้าทาย' }
              return (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setSelectedLevel(lvl)}
                  className={cn(
                    'rounded-xl py-2 px-1 text-center text-xs font-bold transition-all border cursor-pointer',
                    isSelected
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-canvas text-grey-600 border-grey-300/40 hover:border-emerald-300'
                  )}
                >
                  {labels[lvl]}
                </button>
              )
            })}
          </div>

          {/* Filtered Practice Questions List */}
          <div className="space-y-4 pt-1">
            {filteredQuestions.map((q, qIndex) => {
              const selectedChoice = userAnswers[q.id]
              const isAnswered = selectedChoice !== undefined
              const isCorrect = selectedChoice === q.answerIndex

              return (
                <div
                  key={q.id}
                  className="rounded-2xl border border-grey-300/60 bg-paper p-4 shadow-2xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                      โจทย์ข้อที่ {qIndex + 1} ({selectedLevel.toUpperCase()})
                    </span>
                    {isAnswered && (
                      <span
                        className={cn(
                          'text-[10px] font-bold px-2 py-0.5 rounded-full',
                          isCorrect
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-amber-100 text-amber-800'
                        )}
                      >
                        {isCorrect ? 'ถูกต้อง (+10 XP)' : 'ลองวิเคราะห์ใหม่นะ'}
                      </span>
                    )}
                  </div>

                  <h4 className="text-xs font-bold text-ink leading-relaxed">{q.stem}</h4>

                  {/* 4 Option Buttons */}
                  <div className="grid grid-cols-1 gap-2">
                    {q.options.map((optText, optIdx) => {
                      const isSelectedChoice = selectedChoice === optIdx
                      const isCorrectChoice = optIdx === q.answerIndex
                      const labelLetter = String.fromCharCode(65 + optIdx)

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => handleAnswerQuestion(q.id, optIdx, q.answerIndex)}
                          className={cn(
                            'flex items-center gap-2.5 rounded-xl p-2.5 text-xs text-left font-semibold transition-all border cursor-pointer',
                            isAnswered && isCorrectChoice
                              ? 'bg-emerald-600 text-white border-emerald-600 font-bold'
                              : isAnswered && isSelectedChoice && !isCorrectChoice
                              ? 'bg-amber-100 text-amber-900 border-amber-300'
                              : 'bg-canvas text-ink border-grey-300/50 hover:border-pink-300'
                          )}
                        >
                          <span
                            className={cn(
                              'flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold',
                              isAnswered && isCorrectChoice
                                ? 'bg-white text-emerald-700'
                                : 'bg-pink-100 text-pink-700'
                            )}
                          >
                            {labelLetter}
                          </span>
                          <span className="flex-1 leading-snug">{optText}</span>
                        </button>
                      )
                    })}
                  </div>

                  {/* Misconception Note when answered */}
                  {isAnswered && (
                    <div className="rounded-xl bg-emerald-50/80 p-2.5 border border-emerald-200 text-[11px] text-ink space-y-1">
                      <p className="font-bold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        <span>ข้อสังเกตและแนวคิด:</span>
                      </p>
                      <p className="text-grey-600 leading-relaxed pl-4">
                        {q.misconception}
                      </p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* 💡 PERSONALIZED EXTRA STUDY SUGGESTIONS (YouTube / Books) */}
      <div className="rounded-2xl border border-pink-300 bg-pink-50/70 p-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs font-bold text-pink-700">
            <Lightbulb className="h-4 w-4 text-pink-600" />
            <span>แนะนำสื่อเรียนรู้เสริมรายบุคคล</span>
          </span>
          <span className="text-[9px] font-bold text-pink-600 bg-white px-2 py-0.5 rounded-full border border-pink-200">
            Personalized AI
          </span>
        </div>

        <div className="grid gap-2">
          <a
            href="https://www.youtube.com/results?search_query=Hofstede+cultural+dimensions"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-xl bg-white p-2.5 border border-rose-200 text-xs hover:border-rose-400 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Tv className="h-4 w-4 text-rose-600 shrink-0" />
              <div>
                <p className="font-bold text-ink text-[11px]">YouTube 10 นาที: Hofstede's 6 Dimensions</p>
                <p className="text-[10px] text-grey-600">สรุปภาพรวมพร้อมตัวอย่างประยุกต์จริง</p>
              </div>
            </div>
            <ExternalLink className="h-3.5 w-3.5 text-rose-500 shrink-0" />
          </a>

          <div className="flex items-center justify-between rounded-xl bg-white p-2.5 border border-blue-200 text-xs">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-blue-600 shrink-0" />
              <div>
                <p className="font-bold text-ink text-[11px]">หนังสืออ่านเสริม: Cultures and Organizations</p>
                <p className="text-[10px] text-grey-600">SPU E-Book Library (บทที่ 2)</p>
              </div>
            </div>
            <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">แนะนำ</span>
          </div>
        </div>
      </div>

      {/* OPTIONAL SYLLABUS & POST-IT DETAILS TOGGLE */}
      <div className="rounded-3xl border border-grey-300/60 bg-paper p-4 shadow-xs">
        <button
          type="button"
          onClick={() => setShowSyllabusDetails(!showSyllabusDetails)}
          className="flex w-full items-center justify-between text-xs font-bold text-ink cursor-pointer"
        >
          <span className="flex items-center gap-1.5">
            <FileText className="h-4 w-4 text-pink-600" />
            <span>ดูประมวลรายวิชา (Syllabus) & บอร์ดความคาดหวัง</span>
          </span>
          <ChevronRight className={cn('h-4 w-4 text-grey-600 transition-transform', showSyllabusDetails && 'rotate-90')} />
        </button>

        {showSyllabusDetails && (
          <div className="space-y-4 pt-4 border-t border-grey-300/40 mt-3 animate-fadeIn">
            {/* Post-It Creator Form */}
            <form onSubmit={handleAddSticky} className="space-y-3 rounded-2xl bg-amber-50/60 p-3 border border-amber-200">
              <p className="text-xs font-bold text-ink">แปะโพสต์อิทความคาดหวังออนไลน์:</p>
              <textarea
                rows={2}
                value={stickyText}
                onChange={(e) => setStickyText(e.target.value)}
                placeholder="พิมพ์ความคาดหวังในวิชานี้..."
                className="w-full rounded-xl border border-amber-300/80 bg-paper p-2.5 text-xs text-ink outline-none focus:border-amber-500 transition-all resize-none"
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-grey-600">เลือกสี:</span>
                  {(['yellow', 'pink', 'blue', 'green', 'purple'] as const).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setSelectedColor(c)}
                      className={cn(
                        'h-5 w-5 rounded-full border-2 transition-transform cursor-pointer',
                        c === 'yellow' && 'bg-amber-300 border-amber-400',
                        c === 'pink' && 'bg-pink-300 border-pink-400',
                        c === 'blue' && 'bg-sky-300 border-sky-400',
                        c === 'green' && 'bg-emerald-300 border-emerald-400',
                        c === 'purple' && 'bg-purple-300 border-purple-400',
                        selectedColor === c && 'scale-125 ring-2 ring-ink'
                      )}
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={!stickyText.trim()}
                  className="flex items-center gap-1 rounded-xl bg-amber-500 px-3 py-1.5 text-xs font-bold text-white shadow-xs"
                >
                  <Pin className="h-3.5 w-3.5 fill-white" />
                  <span>แปะโพสต์อิท (+5 XP)</span>
                </button>
              </div>
            </form>

            {/* Sticky Notes Grid */}
            <div className="grid grid-cols-2 gap-3">
              {expectations.map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    'relative rounded-2xl p-3 text-xs flex flex-col justify-between space-y-2 border',
                    getStickyColorStyle(item.color)
                  )}
                >
                  <div className="flex items-center justify-between text-[10px] opacity-80">
                    <span className="font-bold">{item.authorName}</span>
                    <Pin className="h-3 w-3" />
                  </div>
                  <p className="font-semibold text-xs leading-relaxed">"{item.text}"</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* FLOATING BOUNCY XP TOAST */}
      {xpToast && (
        <div className="fixed bottom-20 right-6 z-50 flex items-center gap-2 rounded-2xl bg-amber-500 px-5 py-3 text-xs font-black text-white shadow-2xl animate-bounce border-2 border-amber-300">
          <Star className="h-4 w-4 fill-white text-white" />
          <span>{xpToast}</span>
        </div>
      )}
    </div>
  )
}
