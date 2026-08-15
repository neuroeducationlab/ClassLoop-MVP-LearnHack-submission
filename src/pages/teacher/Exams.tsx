import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BarChart3,
  Check,
  CheckCircle2,
  FileUp,
  Gamepad2,
  Lightbulb,
  Loader2,
  Pencil,
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
    body: 'ระบบอ่านเนื้อหาแล้วออกข้อสอบ Pre/Post-test ให้เอง',
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
      showToast(`ออกแบบ Pre/Post-test จาก ${fileName} สำเร็จ!`)
    }, 2200)
  }

  const counts = { easy: 0, medium: 0, hard: 0 }
  for (const q of generatedContent.pretest) counts[q.difficulty] += 1

  const hofstede = topics.find((t) => t.id === 't2')

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-12">
      {/* header */}
      <div>
        <h1 className="text-2xl font-bold text-ink">ข้อสอบ Pre/Post-test</h1>
        <p className="mt-1 text-[15px] text-grey-600">
          เสาหลักเก็บข้อมูลของ ClassLoop — คะแนนจากข้อสอบไหลเข้าแดชบอร์ด และถูกแปลงเป็นเกมต่ออัตโนมัติ
        </p>
      </div>

      {/* pipeline strip */}
      <div className="grid gap-3 sm:grid-cols-3">
        {PIPELINE.map(({ icon: Icon, title, body }) => (
          <div key={title} className="rounded-2xl border border-pink-100 bg-pink-50 p-4">
            <Icon className="h-6 w-6 text-pink-600" />
            <p className="mt-2 text-[15px] font-bold text-ink">{title}</p>
            <p className="mt-1 text-sm text-grey-600">{body}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* dropzone */}
        <div className="rounded-2xl border border-grey-300/50 bg-paper p-5 lg:col-span-2">
          <h2 className="text-lg font-bold text-ink">ออกข้อสอบจากไฟล์</h2>
          <p className="mt-0.5 text-sm text-grey-600">หย่อนไฟล์บทเรียนได้ทุกแบบ ครบจบในที่เดียว</p>

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
                handleFile(e.dataTransfer.files[0]?.name)
              }}
              className={cn(
                'mt-3 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-12 text-center transition-colors',
                dragging ? 'border-pink-500 bg-pink-50/60' : 'border-pink-300/80 bg-pink-50/20',
              )}
            >
              <FileUp className="h-10 w-10 text-pink-500" />
              <p className="mt-3 text-[15px] font-semibold text-ink">ลากไฟล์บทเรียนมาวางที่นี่</p>
              <p className="mt-1 text-sm text-grey-600">.docx .xlsx .pdf .pptx ได้หมด</p>
              <button
                type="button"
                onClick={() => fileInput.current?.click()}
                className="mt-4 rounded-xl bg-pink-600 px-4 py-2.5 text-sm font-semibold text-paper transition-colors hover:bg-pink-500"
              >
                เลือกไฟล์
              </button>
              <input
                ref={fileInput}
                type="file"
                accept=".doc,.docx,.xls,.xlsx,.pdf,.ppt,.pptx"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0]?.name)}
              />
            </div>
          )}

          {fileState.phase === 'analyzing' && (
            <div className="mt-3 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-pink-300/80 bg-pink-50/40 px-6 py-12 text-center">
              <Loader2 className="h-10 w-10 animate-spin text-pink-500" />
              <p className="mt-3 text-[15px] font-semibold text-ink">กำลังอ่าน {fileState.name}</p>
              <p className="mt-1 animate-pulse text-sm text-grey-600">
                วิเคราะห์เนื้อหา → ออกแบบ Pre-test และ Post-test...
              </p>
            </div>
          )}

          {fileState.phase === 'done' && (
            <div className="mt-3 rounded-2xl border border-pink-300 bg-pink-50/60 px-6 py-10 text-center">
              <CheckCircle2 className="mx-auto h-10 w-10 text-pink-600" />
              <p className="mt-3 text-[15px] font-bold text-ink">
                ได้ Pre-test 5 ข้อ + Post-test 5 ข้อ
              </p>
              <p className="mt-1 text-sm text-grey-600">จาก {fileState.name}</p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <button
                  type="button"
                  onClick={() => navigate('/teacher/live')}
                  className="rounded-xl bg-pink-600 px-4 py-2.5 text-sm font-semibold text-paper transition-colors hover:bg-pink-500"
                >
                  ใช้ในคาบเรียนเลย
                </button>
                <button
                  type="button"
                  onClick={() => setFileState({ phase: 'idle' })}
                  className="rounded-xl border border-pink-300 px-4 py-2.5 text-sm font-semibold text-pink-600 transition-colors hover:bg-pink-50"
                >
                  ทำไฟล์อื่น
                </button>
              </div>
            </div>
          )}

          <p className="mt-4 rounded-xl bg-canvas px-4 py-3 text-sm text-grey-600 flex items-center gap-1.5">
            <Lightbulb className="h-4 w-4 text-pink-600 shrink-0" />
            <span>ข้อสอบชุดเดียวกันนี้จะกลายเป็นเกม Speed Quiz ในคาบ และคะแนนขึ้นแดชบอร์ดอัตโนมัติ</span>
          </p>
        </div>

        {/* question bank */}
        <div className="rounded-2xl border border-grey-300/50 bg-paper p-5 lg:col-span-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold text-ink">คลังข้อสอบ</h2>
              <p className="mt-0.5 text-sm text-grey-600">
                {hofstede?.title ?? 'Hofstede'} · สัปดาห์ {hofstede?.week ?? 2}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {Object.entries(DIFFICULTY_META).map(([key, { label, chip }]) => (
                <span key={key} className={cn('rounded-full px-3 py-1 text-sm font-medium', chip)}>
                  {label} {counts[key as keyof typeof counts]} ข้อ
                </span>
              ))}
              <button
                type="button"
                onClick={() => showToast('สร้างแบบฝึกใหม่ 5 ข้อสำเร็จ!')}
                className="rounded-lg border border-pink-300 px-3 py-1.5 text-sm font-medium text-pink-600 transition-colors hover:bg-pink-50"
              >
                สร้างเพิ่ม
              </button>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {generatedContent.pretest.map((q, i) => {
              const meta = DIFFICULTY_META[q.difficulty]
              const isEditing = editingId === q.id

              if (isEditing) {
                return (
                  <div key={q.id} className="rounded-2xl border-2 border-pink-400 bg-pink-50/50 p-4 space-y-3 shadow-md">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-pink-600">แก้ไขข้อสอบข้อที่ {i + 1}</span>
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="text-xs text-grey-500 hover:underline"
                      >
                        ยกเลิก
                      </button>
                    </div>

                    {/* Stem Editor */}
                    <div>
                      <label className="block text-xs font-bold text-ink mb-1">โจทย์คำถาม:</label>
                      <textarea
                        rows={2}
                        value={editForm.stem}
                        onChange={(e) => setEditForm((prev) => ({ ...prev, stem: e.target.value }))}
                        className="w-full rounded-xl border border-grey-300 bg-paper p-2 text-xs text-ink outline-none focus:border-pink-500"
                      />
                    </div>

                    {/* Options Editor */}
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
                              'w-full rounded-lg border p-2 text-xs outline-none',
                              editForm.answerIndex === optIdx ? 'border-pink-500 bg-pink-50 font-bold' : 'border-grey-300 bg-paper'
                            )}
                          />
                        </div>
                      ))}
                    </div>

                    {/* Misconception Editor */}
                    <div>
                      <label className="block text-xs font-bold text-ink mb-1">ข้อสังเกต / จุดที่มักเข้าใจผิด:</label>
                      <input
                        type="text"
                        value={editForm.misconception}
                        onChange={(e) => setEditForm((prev) => ({ ...prev, misconception: e.target.value }))}
                        className="w-full rounded-xl border border-grey-300 bg-paper p-2 text-xs text-ink outline-none focus:border-pink-500"
                      />
                    </div>

                    {/* Action buttons */}
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
                <div key={q.id} className="rounded-2xl border border-grey-300/50 p-4 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-semibold', meta.chip)}>
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
                      <span className="text-sm text-grey-600">
                        ข้อ {i + 1}/{generatedContent.pretest.length}
                      </span>
                    </div>
                  </div>
                  <p className="mt-2.5 text-[15px] font-semibold leading-relaxed text-ink">
                    {q.stem}
                  </p>
                  <div className="mt-3 grid gap-1.5 sm:grid-cols-2">
                    {q.options.map((opt, oi) => (
                      <div
                        key={opt}
                        className={cn(
                          'flex items-start gap-2 rounded-lg border px-3 py-2 text-sm leading-relaxed',
                          oi === q.answerIndex
                            ? 'border-pink-400 bg-pink-50 font-semibold text-ink'
                            : 'border-grey-300/40 text-grey-600',
                        )}
                      >
                        {oi === q.answerIndex && (
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-pink-600" />
                        )}
                        {opt}
                      </div>
                    ))}
                  </div>
                  <p className="mt-2.5 text-sm text-grey-600">
                    <span className="font-semibold text-pink-600">จุดที่มักเข้าใจผิด:</span>{' '}
                    {q.misconception}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>

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
