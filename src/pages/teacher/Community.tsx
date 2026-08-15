import { useState } from 'react'
import {
  BookOpen,
  CornerDownRight,
  HelpCircle,
  MessageSquare,
  Pin,
  Send,
  Sparkles,
  Tag,
  Users,
  UserX,
} from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { cn } from '@/lib/utils'

export default function Community() {
  const { posts, students, addPost, addReply } = useApp()

  // Teacher post composer state
  const [postBody, setPostBody] = useState('')
  const [postKind, setPostKind] = useState<'คำถาม' | 'ฟีดแบค' | 'ไอเดีย'>('ฟีดแบค')

  // Reply state per post: { [postId]: string }
  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({})

  // Submit teacher post
  const handleTeacherSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!postBody.trim()) return
    addPost(postBody, false, postKind)
    setPostBody('')
  }

  // Submit teacher reply
  const handleSendReply = (postId: string) => {
    const text = replyTexts[postId]
    if (!text || !text.trim()) return
    addReply(postId, text.trim(), false)
    setReplyTexts((prev) => ({ ...prev, [postId]: '' }))
  }

  // Lookup student details helper
  const getStudent = (studentId: string | null) => {
    if (!studentId) return null
    return students.find((s) => s.id === studentId) || null
  }

  // 3 Static Frequent Question Themes
  const frequentThemes = [
    'ความแตกต่างทางวัฒนธรรม',
    'การเลือก entry mode',
    'ขอบเขตข้อสอบกลางภาค',
  ]

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col gap-1 border-b border-grey-300/40 pb-4">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-pink-50 p-1.5 text-pink-600">
            <MessageSquare className="h-5 w-5" />
          </span>
          <h1 className="text-2xl font-bold text-ink">Community Board & Feedback Hub</h1>
        </div>
        <p className="text-sm text-grey-600">
          กระดานพูดคุย ตั้งกระทู้ถามฟีดแบค และตอบกลับการโต้ตอบกับนักศึกษาในคลาสเรียนข้ามคณะ
        </p>
      </div>

      {/* TEACHER POST COMPOSER */}
      <form
        onSubmit={handleTeacherSubmit}
        className="rounded-2xl border-2 border-pink-500/80 bg-paper p-5 shadow-xs space-y-3"
      >
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-ink flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-pink-600" />
            <span>สร้างกระทู้ถามฟีดแบค / แจ้งเตือนผู้เรียน</span>
          </span>

          <select
            value={postKind}
            onChange={(e) => setPostKind(e.target.value as any)}
            className="rounded-full bg-pink-50 px-3 py-1 text-xs font-semibold text-pink-600 border border-pink-200 outline-none cursor-pointer"
          >
            <option value="ฟีดแบค">ฟีดแบค</option>
            <option value="คำถาม">คำถาม</option>
            <option value="ไอเดีย">ไอเดีย</option>
          </select>
        </div>

        <textarea
          rows={2}
          value={postBody}
          onChange={(e) => setPostBody(e.target.value)}
          placeholder="พิมพ์คำถามถามฟีดแบค หรือ แจ้งข่าวสารให้นักศึกษาโต้ตอบ..."
          className="w-full rounded-xl border border-grey-300/80 bg-canvas p-3 text-sm text-ink outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all resize-none"
        />

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!postBody.trim()}
            className="flex items-center gap-2 rounded-xl bg-pink-600 py-2.5 px-5 text-sm font-bold text-white shadow-md hover:bg-pink-600/90 active:scale-[0.98] disabled:opacity-50 transition-all cursor-pointer"
          >
            <Send className="h-4 w-4" />
            <span>โพสต์กระทู้</span>
          </button>
        </div>
      </form>

      {/* TOP BANNER: คำถามที่ถูกถามบ่อย */}
      <div className="rounded-2xl border border-grey-300/60 bg-paper p-5 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-ink">
          <HelpCircle className="h-4 w-4 text-pink-600" />
          <span>คำถามที่ถูกถามบ่อย (Frequently Asked Themes)</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {frequentThemes.map((theme, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 rounded-full bg-pink-50/80 px-3.5 py-1.5 text-xs font-semibold text-pink-600 border border-pink-200"
            >
              <Tag className="h-3 w-3 text-pink-600" />
              <span>{theme}</span>
            </span>
          ))}
        </div>
      </div>

      {/* PINNED ANNOUNCEMENT CARD */}
      <div className="rounded-2xl border-2 border-pink-300/80 bg-pink-50 p-5 shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-pink-600 font-bold text-sm">
            <Pin className="h-4 w-4 fill-pink-600 text-pink-600" />
            <span>ประกาศจากอาจารย์ผู้สอน (Pinned Announcement)</span>
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-pink-600 bg-paper px-2 py-0.5 rounded-full border border-pink-200">
            Pinned
          </span>
        </div>
        <p className="text-sm font-bold text-ink pl-6 leading-relaxed">
          สอบกลางภาคครอบคลุมสัปดาห์ที่ 1-3 เน้น Hofstede และ Entry Modes
        </p>
      </div>

      {/* COMMUNITY FEED LIST WITH THREAD REPLIES */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-ink uppercase tracking-wider flex items-center gap-2">
            <Users className="h-4 w-4 text-grey-600" />
            <span>กระทู้พูดคุยและการโต้ตอบทั้งหมด ({posts.length})</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {posts.map((post) => {
            const author = getStudent(post.studentId)
            const isAnon = post.isAnonymous || (!author && !post.alias)
            const replies = post.replies || []

            return (
              <div
                key={post.id}
                className="rounded-2xl border border-grey-300/60 bg-paper p-5 shadow-2xs space-y-3 hover:shadow-xs transition-all"
              >
                {/* Post Header: Author, Faculty Chip, Kind Badge, Time */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {/* Avatar Circle */}
                    <div
                      className={cn(
                        'flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold border shrink-0',
                        isAnon
                          ? 'bg-purple-100 text-purple-700 border-purple-300'
                          : post.alias?.includes('ผู้สอน')
                          ? 'bg-pink-600 text-white border-pink-600'
                          : 'bg-pink-100 text-pink-700 border-pink-300'
                      )}
                    >
                      {isAnon ? <UserX className="h-4 w-4 text-purple-600" /> : post.alias?.includes('ผู้สอน') ? <BookOpen className="h-4 w-4 text-white" /> : (author?.nickname.slice(0, 2) || 'SP')}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-ink">
                          {isAnon ? post.alias || 'ไม่ระบุชื่อ' : post.alias || author?.name}
                        </span>
                        {!isAnon && author && (
                          <span className="text-xs font-semibold text-pink-600">
                            "{author.nickname}"
                          </span>
                        )}
                      </div>

                      {/* Faculty Chip Visible on Non-Anonymous Posts */}
                      {!isAnon && author && (
                        <div className="pt-0.5">
                          <span className="inline-block rounded-md bg-canvas px-2 py-0.5 text-xs font-medium text-grey-600 border border-grey-300/40">
                            {author.faculty}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    {/* Kind Badge: คำถาม / ไอเดีย / ฟีดแบค (pink-50 chips) */}
                    <span className="rounded-full bg-pink-50 px-3 py-1 text-xs font-semibold text-pink-600 border border-pink-200">
                      {post.kind}
                    </span>
                    <span className="text-xs text-grey-600">{post.createdAt}</span>
                  </div>
                </div>

                {/* Post Body Text */}
                <p className="text-sm text-ink leading-relaxed font-semibold pt-1">
                  {post.body}
                </p>

                {/* Emoji Reactions Static Counts */}
                <div className="flex items-center gap-3 pt-1 text-xs">
                  {Object.entries(post.reactions).map(([emoji, count]) => (
                    <span
                      key={emoji}
                      className="flex items-center gap-1.5 rounded-full bg-canvas px-3 py-1 text-xs font-semibold text-grey-600 border border-grey-300/40"
                    >
                      <span>{emoji}</span>
                      <span>{count}</span>
                    </span>
                  ))}
                </div>

                {/* THREAD REPLIES SECTION */}
                <div className="pt-3 border-t border-grey-300/30 space-y-2.5">
                  <p className="text-xs font-bold text-grey-600 flex items-center gap-1.5">
                    <MessageSquare className="h-3.5 w-3.5 text-pink-600" />
                    <span>การโต้ตอบในกระทู้ ({replies.length} ความคิดเห็น)</span>
                  </p>

                  {/* Replies List */}
                  {replies.length > 0 && (
                    <div className="space-y-2 pl-3">
                      {replies.map((reply) => (
                        <div
                          key={reply.id}
                          className={cn(
                            'rounded-xl p-3 text-xs space-y-1 border',
                            reply.authorRole === 'teacher'
                              ? 'bg-pink-50/90 border-pink-200 text-ink'
                              : 'bg-canvas border-grey-300/40 text-ink'
                          )}
                        >
                          <div className="flex items-center justify-between text-xs">
                            <span className={cn('font-bold flex items-center gap-1.5', reply.authorRole === 'teacher' ? 'text-pink-600' : 'text-ink')}>
                              <CornerDownRight className="h-3.5 w-3.5" />
                              {reply.authorName}
                            </span>
                            <span className="text-[10px] text-grey-600">{reply.createdAt}</span>
                          </div>
                          <p className="pl-5 text-xs font-medium leading-relaxed">{reply.body}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reply Input Box */}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="ตอบกลับในฐานะอาจารย์..."
                      value={replyTexts[post.id] || ''}
                      onChange={(e) =>
                        setReplyTexts((prev) => ({ ...prev, [post.id]: e.target.value }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleSendReply(post.id)
                        }
                      }}
                      className="flex-1 rounded-xl border border-grey-300/80 bg-canvas px-3.5 py-2 text-xs text-ink outline-none focus:border-pink-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleSendReply(post.id)}
                      className="rounded-xl bg-pink-600 px-4 py-2 text-xs font-bold text-white hover:bg-pink-600/90 transition-colors cursor-pointer shrink-0"
                    >
                      ตอบกลับ
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
