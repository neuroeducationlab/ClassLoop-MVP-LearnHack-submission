import { useState } from 'react'
import {
  Filter,
  MessageSquare,
  Search,
  TrendingDown,
  TrendingUp,
  Users,
} from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { WEEKLY_SCORES, type Student } from '@/data/seed-data'
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

  const faculties = [
    { id: 'all', label: 'ทุกคณะ (24)' },
    { id: 'Accounting', label: 'การบัญชี (6)' },
    { id: 'Communication Arts', label: 'นิเทศศาสตร์ (5)' },
    { id: 'Engineering', label: 'วิศวกรรมศาสตร์ (4)' },
    { id: 'Business Admin', label: 'บริหารธุรกิจ (5)' },
    { id: 'Digital Media', label: 'ดิจิทัลมีเดีย (4)' },
  ]

  // Filter students
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.faculty.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesFaculty =
      selectedFaculty === 'all' || s.faculty === selectedFaculty

    return matchesSearch && matchesFaculty
  })

  /**
   * Development arrow (พัฒนาการ): faculty trajectory from week 1 → week 4
   * post-tests, plus a small stable per-student offset from avatarSeed so rows
   * differ without Math.random() re-rolling on every render.
   */
  const getDevelopment = (s: Student) => {
    const w1 = WEEKLY_SCORES.find((w) => w.week === 1)?.byFaculty[s.faculty]
    const w4 = WEEKLY_SCORES.find((w) => w.week === 4)?.byFaculty[s.faculty]
    if (w1 === undefined || w4 === undefined) return null
    return w4 - w1 + ((s.avatarSeed % 5) - 2)
  }

  // Calculate stats for each student
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

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-1 border-b border-grey-300/40 pb-4">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-pink-50 p-1.5 text-pink-600">
            <Users className="h-5 w-5" />
          </span>
          <h1 className="text-2xl font-bold text-ink">
            รายชื่อนักศึกษาในคลาส (Class Roster)
          </h1>
        </div>
        <p className="text-sm text-grey-600">
          รายชื่อนักศึกษา 24 คน จาก 5 คณะในรายวิชา Principles of International Business Management
        </p>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-grey-300/60 bg-paper p-4 shadow-xs space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-grey-600">
            นักศึกษาทั้งหมด
          </span>
          <p className="text-2xl font-bold text-ink">{students.length} คน</p>
          <span className="text-xs text-grey-600">จาก 5 คณะวิชา</span>
        </div>

        <div className="rounded-2xl border border-grey-300/60 bg-paper p-4 shadow-xs space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-grey-600">
            การมีส่วนร่วม (Spoke Rate)
          </span>
          <p className="text-2xl font-bold text-pink-600">
            {getParticipationRate()}%
          </p>
          <span className="text-xs text-grey-600">เคยพูดอย่างน้อย 1 ครั้ง</span>
        </div>

        <div className="rounded-2xl border border-grey-300/60 bg-paper p-4 shadow-xs space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-grey-600">
            คะแนนตอบ Pre-test เฉลี่ย
          </span>
          <p className="text-2xl font-bold text-ink">{getAverageScore()}%</p>
          <span className="text-xs text-grey-600">ภาพรวมทั้งคลาส</span>
        </div>

        <div className="rounded-2xl border border-grey-300/60 bg-paper p-4 shadow-xs space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-grey-600">
            ช่องว่างคะแนนข้ามคณะ
          </span>
          <p className="text-2xl font-bold text-amber-600">{getFacultyGap()}%</p>
          <span className="text-xs text-grey-600">ระหว่างคณะสูงสุด-ต่ำสุด</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-grey-300/60 bg-paper p-4 shadow-xs">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-grey-600" />
          <input
            type="text"
            placeholder="ค้นหาตามชื่อ ชื่อเล่น หรือ คณะ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-grey-300/80 bg-canvas pl-10 pr-4 py-2 text-xs text-ink outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all"
          />
        </div>

        {/* Faculty Select */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-grey-600" />
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
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-canvas border-b border-grey-300/40 text-grey-600 uppercase tracking-wider font-bold">
              <tr>
                <th className="py-3.5 px-4">นักศึกษา</th>
                <th className="py-3.5 px-4">คณะ</th>
                <th className="py-3.5 px-4">ชั้นปี</th>
                <th className="py-3.5 px-4">จำนวนครั้งที่พูดตอบ</th>
                <th className="py-3.5 px-4">ผลการตอบ Pre-test</th>
                <th className="py-3.5 px-4">พัฒนาการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-grey-300/30">
              {filteredStudents.map((s) => {
                const stats = getStudentStats(s.id)
                return (
                  <tr key={s.id} className="hover:bg-pink-50/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-pink-100 font-bold text-pink-700 text-xs shrink-0">
                          {s.nickname.slice(0, 2)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 font-bold text-ink">
                            <span>{s.name}</span>
                            <span className="text-pink-600 font-semibold">
                              "{s.nickname}"
                            </span>
                          </div>
                          <span className="text-[10px] text-grey-600">ID: {s.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-block rounded-md bg-pink-50 px-2 py-0.5 font-semibold text-pink-600 border border-pink-200">
                        {s.faculty}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-grey-600 font-medium">
                      ปี {s.year}
                    </td>
                    <td className="py-3 px-4 font-bold text-ink">
                      <span className={cn(
                        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs',
                        s.spokeCount > 0 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-grey-100 text-grey-600'
                      )}>
                        <MessageSquare className="h-3 w-3" />
                        <span>{s.spokeCount} ครั้ง</span>
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-ink">{stats.status}</span>
                      {(() => {
                        const dev = getDevelopment(s)
                        if (dev === null) return null
                        const isUp = dev >= 0
                        return (
                          <span className={cn(
                            'ml-2 inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-bold border',
                            isUp ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'
                          )}>
                            {isUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
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
