let antFrames = [];
let splatImg;
let ants = [];
let swarmQueue = [];
let centerX, centerY;
let startTime = 0;
let maxAnts = 700;
let phase1Rate = 500;
let lastPhase1Spawn = 0;

let phase2Started = false;
let phase3Started = false;
let phase4Started = false;
let phase5Started = false;
let phase6Started = false;

let firstAntReachedCenter = false;
let endFlashingStarted = false;
let endFlashingStartTime = 0;

let getThemShown = false;
let getThemStartTime = 0;

let minigameActive = false;

let minigameSketch = function(p) {

  p.preload = function() {
    for (let i = 0; i < 3; i++) {
      antFrames[i] = p.loadImage(`assets/images/a${i + 1}.png`);
    }
    splatImg = p.loadImage("assets/images/splaat.png");
  };

  p.setup = function() {
    let borderSize = 3;
    let canvas = p.createCanvas(p.windowWidth - borderSize * 2, p.windowHeight - borderSize * 2);
    canvas.parent('ant-game-section');
    canvas.style.display = 'block';
    canvas.style.margin = '0';
    canvas.style.padding = '0';
    canvas.elt.style.border = `${borderSize}px solid black`;
    canvas.elt.style.boxSizing = "border-box";

    centerX = p.width / 2;
    centerY = p.height / 2;

    const minigameContainer = document.getElementById('ant-game-section');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !minigameActive) {
          minigameActive = true;
          startTime = p.millis();
          getThemShown = true;
          getThemStartTime = p.millis();
          observer.unobserve(minigameContainer);
        }
      });
    }, { threshold: 0.5 });

    observer.observe(minigameContainer);
  };

  p.draw = function() {
    if (!minigameActive) return;

    p.background(225);

    let elapsed = p.millis() - startTime;
    let inwardPhase = elapsed < 30000;
    let speedFactor = p.map(elapsed, 0, 30000, 0.7, 3.0);

    if (getThemShown) {
      let textElapsed = p.millis() - getThemStartTime;
      if (textElapsed < 1000) { 
        if (textElapsed % 200 < 100) p.background(0); 
        p.push();
        p.fill(225, 0, 0);
        p.textAlign(p.CENTER, p.CENTER);
        p.textFont('Bebas Neue Bold', 'sans-serif');
        p.textSize(400);
        p.textStyle(p.BOLD);
        p.text("GET THEM!", p.width / 2, p.height / 2);
        p.pop();
      } else {
        getThemShown = false;
      }
    }

    if (elapsed < 5000 && p.millis() - lastPhase1Spawn > phase1Rate) {
      ants.push(new Ant());
      lastPhase1Spawn = p.millis();
    }

    function spawnPhase(count) {
      for (let i = 0; i < count; i++)
        if (ants.length + swarmQueue.length < maxAnts)
          swarmQueue.push(new Ant());
    }

    if (!phase2Started && elapsed >= 3000) { spawnPhase(3); phase2Started = true; }
    if (!phase3Started && elapsed >= 11000) { spawnPhase(20); phase3Started = true; }
    if (!phase4Started && elapsed >= 18000) { spawnPhase(60); phase4Started = true; }
    if (!phase5Started && elapsed >= 28000) { spawnPhase(200); phase5Started = true; }
    if (!phase6Started && elapsed >= 35000) { 
      let remaining = maxAnts - swarmQueue.length;
      spawnPhase(remaining); 
      phase6Started = true; 
    }

    // Release from queue
    let releaseRate = phase6Started ? 50 : 8;
    for (let i = 0; i < releaseRate && swarmQueue.length > 0; i++)
      ants.push(swarmQueue.shift());

    // Draw dead ants first
    for (let ant of ants) {
      if (ant.dead) ant.display();
    }

    if (endFlashingStarted) {
      let flashElapsed = p.millis() - endFlashingStartTime;
      const audio = document.getElementById("farm-audio");
      if (flashElapsed > 2000 && flashElapsed < 4000) {
        if (flashElapsed % 200 < 100) p.background(0); 
      } else if (flashElapsed >= 4000) {
        p.background(0);
        if (!this.gameOverStartTime) this.gameOverStartTime = p.millis();
        if (p.millis() - this.gameOverStartTime > 1500) {
          p.push();
          p.fill(225);
          p.textAlign(p.CENTER, p.CENTER);
          p.textFont('Bebas Neue Bold', 'sans-serif');
          p.textSize(150);
          p.text("⬇", p.width / 2, (p.height * 3) / 4);
          p.pop();
        }
        return;
      }
    }

    for (let ant of ants) {
      if (!ant.dead) {
        ant.update(inwardPhase, speedFactor);
        ant.display();
      }
    }
  };

  p.mousePressed = function() {
    for (let ant of ants) {
      if (!ant.dead && ant.isClicked(p.mouseX, p.mouseY)) {
        ant.splat();
        break;
      }
    }
  };

  class Ant {
    constructor() {
      this.frame = 0;
      this.frameCounter = 0;
      this.dead = false;
      this.size = p.random(20, 55);
      this.speed = p.random(0.6, 1.5);
      this.angleOffset = p.random(-0.3, 0.3);

      let side = p.floor(p.random(4));
      if (side === 0) { this.x = p.random(p.width); this.y = -50; }
      if (side === 1) { this.x = p.width + 50; this.y = p.random(p.height); }
      if (side === 2) { this.x = p.random(p.width); this.y = p.height + 50; }
      if (side === 3) { this.x = -50; this.y = p.random(p.height); }

      this.prevX = this.x;
      this.prevY = this.y;
    }

    update(inwardPhase, speedFactor) {
      if (this.dead) return;

      this.prevX = this.x;
      this.prevY = this.y;

      let dir = p.createVector(centerX - this.x, centerY - this.y);
      let spiral = dir.copy().rotate(p.HALF_PI + this.angleOffset);

      let distance = dir.mag();
      let inwardStrength = distance < 150 ? 0.0008 : distance < 300 ? 0.01 : inwardPhase ? 0.05 : 0;

      let velocity = p5.Vector.add(
        p5.Vector.mult(dir, inwardStrength),
        p5.Vector.mult(spiral, this.speed)
      );

      velocity.setMag(distance < 50 ? this.speed * 1 : this.speed * speedFactor);

      if (!firstAntReachedCenter && distance < 60) {
        firstAntReachedCenter = true;
        endFlashingStarted = true;
        endFlashingStartTime = p.millis();
      }

      this.x += velocity.x;
      this.y += velocity.y;

      let speedBasedFrameRate = p.map(this.speed, 0.1, 1.3, 6, 3);
      this.frameCounter++;
      if (this.frameCounter >= speedBasedFrameRate) {
        this.frame = (this.frame + 1) % antFrames.length;
        this.frameCounter = 0;
      }
    }

    display() {
      p.push();
      p.translate(this.x, this.y);
      let dx = this.x - this.prevX;
      let dy = this.y - this.prevY;
      p.rotate(p.atan2(dy, dx));
      p.imageMode(p.CENTER);
      if (!this.dead) p.image(antFrames[this.frame], 0, 0, this.size, this.size);
      else p.image(splatImg, 0, 0, this.size, this.size);
      p.pop();
    }

    isClicked(mx, my) {
      return mx > this.x - this.size / 2 && mx < this.x + this.size / 2 &&
             my > this.y - this.size / 2 && my < this.y + this.size / 2;
    }

    splat() {
      this.dead = true;
    }
  }
};

new p5(minigameSketch, "ant-game-section");
