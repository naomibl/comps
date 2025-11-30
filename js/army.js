function magnify(imgID, zoom) {
  const img = document.getElementById(imgID);
  const lens = document.createElement("div");
  lens.className = "army-lens";
  img.parentElement.appendChild(lens);

  lens.style.backgroundImage = `url('${img.src}')`;
  lens.style.backgroundRepeat = "no-repeat";
  lens.style.display = "none";

  function updateBackgroundSize() {
    const rect = img.getBoundingClientRect();
    lens.style.backgroundSize = `${rect.width * zoom}px ${rect.height * zoom}px`;
  }
  updateBackgroundSize();
  window.addEventListener("resize", updateBackgroundSize);

  function moveLens(e) {
    e.preventDefault();
    lens.style.display = "block";

    const rect = img.getBoundingClientRect();
    let x = e.clientX - rect.left - lens.offsetWidth / 2;
    let y = e.clientY - rect.top - lens.offsetHeight / 2;

    x = Math.max(0, Math.min(x, rect.width - lens.offsetWidth));
    y = Math.max(0, Math.min(y, rect.height - lens.offsetHeight));

    lens.style.left = x + "px";
    lens.style.top = y + "px";

    lens.style.backgroundPosition = `-${x * zoom}px -${y * zoom}px`;
  }

  img.addEventListener("mousemove", moveLens);
  img.addEventListener("touchmove", moveLens);
  img.addEventListener("mouseleave", () => {
    lens.style.display = "none";
  });
  img.addEventListener("touchend", () => {
    lens.style.display = "none";
  });
}

magnify("army-image", 1.5);

//audio
document.addEventListener("DOMContentLoaded", () => {
  const audio = document.getElementById("army-audio");
  const armySection = document.getElementById("army-container") || document.querySelector("#army-container.show-corner") || document.querySelector(".show-corner");
  console.log('armySection selector result:', armySection);
  if (!armySection) {
    console.warn('army.js: element #army-container not found — aborting audio observer');
    return;
  }
  if (!audio) {
    console.warn('army.js: element #army-audio not found — aborting audio setup');
    return;
  }
  let MAX_VOLUME = 0.4;
  let started = false;
  let fadeRaf = null;

  const cancelFade = () => {
    if (fadeRaf) {
      cancelAnimationFrame(fadeRaf);
      fadeRaf = null;
    }
  };

  const fadeTo = (targetVolume = MAX_VOLUME, duration = 1000, onComplete) => {
    cancelFade();
    const startVol = Number(audio.volume) || 0;
    const delta = targetVolume - startVol;
    const t0 = performance.now();
    const step = (now) => {
      const p = Math.min(1, (now - t0) / duration);
      audio.volume = Math.max(0, Math.min(1, startVol + delta * p));
      if (p < 1) {
        fadeRaf = requestAnimationFrame(step);
      } else {
        fadeRaf = null;
        if (typeof onComplete === 'function') onComplete();
      }
    };
    fadeRaf = requestAnimationFrame(step);
  };

  const fadeInAudio = (duration = 1000) => {
    audio.muted = false;
    audio.volume = 0;
    const playPromise = audio.play();
    if (playPromise && typeof playPromise.then === 'function') {
      playPromise.then(() => {
        started = true;
        fadeTo(1, duration);
      }).catch(err => {
        console.warn('Army audio play blocked:', err);
        audio.muted = true;
        audio.play().catch(()=>{});
        started = true;
      });
    } else {
      started = true;
      fadeTo(1, duration);
    }
  };

  const fadeOutAudio = (duration = 1000) => {
    fadeTo(0, duration, () => {
      try { audio.pause(); } catch (e) {}
      audio.muted = true;
      started = false;
    });
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (!started) {
          fadeInAudio(1500);
        } else {
          cancelFade();
          fadeTo(1, 800);
        }
      } else {
        if (started) {
          fadeOutAudio(1200);
        }
      }
    });
  }, { threshold: 0.25 });

  audio.loop = true;
  audio.setAttribute('playsinline', '');
  audio.muted = true;
  audio.volume = 1;
  audio.play().catch(()=>{});

  observer.observe(armySection);
});

