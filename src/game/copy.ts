import type { L } from '../data/content'

const l = (en: string, ar: string): L => ({ en, ar })

/** What I say when you drive into each district. First person; figures from src/data/content.ts. */
export const intro: Record<string, L> = {
  nursing: l('This is where I work. Pediatric ward, night shift, since November 2023.', 'هنا أعمل. ردهة الأطفال، الوجبة الليلية، منذ تشرين الثاني 2023.'),
  dhmc: l('The Arbaeen field camp. My first system captured 53,000 records here.', 'مخيم الأربعين الميداني. هنا سجّل أول نظام بنيته 53,000 سجل.'),
  hr: l('Central HR. I brought more than 6,000 employees into one live system.', 'الموارد البشرية المركزية. جمعت أكثر من 6,000 موظف في نظام حي واحد.'),
  academy: l('Warith Academy. I built its training platform: 200+ courses and 2,000+ certificates.', 'أكاديمية وارث. بنيت منصتها التدريبية: أكثر من 200 دورة و2,000 شهادة.'),
  aha: l('The AHA training centre. I built its registration platform for BLS, ACLS and PALS.', 'مركز تدريب AHA. بنيت منصة التسجيل لدورات BLS و ACLS و PALS.'),
  azu: l('AZU60. I manage the ERP rollout and connect the ward, HR and IT.', 'AZU60. أدير مشروع تطبيق النظام وأربط بين الردهة والموارد البشرية وتقنية المعلومات.'),
  lab: l('My workshop. Side projects I build after hours.', 'ورشتي. مشاريع جانبية أبنيها خارج أوقات العمل.'),
}

export const t = {
  edition: l('Game edition', 'نسخة اللعبة'),
  boardLine: l('Welcome to my night round', 'أهلاً بك في جولتي الليلية'),
  title: l('Take the *night round* with me.', 'رافقني في *الجولة الليلية.*'),
  lead: l(
    "I'm Ghaith, a nurse who builds systems for our hospitals. Drive around the island and find the 31 things I have built, led or earned. Pick up the 53 lights on the way: each one stands for 1,000 records from my first system.",
    'أنا غيث، ممرض يبني أنظمة لمستشفياتنا. تجوّل بالسيارة في الجزيرة واعثر على 31 عملاً بنيته أو قدته أو نلته. والتقط 53 ضوءاً في طريقك: كل ضوء يمثّل 1,000 سجل من أول نظام بنيته.',
  ),
  start: l('Start driving', 'ابدأ القيادة'),
  kDrive: l('Drive', 'القيادة'),
  kBoost: l('Boost', 'تسارع'),
  kHonk: l('Horn', 'البوق'),
  kOpen: l('Open', 'فتح'),
  kReset: l('Back to the plaza', 'العودة إلى الساحة'),
  touch: l('Drag the round pad to drive. Tap a glowing ring to open it.', 'اسحب اللوحة الدائرية للقيادة. انقر على الحلقة المضيئة لفتحها.'),
  plaza: l('Plaza', 'الساحة'),
  found: l('found', 'عمل'),
  records: l('records', 'سجل'),
  open: l('Open', 'افتح'),
  close: l('Close', 'إغلاق'),
  start2: l('The starting point', 'نقطة البداية'),
  results: l('In numbers', 'بالأرقام'),
  screens: l('From inside the system', 'من داخل النظام'),
  redacted: l('Screens show demo or redacted data.', 'اللقطات تعرض بيانات تجريبية أو محجوبة.'),
  full: l('Full case study in the CV edition', 'دراسة الحالة كاملة في نسخة السيرة'),
  sound: l('Sound', 'الصوت'),
  cv: l('CV edition', 'نسخة السيرة'),
  story: l('Story edition', 'النسخة القصصية'),
  doneTitle: l('That is everything.', 'هذا كل شيء.'),
  doneBody: l('You found all 31 and collected all 53,000 records. Thank you for doing the round with me.', 'عثرت على الأعمال الـ31 كلها وجمعت 53,000 سجل. شكراً لمرافقتي في الجولة.'),
  keep: l('Keep driving', 'واصل القيادة'),
  noGl: l('This edition needs 3D graphics, which this device does not offer. The CV edition has everything in it.', 'هذه النسخة تحتاج إلى رسوم ثلاثية الأبعاد غير متوفرة على هذا الجهاز. نسخة السيرة تحتوي على كل شيء.'),
}
