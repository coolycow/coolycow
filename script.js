document.addEventListener('DOMContentLoaded', () => {
  const menuItems = document.querySelectorAll('.menu-item');
  const fileLinks = document.querySelectorAll('.file-link');
  const sections = document.querySelectorAll('.code-section');
  const statusItems = document.querySelectorAll('.status-item');

  // Клик по табам
  menuItems.forEach(item => {
    item.addEventListener('click', () => {
      menuItems.forEach(i => i.classList.remove('active'));
      fileLinks.forEach(l => l.classList.remove('active'));
      item.classList.add('active');
      const target = document.getElementById(item.dataset.target);
      const link = document.querySelector(`.file-link[href="#${item.dataset.target}"]`);
      if (link) link.classList.add('active');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Обновление активного таба и ссылки при скролле + статус-бар
  window.addEventListener('scroll', () => {
    let id = '';
    sections.forEach(sec => {
      const rect = sec.getBoundingClientRect();
      if (rect.top <= 80 && rect.bottom > 80) id = sec.id;
    });
    if (id) {
      menuItems.forEach(i => i.classList.toggle('active', i.dataset.target === id));
      fileLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${id}`));
    }
    const line = Math.floor(window.scrollY / 20) + 1;
    if (statusItems[2]) statusItems[2].textContent = `Ln ${line}, Col 1`;
  });
});
