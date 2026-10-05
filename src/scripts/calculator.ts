import { calculateServiceEstimate,formatEstimateRange,parseProjectArea,type ObjectKind } from '../data/services';

const calculator = document.querySelector<HTMLElement>('[data-calculator]');

if (calculator) {
  const form = calculator.querySelector<HTMLFormElement>('form')!;
  const result = calculator.querySelector<HTMLElement>('.calculator__result')!;
  const price = calculator.querySelector<HTMLElement>('[data-calc-price]')!;
  const term = calculator.querySelector<HTMLElement>('[data-calc-term]')!;
  const link = calculator.querySelector<HTMLAnchorElement>('[data-calc-link]')!;
  const area = form.elements.namedItem('area') as HTMLInputElement;
  const error = calculator.querySelector<HTMLElement>('#calc-area-error')!;
  const status = calculator.querySelector<HTMLElement>('[data-calc-status]')!;
  const typeLabels:Record<ObjectKind,string> = { apartment:'Квартира',house:'Загородный дом' };

  const update = (moveFocus = false, announce = false) => {
    const data = new FormData(form);
    const square = parseProjectArea(area.value);
    const service = String(data.get('service'));
    const kindValue = String(data.get('kind'));
    const kind:ObjectKind = kindValue === 'house' ? 'house' : 'apartment';
    const query = new URLSearchParams({ service,type:typeLabels[kind],area:area.value.trim() });
    link.href = `${link.pathname}?${query}`;
    result.classList.add('is-updating');
    requestAnimationFrame(() => result.classList.remove('is-updating'));

    if (square === null || square < 25 || square > 500) {
      area.setAttribute('aria-invalid','true');
      error.textContent = 'Укажите положительное число от 25 до 500 м².';
      price.textContent = '—';
      term.textContent = 'Исправьте площадь, чтобы увидеть диапазон.';
      if (announce) status.textContent = `Ошибка: ${error.textContent}`;
      if (moveFocus) area.focus();
      return false;
    }

    const estimate = calculateServiceEstimate(service,square,kind);
    if (!estimate) return false;
    area.removeAttribute('aria-invalid');
    error.textContent = '';
    price.textContent = formatEstimateRange(estimate.low,estimate.high);
    term.textContent = `Ориентировочный срок: ${estimate.weeks[0]}–${estimate.weeks[1]} недель`;
    if (announce) status.textContent = `${price.textContent}. ${term.textContent}`;
    return true;
  };

  form.addEventListener('submit',event => {
    event.preventDefault();
    update(true, true);
  });
  form.addEventListener('input',() => update());
  form.addEventListener('change',() => update(false, true));
  area.addEventListener('blur',() => {
    const square = parseProjectArea(area.value);
    if (square !== null) area.value = String(square).replace('.',',');
  });
  update();
}
