import { useNavigate } from 'react-router-dom'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import {
  Award,
  BookOpen,
  ExternalLink,
  Flame,
  Gamepad2,
  Lightbulb,
  Sparkles,
  Star,
  TrendingUp,
  Trophy,
  Tv,
  Zap,
} from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { cn } from '@/lib/utils'

export default function Home() {
  const navigate = useNavigate()
  const { currentStudent } = useApp()

  // Top 5 Leaderboard Data sorted by XP/spokeCount
  const leaderboardData = [
    { rank: 1, name: 'ณัฐ', nickname: 'นัท', faculty: 'Digital Media', xp: 240, badge: '🥇' },
    { rank: 2, name: 'วรรณา', nickname: 'นุ้ย', faculty: 'Accounting', xp: 210, badge: '🥈' },
    { rank: 3, name: 'ธีรวัฒน์', nickname: 'ต้น', faculty: 'Engineering', xp: 190, badge: '🥉' },
    { rank: 4, name: 'พรรณี', nickname: 'พลอย', faculty: 'Business Admin', xp: 160, badge: '4' },
    { rank: 5, name: 'สมชาย', nickname: 'แมน', faculty: 'Law', xp: 140, badge: '5' },
  ]

  // Pre-test vs Post-test Growth Comparison Data
  const progressComparisonData = [
    { name: 'Power Distance', pretest: 55, posttest: 85 },
    { name: 'Individualism', pretest: 60, posttest: 90 },
    { name: 'Masculinity', pretest: 70, posttest: 95 },
    { name: 'Uncertainty Avoid', pretest: 50, posttest: 80 },
    { name: 'Long-Term Orient', pretest: 65, posttest: 88 },
  ]

  return (
    <div className="mx-auto w-full max-w-[390px] space-y-5 pb-12">
      {/* Player Welcome Status Card */}
      <div className="rounded-3xl border-2 border-pink-300/80 bg-paper p-5 shadow-xs space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-600 font-black text-lg text-white shadow-md shadow-pink-600/20">
              {currentStudent.nickname.slice(0, 2)}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-base font-bold text-ink">{currentStudent.name}</h1>
                <span className="text-xs font-bold text-pink-600">
                  "{currentStudent.nickname}"
                </span>
              </div>
              <span className="inline-block rounded-md bg-pink-50 px-2 py-0.5 text-[10px] font-semibold text-pink-600 border border-pink-200 mt-0.5">
                {currentStudent.faculty}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1">
            <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-600 border border-amber-200">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
              120 XP
            </span>
            <span className="flex items-center gap-1 text-[11px] font-bold text-orange-500">
              <Flame className="h-3.5 w-3.5 fill-orange-400 text-orange-500" />
              3 วันติด!
            </span>
          </div>
        </div>
      </div>

      {/* 🎮 GAME & INTERACTIVE ACTIVITY LAUNCHER CARD */}
      <div className="rounded-3xl border-2 border-pink-500/80 bg-paper p-5 shadow-md space-y-4 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-pink-600 px-3 py-1 text-xs font-bold text-white shadow-2xs flex items-center gap-1.5">
            <Gamepad2 className="h-3.5 w-3.5" />
            <span>เกมท้าดวลประจำคาบเรียน</span>
          </span>
          <span className="text-xs font-semibold text-pink-600 bg-pink-50 px-2.5 py-0.5 rounded-full border border-pink-200">
            5 คำถาม • +10 XP/ข้อ
          </span>
        </div>

        <div className="space-y-1">
          <h2 className="text-xl font-bold text-ink">Speed Culture Quiz</h2>
          <p className="text-xs font-semibold text-pink-600">
            หัวข้อ: Hofstede's Cultural Dimensions
          </p>
          <p className="text-xs text-grey-600 pt-1 leading-relaxed">
            ตอบคำถามวัดความรู้ 5 ข้อ สะสม XP ติดอันดับ Leaderboard ประจำคลาสเรียนข้ามคณะ!
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/student/join')}
          className="flex w-full min-h-[56px] items-center justify-center gap-2 rounded-2xl bg-pink-600 py-3.5 px-6 text-base font-bold text-white shadow-lg shadow-pink-600/25 hover:bg-pink-600/90 active:scale-[0.98] transition-all cursor-pointer text-center"
        >
          <Zap className="h-5 w-5 fill-white" />
          <span>เริ่มเล่นเกมท้าดวล</span>
        </button>
      </div>

      {/* 💡 PERSONALIZED LEARNING SUGGESTIONS & EXTRA CHANNELS */}
      <div className="rounded-3xl border-2 border-pink-400 bg-paper p-5 shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-pink-100 text-pink-600 font-bold">
              <Lightbulb className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink">คำแนะนำการเรียนรู้ส่วนบุคคล</h3>
              <p className="text-[10px] text-pink-600 font-semibold">วิเคราะห์จากผลคะแนนของคุณ {currentStudent.nickname}</p>
            </div>
          </div>
          <span className="text-[10px] font-bold text-pink-600 bg-pink-50 px-2 py-0.5 rounded-full border border-pink-200">
            AI Suggestion
          </span>
        </div>

        <p className="text-xs text-grey-600 leading-relaxed">
          ผลคะแนนของคุณในบท <strong className="text-ink">Hofstede's Cultural Dimensions</strong> อยู่ที่ 80%! เพื่ออัปสปีดความเข้าใจให้เต็ม 100% แนะนำช่องทางเสริมเพิ่มเติม:
        </p>

        {/* YouTube Suggestion */}
        <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-3 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-bold text-rose-700">
              <Tv className="h-4 w-4 text-rose-600" />
              <span>วิดีโอสรุปแนะนำ (YouTube)</span>
            </span>
            <span className="text-[9px] font-bold text-rose-600 bg-rose-100 px-1.5 py-0.5 rounded">10 นาที</span>
          </div>
          <p className="text-xs font-semibold text-ink">
            Hofstede's 6 Cultural Dimensions Explained With Real-World Examples
          </p>
          <a
            href="https://www.youtube.com/results?search_query=Hofstede+cultural+dimensions"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 hover:underline pt-0.5 cursor-pointer"
          >
            <span>▶️ เปิดดูบน YouTube</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>

        {/* Book / Reading Suggestion */}
        <div className="rounded-2xl border border-blue-200 bg-blue-50/70 p-3 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-bold text-blue-700">
              <BookOpen className="h-4 w-4 text-blue-600" />
              <span>หนังสือ & E-Book แนะนำ</span>
            </span>
            <span className="text-[9px] font-bold text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded">SPU Library</span>
          </div>
          <p className="text-xs font-semibold text-ink">
            Cultures and Organizations: Software of the Mind (บทที่ 2 หน้า 45-60)
          </p>
          <button
            type="button"
            onClick={() => navigate('/student/review')}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:underline pt-0.5 cursor-pointer"
          >
            <span>📖 อ่านสรุปย่อในศูนย์ทบทวน</span>
            <ExternalLink className="h-3 w-3" />
          </button>
        </div>

        {/* Actionable Flashcard Tip */}
        <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-3 flex items-center justify-between gap-2">
          <div className="space-y-0.5">
            <p className="text-xs font-bold text-amber-800 flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5 text-amber-600" />
              <span>ทบทวนแนะนำประจำวัน</span>
            </p>
            <p className="text-[11px] text-amber-900">ทบทวน Flashcards หมวด Uncertainty Avoidance อีก 5 ใบ</p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/student/review')}
            className="rounded-xl bg-amber-500 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-amber-600 shrink-0 cursor-pointer"
          >
            ทบทวน +10XP
          </button>
        </div>
      </div>

      {/* 🏆 LEADERBOARD CARD (อันดับผู้นำคลาสเรียน) */}
      <div className="rounded-3xl border-2 border-amber-300 bg-paper p-5 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 text-amber-600 font-bold">
              <Trophy className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink">Leaderboard อันดับประจำสัปดาห์</h3>
              <p className="text-[10px] text-grey-600">อันดับผู้เรียนที่มี XP สูงสุดในคลาส</p>
            </div>
          </div>
          <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
            Top 5
          </span>
        </div>

        {/* Leaderboard List */}
        <div className="space-y-2">
          {leaderboardData.map((player) => {
            const isMe = player.name === currentStudent.name || player.nickname === currentStudent.nickname
            return (
              <div
                key={player.rank}
                className={cn(
                  'flex items-center justify-between rounded-2xl p-3 border transition-all',
                  isMe
                    ? 'bg-pink-50/90 border-pink-300 shadow-2xs'
                    : 'bg-canvas border-grey-300/40'
                )}
              >
                <div className="flex items-center gap-3">
                  <span className={cn(
                    'flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold shrink-0',
                    player.rank === 1 && 'bg-amber-100 text-amber-700 border border-amber-300',
                    player.rank === 2 && 'bg-slate-200 text-slate-700 border border-slate-300',
                    player.rank === 3 && 'bg-amber-700/10 text-amber-800 border border-amber-700/20',
                    player.rank > 3 && 'bg-canvas text-grey-600 border border-grey-300/40'
                  )}>
                    {player.rank === 1 ? <Trophy className="h-3.5 w-3.5 fill-amber-400 text-amber-600" /> : player.rank}
                  </span>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-ink">{player.name}</span>
                      <span className="text-[11px] font-semibold text-pink-600">
                        "{player.nickname}"
                      </span>
                      {isMe && (
                        <span className="rounded-full bg-pink-600 px-1.5 py-0.5 text-[9px] font-bold text-white">
                          คุณ
                        </span>
                      )}
                    </div>
                    <span className="inline-block rounded-md bg-paper px-1.5 py-0.5 text-[9px] font-medium text-grey-600 border border-grey-300/40">
                      {player.faculty}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200">
                  <Star className="h-3 w-3 fill-amber-400" />
                  <span>{player.xp} XP</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 📈 PROGRESS GROWTH COMPARISON GRAPH (กราฟพัฒนาการเปรียบเทียบก่อนเรียน-หลังเรียน) */}
      <div className="rounded-3xl border-2 border-emerald-300/80 bg-paper p-5 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 font-bold">
              <TrendingUp className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink">กราฟพัฒนาการการเรียนรู้</h3>
              <p className="text-[10px] text-grey-600">เปรียบเทียบ ก่อนเรียน (Pre) vs หลังเรียน (Post)</p>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            +28% พัฒนาขึ้น!
          </span>
        </div>

        {/* Recharts BarChart */}
        <div className="h-[210px] w-full pt-1">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={progressComparisonData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
              <XAxis
                dataKey="name"
                tick={{ fill: '#2A262E', fontSize: 9, fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fill: '#64748B', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-xl bg-ink p-2.5 text-xs text-paper shadow-xl space-y-1">
                        <p className="font-bold text-pink-400">{payload[0].payload.name}</p>
                        <p className="text-pink-300">ก่อนเรียน (Pre-test): {payload[0].value}%</p>
                        <p className="text-emerald-400">หลังเรียน (Post-test): {payload[1].value}%</p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Bar dataKey="pretest" name="ก่อนเรียน (Pre-test)" fill="#F472B6" radius={[4, 4, 0, 0]} barSize={14} />
              <Bar dataKey="posttest" name="หลังเรียน (Post-test)" fill="#DB2777" radius={[4, 4, 0, 0]} barSize={14} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Summary Callout Banner */}
        <div className="rounded-2xl bg-emerald-50 p-3 border border-emerald-200 text-xs text-emerald-950 space-y-1">
          <p className="font-bold flex items-center gap-1 text-emerald-800">
            <Award className="h-4 w-4 text-emerald-600" />
            <span>ผลสรุปพัฒนาการ:</span>
          </p>
          <p className="text-[11px] font-semibold text-emerald-900 leading-relaxed">
            ความเข้าใจเพิ่มขึ้นจาก 60% ก่อนเรียน เป็น 88% หลังเรียน โดยเฉพาะมิติ Masculinity และ Individualism มีความก้าวหน้าสูงสุด!
          </p>
        </div>
      </div>
    </div>
  )
}
