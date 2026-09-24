# Архитектура ПРОСТОРА

Стек и общие критерии — в ../README.md. Все пути ниже относительно будущего приложения в этой папке.

Актуальная последовательность реализации — [IMPLEMENTATION_HANDOFF.md](IMPLEMENTATION_HANDOFF.md), два этапа Terra вместо старой последовательности CHAT_TASKS.md. Архитектурные решения закреплены Astra 08.09.2026.

```text
src/
  layouts/BaseLayout.astro
  components/{Header,Footer,Button,SectionHeading,ProjectCard,ProjectGallery,ProjectFilter,ProcessSteps,DemoInquiry}.astro
  pages/index.astro
  pages/projects/index.astro
  pages/projects/[slug].astro
  pages/{studio,contact,404}.astro
  data/{projects,site}.ts
  styles/{tokens,global}.css
  scripts/{menu,project-filter,demo-inquiry}.ts
  utils/urls.ts
  assets/images/{hero,projects,studio}/
public/fonts/
astro.config.mjs
package.json
```

## Контракты

Project: slug:string; title:string; kind:'apartment'|'house'; area:number; cover:ImageMetadata; coverAlt:string; summary:string; challenge:string; solution:string; gallery:Array<{src:ImageMetadata;alt:string;caption?:string}>; palette:Array<{hex:string;material:string}>.

ProjectCard получает project:Project и size:'large'|'small' (по умолчанию large). Галерея принимает items из Project.gallery; aspect ratio задаётся композицией, не случайной высотой. Button: href?:string, variant:'solid'|'outline'|'text'; при href это ссылка, при действии button.

BaseLayout: title, description, image?, noindex?; импортирует global.css, формирует meta, шрифты и общий footer. site.ts: имя, отметка о демо, навигация; реальные контакты не выдумывать. Ссылки строить через единый helper с учётом BASE_URL.

Статические детальные маршруты создаются через getStaticPaths из projects.ts. Несуществующий slug ведёт на 404. Все данные существуют в одном месте; не дублировать названия в карточках и страницах.

## Интерактивность

ProjectFilter: три button с aria-pressed. При выборе скрываются неподходящие карточки через hidden; live region сообщает количество. Пустое состояние предусмотрено для будущих данных: «Проектов этого типа пока нет». Без JS показываются все проекты и скрывается неработающее управление. Параметр ?type=house сохраняет выбранную категорию; неизвестное значение → Все.

ProjectGallery: обычные изображения, без обязательного lightbox. Масштабирование можно добавить позже; в первой версии не усложнять.

DemoInquiry: поля имя (обязательно), контакт (обязательно), тип объекта, примерная площадь (необязательно), описание. Над полями «Демонстрация формы — данные никуда не отправляются». Submit «Проверить форму». После корректного ввода статус «Форма заполнена корректно. Это демонстрация; заявка не отправлена». Ошибки возле полей, aria-describedby, фокус на первом ошибочном поле. Никаких запросов или сохранения контактов.

## Проверка

Проверить выбор всех категорий, URL-параметр и неизвестный параметр, загрузку каждого кейса напрямую, навигацию клавиатурой, ошибки формы и демостатус. Галерея не должна менять ширину страницы или вызывать скачки при загрузке.

## Решения для быстрой первой версии

- Статический Astro, TypeScript strict, обычный CSS. npm; dev/check/build/preview в package.json, check запускает astro check. Исполнитель проверяет совместимость актуальных Astro, Node и @astrojs/check по официальной документации, фиксирует Node в .nvmrc и зависимости в package-lock.json. Не фиксировать выдуманный номер версии из этого документа.
- Нет React, Tailwind, CMS, серверных endpoints, View Transitions, lightbox, карты, внешних виджетов, аналитики и UI-библиотеки. CSS Grid вместо masonry. Astro-скрипты подключать только там, где они нужны.
- BaseLayout владеет ровно одним Header, main и Footer; страницы передают контент в slot. Общие глобальные стили: reset, типографика, контейнер, утилиты доступности. Стили компонентов — в самих .astro; никаких глобальных селекторов по случайному порядку секций.
- utils/urls.ts экспортирует withBase для внутренних путей с query/hash; входные внутренние пути начинаются с /. Внешние https, mailto и tel не пропускаются через helper. Использовать BASE_URL для ссылок, шрифтов и public-файлов; импортированные Astro assets не префиксовать повторно.
- output: static, trailingSlash: always. BASE_PATH окружения задаёт base (по умолчанию /), SITE_URL — реальный домен, если известен. Без домена не генерировать фиктивные canonical, sitemap и абсолютный og:image. По умолчанию noindex для демонстрации. Публикация и CI не входят в этапы.
- Добавить к Project поле coverPosition?:string; к элементу gallery — position?:string. Это object-position, стартовое значение 50% 50%; менять после просмотра кропа. Поля image source/license не дублировать в Project: единый assets-manifest.md с соответствием ID и локального пути.
- Галерея первой версии: два дополнительных разных изображения плюс cover на каждый кейс. Это заменяет первоначальные четыре дополнительных фото из README/VISUAL. Палитра — четыре CSS-образца с названиями, без отдельных растровых текстур. Hero может повторять cover первого кейса, манифест — честно обозначенный фрагмент уже используемого изображения.
- На этапе 1 только Свет и дуб получает заполненную gallery и детальную страницу; остальные записи имеют gallery:[] и полный базовый демоконтент, но не публикуются как кейсы. getStaticPaths на этапе 1 явно выбирает svet-i-dub; на этапе 2 использует все четыре записи, предварительно заполненные изображениями.
- Локальные JPEG/PNG-исходники в src/assets/images, Picture/Image из astro:assets, responsive sizes/widths и AVIF/WebP с запасным форматом. Один hero eager + fetchpriority=high; остальные lazy, кроме первого изображения внутренней страницы. Width/height обязательны. Никаких случайных remote image URL во время работы сайта.

## Точное поведение

Меню — немодальное раскрытие под шапкой: button с aria-controls/aria-expanded, без focus trap и блокировки body. Escape закрывает и возвращает фокус на кнопку; выбор ссылки закрывает; переход на desktop сбрасывает закрытое мобильное состояние. Без JS навигация видна, кнопка раскрытия скрыта. Skip-link ведёт в main.

Фильтр распознаёт только apartment/house, отсутствие и неизвестный type означают Все. Нажатие обновляет URL через history.pushState, сохраняет остальные query-параметры и hash, не перезагружает страницу; popstate восстанавливает выбор. Для Все удалить type. hidden не должен переопределяться display:grid. Счётчик — aria-live=polite. Контрольные количества: Все 4, Квартиры 2, Дома 2.

Демоформа без JS имеет отключённую кнопку и пояснение noscript. Скрипт сначала устанавливает обработчик preventDefault, затем включает кнопку и управляемую валидацию. Имя и контакт проверяются после trim; контакт — свободное поле «Телефон или email», без навязчивой маски. Площадь, если заполнена, — конечное положительное число. Ошибки связаны через aria-describedby и aria-invalid, status имеет role=status. Ни action на внешний сервис, ни fetch, ни storage; поля не должны попадать в URL при Enter. Проверить этот сценарий также без JS.

Все проверки фиксируются в IMPLEMENTATION_STATUS.md: этап, реальные команды/результаты, просмотренные размеры, временные ссылки, источники, ограничения. Не объявлять невыполненные проверки успешными.
