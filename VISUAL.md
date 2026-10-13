# Визуальная система ПРОСТОРА

Текущий язык — спокойная editorial evidence system: фото и пространственные доказательства важнее декоративных карточек. Публичный интерфейс не содержит AI/demo/учебных пояснений и не выдаёт концепции за реализованные объекты.

## Токены

Источник истины — `src/styles/tokens.css`.

- Canvas `#f3f0e9`, surface `#faf8f3`, muted surface `#ebe7dd`.
- Ink `#252824`, muted `#5d6258`, accent `#747a64`, доступный accent text `#5b624e`.
- Prata 400 для display headings; Manrope Variable для текста и controls. Шрифты локальные.
- Content widths: reading 42rem, content 70rem, wide 82.5rem; от 1600 px wide расширяется до 96rem.
- Shared 12-column grid; gap 20–32 px, 36 px на ultrawide.
- Section rhythm 64–112 px; controls 50 px, compact minimum 44 px.

## Композиция

- Главная: тезис и действие → панорама → curated projects → evidence → результаты услуг → process → CTA.
- Каталог: фильтр до карточек; desktop асимметрия, tablet 2×2, mobile одна колонка.
- Кейсы: context → decisions → evidence → materials/facts → next project → CTA. «Дом у сада» использует панораму; «Свет и дуб» — matched plan-to-space.
- Услуги: выбор результата до калькулятора и доказательств; detail pages используют общий data-driven template.
- Contact: форма и локальная сводка являются главным действием; неподтверждённые контакты и псевдокарта удалены.

Содержательные breakpoints: mobile до 767 px, tablet 768–1099 px, desktop от 1100 px, ultrawide от 1600 px. Минимальная поддерживаемая ширина — 320 px.

## Изображения

Фотографии без скруглённых «карточных» оболочек и декоративных теней. Layout задаёт точные `sizes`; width/height обязательны. На маршруте не больше одного eager/high-priority изображения. Обычные изображения используют responsive WebP; панорама — AVIF/WebP 2048/4096/8192 с browser-selected fallback.

Provenance и hashes находятся в `assets-manifest.md`. Runtime-дерево содержит только импортируемые материалы; ранние predecessor assets перенесены в `references/archive/runtime-predecessors/`.

## Состояния и движение

- Micro feedback — 180 ms, section reveal — 520 ms, shared spatial transition — 700 ms.
- Контент видим по умолчанию; JavaScript не является условием чтения страницы.
- Reduced motion отключает reveal displacement, View Transition morph и инерцию панорамы.
- Focus имеет контрастный outline; selected/open/invalid/disabled различимы также в forced colors.
- Touch-интерактивы различают горизонтальное намерение и вертикальный scroll.

## Запрещённые откаты

- Не возвращать glassmorphism, большие скругления, градиентные пятна, emoji-стрелки, card wall и autoplay.
- Не возвращать публичные AI/demo/учебные пометки, testimonials, награды, фиктивные контакты или обещание отправленной заявки.
- Не подменять matched plan-to-space декоративной схемой и не заменять принятую 360°-панораму другим asset без отдельного задания.
- Не открывать новый redesign loop в release pass; исправлять только проверяемые регрессии.

## Визуальная приёмка

Финальный release gate включает реальные browser screenshots ключевых маршрутов на 1440×900, 768×1024 и 390×844, отдельный reduced-motion evidence, проверку console/network, H1, alt, horizontal overflow и broken images. Артефакты Stage 23 хранятся в `output/playwright/master-stage-23/` и не публикуются.
