const image = document.getElementById("frames");

image.style.width = "1000px";
image.style.height = "600px";
image.style.objectFit = "cover";
image.style.display = "block";
image.style.margin = "40px auto";
image.style.border = "2px solid black";

image.parentElement.style.position = 'relative';

const squishText = document.createElement('div');
squishText.innerText = 'SPLAT';
squishText.style.position = 'absolute';
squishText.style.bottom = '230px'; 
squishText.style.right = '270px';  
squishText.style.fontSize = '120px';
squishText.style.fontWeight = 'bold';
squishText.style.color = '#8b0000';
squishText.style.fontStyle = 'italic'; 
squishText.style.fontFamily = 'Bebas Neue';
squishText.style.pointerEvents = 'none';
squishText.style.opacity = '0';
image.parentElement.appendChild(squishText);

const cover = "/assets/drawings/frame1.jpeg";
const frames = ["/assets/drawings/frame1.jpeg", "/assets/drawings/frame3.jpeg", "/assets/drawings/frame2.jpeg"];
const squished = "/assets/drawings/squish.jpg"; 
let intervalId = null;
let frameIndex = 0;
let steps = 0; 
let isHolding = false;
let isSquished = false;

function startAnimation() {
  if (isSquished) { resetAnimation(); return; }
  if (intervalId) return;
  isHolding = true;

  intervalId = setInterval(() => {
    if (!isHolding) return;

    image.src = frames[frameIndex];
    frameIndex = (frameIndex + 1) % frames.length;
    steps++;

    if (steps >= 20 && isHolding) {
      clearInterval(intervalId);
      intervalId = null;
      image.src = squished;
      isSquished = true; 
      isHolding = false;
      squishText.style.opacity = '1';
    }
  }, 130);
}

function stopAnimation() {
  isHolding = false;
  clearInterval(intervalId);
  intervalId = null;
  if (steps < 20) image.src = cover;
}

function resetAnimation() {
  clearInterval(intervalId);
  intervalId = null;
  frameIndex = 0;
  steps = 0;
  image.src = cover; 
  isHolding = false;
  isSquished = false;
  squishText.style.opacity = '0';
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
.to("#fade-overlay", { opacity: 1 }, 1);

window.addEventListener('DOMContentLoaded', updateLookupText);
window.addEventListener('scroll', updateLookupText);

//audio
const squishedAudio = document.getElementById("squished-audio"); 
const chatAudio = document.getElementById("chat-audio");

function fadeAudio(audio, targetVolume = 0, duration = 1000) {
  if (!audio) return;
  const startVolume = audio.volume;
  const startTime = performance.now();

  function tick(now) {
    const t = Math.min(1, (now - startTime) / duration);
    audio.volume = startVolume + (targetVolume - startVolume) * t;
    if (t < 1) requestAnimationFrame(tick);
    else if (targetVolume === 0) audio.pause();
  }

  requestAnimationFrame(tick);
}

function startAnimation() {
  if (isSquished) { resetAnimation(); return; }
  if (intervalId) return;
  isHolding = true;

  if (chatAudio) {
    chatAudio.currentTime = 0;
    chatAudio.volume = 1;
    chatAudio.play().catch(err => console.warn("Audio play blocked:", err));
  }


  intervalId = setInterval(() => {
    if (!isHolding) return;

    image.src = frames[frameIndex];
    frameIndex = (frameIndex + 1) % frames.length;
    steps++;

    if (steps >= 20 && isHolding) {
      clearInterval(intervalId);
      intervalId = null;
      image.src = squished;
      isSquished = true;
      isHolding = false;

      squishText.style.opacity = '1';
      
      if (chatAudio) {
        chatAudio.pause();
        chatAudio.currentTime = 0;
      }
    }
  }, 130);
}

document.addEventListener('DOMContentLoaded', () => {
  const framesSection = document.getElementById('frames-section');
  const framesBadge = document.getElementById('frames-badge');
  if (!framesSection || !framesBadge) return;

  const holdPrompt = document.createElement('div');
  holdPrompt.innerText = 'HOLD';
  Object.assign(holdPrompt.style, {
    position: 'absolute',
    background: 'rgba(0,0,0,0.6)',
    color: 'white',
    padding: '9px 15px',
    borderRadius: '6px',
    fontFamily: 'sans-serif',
    fontSize: '14px',
    pointerEvents: 'none',
    zIndex: '60',
    whiteSpace: 'nowrap',
    opacity: '0',
    transition: 'opacity 0.3s ease'
  });

  framesBadge.appendChild(holdPrompt);

  const positionPrompt = () => {
    const rect = framesBadge.getBoundingClientRect();
    holdPrompt.style.right = `${rect.width + 10}px`;
    holdPrompt.style.top = '50%';
    holdPrompt.style.transform = 'translateY(-50%)';
  };
  positionPrompt();
  window.addEventListener('resize', positionPrompt);

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        framesBadge.classList.add('visible');
        holdPrompt.style.opacity = '1';
      } else {
        framesBadge.classList.remove('visible');
        holdPrompt.style.opacity = '0';
      }
    });
  }, { threshold: 0.2 });

  io.observe(framesSection);
});
