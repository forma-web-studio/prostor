import type { ImageMetadata } from 'astro';
import svetCover from '../assets/images/projects/svet-i-dub-cover.png';
import svetDetail from '../assets/images/projects/svet-i-dub-detail-1.png';
import domCover from '../assets/images/projects/dom-u-sada-detail-1.png';
import domDetail from '../assets/images/projects/dom-u-sada-detail-2.png';
import tishinaCover from '../assets/images/projects/tishina-goroda-detail-1.png';
import tishinaDetail from '../assets/images/projects/tishina-goroda-detail-2.png';
import liniyaCover from '../assets/images/projects/liniya-lesa-detail-1.png';
import liniyaDetail from '../assets/images/projects/liniya-lesa-detail-2.png';

export type ProjectDecision = { title: string; text: string };
export type ProjectEvidence = {
  label: string;
  title: string;
  text: string;
  image: { src: ImageMetadata; alt: string; caption: string };
  hotspots?: Array<{ x: number; y: number; title: string; text: string }>;
};
export type ProjectPlanDecision = {
  id: 'table' | 'storage';
  label: string;
  title: string;
  text: string;
};
export type ProjectPlanToSpace = {
  title: string;
  intro: string;
  caption: string;
  decisions: ProjectPlanDecision[];
};
export type ProjectCaseStudy = {
  variant: 'standard' | 'flagship';
  intro: string;
  location: string;
  status: 'Интерьерная концепция';
  year: string;
  scope: string[];
  duration: string;
  brief: string;
  constraints: string[];
  decisions: ProjectDecision[];
  evidence: ProjectEvidence[];
  planToSpace?: ProjectPlanToSpace;
  nextProjectSlug: string;
};

export type Project = {
  slug: string;
  title: string;
  order: number;
  featured: boolean;
  flagship: boolean;
  kind: 'apartment' | 'house';
  area: number;
  style: string;
  pricePerSqm: number;
  estimatedDesignFee: number;
  cover: ImageMetadata;
  coverAlt: string;
  coverPosition?: string;
  coverCaption: string;
  summary: string;
  caseStudy: ProjectCaseStudy;
  evidence: {
    context: string;
    constraint: string;
    move: string;
    effect: string;
  };
  gallery: { src: ImageMetadata; alt: string; caption: string; note: string };
  palette: Array<{ hex: string; label: string }>;
};

export const projects: Project[] = [
  {
    slug: 'svet-i-dub', title: 'Свет и дуб', order: 1, featured: true, flagship: true, kind: 'apartment', area: 86,
    style: 'Тёплый минимализм', pricePerSqm: 4200, estimatedDesignFee: 360000,
    cover: svetCover,
    coverAlt: 'Светлая гостиная-столовая с дубовым столом у высокого окна и встроенным хранением',
    coverCaption: 'Проект интерьера «Свет и дуб»',
    summary: 'Квартира для пары: обедать вместе и работать дома, не занимая всю гостиную.',
    caseStudy: {
      variant: 'standard', intro: 'Светлая квартира, где один стол поддерживает работу днём и общие ужины вечером.',
      location: 'Санкт-Петербург · Петроградская сторона', status: 'Интерьерная концепция', year: '2025',
      scope: ['Планировочная концепция', 'Свет', 'Встроенное хранение'], duration: '14–16 недель',
      brief: 'Сохранить простор общей комнаты и найти постоянное место для работы без отдельного кабинета.',
      constraints: ['Рабочая зона не должна доминировать вечером.', 'Хранение нужно собрать без дробления стен отдельными шкафами.'],
      decisions: [
        { title:'Стол у окна', text:'Обеденное место становится удобной рабочей точкой с естественным светом.' },
        { title:'Единая плоскость хранения', text:'Закрытые дубовые фасады убирают бытовые вещи из общего пространства.' },
      ],
      evidence: [],
      planToSpace: {
        title: 'Как дневной кабинет снова становится столовой',
        intro: 'Схема сценария показывает взаимное положение окна, общего стола, прохода и закрытого хранения. Это объяснение замысла без технических размеров и не рабочий чертёж.',
        caption: 'Схема сценария и визуальная концепция одной общей комнаты.',
        decisions: [
          { id:'table', label:'Стол у окна', title:'Один стол поддерживает два режима', text:'Днём естественный свет делает стол удобным рабочим местом. Вечером ноутбук убирается, и та же точка возвращается к общему ужину.' },
          { id:'storage', label:'Закрытое хранение', title:'Рабочий фон исчезает вместе с техникой', text:'Единая линия дубовых фасадов собирает документы, зарядки и бытовые вещи, поэтому после работы общая комната не выглядит кабинетом.' },
        ],
      },
      nextProjectSlug:'dom-u-sada',
    },
    evidence: {
      context: 'Пара работает из дома и каждый день собирается за общим столом.',
      constraint: 'Рабочее место не должно превращать гостиную в постоянный кабинет.',
      move: 'Стол перенесён к окну, а техника и бытовые вещи собраны за закрытыми дубовыми фасадами.',
      effect: 'Днём здесь достаточно естественного света для работы; вечером та же зона снова становится столовой без видимого рабочего фона.',
    },
    gallery: { src: svetDetail, alt: 'Дубовый стол у окна и закрытые фасады встроенного хранения', caption: 'Стол и хранение объединены одним тоном дерева.', note:'Материалы связывают рабочий и обеденный сценарии без отдельной декоративной зоны.' },
    palette: [{ hex: '#E8E0D2', label: 'молочный' }, { hex: '#B67D51', label: 'дуб' }, { hex: '#C6C0B4', label: 'лён' }, { hex: '#535547', label: 'графит' }],
  },
  {
    slug: 'dom-u-sada', title: 'Дом у сада', order: 2, featured: false, flagship: false, kind: 'house', area: 164,
    style: 'Современная классика', pricePerSqm: 4600, estimatedDesignFee: 760000,
    cover: domCover,
    coverAlt: 'Гостиная дома с низким льняным диваном, камином и видом на сад',
    coverCaption: 'Проект интерьера «Дом у сада»',
    summary: 'Дом для семьи, где общая комната продолжается в сад.',
    caseStudy: {
      variant: 'flagship', intro: 'Загородный дом, где общая комната продолжает сад и собирает повседневные маршруты семьи.',
      location: 'Санкт-Петербург · Курортный район', status: 'Интерьерная концепция', year: '2024',
      scope: ['Планировочная концепция', 'Визуальная концепция', 'Материалы и предметы'], duration: '18–20 недель',
      brief: 'Собрать гостиную, столовую и кухню в одно спокойное пространство, сохранив сад главным ориентиром из каждой повседневной точки.',
      constraints: ['Панорамное остекление нельзя перекрывать высокой мебелью.', 'Три функции общей комнаты должны ощущаться связанными, но не сливаться в один пустой зал.', 'Светлые природные материалы должны выдерживать ежедневный семейный ритм.'],
      decisions: [
        { title:'Ось на сад', text:'Проход от кухни к гостиной оставлен свободным, а основные места ориентированы к остеклению.' },
        { title:'Низкий центр комнаты', text:'Диван и стол не пересекают линию взгляда и сохраняют глубину общей комнаты.' },
        { title:'Один материальный ритм', text:'Дуб, лён и светлый камень повторяются в трёх зонах и собирают их без декоративного шума.' },
      ],
      evidence: [
        { label:'Связь с садом', title:'Пейзаж остаётся частью комнаты', text:'Свободная ось и низкая посадка сохраняют вид на зелень из гостиной и при движении к столовой.', image:{ src:domCover, alt:'Гостиная дома с низкой мебелью и широким видом в сад', caption:'Линия взгляда проходит над мягкой группой к панорамному остеклению.' }, hotspots:[{ x:25, y:38, title:'Свободная ось', text:'В проходе к окнам нет высокой мебели и визуальных перегородок.' }, { x:69, y:70, title:'Низкая посадка', text:'Высота дивана сохраняет нижнюю часть сада в поле зрения.' }] },
        { label:'Ежедневный маршрут', title:'Столовая стоит на границе дома и сада', text:'Стол получает естественный свет и остаётся связан с кухней, не перегораживая путь через общую комнату.', image:{ src:domDetail, alt:'Дубовый стол у окна с видом на сад и льняным текстилем', caption:'Стол, окно и проход собраны в один ежедневный маршрут.' } },
      ], nextProjectSlug:'tishina-goroda',
    },
    evidence: {
      context: 'Семья проводит большую часть дня в общей комнате, обращённой к саду.',
      constraint: 'Высокая мебель могла бы перекрыть длинную перспективу и отделить столовую от окон.',
      move: 'Низкая посадка и свободная ось между диваном, столом и остеклением сохраняют непрерывный взгляд наружу.',
      effect: 'Сад остаётся виден из главных повседневных точек: за столом, на диване и при движении через комнату.',
    },
    gallery: { src: domDetail, alt: 'Деревянный стол и льняной текстиль у окна с видом на сад', caption: 'Дерево и лён смягчают каменные поверхности.', note:'Повтор материалов связывает столовую с мягкой зоной и светлым каменным основанием.' },
    palette: [{ hex: '#D9D0C0', label: 'известняк' }, { hex: '#9C6D42', label: 'дуб' }, { hex: '#EEE8DF', label: 'лён' }, { hex: '#67705A', label: 'садовый зелёный' }],
  },
  {
    slug: 'tishina-goroda', title: 'Тишина города', order: 3, featured: true, flagship: false, kind: 'apartment', area: 62,
    style: 'Японский минимализм', pricePerSqm: 4400, estimatedDesignFee: 285000,
    cover: tishinaCover,
    coverAlt: 'Гостиная городской квартиры с мягким диваном, встроенным хранением и видом на город',
    coverCaption: 'Проект интерьера «Тишина города»',
    summary: 'Квартира в городе, где вечером можно убрать всё лишнее и остаться у окна.',
    caseStudy: {
      variant: 'standard', intro: 'Небольшая городская квартира с визуально спокойной общей комнатой и отдельным местом у окна.',
      location: 'Санкт-Петербург · Васильевский остров', status: 'Интерьерная концепция', year: '2025',
      scope: ['Планировочная концепция', 'Материалы', 'Свет'], duration: '14–16 недель',
      brief: 'Убрать повседневный визуальный шум и сохранить в общей комнате место для спокойного вечера.',
      constraints: ['Открытое хранение перегружает компактную комнату.', 'Отдельная перегородка для отдыха сократила бы полезную площадь.'],
      decisions: [
        { title:'Закрытое нижнее хранение', text:'Повседневные вещи уходят из поля зрения, а верх стены остаётся свободным.' },
        { title:'Место у окна', text:'Кресло формирует отдельный сценарий отдыха без перегородки.' },
      ], evidence: [], nextProjectSlug:'liniya-lesa',
    },
    evidence: {
      context: 'Небольшая городская квартира должна поддерживать и активный день, и спокойный вечер.',
      constraint: 'Открытое хранение добавляло бы визуальный шум, а отдельная зона отдыха дробила бы комнату.',
      move: 'Хранение собрано в закрытом нижнем объёме, а кресло поставлено у окна без дополнительной перегородки.',
      effect: 'Повседневные вещи уходят из поля зрения, при этом у окна появляется отдельное место для чтения и паузы.',
    },
    gallery: { src: tishinaDetail, alt: 'Кресло у окна рядом со спокойным встроенным хранением', caption: 'Место для чтения отделено от остальной комнаты.', note:'Один предмет и направленный свет создают паузу без дополнительной стены.' },
    palette: [{ hex: '#C9C4B9', label: 'тёплый серый' }, { hex: '#786F63', label: 'дымчатый' }, { hex: '#E6E1D7', label: 'шерсть' }, { hex: '#31322E', label: 'графит' }],
  },
  {
    slug: 'liniya-lesa', title: 'Линия леса', order: 4, featured: true, flagship: false, kind: 'house', area: 128,
    style: 'Природный минимализм', pricePerSqm: 4300, estimatedDesignFee: 560000,
    cover: liniyaCover,
    coverAlt: 'Гостиная дома с оливковым диваном и панорамным видом на сосны',
    coverCaption: 'Проект интерьера «Линия леса»',
    summary: 'Дом в лесу, в котором общий свет и вид на сосны задают ритм дня.',
    caseStudy: {
      variant: 'standard', intro: 'Дом в лесу, где посадка и проходы подчинены длинному виду на сосны.',
      location: 'Ленинградская область · Выборгское направление', status: 'Интерьерная концепция', year: '2026',
      scope: ['Планировочная концепция', 'Хранение', 'Материалы'], duration: '18–20 недель',
      brief: 'Сохранить открытый вид из общей комнаты и сделать путь к террасе частью повседневного сценария.',
      constraints: ['Массивная мебель перекрывает нижнюю часть панорамы.', 'Проход к террасе должен оставаться свободным.'],
      decisions: [
        { title:'Низкая мягкая группа', text:'Посадка остаётся ниже линии окна и не спорит с пейзажем.' },
        { title:'Скамья вдоль окна', text:'Лёгкий предмет добавляет место для паузы, не сужая маршрут.' },
      ], evidence: [], nextProjectSlug:'svet-i-dub',
    },
    evidence: {
      context: 'Загородный дом раскрывается к соснам, а семья перемещается между общей комнатой и террасой.',
      constraint: 'Массивная мебель у остекления перекрыла бы нижнюю часть вида и сузила проход.',
      move: 'Основная посадка опущена ниже линии окна, вдоль него оставлена лёгкая деревянная скамья.',
      effect: 'Пейзаж читается сидя и в движении, а путь к террасе остаётся свободным.',
    },
    gallery: { src: liniyaDetail, alt: 'Деревянная скамья у большого окна с видом на сосновый лес', caption: 'Камень, дерево и приглушённый зелёный собирают вид в интерьере.', note:'Приглушённая палитра удерживает внимание на естественном свете и соснах.' },
    palette: [{ hex: '#E1DDD2', label: 'светлый камень' }, { hex: '#855D3D', label: 'тёмный дуб' }, { hex: '#777B5B', label: 'оливковый' }, { hex: '#34372E', label: 'графит' }],
  },
];

export const featuredProjects = projects.filter(({ featured }) => featured).sort((a, b) => a.order - b.order);
