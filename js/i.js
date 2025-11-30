document.addEventListener('DOMContentLoaded', () => {
  
  const badge = document.getElementById('interactionIcon');
  const badgeImg = document.getElementById('interactionImage');
  const sections = Array.from(document.querySelectorAll('.show-corner'));
  if (!badge || !badgeImg || sections.length === 0) return;
  const prompt = document.createElement('div');
  prompt.innerText = 'HOVER';
  prompt.style.position = 'absolute';
  prompt.style.background = 'rgba(0, 0, 0, 0.6)';
  prompt.style.color = 'white';
  prompt.style.padding = '10px 15px';
  prompt.style.borderRadius = '6px';
  prompt.style.fontFamily = 'sans-serif';
  prompt.style.fontSize = '16px';
  prompt.style.pointerEvents = 'none';
  prompt.style.zIndex = '100';
  prompt.style.whiteSpace = 'nowrap';
  prompt.style.opacity = '0';
  prompt.style.transition = 'opacity 0.3s ease';
  badge.appendChild(prompt);

  const positionPrompt = () => {
    const rect = badge.getBoundingClientRect();
    prompt.style.right = `${rect.width + 8}px`;
    prompt.style.left = 'auto';
    prompt.style.top = `50%`;
    prompt.style.transform = 'translateY(-50%)';
  };
  positionPrompt();
  window.addEventListener('resize', positionPrompt);

  let visibleCount = 0;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const el = entry.target;
      if (entry.isIntersecting) {
        visibleCount++;
        const src = el.dataset.cornerImg;
        if (src) badgeImg.src = src;
        badge.classList.add('visible');

        if (el.id === 'army-image' || el.querySelector('#army-image')) {
          prompt.innerText = 'HOVER';
        } else {
          prompt.innerText = 'CLICK';
        }

        prompt.style.opacity = '1';
      } else {
        visibleCount = Math.max(0, visibleCount - 1);
        if (visibleCount === 0) {
          badge.classList.remove('visible');
          prompt.style.opacity = '0';
        }
      }
    });
  }, { threshold: 0.25 });

  sections.forEach(s => io.observe(s));
});
