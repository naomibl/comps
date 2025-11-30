
document.addEventListener("DOMContentLoaded", () => {
  const elements = Array.from(document.querySelectorAll(".typewriter"));

  let currentIndex = 0;  
  let isTyping = false;  

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const element = entry.target;
        element.dataset.visible = "true";
        tryStartTyping();
      }
    });
  }, { threshold: 0.6 });

  elements.forEach(el => observer.observe(el));

  function tryStartTyping() {
    if (isTyping) return;

    const el = elements[currentIndex];

    if (el && el.dataset.visible && !el.dataset.done) {
      typeWriter(el, el.dataset.text, 35);
    }
  }

  function typeWriter(element, text, speed) {
    let i = 0;
    isTyping = true;
    element.textContent = "";

    function tick() {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(tick, speed);
      } else {
                element.dataset.done = "true";
        isTyping = false;
        currentIndex++;

        tryStartTyping();
      }
    }
    tick();
  }
});

