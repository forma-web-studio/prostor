const storageKey = 'prostor-project-transition';
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const supportsSharedTransition = CSS.supports('view-transition-name: project-media') && 'onpagereveal' in window;

type ProjectTransitionIntent = { slug: string; pathname: string; createdAt: number };

const readIntent = (): ProjectTransitionIntent | null => {
  try {
    const value = sessionStorage.getItem(storageKey);
    if (!value) return null;
    const intent = JSON.parse(value) as ProjectTransitionIntent;
    if (!intent.slug || !intent.pathname || Date.now() - intent.createdAt > 10_000) return null;
    return intent;
  } catch {
    return null;
  }
};

const clearIntent = () => {
  try { sessionStorage.removeItem(storageKey); } catch { /* Navigation remains a normal link. */ }
};

document.addEventListener('click', (event) => {
  if (event.defaultPrevented || event.button !== 0) return;
  const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[data-project-link]');
  if (!link || link.target === '_blank' || link.origin !== location.origin) return;
  const slug = link.dataset.projectLink;
  const media = link.querySelector<HTMLElement>(`[data-project-media="${slug}"]`);
  if (!slug || !media) return;
  try {
    sessionStorage.setItem(storageKey, JSON.stringify({ slug, pathname:link.pathname, createdAt:Date.now() } satisfies ProjectTransitionIntent));
  } catch { /* Focus and navigation still use native browser behavior. */ }
  if (supportsSharedTransition && !reducedMotion.matches) media.style.setProperty('view-transition-name', `project-${slug}`);
}, { capture:true });

const intent = readIntent();
if (intent && intent.pathname === location.pathname) {
  clearIntent();
  const hero = document.querySelector<HTMLElement>(`[data-project-hero="${intent.slug}"]`);
  const heading = document.querySelector<HTMLElement>('main h1');
  if (hero && supportsSharedTransition && !reducedMotion.matches) {
    document.documentElement.classList.add('project-transition-active');
    hero.style.setProperty('view-transition-name', `project-${intent.slug}`);
  }

  let focused = false;
  const focusHeading = () => {
    if (focused || !heading) return;
    focused = true;
    heading.tabIndex = -1;
    heading.focus({ preventScroll:true });
    heading.addEventListener('blur', () => heading.removeAttribute('tabindex'), { once:true });
    hero?.style.removeProperty('view-transition-name');
    document.documentElement.classList.remove('project-transition-active');
  };

  if (supportsSharedTransition) {
    window.addEventListener('pagereveal', (event) => {
      const transition = (event as Event & { viewTransition?: { finished: Promise<void> } }).viewTransition;
      if (transition) transition.finished.finally(focusHeading);
      else focusHeading();
    }, { once:true });
    window.setTimeout(focusHeading, 800);
  } else {
    window.addEventListener('pageshow', focusHeading, { once:true });
  }
} else if (intent) {
  clearIntent();
}
