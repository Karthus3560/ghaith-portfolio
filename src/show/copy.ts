import type { L } from '../data/content'
import type { SceneName } from './engine'

const l = (en: string, ar: string): L => ({ en, ar })

export interface Scene {
  id: SceneName
  color: string
  kick: L
  /** `*…*` marks the emphasised words, `|` a line break. */
  head: L
  body: L
  stats?: { value: string; label: L }[]
  note?: L
}

/** First-person story. Every figure comes from src/data/content.ts. */
export const scenes: Scene[] = [
  {
    id: 'ecg',
    color: '#ff5d73',
    kick: l('Ghaith Saad Jawad · Karbala, Iraq', 'غيث سعد جواد · كربلاء، العراق'),
    head: l("I'm a nurse.|I build systems *our hospitals use every day.*", 'أنا ممرض.|وأبني أنظمة *تستخدمها مستشفياتنا كل يوم.*'),
    body: l(
      'Every dot on this page stands for one record captured by the first system I built. There are 53,000 of them. Scroll, and I will show you what came next.',
      'كل نقطة في هذه الصفحة تمثّل سجلاً واحداً التقطه أول نظام بنيته. عددها 53,000 نقطة. مرّر لأريك ما جاء بعدها.',
    ),
  },
  {
    id: 'night',
    color: '#ffe7a8',
    kick: l('The ward, 3 a.m.', 'الردهة، الثالثة فجراً'),
    head: l('It started on *a night shift.*', 'بدأ كل شيء في *وجبة ليلية.*'),
    body: l(
      'I have been a pediatric ward nurse since November 2023, and I still work nights. At 3 a.m. you see exactly where things break: the paper form, the number nobody can find, the report that arrives months late. So I started fixing what I could see.',
      'أعمل ممرضاً في ردهة الأطفال منذ تشرين الثاني 2023، وما زلت في الوجبات الليلية. في الثالثة فجراً ترى بوضوح أين يتعطل العمل: الاستمارة الورقية، والرقم الذي لا يجده أحد، والتقرير الذي يصل بعد أشهر. فبدأت أُصلح ما أراه.',
    ),
    stats: [
      { value: '90.2%', label: l('BSc Nursing, second in my class', 'بكالوريوس تمريض، الثاني على دفعتي') },
      { value: '6 months', label: l('leading an internal medicine ward', 'في قيادة ردهة الباطنية') },
      { value: 'Now', label: l('shift lead, pediatric ward', 'مسؤول وجبة في ردهة الأطفال') },
    ],
  },
  {
    id: 'records',
    color: '#2ee6c8',
    kick: l('Arbaeen · mass-gathering data', 'الأربعين · بيانات الحشود'),
    head: l('The platform we had stopped at 15,000 records. *The one I built reached 53,000.*', 'المنصة السابقة كانت تتوقف عند 15,000 سجل. *والتي بنيتها بلغت 53,000.*'),
    body: l(
      'Millions walk to Karbala for Arbaeen. The platform we had topped out at 10,000–15,000 records per event, and analysis took one to three months. I built a replacement that field teams could use under pressure. Its first deployment captured 53,000 records, and the analysis became instant.',
      'الملايين يسيرون إلى كربلاء في زيارة الأربعين. المنصة السابقة كان سقفها 10,000–15,000 سجل لكل مناسبة، والتحليل يستغرق من شهر إلى ثلاثة. بنيت بديلاً تستطيع الفرق الميدانية استخدامه تحت الضغط. في أول تشغيل سجّل 53,000 سجل، وصار التحليل فورياً.',
    ),
  },
  {
    id: 'globe',
    color: '#58c7ff',
    kick: l('On air · Arbaeen 2026', 'على الهواء · الأربعين 2026'),
    head: l('Then I put *the whole world* on one screen.', 'ثم وضعت *العالم كله* على شاشة واحدة.'),
    body: l(
      'Pilgrims come from everywhere. For Arbaeen 2026 I built a live 3D world map: as each record arrived, the patient appeared on the globe by nationality. It was shown on Karbala TV. The platform behind it has been through 17 versions and now tracks camps, mobile teams, staff, patients and medication.',
      'الزائرون يأتون من كل مكان. لزيارة الأربعين 2026 بنيت خريطة حية ثلاثية الأبعاد للعالم: مع وصول كل سجل يظهر المريض على الكرة الأرضية بحسب جنسيته. وعُرضت على قناة كربلاء. المنصة التي تقف خلفها مرّت بـ 17 إصداراً، وهي اليوم تتابع المخيمات والفرق الجوالة والكوادر والمرضى والأدوية.',
    ),
    stats: [
      { value: '17', label: l('versions of the platform', 'إصداراً للمنصة') },
      { value: '41,000', label: l('records from 3 fully digital camps', 'سجل من 3 مخيمات رقمية بالكامل') },
    ],
    note: l('This globe is a reconstruction with illustrative routes. It shows no patient data.', 'هذه الكرة إعادة تمثيل بمسارات توضيحية، ولا تعرض بيانات مرضى.'),
  },
  {
    id: 'hr',
    color: '#5eead4',
    kick: l('Central HR', 'الموارد البشرية المركزية'),
    head: l('Nobody could answer one simple question *about our own workforce.*', 'لم يكن أحد يستطيع الإجابة عن سؤال بسيط *عن قوانا العاملة.*'),
    body: l(
      'Every facility kept its own files. I brought more than 6,000 employees into one live system, first in Google Sheets, then as a full web system that HR still uses every day. Then I built what was missing around it: recruitment, attendance, an anonymous line to HR and a staff satisfaction survey.',
      'كل مؤسسة كانت تحتفظ بملفاتها. جمعت أكثر من 6,000 موظف في نظام حي واحد، أولاً في Google Sheets ثم كنظام ويب متكامل ما زالت الموارد البشرية تستخدمه يومياً. ثم بنيت ما كان ناقصاً حوله: التوظيف، والدوام، وخطاً مجهول الهوية إلى الموارد البشرية، واستبيان رضا الموظفين.',
    ),
    stats: [
      { value: '6,000+', label: l('employees in one system', 'موظف في نظام واحد') },
      { value: '2,821', label: l('candidates in about four months', 'متقدم خلال أربعة أشهر تقريباً') },
      { value: '300+', label: l('anonymous messages to HR', 'رسالة مجهولة إلى الموارد البشرية') },
      { value: '13', label: l('facilities surveyed', 'مؤسسة مشمولة بالاستبيان') },
    ],
  },
  {
    id: 'seal',
    color: '#ffd166',
    kick: l('Warith Academy · AHA training', 'أكاديمية وارث · تدريب AHA'),
    head: l('A certificate should be *hard to fake.*', 'الشهادة يجب أن تكون *عصيّة على التزوير.*'),
    body: l(
      'For Warith Academy I built the whole training operation: the catalogue, registration, lectures you cannot skip, exams that detect cheating, and certificates anyone can verify by QR code. After that I built the registration platform for our AHA training centre, for BLS, ACLS and PALS courses in Iraq.',
      'لأكاديمية وارث بنيت منظومة التدريب كاملة: الدليل، والتسجيل، ومحاضرات لا يمكن تخطيها، وامتحانات تكشف الغش، وشهادات يتحقق منها أي شخص برمز QR. وبعدها بنيت منصة التسجيل لمركز تدريب AHA لدورات BLS و ACLS و PALS في العراق.',
    ),
    stats: [
      { value: '200+', label: l('courses', 'دورة') },
      { value: '1,000+', label: l('trainees', 'متدرب') },
      { value: '2,000+', label: l('certificates issued', 'شهادة صادرة') },
    ],
  },
  {
    id: 'bridge',
    color: '#6fb1ff',
    kick: l('Now · AZU60 ERP', 'الآن · نظام AZU60'),
    head: l('Today, *I am the bridge.*', 'واليوم، *أنا الجسر.*'),
    body: l(
      'Since November 2026 I have managed the rollout of AZU60, the official ERP for our hospitals. I have worked on the ward, in HR and in code, so I translate between all three. To do it properly I mapped the entire system, and I am producing a 14-part video guide series for staff.',
      'منذ تشرين الثاني 2026 أدير مشروع تطبيق AZU60، النظام الرسمي لمستشفياتنا. عملت في الردهة وفي الموارد البشرية وفي البرمجة، فأترجم بين الثلاثة. ولأقوم بذلك كما ينبغي وثّقت النظام كله، وأُنتج سلسلة شروحات مرئية من 14 حلقة للموظفين.',
    ),
    stats: [
      { value: '1,006', label: l('screens mapped', 'شاشة موثّقة') },
      { value: '7,184', label: l('permission keys', 'مفتاح صلاحية') },
      { value: '14', label: l('video guides', 'شرحاً مرئياً') },
    ],
  },
  {
    id: 'portrait',
    color: '#ffb199',
    kick: l('In one line', 'في سطر واحد'),
    head: l("I'm a nurse who builds *the systems nurses need.*", 'أنا ممرض يبني *الأنظمة التي يحتاجها التمريض.*'),
    body: l(
      'I can speak to the ward and to the engineers, and I have delivered for both. If something in our hospitals is slow, manual or invisible, I would like to hear about it.',
      'أتحدث لغة الردهة ولغة المهندسين، وأنجزت للطرفين. إن كان في مستشفياتنا شيء بطيء أو يدوي أو غير مرئي، فيسعدني أن أسمع عنه.',
    ),
    note: l('This portrait is drawn with the same dots.', 'هذه الصورة مرسومة بالنقاط نفسها.'),
  },
]

export const t = {
  scroll: l('Scroll', 'مرّر'),
  counter: l('records captured in the first deployment', 'سجل في أول تشغيل'),
  ceiling: l('15,000: where the previous platform topped out', '15,000: هنا كان سقف المنصة السابقة'),
  clinical: l('Clinical', 'السريري'),
  hr: l('HR', 'الموارد البشرية'),
  it: l('IT', 'تقنية المعلومات'),
  proofHead: l("Don't take *my word* for it.", 'لا تكتفِ *بكلامي.*'),
  proofBody: l(
    'These are real screens from the systems. Names and private data were removed or replaced with demo data.',
    'هذه لقطات حقيقية من الأنظمة. الأسماء والبيانات الخاصة حُذفت أو استُبدلت ببيانات تجريبية.',
  ),
  allHead: l('Everything so far, *in one place.*', 'كل ما أنجزته حتى الآن، *في مكان واحد.*'),
  allBody: l('entries: systems, roles and qualifications.', 'عملاً: أنظمة وأدوار ومؤهلات.'),
  cv: l('CV edition', 'نسخة السيرة'),
  readCv: l('Read the CV edition', 'اقرأ نسخة السيرة'),
  tree: l('See it as a tree', 'شاهدها كشجرة'),
  game: l('Drive it as a game', 'قُدها كلعبة'),
  top: l('Back to the start', 'العودة إلى البداية'),
  drag: l('Drag to see more', 'اسحب لرؤية المزيد'),
}
