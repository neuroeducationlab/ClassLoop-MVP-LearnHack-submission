import { useState } from 'react'
import { CheckCircle2, FileText, Upload } from 'lucide-react'
import { useApp } from '@/context/AppContext'

export default function Assignments() {
  const { assignments, submitAssignment } = useApp()

  // Submission input state
  const [submittingId, setSubmittingId] = useState<string | null>(null)
  const [submittedFile, setSubmittedFile] = useState('')

  const handleFileSubmit = (asgId: string) => {
    submitAssignment(asgId, submittedFile || 'Hofstede_ASEAN_Case_Analysis.pdf')
    setSubmittingId(null)
    setSubmittedFile('')
  }

  return (
    <div className="mx-auto w-full max-w-[390px] space-y-5 pb-12">
      {/* Header Banner */}
      <div className="rounded-3xl border-2 border-pink-300/80 bg-paper p-5 shadow-xs text-center space-y-2">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-100 text-pink-600 shadow-inner">
          <FileText className="h-6 w-6" />
        </div>
        <h1 className="text-xl font-bold text-ink">ศูนย์รวมภารกิจสั่งงาน & ส่งงาน</h1>
        <p className="text-xs text-grey-600">
          ติดตามภารกิจการเรียน ส่งงานย่อย และตรวจสอบสถานะการส่งงาน
        </p>
      </div>

      {/* ASSIGNMENTS LIST */}
      <div className="rounded-3xl border-2 border-pink-500/80 bg-paper p-5 shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-grey-300/40 pb-3">
          <span className="text-xs font-bold text-ink flex items-center gap-1.5">
            <FileText className="h-4 w-4 text-pink-600" />
            <span>ภารกิจการเรียนทั้งหมด</span>
          </span>
          <span className="text-[10px] font-bold text-pink-600 bg-pink-50 px-2.5 py-0.5 rounded-full border border-pink-200">
            {assignments.filter((a) => a.submitted).length} / {assignments.length} สำเร็จ
          </span>
        </div>

        <div className="space-y-3">
          {assignments.map((asg) => (
            <div
              key={asg.id}
              className="rounded-2xl border border-pink-200/80 bg-pink-50/40 p-4 space-y-2.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-ink leading-snug">{asg.title}</h3>
                  <p className="text-[11px] font-semibold text-pink-600">{asg.topic}</p>
                </div>
                <span className="shrink-0 text-[10px] font-bold text-pink-600 bg-paper px-2 py-0.5 rounded-full border border-pink-200">
                  {asg.dueDate}
                </span>
              </div>

              <p className="text-xs text-grey-600 leading-relaxed">{asg.description}</p>

              {/* Submission Action */}
              {asg.submitted ? (
                <div className="flex items-center justify-between rounded-xl bg-emerald-50 p-2.5 border border-emerald-200 text-emerald-700 text-xs font-bold">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>ส่งงานเรียบร้อยแล้ว ({asg.submissionFile || 'Hofstede_Case_Analysis.pdf'})</span>
                  </span>
                  <span className="text-[10px] text-grey-600 font-medium">{asg.submittedAt}</span>
                </div>
              ) : (
                <div className="space-y-2 pt-1">
                  {submittingId === asg.id ? (
                    <div className="space-y-2 rounded-xl bg-paper p-3 border border-pink-300">
                      <p className="text-xs font-bold text-ink">แนบไฟล์ หรือ พิมพ์ชื่อไฟล์ส่งงาน:</p>
                      <input
                        type="text"
                        placeholder="ชื่อไฟล์ เช่น Hofstede_Analysis_Somchai.pdf"
                        value={submittedFile}
                        onChange={(e) => setSubmittedFile(e.target.value)}
                        className="w-full rounded-xl border border-grey-300 p-2 text-xs text-ink outline-none"
                      />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleFileSubmit(asg.id)}
                          className="flex-1 rounded-xl bg-pink-600 py-2 text-xs font-bold text-white shadow-xs cursor-pointer"
                        >
                          ยืนยันการส่งงาน
                        </button>
                        <button
                          type="button"
                          onClick={() => setSubmittingId(null)}
                          className="rounded-xl border border-grey-300 bg-canvas px-3 py-2 text-xs font-semibold text-grey-600 cursor-pointer"
                        >
                          ยกเลิก
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setSubmittingId(asg.id)}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-pink-600 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-pink-600/90 transition-all cursor-pointer"
                    >
                      <Upload className="h-4 w-4" />
                      <span>ส่งงานภารกิจนี้</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
