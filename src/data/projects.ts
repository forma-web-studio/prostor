import type { ImageMetadata } from 'astro';
import svetCover from '../assets/images/projects/svet-i-dub-cover.png';
import svetDetail from '../assets/images/projects/svet-i-dub-detail-1.png';
import svetTopDown from '../assets/images/projects/svet-i-dub-top-down.png';
import svetPlan from '../assets/images/projects/svet-i-dub-plan.svg?url';
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
  image: {
    src: ImageMetadata;
    alt: string;
    caption: string;
    framing?: 'landscape' | 'portrait' | 'macro';
    position?: string;
  };
  hotspots?: Array<{ x: number; y: number; title: string; text: string }>;
};
export type ProjectCaseSection = 'overview' | 'decisions' | 'evidence' | 'materials' | 'facts';
export type ProjectFlagshipPresentation = {
  hero:
    | { type: 'panorama' }
    | { type: 'image'; src: ImageMetadata; alt: string; caption: string; position?: string };
  sectionOrder: ProjectCaseSection[];
  overviewTitle: string;
  decisionsLabel: string;
  decisionsTitle: string;
  evidenceLabel: string;
  evidenceTitle: string;
  materialsTitle: string;
  materialsText: string;
};
export type ProjectPlanToSpace = {
  title: string;
  intro: string;
  caption: string;
  image: ImageMetadata;
  imageAlt: string;
  plan: string;
  planAlt: string;
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
  presentation?: ProjectFlagshipPresentation;
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
        title: 'План и пространство',
        intro: 'Один вид сверху: сначала планировка, затем объём, свет и материалы.',
        caption: 'Окна, проём, стол, хранение и мягкая зона остаются на своих местах.',
        image: svetTopDown,
        imageAlt: 'Вид сверху на всю общую комнату с окнами слева, столом на шесть мест, встроенным хранением и мягкой зоной',
        plan: svetPlan,
        planAlt: 'План той же общей комнаты в совпадающем масштабе и расположении мебели',
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
      ],
      presentation: {
        hero: { type:'panorama' },
        sectionOrder: ['overview', 'decisions', 'evidence', 'materials', 'facts'],
        overviewTitle: 'Дом вокруг ежедневного вида на сад',
        decisionsLabel: 'Три ключевых решения',
        decisionsTitle: 'От планировки к ощущению пространства',
        evidenceLabel: 'Пространство в работе',
        evidenceTitle: 'Как решения читаются в общей комнате',
        materialsTitle: 'Спокойная палитра, связанная с садом',
        materialsText: 'Светлое основание удерживает дневной свет, дуб добавляет тепло, а приглушённый зелёный возвращает в интерьер оттенок сада.',
      },
      nextProjectSlug:'tishina-goroda',
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
    slug: 'tishina-goroda', title: 'Тишина города', order: 3, featured: true, flagship: true, kind: 'apartment', area: 62,
    style: 'Японский минимализм', pricePerSqm: 4400, estimatedDesignFee: 285000,
    cover: tishinaCover,
    coverAlt: 'Гостиная городской квартиры с мягким диваном, встроенным хранением и видом на город',
    coverCaption: 'Проект интерьера «Тишина города»',
    summary: 'Квартира в городе, где вечером можно убрать всё лишнее и остаться у окна.',
    caseStudy: {
      variant: 'flagship', intro: 'Небольшая городская квартира, где закрытое хранение освобождает комнату, а место у окна остаётся открытым свету.',
      location: 'Санкт-Петербург · Васильевский остров', status: 'Интерьерная концепция', year: '2025',
      scope: ['Планировочная концепция', 'Материалы', 'Свет'], duration: '14–16 недель',
      brief: 'Убрать повседневный визуальный шум и сохранить в общей комнате место для спокойного вечера.',
      constraints: ['Открытое хранение перегружает компактную комнату.', 'Отдельная перегородка для отдыха сократила бы полезную площадь.'],
      decisions: [
        { title:'Закрытый низ, открытый ритм', text:'Основной объём хранения закрыт, а несколько ниш оставлены для книг и предметов, которыми пользуются каждый день.' },
        { title:'Кресло вместо перегородки', text:'Место для чтения обозначено светом и отдельной посадкой, поэтому комната сохраняет всю полезную ширину.' },
        { title:'Светлое поле у окна', text:'Тёплые серые поверхности и спокойный текстиль отражают дневной свет, не превращая комнату в белый фон.' },
      ],
      evidence: [
        {
          label:'Логика хранения',
          title:'Большая система не выглядит тяжёлой',
          text:'Глухие фасады собраны в нижней и боковой части стены. Открытыми остаются только несколько ниш: достаточно для повседневных вещей, но недостаточно для визуального шума.',
          image:{
            src:tishinaCover,
            alt:'Общая комната с закрытым хранением вдоль правой стены и несколькими открытыми нишами',
            caption:'Закрытые объёмы принимают основную нагрузку, открытые ниши сохраняют глубину стены.',
            framing:'landscape',
            position:'center',
          },
          hotspots:[
            { x:83, y:34, title:'Открыто только необходимое', text:'Книги и несколько предметов остаются под рукой, остальное убрано за фасады.' },
            { x:82, y:74, title:'Хранение ниже линии взгляда', text:'Сплошной нижний объём не перекрывает окно и не дробит комнату отдельными шкафами.' },
          ],
        },
        {
          label:'Место у окна',
          title:'Для чтения не понадобилась отдельная комната',
          text:'Кресло стоит у естественного света и рядом с книгами. Оно создаёт самостоятельный вечерний сценарий, но не перекрывает проход и не отделяется стеной.',
          image:{
            src:tishinaDetail,
            alt:'Мягкое кресло у окна рядом с книгами и встроенным хранением',
            caption:'Кресло, локальный свет и ближайшая полка формируют тихое место без перегородки.',
            framing:'portrait',
            position:'center',
          },
        },
        {
          label:'Материальная деталь',
          title:'Фактуры смягчают компактный объём',
          text:'Матовая окраска фасадов, плотная ткань кресла, шерсть ковра и тёмный камень различаются на близком расстоянии, оставаясь в одной приглушённой гамме.',
          image:{
            src:tishinaDetail,
            alt:'Крупный фрагмент кресла, шерстяного пледа, ковра и тёмного каменного столика',
            caption:'Ткань, шерсть и камень дают глубину без контрастного декора.',
            framing:'macro',
            position:'18% 82%',
          },
        },
      ],
      presentation: {
        hero: {
          type:'image',
          src:tishinaCover,
          alt:'Общий вид небольшой городской гостиной с окном, мягкой зоной и встроенным хранением',
          caption:'Общий вид: свет остаётся главным акцентом, хранение собирается вдоль одной стены.',
          position:'center',
        },
        sectionOrder: ['overview', 'evidence', 'decisions', 'materials', 'facts'],
        overviewTitle: 'Тишина без лишней комнаты',
        decisionsLabel: 'Три точных решения',
        decisionsTitle: 'Что спрятано, что оставлено открытым',
        evidenceLabel: 'От общего к частному',
        evidenceTitle: 'Хранение, место у окна и фактуры',
        materialsTitle: 'Материалы работают на свет, а не на контраст',
        materialsText: 'Тёплый серый связывает фасады и стены, шерсть смягчает посадку, а графит и тёмный камень удерживают глубину у пола.',
      },
      nextProjectSlug:'liniya-lesa',
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
