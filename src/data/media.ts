import type { L } from './content'
import { u } from '../base'

export interface Shot {
  type: 'img' | 'video'
  src: string
  poster?: string
  portrait?: boolean
  caption: L
}
const l = (en: string, ar: string): L => ({ en, ar })
const img = (name: string, en: string, ar: string, portrait = false): Shot => ({ type: 'img', src: u(`shots/${name}.webp`), caption: l(en, ar), portrait })

/** Screens per project id. Every file here is listed in capture-log.md with what was redacted. */
export const media: Record<string, Shot[]> = {
  platform: [
    { type: 'video', src: u('media/dhmc-arbaeen-film.mp4'), poster: u('shots/dhmc-film-cover.webp'), portrait: true, caption: l('Arbaeen 2026 season film, built on the real deployment map', 'فيلم موسم الأربعين 2026 مبني على خريطة الانتشار الحقيقية') },
    img('dhmc-film-cover', 'A frame from the film: field teams on a live simulation of the deployment', 'لقطة من الفيلم: الفرق الميدانية على محاكاة حية للانتشار', true),
  ],
  volunteers: [
    img('vol-fields', 'Volunteers choose a field: nursing, doctors or pharmacy', 'المتطوع يختار مساره: تمريض، أطباء أو صيدلة'),
    img('vol-lesson', 'Lesson page: watch the full video to unlock the quiz', 'صفحة الدرس: شاهد الفيديو كاملاً ليُفتح الاختبار'),
    img('vol-admin-courses', 'Admin course builder', 'منشئ الدورات في لوحة الإدارة'),
  ],
  attendance: [img('attendance-guide', 'The temporary deduction system, explained on one page with worked examples', 'نظام الاستقطاع المؤقت مشروحاً في صفحة واحدة مع أمثلة')],
  directline: [img('directline-admin', 'Admin side: case statuses, tracking columns, exports and handoffs (demo data)', 'جانب الإدارة: حالات القضايا وأعمدة المتابعة والتصدير والإحالات (بيانات تجريبية)')],
  satisfaction: [
    img('sat-dashboard', 'Results dashboard for a test facility: overall satisfaction and scores per pillar', 'لوحة النتائج لمؤسسة تجريبية: الرضا العام والدرجات حسب المحور'),
    img('sat-phone-intro', 'The survey on a phone: anonymous, about five minutes', 'الاستبيان على الهاتف: مجهول ويستغرق نحو خمس دقائق', true),
    img('sat-phone-questions', 'Statements grouped by pillar', 'عبارات مصنّفة حسب المحور', true),
    img('sat-poster', 'From the Arabic how-to guide for facility HR leads', 'من الدليل العربي لمسؤولي الموارد البشرية في المؤسسات'),
  ],
  learn: [
    { type: 'video', src: u('media/learner-guide.mp4'), poster: u('shots/learn-poster.webp'), portrait: true, caption: l('One-minute learner guide (fictional learner)', 'دليل المتعلّم في دقيقة (متعلّم افتراضي)') },
    img('learn-quiz', 'After the video, a short quiz', 'بعد الفيديو اختبار قصير', true),
    img('learn-calendar', 'Save the dates, then start learning', 'احفظ مواعيدك ثم ابدأ التعلّم', true),
  ],
  finance: [
    img('finance-poster', 'Cost study: price every course from its real cost', 'دراسة الكلفة: سعّر كل دورة من كلفتها الحقيقية'),
    img('finance-pricing', 'Pricing by group with break-even learners, planned versus actual (test course)', 'التسعير حسب الفئة مع نقطة التعادل والمخطط مقابل الفعلي (دورة تجريبية)'),
  ],
  azuguides: [img('azu-campaigns', 'From the walkthrough: training campaigns in the employee app', 'من الشرح: حملات التدريب في تطبيق الموظف', true)],
  iconstudio: [img('iconstudio-main', 'Main window: folders on the left, icon library on the right', 'النافذة الرئيسية: المجلدات يساراً ومكتبة الأيقونات يميناً')],
  airbeam: [img('airbeam-logo', 'App icon', 'أيقونة التطبيق', true)],
}

export const portrait: string | null = u('shots/portrait.webp')
