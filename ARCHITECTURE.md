# Архитектура ПРОСТОРА

## Контур системы

Astro собирает статический сайт. Контент и основной порядок чтения существуют в HTML; JavaScript подключается только для локальных progressive-enhancement сценариев. React/Vue, client router, CMS и серверные endpoints не используются.

```text
src/
  layouts/BaseLayout.astro
  components/
    Header.astro, Footer.astro, Button.astro, ArrowIcon.astro
    ProjectCard.astro, ProjectCase.astro, CaseEvidence.astro
    PanoramaHero.astro, CasePanorama.astro, PanoramaSurface.astro
    PlanToSpace.astro, ProjectCalculator.astro, DemoInquiry.astro
    ServiceDetail.astro, ServiceEvidence.astro, ProcessSteps.astro
  data/projects.ts, services.ts, site.ts
  pages/
    index.astro, 404.astro, contact.astro, privacy.astro, studio.astro
    projects/index.astro, projects/[slug].astro
    services/index.astro, services/[slug].astro
    robots.txt.ts, sitemap.xml.ts
  scripts/
    menu.ts, project-filter.ts, project-transitions.ts
    panorama.ts, plan-to-space.ts, calculator.ts, demo-inquiry.ts
  styles/tokens.css, global.css
  utils/seo.ts, urls.ts
```

## Данные и маршруты

`projects.ts` содержит четыре проекта и полный `caseStudy`: status, brief, constraints, decisions, evidence, materials, facts, presentation и next-project. Один `ProjectCase.astro` рендерит все четыре маршрута; различия задаются данными, а не slug-условиями.

`services.ts` содержит пять услуг, параметры калькулятора, deliverables и связи с кейсами. Один `ServiceDetail.astro` рендерит все detail routes. Build-time guards запрещают неизвестные связи, self-link и неполные кейсы.

`site.ts` хранит только общие подтверждаемые тексты и структуру. Неподтверждённые телефон, email, адрес, часы, территория, отзывы и клиенты отсутствуют.

## Progressive enhancement

- Header: мобильное меню с `aria-expanded`, `inert`, Escape и focus return; без JavaScript ссылки видимы.
- Project filter: `aria-pressed`, live count, `?type=`, Back/Forward; без JavaScript видны все проекты.
- Panorama: WebGL2 cylinder, pointer/touch directional lock, keyboard, zoom/reset и status; fallback — responsive `<picture>`.
- Plan-to-space: совпадающие plan/top-down слои, slider semantics, pointer/keyboard/touch; без JavaScript обе стороны остаются читаемыми.
- View Transitions: необязательный card/next-project morph без router; обычные ссылки являются базовым контрактом.
- Calculator и inquiry: локальная валидация и prefill; нет fetch, storage или скрытой отправки.
- Inquiry result: копируемая readonly-сводка с доступным Clipboard fallback; файлы представлены только именами.

## URL и metadata

`astro.config.mjs` нормализует `BASE_PATH`, принимает только валидный `SITE_URL`-origin и проверяет `SITE_INDEXABLE`. `src/utils/urls.ts` строит внутренние base-aware ссылки. `src/utils/seo.ts`, `BaseLayout.astro`, `robots.txt.ts` и `sitemap.xml.ts` используют один environment contract.

Demo build по умолчанию: `noindex,nofollow`, без canonical, абсолютных OG URL и JSON-LD. Indexable build возможен только при `SITE_INDEXABLE=true` и явном `SITE_URL`; 404 всегда остаётся noindex. JSON-LD ограничен `WebPage`, `WebSite` и `ImageObject`.

## Media pipeline

Обычные локальные изображения проходят через `astro:assets` и получают responsive WebP candidates. Панорама использует один source 8192×2731; Astro выпускает AVIF и WebP 2048/4096/8192. Browser-selected `currentSrc` переиспользуется WebGL, а при отказе high-resolution texture выполняется однократное восстановление на safe 4096 WebP.

В `src/assets` остаются только runtime imports. Исходные masters, ранние материалы и provenance хранятся в `references/`; QA и release copies — в игнорируемом `output/`.

## Accessibility и motion

Один `main`, skip link, корректные breadcrumbs, видимый focus и controls не меньше 44 px. Интерактивы имеют keyboard/status/instruction contracts; forced colors, text spacing, 200% zoom, no-JS и reduced motion проверены. Motion использует три токена: 180 ms micro, 520 ms section reveal и 700 ms spatial transition; reduced motion отключает displacement, morph и panorama inertia.

## Сборка и проверка

```powershell
npm ci --no-audit --no-fund
npm run check
npm run build
npm run preview -- --host 127.0.0.1 --port 4321
$env:BASE_PATH='/prostor/'; npm run build; Remove-Item Env:BASE_PATH
```

Публичная сборка не должна содержать Markdown, source maps, `references/`, `output/`, localhost, secrets или рабочие документы. Деплой выполняется только из отдельного checkout `output/github-pages-prostor` после явного решения пользователя.
