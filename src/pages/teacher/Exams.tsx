import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BarChart3,
  Check,
  CheckCircle2,
  FileCheck,
  FileText,
  FileUp,
  Folder,
  Gamepad2,
  HelpCircle,
  Lightbulb,
  Loader2,
  Pencil,
  Upload,
  Wand2,
  X,
} from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { cn } from '@/lib/utils'

const DIFFICULTY_META: Record<string, { label: string; chip: string }> = {
  easy: { label: 'ง่าย', chip: 'bg-pink-50 text-pink-600 border border-pink-200' },
  medium: { label: 'ปานกลาง', chip: 'bg-pink-300 text-ink border border-pink-400' },
  hard: { label: 'ยาก', chip: 'bg-pink-600 text-paper' },
}

const PIPELINE = [
  {
    icon: FileUp,
    title: '1 · หย่อนไฟล์บทเรียน',
    body: 'ระบบสกัดเนื้อหาแล้วออกข้อสอบ Pre/Post-test ให้อัตโนมัติ',
  },
  {
    icon: BarChart3,
    title: '2 · นักศึกษาทำในคาบ',
    body: 'คะแนนไหลเข้าแดชบอร์ดทันที เห็นช่องว่างรายคณะ',
  },
  {
    icon: Gamepad2,
    title: '3 · ข้อสอบกลายเป็นเกม',
    body: 'ชุดเดียวกันถูกแปลงเป็นเกมท้าดวลให้คาบไม่น่าเบื่อ',
  },
]

type FilePhase =
  | { phase: 'idle' }
  | { phase: 'analyzing'; name: string }
  | { phase: 'done'; name: string }

export default function Exams() {
  const navigate = useNavigate()
  const { generatedContent, topics } = useApp()

  const [fileState, setFileState] = useState<FilePhase>({ phase: 'idle' })
  const [dragging, setDragging] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [activeExamTab, setActiveExamTab] = useState<'pretest' | 'posttest' | 'misconceptions'>('pretest')

  // Inline question editing state
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<{
    stem: string
    options: string[]
    answerIndex: number
    misconception: string
  }>({ stem: '', options: ['', '', '', ''], answerIndex: 0, misconception: '' })

  const fileTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const fileInput = useRef<HTMLInputElement>(null)

  useEffect(
    () => () => {
      if (fileTimer.current) clearTimeout(fileTimer.current)
      if (toastTimer.current) clearTimeout(toastTimer.current)
    },
    [],
  )

  const showToast = (msg: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current)
    setToast(msg)
    toastTimer.current = setTimeout(() => setToast(null), 3200)
  }

  const handleStartEdit = (q: (typeof generatedContent.pretest)[0]) => {
    setEditingId(q.id)
    setEditForm({
      stem: q.stem,
      options: [...q.options],
      answerIndex: q.answerIndex,
      misconception: q.misconception,
    })
  }

  const handleSaveEdit = (qId: string) => {
    const target = generatedContent.pretest.find((q) => q.id === qId)
    if (target) {
      target.stem = editForm.stem
      target.options = editForm.options
      target.answerIndex = editForm.answerIndex
      target.misconception = editForm.misconception
    }
    setEditingId(null)
    showToast('แก้ไขและบันทึกข้อสอบเรียบร้อยแล้ว!')
  }

  const handleFile = (name?: string) => {
    const fileName = name || 'Chapter5_SupplyChain.docx'
    setFileState({ phase: 'analyzing', name: fileName })
    if (fileTimer.current) clearTimeout(fileTimer.current)
    fileTimer.current = setTimeout(() => {
      setFileState({ phase: 'done', name: fileName })
      showToast(`สร้างชุดข้อสอบ Pre/Post-test จาก ${fileName} สำเร็จ!`)
    }, 2200)
  }

  const counts = { easy: 0, medium: 0, hard: 0 }
  for (const q of generatedContent.pretest) counts[q.difficulty] += 1

  const hofstede = topics.find((t) => t.id === 't2')
  const hasGenerated = fileState.phase !== 'idle'

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-16">
      {/* Clean Page Header */}
      <div className="flex flex-col gap-1 border-b border-grey-300/40 pb-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-pink-600 text-white shadow-md shadow-pink-600/20">
            <Wand2 className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-ink tracking-tight">
              สร้างข้อสอบ AI (Exam Generator)
            </h1>
          </div>
        </div>
      </div>

      {/* Pipeline Strip */}
      <div className="grid gap-3 sm:grid-cols-3">
        {PIPELINE.map(({ icon: Icon, title, body }) => (
          <div key={title} className="rounded-2xl border border-pink-100 bg-pink-50/60 p-4">
            <Icon className="h-5 w-5 text-pink-600" />
            <p className="mt-2 text-sm font-extrabold text-ink">{title}</p>
            <p className="mt-1 text-xs text-grey-600 leading-relaxed font-medium">{body}</p>
          </div>
        ))}
      </div>

      {/* Main Layout Container — Centers before generation, expands to 2-column after generation */}
      <div
        className={cn(
          'transition-all duration-500',
          hasGenerated
            ? 'flex flex-col gap-6 lg:flex-row lg:items-start'
            : 'max-w-2xl mx-auto'
        )}
      >
        {/* LEFT FORM PANEL — Main Dropzone */}
        <div
          className={cn(
            'space-y-5 rounded-3xl border border-grey-300/60 bg-paper p-6 shadow-sm transition-all',
            hasGenerated ? 'w-full shrink-0 lg:w-[40%]' : 'w-full'
          )}
        >
          <div className="space-y-3">
            <label className="block text-base font-extrabold text-ink flex items-center gap-2">
              <FileText className="h-5 w-5 text-pink-600" />
              <span>1. หย่อนไฟล์บทเรียนสกัดข้อสอบ</span>
            </label>

            {/* Hidden Native File Input */}
            <input
              ref={fileInput}
              type="file"
              accept=".doc,.docx,.xls,.xlsx,.pdf,.ppt,.pptx,.txt"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFile(e.target.files[0].name)
                }
              }}
            />

            {/* Drag & Drop Hero Box */}
            {fileState.phase === 'idle' && (
              <div
                onDragOver={(e) => {
                  e.preventDefault()
                  setDragging(true)
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                  e.preventDefault()
                  setDragging(false)
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    handleFile(e.dataTransfer.files[0].name)
                    return
                  }
                  const droppedText = e.dataTransfer.getData('text/plain')
                  if (droppedText === 'sample-exam-file') {
                    handleFile('Chapter5_SupplyChain.docx')
                  }
                }}
                onClick={() => fileInput.current?.click()}
                className={cn(
                  'group relative flex flex-col items-center justify-center rounded-3xl border-2 border-dashed p-8 text-center transition-all cursor-pointer shadow-sm',
                  dragging
                    ? 'border-pink-600 bg-pink-100/60 dark:bg-pink-950/80 scale-[1.02] ring-4 ring-pink-500/30'
                    : 'border-pink-300 bg-pink-50/20 hover:border-pink-500 hover:bg-pink-50/40'
                )}
              >
                <div className="flex flex-col items-center gap-3 py-3">
                  <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-pink-100 text-pink-600 group-hover:scale-110 transition-transform shadow-xs">
                    <Upload className="h-8 w-8" />
                  </div>
                  <div>
                    <p className="text-lg font-extrabold text-ink">
                      {dragging ? 'วางไฟล์ที่นี่เพื่อสร้างข้อสอบ!' : 'ลากและวางไฟล์บทเรียนที่นี่'}
                    </p>
                    <p className="text-xs text-grey-600 mt-1">
                      หรือคลิกเพื่อเลือกไฟล์ (รองรับ DOCX, PDF, PPTX, XLSX)
                    </p>
                  </div>
                </div>
              </div>
            )}

            {fileState.phase === 'analyzing' && (
              <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-pink-400 bg-pink-50/40 p-8 text-center space-y-3">
                <Loader2 className="h-10 w-10 animate-spin text-pink-600" />
                <p className="text-base font-extrabold text-ink">
                  กำลังอ่านไฟล์ {fileState.name}
                </p>
                <p className="animate-pulse text-xs text-pink-600 font-bold">
                  วิเคราะห์เป้าหมายการเรียนรู้ → ออกแบบ Pre-test & Post-test...
                </p>
              </div>
            )}

            {fileState.phase === 'done' && (
              <div className="rounded-3xl border border-pink-300 bg-pink-50/60 p-6 text-center space-y-3 shadow-xs">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-600 text-white shadow-md shadow-pink-600/30 mx-auto">
                  <FileCheck className="h-7 w-7" />
                </div>
                <div>
                  <span className="inline-block rounded-full bg-emerald-100 text-emerald-700 font-extrabold text-xs px-3 py-0.5 border border-emerald-300 mb-1">
                    ✓ สร้างข้อสอบสำเร็จ
                  </span>
                  <h3 className="text-base font-extrabold text-ink">{fileState.name}</h3>
                  <p className="text-xs text-grey-600 mt-0.5">
                    สกัดได้ Pre-test 5 ข้อ + Post-test 5 ข้อ พร้อมวิเคราะห์จุดหลงผิดรายคณะ
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => navigate('/teacher/live')}
                    className="rounded-2xl bg-pink-600 px-5 py-2.5 text-xs font-extrabold text-white shadow-md hover:bg-pink-700 transition-all cursor-pointer"
                  >
                    🚀 นำไปใช้ในคาบเรียนเลย
                  </button>
                  <button
                    type="button"
                    onClick={() => setFileState({ phase: 'idle' })}
                    className="rounded-2xl border border-grey-300 bg-white px-4 py-2.5 text-xs font-bold text-grey-600 hover:border-pink-300 hover:text-pink-600 transition-all cursor-pointer"
                  >
                    เปลี่ยนไฟล์ใหม่
                  </button>
                </div>
              </div>
            )}

            {/* Draggable Folder - OUTSIDE dropzone for testing */}
            {fileState.phase === 'idle' && (
              <div className="flex justify-center pt-2">
                <div
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('text/plain', 'sample-exam-file')
                  }}
                  onClick={() => handleFile('Chapter5_SupplyChain.docx')}
                  className="flex items-center gap-3.5 rounded-2xl border border-grey-300/80 bg-white p-3 pr-6 shadow-sm cursor-grab active:cursor-grabbing hover:border-pink-400 hover:shadow-md hover:-translate-y-0.5 transition-all group"
                  title="ลากโฟลเดอร์นี้ไปวางในกล่องด้านบนเพื่อทดสอบสร้างข้อสอบ"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-50 text-pink-600 group-hover:bg-pink-100 transition-colors">
                    <Folder className="h-6 w-6 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-extrabold text-ink group-hover:text-pink-600 transition-colors">
                      Chapter5_SupplyChain.docx
                    </p>
                    <p className="text-xs font-bold text-grey-500 mt-0.5">
                      📂 ไฟล์ข้อสอบโซ่อุปทาน • ลากไปวางได้เลย
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <hr className="border-grey-300/40" />

          {/* Quick Tip */}
          <div className="rounded-2xl bg-canvas p-3.5 text-xs text-grey-600 border border-grey-300/40 space-y-1">
            <p className="font-bold text-ink flex items-center gap-1.5">
              <Lightbulb className="h-4 w-4 text-pink-600" />
              ข้อสอบชุดนี้ส่งตรงไปยังระบบ:
            </p>
            <p className="leading-relaxed text-ink/90 font-medium">
              ข้อสอบที่สร้างจะแปลงเป็น Speed Quiz สำหรับท้าดวลสดในคลาส และคะแนนจะสรุปแยกตามคณะเข้าสู่แดชบอร์ดโดยอัตโนมัติ
            </p>
          </div>
        </div>

        {/* RIGHT GENERATED EXAM TABS PANEL (Reveals ONLY after generating) */}
        {hasGenerated && (
          <div className="w-full flex-1 lg:w-[60%] space-y-6 animate-fadeIn">
            {/* 3 Generated Exam Navigation Tabs */}
            <div className="flex items-center gap-2 rounded-2xl border border-grey-300/60 bg-paper p-2 shadow-2xs">
              <button
                type="button"
                onClick={() => setActiveExamTab('pretest')}
                className={cn(
                  'flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-extrabold transition-all cursor-pointer',
                  activeExamTab === 'pretest'
                    ? 'bg-pink-600 text-white shadow-sm'
                    : 'text-grey-600 hover:text-ink hover:bg-grey-100'
                )}
              >
                <span>📝 Pre-test (5 ข้อ)</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveExamTab('posttest')}
                className={cn(
                  'flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-extrabold transition-all cursor-pointer',
                  activeExamTab === 'posttest'
                    ? 'bg-pink-600 text-white shadow-sm'
                    : 'text-grey-600 hover:text-ink hover:bg-grey-100'
                )}
              >
                <span>🎯 Post-test (5 ข้อ)</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveExamTab('misconceptions')}
                className={cn(
                  'flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-extrabold transition-all cursor-pointer',
                  activeExamTab === 'misconceptions'
                    ? 'bg-pink-600 text-white shadow-sm'
                    : 'text-grey-600 hover:text-ink hover:bg-grey-100'
                )}
              >
                <span>💡 จุดหลงผิดรายคณะ</span>
              </button>
            </div>

            {/* TAB CONTENT 1 & 2: Pre-test & Post-test Question List */}
            {(activeExamTab === 'pretest' || activeExamTab === 'posttest') && (
              <div className="rounded-3xl border border-grey-300/60 bg-paper p-6 shadow-sm space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-grey-300/40 pb-4">
                  <div>
                    <h2 className="text-lg font-extrabold text-ink">
                      {activeExamTab === 'pretest'
                        ? 'ชุดข้อสอบ Pre-test (วัดก่อนเรียน)'
                        : 'ชุดข้อสอบ Post-test (วัดหลังเรียน)'}
                    </h2>
                    <p className="text-xs text-grey-600 mt-0.5">
                      {fileState.phase === 'done' ? fileState.name : 'Chapter5_SupplyChain.docx'} · สัปดาห์ที่ {hofstede?.week ?? 2}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {Object.entries(DIFFICULTY_META).map(([key, { label, chip }]) => (
                      <span key={key} className={cn('rounded-full px-3 py-0.5 text-xs font-bold', chip)}>
                        {label} {counts[key as keyof typeof counts]} ข้อ
                      </span>
                    ))}
                    <button
                      type="button"
                      onClick={() => showToast('สร้างข้อสอบเพิ่ม 5 ข้อสำเร็จ!')}
                      className="rounded-xl border border-pink-300 px-3 py-1.5 text-xs font-bold text-pink-600 hover:bg-pink-50 transition-colors cursor-pointer"
                    >
                      + สร้างเพิ่ม
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {generatedContent.pretest.map((q, i) => {
                    const meta = DIFFICULTY_META[q.difficulty]
                    const isEditing = editingId === q.id

                    if (isEditing) {
                      return (
                        <div key={q.id} className="rounded-2xl border-2 border-pink-400 bg-pink-50/50 p-4 space-y-3 shadow-md">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-extrabold text-pink-600">แก้ไขข้อสอบข้อที่ {i + 1}</span>
                            <button
                              type="button"
                              onClick={() => setEditingId(null)}
                              className="text-xs text-grey-500 hover:underline"
                            >
                              ยกเลิก
                            </button>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-ink mb-1">โจทย์คำถาม:</label>
                            <textarea
                              rows={2}
                              value={editForm.stem}
                              onChange={(e) => setEditForm((prev) => ({ ...prev, stem: e.target.value }))}
                              className="w-full rounded-xl border border-grey-300 bg-paper p-2.5 text-xs text-ink outline-none focus:border-pink-500 font-medium"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="block text-xs font-bold text-ink">ตัวเลือกคำตอบ (เลือกข้อที่ถูก):</label>
                            {editForm.options.map((optText, optIdx) => (
                              <div key={optIdx} className="flex items-center gap-2">
                                <input
                                  type="radio"
                                  name={`correct-${q.id}`}
                                  checked={editForm.answerIndex === optIdx}
                                  onChange={() => setEditForm((prev) => ({ ...prev, answerIndex: optIdx }))}
                                  className="h-4 w-4 text-pink-600 accent-pink-600 cursor-pointer"
                                />
                                <input
                                  type="text"
                                  value={optText}
                                  onChange={(e) => {
                                    const nextOpts = [...editForm.options]
                                    nextOpts[optIdx] = e.target.value
                                    setEditForm((prev) => ({ ...prev, options: nextOpts }))
                                  }}
                                  className={cn(
                                    'w-full rounded-lg border p-2 text-xs outline-none font-medium',
                                    editForm.answerIndex === optIdx ? 'border-pink-500 bg-pink-50 font-bold' : 'border-grey-300 bg-paper'
                                  )}
                                />
                              </div>
                            ))}
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-ink mb-1">จุดที่มักเข้าใจผิด:</label>
                            <input
                              type="text"
                              value={editForm.misconception}
                              onChange={(e) => setEditForm((prev) => ({ ...prev, misconception: e.target.value }))}
                              className="w-full rounded-xl border border-grey-300 bg-paper p-2.5 text-xs text-ink outline-none focus:border-pink-500 font-medium"
                            />
                          </div>

                          <div className="flex justify-end gap-2 pt-2">
                            <button
                              type="button"
                              onClick={() => setEditingId(null)}
                              className="rounded-xl border border-grey-300 px-3 py-1.5 text-xs font-bold text-grey-600 hover:bg-grey-100"
                            >
                              ยกเลิก
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSaveEdit(q.id)}
                              className="rounded-xl bg-pink-600 px-4 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-pink-700"
                            >
                              บันทึกการแก้ไข
                            </button>
                          </div>
                        </div>
                      )
                    }

                    return (
                      <div key={q.id} className="rounded-2xl border border-grey-300/50 bg-paper p-4 space-y-2.5 hover:border-pink-300 transition-colors">
                        <div className="flex items-center justify-between gap-2">
                          <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-bold', meta.chip)}>
                            {meta.label}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleStartEdit(q)}
                              className="inline-flex items-center gap-1 rounded-lg border border-grey-300 px-2.5 py-1 text-xs font-bold text-grey-600 hover:border-pink-400 hover:text-pink-600 transition-colors cursor-pointer"
                            >
                              <Pencil className="h-3 w-3" />
                              <span>แก้ไขข้อสอบ</span>
                            </button>
                            <span className="text-xs font-bold text-grey-500">
                              ข้อ {i + 1}/{generatedContent.pretest.length}
                            </span>
                          </div>
                        </div>

                        <p className="text-sm font-extrabold leading-relaxed text-ink">
                          {q.stem}
                        </p>

                        <div className="grid gap-2 sm:grid-cols-2">
                          {q.options.map((opt, oi) => (
                            <div
                              key={opt}
                              className={cn(
                                'flex items-start gap-2 rounded-xl border px-3 py-2 text-xs leading-relaxed font-medium',
                                oi === q.answerIndex
                                  ? 'border-pink-400 bg-pink-50 font-bold text-ink'
                                  : 'border-grey-300/40 text-grey-600',
                              )}
                            >
                              {oi === q.answerIndex && (
                                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-pink-600" />
                              )}
                              <span>{opt}</span>
                            </div>
                          ))}
                        </div>

                        <p className="text-xs text-grey-600 bg-canvas p-2.5 rounded-xl border border-grey-300/40 mt-1 font-medium">
                          <span className="font-bold text-pink-600">💡 จุดหลงผิด:</span>{' '}
                          {q.misconception}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* TAB CONTENT 3: Misconceptions Analysis */}
            {activeExamTab === 'misconceptions' && (
              <div className="rounded-3xl border border-grey-300/60 bg-paper p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-grey-300/40 pb-4">
                  <div>
                    <h2 className="text-lg font-extrabold text-ink">
                      การวิเคราะห์จุดหลงผิดที่ AI คาดการณ์ (Misconception Map)
                    </h2>
                    <p className="text-xs text-grey-600 mt-0.5">
                      ช่วยอาจารย์เน้นย้ำเนื้อหาก่อนเริ่มทำกิจกรรม Active Learning
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {generatedContent.pretest.map((q, i) => (
                    <div key={q.id} className="rounded-2xl border border-pink-200 bg-pink-50/40 p-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-pink-600 text-white font-extrabold text-xs">
                          {i + 1}
                        </span>
                        <p className="text-xs font-extrabold text-ink line-clamp-1">
                          {q.stem}
                        </p>
                      </div>
                      <div className="pl-8 text-xs text-grey-600 space-y-1">
                        <p className="font-bold text-pink-700 flex items-center gap-1.5">
                          <HelpCircle className="h-4 w-4" />
                          <span>สิ่งที่เด็กแต่ละคณะมักสับสน:</span>
                        </p>
                        <p className="leading-relaxed font-medium bg-white p-2.5 rounded-xl border border-pink-200/60 text-ink">
                          {q.misconception}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Floating Toast Notification */}
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
