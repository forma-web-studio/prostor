# GitHub Pages: граница публикации

Публичный URL: https://forma-web-studio.github.io/prostor/

Deploy repository: https://github.com/forma-web-studio/prostor, ветка `main`, публикация из корня. Локальный checkout `output/github-pages-prostor` является отдельным Git-репозиторием и не входит в source commit.

На момент мастер-этапа 23 публичная версия остаётся на deploy commit `2803a3a`. Source Stage 20–23 не публиковался. Этот документ описывает процедуру, но не является разрешением на push/deploy.

## Production environment

```powershell
$env:BASE_PATH='/prostor/'
$env:SITE_URL='https://forma-web-studio.github.io'
$env:SITE_INDEXABLE='true'
npm run build
```

`SITE_URL` содержит только origin; `/prostor/` задаётся отдельно через `BASE_PATH`. Без `SITE_INDEXABLE=true` build остаётся noindex. Indexable build без `SITE_URL` завершается ошибкой.

## Перед будущей публикацией

1. Выполнить clean install, check и production build.
2. Проверить 16 HTML, `robots.txt`, `sitemap.xml`, canonical/OG/base path, assets и отсутствие рабочих файлов.
3. Сравнить проверенный `dist` с `output/github-pages-prostor` read-only.
4. Только после явного решения пользователя синхронизировать статические файлы, сохранив `.git`, `.nojekyll` и лицензии.
5. Проверить diff deploy checkout, создать отдельный deploy commit и push `main`.
6. Дождаться успешного Pages run и повторить public HTTP/browser checks.

Точные deploy и rollback commands формируются на мастер-этапе 24. Stage 23 не изменяет deploy checkout, не создаёт release tag и ничего не публикует.
