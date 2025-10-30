const image = document.getElementById("frames");
image.style.width = "1000px";
image.style.height = "600px";
image.style.objectFit = "cover";
image.style.display = "block";
image.style.margin = "40px auto";
image.style.border = "2px solid black";

const cover = "/Nikoants/frame1.jpeg";
const frames = ["/Nikoants/frame1.jpeg", "/Nikoants/frame3.jpeg", "/Nikoants/frame2.jpeg"]; // flashing images
const squished = "/Nikoants/squished.jpeg"; 
    let intervalId = null;
    let frameIndex = 0;
    let steps = 0; 
    let isHolding = false;
    let isSquished = false;

    function startAnimation() {

       if (isSquished) {
    resetAnimation();
    return;
  }


      if (intervalId) return;
  isHolding = true;

  intervalId = setInterval(() => {
    if (!isHolding) return; // safety check

    image.src = frames[frameIndex];
    frameIndex = (frameIndex + 1) % frames.length;
    steps++;


    if (steps >= 20 && isHolding) {
      clearInterval(intervalId);
      intervalId = null;
      image.src = squished;
      isSquished = true; 
      isHolding = false;
    }
  }, 130);
    }

    function stopAnimation() {
      isHolding = false;
      clearInterval(intervalId);
      intervalId = null;
       if (steps < 20) {
        image.src = cover;
      }
    }

    function resetAnimation() {
      clearInterval(intervalId);
      intervalId = null;
      frameIndex = 0;
      steps = 0;
      image.src = cover; 
      isHolding = false;
      isSquished = false;
    }
    image.addEventListener("mousedown", startAnimation);
    image.addEventListener("mouseup", stopAnimation);
    image.addEventListener("mouseleave", stopAnimation);


const text = document.querySelector('.lookup-text');
const section = document.querySelector('.lookup-container');

function updateLookupText() {
  const rect = section.getBoundingClientRect();
  const viewportHeight = window.innerHeight;

  const sectionInView = rect.top <= viewportHeight && rect.bottom >= 0;

  if (sectionInView) {
    text.style.visibility = 'visible';
    text.style.opacity = 1;

    let progress = 1 - rect.bottom / (viewportHeight + rect.height);
    progress = Math.max(-5, progress - 0.55);
    const shift = -progress * 400;
    text.style.transform = `translate(-50%, -50%) translateX(${shift}vw)`;
  } else {
    text.style.opacity = 0;
    text.style.visibility = 'hidden';
  }
}

gsap.registerPlugin(ScrollTrigger);

gsap.timeline({
  scrollTrigger: {
    trigger: ".lookup-container",
    start: "top center",
    end: "bottom center",
    scrub: true,
  }
})
.to("#fade-overlay", { backgroundColor: "red", opacity: 1 }, 0.2)
.to("#fade-overlay", { backgroundColor: "black", opacity: 1 }, 0.35)
.to("#fade-overlay", { backgroundColor: "white", opacity: 1 }, 0.99)
.to("#fade-overlay", { opacity: 0 }, 1);

window.addEventListener('DOMContentLoaded', updateLookupText);
window.addEventListener('scroll', updateLookupText);

