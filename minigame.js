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

let flashingStartTime = 0;
let flashingStarted = false;

let endFlashingStarted = false;    
let endFlashingStartTime = 0;

let getThemShown = false;
let getThemStartTime = 0;

let minigameActive = false;

let minigameSketch = function(p) {

  p.preload = function() {
    for (let i = 0; i < 3; i++) {
      antFrames[i] = p.loadImage(`images/a${i + 1}.png`);
    }
    splatImg = p.loadImage("images/splaat.png");
  };

  p.setup = function() {
    let borderSize = 2;
    let canvas = p.createCanvas(p.windowWidth - borderSize * 2, p.windowHeight - borderSize * 2);
    canvas.parent('ant-game-section');
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

          flashingStarted = true;
          flashingStartTime = p.millis();

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
    let speedFactor = p.map(elapsed, 0, 30000, 0.3, 2.1);

    if (flashingStarted) {
      let timeSinceFlashing = p.millis() - flashingStartTime;
      if (timeSinceFlashing < 1500) {
        p.background(p.random() < 0.5 ? 0 : 225);
      } else {
        flashingStarted = false;
        p.background(225);
      }
    }

    if (endFlashingStarted) {
  let flashElapsed = p.millis() - endFlashingStartTime;

  if (flashElapsed > 1000 && flashElapsed < 3000) {
    p.background(p.random() < 0.5 ? 0 : 225);

    for (let ant of ants) {
      ant.update(inwardPhase, speedFactor);
      ant.display();
    }
  } else if (flashElapsed >= 3000) {
    // flashing done
    p.background(0);

    if (!this.gameOverStartTime) this.gameOverStartTime = p.millis();
    let gameOverElapsed = p.millis() - this.gameOverStartTime;

    if (gameOverElapsed > 500) {
      p.push();
      p.fill(225, 0, 0);
      p.textAlign(p.CENTER, p.CENTER);
      p.textFont('Bebas Neue Bold', 'sans-serif');
      p.textSize(150);
      p.text("GAME OVER", p.width / 2, p.height / 2);
      p.pop();
    }

    return; 
  } else {
    p.background(225);
    for (let ant of ants) {
      ant.update(inwardPhase, speedFactor);
      ant.display();
    }
  }
} else {
  for (let ant of ants) {
    ant.update(inwardPhase, speedFactor);
    ant.display();
  }
}

    if (getThemShown) {
      let textElapsed = p.millis() - getThemStartTime;
      if (textElapsed < 1000) { 
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

    if (elapsed < 5000) {
      if (p.millis() - lastPhase1Spawn > phase1Rate) {
        ants.push(new Ant());
        lastPhase1Spawn = p.millis();
      }
    }

    if (!phase2Started && elapsed >= 3000 && elapsed < 8000) {
      for (let i = 0; i < 3; i++)
        if (ants.length + swarmQueue.length < maxAnts)
          swarmQueue.push(new Ant());
      phase2Started = true;
    }

    if (!phase3Started && elapsed >= 11000 && elapsed < 15000) {
      for (let i = 0; i < 15; i++)
        if (ants.length + swarmQueue.length < maxAnts)
          swarmQueue.push(new Ant());
      phase3Started = true;
    }

    if (!phase4Started && elapsed >= 17000 && elapsed < 20000) {
      for (let i = 0; i < 40; i++)
        if (ants.length + swarmQueue.length < maxAnts)
          swarmQueue.push(new Ant());
      phase4Started = true;
    }

    if (!phase5Started && elapsed >= 23000 && elapsed < 23500) {
      for (let i = 0; i < 100; i++)
        if (ants.length + swarmQueue.length < maxAnts)
          swarmQueue.push(new Ant());
      phase5Started = true;
    }

    if (!phase6Started && elapsed >= 30000 && elapsed < 33000) {
      let remaining = maxAnts - swarmQueue.length;
      for (let i = 0; i < remaining; i++) swarmQueue.push(new Ant());
      phase6Started = true;
      endFlashingStarted = true;
      endFlashingStartTime = p.millis();
    }

    let releaseRate = phase6Started ? 50 : 8;
    for (let i = 0; i < releaseRate && swarmQueue.length > 0; i++)
      ants.push(swarmQueue.shift());

    for (let ant of ants) {
      ant.update(inwardPhase, speedFactor);
      ant.display();
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
      this.frameSpeed = 7;
      this.dead = false;
      this.size = p.random(20, 55);
      this.speed = p.random(0, 1.2);
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
      let inwardStrength = inwardPhase ? 0.05 : 0;

      let velocity = p5.Vector.add(
        p5.Vector.mult(dir, inwardStrength),
        p5.Vector.mult(spiral, this.speed)
      );
      velocity.setMag(this.speed * speedFactor);

      this.x += velocity.x;
      this.y += velocity.y;

      this.frameCounter++;
      if (this.frameCounter >= this.frameSpeed) {
        this.frame = (this.frame + 1) % antFrames.length;
        this.frameCounter = 0;
      }
    }

    display() {
      p.push();
      p.translate(this.x, this.y);
      let dx = this.x - this.prevX;
      let dy = this.y - this.prevY;
      let dir = p.atan2(dy, dx);
      p.rotate(dir);
      p.imageMode(p.CENTER);
      if (this.dead) p.image(splatImg, 0, 0, this.size, this.size);
      else p.image(antFrames[this.frame], 0, 0, this.size, this.size);
      p.pop();
    }

    isClicked(mx, my) {
      return (
        mx > this.x - this.size / 2 && mx < this.x + this.size / 2 &&
        my > this.y - this.size / 2 && my < this.y + this.size / 2
      );
    }

    splat() {
      this.dead = true;
    }
  }
};

new p5(minigameSketch, "ant-game-section");
