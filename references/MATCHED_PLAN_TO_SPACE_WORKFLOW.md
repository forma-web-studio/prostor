# Matched plan-to-space workflow

Повторяемый процесс для интерактивного сопоставления плана и пространства в интерьерных кейсах.

## 1. Сначала пространство, затем интерфейс

Не проектировать splitter до появления согласованной пары изображений. Сначала зафиксировать прямоугольник помещения, стены, окна, двери, встроенную мебель, крупную мебель и маршруты. Эти данные оформляются отдельным пространственным паспортом проекта.

## 2. Канонический вид сверху

- Создать один полный top-down render без перспективного наклона.
- В кадре должны полностью помещаться стены и все значимые предметы.
- Зафиксировать crop и aspect ratio до создания плана.
- Не генерировать план и render независимо: случайно похожие изображения не являются matched pair.

## 3. План как трассировка render

- План строится поверх канонического top-down в тех же координатах.
- Стены, проёмы, окна и крупная мебель должны совпадать при opacity 50%.
- Подписи и стрелки не должны перекрывать геометрическую сверку.
- Если нет подтверждённых размеров, не показывать размерные цепочки и не называть схему рабочим чертежом.

## 4. Производные перспективные кадры

- Каждый новый кадр использует spatial spec и предыдущий утверждённый кадр как references.
- В prompt отдельно повторяются инварианты: сторона окон, положение проёма, ориентация стола, число стульев, положение хранения и мягкой зоны.
- Меняется только камера или крупность. Геометрия, материалы и набор предметов остаются прежними.
- При конфликте красивого кадра с планом приоритет имеет согласованность, а кадр пересоздаётся.

## 5. Asset gate

Перед подключением к сайту проверить:

- одинаковые границы и aspect ratio matched pair;
- наложение 0/50/100 без скачка объектов;
- совпадение минимум пяти якорей: стены, окно, проём, стол, хранение;
- отсутствие добавленных дверей, мебели и декоративных объектов;
- достаточную детализацию для реального размера на desktop;
- естественные материалы без пластиковой CGI-фактуры;
- отсутствие текста, водяных знаков и артефактов.

## 6. Интерфейс

- Интерактив оправдан только если визуальное совпадение считывается без поясняющего абзаца.
- По умолчанию достаточно одного спокойного splitter и короткой подписи.
- Не добавлять переключатели решений, если они не раскрывают независимые пространственные изменения.
- Keyboard: Arrow/Home/End; touch: directional lock, не блокирующий вертикальный scroll; handle не менее 44×44 px.
- Reduced motion: мгновенное изменение. No-JS: обе стороны доступны без скрытого содержания.

## 7. QA и документация

- Сохранить spatial spec, финальные prompts, SHA-256 исходников и причины отклонения неудачных вариантов.
- Проверить 0/50/100 на desktop, tablet и mobile; отдельно keyboard, touch, reduced motion и no-JS.
- Рабочие паспорта, prompts, source renders и QA-файлы не копировать в публичную сборку.
- После приёмки обновить manifest, implementation status, общий handoff и changelog.

## 8. Шаблон prompt для канонического top-down

```text
Use case: photorealistic-natural
Asset type: canonical top-down interior render for a matched plan-to-space comparison
Input images: Image 1..N are approved perspective views of the same room and define geometry, materials and furniture identity.
Primary request: create a new photorealistic strictly orthographic bird's-eye view of the entire same room, camera exactly 90 degrees down.
Room geometry: [shape]; windows [wall]; doors/openings [wall and order]; storage [wall]; dining group [position, orientation, chair count]; living group [position and orientation]; clear circulation [route].
Style/medium: premium natural architectural visualization, believable material grain, no dollhouse treatment.
Composition/framing: landscape [ratio]; entire room and boundaries visible; zero perspective tilt; no cropped furniture.
Lighting/mood: preserve the approved direction and temperature of daylight.
Constraints: preserve reference room identity and exact object relationships; no added doors, rooms or furniture; no text, labels, dimensions, logo or watermark.
Avoid: oblique axonometric camera, isometric view, fisheye, changed furniture count, changed orientation, glossy CGI surfaces.
```

Перед генерацией перечислить положение каждого крупного объекта словами. Формулировки `left/right`, `parallel/perpendicular` проверять относительно вида сверху, а не перспективного кадра.

## 9. Шаблон correction prompt

Если один объект нарушает паспорт, не перегенерировать всю сцену:

```text
Use case: precise-object-edit
Input images: Image 1 is the edit target; Image 2..N prove the approved geometry.
Primary request: edit only [object]. Move/rotate it to [exact position and orientation].
Constraints: preserve camera, crop, walls, openings, all other furniture, materials, lighting and shadows exactly unchanged.
Avoid: changing the room, adding/removing furniture, changing object count or camera angle.
```

После correction снова пройти весь asset gate: локальная правка может незаметно изменить соседние предметы.

