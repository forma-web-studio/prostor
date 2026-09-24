import type { ImageMetadata } from 'astro';
import svetCover from '../assets/images/projects/svet-i-dub-cover.png';
import svetDetail from '../assets/images/projects/svet-i-dub-detail-1.png';
import domCover from '../assets/images/projects/dom-u-sada-detail-1.png';
import domDetail from '../assets/images/projects/dom-u-sada-detail-2.png';
import tishinaCover from '../assets/images/projects/tishina-goroda-detail-1.png';
import tishinaDetail from '../assets/images/projects/tishina-goroda-detail-2.png';
import liniyaCover from '../assets/images/projects/liniya-lesa-detail-1.png';
import liniyaDetail from '../assets/images/projects/liniya-lesa-detail-2.png';

export type Project = {
  slug: string;
  title: string;
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
  decisions: [string, string];
  gallery: { src: ImageMetadata; alt: string; caption: string };
  palette: Array<{ hex: string; label: string }>;
};

export const projects: Project[] = [
  {
    slug: 'svet-i-dub', title: 'Свет и дуб', kind: 'apartment', area: 86,
    style: 'Тёплый минимализм', pricePerSqm: 4200, estimatedDesignFee: 360000,
    cover: svetCover,
    coverAlt: 'Светлая гостиная-столовая с дубовым столом у высокого окна и встроенным хранением',
    coverCaption: 'Проект интерьера «Свет и дуб»',
    summary: 'Квартира для пары: обедать вместе и работать дома, не занимая всю гостиную.',
    decisions: ['Стол у окна совмещает обеденное место и работу днём.', 'Закрытые дубовые фасады собирают бытовое хранение в одну плоскость.'],
    gallery: { src: svetDetail, alt: 'Дубовый стол у окна и закрытые фасады встроенного хранения', caption: 'Стол и хранение объединены одним тоном дерева.' },
    palette: [{ hex: '#E8E0D2', label: 'молочный' }, { hex: '#B67D51', label: 'дуб' }, { hex: '#C6C0B4', label: 'лён' }, { hex: '#535547', label: 'графит' }],
  },
  {
    slug: 'dom-u-sada', title: 'Дом у сада', kind: 'house', area: 164,
    style: 'Современная классика', pricePerSqm: 4600, estimatedDesignFee: 760000,
    cover: domCover,
    coverAlt: 'Гостиная дома с низким льняным диваном, камином и видом на сад',
    coverCaption: 'Проект интерьера «Дом у сада»',
    summary: 'Дом для семьи, где общая комната продолжается в сад.',
    decisions: ['Низкий диван оставляет пейзаж главным в общей комнате.', 'Столовая у окна связывает ежедневные приёмы пищи с садом.'],
    gallery: { src: domDetail, alt: 'Деревянный стол и льняной текстиль у окна с видом на сад', caption: 'Дерево и лён смягчают каменные поверхности.' },
    palette: [{ hex: '#D9D0C0', label: 'известняк' }, { hex: '#9C6D42', label: 'дуб' }, { hex: '#EEE8DF', label: 'лён' }, { hex: '#67705A', label: 'садовый зелёный' }],
  },
  {
    slug: 'tishina-goroda', title: 'Тишина города', kind: 'apartment', area: 62,
    style: 'Японский минимализм', pricePerSqm: 4400, estimatedDesignFee: 285000,
    cover: tishinaCover,
    coverAlt: 'Гостиная городской квартиры с мягким диваном, встроенным хранением и видом на город',
    coverCaption: 'Проект интерьера «Тишина города»',
    summary: 'Квартира в городе, где вечером можно убрать всё лишнее и остаться у окна.',
    decisions: ['Закрытое нижнее хранение освобождает общую комнату от повседневных вещей.', 'Кресло у окна создаёт отдельное место для чтения и паузы.'],
    gallery: { src: tishinaDetail, alt: 'Кресло у окна рядом со спокойным встроенным хранением', caption: 'Место для чтения отделено от остальной комнаты.' },
    palette: [{ hex: '#C9C4B9', label: 'тёплый серый' }, { hex: '#786F63', label: 'дымчатый' }, { hex: '#E6E1D7', label: 'шерсть' }, { hex: '#31322E', label: 'графит' }],
  },
  {
    slug: 'liniya-lesa', title: 'Линия леса', kind: 'house', area: 128,
    style: 'Природный минимализм', pricePerSqm: 4300, estimatedDesignFee: 560000,
    cover: liniyaCover,
    coverAlt: 'Гостиная дома с оливковым диваном и панорамным видом на сосны',
    coverCaption: 'Проект интерьера «Линия леса»',
    summary: 'Дом в лесу, в котором общий свет и вид на сосны задают ритм дня.',
    decisions: ['Низкая мягкая посадка оставляет взгляд на соснах свободным.', 'Скамья у окна делает пейзаж частью повседневного маршрута.'],
    gallery: { src: liniyaDetail, alt: 'Деревянная скамья у большого окна с видом на сосновый лес', caption: 'Камень, дерево и приглушённый зелёный собирают вид в интерьере.' },
    palette: [{ hex: '#E1DDD2', label: 'светлый камень' }, { hex: '#855D3D', label: 'тёмный дуб' }, { hex: '#777B5B', label: 'оливковый' }, { hex: '#34372E', label: 'графит' }],
  },
];

export const featuredProjects = projects.filter(({ slug }) => slug !== 'dom-u-sada');
