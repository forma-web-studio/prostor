const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');

document.querySelectorAll<HTMLElement>('[data-panorama]').forEach((panorama) => {
  const viewport = panorama.querySelector<HTMLElement>('[data-panorama-viewport]');
  const track = panorama.querySelector<HTMLElement>('[data-panorama-track]');
  const progress = panorama.querySelector<HTMLElement>('[data-panorama-progress]');
  if (!viewport || !track || !progress) return;

  let offset = 0;
  let maxOffset = 0;
  let pointerId: number | null = null;
  let axis: 'x' | 'y' | null = null;
  let startX = 0;
  let startY = 0;
  let startOffset = 0;
  let lastTime = 0;
  let velocity = 0;
  let inertiaFrame = 0;

  const clamp = (value: number) => Math.min(maxOffset, Math.max(0, value));
  const render = (value: number) => {
    offset = clamp(value);
    const ratio = maxOffset > 0 ? offset / maxOffset : 0;
    track.style.setProperty('--pan-x', `${-offset}px`);
    progress.style.setProperty('--pan-progress', `${ratio * 100}%`);
    viewport.setAttribute('aria-valuenow', String(Math.round(ratio * 100)));
    viewport.setAttribute('aria-valuetext', `${Math.round(ratio * 100)}% панорамы`);
  };
  const stopInertia = () => {
    cancelAnimationFrame(inertiaFrame);
    inertiaFrame = 0;
  };
  const measure = (keepRatio = true) => {
    const previousRatio = maxOffset > 0 ? offset / maxOffset : (reduceMotion.matches ? .5 : .12);
    maxOffset = Math.max(0, track.scrollWidth - viewport.clientWidth);
    render(keepRatio ? maxOffset * previousRatio : offset);
    panorama.dataset.panoramaReady = '';
    viewport.tabIndex = 0;
  };
  const beginInertia = () => {
    if (reduceMotion.matches || Math.abs(velocity) < .02) return;
    let previous = performance.now();
    const tick = (time: number) => {
      const elapsed = Math.min(32, time - previous);
      previous = time;
      velocity *= Math.pow(.92, elapsed / 16);
      const next = clamp(offset + velocity * elapsed);
      const reachedEdge = next === offset && (next === 0 || next === maxOffset);
      render(next);
      if (!reachedEdge && Math.abs(velocity) >= .02) inertiaFrame = requestAnimationFrame(tick);
      else inertiaFrame = 0;
    };
    inertiaFrame = requestAnimationFrame(tick);
  };

  viewport.addEventListener('pointerdown', (event) => {
    if (!event.isPrimary || event.button !== 0) return;
    stopInertia();
    pointerId = event.pointerId;
    axis = null;
    startX = event.clientX;
    startY = event.clientY;
    startOffset = offset;
    lastTime = performance.now();
    velocity = 0;
  });
  viewport.addEventListener('pointermove', (event) => {
    if (event.pointerId !== pointerId) return;
    const deltaX = event.clientX - startX;
    const deltaY = event.clientY - startY;
    if (!axis) {
      if (Math.hypot(deltaX, deltaY) < 10) return;
      axis = Math.abs(deltaX) > Math.abs(deltaY) * 1.1 ? 'x' : 'y';
      if (axis === 'x') {
        viewport.setPointerCapture(event.pointerId);
        viewport.classList.add('is-dragging');
      }
    }
    if (axis !== 'x') return;
    if (event.cancelable) event.preventDefault();
    const now = performance.now();
    const next = clamp(startOffset - deltaX);
    velocity = Math.max(-.55, Math.min(.55, (next - offset) / Math.max(1, now - lastTime)));
    lastTime = now;
    render(next);
  });
  const finishPointer = (event: PointerEvent) => {
    if (event.pointerId !== pointerId) return;
    const horizontal = axis === 'x';
    if (horizontal && viewport.hasPointerCapture(event.pointerId)) viewport.releasePointerCapture(event.pointerId);
    viewport.classList.remove('is-dragging');
    pointerId = null;
    axis = null;
    if (horizontal) beginInertia();
  };
  viewport.addEventListener('pointerup', finishPointer);
  viewport.addEventListener('pointercancel', finishPointer);
  viewport.addEventListener('keydown', (event) => {
    const step = Math.max(64, viewport.clientWidth * .12);
    const target = event.key === 'ArrowLeft' ? offset - step
      : event.key === 'ArrowRight' ? offset + step
      : event.key === 'Home' ? 0
      : event.key === 'End' ? maxOffset
      : null;
    if (target === null) return;
    event.preventDefault();
    stopInertia();
    render(target);
  });

  const observer = new ResizeObserver(() => measure());
  observer.observe(viewport);
  track.querySelector('img')?.addEventListener('load', () => measure(), { once:true });
  reduceMotion.addEventListener('change', () => {
    stopInertia();
    render(reduceMotion.matches ? maxOffset * .5 : offset);
  });
  requestAnimationFrame(() => measure());
});
