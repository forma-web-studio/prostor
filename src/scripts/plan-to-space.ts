export const initPlanToSpace = (root: HTMLElement) => {
  const comparison = root.querySelector<HTMLElement>('[data-comparison]');
  const handle = root.querySelector<HTMLButtonElement>('[data-handle]');
  const presets = root.querySelector<HTMLElement>('[data-presets]');
  const layers = [...root.querySelectorAll<HTMLElement>('[data-layer]')];
  if (!comparison || !handle || !presets) return;

  let value = 50;
  let activePointer: number | null = null;
  let startX = 0;
  let startY = 0;
  let pointerMode: 'pending' | 'horizontal' | 'vertical' = 'pending';

  const valueText = (next: number) => {
    if (next === 0) return 'Только вид комнаты сверху';
    if (next === 100) return 'Только план';
    return `${next}% плана, ${100 - next}% вида сверху`;
  };

  const setValue = (next: number) => {
    value = Math.max(0, Math.min(100, Math.round(next)));
    comparison.style.setProperty('--split', `${value}%`);
    handle.setAttribute('aria-valuenow', String(value));
    handle.setAttribute('aria-valuetext', valueText(value));
    presets.querySelectorAll<HTMLButtonElement>('[data-value]').forEach((button) => {
      button.setAttribute('aria-pressed', String(Number(button.dataset.value) === value));
    });
  };

  const setValueFromPointer = (clientX: number) => {
    const rect = comparison.getBoundingClientRect();
    setValue(((clientX - rect.left) / rect.width) * 100);
  };

  const finishPointer = (event: PointerEvent) => {
    if (activePointer !== event.pointerId) return;
    if (comparison.hasPointerCapture(event.pointerId)) comparison.releasePointerCapture(event.pointerId);
    activePointer = null;
    pointerMode = 'pending';
  };

  comparison.addEventListener('pointerdown', (event) => {
    if (event.button !== 0 || activePointer !== null) return;
    activePointer = event.pointerId;
    startX = event.clientX;
    startY = event.clientY;
    pointerMode = event.pointerType === 'touch' ? 'pending' : 'horizontal';
    if (pointerMode === 'horizontal') {
      comparison.setPointerCapture(event.pointerId);
      setValueFromPointer(event.clientX);
    }
  });

  comparison.addEventListener('pointermove', (event) => {
    if (activePointer !== event.pointerId) return;
    if (pointerMode === 'pending') {
      const deltaX = event.clientX - startX;
      const deltaY = event.clientY - startY;
      if (Math.hypot(deltaX, deltaY) < 10) return;
      pointerMode = Math.abs(deltaX) > Math.abs(deltaY) ? 'horizontal' : 'vertical';
      if (pointerMode === 'horizontal') comparison.setPointerCapture(event.pointerId);
    }
    if (pointerMode !== 'horizontal') return;
    event.preventDefault();
    setValueFromPointer(event.clientX);
  });

  comparison.addEventListener('pointerup', finishPointer);
  comparison.addEventListener('pointercancel', finishPointer);

  handle.addEventListener('keydown', (event) => {
    const keys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'];
    if (!keys.includes(event.key)) return;
    event.preventDefault();
    if (event.key === 'Home') setValue(0);
    else if (event.key === 'End') setValue(100);
    else setValue(value + (event.key === 'ArrowRight' || event.key === 'ArrowUp' ? 5 : -5));
  });

  presets.querySelectorAll<HTMLButtonElement>('[data-value]').forEach((button) => {
    button.addEventListener('click', () => setValue(Number(button.dataset.value)));
  });

  layers.forEach((layer) => layer.setAttribute('aria-hidden', 'true'));
  handle.hidden = false;
  presets.hidden = false;
  root.classList.add('is-ready');
  root.setAttribute('data-ready', '');
  setValue(value);
};
