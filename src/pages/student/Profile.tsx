import { Award, Flame, Globe, Star, Trophy, Users, Zap } from 'lucide-react'
import { useApp } from '@/context/AppContext'

export default function Profile() {
  const { currentStudent, studentXP } = useApp()

  return (
    <div className="mx-auto w-full max-w-[390px] space-y-5 pb-12">
      {/* Profile Card */}
      <div className="rounded-3xl border-2 border-pink-300/80 bg-paper p-6 text-center shadow-md space-y-4">
        {/* Large Playful Avatar Circle */}
        <div className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-pink-600 font-black text-3xl text-white shadow-xl shadow-pink-600/30">
          {currentStudent.nickname.slice(0, 2)}
          <span className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-amber-400 text-white shadow-sm border-2 border-paper">
            <Star className="h-4 w-4 fill-white" />
          </span>
        </div>

        <div>
          <h2 className="text-xl font-bold text-ink">
            {currentStudent.name} ({currentStudent.nickname})
          </h2>
          <p className="text-xs font-semibold text-pink-600 mt-0.5">
            {currentStudent.faculty} · ชั้นปีที่ {currentStudent.year}
          </p>
        </div>

        {/* Player Stats Pills Grid */}
        <div className="grid grid-cols-3 gap-2 pt-2">
          <div className="rounded-2xl bg-amber-50 p-3 text-center border border-amber-200">
            <div className="flex justify-center text-amber-500 mb-1">
              <Star className="h-5 w-5 fill-amber-400" />
            </div>
            <p className="text-lg font-black text-amber-600">{studentXP}</p>
            <p className="text-[10px] font-bold text-amber-700">XP ทั้งหมด</p>
          </div>

          <div className="rounded-2xl bg-pink-50 p-3 text-center border border-pink-200">
            <div className="flex justify-center text-pink-600 mb-1">
              <Trophy className="h-5 w-5" />
            </div>
            <p className="text-lg font-black text-pink-600">อันดับ 1</p>
            <p className="text-[10px] font-bold text-pink-700">ประจำคณะ</p>
          </div>

          <div className="rounded-2xl bg-purple-50 p-3 text-center border border-purple-200">
            <div className="flex justify-center text-purple-600 mb-1">
              <Zap className="h-5 w-5" />
            </div>
            <p className="text-lg font-black text-purple-600">3 วัน</p>
            <p className="text-[10px] font-bold text-purple-700">Streak ติดต่อ</p>
          </div>
        </div>
      </div>

      {/* Badges Section */}
      <div className="rounded-3xl border border-grey-300/60 bg-paper p-5 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-ink flex items-center gap-1.5">
          <Award className="h-4 w-4 text-pink-600" />
          <span>เหรียญรางวัลสะสม (Badges)</span>
        </h3>

        <div className="grid grid-cols-2 gap-2.5">
          <div className="flex items-center gap-2.5 rounded-2xl bg-canvas p-3 border border-grey-300/40">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-600 shrink-0">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-ink">ตอบไวได้เปรียบ</p>
              <p className="text-[10px] text-grey-600">ตอบถูกรวดเร็ว 3 ข้อติด</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 rounded-2xl bg-canvas p-3 border border-grey-300/40">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-100 text-sky-600 shrink-0">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-ink">นักสำรวจวัฒนธรรม</p>
              <p className="text-[10px] text-grey-600">ทำภารกิจ Hofstede ครบ</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 rounded-2xl bg-canvas p-3 border border-grey-300/40">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-pink-100 text-pink-600 shrink-0">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-ink">คู่หูข้ามคณะ</p>
              <p className="text-[10px] text-grey-600">เข้าร่วมกิจกรรมจับคู่</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 rounded-2xl bg-canvas p-3 border border-grey-300/40">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-100 text-orange-600 shrink-0">
              <Flame className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-ink">ไฟแรง 3 วันติด</p>
              <p className="text-[10px] text-grey-600">เข้าร่วมต่อเนื่อง 3 คาบ</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
