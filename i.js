document.addEventListener('DOMContentLoaded', () => {
  const badge = document.getElementById('interactionIcon');
  const badgeImg = document.getElementById('interactionImage');
  const sections = Array.from(document.querySelectorAll('.show-corner'));
  if (!badge || !badgeImg || sections.length === 0) return;

  let visibleCount = 0;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        console.log('IO', entry.target, 'isIntersecting:', entry.isIntersecting);
      const el = entry.target;
      if (entry.isIntersecting) {
        visibleCount++;
        const src = el.dataset.cornerImg;
        if (src) badgeImg.src = src;
        badge.classList.add('visible');
      } else {
        visibleCount = Math.max(0, visibleCount - 1);
        if (visibleCount === 0) badge.classList.remove('visible');
      }
    });
  }, { threshold: .25 });

  sections.forEach(s => io.observe(s));
});
