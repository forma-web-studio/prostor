# PROSTOR release handoff

Release candidate готов к решению пользователя, но не опубликован. Stage 24 не выполняет push, deploy, изменение deploy checkout или создание tag.

## Текущее состояние

- Source branch: `codex/prostor-master-redesign`.
- Принятый Stage 23: `f8bd6051c66c87ba401d2b7f1052c213928df235`.
- Публичный deploy: `2803a3a1a56984235342fd8e7b133f4e31e8c97c` на `output/github-pages-prostor/main`.
- Публичный URL: https://forma-web-studio.github.io/prostor/.
- Source Stage 20-24 не опубликован.
- Release tag не создан.

Stage history и итоговые ограничения зафиксированы в `IMPLEMENTATION_STATUS.md`. Пользовательские и технические изменения перечислены в `docs/RELEASE_NOTES.md`.

## Read-only comparison с deploy checkout

Побайтово сравнены `output/release-master-stage-23-base/` и site payload из `output/github-pages-prostor`. `.git`, `.nojekyll` и два deploy-only файла лицензий исключены из сравнения и должны быть сохранены при публикации.

| Результат | Количество |
| --- | ---: |
| Release payload | 198 файлов |
| Текущий deploy payload | 197 файлов |
| Совпадают побайтово | 175 |
| Будут добавлены | 6 |
| Будут изменены | 17 |
| Устаревшие hashed assets будут удалены | 5 |

Добавляются `sitemap.xml` и пять новых hashed CSS/JS файлов. Изменяются 16 HTML-файлов и `robots.txt`. Удаляются только пять заменённых hashed CSS/JS файлов. Deploy-only `.nojekyll`, `licenses/Manrope-OFL.txt` и `licenses/Prata-OFL.txt` остаются без изменения.

Deploy checkout после сравнения остался чистым на `2803a3a`; копирование и commit не выполнялись.

## Финальные доказательства

- Отчёт: `output/playwright/master-stage-23/QA_REPORT.md`.
- Desktop contact sheet: `output/playwright/master-stage-23/contact-sheet-desktop.jpg`.
- Tablet contact sheet: `output/playwright/master-stage-23/contact-sheet-tablet.jpg`.
- Mobile contact sheet: `output/playwright/master-stage-23/contact-sheet-mobile.jpg`.
- Reduced-motion contact sheet: `output/playwright/master-stage-23/contact-sheet-reduced-motion.jpg`.
- Key interaction evidence: `output/playwright/master-stage-21/` и `output/playwright/master-stage-23/final-smoke.json`.
- Проверенные release copies: `output/release-master-stage-23-root/` и `output/release-master-stage-23-base/`.

## Точные команды будущей публикации

Выполнять только после отдельной явной команды пользователя на push и deploy.

```powershell
Set-Location -LiteralPath 'C:\Users\fimoz\Documents\ChatGPT\сайты\01-prostor'

$sourceRoot = (Resolve-Path '.').Path
$deployRoot = (Resolve-Path '.\output\github-pages-prostor').Path
$expectedDeployRoot = 'C:\Users\fimoz\Documents\ChatGPT\сайты\01-prostor\output\github-pages-prostor'
$rollbackDeployCommit = '2803a3a1a56984235342fd8e7b133f4e31e8c97c'

if ($sourceRoot -ne 'C:\Users\fimoz\Documents\ChatGPT\сайты\01-prostor') { throw 'Unexpected source root' }
if ($deployRoot -ne $expectedDeployRoot) { throw 'Unexpected deploy root' }
if ((git branch --show-current).Trim() -ne 'codex/prostor-master-redesign') { throw 'Unexpected source branch' }
if (git status --porcelain) { throw 'Source worktree is not clean' }
if ((git -C $deployRoot branch --show-current).Trim() -ne 'main') { throw 'Unexpected deploy branch' }
if (git -C $deployRoot status --porcelain) { throw 'Deploy worktree is not clean' }
if ((git -C $deployRoot rev-parse HEAD).Trim() -ne $rollbackDeployCommit) { throw 'Deploy HEAD changed; repeat comparison first' }

npm ci --no-audit --no-fund
npm run check
$distRoot = Join-Path $sourceRoot 'dist'
if (Test-Path -LiteralPath $distRoot) {
  $resolvedDistRoot = (Resolve-Path $distRoot).Path
  if ($resolvedDistRoot -ne 'C:\Users\fimoz\Documents\ChatGPT\сайты\01-prostor\dist') {
    throw 'Unexpected dist root'
  }
  Remove-Item -LiteralPath $resolvedDistRoot -Recurse -Force
}
$env:BASE_PATH = '/prostor/'
$env:SITE_URL = 'https://forma-web-studio.github.io'
$env:SITE_INDEXABLE = 'true'
npm run build
Remove-Item Env:BASE_PATH,Env:SITE_URL,Env:SITE_INDEXABLE

$payloadRoot = (Resolve-Path '.\dist').Path
$htmlCount = @(Get-ChildItem -LiteralPath $payloadRoot -Recurse -Filter '*.html' -File).Count
$fileCount = @(Get-ChildItem -LiteralPath $payloadRoot -Recurse -File).Count
if ($htmlCount -ne 16 -or $fileCount -ne 198) { throw "Unexpected build inventory: HTML=$htmlCount files=$fileCount" }

git push origin codex/prostor-master-redesign

$protectedNames = @('.git', '.nojekyll', 'licenses')
Get-ChildItem -LiteralPath $deployRoot -Force |
  Where-Object { $protectedNames -notcontains $_.Name } |
  ForEach-Object {
    $target = $_.FullName
    if (-not $target.StartsWith($deployRoot + '\', [System.StringComparison]::OrdinalIgnoreCase)) {
      throw "Refusing to remove path outside deploy checkout: $target"
    }
    Remove-Item -LiteralPath $target -Recurse -Force
  }

Get-ChildItem -LiteralPath $payloadRoot -Force |
  Copy-Item -Destination $deployRoot -Recurse -Force

git -C $deployRoot status --short
git -C $deployRoot diff --check
git -C $deployRoot diff --stat
git -C $deployRoot add --all
git -C $deployRoot commit -m 'deploy: publish PROSTOR master release candidate'
$releaseDeployCommit = (git -C $deployRoot rev-parse HEAD).Trim()
git -C $deployRoot push origin main
$releaseDeployCommit
```

После push нужно дождаться successful GitHub Pages run, проверить все 15 обычных URL, 404, assets, canonical/OG/robots/sitemap и повторить public Chromium/WebKit smoke. Успешный push сам по себе не является подтверждением успешной публикации.

## Точные команды rollback

Rollback создаёт новый безопасный commit и не переписывает историю. Значение `$releaseDeployCommit` берётся из вывода deploy-команд выше.

```powershell
$deployRoot = 'C:\Users\fimoz\Documents\ChatGPT\сайты\01-prostor\output\github-pages-prostor'
$rollbackDeployCommit = '2803a3a1a56984235342fd8e7b133f4e31e8c97c'
$releaseDeployCommit = '<commit printed by the deploy command>'

if ((Resolve-Path $deployRoot).Path -ne $deployRoot) { throw 'Unexpected deploy root' }
if ((git -C $deployRoot branch --show-current).Trim() -ne 'main') { throw 'Unexpected deploy branch' }
if (git -C $deployRoot status --porcelain) { throw 'Deploy worktree is not clean' }
if ((git -C $deployRoot rev-parse HEAD).Trim() -ne $releaseDeployCommit) { throw 'Deploy HEAD changed; do not rollback blindly' }

git -C $deployRoot revert --no-edit $releaseDeployCommit
$rollbackCommit = (git -C $deployRoot rev-parse HEAD).Trim()
git -C $deployRoot diff --exit-code $rollbackDeployCommit $rollbackCommit
git -C $deployRoot push origin main
$rollbackCommit
```

После rollback также требуется дождаться successful Pages run и повторить public HTTP/browser checks.

## Решение пользователя

Допустимы два следующих шага:

1. Принять release candidate. Это фиксирует приёмку, но само по себе не разрешает deploy, push или tag; для каждого внешнего действия нужна отдельная явная команда.
2. Вернуть конкретный мастер-этап на исправление с точным замечанием.

До решения пользователя работа остановлена.
