# ПРОСТОР — статус реализации

Дата: 09.09.2026. Этап 1 ПРИНЯТ Astra. Разрешено продолжение всего этапа 2 по IMPLEMENTATION_HANDOFF.md в существующей задаче Terra low.

## Этап 2 — реализация в работе, 09.09.2026

- Добавлены `/projects/`, все четыре статических кейса, `/studio/` и `/contact/`; конечная навигация и циклическая ссылка следующего проекта включены.
- Каталог имеет фильтр Все / Квартиры / Дома с `aria-pressed`, URL-параметром `type`, `history.pushState` и восстановлением через `popstate`; без JavaScript отображаются все карточки.
- `/studio/` содержит состав услуги, процесс и три нативных FAQ; `/contact/` — демоформу без `action`, `fetch` или хранилища. Кнопка формы включается только после подключения JavaScript; валидация не отправляет данные.
- Шесть новых локальных изображений для трёх кейсов сгенерированы встроенным ImageGen и описаны в `assets-manifest.md` как визуальные иллюстрации учебных концептов.
- `npm run check` завершён: 0 errors / 0 warnings / 0 hints. `npm run build` завершён: 9 статических страниц (`/`, `/projects/`, 4 кейса, `/studio/`, `/contact/`, `/404.html`).

## Финальная QA этапа 2 — 10.09.2026

- Локальный preview оставлен работающим: `http://127.0.0.1:4321/`.
- Прямые запросы к `/`, `/projects/`, четырём кейсам, `/studio/`, `/contact/` и `/404.html` вернули HTTP 200.
- В браузере фильтр показал 4 / 2 / 2 карточки; `?type=apartment`, `?type=house` и возврат назад восстановили соответствующее состояние. Форма показала ошибки и фокус на первом поле, а после валидного ввода — демостатус без изменения URL. Проверка выполнена без сетевых запросов формы.
- Собран `BASE_PATH=/prostor-preview/ npm run build` успешно. Обычная сборка затем возвращена.
- Снимки: [каталог 390](references/qa/stage-2/projects-390.png), [каталог 1440](references/qa/stage-2/projects-1440.png), [контакт 390](references/qa/stage-2/contact-390.png), [контакт 1440](references/qa/stage-2/contact-1440.png).
- Бюджет: стартовый JS мал; часть вариантов изображений превышает ориентир 180 КБ — максимум 407 КБ (`svet-i-dub-detail-1`), также встречаются 295 КБ для большого responsive-варианта. Это сохранено как известное ограничение, поскольку качество и кропы не снижались автоматически на финальной проверке.

## Принятие Astra — 09.09.2026

Выполнена адресная сверка index.astro и ProjectCard.astro с замечаниями и просмотр всех шести полностраничных home-full/svet-i-dub-full PNG на 390/768/1440 из раздела ниже. Обёртки страницы теперь владеют grid placement; desktop-асимметрия, tablet 2+1 и мобильные отступы восстановлены. Мобильный кроп находится в компоненте, текст contact исправлен. На снимках подписи и нижние секции доступны, блокирующих визуальных дефектов не обнаружено. Арт-дирекция и шаблон кейса приняты как база для продолжения.

Новые check/build в этом коротком проходе Astra не повторялись: использованы результаты исполнителя ниже и ранее независимо подтверждённый check. Это принятие этапа 1, а не итоговая приёмка полного сайта. Проверки всех конечных маршрутов, формы, фильтра, бюджета ассетов и base path остаются обязательными на этапе 2.

Продолжить в существующей задаче `01a08281-fa70-74e3-bace-b0b10ddeea8a`, модель `gpt-5.6-terra`, reasoning low, без смены дизайна и без деплоя. Прежний отказ ниже сохранён как история и больше не блокирует продолжение.

## Исправление блокирующего замечания Astra — 09.09.2026

- Раскладка избранных перенесена с классов дочернего `ProjectCard` на три обёртки `.project-grid__item` непосредственно в `index.astro`. На desktop восстановлены колонки 1–7, 9–12 со сдвигом 96 px и 3–10; на tablet — две равные колонки и третья во всю ширину; на mobile — одна колонка с промежутком 40 px.
- Мобильный кроп малой карточки закреплён в `ProjectCard.astro` (`3:2`), поэтому больше не зависит от scoped-стиля страницы.
- Из текста секции contact на главной убрано обещание будущих реальных контактов; осталась честная отметка, что это учебный концепт и данные не собираются.
- Повторно выполнены `npm run check` (0 errors / 0 warnings / 0 hints) и `npm run build` (успешно, 3 статические страницы). Preview доступен локально по `http://127.0.0.1:4324/`.
- В реальном браузере осмотрены все секции главной и кейса на 390, 768 и 1440 px. Полностраничные снимки сохранены ниже; на итоговой ширине 1440 px у кейса `scrollWidth === clientWidth === 1440`, визуальный осмотр остальных размеров не выявил горизонтальной прокрутки, перекрытий или обрезанных подписей.

### Полностраничные снимки повторной QA

- [Главная, 390 px](references/qa/stage-1/home-full-390.png), [768 px](references/qa/stage-1/home-full-768.png), [1440 px](references/qa/stage-1/home-full-1440.png)
- [Кейс «Свет и дуб», 390 px](references/qa/stage-1/svet-i-dub-full-390.png), [768 px](references/qa/stage-1/svet-i-dub-full-768.png), [1440 px](references/qa/stage-1/svet-i-dub-full-1440.png)

## История: предыдущий аудит Astra до исправления сетки

Проверены актуальные исходники, все четыре переданных PNG и работающий preview главной. Независимо повторён `npm run check`: 0 errors / 0 warnings / 0 hints. Переданные PNG показывают только верхние экраны, а не страницы целиком; по ним нельзя принять избранные, процесс и нижнюю галерею. Предыдущие шесть исправлений подтверждаются исходниками и верхними экранами, но переход к этапу 2 пока не разрешён.

**Блокирующее замечание: сетка избранных в index.astro.** В работающем preview на desktop три карточки сжаты в узкие колонки слева, названия переносятся по одному слову, большая часть контейнера справа пуста. Классы project-card--one/two/three передаются внутрь ProjectCard, однако scoped-селекторы страницы не достигают корневого article компонента: компонент принимает только class и не переносит атрибут scope родителя. Поэтому заданные grid-column и отступы не работают. Аналогично проверить мобильные отступы `.project-card` и вложенный селектор кропа `.project-card--small .project-card__image`.

**Точное исправление этапа 1:** вынести раскладку в обёртки, созданные непосредственно в index.astro, и задавать колонки/отступы этим обёрткам; альтернативно использовать ограниченные `.project-grid :global(...)` селекторы. Кропы карточки держать внутри ProjectCard либо передавать явный вариант. Не менять композицию: desktop 1–7, 9–12 со сдвигом 96 px, третья 3–10 следующей строкой; tablet две равные и третья на всю ширину; mobile одна колонка с промежутками 40 px. Повторить check/build и осмотр этой секции на 390/768/1440 px. Сохранить полностраничные снимки либо отдельные снимки всех секций обеих страниц: прежние четыре viewport PNG недостаточны для финального визуального контроля.

Дополнительная текстовая правка перед завершением: в contact главной убрать обещание «реальные контакты появятся в полной версии» — утверждённый этап 2 содержит только демоформу и не предусматривает реальных контактов студии.

После исправления передать на повторный контроль Astra. Существующая задача этапа 2 `01a08281-fa70-74e3-bace-b0b10ddeea8a` в этом аудите не возобновлялась. Сборка и проверки меню/base path из таблицы ниже — результаты исполнителя; Astra в этом проходе повторил только check и просмотр preview/снимков. Код приложения Astra не изменял.

## Закрытые замечания Astra

1. **Меню без JavaScript.** На мобильной ширине навигация по умолчанию видна, а кнопка скрыта. Класс `menu-ready` добавляется только скриптом; после этого работает раскрытие, Escape возвращает фокус на кнопку, а при переходе на desktop меню сбрасывается. В проверке на 390 px без `menu-ready` computed display навигации — `flex`.
2. **Фотографии и подписи.** Обёртки `.hero__media`, `.cover__media`, `.gallery__image` несут ratio и overflow, поэтому figcaption остаётся за пределами кропа. Case cover теперь 3:2 desktop / 4:3 mobile. `Image` генерирует реальные width/height для всех raster assets.
3. **Материалы и контракт.** Шесть уникальных локальных JPEG находятся в `src/assets/images/projects/`. `Project.cover` и `gallery.src` имеют тип `ImageMetadata`; все видимые изображения проходят через `astro:assets`, локальные responsive WebP и `srcset`. Подробности лицензий — [assets-manifest.md](assets-manifest.md).
4. **Hero.** Заменён на локальный широкоформатный кадр Max Vakhtbovych с Pexels: дубовые балки, дневной свет и спокойная композиция. Он повторяет cover «Свет и дуб» согласно handoff. `coverPosition` применяется в hero и карточках.
5. **Временная навигация.** «Все проекты» удалено до появления каталога. CTA в контактной секции превратился в честное пояснение учебного режима; главные временные CTA ведут только к предусмотренным якорям.
6. **Шрифты и зависимости.** `package-lock.json` создан. Совместимые фактически проверенные версии: Astro 5.18.0, @astrojs/check 0.9.6, TypeScript 5.9.3, Fontsource Prata 5.2.6, Manrope Variable 5.2.6. В output присутствуют локальные кириллические WOFF2 Prata и Manrope; оба исходных семейства имеют OFL-1.1.

## Фактические проверки

| Действие | Результат |
| --- | --- |
| `npm ci --no-audit --no-fund` | Успешно восстановил зависимости из lock-файла после повреждённого незавершённого install. |
| `npm run check` | Успех: 0 ошибок, 0 warnings, 0 hints. |
| `npm run build` | Успех: 3 статические страницы — `/`, `/projects/svet-i-dub/`, `/404.html`. Обычная сборка возвращена после проверки base path. |
| Прямые URL preview | `http://127.0.0.1:4321/` и `http://127.0.0.1:4321/projects/svet-i-dub/` отдают HTTP 200. |
| Desktop / mobile | В браузере просмотрены главная и кейс на 1440 и 390 px; дополнительно 360, 768, 1440 px на обеих страницах — `scrollWidth <= innerWidth`. |
| Меню | На 390 px: раскрытие, `aria-expanded`, Escape и возврат фокуса проверены. Без JS базовая мобильная навигация остаётся видимой. |
| Подписи и кропы | Просмотрены в реальном preview на 390 и 1440 px: hero, case cover и обе подписи галереи видимы, не обрезаются. |
| Base path | `BASE_PATH=/prostor-preview/ npm run build` успешен; статические файлы вручную смонтированы в `/prostor-preview/` для preview. Главная, кейс и CSS отдали HTTP 200, ссылки и `srcset` содержат `/prostor-preview/`. |

## Снимки QA

- [Главная, 390 px](references/qa/stage-1/home-390.png)
- [Главная, 1440 px](references/qa/stage-1/home-1440.png)
- [Кейс «Свет и дуб», 390 px](references/qa/stage-1/svet-i-dub-390.png)
- [Кейс «Свет и дуб», 1440 px](references/qa/stage-1/svet-i-dub-1440.png)

## Текущая точка передачи

Этап 1 принят 09.09.2026 по актуальному разделу в начале файла. Продолжить каталог, оставшиеся кейсы, studio/contact, фильтр и демоформу как этап 2 по handoff в существующей задаче `01a08281-fa70-74e3-bace-b0b10ddeea8a`, сохраняя принятые компоненты и дизайн.

## Master redesign Этап 0 — 24.09.2026

- Рабочий корень подтверждён: `C:\Users\fimoz\Documents\ChatGPT\сайты\01-prostor`. До этапа он не был Git-репозиторием; вложенный `output/github-pages-prostor` остался отдельной deploy-копией с `origin` `https://github.com/forma-web-studio/prostor.git`.
- Создан проверенный архив `backups/prostor-baseline-20260924-185801.zip` рядом с проектам. В нём есть `package.json`, `src` и `public`; `node_modules`, `dist`, `.astro`, `.playwright-cli` и `output` исключены.
- Рабочий корень инициализирован как локальный Git-репозиторий; активна ветка `codex/prostor-master-redesign`. Добавлен `.gitignore` для dependencies, build output, QA artifacts, env, logs и системных файлов.
- `npm ci --no-audit --no-fund`, `npm run check` и чистый `npm run build` завершились успешно. Astro check: 45 файлов, 0 errors, 0 warnings, 0 hints. Build: 16 статических страниц.
- Production preview проверен на `/`, `/projects/`, `/projects/svet-i-dub/`, `/services/`, `/services/design/`, `/studio/`, `/contact/`, `/privacy/` и `/404.html`. Обычные маршруты отдают 200; 404-страница корректно отдаёт интерфейс ошибки с HTTP 404.
- Главная, «Свет и дуб», услуги и контакт проверены в Chromium на 1440×1000, 768×1024 и 390×844. Во всех 12 прогонах: один H1, нет horizontal overflow, нет незагруженных изображений и console errors. PNG хранятся в `output/stage-0-baseline/` и не коммитятся.
- Мобильное меню прошло pointer click, Escape, возврат фокуса и смену `inert`; `prefers-reduced-motion: reduce` активируется.

### Baseline audit

- **Keep:** Astro static architecture, семантику, responsive `Image`, доступную мобильную навигацию, reduced-motion/no-JS базу и локальную валидацию формы.
- **Refactor:** page hierarchy и evidence ordering, общую schema кейсов, глубину service/project pages и environment-aware metadata.
- **Replace в следующих согласованных этапах:** статичный hero на честную draggable panorama только после появления цельного asset; декоративный plan fragment на честный plan-to-space материал. Ничего из этого в Этапе 0 не менялось.

## Master redesign Этап 1 — 25.09.2026

- `tokens.css` расширен до семантического foundation: canvas/surface/ink/muted/accent/line/focus/error/success, локальные Prata/Manrope, type scale, spacing, reading/content/wide widths, 12-column grid, section rhythm, control sizes, shadows, z-index и motion.
- Базовая палитра сохранена. Старый `--olive`, который использовался как текст 13 px при контрасте 3.92:1, переведён на `--accent-ink` с 5.59:1. Исходный `#747A64` остался декоративным accent.
- `global.css` получил общие container variants, editorial grid, heading utilities, fluid body type, text wrapping, selection/focus базу и единое narrow-title правило для 320–359 px. Оно устранило overflow двух длинных H1 без разрыва слов.
- `BaseLayout.astro` теперь даёт всем маршрутам единый flex page shell с устойчивым footer placement. Новые PageIntro/SectionHeading не создавались: на этом scope они не сокращали бы дублирование.
- Дизайн секций, маршруты, контент, изображения и интерактивы не менялись.
- Финальные `npm run check` и `npm run build` PASS: 45 файлов без diagnostics, 16 статических страниц.
- Chromium production-preview: 64/64 проверки (16 маршрутов × 320/390/768/1440) без horizontal overflow, broken images, console errors, request failures и проблем загрузки шрифтов; везде ровно один H1. Skip-link, pointer menu, Escape, focus return, `inert` и reduced motion PASS.
- Скриншоты: `output/playwright/stage-01/` — home 1440/768/390/320, «Свет и дуб» 1440/390, services 320. Перед съёмкой выполнялись scroll и `img.decode()`; пустых reveal/lazy-loading зон нет.

## Master redesign Этап 2 — 25.09.2026

- Уточнена шапка без изменения состава навигации: сохранены текстовый логотип, «Проекты / Услуги / Подход / Контакты» и base-aware ссылки.
- Desktop-ссылки и логотип получили hit area не менее 44 px, спокойные hover/focus/current состояния и семантику current route. На `/projects/` используется `aria-current="page"`, на детальных проектах — `aria-current="location"`; остальные пункты активны только на точных маршрутах.
- Мобильное меню скрывается только после подключения всех обработчиков. Синхронизированы `aria-expanded`, доступная подпись и `inert`; проверены pointer, touch, Escape с возвратом фокуса, click outside, выбор ссылки и переход через breakpoint. Focus trap и блокировка body не добавлялись. Без JavaScript все четыре ссылки остаются видимыми.
- Sticky-режим не добавлялся: подтверждённой необходимости нет, статичная шапка не перекрывает hero и anchor targets. Reduced motion сводит переходы к `0.01ms`.
- `npm run check` PASS: 45 файлов, 0 errors / 0 warnings / 0 hints. Обычная и `BASE_PATH=/prostor-preview/` сборки PASS: 16 страниц; после base-path проверки восстановлена обычная сборка.
- Chromium matrix: 64 layout-проверки (16 маршрутов × 320/390/768/1440) без horizontal overflow, broken images, перекрытия main, console errors и request failures. Скриншоты лежат в `output/playwright/stage-02/` и не коммитятся.
- Публикации не было. Следующий шаг — только Этап 3 после явного подтверждения пользователя.

## Master redesign Этап 3 — 25.09.2026

- Asset gate подтвердил, что прежние 1536×1024 project renders не являются панорамой и не должны растягиваться. Встроенным ImageGen создан отдельный непрерывный master «Дом у сада» 2172×724 без швов, коллажа и повторов; origin, hash и prompt summary записаны в `assets-manifest.md`. Master хранится в `references/panorama/`, вне publishable asset tree.
- Главная получила `PanoramaHero`: H1 остаётся первым смыслом, сохранены короткая позиционирующая строка, один primary CTA и text link. Responsive `<picture>` создаёт AVIF/WebP/JPEG 960/1440/2172; largest AVIF — 152 КБ, JPEG fallback — 342 КБ.
- Панорама занимает 2.5× viewport на desktop, 2.6× tablet и 3.6× mobile. Реализованы pointer capture, clamped edges, короткая inertia, resize recalculation, grab/grabbing и progress indicator. Auto-pan не добавлялся.
- Доступность: после инициализации область становится горизонтальным slider; ArrowLeft/Right, Home/End и скрытая инструкция работают. При no-JS остаётся видимый статичный нефокусируемый кадр.
- Mobile использует `touch-action: pan-y`, 10 px directional threshold и горизонтальную блокировку. Реальный touch-прогон: вертикальный жест прокрутил страницу, сохранив panorama 12%; горизонтальный переместил 12→56% при `scrollY=0`.
- Reduced motion стартует со статичной центральной композицией 50% и отключает inertia; после ручного перемещения позиция не продолжает меняться.
- `npm run check` PASS: 47 файлов, 0 errors / 0 warnings / 0 hints. Обычная и `BASE_PATH=/prostor-preview/` сборки PASS: 16 страниц. Browser QA главной на 320/390/768/1440: без overflow, broken image, console errors и request failures.
- Скриншоты: `output/playwright/stage-03/` — 1440 start/mid/end/reduced-motion, 768, 390 и реальный touch state. Публикации не было. Следующий шаг — только Этап 4 после явного подтверждения пользователя.

## Master redesign Этап 4 — 25.09.2026

- Главная перестроена в единую редакционную историю: panorama hero → три избранных проекта → два evidence-разбора → результаты услуг → deliverables процесса → сдержанный финальный CTA.
- Три избранных сохранили асимметричный вес, но на главной теперь показывают задачу пространства вместо цены. Hero-кадр «Дом у сада» в ближайшем viewport не повторяется: curated-секция использует три других проекта.
- Добавлен переиспользуемый `EvidenceRow`. Данные каждого проекта получили структуру `context / constraint / move / effect`; на главной раскрыты «Свет и дуб» и «Тишина города» без выдуманных чисел и award-copy.
- На mobile смысловой блок каждого evidence-фрагмента находится в DOM перед изображением. Услуги сведены к трём клиентским результатам и одной ссылке в каталог; этапы процесса дополнены конкретными выходными материалами.
- Видимые AI/demo/учебные пометки не возвращались согласно актуальным ограничениям проекта. Footer и контактные данные сохранены; deploy-копия не изменялась.
- `npm run check` PASS: 48 файлов, 0 errors / 0 warnings / 0 hints. Обычная сборка PASS: 16 страниц.
- Chromium production-preview главной на 320/390/768/1440: один H1, 3 project features, 2 evidence rows, без overflow, broken images, console errors, request failures и ответов 4xx/5xx. На 320 px дополнительно подтверждено отсутствие запрещённого служебного текста.
- Скриншоты: `output/playwright/stage-04/` — full page 1440/768/390 и evidence detail 1440/390. Публикации не было. Следующий шаг — только Этап 5 после явного подтверждения пользователя.

## Master redesign Этап 5 — 25.09.2026

- Каталог проектов получил доступный фильтр `Все / Квартиры / Дома` по реальному `kind`. Состояние отражается в `aria-pressed`, счётчик работает через `aria-live="polite"`; без JavaScript все четыре проекта остаются видимыми.
- `?type=apartment|house` поддерживает прямые ссылки. Выбор использует `history.pushState`, сохраняет остальные query-параметры и hash; Back/Forward восстанавливает фильтр. Неизвестный `type` означает «Все» и удаляется через `replaceState` без потери остальных частей URL.
- В project schema добавлены `order`, `featured` и `flagship`; главная и каталог сортируют/выбирают проекты по данным, без проверок slug. Curated grid использует роли `lead / portrait / wide / standard`, а выдача из двух проектов — `lead / support`.
- Карточка остаётся одним anchor. Editorial meta отделена от commercial estimate линией и подписью «Ориентир дизайн-проекта»; ratio, alt и responsive `sizes` задаются по роли. На узком tablet цена переносится под метаданные — это устранило обнаруженный visual-lint overflow 2 px без уменьшения текста.
- `npm run check` PASS: 49 файлов, 0 errors / 0 warnings / 0 hints. Обычная и `BASE_PATH=/prostor-preview/` сборки PASS: 16 страниц; восстановлена обычная финальная сборка.
- Chromium production-preview: 4/2/2 карточки, direct house deep link, сохранение query/hash, Back/Forward, unknown type, no-JS и base path PASS. На 1440/768/390 нет page/text overflow, missing alt, broken images, console errors, request failures или 4xx/5xx. Filter controls имеют высоту 44 px.
- Первый проект начинается на 441 px при 768×1024 и 518 px при 390×844. Скриншоты: `output/playwright/stage-05/` — all 1440/768/390, apartments 1440, houses 1440. Публикации не было. Следующий шаг — только Этап 6 после явного подтверждения пользователя.

## Master redesign Этап 6 — 25.09.2026

- Кейс «Дом у сада» перестроен в flagship-историю: контекст → панорама → задача и ограничения → три решения → два evidence-разбора → материалы → параметры концепции → крупный следующий проект → CTA.
- Project schema расширена структурой `caseStudy`: публичный статус «Интерьерная концепция», локация, год, состав, ориентир срока, brief, ограничения, решения, evidence-модули и следующий проект. Шаблон выбирается по `caseStudy.variant`, без slug-условий; старый локальный meta-словарь удалён.
- Панорама повторно использует проверенный Stage 3 source и движок в меньшей высоте, без auto-pan. Есть slider semantics и Arrow/Home/End. Две нумерованные evidence-точки имеют нативные `details`, 44×44 px цели и превращаются на mobile в обычные текстовые пояснения.
- Неподтверждённые заявления о реализации убраны: во всех кейсах используется статус «Интерьерная концепция». Остальные три страницы продолжают работать через общий schema-driven стандартный шаблон.
- `npm run check` и обычная/`BASE_PATH=/prostor-preview/` сборки PASS: 16 страниц. Chromium 1440/768/390, keyboard hotspots/panorama, reduced motion, no-JS и стандартный кейс PASS; нет overflow, broken images, missing alt, console/network errors или ответов 4xx/5xx. Base-path ссылки и assets имеют корректный префикс.
- Скриншоты: `output/playwright/stage-06/` — full page 1440/768/390, раскрытая evidence-точка и следующий проект. Публикации не было. Следующий шаг — только Этап 7 после явного подтверждения пользователя.

## Цилиндрическая WebGL-панорама — 26.09.2026

- Пользовательский source подключён как цилиндрическая WebGL2-текстура на главной и в flagship-кейсе; плоский draggable track заменён на перспективный обзор из центра сцены. 26.09 ImageGen-версия с восстановленными деталями заменила первый файл; delivery texture увеличена до 3840×1280.
- Горизонтальный поворот бесконечный в обе стороны. Проверено 360 клавиатурных шагов по 7° — ровно семь полных оборотов с возвратом progress в 0%; шов визуально проверен на 182°.
- Мышь поддерживает yaw, ограниченный pitch и inertia. Touch directional lock сохраняет прокрутку страницы: горизонтальный жест 0→16,19%, вертикальный — `scrollY=620` без изменения направления. Reduced motion отключает inertia.
- Добавлены 44×44 px zoom/reset controls, Arrow-клавиши, `+/-`, Home и live status. При no-JS или отсутствии WebGL остаётся статичный нефокусируемый кадр, элементы управления скрыты.
- WebP-текстура 3840×1280 quality 88 весит около 748 КБ. Крайние колонки совпадают с RGB delta 0/0; WebGL seam view 182° визуально прошёл. Chromium: WebGL ready, вращение работает, без overflow и console errors.
- QA: `output/playwright/panorama-360/`. Эта доработка не считается Этапом 7 master redesign.
