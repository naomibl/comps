document.addEventListener("DOMContentLoaded", () => {
  const audio = document.getElementById("eating-audio");
  const walkingSection = document.getElementById("walking-section");

  if (!walkingSection || !audio) return;
  audio.loop = true;
  audio.volume = 0;
  audio.muted = true;
  audio.setAttribute('playsinline', '');
  audio.play().catch(() => {});
    const MAX_VOLUME = 0.35;
  let fadeRaf = null;
  let sectionVisible = false;

  const cancelFade = () => {
    if (fadeRaf) cancelAnimationFrame(fadeRaf);
    fadeRaf = null;
  };

  const fadeTo = (target, duration = 1000, onComplete) => {
    cancelFade();
    const startVol = audio.volume;
    const delta = target - startVol;
    const t0 = performance.now();

    const step = (now) => {
      const p = Math.min(1, (now - t0) / duration);
      audio.volume = Math.max(0, Math.min(MAX_VOLUME, startVol + delta * p));
      if (p < 1) {
        fadeRaf = requestAnimationFrame(step);
      } else {
        fadeRaf = null;
        if (onComplete) onComplete();
      }
    };

    fadeRaf = requestAnimationFrame(step);
  };

  const fadeInAudio = (duration = 1000) => {
    audio.muted = false;
    audio.play().catch(() => {});
    fadeTo(1, duration);
  };

  const fadeOutAudio = (duration = 1000) => {
    fadeTo(0, duration, () => {
      audio.pause();
      audio.muted = true;
    });
  };
const checkScroll = () => {
    const rect = walkingSection.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const isVisible = rect.bottom > 0 && rect.top < windowHeight;

    if (isVisible && !sectionVisible) {
      sectionVisible = true;
      fadeInAudio(1200);
    } 

    if (sectionVisible && rect.bottom <= windowHeight) {
      sectionVisible = false;
      fadeOutAudio(500);
    }
  };

  window.addEventListener("scroll", checkScroll);
  window.addEventListener("resize", checkScroll);
  checkScroll();
});