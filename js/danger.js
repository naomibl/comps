//danger
document.addEventListener("DOMContentLoaded", () => {
  const wrapper = document.getElementById('coming-wrapper');

  function startComingSequence() {
    const total = 25;
    let finishedCount = 0;

    for (let i = 0; i < total; i++) {
        const s = document.createElement('span');
        s.className = 'coming-word';
        s.textContent = "they're coming";

        const leftPct =  -10 + Math.random() * 90; 
        const topPct  = 5 + Math.random() * 90;
        const size = Math.round(20 + Math.random() * 75);
        const delay = (Math.random() * 0.9).toFixed(2) + 's';
        const dur = (0.55 + Math.random() * 0.5).toFixed(2) + 's';
        const iters = 2 + Math.floor(Math.random() * 3);

    Object.assign(s.style, {
        left: leftPct + '%',
        top: topPct + '%',
        fontSize: size + 'px',
        animationDelay: delay,
        animationDuration: dur,
        animationIterationCount: iters
      });

      s.addEventListener('animationend', () => {
        if (s.parentNode) s.remove();
        finishedCount++;
        if (finishedCount === total) showRunText();
      }, { once: true });

      wrapper.appendChild(s);
    }
  }

  function showRunText() {
    const run = document.createElement('span');
    run.className = 'run-text';
    run.textContent = 'RUN';
    wrapper.appendChild(run);
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        startComingSequence();
        observer.disconnect();
      }
    });
  }, { threshold: 0.5 });

  observer.observe(document.getElementById('danger-container'));
});

