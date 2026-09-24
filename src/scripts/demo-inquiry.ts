const form = document.querySelector<HTMLFormElement>('[data-inquiry]');

if (form) {
  const steps = [...form.querySelectorAll<HTMLFieldSetElement>('[data-step]')];
  const stepItems = [...form.querySelectorAll<HTMLElement>('.inquiry__progress li')];
  const nextButton = form.querySelector<HTMLButtonElement>('[data-next]')!;
  const backButton = form.querySelector<HTMLButtonElement>('[data-back]')!;
  const submitButton = form.querySelector<HTMLButtonElement>('[type="submit"]')!;
  const progress = form.querySelector<HTMLElement>('[data-progress]')!;
  const review = form.querySelector<HTMLElement>('[data-review]')!;
  const actions = form.querySelector<HTMLElement>('.inquiry__actions')!;
  const status = form.querySelector<HTMLElement>('.status')!;
  const files = form.elements.namedItem('files') as HTMLInputElement;
  const filesLabel = form.querySelector<HTMLElement>('[data-files]')!;
  const date = form.elements.namedItem('date') as HTMLInputElement;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let currentStep = 0;
  let transitioning = false;

  const field = <T extends HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(name: string) => form.elements.namedItem(name) as T;
  const toDateValue = (value: Date) => `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}`;
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const lastDate = new Date();
  lastDate.setDate(lastDate.getDate() + 90);
  date.min = toDateValue(tomorrow);
  date.max = toDateValue(lastDate);

  const errorElement = (control: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) => form.querySelector<HTMLElement>(`#${CSS.escape(control.name)}-error`);
  const wrapper = (control: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) => control.closest<HTMLElement>('.field, .upload, .consent');
  const hasValue = (control: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) => control instanceof HTMLInputElement && control.type === 'checkbox' ? control.checked : control.value.trim().length > 0;

  const setFieldState = (control: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement, message = '') => {
    if (message) control.setAttribute('aria-invalid', 'true');
    else control.removeAttribute('aria-invalid');
    errorElement(control)?.replaceChildren(message);
    const container = wrapper(control);
    container?.classList.toggle('has-error', Boolean(message));
    container?.classList.toggle('is-valid', !message && hasValue(control));
    if (control === files) container?.classList.toggle('has-files', Boolean(files.files?.length) && !message);
  };

  const validateControl = (control: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement, showError = true) => {
    let message = '';
    if (control instanceof HTMLInputElement && control.type === 'file') {
      const selected = [...(control.files ?? [])];
      if (selected.length > 6) message = 'Выберите не больше 6 файлов.';
      else if (selected.some((item) => item.size > 10_000_000)) message = 'Каждый файл должен быть не больше 10 МБ.';
      else if (selected.some((item) => !item.type.startsWith('image/') && item.type !== 'application/pdf')) message = 'Подойдут изображения или PDF.';
    } else if (control instanceof HTMLInputElement && control.type === 'checkbox') {
      if (control.required && !control.checked) message = 'Подтвердите согласие, чтобы собрать сводку.';
    } else if (control.required && !control.value.trim()) {
      message = 'Заполните это поле.';
    } else if (control.name === 'area' && (!/^\d+(?:[.,]\d+)?$/.test(control.value.trim()) || Number(control.value.replace(',', '.')) < 25 || Number(control.value.replace(',', '.')) > 500)) {
      message = 'Укажите площадь от 25 до 500 м².';
    } else if (control.name === 'phone') {
      const digits = control.value.match(/\d/g)?.length ?? 0;
      if (!/^\+?[0-9\s()\-]+$/.test(control.value.trim()) || digits < 10 || digits > 15) message = 'Введите телефон: от 10 до 15 цифр.';
    } else if (control.name === 'email' && control.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(control.value.trim())) {
      message = 'Проверьте адрес email.';
    } else if (control.name === 'date' && control.value) {
      const day = new Date(`${control.value}T12:00:00`).getDay();
      if (control.value < date.min || control.value > date.max || day === 0 || day === 1) message = 'Выберите вторник–субботу в ближайшие 90 дней.';
    }
    if (showError) setFieldState(control, message);
    return message;
  };

  const validateStep = (step: HTMLFieldSetElement) => {
    let firstInvalid: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | undefined;
    const controls = [...step.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('input, select, textarea')];
    controls.forEach((control) => {
      const message = validateControl(control);
      if (message && !firstInvalid) firstInvalid = control;
    });

    if (step === steps[3]) {
      const channel = field<HTMLSelectElement>('channel');
      const email = field<HTMLInputElement>('email');
      if (channel.value === 'Email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
        setFieldState(email, 'Введите email для выбранного способа связи.');
        firstInvalid ??= email;
      }
    }

    if (firstInvalid) {
      status.textContent = 'Проверьте отмеченные поля.';
      firstInvalid.focus();
      return false;
    }
    status.textContent = '';
    return true;
  };

  const syncProgress = () => {
    progress.textContent = `Шаг ${currentStep + 1} из ${steps.length}`;
    stepItems.forEach((item, index) => {
      item.classList.toggle('is-active', index === currentStep);
      item.classList.toggle('is-complete', index < currentStep);
      if (index === currentStep) item.setAttribute('aria-current', 'step');
      else item.removeAttribute('aria-current');
    });
    backButton.hidden = currentStep === 0;
    nextButton.hidden = currentStep === steps.length - 1;
    submitButton.hidden = currentStep !== steps.length - 1;
  };

  const focusStep = (step: HTMLFieldSetElement) => {
    const legend = step.querySelector<HTMLElement>('legend');
    legend?.focus({ preventScroll: true });
    legend?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
  };

  const showStep = async (nextStep: number, direction: 1 | -1) => {
    if (transitioning || nextStep === currentStep || nextStep < 0 || nextStep >= steps.length) return;
    transitioning = true;
    form.setAttribute('aria-busy', 'true');
    [backButton, nextButton, submitButton].forEach((button) => button.disabled = true);
    const outgoing = steps[currentStep];
    const incoming = steps[nextStep];
    const offset = 12 * direction;
    try {
      outgoing.getAnimations().forEach((animation) => animation.cancel());
      incoming.getAnimations().forEach((animation) => animation.cancel());
      if (!reducedMotion && 'animate' in outgoing) {
        await outgoing.animate([
          { opacity: 1, transform: 'translateX(0)' },
          { opacity: 0, transform: `translateX(${-offset}px)` }
        ], { duration: 120, easing: 'cubic-bezier(.22,.61,.36,1)', fill: 'forwards' }).finished.catch(() => undefined);
      }
      outgoing.getAnimations().forEach((animation) => animation.cancel());
      outgoing.hidden = true;
      incoming.hidden = false;
      currentStep = nextStep;
      syncProgress();
      if (!reducedMotion && 'animate' in incoming) {
        await incoming.animate([
          { opacity: 0, transform: `translateX(${offset}px)` },
          { opacity: 1, transform: 'translateX(0)' }
        ], { duration: 160, easing: 'cubic-bezier(.22,.61,.36,1)' }).finished.catch(() => undefined);
      }
      focusStep(incoming);
    } finally {
      outgoing.getAnimations().forEach((animation) => animation.cancel());
      incoming.getAnimations().forEach((animation) => animation.cancel());
      transitioning = false;
      form.removeAttribute('aria-busy');
      [backButton, nextButton, submitButton].forEach((button) => button.disabled = false);
    }
  };

  const formatDate = (value: string) => value ? new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${value}T12:00:00`)) : '—';
  const summaryFields: Array<[string, string, (value: string) => string]> = [
    ['type', 'Объект', (value) => value || '—'],
    ['service', 'Услуга', (value) => value || '—'],
    ['area', 'Площадь', (value) => value ? `${value} м²` : '—'],
    ['budget', 'Бюджет', (value) => value || '—'],
    ['location', 'Локация', (value) => value || '—'],
    ['condition', 'Состояние', (value) => value || '—'],
    ['start', 'Старт', (value) => value || '—'],
    ['comment', 'Комментарий', (value) => value || 'Не указан'],
    ['date', 'Дата', formatDate],
    ['time', 'Время', (value) => value || '—'],
    ['format', 'Формат', (value) => value || '—'],
    ['name', 'Имя', (value) => value || '—'],
    ['phone', 'Телефон', (value) => value || '—'],
    ['email', 'Email', (value) => value || 'Не указан'],
    ['channel', 'Связь', (value) => value || '—']
  ];

  const addSummaryRow = (list: HTMLDListElement, label: string, value: string) => {
    const row = document.createElement('div');
    const term = document.createElement('dt');
    const description = document.createElement('dd');
    term.textContent = label;
    description.textContent = value;
    row.append(term, description);
    list.append(row);
  };

  const renderReview = () => {
    const title = document.createElement('h2');
    title.textContent = 'Сводка готова';
    title.tabIndex = -1;
    const intro = document.createElement('p');
    intro.className = 'review__intro';
    intro.textContent = 'Проверьте данные перед разговором со студией.';
    const list = document.createElement('dl');
    summaryFields.forEach(([name, label, format]) => addSummaryRow(list, label, format(field<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(name).value.trim())));
    const selectedFiles = [...(files.files ?? [])];
    addSummaryRow(list, 'Файлы', selectedFiles.length ? selectedFiles.map((item) => item.name).join(', ') : 'Не выбраны');

    const completion = document.createElement('div');
    completion.className = 'review__success';
    const completionTitle = document.createElement('strong');
    completionTitle.textContent = 'Можно связаться со студией';
    const completionText = document.createElement('p');
    completionText.textContent = 'Данные и файлы остались в этом окне. Время консультации не забронировано: свяжитесь со студией по телефону или email, чтобы подтвердить встречу.';
    const edit = document.createElement('button');
    edit.type = 'button';
    edit.className = 'review__edit';
    edit.textContent = 'Изменить данные';
    edit.addEventListener('click', () => {
      review.hidden = true;
      steps[currentStep].hidden = false;
      actions.hidden = false;
      syncProgress();
      focusStep(steps[currentStep]);
    });
    completion.append(completionTitle, completionText, edit);
    review.replaceChildren(title, intro, list, completion);
    review.hidden = false;
    steps[currentStep].hidden = true;
    actions.hidden = true;
    progress.textContent = 'Сводка консультации';
    stepItems.forEach((item) => {
      item.classList.remove('is-active');
      item.classList.add('is-complete');
      item.removeAttribute('aria-current');
    });
    title.focus({ preventScroll: true });
    review.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
  };

  const query = new URLSearchParams(location.search);
  const serviceLabels: Record<string, string> = { planning: 'Планировочное решение', design: 'Полный дизайн-проект', supply: 'Комплектация', supervision: 'Авторский надзор', consultation: 'Консультация' };
  const typeLabels: Record<string, string> = { apartment: 'Квартира', house: 'Загородный дом' };
  const prefill: Record<string, string | null> = {
    service: serviceLabels[query.get('service') ?? ''] ?? query.get('service'),
    type: typeLabels[query.get('type') ?? ''] ?? query.get('type'),
    area: query.get('area')
  };
  Object.entries(prefill).forEach(([name, value]) => {
    if (!value) return;
    const control = field<HTMLInputElement | HTMLSelectElement>(name);
    if (control instanceof HTMLSelectElement) {
      const option = [...control.options].find((item) => item.value.toLocaleLowerCase('ru-RU') === value.toLocaleLowerCase('ru-RU') || item.text.toLocaleLowerCase('ru-RU') === value.toLocaleLowerCase('ru-RU'));
      if (option) control.value = option.value;
    } else control.value = value;
    setFieldState(control);
  });

  steps.forEach((step, index) => step.hidden = index !== currentStep);
  syncProgress();

  nextButton.addEventListener('click', () => {
    if (!transitioning && validateStep(steps[currentStep])) void showStep(currentStep + 1, 1);
  });
  backButton.addEventListener('click', () => {
    if (!transitioning) void showStep(currentStep - 1, -1);
  });

  files.addEventListener('change', () => {
    const selected = [...(files.files ?? [])];
    filesLabel.textContent = selected.length ? `Выбрано: ${selected.map((item) => item.name).join(', ')}` : 'Выбрать файлы';
    validateControl(files);
  });

  form.addEventListener('input', (event) => {
    const control = event.target;
    if (!(control instanceof HTMLInputElement || control instanceof HTMLSelectElement || control instanceof HTMLTextAreaElement)) return;
    status.textContent = '';
    if (control.getAttribute('aria-invalid') === 'true') validateControl(control);
    else setFieldState(control);
    if (control.name === 'channel' || control.name === 'email') {
      const email = field<HTMLInputElement>('email');
      if (field<HTMLSelectElement>('channel').value !== 'Email' && !email.value) setFieldState(email);
    }
  });

  form.addEventListener('change', (event) => {
    const control = event.target;
    if (control instanceof HTMLInputElement || control instanceof HTMLSelectElement || control instanceof HTMLTextAreaElement) validateControl(control);
  });

  form.addEventListener('focusout', (event) => {
    const control = event.target;
    if (!(control instanceof HTMLInputElement || control instanceof HTMLSelectElement || control instanceof HTMLTextAreaElement) || control.type === 'file') return;
    if (hasValue(control) || control.getAttribute('aria-invalid') === 'true') validateControl(control);
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (transitioning) return;
    if (currentStep < steps.length - 1) {
      if (validateStep(steps[currentStep])) void showStep(currentStep + 1, 1);
      return;
    }
    if (validateStep(steps[currentStep])) renderReview();
  });

  submitButton.disabled = false;
}
