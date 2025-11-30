document.addEventListener("DOMContentLoaded", () => {
  console.log('farm.js: DOMContentLoaded - farm script running');

  const audio = document.getElementById("farm-audio");
  const farmSection = document.getElementById("farm-container");
  const faceSection = document.getElementById("face-container");

  function setVolumeSafe(v) {
    audio.volume = Math.max(0, Math.min(1, v));
  }

  window.addEventListener('scroll', () => {
  }, { passive: true });

  let started = false;
  let fadeRaf = null;
  function cancelFade() {
    if (fadeRaf) {
      cancelAnimationFrame(fadeRaf);
      fadeRaf = null;
    }
  }

  const fadeInAudio = (duration = 3000) => {
    cancelFade();
    const startTime = performance.now();
    const fade = (now) => {
      const t = Math.min(1, (now - startTime) / duration);
      setVolumeSafe(t);
      if (t < 1) {
        fadeRaf = requestAnimationFrame(fade);
      } else {
        fadeRaf = null;
      }
    };
    fadeRaf = requestAnimationFrame(fade);
  };

  const fadeOutAudio = (duration = 1000, onComplete) => {
    cancelFade();
    const startVol = Math.max(0, Math.min(1, Number(audio.volume) || 0));
    const t0 = performance.now();
    const step = (now) => {
      const p = Math.min(1, (now - t0) / duration);
      setVolumeSafe(startVol * (1 - p));
      if (p < 1) {
        fadeRaf = requestAnimationFrame(step);
      } else {
        fadeRaf = null;
        try { audio.pause(); } catch(e) {}
        setVolumeSafe(startVol); 
        started = false;
        if (typeof onComplete === 'function') onComplete();
      }
    };
    fadeRaf = requestAnimationFrame(step);
  };

  const farmObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !started) {
        console.log("farm.js: entering farm section — fade in");
        started = true;

        audio.muted = false;
        setVolumeSafe(0);

        const playPromise = audio.play();
        if (playPromise) playPromise.catch(() => console.warn("Audio cannot autoplay yet"));

        fadeInAudio(3000);
      }
    });
  }, { threshold: 0.1 });

  farmObserver.observe(farmSection);

  window.addEventListener("face-end", () => {
  if (started) {
    console.log("farm.js: THE END reached — fading out farm audio");
    fadeOutAudio(10);
  }
});
});