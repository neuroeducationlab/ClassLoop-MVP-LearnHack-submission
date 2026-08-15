import { useState } from 'react'
import {
  CornerDownRight,
  MessageSquare,
  Send,
  Sparkles,
  UserCheck,
  UserX,
} from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { cn } from '@/lib/utils'

export default function StudentCommunity() {
  const { posts, students, addPost, addReply } = useApp()

  // Composer State
  const [postBody, setPostBody] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [postKind, setPostKind] = useState<'คำถาม' | 'ฟีดแบค' | 'ไอเดีย'>('คำถาม')

  // Reply state per post: { [postId]: string }
  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({})

  // Demo anonymous alias preview
  const anonPreviewAlias = 'แมวน้ำ #9'

  // Student post submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!postBody.trim()) return
    addPost(postBody, isAnonymous, postKind)
    setPostBody('')
  }

  // Student reply submission
  const handleSendReply = (postId: string) => {
    const text = replyTexts[postId]
    if (!text || !text.trim()) return
    addReply(postId, text.trim(), isAnonymous)
    setReplyTexts((prev) => ({ ...prev, [postId]: '' }))
  }

  // Lookup student details helper
  const getStudent = (studentId: string | null) => {
    if (!studentId) return null
    return students.find((s) => s.id === studentId) || null
  }

  return (
    <div className="mx-auto w-full max-w-[390px] space-y-5 pb-12">
      {/* Header Banner */}
      <div className="rounded-3xl border-2 border-pink-300/80 bg-paper p-5 shadow-xs text-center space-y-2">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-100 text-pink-600 shadow-inner">
          <MessageSquare className="h-6 w-6" />
        </div>
        <h1 className="text-xl font-bold text-ink">ชุมชนแลกเรียนรู้ (Community)</h1>
        <p className="text-xs text-grey-600">
          พื้นที่ถาม-ตอบ แชร์ไอเดีย ส่งฟีดแบค และพูดคุยโต้ตอบกับอาจารย์และเพื่อนข้ามคณะ
        </p>
      </div>

      {/* COMPOSER CARD AT TOP */}
      <form
        onSubmit={handleSubmit}
        className="rounded-3xl border-2 border-pink-500/80 bg-paper p-4 shadow-md space-y-3"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-ink flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-pink-600" />
            <span>สร้างโพสต์ใหม่</span>
          </span>

          {/* Kind Select */}
          <select
            value={postKind}
            onChange={(e) => setPostKind(e.target.value as any)}
            className="rounded-full bg-pink-50 px-3 py-1 text-xs font-semibold text-pink-600 border border-pink-200 outline-none cursor-pointer"
          >
            <option value="คำถาม">คำถาม</option>
            <option value="ฟีดแบค">ฟีดแบค</option>
            <option value="ไอเดีย">ไอเดีย</option>
          </select>
        </div>

        {/* Text Area */}
        <textarea
          rows={3}
          value={postBody}
          onChange={(e) => setPostBody(e.target.value)}
          placeholder="พิมพ์คำถาม แชร์ไอเดีย หรือ ส่งฟีดแบคที่นี่..."
          className="w-full rounded-2xl border border-grey-300/80 bg-canvas p-3 text-xs text-ink outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all resize-none"
        />

        {/* Anonymous Toggle Switch */}
        <div className="flex flex-col gap-2 rounded-2xl bg-pink-50/70 p-3 border border-pink-200/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isAnonymous ? (
                <UserX className="h-4 w-4 text-pink-600" />
              ) : (
                <UserCheck className="h-4 w-4 text-pink-600" />
              )}
              <span className="text-xs font-bold text-ink">
                โพสต์แบบไม่ระบุชื่อ (Anonymous)
              </span>
            </div>

            {/* Switch Toggle */}
            <button
              type="button"
              onClick={() => setIsAnonymous(!isAnonymous)}
              className={cn(
                'relative h-6 w-11 rounded-full transition-colors cursor-pointer',
                isAnonymous ? 'bg-pink-600' : 'bg-grey-300'
              )}
            >
              <span
                className={cn(
                  'absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-transform',
                  isAnonymous && 'translate-x-5'
                )}
              />
            </button>
          </div>

          {/* Anonymous Preview Text */}
          {isAnonymous && (
            <p className="text-[11px] font-semibold text-pink-600 pl-6 animate-fadeIn">
              จะโพสต์ในชื่อแฝง: <strong className="text-ink">{anonPreviewAlias}</strong>
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!postBody.trim()}
          className="flex w-full min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-pink-600 py-2.5 px-4 text-sm font-bold text-white shadow-md hover:bg-pink-600/90 active:scale-[0.98] disabled:opacity-50 transition-all cursor-pointer"
        >
          <Send className="h-4 w-4" />
          <span>โพสต์ข้อความ</span>
        </button>
      </form>

      {/* FEED LIST WITH THREAD REPLIES */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-grey-600 px-1">
          กระดานพูดคุยและการโต้ตอบล่าสุด ({posts.length})
        </h2>

        {posts.map((post) => {
          const author = getStudent(post.studentId)
          const isAnon = post.isAnonymous || !author
          const replies = post.replies || []

          return (
            <div
              key={post.id}
              className="rounded-3xl border border-grey-300/60 bg-paper p-4 shadow-2xs space-y-3"
            >
              {/* Author & Kind Badge Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  {/* Avatar */}
                  <div
                    className={cn(
                      'flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold border shrink-0',
                      isAnon
                        ? 'bg-purple-100 text-purple-700 border-purple-300'
                        : 'bg-pink-100 text-pink-700 border-pink-300'
                    )}
                  >
                    {isAnon ? <UserX className="h-4 w-4 text-purple-600" /> : (author?.nickname.slice(0, 2) || 'SP')}
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-ink">
                        {isAnon ? post.alias || 'ไม่ระบุชื่อ' : author?.name}
                      </span>
                      {!isAnon && author && (
                        <span className="text-[11px] font-semibold text-pink-600">
                          "{author.nickname}"
                        </span>
                      )}
                    </div>

                    {!isAnon && author && (
                      <span className="inline-block rounded-md bg-canvas px-1.5 py-0.5 text-[9px] font-medium text-grey-600 border border-grey-300/40">
                        {author.faculty}
                      </span>
                    )}
                  </div>
                </div>

                {/* Kind Badge & Time */}
                <div className="flex flex-col items-end gap-1">
                  <span className="rounded-full bg-pink-50 px-2.5 py-0.5 text-[10px] font-bold text-pink-600 border border-pink-200">
                    {post.kind}
                  </span>
                  <span className="text-[10px] text-grey-600">{post.createdAt}</span>
                </div>
              </div>

              {/* Post Body */}
              <p className="text-xs text-ink leading-relaxed font-semibold px-0.5">
                {post.body}
              </p>

              {/* Static Reaction Counts */}
              <div className="flex items-center gap-2 pt-1 text-xs">
                {Object.entries(post.reactions).map(([emoji, count]) => (
                  <span
                    key={emoji}
                    className="flex items-center gap-1 rounded-full bg-canvas px-2.5 py-0.5 text-[11px] font-semibold text-grey-600 border border-grey-300/40"
                  >
                    <span>{emoji}</span>
                    <span>{count}</span>
                  </span>
                ))}
              </div>

              {/* THREAD REPLIES SECTION */}
              <div className="pt-2 border-t border-grey-300/30 space-y-2">
                <p className="text-[11px] font-bold text-grey-600 flex items-center gap-1">
                  <MessageSquare className="h-3 w-3 text-pink-600" />
                  <span>การโต้ตอบ ({replies.length} ความคิดเห็น)</span>
                </p>

                {/* Replies List */}
                {replies.length > 0 && (
                  <div className="space-y-2 pl-2">
                    {replies.map((reply) => (
                      <div
                        key={reply.id}
                        className={cn(
                          'rounded-2xl p-2.5 text-xs space-y-1 border',
                          reply.authorRole === 'teacher'
                            ? 'bg-pink-50/90 border-pink-200 text-ink'
                            : 'bg-canvas border-grey-300/40 text-ink'
                        )}
                      >
                        <div className="flex items-center justify-between text-[11px]">
                          <span className={cn('font-bold flex items-center gap-1', reply.authorRole === 'teacher' ? 'text-pink-600' : 'text-ink')}>
                            <CornerDownRight className="h-3 w-3" />
                            {reply.authorName}
                          </span>
                          <span className="text-[10px] text-grey-600">{reply.createdAt}</span>
                        </div>
                        <p className="pl-4 text-xs font-medium">{reply.body}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply Input Box */}
                <div className="flex items-center gap-1.5 pt-1">
                  <input
                    type="text"
                    placeholder="พิมพ์ตอบกลับกระทู้นี้..."
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
                    className="flex-1 rounded-xl border border-grey-300/80 bg-canvas px-3 py-1.5 text-xs text-ink outline-none focus:border-pink-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleSendReply(post.id)}
                    className="rounded-xl bg-pink-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-pink-600/90 transition-colors cursor-pointer shrink-0"
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
  )
}
