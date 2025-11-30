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
  y: 550,
  opacity: 1,
  ease: "power1.inOut",
  scrollTrigger: {
    trigger: "#stand-section",
    start: "top 60%",      
    end: "bottom bottom",
    scrub: true
  }
});

gsap.to("#text-bottom", {
  y: 350,
  opacity: 1,
  ease: "power1.inOut",
  scrollTrigger: {
    trigger: "#stand-section",
    start: "top -50%",       
    end: "bottom 50%",
    scrub: true
  }
});

//up close
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


