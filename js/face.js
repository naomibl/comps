document.addEventListener("DOMContentLoaded", () => {
  const img = document.getElementById("face");
  const container = document.getElementById("face-container");
  const initialWidth = 800; // starting image width
  const scaleDistance = 600; // how far to scroll to reach max scale

  let faceFlashTimer = null;
  const scheduleFaceFlash = (delay = 2000) => {
    if (faceFlashTimer) clearTimeout(faceFlashTimer);
    faceFlashTimer = setTimeout(() => {
      window.requestFaceFlash = true;
      faceFlashTimer = null;
    }, delay);
  };

  const cancelFaceFlash = () => {
    if (faceFlashTimer) clearTimeout(faceFlashTimer);
    window.requestFaceFlash = false;
  };

  const setContainerHeight = () => {
    container.style.height = `${img.clientHeight}px`;
  };
  img.onload = setContainerHeight;
  if (img.complete) setContainerHeight();

  const maxScale = window.innerWidth / initialWidth;

  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY || window.pageYOffset;
    const windowHeight = window.innerHeight;
    const containerTop = container.offsetTop;
    const imageHeight = img.clientHeight;

    const imageCenter = containerTop + imageHeight / 2 - scrollY;
    const distancePastCenter = (windowHeight / 2) - imageCenter;

    let scaleFactor = 1;

    if (distancePastCenter > 0) {
      scaleFactor = 1 + Math.min(distancePastCenter / scaleDistance, 1) * (maxScale - 1);
      img.style.position = "fixed";
      img.style.top = "50%";
      img.style.left = "50%";
      img.style.transform = `translate(-50%, -50%) scale(${scaleFactor})`;
    } else {
      img.style.position = "absolute";
      img.style.top = "0";
      img.style.left = "50%";
      img.style.transform = `translateX(-50%) scale(1)`;
    }

    container.style.height = `${img.clientHeight * scaleFactor}px`;

    if (distancePastCenter >= scaleDistance) {
      scheduleFaceFlash(1000);
    } else {
      cancelFaceFlash();
    }

    window.faceScale = scaleFactor;
  });
});

// p5 sketch
let face = function(p) {
  let finalAntFrames = [];
  let finalAnts = [];
  let swarmActive = false;
  let swarmTriggered = false;
  let flashingStarted = false;
  let flashingStartTime = 0;

  p.preload = function() {
    for (let i = 0; i < 3; i++) {
      finalAntFrames[i] = p.loadImage(`../assets/images/a${i + 1}.png`);
    }
  };

  p.setup = function() {
    const faceImg = document.getElementById("face");
  const canvas = p.createCanvas(faceImg.clientWidth, faceImg.clientHeight);
  canvas.parent(document.body); 
  canvas.elt.style.position = "fixed"; 
  canvas.elt.style.zIndex = "999";
  canvas.elt.style.pointerEvents = "none";
  
  const updateCanvasToImage = () => {
  const rect = faceImg.getBoundingClientRect();
  if (rect.width === 0 && rect.height === 0) return;

  p.resizeCanvas(Math.round(rect.width), Math.round(rect.height));
  canvas.elt.style.width = `${Math.round(rect.width)}px`;
  canvas.elt.style.height = `${Math.round(rect.height)}px`;
  canvas.elt.style.left = `${Math.round(rect.left)}px`;
  canvas.elt.style.top = `${Math.round(rect.top)}px`;
};
updateCanvasToImage();
  window.addEventListener("resize", updateCanvasToImage);
  window.addEventListener("scroll", updateCanvasToImage, { passive: true });
  faceImg.addEventListener("load", updateCanvasToImage);
 
  updateCanvasToImage();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !swarmTriggered) {
            swarmTriggered = true;
            setTimeout(() => {
              swarmActive = true;
              p.spawnAnts();
            }, 1000);
          }
        });
      },
      { threshold: 0.5 }
    );
    observer.observe(faceImg);
    p.finalAnts = finalAnts;
  };


const maxAnts = 800;       // max ants
const spawnInterval = 10;   
const spawnBatch = 10;      // 10 ants at a time

p.draw = function() {
  if (!swarmActive) return;
  p.clear();

  if (swarmActive && p.finalAnts.length < maxAnts) {
    if (p.frameCount % spawnInterval === 0) {
      for (let i = 0; i < spawnBatch; i++) {
        p.finalAnts.push(new FinalAnt());
      }
    }
  }

  const scale = window.faceScale || 1;

  for (let ant of finalAnts) {
    ant.update();
    ant.display(scale);
  }

  if (window.requestFaceFlash && !flashingStarted) {
    flashingStarted = true;
    flashingStartTime = p.millis();
    window.requestFaceFlash = false;
    imageFlashIndex = 0;
    currentImageScale = 1;
  }

  if (flashingStarted) {
  const elapsed = p.millis() - flashingStartTime;

  const flashCount = 15;      
  const flashPeriod = 50;     
  const totalFlashDuration = flashCount * flashPeriod;

  let blackVisible = false;

  if (elapsed < totalFlashDuration) {
    const periodIndex = Math.floor(elapsed / flashPeriod);
    blackVisible = (periodIndex % 2 === 0);

    const audio = document.getElementById("farm-audio"); 
  if (blackVisible) {
      audio.volume = 0; 
    } else {
      audio.volume = 1; 
    }
  } else {
    blackVisible = false;
  }

  if (blackVisible) {
    p.noStroke();
    p.fill(0);
    p.rect(0, 0, p.width, p.height);
  }

  const endBlackDelay = 100; 

  if (elapsed >= totalFlashDuration + endBlackDelay) {

    if (!window.hasTriggeredEndAudio) {
        window.hasTriggeredEndAudio = true;
        window.dispatchEvent(new Event("face-end"));  // triggers audio stop
    }
    p.noStroke();
    p.fill(0);
    p.rect(0, 0, p.width, p.height);
    p.textAlign(p.CENTER, p.CENTER);
    p.textFont('Bebas Neue Bold', 'sans-serif');
    p.textSize(100 * scale);
    p.fill(255, 0, 0);
    p.text("THE END", p.width / 2, p.height / 2);
  }
  }
};

  class FinalAnt {
    constructor() {
      this.frame = 0;
      this.frameCounter = 0;
      this.frameSpeed = 3;
      this.size = p.random(15, 30);
      const faceImg = document.getElementById("face");
    const imgWidth = faceImg.clientWidth;
    const imgHeight = faceImg.clientHeight;

      const edge = p.floor(p.random(4));
      switch (edge) {
        case 0: this.x = p.random(imgWidth); this.y = 0; this.speedX = p.random(-3, 3); this.speedY = p.random(1, 3); break;
        case 1: this.x = p.width; this.y = p.random(p.height); this.speedX = p.random(-3, -1); this.speedY = p.random(-3, 3); break;
        case 2: this.x = p.random(imgWidth); this.y = imgHeight; this.speedX = p.random(-3, 3); this.speedY = p.random(-3, -1); break;
        case 3: this.x = 0; this.y = p.random(imgHeight); this.speedX = p.random(1, 3); this.speedY = p.random(-3, 3); break;
      }

      this.angle = 0;
      this.originalX = this.x;
      this.originalY = this.y;
    }

    update() {
      this.originalX += this.speedX;
      this.originalY += this.speedY;
      this.angle = p.atan2(this.speedY, this.speedX);

      if (this.originalX < 0 || this.originalX > p.width) this.speedX *= -1;
      if (this.originalY < 0 || this.originalY > p.height) this.speedY *= -1;

      this.frameCounter++;
      if (this.frameCounter >= this.frameSpeed) {
        this.frame = (this.frame + 1) % finalAntFrames.length;
        this.frameCounter = 0;
      }
    }

    display(scale = 1) {
      p.push();
      p.translate(this.originalX * scale, this.originalY * scale);
      p.rotate(this.angle);
      p.imageMode(p.CENTER);
      const s = this.size * scale;
      p.image(finalAntFrames[this.frame], 0, 0, s, s);
      p.pop();
    }
  }

  p.spawnAnts = function() {
    if (p.finalAnts.length === 0) {
      for (let i = 0; i < 200; i++) {
        p.finalAnts.push(new FinalAnt());
      }
    }
  };
};

new p5(face, "face-container");
