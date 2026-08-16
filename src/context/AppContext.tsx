import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { useNavigate } from 'react-router-dom'
import {
  COMMUNITY_POSTS,
  COURSE,
  GAP_ANALYSIS,
  GENERATED_CONTENT,
  INITIAL_ASSIGNMENTS,
  INITIAL_EXPECTATIONS,
  PRETEST_RESPONSES,
  REMEDIATION,
  STUDENTS,
  TOPICS,
  type Activity,
  type Assignment,
  type CommunityPost,
  type Course,
  type ExpectationSticky,
  type GapAnalysis,
  type GeneratedContent,
  type PostKind,
  type PostReply,
  type PretestResponse,
  type Remediation,
  type Student,
  type Topic,
} from '@/data/seed-data'

export type Role = 'teacher' | 'student'

export type LiveSession = {
  active: boolean
  currentQuestionIndex: number
  joinedStudents: string[]
  /** Question indexes whose correct answer the teacher has revealed. */
  revealedIndexes: number[]
}

/** Demo identities — the seed data describes the class, not who is signed in. */
const TEACHER_NAME = 'อ.ดร.ธนพร'
const DEMO_STUDENT_ID = 's-nat'
const demoStudent: Student = STUDENTS.find((s) => s.id === DEMO_STUDENT_ID) ?? STUDENTS[0]

const QUESTION_COUNT = GENERATED_CONTENT.pretest.length

const INITIAL_SESSION: LiveSession = {
  active: false,
  currentQuestionIndex: 0,
  joinedStudents: Array.from(new Set(PRETEST_RESPONSES.map((r) => r.studentId))),
  revealedIndexes: [],
}

/** Alias pool for anonymous posts, in the same animal style as the seed posts. */
const ANON_ANIMALS = ['หมีขั้วโลก', 'เพนกวิน', 'แมวน้ำ', 'นกฮูก', 'โลมา', 'นากทะเล', 'เม่นแคระ']

/**
 * AppProvider sits ABOVE BrowserRouter (so state survives navigation), which
 * means it cannot call useNavigate itself. AppNavigationBridge — rendered just
 * inside the router — registers the live navigate function here so that
 * endSession() can route the teacher back to the dashboard.
 */
const navigateRef: { current: ((to: string) => void) | null } = { current: null }

export function AppNavigationBridge() {
  const navigate = useNavigate()
  useEffect(() => {
    navigateRef.current = navigate
    return () => {
      navigateRef.current = null
    }
  }, [navigate])
  return null
}

export type Language = 'th' | 'en'
export type TranslationKey = keyof typeof TRANSLATIONS['th']

export const TRANSLATIONS = {
  th: {
    review: 'ทบทวน',
    exams: 'ข้อสอบ',
    attendance: 'เช็คชื่อ',
    courses: 'รายวิชา',
    comingSoon: 'เร็วๆ นี้',
    logout: 'ออกจากระบบ',
    settings: 'ตั้งค่า',
    myProfile: 'โปรไฟล์',
    notifications: 'การแจ้งเตือน',
    resetDemo: 'รีเซ็ตข้อมูลเดโม',
    exportPdf: 'ส่งออกรายงาน PDF',
    submitted: 'ส่งแล้ว',
    avgUnderstanding: 'ความเข้าใจเฉลี่ย',
    participation: 'มีส่วนร่วม',
    weeklyUnderstanding: 'ความเข้าใจรายหัวข้อ (รายสัปดาห์)',
    facultyAverage: 'คะแนนเฉลี่ยรายคณะ',
    avgGrowth: 'พัฒนาการเฉลี่ย',
    whoHasntSubmitted: 'ใครยังไม่ส่ง',
    autoRemind: 'เตือนอัตโนมัติ',
    remind: 'เตือน',
    reminded: 'เตือนแล้ว',
    facultyStrengths: 'คณะไหนทำอะไรได้ดี',
    sendRemediation: 'ส่งชุดทบทวนรายบุคคล',
    remediationSentLabel: 'ส่งชุดทบทวนแล้ว',
    gameFixBoring: 'แก้คาบน่าเบื่อด้วยเกม',
    teacher: 'อาจารย์',
    student: 'นักศึกษา',
    switchRole: 'สลับบทบาท',
    dashboard: 'แดชบอร์ด',
    studio: 'สตูดิโอ',
    liveSession: 'คาบเรียน',
    roster: 'รายชื่อ',
    community: 'คอมมูนิตี้',
    assignments: 'งาน',
    syllabus: 'Syllabus',
    profile: 'ฉัน',
    learn: 'เรียน',
    generateMedia: 'สร้างสื่อการสอน',
    usingSample: 'ใช้ syllabus ตัวอย่าง (PIBM)',
    sampleLoaded: 'ดึงข้อมูล Syllabus ตัวอย่างแล้ว',
    studentsCount: 'จำนวนนักศึกษา',
    faculties: 'คณะที่มาเรียน',
    useActivity: 'ใช้กิจกรรมนี้',
    activities: 'กิจกรรม',
    flashcards: 'Flashcards',
    practiceExam: 'ลองสอบ',
    whyItWorks: 'ทำไมถึงเวิร์ก',
    mixedClassTip: 'เคล็ดลับสำหรับห้องเรียนหลายคณะ',
    simulateStudents: 'จำลองผู้เรียน',
    randomSpeaker: 'สุ่มคนที่ยังไม่ได้พูด',
    teachingPlanMode: 'ตาราง & สื่อการสอน',
    liveMode: 'สอนเรียลไทม์',
    joinCode: 'รหัสเข้าร่วมกิจกรรม',
    joinedCount: 'เข้าร่วมแล้ว',
    answerReveal: 'เฉลย',
    answerRevealed: 'เฉลยแล้ว ✓',
    endSession: 'จบกิจกรรม',
    previous: 'ก่อนหน้า',
    next: 'ถัดไป',
    speedQuiz: 'Speed Culture Quiz',
    startQuizGame: 'เริ่มเล่นเกมท้าดวล',
    leaderboardTitle: 'Leaderboard อันดับประจำสัปดาห์',
    growthChartTitle: 'กราฟพัฒนาการการเรียนรู้',
    pretestScore: 'ก่อนเรียน (Pre-test)',
    posttestScore: 'หลังเรียน (Post-test)',
    xpEarned: 'XP',
    streakDays: 'วันติด!',
    assignmentHub: 'ศูนย์รวมภารกิจสั่งงาน & ส่งงาน',
    submitTask: 'ส่งงานภารกิจนี้',
    submittedSuccess: 'ส่งงานเรียบร้อยแล้ว',
    confirmSubmit: 'ยืนยันการส่งงาน',
    cancel: 'ยกเลิก',
    postPlaceholder: 'พิมพ์คำถาม แชร์ไอเดีย หรือ ส่งฟีดแบคที่นี่...',
    anonToggle: 'โพสต์แบบไม่ระบุชื่อ (Anonymous)',
    anonPreview: 'จะโพสต์ในชื่อแฝง:',
    submitPost: 'โพสต์ข้อความ',
    reply: 'ตอบกลับ',
    replyPlaceholder: 'พิมพ์ตอบกลับกระทู้นี้...',
    interactions: 'การโต้ตอบ',
  },
  en: {
    review: 'Review',
    exams: 'Exams',
    attendance: 'Attendance',
    courses: 'Courses',
    comingSoon: 'Coming soon',
    logout: 'Sign out',
    settings: 'Settings',
    myProfile: 'Profile',
    notifications: 'Notifications',
    resetDemo: 'Reset demo data',
    exportPdf: 'Export PDF report',
    submitted: 'Submitted',
    avgUnderstanding: 'Avg. understanding',
    participation: 'Participation',
    weeklyUnderstanding: 'Understanding by topic (weekly)',
    facultyAverage: 'Average score by faculty',
    avgGrowth: 'Average growth',
    whoHasntSubmitted: "Who hasn't submitted",
    autoRemind: 'Auto reminder',
    remind: 'Remind',
    reminded: 'Reminded',
    facultyStrengths: 'What each faculty excels at',
    sendRemediation: 'Send personal revision pack',
    remediationSentLabel: 'Revision pack sent',
    gameFixBoring: 'Fix boring classes with games',
    teacher: 'Faculty',
    student: 'Student',
    switchRole: 'Switch View',
    dashboard: 'Dashboard',
    studio: 'Syllabus Studio',
    liveSession: 'Live Class',
    roster: 'Class Roster',
    community: 'Community',
    assignments: 'Tasks',
    syllabus: 'Syllabus',
    profile: 'Profile',
    learn: 'Home',
    generateMedia: 'Generate Media',
    usingSample: 'Use Sample Syllabus (PIBM)',
    sampleLoaded: 'Sample Syllabus Loaded',
    studentsCount: 'Student Count',
    faculties: 'Enrolled Faculties',
    useActivity: 'Use This Activity',
    activities: 'Activities',
    flashcards: 'Flashcards',
    practiceExam: 'Practice Quiz',
    whyItWorks: 'Pedagogical Rationale',
    mixedClassTip: 'Multi-Faculty Classroom Tip',
    simulateStudents: 'Simulate Students',
    randomSpeaker: 'Pick Random Speaker',
    teachingPlanMode: 'Course Plan & Media',
    liveMode: 'Live Control',
    joinCode: 'Join Code',
    joinedCount: 'Joined',
    answerReveal: 'Reveal Answer',
    answerRevealed: 'Revealed ✓',
    endSession: 'End Class',
    previous: 'Previous',
    next: 'Next',
    speedQuiz: 'Speed Culture Quiz',
    startQuizGame: 'Start Cultural Game',
    leaderboardTitle: 'Weekly Leaderboard Rank',
    growthChartTitle: 'Learning Growth & Progress',
    pretestScore: 'Pre-test Score',
    posttestScore: 'Post-test Score',
    xpEarned: 'XP',
    streakDays: 'Days Streak!',
    assignmentHub: 'Assignments & Submission Hub',
    submitTask: 'Submit Assignment',
    submittedSuccess: 'Submitted Successfully',
    confirmSubmit: 'Confirm Submission',
    cancel: 'Cancel',
    postPlaceholder: 'Post a question, share an idea, or submit feedback...',
    anonToggle: 'Post Anonymously',
    anonPreview: 'Posting as alias:',
    submitPost: 'Post Message',
    reply: 'Reply',
    replyPlaceholder: 'Write a reply...',
    interactions: 'Replies',
  },
}

type AppState = {
  // who is looking at the demo
  role: Role
  setRole: (role: Role) => void
  displayName: string
  teacherName: string
  currentStudent: Student

  // static demo narrative (never mutates)
  course: Course
  topics: Topic[]
  generatedContent: GeneratedContent
  gapAnalysis: GapAnalysis
  remediation: Remediation

  // live state
  students: Student[]
  responses: PretestResponse[]
  posts: CommunityPost[]
  currentSession: LiveSession
  isGenerating: boolean
  isSimulating: boolean

  // assignment state
  assignments: Assignment[]
  submitAssignment: (id: string, fileName?: string) => void

  // per-student remediation: teacher pushes, students see it in their เรียน tab
  remediationSent: boolean
  sendRemediation: () => void

  // expectation post-it state
  expectations: ExpectationSticky[]
  addExpectation: (text: string, color?: ExpectationSticky['color']) => void

  // active activity assigned from studio
  activeActivity: Activity | null
  setActiveActivity: (activity: Activity) => void

  // student xp state
  studentXP: number
  addXP: (amount: number) => void

  // language internationalization state
  lang: 'th' | 'en'
  setLang: (lang: 'th' | 'en') => void
  t: (key: keyof typeof TRANSLATIONS['th']) => string

  // actions
  resetDemo: () => void
  startGeneration: () => void
  simulateStudents: () => void
  startSession: () => void
  nextQuestion: () => void
  prevQuestion: () => void
  revealAnswer: () => void
  endSession: () => void
  addPost: (body: string, isAnonymous: boolean, kind?: 'คำถาม' | 'ฟีดแบค' | 'ไอเดีย') => void
  addReply: (postId: string, body: string, isAnonymous?: boolean) => void
  pickRandomSpeaker: () => Student

  // derived metrics — computed live from state, unlike the static gapAnalysis
  getSubmissionCount: () => number
  getAverageScore: () => number
  getFacultyGap: () => number
  getParticipationRate: () => number
}

const AppContext = createContext<AppState | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>('teacher')
  const [students, setStudents] = useState<Student[]>(STUDENTS)
  const [responses, setResponses] = useState<PretestResponse[]>(PRETEST_RESPONSES)
  const [posts, setPosts] = useState<CommunityPost[]>(COMMUNITY_POSTS)
  const [currentSession, setCurrentSession] = useState<LiveSession>(INITIAL_SESSION)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSimulating, setIsSimulating] = useState(false)
  const [remediationSent, setRemediationSent] = useState(false)

  /* ---- timers: every pending timeout is owned here so resetDemo() and
     unmount can cancel mid-flight animations without leaking updates ---- */
  const genTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const simTimers = useRef<Set<ReturnType<typeof setTimeout>>>(new Set())
  const postSeq = useRef(0)

  const clearGenTimer = useCallback(() => {
    if (genTimer.current !== null) {
      clearTimeout(genTimer.current)
      genTimer.current = null
    }
  }, [])

  const clearSimTimers = useCallback(() => {
    for (const id of simTimers.current) clearTimeout(id)
    simTimers.current.clear()
  }, [])

  useEffect(
    () => () => {
      clearGenTimer()
      clearSimTimers()
    },
    [clearGenTimer, clearSimTimers],
  )

  const [assignments, setAssignments] = useState<Assignment[]>(INITIAL_ASSIGNMENTS)
  const [expectations, setExpectations] = useState<ExpectationSticky[]>(INITIAL_EXPECTATIONS)
  const [activeActivity, setActiveActivity] = useState<Activity | null>(GENERATED_CONTENT.activities[0])
  const [studentXP, setStudentXP] = useState(120)
  const [lang, setLang] = useState<Language>('th')

  const addXP = useCallback((amount: number) => {
    setStudentXP((prev) => prev + amount)
  }, [])

  const t = useCallback(
    (key: keyof typeof TRANSLATIONS['th']): string => {
      return TRANSLATIONS[lang][key] || TRANSLATIONS['th'][key] || key
    },
    [lang]
  )

  /* ------------------------------------------------------------ actions -- */

  const addExpectation = useCallback((text: string, color?: ExpectationSticky['color']) => {
    const trimmed = text.trim()
    if (!trimmed) return
    const colors: ExpectationSticky['color'][] = ['yellow', 'pink', 'blue', 'green', 'purple']
    const chosenColor = color || colors[Math.floor(Math.random() * colors.length)]
    const newSticky: ExpectationSticky = {
      id: `exp-${Date.now()}`,
      authorName: `${demoStudent.name} (${demoStudent.nickname})`,
      faculty: demoStudent.faculty,
      color: chosenColor,
      text: trimmed,
      createdAt: 'เมื่อสักครู่',
    }
    setExpectations((prev) => [newSticky, ...prev])
  }, [])

  const resetDemo = useCallback(() => {
    clearGenTimer()
    clearSimTimers()
    setStudents(STUDENTS)
    setResponses(PRETEST_RESPONSES)
    setPosts(COMMUNITY_POSTS)
    setAssignments(INITIAL_ASSIGNMENTS)
    setCurrentSession(INITIAL_SESSION)
    setIsGenerating(false)
    setIsSimulating(false)
    setRemediationSent(false)
    // role is intentionally untouched: it is who is viewing, not demo data
  }, [clearGenTimer, clearSimTimers])

  const submitAssignment = useCallback((id: string, fileName?: string) => {
    setAssignments((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              submitted: true,
              submittedAt: 'เมื่อสักครู่',
              submissionFile: fileName || 'Hofstede_Case_Analysis.pdf',
            }
          : a
      )
    )
  }, [])

  /** Teacher pushes the personalised revision pack; student Home picks it up. */
  const sendRemediation = useCallback(() => setRemediationSent(true), [])

  const startGeneration = useCallback(() => {
    if (isGenerating) return
    setIsGenerating(true)
    genTimer.current = setTimeout(() => {
      genTimer.current = null
      setIsGenerating(false)
    }, 3000)
  }, [isGenerating])

  /**
   * Streams the pretest back in as if students were submitting live.
   *
   * Responses arrive per student (one student = their 5 answers), 200-600ms
   * apart — 24 joins ≈ 8-10s total, which is the only way to honour both the
   * "over 8 seconds" and "200-600ms between each" constraints (110 individual
   * responses at that spacing would take ~44s). The two students with no seed
   * responses (แอน, บิว) join mid-stream but never submit, so "joined" and
   * "submitted" counters diverge exactly like the seed data says they should.
   */
  const simulateStudents = useCallback(() => {
    clearSimTimers()
    setResponses([])
    setCurrentSession((s) => ({ ...s, joinedStudents: [] }))
    setIsSimulating(true)

    // Group seed responses by student, preserving seed order.
    const responderIds: string[] = []
    const byStudent = new Map<string, PretestResponse[]>()
    for (const r of PRETEST_RESPONSES) {
      const batch = byStudent.get(r.studentId)
      if (batch) {
        batch.push(r)
      } else {
        byStudent.set(r.studentId, [r])
        responderIds.push(r.studentId)
      }
    }

    const joinOrder = [...responderIds]
    const silent = STUDENTS.filter((s) => !byStudent.has(s.id)).map((s) => s.id)
    silent.forEach((id, i) => joinOrder.splice(5 + i * 9, 0, id)) // join at #6, #15

    let at = 0
    joinOrder.forEach((studentId, i) => {
      at += 200 + Math.random() * 400
      const timerId = setTimeout(() => {
        simTimers.current.delete(timerId)
        setCurrentSession((s) => ({ ...s, joinedStudents: [...s.joinedStudents, studentId] }))
        const batch = byStudent.get(studentId)
        if (batch) setResponses((prev) => [...prev, ...batch])
        if (i === joinOrder.length - 1) setIsSimulating(false)
      }, at)
      simTimers.current.add(timerId)
    })
  }, [clearSimTimers])

  const startSession = useCallback(() => {
    // keeps joinedStudents: students who joined the lobby stay joined
    setCurrentSession((s) => ({
      ...s,
      active: true,
      currentQuestionIndex: 0,
      revealedIndexes: [],
    }))
  }, [])

  const nextQuestion = useCallback(() => {
    setCurrentSession((s) => ({
      ...s,
      currentQuestionIndex: Math.min(s.currentQuestionIndex + 1, QUESTION_COUNT - 1),
    }))
  }, [])

  const prevQuestion = useCallback(() => {
    setCurrentSession((s) => ({
      ...s,
      currentQuestionIndex: Math.max(s.currentQuestionIndex - 1, 0),
    }))
  }, [])

  const revealAnswer = useCallback(() => {
    setCurrentSession((s) =>
      s.revealedIndexes.includes(s.currentQuestionIndex)
        ? s
        : { ...s, revealedIndexes: [...s.revealedIndexes, s.currentQuestionIndex] },
    )
  }, [])

  const endSession = useCallback(() => {
    setCurrentSession((s) => ({ ...s, active: false }))
    navigateRef.current?.('/teacher')
  }, [])

  const addPost = useCallback((body: string, isAnonymous: boolean, kind?: PostKind) => {
    const trimmed = body.trim()
    if (!trimmed) return
    postSeq.current += 1
    const post: CommunityPost = {
      id: `p-local-${postSeq.current}`,
      // named posts are attributed to the demo student (community is a student surface)
      studentId: isAnonymous ? null : demoStudent.id,
      isAnonymous,
      body: trimmed,
      kind: kind || 'คำถาม',
      reactions: { '👍': 0, '🤔': 0, '❤️': 0, '💡': 0 },
      createdAt: 'เมื่อสักครู่',
      replies: [],
      ...(isAnonymous
        ? {
            alias: `${ANON_ANIMALS[Math.floor(Math.random() * ANON_ANIMALS.length)]} #${
              Math.floor(Math.random() * 99) + 1
            }`,
          }
        : {}),
    }
    setPosts((prev) => [post, ...prev]) // seed is ordered newest-first
  }, [])

  const addReply = useCallback((postId: string, body: string, isAnonymous?: boolean) => {
    const trimmed = body.trim()
    if (!trimmed) return
    const reply: PostReply = {
      id: `r-local-${Date.now()}`,
      authorName: isAnonymous
        ? `${ANON_ANIMALS[Math.floor(Math.random() * ANON_ANIMALS.length)]} #${
            Math.floor(Math.random() * 99) + 1
          }`
        : role === 'teacher'
        ? TEACHER_NAME
        : `${demoStudent.name} (${demoStudent.nickname})`,
      authorRole: role,
      isAnonymous,
      body: trimmed,
      createdAt: 'เมื่อสักครู่',
    }
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, replies: [...(p.replies || []), reply] }
          : p
      )
    )
  }, [role])

  const pickRandomSpeaker = useCallback((): Student => {
    // Weight = (max spokeCount + 1) - spokeCount, so the quietest students are
    // the most likely to be picked but nobody is ever excluded.
    const maxSpoke = Math.max(...students.map((s) => s.spokeCount))
    const weights = students.map((s) => maxSpoke + 1 - s.spokeCount)
    const total = weights.reduce((a, b) => a + b, 0)

    let roll = Math.random() * total
    let picked = students[students.length - 1]
    for (let i = 0; i < students.length; i++) {
      roll -= weights[i]
      if (roll <= 0) {
        picked = students[i]
        break
      }
    }

    const updated: Student = { ...picked, spokeCount: picked.spokeCount + 1 }
    setStudents((prev) => prev.map((s) => (s.id === picked.id ? updated : s)))
    return updated
  }, [students])

  /* ------------------------------------------------------------ metrics -- */

  /** Students who have submitted at least one response. */
  const getSubmissionCount = useCallback(
    () => new Set(responses.map((r) => r.studentId)).size,
    [responses],
  )

  /** Overall percent correct across all responses, 0-100. */
  const getAverageScore = useCallback(() => {
    if (responses.length === 0) return 0
    const correct = responses.filter((r) => r.isCorrect).length
    return Math.round((correct / responses.length) * 100)
  }, [responses])

  /** Spread between best and worst faculty percent-correct, 0-100. */
  const getFacultyGap = useCallback(() => {
    const facultyOf = new Map(students.map((s) => [s.id, s.faculty]))
    const byFaculty = new Map<string, { correct: number; total: number }>()
    for (const r of responses) {
      const faculty = facultyOf.get(r.studentId)
      if (!faculty) continue
      const cell = byFaculty.get(faculty) ?? { correct: 0, total: 0 }
      cell.total += 1
      if (r.isCorrect) cell.correct += 1
      byFaculty.set(faculty, cell)
    }
    const percents = [...byFaculty.values()].map((c) => (c.correct / c.total) * 100)
    if (percents.length < 2) return 0
    return Math.round(Math.max(...percents) - Math.min(...percents))
  }, [responses, students])

  /** Percent of students who have spoken at least once, 0-100. */
  const getParticipationRate = useCallback(() => {
    if (students.length === 0) return 0
    const spoke = students.filter((s) => s.spokeCount > 0).length
    return Math.round((spoke / students.length) * 100)
  }, [students])

  /* -------------------------------------------------------------- value -- */

  const value: AppState = {
    role,
    setRole,
    displayName: role === 'teacher' ? TEACHER_NAME : demoStudent.nickname,
    teacherName: TEACHER_NAME,
    currentStudent: demoStudent,

    course: COURSE,
    topics: TOPICS,
    generatedContent: GENERATED_CONTENT,
    gapAnalysis: GAP_ANALYSIS,
    remediation: REMEDIATION,

    students,
    responses,
    posts,
    currentSession,
    isGenerating,
    isSimulating,

    assignments,
    submitAssignment,

    remediationSent,
    sendRemediation,

    expectations,
    addExpectation,
    activeActivity,
    setActiveActivity,

    studentXP,
    addXP,

    lang,
    setLang,
    t,

    resetDemo,
    startGeneration,
    simulateStudents,
    startSession,
    nextQuestion,
    prevQuestion,
    revealAnswer,
    endSession,
    addPost,
    addReply,
    pickRandomSpeaker,

    getSubmissionCount,
    getAverageScore,
    getFacultyGap,
    getParticipationRate,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within an AppProvider')
  return ctx
}
