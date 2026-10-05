const form = document.querySelector<HTMLFormElement>('[data-inquiry]');

if (form) {
  const steps = [...form.querySelectorAll<HTMLFieldSetElement>('[data-step]')];
  const stepItems = [...form.querySelectorAll<HTMLElement>('.inquiry__progress li')];
  const optionalSections = [...form.querySelectorAll<HTMLDetailsElement>('[data-optional]')];
  const nextButton = form.querySelector<HTMLButtonElement>('[data-next]')!;
  const backButton = form.querySelector<HTMLButtonElement>('[data-back]')!;
  const submitButton = form.querySelector<HTMLButtonElement>('[type="submit"]')!;
  const progress = form.querySelector<HTMLElement>('[data-progress]')!;
  const review = form.querySelector<HTMLElement>('[data-review]')!;
  const actions = form.querySelector<HTMLElement>('.inquiry__actions')!;
  const privacyNote = form.querySelector<HTMLElement>('.privacy-note')!;
  const status = form.querySelector<HTMLElement>('.status')!;
  const contactError = form.querySelector<HTMLElement>('#contact-error')!;
  const files = form.elements.namedItem('files') as HTMLInputElement;
  const filesLabel = form.querySelector<HTMLElement>('[data-files]')!;
  const date = form.elements.namedItem('date') as HTMLInputElement;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let currentStep = 0;
  let transitioning = false;
  let showingReview = false;

  form.dataset.enhanced = '';
  form.querySelector<HTMLElement>('.inquiry__progress')!.hidden = false;
  actions.hidden = false;

  const field = <T extends HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(name: string) => form.elements.namedItem(name) as T;
  const toDateValue = (value: Date) => `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}`;
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const lastDate = new Date();
  lastDate.setDate(lastDate.getDate() + 90);
  date.min = toDateValue(tomorrow);
  date.max = toDateValue(lastDate);

  const errorElement = (control: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) => form.querySelector<HTMLElement>(`#${CSS.escape(control.name)}-error`);
  const wrapper = (control: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) => control.closest<HTMLElement>('.field, .upload');
  const hasValue = (control: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) => control.value.trim().length > 0;

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
    const value = control.value.trim();
    if (control instanceof HTMLInputElement && control.type === 'file') {
      const selected = [...(control.files ?? [])];
      const allowedName = /\.(?:avif|gif|heic|jpe?g|pdf|png|webp)$/i;
      if (selected.length > 6) message = 'Выберите не больше 6 файлов.';
      else if (selected.some((item) => item.size > 10_000_000)) message = 'Каждый файл должен быть не больше 10 МБ.';
      else if (selected.some((item) => !allowedName.test(item.name))) message = 'Подойдут изображения или PDF.';
    } else if (control.required && !value) {
      message = 'Заполните это поле.';
    } else if (control.name === 'area' && value && (!/^\d+(?:[.,]\d+)?$/.test(value) || Number(value.replace(',', '.')) < 1 || Number(value.replace(',', '.')) > 5000)) {
      message = 'Укажите площадь числом от 1 до 5000 м².';
    } else if (control.name === 'phone' && value) {
      const digits = value.match(/\d/g)?.length ?? 0;
      if (!/^\+?[0-9\s()\-]+$/.test(value) || digits < 10 || digits > 15) message = 'Введите телефон: от 10 до 15 цифр.';
    } else if (control.name === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      message = 'Проверьте формат email.';
    } else if (control.name === 'date' && value) {
      const day = new Date(`${value}T12:00:00`).getDay();
      if (value < date.min || value > date.max || day === 0 || day === 1) message = 'Выберите вторник–субботу в ближайшие 90 дней.';
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

    if (step === steps[0]) {
      const phone = field<HTMLInputElement>('phone');
      const email = field<HTMLInputElement>('email');
      if (!phone.value.trim() && !email.value.trim()) {
        contactError.textContent = 'Оставьте телефон или email.';
        phone.setAttribute('aria-invalid', 'true');
        email.setAttribute('aria-invalid', 'true');
        firstInvalid ??= phone;
      } else {
        contactError.textContent = '';
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

  const showStep = async (nextStep: number, direction: 1 | -1, moveFocus = true) => {
    if (transitioning || nextStep === currentStep || nextStep < 0 || nextStep >= steps.length) return;
    transitioning = true;
    showingReview = false;
    review.hidden = true;
    actions.hidden = false;
    privacyNote.hidden = false;
    form.setAttribute('aria-busy', 'true');
    [backButton, nextButton, submitButton].forEach((button) => button.disabled = true);
    const outgoing = steps[currentStep];
    const incoming = steps[nextStep];
    const offset = 12 * direction;
    try {
      outgoing.getAnimations().forEach((animation) => animation.cancel());
      incoming.getAnimations().forEach((animation) => animation.cancel());
      if (!reducedMotion && 'animate' in outgoing) {
        await outgoing.animate([{ opacity: 1, transform: 'translateX(0)' }, { opacity: 0, transform: `translateX(${-offset}px)` }], { duration: 120, easing: 'cubic-bezier(.22,.61,.36,1)', fill: 'forwards' }).finished.catch(() => undefined);
      }
      outgoing.getAnimations().forEach((animation) => animation.cancel());
      outgoing.hidden = true;
      incoming.hidden = false;
      currentStep = nextStep;
      syncProgress();
      if (!reducedMotion && 'animate' in incoming) {
        await incoming.animate([{ opacity: 0, transform: `translateX(${offset}px)` }, { opacity: 1, transform: 'translateX(0)' }], { duration: 160, easing: 'cubic-bezier(.22,.61,.36,1)' }).finished.catch(() => undefined);
      }
      if (moveFocus) focusStep(incoming);
    } finally {
      outgoing.getAnimations().forEach((animation) => animation.cancel());
      incoming.getAnimations().forEach((animation) => animation.cancel());
      transitioning = false;
      form.removeAttribute('aria-busy');
      [backButton, nextButton, submitButton].forEach((button) => button.disabled = false);
    }
  };

  const formatDate = (value: string) => value ? new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${value}T12:00:00`)) : '';
  const summaryFields: Array<[string, string, (value: string) => string]> = [
    ['name', 'Имя', (value) => value],
    ['phone', 'Телефон', (value) => value],
    ['email', 'Email', (value) => value],
    ['type', 'Объект', (value) => value],
    ['service', 'Услуга', (value) => value],
    ['area', 'Площадь', (value) => value ? `${value} м²` : ''],
    ['budget', 'Бюджет', (value) => value],
    ['location', 'Локация', (value) => value],
    ['condition', 'Состояние', (value) => value],
    ['start', 'Старт', (value) => value],
    ['comment', 'Комментарий', (value) => value],
    ['date', 'Предпочтительная дата', formatDate],
    ['time', 'Предпочтительное время', (value) => value],
    ['format', 'Предпочтительный формат', (value) => value]
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

  const renderReview = (moveFocus = true) => {
    const title = document.createElement('h2');
    title.id = 'inquiry-review-title';
    title.textContent = 'Заявка не отправлена';
    title.tabIndex = -1;
    const intro = document.createElement('p');
    intro.className = 'review__intro';
    intro.textContent = 'Ниже — сводка для проверки. Она существует только в текущем окне браузера.';
    const list = document.createElement('dl');
    summaryFields.forEach(([name, label, format]) => {
      const value = format(field<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(name).value.trim());
      if (value) addSummaryRow(list, label, value);
    });
    const selectedFiles = [...(files.files ?? [])];
    if (selectedFiles.length) addSummaryRow(list, 'Файлы', selectedFiles.map((item) => item.name).join(', '));

    const notice = document.createElement('div');
    notice.className = 'review__notice';
    const noticeTitle = document.createElement('strong');
    noticeTitle.textContent = 'Время не забронировано';
    const noticeText = document.createElement('p');
    noticeText.textContent = 'Данные и файлы никуда не ушли. Чтобы начать разговор и согласовать время, свяжитесь со студией по телефону или email, указанным рядом с формой.';
    const edit = document.createElement('button');
    edit.type = 'button';
    edit.className = 'review__edit';
    edit.textContent = 'Вернуться к редактированию';
    edit.addEventListener('click', () => history.back());
    notice.append(noticeTitle, noticeText, edit);
    review.replaceChildren(title, intro, list, notice);
    review.hidden = false;
    steps.forEach((step) => step.hidden = true);
    actions.hidden = true;
    privacyNote.hidden = true;
    status.textContent = '';
    showingReview = true;
    progress.textContent = 'Проверка данных';
    stepItems.forEach((item) => {
      item.classList.remove('is-active');
      item.classList.add('is-complete');
      item.removeAttribute('aria-current');
    });
    if (moveFocus) {
      title.focus({ preventScroll: true });
      review.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
    }
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

  optionalSections.forEach((section) => section.removeAttribute('open'));
  steps.forEach((step, index) => step.hidden = index !== currentStep);
  history.replaceState({ ...history.state, inquiryStep: 0, inquiryView: 'step' }, '');
  syncProgress();

  nextButton.addEventListener('click', () => {
    if (transitioning || !validateStep(steps[currentStep])) return;
    const nextStep = currentStep + 1;
    history.pushState({ ...history.state, inquiryStep: nextStep, inquiryView: 'step' }, '');
    void showStep(nextStep, 1);
  });
  backButton.addEventListener('click', () => {
    if (!transitioning) history.back();
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
    if (control.name === 'phone' || control.name === 'email') {
      contactError.textContent = '';
      field<HTMLInputElement>('phone').removeAttribute('aria-invalid');
      field<HTMLInputElement>('email').removeAttribute('aria-invalid');
    }
    if (control.getAttribute('aria-invalid') === 'true') validateControl(control);
    else setFieldState(control);
    if (showingReview) history.back();
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
      if (!validateStep(steps[currentStep])) return;
      const nextStep = currentStep + 1;
      history.pushState({ ...history.state, inquiryStep: nextStep, inquiryView: 'step' }, '');
      void showStep(nextStep, 1);
      return;
    }
    if (!validateStep(steps[currentStep])) return;
    history.pushState({ ...history.state, inquiryStep: currentStep, inquiryView: 'review' }, '');
    renderReview();
  });

  const syncHistoryState = (state: { inquiryStep?: number; inquiryView?: string } | null) => {
    if (transitioning) {
      window.setTimeout(() => syncHistoryState(state), 50);
      return;
    }
    const nextStep = state?.inquiryStep === 1 ? 1 : 0;
    if (state?.inquiryView === 'review') {
      currentStep = nextStep;
      renderReview(false);
      return;
    }
    if (showingReview) {
      showingReview = false;
      review.hidden = true;
      actions.hidden = false;
      privacyNote.hidden = false;
      steps.forEach((step, index) => step.hidden = index !== nextStep);
      currentStep = nextStep;
      syncProgress();
      focusStep(steps[currentStep]);
      return;
    }
    if (nextStep !== currentStep) void showStep(nextStep, nextStep > currentStep ? 1 : -1);
  };

  addEventListener('popstate', (event) => {
    syncHistoryState(event.state as { inquiryStep?: number; inquiryView?: string } | null);
  });

  submitButton.disabled = false;
}
