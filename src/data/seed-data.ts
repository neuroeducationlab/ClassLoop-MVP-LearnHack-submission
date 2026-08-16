/**
 * Demo data for Enjoyable Class.
 *
 * Everything here is a deterministic constant — no Math.random() at module load.
 * The spec calls several fields "random", but the app re-reads this file on every
 * reload and GAP_ANALYSIS is pre-computed against it, so the values are drawn once
 * (by hand / from fixed pools) and then frozen. Re-rolling them at runtime would
 * make the analytics disagree with the responses they summarise.
 */

/* ------------------------------------------------------------------ types -- */

export type Course = {
  id: string
  name: string
  code: string
  university: string
}

export type Student = {
  id: string
  name: string
  nickname: string
  faculty: string
  year: number
  avatarSeed: number
  spokeCount: number
}

export type Topic = {
  id: string
  courseId: string
  week: number
  title: string
  learningObjective: string
}

export type ActivityFormat = 'debate' | 'case-based' | 'quick-game'

export type Activity = {
  name: string
  format: ActivityFormat
  durationMin: number
  steps: string[]
  whyItWorks: string
  materialsNeeded: string
}

export type Flashcard = {
  front: string
  back: string
  hint: string
}

export type Difficulty = 'easy' | 'medium' | 'hard'

export type PretestQuestion = {
  id: string
  stem: string
  options: string[]
  answerIndex: number
  difficulty: Difficulty
  misconception: string
}

export type GeneratedContent = {
  activities: Activity[]
  flashcards: Flashcard[]
  pretest: PretestQuestion[]
  mixedClassTip: string
}

export type PretestResponse = {
  id: string
  questionId: string
  studentId: string
  choiceIndex: number
  isCorrect: boolean
  msTaken: number
}

export type FacultyScore = {
  faculty: string
  percent: number
}

export type GapAnalysis = {
  byFaculty: FacultyScore[]
  maxGap: number
  highFaculty: string
  lowFaculty: string
}

export type PairingActivity = {
  name: string
  durationMin: number
  instructions: string
}

export type ResourceType = 'video' | 'interactive' | 'article'

export type Resource = {
  title: string
  type: ResourceType
  url: string
}

export type Remediation = {
  pairingActivity: PairingActivity
  resources: Resource[]
}

export type PostKind = 'คำถาม' | 'ฟีดแบค' | 'ไอเดีย'

export type Reactions = {
  '👍': number
  '🤔': number
  '❤️': number
  '💡': number
}

export type PostReply = {
  id: string
  authorName: string
  authorRole: 'teacher' | 'student'
  isAnonymous?: boolean
  body: string
  createdAt: string
}

export type ExpectationSticky = {
  id: string
  authorName: string
  faculty: string
  color: 'yellow' | 'pink' | 'blue' | 'green' | 'purple'
  text: string
  createdAt: string
}

export type Assignment = {
  id: string
  title: string
  topic: string
  dueDate: string
  description: string
  submitted: boolean
  submittedAt?: string
  submissionFile?: string
}

export type CommunityPost = {
  id: string
  studentId: string | null
  isAnonymous: boolean
  alias?: string
  body: string
  kind: PostKind
  reactions: Reactions
  createdAt: string
  replies?: PostReply[]
}

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asg-1',
    title: 'ภารกิจสั่งงาน: Hofstede Country Case Analysis',
    topic: 'Hofstede\'s Cultural Dimensions',
    dueDate: 'ศุกร์นี้ 23:59 น.',
    description: 'เลือก 1 ประเทศในอาเซียน วิเคราะห์ 6 มิติของ Hofstede พร้อมเปรียบเทียบกับประเทศไทย ความยาว 1-2 หน้า',
    submitted: false,
  },
  {
    id: 'asg-2',
    title: 'ภารกิจทบทวน: Pre-test & Post-test Hofstede',
    topic: 'สัปดาห์ที่ 2: Hofstede',
    dueDate: 'ทำเสร็จในคาบเรียน',
    description: 'ทำ Pre-test ก่อนเรียน และ Post-test หลังเรียนจบคาบเพื่อประเมินความเข้าใจ',
    submitted: true,
    submittedAt: 'เมื่อสักครู่',
  },
]

export const INITIAL_EXPECTATIONS: ExpectationSticky[] = [
  {
    id: 'exp-1',
    authorName: 'ณัฐ (นัท)',
    faculty: 'Digital Media',
    color: 'yellow',
    text: 'อยากเรียนแบบมี Case Study ธุรกิจจริงเยอะๆ และเห็นตัวอย่างโฆษณาข้ามวัฒนธรรมครับ',
    createdAt: 'เมื่อสักครู่',
  },
  {
    id: 'exp-2',
    authorName: 'วรรณา (นุ้ย)',
    faculty: 'Accounting',
    color: 'pink',
    text: 'ขอให้เน้นการคิดวิเคราะห์วิพากษ์ ไม่เน้นท่องจำทฤษฎีนะคะอาจารย์',
    createdAt: '1 ชม. ที่แล้ว',
  },
  {
    id: 'exp-3',
    authorName: 'ธีรวัฒน์ (ต้น)',
    faculty: 'Engineering',
    color: 'blue',
    text: 'อยากได้เทคนิคการเจรจาต่อรองกับคนต่างชาติ และแนวคิดการทำงานกับทีมข้ามวัฒนธรรม',
    createdAt: '2 ชม. ที่แล้ว',
  },
  {
    id: 'exp-4',
    authorName: 'พรรณี (พลอย)',
    faculty: 'Business Admin',
    color: 'green',
    text: 'ชอบกิจกรรม Debate ข้ามคณะมากค่ะ อยากให้จับกลุ่มคละคณะทำกิจกรรมบ่อยๆ',
    createdAt: '3 ชม. ที่แล้ว',
  },
]

/* ----------------------------------------------------------------- course -- */

export const COURSE: Course = {
  id: 'pibm-01',
  name: 'Principles of International Business Management',
  code: 'IBM3301',
  university: 'Sripatum University',
}

/* --------------------------------------------------------------- students -- */

export const STUDENTS: Student[] = [
  // Accounting (6)
  { id: 's-somchai', name: 'สมชาย', nickname: 'ชาย', faculty: 'Accounting', year: 3, avatarSeed: 12, spokeCount: 2 },
  { id: 's-piya', name: 'ปิยะ', nickname: 'เอก', faculty: 'Accounting', year: 2, avatarSeed: 47, spokeCount: 1 },
  { id: 's-wanna', name: 'วรรณา', nickname: 'นุ้ย', faculty: 'Accounting', year: 3, avatarSeed: 83, spokeCount: 3 },
  { id: 's-supaporn', name: 'สุภาพร', nickname: 'แอน', faculty: 'Accounting', year: 4, avatarSeed: 29, spokeCount: 0 },
  { id: 's-thana', name: 'ธนา', nickname: 'เก่ง', faculty: 'Accounting', year: 2, avatarSeed: 61, spokeCount: 2 },
  { id: 's-arun', name: 'อรุณ', nickname: 'รุ่ง', faculty: 'Accounting', year: 3, avatarSeed: 95, spokeCount: 1 },

  // Communication Arts (5)
  { id: 's-kitti', name: 'กิตติ', nickname: 'กิ๊ก', faculty: 'Communication Arts', year: 2, avatarSeed: 8, spokeCount: 3 },
  { id: 's-paweena', name: 'ปวีณา', nickname: 'ปอ', faculty: 'Communication Arts', year: 3, avatarSeed: 54, spokeCount: 1 },
  { id: 's-chanida', name: 'ชนิดา', nickname: 'ไอซ์', faculty: 'Communication Arts', year: 4, avatarSeed: 72, spokeCount: 2 },
  { id: 's-phanu', name: 'ภาณุ', nickname: 'บอส', faculty: 'Communication Arts', year: 2, avatarSeed: 33, spokeCount: 0 },
  { id: 's-siri', name: 'สิริ', nickname: 'มิ้ม', faculty: 'Communication Arts', year: 3, avatarSeed: 90, spokeCount: 2 },

  // Engineering (4)
  { id: 's-teerawat', name: 'ธีรวัฒน์', nickname: 'ต้น', faculty: 'Engineering', year: 4, avatarSeed: 17, spokeCount: 3 },
  { id: 's-napa', name: 'นภา', nickname: 'แนน', faculty: 'Engineering', year: 3, avatarSeed: 66, spokeCount: 1 },
  { id: 's-wichai', name: 'วิชัย', nickname: 'เจ', faculty: 'Engineering', year: 2, avatarSeed: 41, spokeCount: 0 },
  { id: 's-anucha', name: 'อนุชา', nickname: 'บิว', faculty: 'Engineering', year: 3, avatarSeed: 78, spokeCount: 1 },

  // Business Admin (5)
  { id: 's-pannee', name: 'พรรณี', nickname: 'พลอย', faculty: 'Business Admin', year: 2, avatarSeed: 25, spokeCount: 2 },
  { id: 's-sak', name: 'ศักดิ์', nickname: 'ดุ๊ก', faculty: 'Business Admin', year: 3, avatarSeed: 58, spokeCount: 1 },
  { id: 's-rattana', name: 'รัตนา', nickname: 'เบล', faculty: 'Business Admin', year: 4, avatarSeed: 86, spokeCount: 3 },
  { id: 's-thanawat', name: 'ธนวัฒน์', nickname: 'ไมค์', faculty: 'Business Admin', year: 2, avatarSeed: 39, spokeCount: 0 },
  { id: 's-jirapa', name: 'จิราภา', nickname: 'จูน', faculty: 'Business Admin', year: 3, avatarSeed: 70, spokeCount: 2 },

  // Digital Media (4)
  { id: 's-nat', name: 'ณัฐ', nickname: 'นัท', faculty: 'Digital Media', year: 3, avatarSeed: 5, spokeCount: 3 },
  { id: 's-suwimon', name: 'สุวิมล', nickname: 'หมิว', faculty: 'Digital Media', year: 2, avatarSeed: 51, spokeCount: 1 },
  { id: 's-poom', name: 'ภูมิ', nickname: 'ภู', faculty: 'Digital Media', year: 4, avatarSeed: 97, spokeCount: 2 },
  { id: 's-kanya', name: 'กัญญา', nickname: 'เค', faculty: 'Digital Media', year: 3, avatarSeed: 44, spokeCount: 1 },
]

/* ----------------------------------------------------------------- topics -- */

export const TOPICS: Topic[] = [
  {
    id: 't1',
    courseId: 'pibm-01',
    week: 1,
    title: 'Globalisation Drivers',
    learningObjective: 'อธิบายแรงขับเคลื่อนของโลกาภิวัตน์ และวิเคราะห์ผลกระทบต่อธุรกิจไทยได้',
  },
  {
    id: 't2',
    courseId: 'pibm-01',
    week: 2,
    title: "Hofstede's Cultural Dimensions",
    learningObjective: 'วิเคราะห์ความแตกต่างทางวัฒนธรรมด้วย 6 มิติของ Hofstede และนำไปใช้กับกรณีธุรกิจข้ามชาติได้',
  },
  {
    id: 't3',
    courseId: 'pibm-01',
    week: 3,
    title: 'Entry Modes',
    learningObjective: 'เปรียบเทียบรูปแบบการเข้าสู่ตลาดต่างประเทศ และเลือกรูปแบบที่เหมาะกับสถานการณ์ได้',
  },
  {
    id: 't4',
    courseId: 'pibm-01',
    week: 4,
    title: 'Global Supply Chain',
    learningObjective: 'อธิบายโครงสร้างห่วงโซ่อุปทานระดับโลก และระบุความเสี่ยงในแต่ละจุดเชื่อมต่อได้',
  },
  {
    id: 't5',
    courseId: 'pibm-01',
    week: 5,
    title: 'International HRM',
    learningObjective: 'ออกแบบแนวทางบริหารทรัพยากรบุคคลข้ามวัฒนธรรม รวมถึงการคัดเลือกและเตรียมผู้บริหารต่างแดนได้',
  },
  {
    id: 't6',
    courseId: 'pibm-01',
    week: 6,
    title: 'Ethics & CSR',
    learningObjective: 'ประเมินประเด็นจริยธรรมและความรับผิดชอบต่อสังคมของบรรษัทข้ามชาติได้อย่างมีเหตุผล',
  },
]

/* ------------------------------------------------------ generated content -- */

/** Pre-made AI output for TOPICS[1] — "Hofstede's Cultural Dimensions" (t2). */
export const GENERATED_CONTENT: GeneratedContent = {
  activities: [
    {
      name: 'Cultural Clash Debate',
      format: 'debate',
      durationMin: 25,
      steps: [
        'แบ่งกลุ่ม 4 ทีม ตามคณะผสม',
        'แจกสถานการณ์: บริษัทญี่ปุ่นเจรจากับบริษัทบราซิล',
        "แต่ละทีมวิเคราะห์ด้วย Hofstede's 6 dimensions",
        'Debate รอบละ 3 นาที',
      ],
      whyItWorks: 'ใช้ความแตกต่างของคณะเป็น asset — นักศึกษาบัญชีมองตัวเลข นิเทศมองการสื่อสาร',
      materialsNeeded: 'สถานการณ์จำลอง 4 ชุด (อยู่ในระบบ)',
    },
    {
      name: 'Dimension Mapping Challenge',
      format: 'case-based',
      durationMin: 20,
      steps: [
        'แจก case study: Grab ขยายจากมาเลเซียสู่เวียดนาม',
        'กลุ่มละ 3-4 คน map 6 dimensions ลง canvas',
        'เปรียบเทียบผลกับ Hofstede Insights country comparison tool',
        'แต่ละกลุ่มนำเสนอ 2 นาที',
      ],
      whyItWorks: 'Case จริงในอาเซียน ใกล้ตัว relate ได้',
      materialsNeeded: 'Hofstede country comparison (เปิดเว็บ)',
    },
    {
      name: 'Speed Culture Quiz',
      format: 'quick-game',
      durationMin: 10,
      steps: [
        '10 คำถาม แต่ละข้อ 30 วินาที',
        'ตอบผ่านมือถือ เห็นผลทันที',
        '3 อันดับแรกได้คะแนนพิเศษ',
      ],
      whyItWorks: 'เปิดคาบด้วย energy — ใช้เป็น pre-test ได้ในตัว',
      materialsNeeded: 'ใช้ ClassLoop quiz (สร้างให้แล้ว)',
    },
  ],

  flashcards: [
    {
      front: 'Power Distance Index (PDI)',
      back: 'ระดับที่สมาชิกในสังคมยอมรับว่าอำนาจกระจายไม่เท่ากัน',
      hint: 'ไทย PDI สูง = เคารพผู้ใหญ่',
    },
    {
      front: 'Individualism vs Collectivism',
      back: 'สังคมให้ความสำคัญกับปัจเจก vs กลุ่ม',
      hint: 'อเมริกา = ปัจเจกสูง / ญี่ปุ่น = กลุ่มสูง',
    },
    {
      front: 'Masculinity vs Femininity',
      back: 'สังคมให้คุณค่ากับความสำเร็จ/แข่งขัน vs คุณภาพชีวิต/ความร่วมมือ',
      hint: 'สวีเดน = Feminine สูง',
    },
    {
      front: 'Uncertainty Avoidance (UAI)',
      back: 'ระดับที่สังคมรู้สึกไม่สบายใจกับความไม่แน่นอน',
      hint: 'ญี่ปุ่น UAI สูง = กฎเยอะ',
    },
    {
      front: 'Long-term vs Short-term Orientation',
      back: 'มุ่งเน้นอนาคตและความอดทน vs ยึดประเพณีและผลระยะสั้น',
      hint: 'จีน = Long-term สูง',
    },
    {
      front: 'Indulgence vs Restraint',
      back: 'สังคมอนุญาตให้เพลิดเพลินกับชีวิต vs ควบคุมด้วยบรรทัดฐาน',
      hint: 'เม็กซิโก = Indulgence สูง',
    },
    {
      front: 'Cross-cultural Negotiation',
      back: 'การเจรจาระหว่างคนจากวัฒนธรรมที่มี dimension ต่างกัน ต้องปรับสไตล์',
      hint: 'High PDI culture → เน้น seniority ในทีมเจรจา',
    },
    {
      front: "Hofstede's Research Method",
      back: 'ใช้แบบสอบถาม IBM employees ใน 70+ ประเทศ ระหว่างปี 1967-1973',
      hint: 'ข้อวิจารณ์: ข้อมูลจากบริษัทเดียว',
    },
  ],

  pretest: [
    {
      id: 'q1',
      stem: 'ประเทศที่มี Power Distance Index สูง พนักงานมักจะ...',
      options: [
        'ตั้งคำถามกับหัวหน้าอย่างเปิดเผย',
        'ทำตามคำสั่งโดยไม่ถาม',
        'เสนอไอเดียในที่ประชุมบ่อย',
        'เรียกหัวหน้าด้วยชื่อจริง',
      ],
      answerIndex: 1,
      difficulty: 'easy',
      misconception: 'PDI สูง = acceptance ของความไม่เท่ากัน ไม่ใช่ coercion',
    },
    {
      id: 'q2',
      stem: "Hofstede's Uncertainty Avoidance วัดอะไร",
      options: [
        'ความกลัวเรื่องการเงิน',
        'ความไม่สบายใจกับสถานการณ์ที่คาดเดาไม่ได้',
        'ระดับการเสี่ยงในการลงทุน',
        'ความไม่ไว้วางใจคนแปลกหน้า',
      ],
      answerIndex: 1,
      difficulty: 'easy',
      misconception: 'UAI ไม่เกี่ยวกับ risk-taking ทางการเงิน แต่เกี่ยวกับ tolerance for ambiguity',
    },
    {
      id: 'q3',
      stem: 'บริษัทญี่ปุ่นส่งผู้บริหารมาเจรจากับบริษัทอเมริกัน ความขัดแย้งที่น่าจะเกิดจาก dimension ใด',
      options: [
        'Individualism vs Collectivism',
        'Indulgence vs Restraint',
        'Long-term vs Short-term only',
        'Masculinity เท่านั้น',
      ],
      answerIndex: 0,
      difficulty: 'medium',
      misconception: 'ญี่ปุ่น collectivist ต้อง consensus / อเมริกา individualist ตัดสินใจเร็ว',
    },
    {
      id: 'q4',
      stem: 'ถ้าคุณต้องออกแบบโฆษณาให้ตลาดสวีเดน ควรเน้นเรื่องใดตาม Hofstede',
      options: [
        'ความสำเร็จส่วนตัวและการแข่งขัน',
        'ครอบครัว สมดุลชีวิต และความร่วมมือ',
        'กฎระเบียบและความมั่นคง',
        'ความเคารพผู้อาวุโส',
      ],
      answerIndex: 1,
      difficulty: 'medium',
      misconception: 'สวีเดน = Feminine culture → คุณค่าคือ quality of life',
    },
    {
      id: 'q5',
      stem: "ข้อวิจารณ์ที่สำคัญที่สุดของ Hofstede's framework คืออะไร",
      options: [
        'ใช้ข้อมูลเก่าจากองค์กรเดียว (IBM) ในยุค 1970s',
        'ไม่มีการแปลเป็นภาษาอื่น',
        'ศึกษาแค่ 5 ประเทศ',
        'ไม่ได้รับการยอมรับในวงวิชาการ',
      ],
      answerIndex: 0,
      difficulty: 'hard',
      misconception: 'Hofstede ยังถูกอ้างอิงกว้าง แต่ข้อจำกัดคือ methodology',
    },
  ],

  mixedClassTip:
    'คณะบัญชีมักมองผ่าน lens ของตัวเลขและ compliance คณะนิเทศมอง storytelling — ใช้ Jigsaw technique จับคู่ข้ามคณะ ให้แต่ละฝั่งอธิบาย Hofstede ด้วยภาษาของตัวเอง',
}

/* ------------------------------------------------------ pretest responses -- */

/**
 * Which of q1..q5 each student got right.
 *
 * s-supaporn (สุภาพร/แอน) and s-anucha (อนุชา/บิว) are deliberately absent —
 * they are the two students with no pretest response at all.
 *
 * Correct-answer counts are tuned to the faculty accuracy bands in the brief:
 *   Accounting        21/25 = 84%   (~80%)
 *   Business Admin    20/25 = 80%   (~80%)
 *   Engineering        9/15 = 60%   (~60%)
 *   Digital Media      9/20 = 45%   (~40%)
 *   Communication Arts 10/25 = 40%  (~40%)
 * Within each student the easy questions (q1, q2) skew correct and the hard one
 * (q5) skews wrong, so per-question difficulty still reads sensibly.
 */
const RESPONSE_MATRIX: Record<string, [boolean, boolean, boolean, boolean, boolean]> = {
  // Accounting — 21/25
  's-somchai': [true, true, true, true, false],
  's-piya': [true, true, true, true, true],
  's-wanna': [true, true, true, false, false],
  's-thana': [true, true, true, true, true],
  's-arun': [true, true, true, true, false],

  // Communication Arts — 10/25
  's-kitti': [true, true, false, false, false],
  's-paweena': [true, false, false, true, false],
  's-chanida': [true, true, false, false, false],
  's-phanu': [false, true, true, false, false],
  's-siri': [true, false, false, true, false],

  // Engineering — 9/15
  's-teerawat': [true, true, true, false, false],
  's-napa': [true, true, false, true, false],
  's-wichai': [true, false, true, true, false],

  // Business Admin — 20/25
  's-pannee': [true, true, true, true, false],
  's-sak': [true, true, true, false, true],
  's-rattana': [true, true, true, true, false],
  's-thanawat': [true, true, false, true, true],
  's-jirapa': [true, true, true, true, false],

  // Digital Media — 9/20
  's-nat': [true, true, false, false, false],
  's-suwimon': [true, false, true, false, false],
  's-poom': [true, true, false, true, false],
  's-kanya': [false, true, true, false, false],
}

/** Distractor pools per question, cycled so wrong answers spread across options. */
const WRONG_CHOICES: Record<string, number[]> = {
  q1: [0, 2, 3],
  q2: [3, 0, 2],
  q3: [2, 1, 3],
  q4: [0, 3, 2],
  q5: [1, 3, 2],
}

/** 37 fixed durations in the 3000-25000ms band; 37 is coprime with 5 and 110. */
const MS_POOL = [
  8420, 15310, 4780, 22140, 11060, 6350, 18920, 9740, 13580, 5210, 24310, 7860,
  16470, 10230, 3940, 20580, 12690, 6720, 19340, 8150, 14760, 4310, 23070, 11480,
  17290, 5680, 21630, 9050, 15920, 7410, 12340, 3620, 18150, 10870, 24890, 6180,
  13950,
]

function buildPretestResponses(): PretestResponse[] {
  const responses: PretestResponse[] = []
  let n = 0

  for (const student of STUDENTS) {
    const marks = RESPONSE_MATRIX[student.id]
    if (!marks) continue

    GENERATED_CONTENT.pretest.forEach((question, index) => {
      const isCorrect = marks[index]
      const wrongPool = WRONG_CHOICES[question.id]

      responses.push({
        id: `r-${student.id}-${question.id}`,
        questionId: question.id,
        studentId: student.id,
        choiceIndex: isCorrect ? question.answerIndex : wrongPool[n % wrongPool.length],
        isCorrect,
        msTaken: MS_POOL[n % MS_POOL.length],
      })

      n += 1
    })
  }

  return responses
}

/** 22 responding students x 5 questions = 110 responses. */
export const PRETEST_RESPONSES: PretestResponse[] = buildPretestResponses()

/* --------------------------------------------------------- gap  analysis -- */

/**
 * Figures as specified in the brief. They are the headline numbers the UI shows;
 * the response matrix above reproduces the same ranking and bands but, at these
 * student counts, cannot land on every percentage exactly (actual: Accounting 84,
 * Business Admin 80, Engineering 60, Digital Media 45, Communication Arts 40).
 */
export const GAP_ANALYSIS: GapAnalysis = {
  byFaculty: [
    { faculty: 'Accounting', percent: 82 },
    { faculty: 'Business Admin', percent: 78 },
    { faculty: 'Engineering', percent: 60 },
    { faculty: 'Digital Media', percent: 45 },
    { faculty: 'Communication Arts', percent: 41 },
  ],
  maxGap: 41,
  highFaculty: 'Accounting',
  lowFaculty: 'Communication Arts',
}

/* ----------------------------------------------------------- remediation -- */

export const REMEDIATION: Remediation = {
  pairingActivity: {
    name: 'Jigsaw ข้ามคณะ: บัญชี × นิเทศ',
    durationMin: 15,
    instructions:
      'จับคู่ 1:1 — นักศึกษาบัญชีอธิบาย PDI/UAI ด้วยตัวเลข นักศึกษานิเทศอธิบายด้วย storytelling จริง แล้วสลับสอนกัน',
  },
  resources: [
    {
      title: "Hofstede's 6 Dimensions Explained",
      type: 'video',
      url: 'https://www.youtube.com/results?search_query=hofstede+6+dimensions+explained',
    },
    {
      title: 'Country Comparison Tool',
      type: 'interactive',
      url: 'https://www.youtube.com/results?search_query=hofstede+country+comparison+tool',
    },
    {
      title: 'Cross-Cultural Management Case: IKEA',
      type: 'article',
      url: 'https://www.youtube.com/results?search_query=ikea+cross+cultural+management+case+study',
    },
  ],
}

/* --------------------------------------------------------- weekly scores -- */

export type WeeklyScore = {
  week: number
  topicId: string
  /** Post-test percent-correct per faculty for that week's topic. */
  byFaculty: Record<string, number>
  /** Class averages: before and after the คาบ. */
  classPre: number
  classPost: number
}

/**
 * Historical post-test results for weeks already taught (1, 3, 4).
 * Week 2 (Hofstede) is intentionally absent — its numbers come LIVE from
 * PRETEST_RESPONSES state, and its post-test happens next คาบ after
 * remediation. Weeks 5-6 have not been taught yet.
 *
 * Each faculty gets a topic it shines at, so "คณะไหนทำอะไรได้ดี" has a real
 * answer: นิเทศ → Globalisation (storytelling), บริหาร → Entry Modes
 * (strategy), บัญชี + วิศวะ → Supply Chain (numbers & systems).
 */
export const WEEKLY_SCORES: WeeklyScore[] = [
  {
    week: 1,
    topicId: 't1',
    byFaculty: {
      Accounting: 84,
      'Business Admin': 80,
      Engineering: 76,
      'Digital Media': 78,
      'Communication Arts': 81,
    },
    classPre: 61,
    classPost: 80,
  },
  {
    week: 3,
    topicId: 't3',
    byFaculty: {
      Accounting: 86,
      'Business Admin': 88,
      Engineering: 74,
      'Digital Media': 70,
      'Communication Arts': 62,
    },
    classPre: 60,
    classPost: 77,
  },
  {
    week: 4,
    topicId: 't4',
    byFaculty: {
      Accounting: 90,
      'Business Admin': 82,
      Engineering: 88,
      'Digital Media': 66,
      'Communication Arts': 58,
    },
    classPre: 63,
    classPost: 77,
  },
]

/* ------------------------------------------------------- community posts -- */

export const COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'p0',
    studentId: null,
    isAnonymous: false,
    alias: 'อ.ดร.ธนพร (ผู้สอน)',
    body: 'อาจารย์ขอ ฟีดแบคการเรียน คาบ Hofstede\'s Cultural Dimensions สัปดาห์นี้หน่อยครับ ชอบกิจกรรมไหน หรืออยากให้ปรับตรงไหนบ้าง?',
    kind: 'ฟีดแบค',
    reactions: { '👍': 12, '🤔': 1, '❤️': 6, '💡': 4 },
    createdAt: '1 ชม. ที่แล้ว',
    replies: [
      {
        id: 'r1',
        authorName: 'แมวน้ำ #9',
        authorRole: 'student',
        isAnonymous: true,
        body: 'ชอบกิจกรรม Cultural Clash Debate มากครับ ได้ลองคิดมุมมองฝั่งบัญชีกับนิเทศต่างกันดี',
        createdAt: '45 นาที ที่แล้ว',
      },
      {
        id: 'r2',
        authorName: 'อ.ดร.ธนพร (ผู้สอน)',
        authorRole: 'teacher',
        isAnonymous: false,
        body: 'ขอบคุณครับสัปดาห์หน้าจะจัดกิจกรรม Case Study เพิ่มให้อีกครับ!',
        createdAt: '30 นาที ที่แล้ว',
      },
      {
        id: 'r3',
        authorName: 'ณัฐ (นัท)',
        authorRole: 'student',
        isAnonymous: false,
        body: 'อยากให้เพิ่มเวลาช่วงอภิปรายอีกนิดครับ 25 นาทีผ่านไปไวมาก!',
        createdAt: '15 นาที ที่แล้ว',
      },
    ],
  },
  {
    id: 'p1',
    studentId: null,
    isAnonymous: true,
    alias: 'หมีขั้วโลก #4',
    body: 'Hofstede ยังใช้ได้จริงไหมครับ ข้อมูลเก่ามากแล้ว',
    kind: 'คำถาม',
    reactions: { '👍': 5, '🤔': 3, '❤️': 0, '💡': 2 },
    createdAt: '2 ชม. ที่แล้ว',
    replies: [
      {
        id: 'r4',
        authorName: 'อ.ดร.ธนพร (ผู้สอน)',
        authorRole: 'teacher',
        isAnonymous: false,
        body: 'เป็นคำถามที่ดีมากครับ! ข้อมูลต้นฉบับมาจากยุค 1970s แต่โครงสร้างยังใช้อ้างอิงพื้นฐานได้ดี คาบหน้าครูจะเสริม GLOBE framework ให้ครับ',
        createdAt: '1 ชม. ที่แล้ว',
      },
    ],
  },
  {
    id: 'p2',
    studentId: 's-nat',
    isAnonymous: false,
    body: 'มีใครมี case study เรื่อง Netflix ข้ามวัฒนธรรมไหมครับ',
    kind: 'คำถาม',
    reactions: { '👍': 3, '🤔': 1, '❤️': 0, '💡': 4 },
    createdAt: '3 ชม. ที่แล้ว',
  },
  {
    id: 'p3',
    studentId: null,
    isAnonymous: true,
    alias: 'เพนกวิน #7',
    body: 'คาบที่แล้วสนุกมาก อยากให้มี debate อีก',
    kind: 'ฟีดแบค',
    reactions: { '👍': 8, '🤔': 0, '❤️': 4, '💡': 1 },
    createdAt: '5 ชม. ที่แล้ว',
  },
  {
    id: 'p4',
    studentId: 's-wanna',
    isAnonymous: false,
    body: 'ช่วยอธิบาย Masculinity vs Femininity อีกทีได้ไหมคะ งงอยู่',
    kind: 'คำถาม',
    reactions: { '👍': 6, '🤔': 2, '❤️': 1, '💡': 0 },
    createdAt: 'เมื่อวาน',
  },
  {
    id: 'p5',
    studentId: 's-teerawat',
    isAnonymous: false,
    body: 'Power Distance ในบริษัท startup กับ corporate ต่างกันไหม',
    kind: 'คำถาม',
    reactions: { '👍': 4, '🤔': 5, '❤️': 0, '💡': 3 },
    createdAt: 'เมื่อวาน',
  },
  {
    id: 'p6',
    studentId: null,
    isAnonymous: true,
    alias: 'แมวน้ำ #2',
    body: 'ข้อสอบกลางภาคออกถึงบทไหนครับ',
    kind: 'คำถาม',
    reactions: { '👍': 12, '🤔': 0, '❤️': 0, '💡': 0 },
    createdAt: 'เมื่อวาน',
  },
  {
    id: 'p7',
    studentId: 's-jirapa',
    isAnonymous: false,
    body: 'อาจารย์มี recommended reading เพิ่มไหมคะ',
    kind: 'คำถาม',
    reactions: { '👍': 3, '🤔': 0, '❤️': 2, '💡': 1 },
    createdAt: '2 วัน ที่แล้ว',
  },
  {
    id: 'p8',
    studentId: 's-poom',
    isAnonymous: false,
    body: 'ลองเปรียบเทียบ Hofstede กับ GLOBE framework ดูก็น่าสนใจ',
    kind: 'ไอเดีย',
    reactions: { '👍': 7, '🤔': 2, '❤️': 1, '💡': 6 },
    createdAt: '2 วัน ที่แล้ว',
  },
]

/* ----------------------------------------------------------- assignments -- */

export type CourseAssignment = {
  id: string
  code: string
  title: string
  fullScore: number
  dueDate: string
  category: 'quiz' | 'homework' | 'project'
}

export const ASSIGNMENTS: CourseAssignment[] = [
  {
    id: 'a1',
    code: 'HW-1',
    title: 'Pre-test สัปดาห์ที่ 1 (Globalisation)',
    fullScore: 10,
    dueDate: '05 ส.ค.',
    category: 'quiz',
  },
  {
    id: 'a2',
    code: 'HW-2',
    title: '3D Flashcards & Case Study (Hofstede)',
    fullScore: 20,
    dueDate: '12 ส.ค.',
    category: 'homework',
  },
  {
    id: 'a3',
    code: 'HW-3',
    title: 'Post-test Hofstede (วัดผลหลังเรียน)',
    fullScore: 20,
    dueDate: '15 ส.ค.',
    category: 'quiz',
  },
  {
    id: 'a4',
    code: 'HW-4',
    title: 'รายงานกลุ่ม ธุรกิจข้ามชาติ (Entry Modes)',
    fullScore: 50,
    dueDate: '18 ส.ค.',
    category: 'project',
  },
]

export function getStudentAssignments(_studentId: string, avatarSeed: number) {
  const missingHwIds: string[] = []
  if (avatarSeed % 5 === 1) missingHwIds.push('a4')
  if (avatarSeed % 5 === 3) missingHwIds.push('a3', 'a4')
  if (avatarSeed % 5 === 0 && avatarSeed > 10) missingHwIds.push('a2')

  const missingList = ASSIGNMENTS.filter((a) => missingHwIds.includes(a.id))
  const missingPoints = missingList.reduce((sum, a) => sum + a.fullScore, 0)
  const totalScore = 100 - missingPoints

  return {
    missingHwIds,
    missingList,
    missingCount: missingHwIds.length,
    missingPoints,
    totalScore,
    isComplete: missingHwIds.length === 0,
  }
}

