
  function activateTab(container, tabEl) {
    const tabs = container.querySelectorAll('.pill.tab');
    const panels = container.querySelectorAll('.tab-panel');

    tabs.forEach(t => { t.classList.remove('is-active'); t.setAttribute('aria-selected', 'false'); });
    panels.forEach(p => p.classList.add('is-hidden'));

    const panel = container.querySelector(tabEl.dataset.target);
    tabEl.classList.add('is-active');
    tabEl.setAttribute('aria-selected', 'true');
    if (panel) panel.classList.remove('is-hidden');
  }

  document.addEventListener('click', e => {
    const tab = e.target.closest('.pill.tab[data-target]');
    if (!tab) return;
    activateTab(tab.closest('.score-update'), tab);
  });

  // Keyboard support: Enter or Space, plus Arrow Left/Right to move focus
  document.addEventListener('keydown', e => {
    const tab = e.target.closest('.pill.tab[data-target]');
    if (!tab) return;

    const container = tab.closest('.score-update');
    const tabs = [...container.querySelectorAll('.pill.tab')];
    const idx = tabs.indexOf(tab);

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      activateTab(container, tab);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      const next = tabs[(idx + 1) % tabs.length];
      next.focus();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prev = tabs[(idx - 1 + tabs.length) % tabs.length];
      prev.focus();
    }
  });

  const infoBtn = document.querySelector('.info');
  const infoModal = document.getElementById('infoModal');
  const infoClose = infoModal.querySelector('.info-close');

  infoBtn.addEventListener('click', () => {
    infoModal.classList.add('active');
  });

  infoClose.addEventListener('click', () => {
    infoModal.classList.remove('active');
  });

  // Optional: close if clicking outside the modal box
  infoModal.addEventListener('click', (e) => {
    if (e.target === infoModal) {
      infoModal.classList.remove('active');
    }
  });

