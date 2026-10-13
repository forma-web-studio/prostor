# Материалы ПРОСТОРА

Этот рабочий manifest хранит provenance, роль и контрольные суммы. Публичный интерфейс не показывает служебные AI/demo/учебные пометки. Кейсы названы «Интерьерными концепциями» и не заявлены реализованными объектами.

## Runtime assets

Ниже перечислены все исходники из `src/assets/images`, которые импортирует приложение. Других raster-файлов в runtime-дереве нет.

| Файл | Размер | SHA-256 | Назначение |
| --- | ---: | --- | --- |
| `panorama/dom-u-sada-panorama-360.png` | 8192×2731 | `3DB23F9362D6AD945476BE4B22CD508B919A21D647150E045BB3B43EF4B96C24` | Source 360° panorama для главной и «Дома у сада» |
| `projects/svet-i-dub-cover.png` | 1536×1024 | `D57F83AC10719264CA6EC26CB3F79344415E609D7DA63C696F742642ADB28DFC` | Cover/hero «Свет и дуб» |
| `projects/svet-i-dub-detail-1.png` | 1122×1402 | `D3BD2BEB8209C23E2E4CEC97A1163DA0E59ABF49322EC9172F797F51A4925DF9` | Материальная деталь «Свет и дуб» |
| `projects/svet-i-dub-top-down.png` | 1536×1024 | `BC8E37739DB40EEC7FAA03820C883A7AA46C371DE80A88D8A5E35ED2C306FF97` | Matched top-down для PlanToSpace |
| `projects/svet-i-dub-plan.svg` | 1536×1024 viewBox | `1FB248C06666B081F6EEBEB005C6025A67FB056F0AE709E119EC8A25C3FF1DB5` | План в координатах matched top-down |
| `projects/dom-u-sada-detail-1.png` | 1536×1024 | `8B4BBE0D988E1AA91C64CDE9ADF09D0DDF16A8E3D31DECB0FF58FD1B956936EF` | Cover/evidence «Дом у сада» |
| `projects/dom-u-sada-detail-2.png` | 1122×1402 | `FCB260655189E26D689AE2415EC68E904049FA241E885F1AECB2CFE2840D6570` | Detail/evidence «Дом у сада» |
| `projects/tishina-goroda-detail-1.png` | 1536×1024 | `8FC7E5E2A947425AE84FC58C9110ECFFF5B0BB5B6F60D49F238128C4C63780C8` | Cover/evidence «Тишина города» |
| `projects/tishina-goroda-detail-2.png` | 1122×1402 | `10933338321B79B920CEE85C9F339331F96B3BBFE23A22022C0BCE054A915825` | Detail/evidence «Тишина города» |
| `projects/liniya-lesa-detail-1.png` | 1536×1024 | `465F299318C5082FFCE4921587AEA85C96CD65A37DFF8ED28ED75FB45C17C48A` | Cover/evidence «Линия леса» |
| `projects/liniya-lesa-detail-2.png` | 1122×1402 | `CB47BFCFB6EB436D77BDE0E906713BEE1E246EB1BBCA956C1508F01CBBBC5AE1` | Detail/evidence «Линия леса» |

Девять интерьерных PNG созданы встроенным ImageGen в сентябре 2026 года. Промпты исключали людей, текст, логотипы, телевизоры и декоративную LED-подсветку. Они используются как визуализации концепций, а не фотографии выполненных заказов.

## Панорама

Пользовательский исходный master сохранён в `references/panorama/dom-u-sada-panorama-360-master.png` (2172×724, SHA-256 `7CC61674947C01E32FA1E9AB45D5C87242E559E0CCBC18B86BB03E7E75193C11`). ImageGen master v3 имеет SHA-256 `AEBC1AF075E590CC68861D7A39029D5B1111E11F28BFF8015647EA9664688107`; master v4 — `A00D8CB6852038A5E2A7980290AE70B8F7806BDC32EED668A75D86226C7C3678`.

Для естественного сада отдельно созданы центральный и правый sectors: `1BF17B8EAE478A281A7385E927E9647B381C439D693DF307D06F6E818AC99E15` и `F65E9CD0DBC9891BCD6125FC1F36FB1A2008FA5A2BCA5F0608F1824854CE32D6`. Ботаническим референсом служила свободная фотография тосканской оливковой рощи Andreas Weilguny на Unsplash; её пиксели напрямую в delivery asset не копировались.

Real-ESRGAN и `scripts/process-panorama.mjs` сформировали source 8192×2731. Финальный 16 px seam pass дал текущий hash `3DB23F...C24`. Astro выпускает AVIF quality 55 и WebP quality 58 в 2048/4096/8192. Chromium выбирает AVIF, WebKit fallback — WebP; WebGL использует тот же browser-selected `currentSrc`.

## Matched plan-to-space

`svet-i-dub-top-down.png` создан ImageGen по утверждённым перспективным кадрам и единому spatial passport. Первый вариант с неверной ориентацией стола был отклонён до интеграции. `svet-i-dub-plan.svg` трассирует финальный top-down в той же системе координат без размерных цепочек и без притворной технической точности.

Источник пространственных инвариантов: `references/SVET_I_DUB_SPATIAL_SPEC.md`. Повторяемый процесс: `references/MATCHED_PLAN_TO_SPACE_WORKFLOW.md`. Оба файла остаются непубличной рабочей документацией.

## Public assets

| Файл | Размер | SHA-256 | Назначение |
| --- | ---: | --- | --- |
| `public/og/prostor.jpg` | 1200×630 | `415169FFED578D5289BB1A5FB2DFBA96FA8DBCB2AA481E596D06644AE2703B69` | Open Graph/Twitter preview |
| `public/favicon.svg` | vector | `7E05432010DF091BF65BED8C91D310D21285EA3D27A9FF77E94E911BB4558E8C` | Favicon |

Шрифты Prata 400 и Manrope Variable поставляются локально пакетами Fontsource 5.2.6 по SIL Open Font License 1.1.

## Архивные predecessor assets

В Stage 23 восемь доказанно неимпортируемых JPEG перемещены из `src/assets` в `references/archive/runtime-predecessors/`: прежняя плоская panorama delivery, четыре ранних covers и три ранних кадра «Свет и дуб». Они сохранены для истории и provenance, но больше не находятся в runtime asset tree и не попадают в build.

Masters, промежуточные ImageGen/Real-ESRGAN материалы, prompts, screenshots и QA не входят в статическую публикацию.
