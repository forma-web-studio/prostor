# Материалы изображений — этап 1

Все фотографии в текущей сборке локальны: `src/assets/images/projects/`. Они выводятся встроенным `astro:assets` с адаптивными вариантами и не являются документальной съёмкой работ вымышленной студии.

## Фотографии

### Этап 2: локальные иллюстрации, созданные для учебных концептов

Шесть файлов ниже сгенерированы встроенным ImageGen 09.09.2026 для несуществующих учебных объектов, а не загружены со стока. Они не изображают выполненные работы и подписаны в интерфейсе как визуальное направление.

| Локальный файл | Роль |
| --- | --- |
| `dom-u-sada-detail-1.png`, `dom-u-sada-detail-2.png` | Два изображения «Дом у сада» |
| `tishina-goroda-detail-1.png`, `tishina-goroda-detail-2.png` | Два изображения «Тишина города» |
| `liniya-lesa-detail-1.png`, `liniya-lesa-detail-2.png` | Два изображения «Линия леса» |

Источник лицензии: [Pexels License](https://www.pexels.com/license/) — бесплатное использование материалов Pexels для личных и коммерческих целей; проверено также по [справке Pexels](https://help.pexels.com/hc/en-us/articles/360042295174-What-is-the-license-of-the-photos-and-videos-on-Pexels). Атрибуция не обязательна по лицензии, но указана здесь для прозрачности.

| Локальный файл | Роль | Автор | Исходная страница | Лицензия |
| --- | --- | --- | --- | --- |
| `svet-i-dub-hero.jpg` | Hero главной и cover кейса «Свет и дуб» | Max Vakhtbovych | https://www.pexels.com/photo/large-lounge-with-soft-sofa-under-window-on-ceiling-6587847/ | Pexels License |
| `svet-i-dub-detail-1.jpg` | Первое изображение визуального направления | Rachel Claire | https://www.pexels.com/photo/interior-of-living-room-with-wooden-furniture-4846114/ | Pexels License |
| `svet-i-dub-detail-2.jpg` | Второе изображение визуального направления | Ksenia Chernaya | https://www.pexels.com/photo/modern-living-room-interior-8987431/ | Pexels License |
| `dom-u-sada-cover.jpg` | Обложка «Дом у сада» и иллюстрация подхода | Max Vakhtbovych | https://www.pexels.com/photo/cozy-living-room-interior-with-wooden-furniture-and-comfy-couch-6636320/ | Pexels License |
| `tishina-goroda-cover.jpg` | Обложка «Тишина города» | Max Vakhtbovych | https://www.pexels.com/photo/a-modern-living-room-7166931/ | Pexels License |
| `liniya-lesa-cover.jpg` | Обложка «Линия леса» | Erik Mclean | https://www.pexels.com/photo/modern-living-room-interior-with-furniture-in-house-5120081/ | Pexels License |

`svet-i-dub-cover.jpg` — ранний, неиспользуемый файл подбора; он не импортируется и не входит в сайт. Его можно удалить при следующей уборке материалов, но он не влияет на output.

## Шрифты

- Prata 400 и Manrope Variable подключаются из локальных npm-пакетов Fontsource версии 5.2.6: `@fontsource/prata` и `@fontsource-variable/manrope`.
- В CSS использованы наборы с кириллицей: `400.css` для Prata и `wght.css` для Manrope Variable. Семейство Manrope в пакете называется `Manrope Variable`; это имя применено к body.
- Исходные font-файлы и OFL-1.1 находятся в пакетах после `npm ci`: `node_modules/@fontsource/prata/{files,LICENSE}` и `node_modules/@fontsource-variable/manrope/{files,LICENSE}`. Финальная build-проверка подтверждает локальную передачу кириллических WOFF2 в output.
