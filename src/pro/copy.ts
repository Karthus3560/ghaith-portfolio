import { chapters as baseChapters, projects as baseProjects, type Chapter, type L, type Project } from '../data/content'

const l = (en: string, ar: string): L => ({ en, ar })

/** Professional edition: same facts as the tree edition, without the tree metaphor. */
const chapterOverrides: Record<string, Partial<Chapter>> = {
  nursing: {
    title: l('Clinical practice', 'الممارسة السريرية'),
    blurb: l(
      'The clinical work came first and has not stopped: night shifts on the pediatric ward continue alongside the systems work.',
      'العمل السريري جاء أولاً ولم يتوقف: الوجبات الليلية في ردهة الأطفال مستمرة إلى جانب العمل على الأنظمة.',
    ),
  },
  lab: {
    title: l('Independent projects', 'مشاريع مستقلة'),
    blurb: l(
      'Side projects built outside working hours: desktop utilities, an AI task board and a local-network sharing app.',
      'مشاريع جانبية بُنيت خارج أوقات العمل: أدوات لسطح المكتب، لوحة مهام بالذكاء الاصطناعي وتطبيق مشاركة عبر الشبكة المحلية.',
    ),
  },
}

export const chapters: Chapter[] = baseChapters.map((c) => ({ ...c, ...chapterOverrides[c.id] }))

export const projects: Project[] = baseProjects.map((p) =>
  p.id === 'peds'
    ? {
        ...p,
        built: [
          p.built[0],
          p.built[1],
          l('Still on night shifts today, alongside the systems work.', 'ما زال في الوجبات الليلية حتى اليوم إلى جانب العمل على الأنظمة.'),
        ],
      }
    : p,
)

/** CV order: most recent role first. */
export const experienceOrder = ['azu', 'hr', 'academy', 'aha', 'dhmc', 'nursing', 'lab']
/** Layer order of the systems map, foundation first. */
export const layerOrder = ['nursing', 'dhmc', 'hr', 'academy', 'aha', 'azu', 'lab']

export const featured = ['massdata', 'sheets', 'recruitment', 'platform', 'directline', 'catalogue']
export const screens = ['volunteers', 'satisfaction', 'finance']

/** Arabic for the few figure values that are words rather than numbers. */
export const arValues: Record<string, string> = {
  Now: 'الآن',
  'Current role': 'الدور الحالي',
  'Across hospitals': 'عبر المستشفيات',
  '~4 months': 'نحو 4 أشهر',
  '6 months': '6 أشهر',
  Live: 'حي',
  Instant: 'فوري',
  Daily: 'يومي',
  'On air': 'على الهواء',
  Internal: 'داخلي',
  'Per instructor': 'لكل مدرب',
  Revenue: 'الإيرادات',
  'Nov 2023': 'تشرين الثاني 2023',
  'Nov 2026': 'تشرين الثاني 2026',
  'Early 2026': 'مطلع 2026',
  '2nd': 'الثاني',
  'Humans + agents': 'بشر ووكلاء',
}

export const t = {
  eyebrow: l('Curriculum vitae and portfolio', 'السيرة الذاتية وملف الأعمال'),
  navResults: l('Results', 'النتائج'),
  navExperience: l('Experience', 'الخبرة'),
  navWork: l('Work', 'الأعمال'),
  navTimeline: l('Timeline', 'الخط الزمني'),
  navSkills: l('Skills', 'المهارات'),
  print: l('Print CV', 'طباعة السيرة'),
  tree: l('Tree edition', 'نسخة الشجرة'),
  story: l('Story edition', 'النسخة القصصية'),
  game: l('Game edition', 'نسخة اللعبة'),
  viewWork: l('View the work', 'عرض الأعمال'),
  based: l('Based in', 'مقرّ العمل'),
  employer: l('Organisation', 'المؤسسة'),
  education: l('Education', 'التعليم'),
  educationValue: l('BSc Nursing, 90.2%, second in class', 'بكالوريوس تمريض، 90.2%، الثاني على الدفعة'),
  mapTitle: l('Systems map', 'خريطة الأنظمة'),
  mapNote: l('31 entries across 7 areas. Select a layer to see its work.', '31 عملاً في 7 مجالات. اختر طبقة لعرض أعمالها.'),
  entries: l('entries', 'أعمال'),
  resultsTitle: l('Measured results', 'نتائج مَقيسة'),
  resultsNote: l('Figures as reported in the CV and project records.', 'الأرقام كما وردت في السيرة الذاتية وسجلات المشاريع.'),
  experienceTitle: l('Roles and responsibilities', 'الأدوار والمسؤوليات'),
  seeWork: l('See the work', 'عرض الأعمال'),
  workTitle: l('Systems delivered', 'الأنظمة المنجزة'),
  featuredTitle: l('Selected case studies', 'دراسات حالة مختارة'),
  screensTitle: l('Inside the systems', 'من داخل الأنظمة'),
  indexTitle: l('Full index', 'الفهرس الكامل'),
  all: l('All', 'الكل'),
  colWork: l('Work', 'العمل'),
  colArea: l('Area', 'المجال'),
  colResult: l('Result', 'النتيجة'),
  read: l('Read case study', 'اقرأ دراسة الحالة'),
  withScreens: l('Screens', 'لقطات'),
  timelineTitle: l('Career timeline', 'الخط الزمني المهني'),
  skillsTitle: l('Capabilities', 'القدرات'),
  contactTitle: l('Contact', 'التواصل'),
  contactBody: l(
    'Works across the ward, the HR office and the engineering team, and has delivered for all three. Contact details are shared in person.',
    'يعمل بين الردهة ومكتب الموارد البشرية وفريق الهندسة، وأنجز للأطراف الثلاثة. تُشارَك معلومات الاتصال مباشرةً.',
  ),
  problem: l('The problem', 'المشكلة'),
  built: l('What was delivered', 'ما تم إنجازه'),
  tech: l('Technology', 'التقنيات'),
  shots: l('Screens', 'لقطات من النظام'),
  redacted: l('Screens show demo or redacted data.', 'اللقطات تعرض بيانات تجريبية أو محجوبة.'),
  close: l('Close', 'إغلاق'),
  next: l('Next', 'التالي'),
  prev: l('Previous', 'السابق'),
  top: l('Back to top', 'العودة إلى الأعلى'),
}
