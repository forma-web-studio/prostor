const calculator = document.querySelector<HTMLElement>('[data-calculator]');

if (calculator) {
  const form = calculator.querySelector('form')!;
  const result = calculator.querySelector<HTMLElement>('.calculator__result')!;
  const price = calculator.querySelector<HTMLElement>('[data-calc-price]')!;
  const term = calculator.querySelector<HTMLElement>('[data-calc-term]')!;
  const link = calculator.querySelector<HTMLAnchorElement>('[data-calc-link]')!;
  const area = form.elements.namedItem('area') as HTMLInputElement;
  const error = calculator.querySelector<HTMLElement>('#calc-area-error')!;
  const rates: Record<string, number> = { planning: 1100, design: 4200, supply: 900 };
  const typeLabels: Record<string, string> = { apartment: 'Квартира', house: 'Загородный дом' };

  const update = () => {
    const data = new FormData(form);
    const value = area.value.trim().replace(',', '.');
    const square = Number(value);
    const service = String(data.get('service'));
    const kind = String(data.get('kind'));
    const rate = rates[service] || 1100;
    const house = kind === 'house';
    const query = new URLSearchParams({ service, type: typeLabels[kind] || kind, area: area.value });
    link.href = `${link.pathname}?${query}`;
    result.classList.add('is-updating');
    requestAnimationFrame(() => result.classList.remove('is-updating'));

    if (!/^\d+(\.\d+)?$/.test(value) || square < 25 || square > 500) {
      area.setAttribute('aria-invalid', 'true');
      error.textContent = 'Укажите площадь от 25 до 500 м².';
      price.textContent = '—';
      term.textContent = 'Введите площадь, чтобы увидеть диапазон.';
      return;
    }

    area.removeAttribute('aria-invalid');
    error.textContent = '';
    const base = Math.max(rate > 2000 ? 320000 : 90000, square * rate * (house ? 1.14 : 1));
    const round = (amount: number) => Math.round(amount / 5000) * 5000;
    const low = round(base * .94);
    const high = round(base * 1.15);
    price.textContent = `${low.toLocaleString('ru-RU')}–${high.toLocaleString('ru-RU')} ₽`;
    term.textContent = `Ориентировочный срок: ${rate > 2000 ? `${Math.max(12, Math.round(square / 10 + 7))}–${Math.max(16, Math.round(square / 8 + 9))} недель` : `${Math.max(3, Math.round(square / 30))}–${Math.max(5, Math.round(square / 20 + 1))} недель`}`;
  };

  form.addEventListener('submit', (event) => event.preventDefault());
  form.addEventListener('input', update);
  form.addEventListener('change', update);
  update();
}
