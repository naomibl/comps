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