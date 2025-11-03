document.addEventListener("DOMContentLoaded", () => {
  const img = document.getElementById("face");
  const container = document.getElementById("face-container");
  const initialWidth = 1000;
  const scaleDistance = 500; 


  //flash 
  let faceFlashTimer = null;
  const scheduleFaceFlash = (delay = 1000) => {
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

  img.onload = () => {
    container.style.height = `${img.clientHeight}px`;
  };
  if (img.complete) container.style.height = `${img.clientHeight}px`;

  const maxScale = window.innerWidth / initialWidth;

  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY || window.pageYOffset;
    const containerBottom = container.offsetTop + container.offsetHeight;
    let distancePastBottom = scrollY - (containerBottom - window.innerHeight);
    if (distancePastBottom > scaleDistance) distancePastBottom = scaleDistance;

    let scaleFactor = 1;
    if (distancePastBottom > 0) {
      scaleFactor = 1 + (distancePastBottom / scaleDistance) * (maxScale - 1);
    }
    window.faceScale = scaleFactor;

    if (distancePastBottom <= 0) {
      cancelFaceFlash();
      img.style.position = 'absolute';
      img.style.top = '0';
      img.style.left = '50%';
      img.style.transform = 'translateX(-50%)';
      img.style.width = `${initialWidth}px`;
    } else if (distancePastBottom < scaleDistance) {
      cancelFaceFlash();
      img.style.position = 'fixed';
      img.style.top = '50%';
      img.style.left = '50%';
      img.style.transform = 'translate(-50%, -50%)';
      img.style.width = `${initialWidth * scaleFactor}px`;
    } else {
      img.style.position = 'fixed';
      img.style.top = '50%';
      img.style.left = '50%';
      img.style.transform = 'translate(-50%, -50%)';
      img.style.width = `${initialWidth * maxScale}px`;

      scheduleFaceFlash(1000);

      window.scrollTo(0, containerBottom - window.innerHeight + scaleDistance);
    }
  });
});

// p5 sketch
let face = function(p) {
  let finalAntFrames = [];
  let finalAnts = [];
  let finalSplatImg;
  let swarmActive = false;
  let swarmTriggered = false;
  let closeImg;
  let imageFlashIndex = 0;
  let currentImageScale = 1;
  let flashingStarted = false;
  let flashingStartTime = 0;
  const flashingDuration = 2000;

  p.preload = function() {
    for (let i = 0; i < 3; i++) {
      finalAntFrames[i] = p.loadImage(`images/a${i + 1}.png`);
    }
    finalSplatImg = p.loadImage("images/splaat.png");
    closeImg = p.loadImage("images/head.png");
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


  window.addEventListener("resize", updateCanvasToImage);
  window.addEventListener("scroll", updateCanvasToImage, { passive: true });
  faceImg.addEventListener("load", updateCanvasToImage);
 
  updateCanvasToImage();
   p.noStroke();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !swarmTriggered) {
            swarmTriggered = true;
            setTimeout(() => {
              swarmActive = true;
              p.spawnAnts();
            }, 2000);
          }
        });
      },
      { threshold: 0.5 }
    );
    observer.observe(faceImg);

    window.faceContainer = p;
    p.finalAnts = finalAnts;
  };


p.draw = function() {
  if (!swarmActive) return;
  p.clear();

  const scale = window.faceScale || 1;

  // Draw ants
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

    // --- Black flashes ---
    const flashCount = 17;
    const flashPeriod = 40;
    const totalFlashDuration = flashCount * flashPeriod;
    let blackVisible = false;

    if (elapsed < totalFlashDuration) {
      const periodIndex = Math.floor(elapsed / flashPeriod);
      blackVisible = (periodIndex % 2 === 0);
    } else {
      blackVisible = true; // stay black after flashes
    }

    if (blackVisible) {
      p.noStroke();
      p.fill(0);
      p.rect(0, 0, p.width, p.height);
    }
    

const initialDelay = flashPeriod * 6; // wait for black flashes
const imageInterval = 500;  // ms between image appearances
const imageDuration = 100;  
const maxFlashes = 3;

if (imageFlashIndex < maxFlashes) {
  const isFirstFlash = (imageFlashIndex === 0);
  const flashStartTime = initialDelay + imageFlashIndex * imageInterval;
  const flashEndTime = flashStartTime + (isFirstFlash ? imageDuration * 2 : imageDuration); 

  if (elapsed >= flashStartTime && elapsed <= flashEndTime) {
    currentImageScale = 1 + imageFlashIndex * 0.2;
    p.imageMode(p.CENTER);
    p.image(
      closeImg,
      p.width / 2,
      p.height / 2,
      closeImg.width * currentImageScale,
      closeImg.height * currentImageScale
    );
  }

  if (elapsed >= flashEndTime) {
    imageFlashIndex++;
  }
}

  }
};

  class FinalAnt {
    constructor() {
      this.frame = 0;
      this.frameCounter = 0;
      this.frameSpeed = 3;
      this.dead = false;
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
      if (this.dead) return;
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
      if (this.dead) {
        p.image(finalSplatImg, 0, 0, s, s);
      } else {
        p.image(finalAntFrames[this.frame], 0, 0, s, s);
      }
      p.pop();
    }
  }

  p.spawnAnts = function() {
    if (p.finalAnts.length === 0) {
      for (let i = 0; i < 250; i++) {
        p.finalAnts.push(new FinalAnt());
      }
    }
  };
};

new p5(face, "face-container");
