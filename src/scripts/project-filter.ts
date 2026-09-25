const validTypes = new Set(['apartment', 'house']);

document.querySelectorAll<HTMLElement>('[data-project-catalog]').forEach((catalog) => {
  const buttons = [...catalog.querySelectorAll<HTMLButtonElement>('[data-project-filter]')];
  const items = [...catalog.querySelectorAll<HTMLElement>('[data-project-item]')];
  const count = catalog.querySelector<HTMLElement>('[data-project-count]');

  const labelForCount = (value: number) => {
    const mod10 = value % 10;
    const mod100 = value % 100;
    const noun = mod10 === 1 && mod100 !== 11 ? 'проект' : mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14) ? 'проекта' : 'проектов';
    return `Показано: ${value} ${noun}`;
  };

  const typeFromLocation = () => {
    const value = new URL(window.location.href).searchParams.get('type');
    return value && validTypes.has(value) ? value : 'all';
  };

  const normalizeUnknownType = () => {
    const url = new URL(window.location.href);
    const value = url.searchParams.get('type');
    if (!value || validTypes.has(value)) return;
    url.searchParams.delete('type');
    history.replaceState(history.state, '', `${url.pathname}${url.search}${url.hash}`);
  };

  const updateUrl = (type: string) => {
    const url = new URL(window.location.href);
    if (type === 'all') url.searchParams.delete('type');
    else url.searchParams.set('type', type);
    history.pushState({ projectType:type }, '', `${url.pathname}${url.search}${url.hash}`);
  };

  const apply = (type: string, push = false) => {
    const activeType = validTypes.has(type) ? type : 'all';
    buttons.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.projectFilter === activeType)));

    const visible = items.filter((item) => {
      const show = activeType === 'all' || item.dataset.projectKind === activeType;
      item.hidden = !show;
      return show;
    });

    visible.forEach((item, index) => {
      item.dataset.layout = activeType === 'all' ? item.dataset.defaultLayout : index === 0 ? 'lead' : 'support';
    });
    catalog.dataset.visibleCount = String(visible.length);
    if (count) count.textContent = labelForCount(visible.length);
    if (push) updateUrl(activeType);
  };

  buttons.forEach((button) => button.addEventListener('click', () => apply(button.dataset.projectFilter ?? 'all', true)));
  window.addEventListener('popstate', () => {
    normalizeUnknownType();
    apply(typeFromLocation());
  });

  normalizeUnknownType();
  apply(typeFromLocation());
});
