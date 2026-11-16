export type L = { en: string; ar: string }
const l = (en: string, ar: string): L => ({ en, ar })

export interface Chapter {
  id: string
  color: string
  kicker: L
  title: L
  role: L
  period: L
  blurb: L
  stats: { value: string; label: L }[]
}

export interface Project {
  id: string
  chapter: string
  title: L
  tag: L
  problem: L
  built: L[]
  impact: { value: string; label: L }[]
  tech: string[]
}

/** Contact details are intentionally left empty (privacy). Fill in to show buttons. */
export const contact = { email: '', linkedin: '', location: l('Karbala, Iraq', 'كربلاء، العراق') }

export const person = {
  name: l('Ghaith Saad Jawad', 'غيث سعد جواد'),
  title: l('Health Informatics & Digital Transformation Lead', 'مسؤول المعلوماتية الصحية والتحول الرقمي'),
  line: l('Registered nurse turned health-technology builder.', 'ممرض مجاز انتقل إلى بناء الأنظمة الصحية الرقمية.'),
  sub: l(
    'Pediatric nurse on night shifts, and the builder of the HR, disaster-health and training systems used across a health authority. His first system replaced a paid platform that topped out at 10,000–15,000 records, and captured 53,000.',
    'ممرض أطفال في الوجبات الليلية، وباني أنظمة الموارد البشرية وصحة الكوارث والتدريب المستخدمة في هيئة صحية كاملة. نظامه الأول حلّ محل منصة مدفوعة كان سقفها 10,000–15,000 سجل، فسجّل 53,000.',
  ),
  org: l("Health and Medical Education Authority, Al-Ataba Al-Husseiniya", 'هيئة الصحة والتعليم الطبي، العتبة الحسينية المقدسة'),
}

export const impact: { value: number; prefix?: string; suffix?: string; text?: L; label: L }[] = [
  { value: 53000, label: l('records captured in the first mass-gathering deployment', 'سجل في أول تشغيل لنظام بيانات الحشود') },
  { value: 6000, suffix: '+', label: l('employees in one unified HR system', 'موظف في نظام موارد بشرية موحّد') },
  { value: 2821, label: l('recruitment candidates in just over four months', 'متقدم للتوظيف خلال أربعة أشهر تقريباً') },
  { value: 2000, suffix: '+', label: l('academy certificates issued', 'شهادة صادرة من الأكاديمية') },
  { value: 13, label: l('facilities on the satisfaction system', 'مؤسسة ضمن نظام رضا الموظفين') },
  { value: 0, text: l('1–3 months → instant', 'من 1–3 أشهر ← فوري'), label: l('time to analyse mass-gathering data', 'زمن تحليل بيانات الحشود') },
]

export const chapters: Chapter[] = [
  {
    id: 'nursing',
    color: '#ff8f7d',
    kicker: l('The roots', 'الجذور'),
    title: l('Nursing', 'التمريض'),
    role: l('Pediatric Nurse & Shift Lead', 'ممرض أطفال ومسؤول وجبة'),
    period: l('Nov 2023 – present · night shifts', 'تشرين الثاني 2023 – الآن · وجبات ليلية'),
    blurb: l(
      'Every system on this tree began as a problem seen on the ward. The clinical work never stopped: the night shifts continue today.',
      'كل نظام على هذه الشجرة بدأ كمشكلة شوهدت في الردهة. والعمل السريري لم يتوقف: الوجبات الليلية مستمرة إلى اليوم.',
    ),
    stats: [
      { value: '90.2%', label: l('BSc Nursing, second in class', 'بكالوريوس تمريض، الثاني على الدفعة') },
      { value: '2', label: l('leadership roles: ward and shift', 'دوران قياديان: الردهة والوجبة') },
    ],
  },
  {
    id: 'dhmc',
    color: '#ffb454',
    kicker: l('Branch 01', 'الفرع 01'),
    title: l('Disaster Health Management', 'إدارة صحة الكوارث'),
    role: l('Nursing team lead & platform builder, DHMC', 'قائد فريق التمريض وباني المنصة، مركز إدارة صحة الكوارث'),
    period: l('Aug 2024 – present', 'آب 2024 – الآن'),
    blurb: l(
      'Each Arbaeen, millions of pilgrims walk to Karbala. The center (formerly Mass Gathering Medicine) needed to know, in real time, who was being treated, where and for what.',
      'زيارة الأربعين تجلب الملايين إلى كربلاء. كان المركز (طب الحشود سابقاً) بحاجة لأن يعرف لحظياً مَن يُعالَج وأين ولماذا.',
    ),
    stats: [
      { value: '53,000', label: l('records, first deployment', 'سجل في أول تشغيل') },
      { value: '17', label: l('platform iterations', 'إصداراً للمنصة') },
      { value: '41,000', label: l('records from 3 fully digital camps', 'سجل من 3 مخيمات رقمية بالكامل') },
    ],
  },
  {
    id: 'hr',
    color: '#5eead4',
    kicker: l('Branch 02', 'الفرع 02'),
    title: l('HR Systems', 'أنظمة الموارد البشرية'),
    role: l('HR Systems Developer, Central HR', 'مطوّر أنظمة الموارد البشرية، الموارد البشرية المركزية'),
    period: l('2025 – present', '2025 – الآن'),
    blurb: l(
      'Multiple hospitals and centres, thousands of staff, and no shared system. So one was built: first in Google Sheets, then as a full web system that is still used every day.',
      'مستشفيات ومراكز متعددة وآلاف الموظفين بلا نظام مشترك. فبُني نظام واحد: أولاً في Google Sheets ثم كنظام ويب متكامل ما زال يُستخدم يومياً.',
    ),
    stats: [
      { value: '6,000+', label: l('employees unified', 'موظف في نظام موحّد') },
      { value: '2,821', label: l('candidates in ~4 months', 'متقدم خلال 4 أشهر تقريباً') },
      { value: '13', label: l('facilities surveyed', 'مؤسسة مشمولة بالاستبيان') },
    ],
  },
  {
    id: 'academy',
    color: '#b79cff',
    kicker: l('Branch 03', 'الفرع 03'),
    title: l('Warith Academy', 'أكاديمية وارث'),
    role: l('Builder & maintainer, Warith Academy for Health Leadership', 'باني ومشرف منصة أكاديمية وارث للقيادة الصحية'),
    period: l('2025 – present', '2025 – الآن'),
    blurb: l(
      'A complete e-learning and training-operations platform for a healthcare academy: catalogue, registration, learning, exams, certificates and the finance behind every course.',
      'منصة متكاملة للتعليم الإلكتروني وإدارة التدريب لأكاديمية صحية: الدليل، التسجيل، التعلّم، الامتحانات، الشهادات والجانب المالي لكل دورة.',
    ),
    stats: [
      { value: '200+', label: l('courses', 'دورة') },
      { value: '1,000+', label: l('trainees', 'متدرب') },
      { value: '2,000+', label: l('certificates', 'شهادة') },
    ],
  },
  {
    id: 'aha',
    color: '#fb7699',
    kicker: l('Branch 04', 'الفرع 04'),
    title: l('AHA Training Centre', 'مركز تدريب AHA'),
    role: l('Platform builder, AHEAD training centre', 'باني منصة مركز التدريب'),
    period: l('Early 2026', 'مطلع 2026'),
    blurb: l(
      'Life-support training (BLS, ACLS, PALS) for Iraq needed a front door: one place to register, pay, schedule and track equipment.',
      'تدريب الإنعاش (BLS و ACLS و PALS) في العراق احتاج إلى بوابة واحدة: مكان للتسجيل والدفع والجدولة ومتابعة المعدات.',
    ),
    stats: [
      { value: '3', label: l('course lines: BLS · ACLS · PALS', 'مسارات: BLS · ACLS · PALS') },
    ],
  },
  {
    id: 'azu',
    color: '#6fb1ff',
    kicker: l('Branch 05', 'الفرع 05'),
    title: l('AZU60 ERP', 'نظام AZU60'),
    role: l('Project Manager, ERP rollout', 'مدير مشروع تطبيق النظام'),
    period: l('Nov 2026 – present', 'تشرين الثاني 2026 – الآن'),
    blurb: l(
      'The official ERP for the hospitals is being rolled out. His role is to connect HR, clinicians and the IT team so that it fits how wards really work.',
      'يجري الآن تطبيق النظام الرسمي للمستشفيات. دوره هو الربط بين الموارد البشرية والكوادر السريرية وفريق تقنية المعلومات ليتوافق النظام مع واقع العمل في الردهات.',
    ),
    stats: [
      { value: 'Now', label: l('current role', 'الدور الحالي') },
      { value: '14', label: l('part video guide series', 'حلقة في سلسلة الشروحات المرئية') },
    ],
  },
  {
    id: 'lab',
    color: '#c6f26a',
    kicker: l('Branch 06', 'الفرع 06'),
    title: l('The Lab', 'المختبر'),
    role: l('Personal tools & experiments', 'أدوات وتجارب شخصية'),
    period: l('Ongoing', 'مستمر'),
    blurb: l(
      'Side projects built for the fun of it and for the people nearby: desktop utilities, an AI task board and a LAN sharing app with games inside.',
      'مشاريع جانبية بُنيت للمتعة ولمن حوله: أدوات لسطح المكتب، لوحة مهام بالذكاء الاصطناعي وتطبيق مشاركة عبر الشبكة المحلية بداخله ألعاب.',
    ),
    stats: [{ value: '4', label: l('side projects shown here', 'مشاريع جانبية معروضة هنا') }],
  },
]

export const projects: Project[] = [
  // ───────── nursing (roots)
  {
    id: 'peds',
    chapter: 'nursing',
    title: l('Pediatric ward, night shift', 'ردهة الأطفال، الوجبة الليلية'),
    tag: l('Imam Hussein Pediatric Hospital · ward nurse, now shift lead', 'مستشفى الإمام الحسين للأطفال · ممرض ردهة ثم مسؤول وجبة'),
    problem: l('A children\'s ward at night needs calm, firm standards and a team that is not burnt out.', 'ردهة الأطفال ليلاً تحتاج إلى هدوء ومعايير ثابتة وفريق غير مُنهك.'),
    built: [
      l('Ward nurse since November 2023, now leading the shift.', 'ممرض ردهة منذ تشرين الثاني 2023، واليوم مسؤول الوجبة.'),
      l('Known for a fair leadership style: protects staff rest and rights while holding firm standards of patient care.', 'يُعرف بأسلوب قيادة عادل: يحمي راحة الكادر وحقوقه مع التمسك بمعايير رعاية المريض.'),
      l('Still on nights today, alongside every system on this tree.', 'ما زال في الوجبات الليلية حتى اليوم إلى جانب كل نظام على هذه الشجرة.'),
    ],
    impact: [{ value: 'Nov 2023', label: l('to present', 'حتى الآن') }],
    tech: ['Pediatric nursing', 'Shift leadership'],
  },
  {
    id: 'internal',
    chapter: 'nursing',
    title: l('Internal medicine ward lead', 'مسؤول ردهة الباطنية'),
    tag: l('Imam Hassan Hospital · six-month assignment', 'مستشفى الإمام الحسن · تكليف ستة أشهر'),
    problem: l('An adult internal medicine ward needed a lead for six months.', 'ردهة الباطنية للبالغين احتاجت إلى مسؤول لمدة ستة أشهر.'),
    built: [
      l('Led the adult internal medicine ward for the full assignment.', 'قاد ردهة الباطنية للبالغين طوال مدة التكليف.'),
      l('Received an official letter of thanks at the end of it.', 'حصل على كتاب شكر رسمي في نهايته.'),
    ],
    impact: [{ value: '6 months', label: l('ward leadership', 'قيادة ردهة') }],
    tech: ['Adult internal medicine', 'Team leadership'],
  },
  {
    id: 'degree',
    chapter: 'nursing',
    title: l('Bachelor of Nursing', 'بكالوريوس تمريض'),
    tag: l('Safwa University · second in class', 'جامعة الصفوة · الثاني على الدفعة'),
    problem: l('The entry qualification for registered nursing.', 'المؤهل الأساسي لممارسة التمريض.'),
    built: [l('Graduated second in class with an overall score of 90.2%.', 'تخرّج الثاني على دفعته بمعدل 90.2%.')],
    impact: [{ value: '90.2%', label: l('overall score', 'المعدل العام') }, { value: '2nd', label: l('in class', 'على الدفعة') }],
    tech: ['Nursing'],
  },
  {
    id: 'als',
    chapter: 'nursing',
    title: l('WHO / NHS England Action Learning Set', 'مجموعة التعلّم بالممارسة WHO / NHS England'),
    tag: l('AL1.1 · delivered with the University of Salford · 2026', 'AL1.1 · بالتعاون مع جامعة سالفورد · 2026'),
    problem: l('Structured peer learning on leading health services.', 'تعلّم منظّم مع الأقران حول قيادة الخدمات الصحية.'),
    built: [l('Completed the WHO/NHS England Action Learning Set (AL1.1), delivered with the University of Salford, in 2026.', 'أكمل مجموعة التعلّم بالممارسة (AL1.1) التابعة لمنظمة الصحة العالمية و NHS England بالتعاون مع جامعة سالفورد عام 2026.')],
    impact: [{ value: '2026', label: l('professional development', 'تطوير مهني') }],
    tech: ['Action learning', 'Health leadership'],
  },

  // ───────── DHMC
  {
    id: 'massdata',
    chapter: 'dhmc',
    title: l('Mass-gathering data collection', 'نظام جمع بيانات الحشود'),
    tag: l('53,000 records; the old ceiling was 10,000–15,000', '53,000 سجل، وكان السقف القديم 10,000–15,000'),
    problem: l('The previous paid platform topped out at 10,000–15,000 records per event, and analysis took one to three months.', 'المنصة المدفوعة السابقة كانت تتوقف عند 10,000–15,000 سجل لكل مناسبة، والتحليل يستغرق من شهر إلى ثلاثة.'),
    built: [
      l('Designed a data-collection system that field teams could use under pressure.', 'صمّم نظام جمع بيانات تستطيع الفرق الميدانية استخدامه تحت الضغط.'),
      l('Captured 53,000 records in its first deployment.', 'سجّل 53,000 سجل في أول تشغيل له.'),
      l('Analysis that used to take one to three months became instant.', 'التحليل الذي كان يستغرق من شهر إلى ثلاثة أصبح فورياً.'),
    ],
    impact: [
      { value: '53,000', label: l('records, first deployment', 'سجل في أول تشغيل') },
      { value: '3.5×', label: l('the previous platform\'s ceiling', 'سقف المنصة السابقة') },
      { value: 'Instant', label: l('analysis, down from 1–3 months', 'تحليل، بدل 1–3 أشهر') },
    ],
    tech: ['Google Sheets automation', 'Apps Script', 'Live dashboards'],
  },
  {
    id: 'platform',
    chapter: 'dhmc',
    title: l('Disaster health management platform', 'منصة إدارة صحة الكوارث'),
    tag: l('17 iterations: from forms to a field hospital information system', '17 إصداراً: من استمارات إلى نظام معلومات لمستشفى ميداني'),
    problem: l('Camps, mobile teams, staff, patients and medication were all tracked separately, or not at all.', 'المخيمات والفرق الجوالة والكوادر والمرضى والأدوية كانت تُتابَع كلٌّ على حدة أو لا تُتابَع أصلاً.'),
    built: [
      l('Pilgrim flow, medical staff, mobile teams and camps in one platform.', 'حركة الزائرين والكوادر الطبية والفرق الجوالة والمخيمات في منصة واحدة.'),
      l('Patient records and medication: a mini hospital information system for field camps.', 'سجلات المرضى والأدوية: نظام معلومات مصغّر للمخيمات الميدانية.'),
      l('Live map tracking of teams on the ground.', 'تتبّع حي للفرق على الخريطة.'),
      l('The fully digital version captured 41,000 records from 3 camps.', 'النسخة الرقمية الكاملة سجّلت 41,000 سجل من 3 مخيمات.'),
    ],
    impact: [
      { value: '17', label: l('iterations', 'إصداراً') },
      { value: '41,000', label: l('records from 3 camps', 'سجل من 3 مخيمات') },
    ],
    tech: ['React', 'Vite', 'Firebase', 'Live maps'],
  },
  {
    id: 'worldmap',
    chapter: 'dhmc',
    title: l('Live 3D world map of patients', 'خريطة العالم الحية ثلاثية الأبعاد للمرضى'),
    tag: l('Arbaeen 2026 · featured on Karbala TV', 'الأربعين 2026 · عُرضت على قناة كربلاء'),
    problem: l('Pilgrims come from all over the world. Leaders wanted to see that, live, not read it in a report weeks later.', 'الزائرون يأتون من أنحاء العالم. أرادت القيادة أن ترى ذلك حياً لا أن تقرأه في تقرير بعد أسابيع.'),
    built: [
      l('A live 3D globe showing treated patients by nationality as records arrive.', 'كرة أرضية حية ثلاثية الأبعاد تعرض المرضى حسب الجنسية لحظة وصول السجلات.'),
      l('Built for Arbaeen 2026 and shown on Karbala TV and social media.', 'بُنيت لزيارة الأربعين 2026 وعُرضت على قناة كربلاء ومواقع التواصل.'),
    ],
    impact: [{ value: 'On air', label: l('featured on Karbala TV', 'عُرضت على قناة كربلاء') }],
    tech: ['Three.js', 'React', 'Firebase', 'Realtime data'],
  },
  {
    id: 'volunteers',
    chapter: 'dhmc',
    title: l('Volunteer training & roster platform', 'منصة تدريب وإدارة المتطوعين'),
    tag: l('Train first, then register: trained volunteers join the roster', 'تدرّب أولاً ثم سجّل: المتطوع المدرَّب ينضم إلى القائمة'),
    problem: l('Thousands of health workers want to volunteer for the Ziyara. They need training, screening and a roster.', 'آلاف الكوادر الصحية يرغبون بالتطوع في الزيارة ويحتاجون إلى تدريب وفرز وقائمة منظمة.'),
    built: [
      l('Branches for nursing, medicine and pharmacy with video lessons and an anti-skip player: watch it all before the quiz unlocks.', 'مسارات للتمريض والطب والصيدلة بدروس مرئية ومشغّل يمنع التخطي: شاهد الدرس كاملاً ليُفتح الاختبار.'),
      l('Per-lesson quizzes with explanations and unlimited retries.', 'اختبار لكل درس مع شرح ومحاولات غير محدودة.'),
      l('Passing unlocks registration; admins get a roster with filters, export and status tracking.', 'النجاح يفتح التسجيل، وللإدارة قائمة بالمتطوعين مع فلاتر وتصدير ومتابعة الحالة.'),
      l('Bilingual Arabic/English with password-less sign-in.', 'ثنائية اللغة عربي/إنكليزي مع دخول بلا كلمة مرور.'),
    ],
    impact: [
      { value: '2,000+', label: l('sign-ups', 'تسجيل') },
      { value: '500+', label: l('nurses selected', 'ممرض تم اختيارهم') },
      { value: '142 · 70', label: l('doctors · pharmacists selected', 'طبيباً · صيدلانياً') },
    ],
    tech: ['React 19', 'TypeScript', 'Tailwind', 'Firebase', 'Cloud Functions', 'i18next'],
  },

  // ───────── HR
  {
    id: 'sheets',
    chapter: 'hr',
    title: l('Unified HR data system', 'نظام بيانات الموارد البشرية الموحّد'),
    tag: l('6,000+ employees in one live system, before the official ERP was available', 'أكثر من 6,000 موظف في نظام حي واحد قبل توفّر النظام الرسمي'),
    problem: l('Every facility kept its own staff files. Nobody could answer a simple question about the whole workforce.', 'كل مؤسسة تحتفظ بملفاتها الخاصة ولا أحد يستطيع الإجابة عن سؤال بسيط حول القوى العاملة كلها.'),
    built: [
      l('A unified, real-time HR data system in Google Sheets across multiple hospitals and centres.', 'نظام بيانات موحّد ولحظي في Google Sheets يغطي مستشفيات ومراكز متعددة.'),
      l('A live HR dashboard on top of it for central HR.', 'لوحة متابعة حية فوقه للموارد البشرية المركزية.'),
    ],
    impact: [{ value: '6,000+', label: l('employees', 'موظف') }, { value: 'Live', label: l('real-time updates', 'تحديث لحظي') }],
    tech: ['Google Sheets', 'Apps Script', 'Dashboards'],
  },
  {
    id: 'minierp',
    chapter: 'hr',
    title: l('Custom mini-ERP for HR', 'نظام ERP مصغّر للموارد البشرية'),
    tag: l('What replaced the spreadsheet: forms, staffing plans, leave, archive', 'ما حلّ محل الجدول: استمارات، خطط ملاك، إجازات، أرشيف'),
    problem: l('Spreadsheets hit their limit. HR needed workflows, history and permissions.', 'جداول البيانات بلغت حدّها واحتاجت الموارد البشرية إلى مسارات عمل وسجل وصلاحيات.'),
    built: [
      l('Six HR form families: resignations, contract termination, investigations, grievances, complaints and confidential cases, each with records and reports.', 'ست مجموعات من الاستمارات: الاستقالات، إنهاء العقود، التحقيقات، التظلمات، الشكاوى والحالات السرية، مع سجلات وتقارير لكل منها.'),
      l('Employee, facility, department and job-title databases with yearly staffing and hiring plans.', 'قواعد بيانات للموظفين والمؤسسات والأقسام والعناوين الوظيفية مع خطط الملاك والتعيين السنوية.'),
      l('Leave management, training records, an archive with bulk import, and a contract generator.', 'إدارة الإجازات، سجلات التدريب، أرشيف باستيراد جماعي ومولّد عقود.'),
      l('Still in active daily use.', 'ما زال قيد الاستخدام اليومي.'),
    ],
    impact: [{ value: '6', label: l('form families', 'مجموعات استمارات') }, { value: 'Daily', label: l('use across HR', 'استخدام يومي') }],
    tech: ['React 19', 'Vite', 'Firebase', 'Firestore', 'Recharts'],
  },
  {
    id: 'attendance',
    chapter: 'hr',
    title: l('Attendance & penalty system', 'نظام الدوام والجزاءات'),
    tag: l('Fingerprint devices in, fair deductions and clear reports out', 'بيانات أجهزة البصمة تدخل، واستقطاعات عادلة وتقارير واضحة تخرج'),
    problem: l('Raw fingerprint logs are unreadable, and penalties applied by hand are never consistent.', 'سجلات البصمة الخام غير مقروءة والجزاءات اليدوية لا تكون متسقة أبداً.'),
    built: [
      l('Imports data from fingerprint devices through a small bridge service.', 'يستورد البيانات من أجهزة البصمة عبر خدمة وسيطة صغيرة.'),
      l('Hourly-leave and fingerprint-exception wizards, plus manual punch corrections.', 'معالجات للإجازات الزمنية واستثناءات البصمة مع تصحيح يدوي للبصمات.'),
      l('A temporary deduction system, reports by period and late punch-in indicators across hospitals.', 'نظام استقطاع مؤقت وتقارير حسب الفترة ومؤشرات التأخير عبر المستشفيات.'),
      l('Department reports to Excel and print.', 'تقارير الأقسام إلى Excel والطباعة.'),
    ],
    impact: [{ value: 'Across hospitals', label: l('late punch-in indicators and period reports', 'مؤشرات التأخير وتقارير الفترات') }],
    tech: ['React', 'Firebase', 'Node bridge', 'ZKTeco devices', 'Excel export'],
  },
  {
    id: 'recruitment',
    chapter: 'hr',
    title: l('Digital recruitment platform', 'منصة التوظيف الرقمية'),
    tag: l('Scan a QR code, apply, sit the exam, join the shared pool', 'امسح الرمز، قدّم، أدِّ الامتحان، وانضم إلى القاعدة المشتركة'),
    problem: l('Paper CVs arrived at each facility separately. Good candidates were lost between them.', 'السير الذاتية الورقية تصل إلى كل مؤسسة على حدة ويضيع المرشحون الجيدون بينها.'),
    built: [
      l('QR-code application with automatic text extraction from uploaded CVs.', 'تقديم عبر رمز QR مع استخراج تلقائي لنص السيرة الذاتية.'),
      l('English and job-specific exams with question banks, fullscreen anti-cheat and retake requests.', 'امتحانات لغة إنكليزية وتخصصية ببنوك أسئلة، مع منع الغش بوضع ملء الشاشة وطلبات الإعادة.'),
      l('One shared candidate pool and hiring pipeline for all facilities.', 'قاعدة مرشحين ومسار تعيين مشترك لكل المؤسسات.'),
    ],
    impact: [{ value: '2,821', label: l('candidates', 'متقدم') }, { value: '~4 months', label: l('to get there', 'للوصول إلى ذلك') }],
    tech: ['React', 'Firebase', 'Cloud Functions', 'PDF text extraction', 'QR'],
  },
  {
    id: 'directline',
    chapter: 'hr',
    title: l('The Direct Line', 'الخط المباشر (قناة مجهولة)'),
    tag: l('Anonymous complaints, suggestions and thanks, straight to central HR', 'شكاوى ومقترحات وشكر بلا أسماء، مباشرة إلى الموارد البشرية المركزية'),
    problem: l('Staff with a real problem had nowhere safe to say it.', 'الموظف الذي لديه مشكلة حقيقية لم يكن يجد مكاناً آمناً ليقولها.'),
    built: [
      l('Designed with HR leadership. Staff pick a facility and receive a generated identity, with no password and no name.', 'صُمّم مع قيادة الموارد البشرية. يختار الموظف مؤسسته ويحصل على هوية مولّدة بلا كلمة مرور ولا اسم.'),
      l('Guided flows for a problem, a suggestion or a thank-you, with evidence upload.', 'مسارات موجّهة للمشكلة أو المقترح أو الشكر مع رفع الأدلة.'),
      l('Two-way anonymous chat with HR, push notifications, and a private case workflow for investigations.', 'محادثة مجهولة باتجاهين مع الموارد البشرية وإشعارات ومسار قضايا خاص بالتحقيقات.'),
    ],
    impact: [{ value: '300+', label: l('submissions', 'رسالة') }, { value: '~60', label: l('critical issues addressed', 'مشكلة حرجة عولجت') }],
    tech: ['React 19', 'TypeScript', 'Tailwind', 'Firebase', 'FCM push'],
  },
  {
    id: 'satisfaction',
    chapter: 'hr',
    title: l('Employee Satisfaction & VP Evaluation', 'رضا الموظفين وتقييم نواب الرئيس'),
    tag: l('One QR code per facility, strategy pillars built in', 'رمز QR لكل مؤسسة، مع ركائز الاستراتيجية'),
    problem: l('Leadership wanted an honest, comparable reading of staff satisfaction in every facility.', 'أرادت القيادة قراءة صادقة وقابلة للمقارنة لرضا الموظفين في كل مؤسسة.'),
    built: [
      l('Anonymous, bilingual survey reached by a QR poster unique to each facility.', 'استبيان مجهول وثنائي اللغة يُفتح من ملصق QR خاص بكل مؤسسة.'),
      l('The strategy unit\'s pillars and five core principles are built into the questions.', 'ركائز وحدة الاستراتيجية ومبادئها الخمسة مدمجة في الأسئلة.'),
      l('A results dashboard per facility with scores, comments and sharing.', 'لوحة نتائج لكل مؤسسة بالدرجات والتعليقات والمشاركة.'),
    ],
    impact: [{ value: '13', label: l('facilities', 'مؤسسة') }, { value: 'Nov 2026', label: l('launched', 'تاريخ الإطلاق') }],
    tech: ['React', 'Firebase', 'QR posters', 'Dashboards'],
  },
  {
    id: 'georgetown',
    chapter: 'hr',
    title: l('Scholarship talent pool', 'قاعدة المواهب للبعثة الدراسية'),
    tag: l('Screening for a Georgetown University scholarship', 'فرز المتقدمين لبعثة جامعة جورجتاون'),
    problem: l('Hundreds of applicants, clear criteria, and a need for a fair, fast shortlist.', 'مئات المتقدمين ومعايير واضحة وحاجة إلى قائمة مختصرة عادلة وسريعة.'),
    built: [
      l('A talent-pool and screening system that scored every applicant against the criteria.', 'نظام قاعدة مواهب وفرز يقيّم كل متقدم وفق المعايير.'),
      l('Produced the qualified shortlist for the committee.', 'أنتج القائمة المؤهلة للجنة.'),
    ],
    impact: [{ value: '500+', label: l('applicants', 'متقدم') }, { value: '92', label: l('qualified', 'مؤهلاً') }],
    tech: ['Google Sheets', 'Apps Script', 'Screening rules'],
  },
  {
    id: 'toolkit',
    chapter: 'hr',
    title: l('The HR toolkit', 'عُدّة الموارد البشرية'),
    tag: l('G-Scanner, an AI regulations assistant and the small tools around them', 'G-Scanner ومساعد اللوائح بالذكاء الاصطناعي وأدوات صغيرة حولهما'),
    problem: l('Daily HR work is full of small frictions that never get a budget.', 'عمل الموارد البشرية اليومي مليء بعقبات صغيرة لا تحصل على ميزانية.'),
    built: [
      l('G-Scanner: an HR archiving system used by HR teams across multiple facilities.', 'G-Scanner: نظام أرشفة تستخدمه فرق الموارد البشرية في عدة مؤسسات.'),
      l('An AI assistant for HR regulations, and a searchable navigator of 86 violations with their penalty ladders.', 'مساعد بالذكاء الاصطناعي للوائح الموارد البشرية ودليل بحث لـ 86 مخالفة مع سلّم جزاءاتها.'),
      l('Meeting-room scheduling, a shift-scheduling helper, a job index with an org-chart and leave-route simulator.', 'حجز قاعات الاجتماعات، مساعد جدولة الوجبات، وفهرس وظيفي مع هيكل تنظيمي ومحاكي مسار الإجازات.'),
    ],
    impact: [{ value: '86', label: l('violations indexed', 'مخالفة مفهرسة') }],
    tech: ['React', 'TypeScript', 'Firebase', 'Node', 'AI assistants'],
  },

  // ───────── Academy
  {
    id: 'catalogue',
    chapter: 'academy',
    title: l('Academy platform', 'منصة الأكاديمية'),
    tag: l('Catalogue, registration and operations for a health-leadership academy', 'دليل وتسجيل وتشغيل لأكاديمية القيادة الصحية'),
    problem: l('Courses were announced, registered and tracked by hand across chats and spreadsheets.', 'الدورات كانت تُعلَن وتُسجَّل وتُتابَع يدوياً عبر المحادثات والجداول.'),
    built: [
      l('A public, bilingual catalogue of programmes and trainers with search, filters and ratings.', 'دليل عام ثنائي اللغة للبرامج والمدربين مع بحث وفلاتر وتقييمات.'),
      l('Online, in-person, blended and self-paced courses, with intakes, attendance and monitoring.', 'دورات إلكترونية وحضورية ومدمجة وذاتية، مع الدفعات والحضور والمتابعة.'),
      l('Trainer applications with approval, dashboards and public profiles.', 'طلبات المدربين مع الموافقة ولوحات متابعة وصفحات تعريفية.'),
      l('Admin operations: roles, audit log, team tasks and exports to Excel, Word, PowerPoint and PDF.', 'عمليات الإدارة: أدوار وسجل تدقيق ومهام الفريق وتصدير إلى Excel و Word و PowerPoint و PDF.'),
    ],
    impact: [{ value: '200+', label: l('courses', 'دورة') }, { value: '1,000+', label: l('trainees', 'متدرب') }],
    tech: ['React 19', 'TypeScript', 'Firebase', 'Tailwind', 'TanStack Query'],
  },
  {
    id: 'learn',
    chapter: 'academy',
    title: l('Learner portal', 'بوابة المتعلّم'),
    tag: l('One personal link: lectures, quizzes, exam, certificate', 'رابط شخصي واحد: محاضرات، اختبارات، امتحان، شهادة'),
    problem: l('Busy clinicians will not create an account and remember a password for one course.', 'الكادر المشغول لن ينشئ حساباً ويحفظ كلمة مرور من أجل دورة واحدة.'),
    built: [
      l('A personal link opens the whole course: no account, calendar import, scheduled lectures.', 'رابط شخصي يفتح الدورة كاملة: بلا حساب، مع استيراد إلى التقويم ومحاضرات مجدولة.'),
      l('Controlled video players with skip prevention and presence checks.', 'مشغلات فيديو مضبوطة تمنع التخطي وتتحقق من الحضور.'),
      l('Short quizzes, lecture feedback, progress recovery, then the final exam and certificate.', 'اختبارات قصيرة وتقييم للمحاضرة واستعادة للتقدم ثم الامتحان النهائي والشهادة.'),
    ],
    impact: [{ value: '2,000+', label: l('certificates issued', 'شهادة صادرة') }],
    tech: ['React', 'Firebase', 'Video player controls', 'QR verification'],
  },
  {
    id: 'exams',
    chapter: 'academy',
    title: l('Exams & certificates', 'الامتحانات والشهادات'),
    tag: l('Question banks, AI helpers, cheating detection, verifiable certificates', 'بنوك أسئلة، مساعدات ذكاء اصطناعي، كشف الغش، شهادات قابلة للتحقق'),
    problem: l('An exam only means something if it is hard to cheat and easy to verify.', 'الامتحان لا قيمة له إلا إذا كان الغش فيه صعباً والتحقق منه سهلاً.'),
    built: [
      l('Exam builder with question banks and an AI question generator.', 'منشئ امتحانات مع بنوك أسئلة ومولّد أسئلة بالذكاء الاصطناعي.'),
      l('Public exam links with fullscreen mode, security-event tracking and offline-safe submission.', 'روابط امتحان عامة بوضع ملء الشاشة وتتبّع الأحداث الأمنية وإرسال آمن عند انقطاع الاتصال.'),
      l('Result analysis exports, and certificates with templates, QR codes and a public verification page.', 'تصدير تحليل النتائج، وشهادات بقوالب ورموز QR وصفحة تحقق عامة.'),
    ],
    impact: [{ value: 'QR', label: l('verified certificates', 'شهادات موثّقة') }],
    tech: ['React', 'Firebase', 'Gemini', 'ExcelJS', 'jsPDF'],
  },
  {
    id: 'finance',
    chapter: 'academy',
    title: l('Course finance & cost study', 'مالية الدورات ودراسة الكلفة'),
    tag: l('Price every course from its real cost', 'سعّر كل دورة من كلفتها الحقيقية'),
    problem: l('Course prices were guesses. Nobody knew which courses paid for themselves.', 'أسعار الدورات كانت تخميناً ولا أحد يعرف أي الدورات تغطي كلفتها.'),
    built: [
      l('Cost-study pricing with a rate card and an approval workflow.', 'تسعير بدراسة الكلفة مع بطاقة أسعار ومسار موافقات.'),
      l('Income, instalments, expenses and advances per course; planned versus actual.', 'الإيرادات والأقساط والمصروفات والسلف لكل دورة، والمخطط مقابل الفعلي.'),
      l('Category-based fees for members and non-members, with course and certificate fees.', 'رسوم حسب الفئة للمنتسبين وغيرهم، مع رسوم الدورة والشهادة.'),
    ],
    impact: [{ value: 'Revenue', label: l('tracked per course', 'متابَعة لكل دورة') }],
    tech: ['React', 'Firebase', 'Recharts', 'Approval workflow'],
  },

  // ───────── AHA
  {
    id: 'aheadtc',
    chapter: 'aha',
    title: l('aheadtc.org', 'aheadtc.org'),
    tag: l('The AHA training-centre registration platform for Iraq', 'منصة تسجيل مركز تدريب AHA في العراق'),
    problem: l('Clinicians across Iraq needed one clear place to find and book BLS, ACLS and PALS courses.', 'الكوادر في أنحاء العراق احتاجت إلى مكان واحد واضح للعثور على دورات BLS و ACLS و PALS وحجزها.'),
    built: [
      l('Public site and registration flow for the training centre\'s life-support courses.', 'موقع عام ومسار تسجيل لدورات الإنعاش في مركز التدريب.'),
      l('Course schedule, seats and registrations managed from one admin side.', 'جدول الدورات والمقاعد والتسجيلات تُدار من لوحة واحدة.'),
    ],
    impact: [{ value: 'BLS · ACLS · PALS', label: l('course lines', 'مسارات الدورات') }, { value: 'Early 2026', label: l('launched', 'تاريخ الإطلاق') }],
    tech: ['React', 'Vite', 'Firebase'],
  },
  {
    id: 'ahaops',
    chapter: 'aha',
    title: l('Internal operations site', 'الموقع الداخلي للعمليات'),
    tag: l('Payments and equipment for the training centre', 'المدفوعات والمعدات لمركز التدريب'),
    problem: l('Manikins, kits and payments were tracked wherever someone remembered to write them.', 'الدمى التدريبية والعُدد والمدفوعات كانت تُسجَّل حيثما تذكّر أحدهم.'),
    built: [
      l('An internal site for the centre\'s team to track payments and training equipment.', 'موقع داخلي لفريق المركز لمتابعة المدفوعات ومعدات التدريب.'),
    ],
    impact: [{ value: 'Internal', label: l('payments & equipment', 'مدفوعات ومعدات') }],
    tech: ['React', 'Firebase'],
  },
  {
    id: 'ahaeval',
    chapter: 'aha',
    title: l('Instructor evaluation', 'تقييم المدربين'),
    tag: l('Structured feedback on every instructor', 'تغذية راجعة منظمة عن كل مدرب'),
    problem: l('Instructor quality was discussed, not measured.', 'جودة المدربين كانت تُناقَش ولا تُقاس.'),
    built: [
      l('A mobile-friendly, bilingual evaluation form with rating scales per instructor.', 'استمارة تقييم ثنائية اللغة ملائمة للهاتف بمقاييس تقييم لكل مدرب.'),
      l('An admin dashboard to review the results.', 'لوحة إدارة لمراجعة النتائج.'),
    ],
    impact: [{ value: 'Per instructor', label: l('measured feedback', 'تغذية راجعة مَقيسة') }],
    tech: ['React', 'Tailwind', 'Firebase', 'Vitest'],
  },

  // ───────── AZU60
  {
    id: 'azupm',
    chapter: 'azu',
    title: l('ERP rollout, project management', 'إدارة مشروع تطبيق النظام'),
    tag: l('The contact point between hospitals and the IT team', 'نقطة الاتصال بين المستشفيات وفريق تقنية المعلومات'),
    problem: l('An ERP fails when the people who built it and the people who use it speak different languages.', 'يفشل أي نظام حين يتحدث من بناه ومن يستخدمه لغتين مختلفتين.'),
    built: [
      l('Contact point between hospitals and the AZU60 IT team.', 'نقطة الاتصال بين المستشفيات وفريق AZU60.'),
      l('Bridges HR, clinical and technical requirements, having worked in all three.', 'يربط متطلبات الموارد البشرية والسريرية والتقنية بعد أن عمل في الثلاثة.'),
    ],
    impact: [{ value: 'Current role', label: l('since Nov 2026', 'منذ تشرين الثاني 2026') }],
    tech: ['ERP project management', 'Stakeholder coordination'],
  },
  {
    id: 'azuguides',
    chapter: 'azu',
    title: l('Video guide series', 'سلسلة الشروحات المرئية'),
    tag: l('14 parts, plus written guidelines', '14 حلقة مع إرشادات مكتوبة'),
    problem: l('Thousands of staff must learn a new system without leaving their wards.', 'آلاف الموظفين يجب أن يتعلموا نظاماً جديداً دون ترك ردهاتهم.'),
    built: [
      l('Producing a 14-part video guide series for the rollout.', 'إنتاج سلسلة شروحات مرئية من 14 حلقة للتطبيق.'),
      l('Written guidelines including shift setup and staff assignment.', 'إرشادات مكتوبة تشمل إعداد الوجبات وتوزيع الكادر.'),
    ],
    impact: [{ value: '14', label: l('video guides', 'شرحاً مرئياً') }],
    tech: ['Training content', 'Video production'],
  },
  {
    id: 'azuperms',
    chapter: 'azu',
    title: l('Permissions catalogue & advisor', 'فهرس الصلاحيات والمستشار الذكي'),
    tag: l('1,006 screens and 7,184 permission keys, mapped', '1,006 شاشة و 7,184 مفتاح صلاحية موثّقة'),
    problem: l('Nobody could say exactly what a given role should see. Roles were built by trial and error.', 'لم يكن أحد قادراً على تحديد ما يجب أن يراه كل دور، فكانت الأدوار تُبنى بالتجربة والخطأ.'),
    built: [
      l('A full catalogue of the system\'s screens and permission keys, grouped by domain.', 'فهرس كامل لشاشات النظام ومفاتيح صلاحياته مصنّف حسب المجال.'),
      l('A role-building method with per-role audits: keep, remove, add.', 'منهجية لبناء الأدوار مع تدقيق لكل دور: إبقاء، حذف، إضافة.'),
      l('An AI advisor skill that reviews a role\'s grants and recommends changes. Advisory only.', 'مهارة مستشار بالذكاء الاصطناعي تراجع صلاحيات الدور وتقترح التعديلات. استشارية فقط.'),
    ],
    impact: [{ value: '1,006', label: l('screens', 'شاشة') }, { value: '7,184', label: l('permission keys', 'مفتاح صلاحية') }],
    tech: ['Python', 'Markdown', 'CSV', 'AI agent skill'],
  },
  {
    id: 'azuemp',
    chapter: 'azu',
    title: l('Employee screens, redesigned', 'شاشات الموظف بتصميم جديد'),
    tag: l('A cleaner employee form and list for the HR module', 'استمارة وقائمة موظفين أوضح لوحدة الموارد البشرية'),
    problem: l('The employee record is the screen HR opens most. It had to be faster to read and safer to edit.', 'ملف الموظف هو أكثر شاشة تفتحها الموارد البشرية وكان يجب أن تكون أسرع قراءةً وأأمن تعديلاً.'),
    built: [
      l('Redesigned employee form and list as drop-in screens, with a standalone preview.', 'إعادة تصميم استمارة وقائمة الموظفين كشاشات جاهزة للدمج مع معاينة مستقلة.'),
      l('Workflow state badges and actions, attachments, relatives and a job-index position picker.', 'شارات حالة المسار وإجراءاته، المرفقات، الأقارب ومنتقي الموقع من الفهرس الوظيفي.'),
      l('Bilingual, right-to-left, with permission hooks on every control.', 'ثنائية اللغة ومن اليمين إلى اليسار مع نقاط صلاحيات على كل عنصر.'),
    ],
    impact: [{ value: '2', label: l('core screens delivered', 'شاشتان أساسيتان') }],
    tech: ['Vue 3', 'vue-i18n', 'Vite', 'Frappe'],
  },

  // ───────── Lab
  {
    id: 'airbeam',
    chapter: 'lab',
    title: l('AirBeam', 'AirBeam'),
    tag: l('Peer-to-peer LAN drop and chat, with games inside', 'مشاركة ومحادثة عبر الشبكة المحلية مع ألعاب بداخلها'),
    problem: l('Moving a file between two devices in the same room should not need the internet.', 'نقل ملف بين جهازين في الغرفة نفسها لا ينبغي أن يحتاج إلى الإنترنت.'),
    built: [
      l('File and folder transfer, chat, clipboard sync, screen share and a whiteboard over the local network.', 'نقل الملفات والمجلدات، محادثة، مزامنة الحافظة، مشاركة الشاشة ولوح أبيض عبر الشبكة المحلية.'),
      l('Join by QR code. Installable as a web app or a Windows desktop build.', 'انضمام برمز QR. قابل للتثبيت كتطبيق ويب أو نسخة لسطح المكتب.'),
      l('Built-in multiplayer mini-games for the break room.', 'ألعاب جماعية صغيرة مدمجة لوقت الاستراحة.'),
    ],
    impact: [{ value: 'P2P', label: l('no internet needed', 'بلا حاجة للإنترنت') }],
    tech: ['React 19', 'TypeScript', 'WebRTC', 'WebSocket', 'Electron', 'PWA'],
  },
  {
    id: 'toolshub',
    chapter: 'lab',
    title: l('Tools Hub', 'مركز الأدوات'),
    tag: l('A Windows toolbox that grew out of a file organiser', 'صندوق أدوات لويندوز نشأ من منظّم ملفات'),
    problem: l('Trainers kept asking for the same chores: certificates in bulk, graded answer sheets, QR codes.', 'المدربون يطلبون المهام نفسها دائماً: شهادات بالجملة، تصحيح أوراق الإجابة، رموز QR.'),
    built: [
      l('Bulk certificate generator from a template and a spreadsheet, with Arabic fonts.', 'مولّد شهادات بالجملة من قالب وجدول مع دعم الخطوط العربية.'),
      l('Answer-sheet grading by camera for 60-question bubble sheets, with an Android companion.', 'تصحيح أوراق الإجابة بالكاميرا لـ 60 سؤالاً مع تطبيق أندرويد مرافق.'),
      l('File organiser with rules and undo, QR generator, file and audio tools.', 'منظّم ملفات بقواعد وتراجع، مولّد QR، وأدوات للملفات والصوت.'),
    ],
    impact: [{ value: '60', label: l('question sheets graded by camera', 'سؤالاً تُصحَّح بالكاميرا') }],
    tech: ['Python', 'PySide6', 'OpenCV', 'Kotlin'],
  },
  {
    id: 'iconstudio',
    chapter: 'lab',
    title: l('Folder Icon Studio', 'Folder Icon Studio'),
    tag: l('Change Windows folder icons by drag and drop', 'تغيير أيقونات مجلدات ويندوز بالسحب والإفلات'),
    problem: l('Hundreds of identical folders are slow to navigate.', 'مئات المجلدات المتشابهة تُبطئ التنقل.'),
    built: [
      l('Change Windows folder icons by drag and drop, with a live before/after preview.', 'تغيير أيقونات مجلدات ويندوز بالسحب والإفلات مع معاينة حية قبل/بعد.'),
      l('800+ bundled icons in 20 searchable categories, plus your own images.', 'أكثر من 800 أيقونة في 20 تصنيفاً قابلاً للبحث، مع إمكانية استخدام صورك.'),
      l('Released as a portable single executable.', 'صدر كملف تنفيذي محمول واحد.'),
    ],
    impact: [{ value: '800+', label: l('icons', 'أيقونة') }, { value: 'v1.0', label: l('released', 'صدر') }],
    tech: ['C#', '.NET', 'Python', 'PyQt6'],
  },
  {
    id: 'taskagent',
    chapter: 'lab',
    title: l('TaskAgent OS', 'TaskAgent OS'),
    tag: l('A task board that humans and AI agents share', 'لوحة مهام يتشاركها البشر ووكلاء الذكاء الاصطناعي'),
    problem: l('AI coding agents do real work now, but their tasks live in chat windows nobody else can see.', 'وكلاء الذكاء الاصطناعي ينجزون عملاً حقيقياً، لكن مهامهم تعيش في نوافذ محادثة لا يراها أحد.'),
    built: [
      l('Board, task pool and timeline views with dependencies and subtasks.', 'عروض اللوحة ومجمع المهام والخط الزمني مع الاعتماديات والمهام الفرعية.'),
      l('An agent API so AI agents can pick up, update and report on tasks.', 'واجهة برمجية للوكلاء لاستلام المهام وتحديثها ورفع تقاريرها.'),
      l('Web app plus a desktop build; teams, invites and reports.', 'تطبيق ويب ونسخة لسطح المكتب، مع الفرق والدعوات والتقارير.'),
    ],
    impact: [{ value: 'Humans + agents', label: l('one board', 'لوحة واحدة') }],
    tech: ['React 19', 'TypeScript', 'Firebase', 'Express', 'Tauri'],
  },
]

export const timeline: { when: L; what: L; chapter: string }[] = [
  { when: l('Nov 2023', 'تشرين الثاني 2023'), what: l('Pediatric ward nurse, Imam Hussein Pediatric Hospital', 'ممرض ردهة أطفال، مستشفى الإمام الحسين للأطفال'), chapter: 'nursing' },
  { when: l('2024', '2024'), what: l('Six months leading the internal medicine ward, Imam Hassan Hospital. Letter of thanks.', 'ستة أشهر في قيادة ردهة الباطنية، مستشفى الإمام الحسن. كتاب شكر.'), chapter: 'nursing' },
  { when: l('Aug 2024', 'آب 2024'), what: l('Joined the Health and Medical Education Authority; moved within a week to Mass Gathering Medicine', 'الالتحاق بهيئة الصحة والتعليم الطبي، والانتقال خلال أسبوع إلى طب الحشود'), chapter: 'dhmc' },
  { when: l('Late 2024', 'أواخر 2024'), what: l('First mass-gathering data system: 53,000 records', 'أول نظام لبيانات الحشود: 53,000 سجل'), chapter: 'dhmc' },
  { when: l('2025', '2025'), what: l('Disaster health platform (17 versions); unified HR system for 6,000+ employees; Warith Academy platform', 'منصة صحة الكوارث (17 إصداراً)، نظام موارد بشرية موحّد لأكثر من 6,000 موظف، ومنصة أكاديمية وارث'), chapter: 'hr' },
  { when: l('Early 2026', 'مطلع 2026'), what: l('aheadtc.org, the AHA training platform for Iraq', 'aheadtc.org، منصة تدريب AHA في العراق'), chapter: 'aha' },
  { when: l('Arbaeen 2026', 'الأربعين 2026'), what: l('Live 3D world map of patients, featured on Karbala TV', 'خريطة العالم الحية ثلاثية الأبعاد للمرضى، عُرضت على قناة كربلاء'), chapter: 'dhmc' },
  { when: l('2026', '2026'), what: l('Custom mini-ERP and recruitment platform; WHO/NHS England Action Learning Set', 'نظام ERP مصغّر ومنصة التوظيف، ومجموعة التعلّم بالممارسة WHO/NHS England'), chapter: 'hr' },
  { when: l('Nov 2026', 'تشرين الثاني 2026'), what: l('AZU60 ERP Project Manager; satisfaction system launched across 13 facilities', 'مدير مشروع AZU60، وإطلاق نظام الرضا في 13 مؤسسة'), chapter: 'azu' },
]

export const skills: { title: L; items: L[] }[] = [
  {
    title: l('Technology', 'التقنية'),
    items: [
      l('Full-stack web & app development', 'تطوير الويب والتطبيقات المتكامل'),
      l('React · Vite · TypeScript', 'React · Vite · TypeScript'),
      l('Firebase · Cloud Functions', 'Firebase · Cloud Functions'),
      l('Flutter · Vue', 'Flutter · Vue'),
      l('Google Sheets automation', 'أتمتة Google Sheets'),
      l('Dashboards & live analytics', 'لوحات المتابعة والتحليلات الحية'),
    ],
  },
  {
    title: l('Systems & HR', 'الأنظمة والموارد البشرية'),
    items: [
      l('Health informatics', 'المعلوماتية الصحية'),
      l('HR systems design', 'تصميم أنظمة الموارد البشرية'),
      l('ERP project management', 'إدارة مشاريع ERP'),
      l('Stakeholder coordination', 'تنسيق أصحاب المصلحة'),
    ],
  },
  {
    title: l('Clinical', 'السريري'),
    items: [
      l('Pediatric nursing', 'تمريض الأطفال'),
      l('Adult internal medicine', 'الباطنية للبالغين'),
      l('Ward & shift leadership', 'قيادة الردهة والوجبة'),
    ],
  },
  {
    title: l('Communication', 'التواصل'),
    items: [
      l('Training content', 'المحتوى التدريبي'),
      l('Video guide production', 'إنتاج الشروحات المرئية'),
      l('Arabic (native) · English', 'العربية (اللغة الأم) · الإنكليزية'),
    ],
  },
]

export const ui = {
  scroll: l('Scroll to climb the tree', 'مرّر لتتسلق الشجرة'),
  explore: l('Explore the tree', 'استكشف الشجرة'),
  exitExplore: l('Back to the story', 'العودة إلى القصة'),
  exploreHint: l('Drag to orbit · scroll to zoom · click a light to open it', 'اسحب للدوران · مرّر للتقريب · انقر على ضوء لفتحه'),
  impactTitle: l('Impact at a glance', 'الأثر في لمحة'),
  impactKicker: l('The numbers', 'الأرقام'),
  open: l('Open case study', 'افتح دراسة الحالة'),
  problem: l('The problem', 'المشكلة'),
  built: l('What he built', 'ما أنجزه'),
  impactL: l('Impact', 'الأثر'),
  tech: l('Built with', 'بُني باستخدام'),
  shots: l('Inside the system', 'من داخل النظام'),
  close: l('Close', 'إغلاق'),
  next: l('Next', 'التالي'),
  prev: l('Previous', 'السابق'),
  timelineTitle: l('From the ward to the whole system', 'من الردهة إلى المنظومة كلها'),
  timelineKicker: l('Timeline', 'الخط الزمني'),
  skillsTitle: l('Fluent in clinical, HR and code', 'يتقن لغة السريريات والموارد البشرية والبرمجة'),
  skillsKicker: l('Skills', 'المهارات'),
  contactKicker: l('In one line', 'في سطر واحد'),
  contactTitle: l('A nurse who builds the systems nurses need.', 'ممرض يبني الأنظمة التي يحتاجها التمريض.'),
  contactBody: l(
    'He can speak to the ward and to the engineers, and has delivered for both. Contact details are shared in person.',
    'يتحدث لغة الردهة ولغة المهندسين، وأنجز للطرفين. تُشارَك معلومات الاتصال مباشرةً.',
  ),
  systems: l('systems', 'أنظمة'),
  redacted: l('Screens show demo or redacted data.', 'الشاشات تعرض بيانات تجريبية أو محجوبة.'),
  mode2d: l('Lite mode', 'الوضع الخفيف'),
  mode3d: l('3D mode', 'الوضع ثلاثي الأبعاد'),
  top: l('Back to top', 'العودة إلى الأعلى'),
  leaves: l('Open a light on this branch', 'افتح ضوءاً على هذا الفرع'),
}
