export type ObjectKind = 'apartment' | 'house';

type ServiceEstimate = {
  rate: number;
  minimum: number;
  schedule: 'planning' | 'design';
};

export type Service = {
  slug: string;
  title: string;
  lead: string;
  audience: string;
  participation: string;
  includes: readonly string[];
  result: string;
  term: string;
  price: string;
  estimate?: ServiceEstimate;
};

export const services = [
  {
    slug:'planning',
    title:'Планировочное решение',
    lead:'Когда важно найти точную логику дома до отделки.',
    audience:'Для пространства, где сначала нужно проверить сценарии жизни, расстановку и связи между комнатами.',
    participation:'Точечный этап: студия собирает варианты и фиксирует выбранную основу.',
    includes:['обмерный план','2–3 сценария планировки','план мебели и света'],
    result:'Понятная схема жизни и основа для следующего этапа.',
    term:'3–5 недель',
    price:'от 90 000 ₽',
    estimate:{ rate:1100, minimum:90000, schedule:'planning' },
  },
  {
    slug:'design',
    title:'Полный дизайн-проект',
    lead:'Для ремонта, где нужно собрать пространство до последнего стыка.',
    audience:'Для квартиры или дома, которым нужны единая концепция, визуализации и рабочие решения.',
    participation:'Полный цикл проектирования с последовательными согласованиями ключевых решений.',
    includes:['планировка и визуализации','рабочая документация','ведомости материалов'],
    result:'Полный комплект для реализации интерьера.',
    term:'14–20 недель',
    price:'от 320 000 ₽',
    estimate:{ rate:4200, minimum:320000, schedule:'design' },
  },
  {
    slug:'supply',
    title:'Комплектация',
    lead:'Для спокойного выбора материалов, мебели и света.',
    audience:'Для проекта, в котором нужно свести выбранные позиции, цены, наличие и возможные замены.',
    participation:'Сопровождение закупок по согласованному составу проекта.',
    includes:['подбор позиций','смета и спецификации','согласование замен'],
    result:'Собранный список решений в рамках проекта.',
    term:'в течение реализации',
    price:'по составу проекта',
  },
  {
    slug:'supervision',
    title:'Авторский надзор',
    lead:'Для проекта, который нужно бережно провести через стройку.',
    audience:'Для реализации, где строителям нужны регулярные ответы и сверка с проектными решениями.',
    participation:'Студия подключается к вопросам на объекте на согласованный период ремонта.',
    includes:['выезды на объект','ответы строителям','проверка соответствия'],
    result:'Решения на объекте без потери исходной идеи.',
    term:'на период ремонта',
    price:'от 45 000 ₽/мес.',
  },
  {
    slug:'consultation',
    title:'Консультация и дистанционный проект',
    lead:'Для одного сложного вопроса или работы из другого города.',
    audience:'Для локальной задачи, проверки выбранного направления или проекта вне Санкт-Петербурга.',
    participation:'Одна встреча или отдельный дистанционный этап с зафиксированными итогами.',
    includes:['разбор плана','рекомендации по приоритетам','запись итогов встречи'],
    result:'Направление и следующие шаги для вашего пространства.',
    term:'1–2 недели',
    price:'от 12 000 ₽',
  },
] as const satisfies readonly Service[];

export const serviceDeliverables = [
  { number:'01', title:'Пространственная основа', text:'Планировка, расстановка и сценарии движения, на которых держатся последующие решения.' },
  { number:'02', title:'Материалы для работы', text:'В зависимости от услуги — визуализации, чертежи, ведомости или зафиксированные рекомендации.' },
  { number:'03', title:'Понятная граница участия', text:'До начала работы согласуем состав, последовательность этапов и точки, где требуется ваше решение.' },
] as const;

export const serviceEvidenceLinks = [
  { projectSlug:'svet-i-dub', source:'plan', label:'Планировка', title:'Один план — один объём', text:'В «Свете и дубе» план и вид сверху построены в одной геометрии: можно проверить расположение окон, хранения, стола и проходов.' },
  { projectSlug:'dom-u-sada', source:'evidence', evidenceIndex:0, label:'Полный проект', title:'Решения работают вместе', text:'«Дом у сада» показывает, как ось помещения, хранение и связь с садом складываются в единую систему пространства.' },
  { projectSlug:'tishina-goroda', source:'evidence', evidenceIndex:0, label:'Детализация', title:'От общего вида к месту у окна', text:'В «Тишине города» общий замысел раскрывается через хранение, чтение у окна и материальную палитру.' },
] as const;

export function parseProjectArea(input:string){
  const normalized = input.trim().replace(/\s+/g,'').replace(',','.');
  if (!/^\d+(?:\.\d+)?$/.test(normalized)) return null;
  const area = Number(normalized);
  return Number.isFinite(area) && area > 0 ? area : null;
}

export function calculateServiceEstimate(serviceSlug:string, area:number, kind:ObjectKind){
  const service = services.find(item => item.slug === serviceSlug);
  if (!service || !('estimate' in service) || !service.estimate) return null;
  const multiplier = kind === 'house' ? 1.14 : 1;
  const base = Math.max(service.estimate.minimum, area * service.estimate.rate * multiplier);
  const round = (amount:number) => Math.round(amount / 5000) * 5000;
  const low = round(base * .94);
  const high = round(base * 1.15);
  const weeks = service.estimate.schedule === 'design'
    ? [Math.max(12,Math.round(area / 10 + 7)),Math.max(16,Math.round(area / 8 + 9))]
    : [Math.max(3,Math.round(area / 30)),Math.max(5,Math.round(area / 20 + 1))];
  return { low, high, weeks };
}

const rubles = new Intl.NumberFormat('ru-RU',{ maximumFractionDigits:0 });

export function formatEstimateRange(low:number,high:number){
  return `${rubles.format(low)}–${rubles.format(high)} ₽`;
}
