import { useState } from 'react'
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Pin,
} from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { cn } from '@/lib/utils'
import type { ExpectationSticky } from '@/data/seed-data'

export default function Syllabus() {
  const { course, topics, expectations, addExpectation } = useApp()

  // Post-It Composer State
  const [stickyText, setStickyText] = useState('')
  const [selectedColor, setSelectedColor] =
    useState<ExpectationSticky['color']>('yellow')

  const handleAddSticky = (e: React.FormEvent) => {
    e.preventDefault()
    if (!stickyText.trim()) return
    addExpectation(stickyText.trim(), selectedColor)
    setStickyText('')
  }

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
    <div className="mx-auto w-full max-w-[390px] space-y-6 pb-12">
      {/* Header Banner */}
      <div className="rounded-3xl border-2 border-pink-300/80 bg-paper p-5 shadow-xs text-center space-y-2">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-100 text-pink-600 shadow-inner">
          <BookOpen className="h-6 w-6" />
        </div>
        <h1 className="text-xl font-bold text-ink">Course Syllabus & ความคาดหวัง</h1>
        <p className="text-xs text-grey-600">
          ประมวลรายวิชาฉบับไร้กระดาษ (Paperless) และบอร์ดความคาดหวังโพสต์อิทออนไลน์
        </p>
      </div>

      {/* SECTION 1: PAPERLESS COURSE SYLLABUS VIEWER */}
      <div className="rounded-3xl border-2 border-pink-500/80 bg-paper p-5 shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-grey-300/40 pb-3">
          <div>
            <span className="rounded-full bg-pink-50 px-2.5 py-0.5 text-[10px] font-bold text-pink-600 border border-pink-200">
              {course.code}
            </span>
            <h2 className="text-base font-bold text-ink mt-1">{course.name}</h2>
          </div>
          <span className="text-[10px] font-semibold text-grey-600 bg-canvas px-2 py-1 rounded-lg border border-grey-300/40">
            {course.university}
          </span>
        </div>

        {/* 6-Week Outline List */}
        <div className="space-y-2.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-grey-600 flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-pink-600" />
            <span>โครงสร้างบทเรียน 6 สัปดาห์</span>
          </h3>

          <div className="space-y-2">
            {topics.map((t) => (
              <div
                key={t.id}
                className="rounded-2xl border border-grey-300/50 bg-canvas p-3 space-y-1"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-pink-600">สัปดาห์ที่ {t.week}</span>
                  <span className="font-bold text-ink">{t.title}</span>
                </div>
                <p className="text-[11px] text-grey-600 leading-relaxed">
                  {t.learningObjective}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Evaluation Criteria */}
        <div className="rounded-2xl bg-pink-50/80 p-3.5 border border-pink-200 text-xs space-y-1.5">
          <p className="font-bold text-pink-600 flex items-center gap-1">
            <CheckCircle2 className="h-4 w-4" />
            <span>การวัดผลและเกณฑ์การให้คะแนน:</span>
          </p>
          <div className="grid grid-cols-2 gap-2 text-[11px] text-ink font-semibold">
            <span>• Pre-test/Post-test: 20%</span>
            <span>• กิจกรรมในคาบ: 40%</span>
            <span>• สอบกลางภาค: 20%</span>
            <span>• โปรเจกต์กลุ่ม: 20%</span>
          </div>
        </div>
      </div>

      {/* SECTION 2: ONLINE POST-IT EXPECTATIONS BOARD (บอร์ดความคาดหวังไร้กระดาษ) */}
      <div className="rounded-3xl border-2 border-amber-300 bg-paper p-5 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 text-amber-600 font-bold">
              <Pin className="h-4 w-4 text-amber-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink">บอร์ดความคาดหวังโพสต์อิท</h3>
              <p className="text-[10px] text-grey-600">แทนที่กระดาษโพสต์อิทด้วยบอร์ดดิจิทัล</p>
            </div>
          </div>
          <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
            {expectations.length} โน้ต
          </span>
        </div>

        {/* Post-It Creator Form */}
        <form onSubmit={handleAddSticky} className="space-y-3 rounded-2xl bg-amber-50/60 p-3 border border-amber-200">
          <textarea
            rows={2}
            value={stickyText}
            onChange={(e) => setStickyText(e.target.value)}
            placeholder="พิมพ์ความคาดหวังในวิชานี้ (เช่น อยากเรียน Case Study, ขอไม่เน้นท่องจำ)..."
            className="w-full rounded-xl border border-amber-300/80 bg-paper p-2.5 text-xs text-ink outline-none focus:border-amber-500 transition-all resize-none"
          />

          {/* Color Picker Buttons */}
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
              className="flex items-center gap-1 rounded-xl bg-amber-500 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-amber-600 disabled:opacity-50 transition-all cursor-pointer"
            >
              <Pin className="h-3.5 w-3.5 fill-white" />
              <span>แปะโพสต์อิท</span>
            </button>
          </div>
        </form>

        {/* Sticky Notes Grid */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          {expectations.map((item) => {
            const colorClass = getStickyColorStyle(item.color)
            return (
              <div
                key={item.id}
                className={cn(
                  'relative rounded-2xl p-3 text-xs flex flex-col justify-between space-y-2 border transition-all hover:scale-105',
                  colorClass
                )}
              >
                {/* Pin Icon */}
                <div className="flex items-center justify-between text-[10px] opacity-80">
                  <span className="font-bold">{item.authorName}</span>
                  <Pin className="h-3 w-3" />
                </div>

                <p className="font-semibold text-xs leading-relaxed">
                  "{item.text}"
                </p>

                <div className="flex items-center justify-between text-[9px] opacity-75 pt-1 border-t border-black/10">
                  <span>{item.faculty}</span>
                  <span>{item.createdAt}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
