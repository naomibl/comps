const fadeLines = document.querySelectorAll('.fade-line');

window.addEventListener('scroll', () => {
  const windowHeight = window.innerHeight;

  fadeLines.forEach(line => {
    const rect = line.getBoundingClientRect();
    let fadeStart = windowHeight * 0.6;  
    let fadeEnd = 0;

    let opacity = (rect.top - fadeEnd) / (fadeStart - fadeEnd);
    opacity = Math.max(0, Math.min(1, opacity));

    line.style.opacity = opacity;
  });
});

//wait whats down there

gsap.registerPlugin(ScrollTrigger);

gsap.to("#stand", {
  y: -100,
  ease: "none",
  scrollTrigger: {
    trigger: "#stand-section",
    start: "top top",
    end: "bottom bottom",
    scrub: true
  }
});
gsap.to("#text-top", {
  y: 400,
  opacity: 1,
  ease: "power1.inOut",
  scrollTrigger: {
    trigger: "#stand-section",
    start: "top 80%",
    end: "bottom bottom",
    scrub: true
  }
});

let tl = gsap.timeline({
  scrollTrigger: {
    trigger: "#stand-section",
    start: "top top",
    end: "bottom bottom",
    scrub: true
  }
});

tl.to("#text-top", {
  y: 400,
  opacity: 1,
  duration: 0.4,
  ease: "power1.inOut"
})

.to("#text-bottom", {
  y: 400,
  opacity: 1,
  duration: 0.5,
  ease: "power1.inOut"
}, "<");

document.addEventListener("scroll", () => {
  const section = document.getElementById("upcloseContainer");
  const rect = section.getBoundingClientRect();
  const windowHeight = window.innerHeight;

  let progress = (windowHeight - rect.top) / rect.height;
  progress = Math.min(Math.max(progress, 0), 1);


  let adjusted = 0;
  if (progress < 0.5) {
    adjusted = 0; 
  } else if (progress >= 0.5 && progress <= 0.8) {
    adjusted = (progress - 0.3) / 0.4; 
  } else {
    adjusted = 1;
  }

  const colorValue = Math.round(255 * (1 - adjusted));
  section.style.backgroundColor = `rgb(${colorValue}, ${colorValue}, ${colorValue})`;

  const heading = section.querySelector("h2");
  heading.style.color = `rgb(${40 + 215 * adjusted}, ${40 + 215 * adjusted}, ${40 + 215 * adjusted})`;
});


//danger

document.addEventListener("DOMContentLoaded", () => {
  const bg = document.getElementById('danger-bg');
  const dangerImg = document.getElementById('danger-img');
  const wrapper = document.getElementById('coming-wrapper');


  function startDangerFlash() {
    bg.classList.add('bg-flash-active');
    dangerImg.classList.add('flash-active');
    dangerImg.style.opacity = 1;

    setTimeout(startComingSequence, 2000);
  }

  function startComingSequence() {
    const total = 18;
    let finishedCount = 0;

    for (let i = 0; i < total; i++) {
      const s = document.createElement('span');
      s.className = 'coming-word';
      s.textContent = "they're coming";

      const leftPct = 6 + Math.random() * (100 - 12);
      const topPct  = 10 + Math.random() * 80;
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
    run.textContent = 'RUN!';
    wrapper.appendChild(run);
  }


  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        startDangerFlash();
        observer.disconnect();
      }
    });
  }, { threshold: 0.5 });

  observer.observe(document.getElementById('danger-container'));
});
