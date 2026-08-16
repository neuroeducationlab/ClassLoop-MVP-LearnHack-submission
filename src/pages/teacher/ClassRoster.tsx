import { useState } from 'react'
import {
  AlertCircle,
  CheckCircle2,
  FileText,
  Filter,
  MessageSquare,
  Search,
  TrendingDown,
  TrendingUp,
  Users,
} from 'lucide-react'
import { useApp } from '@/context/AppContext'
import {
  WEEKLY_SCORES,
  getStudentAssignments,
  type Student,
} from '@/data/seed-data'
import { cn } from '@/lib/utils'

export default function ClassRoster() {
  const {
    students,
    responses,
    getParticipationRate,
    getAverageScore,
    getFacultyGap,
  } = useApp()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFaculty, setSelectedFaculty] = useState('all')
  const [selectedSecFilter, setSelectedSecFilter] = useState<'all' | 'sec1' | 'sec2' | 'sec3'>('all')
  const [assignmentFilter, setAssignmentFilter] = useState<'all' | 'missing' | 'complete'>('all')

  const sectionOptions = [
    { id: 'all', label: 'ทุก Sec (74 คน)' },
    { id: 'sec1', label: 'Sec 1 (24 คน)' },
    { id: 'sec2', label: 'Sec 2 (25 คน)' },
    { id: 'sec3', label: 'Sec 3 (25 คน)' },
  ]

  const faculties = [
    { id: 'all', label: 'ทุกคณะ (74)' },
    { id: 'Accounting', label: 'การบัญชี (18)' },
    { id: 'Communication Arts', label: 'นิเทศศาสตร์ (15)' },
    { id: 'Engineering', label: 'วิศวกรรมศาสตร์ (12)' },
    { id: 'Business Admin', label: 'บริหารธุรกิจ (15)' },
    { id: 'Digital Media', label: 'ดิจิทัลมีเดีย (14)' },
  ]

  // Filter students
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.faculty.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesFaculty =
      selectedFaculty === 'all' || s.faculty === selectedFaculty

    const matchesSec =
      selectedSecFilter === 'all' || s.sec === selectedSecFilter

    const hwStatus = getStudentAssignments(s.id, s.avatarSeed)
    const matchesAssignment =
      assignmentFilter === 'all' ||
      (assignmentFilter === 'missing' && !hwStatus.isComplete) ||
      (assignmentFilter === 'complete' && hwStatus.isComplete)

    return matchesSearch && matchesFaculty && matchesSec && matchesAssignment
  })

  const getDevelopment = (s: Student) => {
    const w1 = WEEKLY_SCORES.find((w) => w.week === 1)?.byFaculty[s.faculty]
    const w4 = WEEKLY_SCORES.find((w) => w.week === 4)?.byFaculty[s.faculty]
    if (w1 === undefined || w4 === undefined) return null
    return w4 - w1 + ((s.avatarSeed % 5) - 2)
  }

  const getStudentStats = (studentId: string) => {
    const sResponses = responses.filter((r) => r.studentId === studentId)
    if (sResponses.length === 0) {
      return { total: 0, correct: 0, percent: 0, status: 'ยังไม่ได้ตอบ' }
    }
    const correct = sResponses.filter((r) => r.isCorrect).length
    const percent = Math.round((correct / sResponses.length) * 100)
    return {
      total: sResponses.length,
      correct,
      percent,
      status: `${correct}/${sResponses.length} ข้อ (${percent}%)`,
    }
  }

  // Aggregate class assignment stats
  const studentsHW = students.map((s) => ({
    student: s,
    hw: getStudentAssignments(s.id, s.avatarSeed),
  }))
  const missingStudentsCount = studentsHW.filter((item) => !item.hw.isComplete).length

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-1 border-b border-grey-300/40 pb-4">
        <div className="flex items-center gap-2">
          <span className="rounded-xl bg-pink-100 p-2 text-pink-600">
            <Users className="h-5 w-5" />
          </span>
          <h1 className="text-2xl font-extrabold text-ink">
            รายชื่อนักศึกษา & ติดตามการส่งงาน (Class Roster)
          </h1>
        </div>
        <p className="text-sm text-grey-600">
          รายชื่อนักศึกษา 24 คน พร้อมคะแนนสะสมและสถานะการส่งงานประจำวิชา
        </p>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-grey-300/60 bg-paper p-4 shadow-xs space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-grey-600">
            นักศึกษาทั้งหมด
          </span>
          <p className="text-2xl font-extrabold text-ink">{students.length} คน</p>
          <span className="text-xs text-grey-600">จาก 5 คณะวิชา</span>
        </div>

        <div className="rounded-2xl border border-pink-200 bg-pink-50/50 p-4 shadow-xs space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-pink-700">
            สถานะการส่งงาน
          </span>
          <p className="text-2xl font-extrabold text-pink-600">
            ค้างส่ง {missingStudentsCount} คน
          </p>
          <span className="text-xs text-grey-600">ส่งครบแล้ว {students.length - missingStudentsCount} คน</span>
        </div>

        <div className="rounded-2xl border border-grey-300/60 bg-paper p-4 shadow-xs space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-grey-600">
            การมีส่วนร่วม (Spoke Rate)
          </span>
          <p className="text-2xl font-extrabold text-purple-600">
            {getParticipationRate()}%
          </p>
          <span className="text-xs text-grey-600">เคยพูดอย่างน้อย 1 ครั้ง</span>
        </div>

        <div className="rounded-2xl border border-grey-300/60 bg-paper p-4 shadow-xs space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-grey-600">
            คะแนนตอบ Pre-test เฉลี่ย
          </span>
          <p className="text-2xl font-extrabold text-teal-600">{getAverageScore()}%</p>
          <span className="text-xs text-grey-600">ช่องว่างข้ามคณะ: {getFacultyGap()}%</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between rounded-2xl border border-grey-300/60 bg-paper p-4 shadow-xs">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-grey-400" />
          <input
            type="text"
            placeholder="ค้นหาตามชื่อ ชื่อเล่น หรือ คณะ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-grey-300/80 bg-canvas pl-10 pr-4 py-2 text-xs font-medium text-ink outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all"
          />
        </div>

        {/* Assignment Filter Chips */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-bold text-grey-500 mr-1 flex items-center gap-1">
            <FileText className="h-3.5 w-3.5" />
            <span>งาน:</span>
          </span>
          <button
            type="button"
            onClick={() => setAssignmentFilter('all')}
            className={cn(
              'rounded-xl px-3 py-1.5 text-xs font-bold transition-all border cursor-pointer',
              assignmentFilter === 'all'
                ? 'border-pink-500 bg-pink-600 text-white'
                : 'border-grey-300/60 bg-canvas text-grey-600 hover:border-grey-300'
            )}
          >
            ทั้งหมด
          </button>
          <button
            type="button"
            onClick={() => setAssignmentFilter('missing')}
            className={cn(
              'rounded-xl px-3 py-1.5 text-xs font-bold transition-all border cursor-pointer flex items-center gap-1',
              assignmentFilter === 'missing'
                ? 'border-rose-500 bg-rose-600 text-white'
                : 'border-grey-300/60 bg-canvas text-rose-600 hover:border-rose-300'
            )}
          >
            <AlertCircle className="h-3.5 w-3.5" />
            <span>งานค้าง ({missingStudentsCount})</span>
          </button>
          <button
            type="button"
            onClick={() => setAssignmentFilter('complete')}
            className={cn(
              'rounded-xl px-3 py-1.5 text-xs font-bold transition-all border cursor-pointer flex items-center gap-1',
              assignmentFilter === 'complete'
                ? 'border-emerald-500 bg-emerald-600 text-white'
                : 'border-grey-300/60 bg-canvas text-emerald-700 hover:border-emerald-300'
            )}
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>ส่งครบแล้ว ({students.length - missingStudentsCount})</span>
          </button>
        </div>

        {/* Sec & Faculty Select */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-grey-600" />
          <select
            value={selectedSecFilter}
            onChange={(e) => setSelectedSecFilter(e.target.value as any)}
            className="rounded-xl border border-grey-300/80 bg-canvas px-3 py-2 text-xs font-semibold text-ink outline-none focus:border-pink-500 cursor-pointer"
          >
            {sectionOptions.map((sec) => (
              <option key={sec.id} value={sec.id}>
                {sec.label}
              </option>
            ))}
          </select>
          <select
            value={selectedFaculty}
            onChange={(e) => setSelectedFaculty(e.target.value)}
            className="rounded-xl border border-grey-300/80 bg-canvas px-3 py-2 text-xs font-semibold text-ink outline-none focus:border-pink-500 cursor-pointer"
          >
            {faculties.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Student Roster Table */}
      <div className="overflow-hidden rounded-2xl border border-grey-300/60 bg-paper shadow-xs">
        <div className="overflow-x-auto max-h-[480px] overflow-y-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-canvas border-b border-grey-300/40 text-grey-600 uppercase tracking-wider font-extrabold sticky top-0 z-10 shadow-2xs">
              <tr>
                <th className="py-3.5 px-4">นักศึกษา</th>
                <th className="py-3.5 px-4">คณะ / Sec / ชั้นปี</th>
                <th className="py-3.5 px-4">คะแนนสะสมรวม</th>
                <th className="py-3.5 px-4">สถานะการส่งงาน & งานค้าง</th>
                <th className="py-3.5 px-4">มีส่วนร่วมในคลาส</th>
                <th className="py-3.5 px-4">Pre-test</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-grey-300/30 font-medium">
              {filteredStudents.map((s) => {
                const stats = getStudentStats(s.id)
                const hwInfo = getStudentAssignments(s.id, s.avatarSeed)

                return (
                  <tr key={s.id} className="hover:bg-pink-50/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-pink-100 font-extrabold text-pink-700 text-xs shrink-0">
                          {s.nickname.slice(0, 2)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 font-extrabold text-ink">
                            <span>{s.name}</span>
                            <span className="text-pink-600 font-bold">
                              "{s.nickname}"
                            </span>
                          </div>
                          <span className="text-[10px] text-grey-500 font-mono">ID: {s.id}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 flex-wrap">
                          <span className="inline-block rounded-md bg-pink-50 px-2 py-0.5 font-bold text-pink-600 border border-pink-200 text-[11px]">
                            {s.faculty}
                          </span>
                          <span className="inline-block rounded-md bg-purple-50 px-2 py-0.5 font-extrabold text-purple-700 border border-purple-200 text-[11px]">
                            Sec {s.sec.replace('sec', '')}
                          </span>
                        </div>
                        <p className="text-[11px] text-grey-500">ปี {s.year}</p>
                      </div>
                    </td>

                    {/* Total Points */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={cn(
                            'text-sm font-black',
                            hwInfo.totalScore >= 80
                              ? 'text-emerald-600'
                              : hwInfo.totalScore >= 50
                              ? 'text-amber-600'
                              : 'text-rose-600'
                          )}
                        >
                          {hwInfo.totalScore}
                        </span>
                        <span className="text-xs font-bold text-grey-400">/ 100</span>
                      </div>
                    </td>

                    {/* Homework & Missing Status */}
                    <td className="py-3 px-4">
                      {hwInfo.isComplete ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-extrabold text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>ส่งครบทุกงาน</span>
                        </span>
                      ) : (
                        <div className="space-y-1">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-extrabold text-rose-700 border border-rose-200">
                            <AlertCircle className="h-3.5 w-3.5" />
                            <span>ค้าง {hwInfo.missingCount} งาน (-{hwInfo.missingPoints} คะแนน)</span>
                          </span>
                          <div className="flex flex-wrap gap-1 pt-0.5">
                            {hwInfo.missingList.map((m) => (
                              <span
                                key={m.id}
                                className="rounded bg-rose-100/70 text-rose-800 text-[10px] font-bold px-1.5 py-0.5"
                                title={m.title}
                              >
                                {m.code}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </td>

                    {/* Class Participation */}
                    <td className="py-3 px-4 font-bold text-ink">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold',
                          s.spokeCount > 0
                            ? 'bg-purple-50 text-purple-700 border border-purple-200'
                            : 'bg-grey-100 text-grey-500'
                        )}
                      >
                        <MessageSquare className="h-3 w-3" />
                        <span>{s.spokeCount} ครั้ง</span>
                      </span>
                    </td>

                    {/* Pre-test Results & Development */}
                    <td className="py-3 px-4">
                      <span className="font-bold text-ink">{stats.status}</span>
                      {(() => {
                        const dev = getDevelopment(s)
                        if (dev === null) return null
                        const isUp = dev >= 0
                        return (
                          <span
                            className={cn(
                              'ml-2 inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-bold border',
                              isUp
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-rose-50 text-rose-700 border-rose-200'
                            )}
                          >
                            {isUp ? (
                              <TrendingUp className="h-3 w-3" />
                            ) : (
                              <TrendingDown className="h-3 w-3" />
                            )}
                            <span>{isUp ? `+${dev}%` : `${dev}%`}</span>
                          </span>
                        )
                      })()}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
