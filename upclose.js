const upcloseImage = document.getElementById("closeup-image");
let jolted = false;
let joltTimeout;
let animationFrameId;


function handleScroll() {
  const rect = upcloseImage.getBoundingClientRect();
  const viewportCenter = window.innerHeight / 2;
  const imageCenter = rect.top + rect.height / 2;
  const distanceFromCenter = Math.abs(viewportCenter - imageCenter);


  if (rect.top < window.innerHeight && rect.bottom > 0) {
    const scrollProgress = 1 - rect.top / window.innerHeight;
    const maxTilt = 10;
    let rotateY = maxTilt * Math.min(scrollProgress * 0.5, 1); 

    upcloseImage.style.transform = `perspective(1000px) rotateY(${rotateY}deg)`;
  } else if (rect.top > window.innerHeight) {
  
    upcloseImage.style.transform = "perspective(1000px) rotateY(0deg)";
  }

  if (distanceFromCenter < 50 && !jolted) {
    jolted = true;
    upcloseImage.style.transition = "none"; 
    upcloseImage.style.transform = `
      perspective(1000px)
      translateZ(400px)
      rotateY(30deg)
      rotateX(-15deg)
      scale(1.5)
    `;
    clearTimeout(joltTimeout);
    joltTimeout = setTimeout(() => relaxImage(), 1000);
  }

  if ((rect.bottom < 0 || rect.top > window.innerHeight) && jolted) {
    resetImage();
  }
}

function relaxImage() {
  const start = performance.now();
  const duration = 1000;
  const startTransform = { translateZ: 400, rotateY: 30, rotateX: -15, scale: 1.5 };
  const endTransform = { translateZ: 50, rotateY: 5, rotateX: -2, scale: 1.05 };

  cancelAnimationFrame(animationFrameId);

  function animate(time) {
    let t = Math.min((time - start) / duration, 1);
    const translateZ = startTransform.translateZ + (endTransform.translateZ - startTransform.translateZ) * t;
    const rotateY = startTransform.rotateY + (endTransform.rotateY - startTransform.rotateY) * t;
    const rotateX = startTransform.rotateX + (endTransform.rotateX - startTransform.rotateX) * t;
    const scale = startTransform.scale + (endTransform.scale - startTransform.scale) * t;

    upcloseImage.style.transform = `
      perspective(1000px)
      translateZ(${translateZ}px)
      rotateY(${rotateY}deg)
      rotateX(${rotateX}deg)
      scale(${scale})
    `;

    if (t < 1) {
      animationFrameId = requestAnimationFrame(animate);
    } else {
      upcloseImage.classList.add("subtle-shake");
    }
  }

  animationFrameId = requestAnimationFrame(animate);
}

function resetImage() {
  jolted = false;
  clearTimeout(joltTimeout);
  cancelAnimationFrame(animationFrameId);
  upcloseImage.classList.remove("subtle-shake");
  upcloseImage.style.transform = `
    perspective(1000px)
    translateZ(50px)
    rotateY(5deg)
    rotateX(-2deg)
    scale(1.05)
  `;
}

window.addEventListener("scroll", handleScroll);