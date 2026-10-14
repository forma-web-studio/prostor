# PROSTOR release candidate

Дата handoff: 14.10.2026. Публичная версия пока не изменена и остаётся на deploy commit `2803a3a`.

## Что изменится для посетителя

- Удалены неподтверждённые телефон, email, адрес, часы и территория обслуживания.
- Контактный сценарий больше не обещает отправку, бронирование или обратную связь. Он готовит локальную сводку, которую посетитель копирует вручную; при недоступном Clipboard API показывается доступное readonly-поле.
- Метаданные, canonical, Open Graph, `robots.txt` и `sitemap.xml` теперь зависят от явной production-конфигурации. 404 остаётся `noindex`.
- Панорама при отказе выбранной high-resolution texture один раз восстанавливается на safe 4096 WebP вместо повреждённого fallback.
- Маршруты, визуальная концепция и основная композиция сайта не менялись после feature freeze.

## Технические изменения

- Введён единый контракт `SITE_URL` + `BASE_PATH` + `SITE_INDEXABLE`; indexable build без валидного origin завершается ошибкой.
- Все 16 HTML-маршрутов имеют уникальные title, description и Open Graph данные; production base path `/prostor/` и trailing slash формируются одним URL helper.
- JSON-LD ограничен фактическими `WebPage`, `WebSite` и `ImageObject`. Неподтверждённые LocalBusiness, контакты, отзывы и рейтинги не добавлены.
- Runtime tree очищен от восьми неиспользуемых predecessor JPEG; они сохранены в непубличном архиве provenance.
- README, архитектура, visual/deploy контракты, asset manifest и developer case study синхронизированы с текущим исходным кодом.
- Node.js 24 закреплён в `.nvmrc`, `package.json` и lockfile.

## Проверенный release

- Source branch: `codex/prostor-master-redesign`.
- Stage 23 source commit: `f8bd6051c66c87ba401d2b7f1052c213928df235`.
- Release payload: `output/release-master-stage-23-base/`.
- 16 HTML и 198 файлов; missing refs=0, unreferenced CSS=0.
- Final browser gate: 21/21; reduced motion: 3/3; base-path smoke: 5/5.
- Production QA до feature freeze: 264/264 route checks в Chromium 154.0.8037.99 и WebKit 26.5; открытых P0/P1 нет.
- Accessibility gate: axe 0 violations на 16 маршрутах; keyboard 10/10, zoom 6/6, forced colors 4/4, text spacing 16/16, no-JS 16/16, reduced motion 16/16.
- Performance snapshot: HTML 123 381 bytes gzip, CSS 21 788 bytes gzip, initial JS 14 109 bytes gzip.
- Panorama variants: AVIF 142 085 / 327 219 / 656 798 bytes; WebP 130 922 / 342 182 / 802 006 bytes.
- Крупнейшие обычные responsive raster variants: 230 118 и 229 122 bytes.

## Известные ограничения

- Сайт не имеет backend, CMS, аналитики, оплаты или автоматической отправки формы.
- Сценарные цены, география, кейсы и границы услуг должен подтвердить будущий владелец до коммерческого использования.
- Лабораторный LCP панорамного кейса около 3,9 s остаётся принятым trade-off цельной 8192 texture.
- Проверены Chromium и Playwright WebKit; физический Safari/iPhone не проверялся.
- Annotated release tag не создан и требует отдельного явного подтверждения.

## Rollback point

Текущая публичная deploy-копия и `origin/main` находятся на `2803a3a1a56984235342fd8e7b133f4e31e8c97c` (`deploy: publish PROSTOR consultation handoff`). Это точка возврата, если будущая публикация будет отменена.
