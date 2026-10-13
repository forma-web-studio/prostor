# ПРОСТОР

Статический многостраничный сайт интерьерной студии на Astro 5.18 и TypeScript. В проекте 16 HTML-маршрутов, редакционная система кейсов и услуг, WebGL2-панорама, сопоставление плана и пространства, URL-фильтр проектов и локальная подготовка сводки обращения.

Технический разбор архитектуры и измерений: [docs/CASE_STUDY.md](docs/CASE_STUDY.md). История поэтапной реализации: [IMPLEMENTATION_STATUS.md](IMPLEMENTATION_STATUS.md).

## Запуск

Требуется Node.js 24 (`.nvmrc`) и npm.

```powershell
npm ci --no-audit --no-fund
npm run check
npm run build
npm run preview -- --host 127.0.0.1 --port 4321
```

Дополнительная проверка размеров сборки:

```powershell
npm run audit:performance
```

## Переменные окружения

| Переменная | Значение по умолчанию | Назначение |
| --- | --- | --- |
| `BASE_PATH` | `/` | Подкаталог публикации. Для GitHub Pages используется `/prostor/`. |
| `SITE_URL` | не задан | Подтверждённый HTTP(S)-origin без path, query и credentials. |
| `SITE_INDEXABLE` | `false` | Разрешает индексирование только при значении `true` и валидном `SITE_URL`. |

Без явного `SITE_INDEXABLE=true` сборка остаётся `noindex,nofollow`, не создаёт выдуманный canonical и не публикует абсолютные OG URL или JSON-LD. Пример конфигурации находится в `.env.example`.

Production-проверка для текущего GitHub Pages base path:

```powershell
$env:BASE_PATH='/prostor/'
$env:SITE_URL='https://forma-web-studio.github.io'
$env:SITE_INDEXABLE='true'
npm run build
Remove-Item Env:BASE_PATH,Env:SITE_URL,Env:SITE_INDEXABLE
```

## Маршруты

| URL | Назначение |
| --- | --- |
| `/` | Главная evidence-история и 360°-панорама |
| `/projects/` | Каталог четырёх концепций с URL-фильтром |
| `/projects/[slug]/` | Четыре data-driven кейса |
| `/services/` | Сравнение пяти форматов работы и локальный калькулятор |
| `/services/[slug]/` | Пять data-driven страниц услуг |
| `/studio/` | Подход, результат, процесс и FAQ |
| `/contact/` | Локальная форма и копируемая сводка |
| `/privacy/` | Фактическая граница обработки данных |
| `/robots.txt`, `/sitemap.xml` | Окружение-зависимые SEO endpoints |
| `/404.html` | Статическая страница ошибки |

## Архитектура

- `src/data/` — единый источник проектов, услуг и общих текстов.
- `src/components/` — общие Astro-компоненты; интерактивы подключают небольшие TypeScript-модули из `src/scripts/`.
- `src/layouts/BaseLayout.astro` и `src/utils/seo.ts` — shell, metadata, JSON-LD и индексируемость.
- `src/utils/urls.ts` — base-aware внутренние ссылки.
- `src/assets/` — только runtime-материалы; masters, provenance и QA находятся в `references/` и `output/`.

Подробные контракты описаны в [ARCHITECTURE.md](ARCHITECTURE.md), визуальная система — в [VISUAL.md](VISUAL.md), provenance материалов — в [assets-manifest.md](assets-manifest.md).

## Фактические ограничения

- Сайт не имеет backend, CMS, аналитики, оплаты или автоматической отправки формы.
- Контактная форма хранит состояние только в текущем окне и формирует текст для ручного копирования; выбранные файлы не читаются и не передаются.
- Цены, география, кейсы и границы услуг являются сценарным содержимым портфолио и требуют подтверждения будущим владельцем до коммерческого использования.
- Лабораторный LCP панорамного кейса около 3,9 с остаётся принятым trade-off цельной 8192-текстуры.
- Cross-browser QA выполнен в Chromium и Playwright WebKit; физический Safari/iPhone не проверялся.

## QA и публикация

Последний полный production QA мастер-этапа 21: 264/264 route checks, 0 открытых P0/P1, root и `/prostor/` сборки по 16 HTML. Финальный release pass мастер-этапа 23 фиксируется в `output/playwright/master-stage-23/` и в конце `IMPLEMENTATION_STATUS.md`.

Рабочая документация, `references/` и `output/` не входят в статическую сборку. Публичный GitHub Pages на момент начала Stage 23 остаётся на deploy commit `2803a3a`; Stage 23 не выполняет push, deploy или публикацию.
