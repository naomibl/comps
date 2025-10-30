const rainSketch = (p) => {
  const CONFIG = {
    rainCount: 1000,
    minLen: 8,
    maxLen: 66,
    minSpeed: 18,
    maxSpeed: 40,
    angleWind: 0.25,
    splashCount: 200,
    splashLife: 18,
    trailAlpha: 40,
    lightningChance: 0.01,
  };

  let drops = [];
  let splashes = [];
  let lightning = { active: false, alpha: 0, decay: 0 };
  let rainStarted = false;
  let rainIntensity = 0;   
  let bgColor = 255;     

  class Drop {
    constructor() { this.reset(true); }
    reset(fromTop = false) {
      const windOffset = CONFIG.angleWind * p.height * 2;
      this.x = p.random(-50 - windOffset, p.width + 50);
      this.y = fromTop ? p.random(-p.height, 0) : p.random(-500, -50);
      this.len = p.random(CONFIG.minLen, CONFIG.maxLen);
      this.speed = p.random(CONFIG.minSpeed, CONFIG.maxSpeed);
      this.thickness = p.map(this.len, CONFIG.minLen, CONFIG.maxLen, 1, 2.6);
      this.alpha = p.random(180, 255);
      this.vx = 0;
    }
    update() {
      let wind = p.sin(p.frameCount * 0.01 + this.x * 0.002) * CONFIG.angleWind * 8;
      this.vx = CONFIG.angleWind * this.speed;
      this.x += this.vx;
      this.y += this.speed;
      if (this.y > p.height - 4) {
        spawnSplash(this.x, p.height - 6, this.speed);
        this.reset(false);
        this.y = p.random(-200, -50);
      }
    }
    draw() {
      p.strokeWeight(this.thickness);
      p.stroke(200, 220, 255, this.alpha);
      let tilt = this.vx / this.speed;
      let dx = this.len * tilt;
      let dy = this.len;
      p.line(this.x, this.y, this.x - dx, this.y - dy);
      p.strokeWeight(0.8);
      p.stroke(240, 245, 255, this.alpha);
      p.line(this.x, this.y - dy * 0.25, this.x - dx * 0.8, this.y - dy);
    }
  }

  class Splash {
    constructor(x, y, speed) {
      this.x = x; this.y = y; this.rays = [];
      let rayN = p.floor(p.map(speed, CONFIG.minSpeed, CONFIG.maxSpeed, 3, 8));
      for (let i = 0; i < rayN; i++) {
        let ang = p.random(-p.PI / 1.6, -p.PI / 6);
        let mag = p.random(1.6, 6) * p.map(speed, CONFIG.minSpeed, CONFIG.maxSpeed, 0.8, 1.6);
        this.rays.push({ vx: p.cos(ang) * mag, vy: p.sin(ang) * mag, x: this.x, y: this.y });
      }
      this.life = CONFIG.splashLife;
    }
    update() {
      for (let r of this.rays) { r.vy += 0.4; r.x += r.vx; r.y += r.vy; r.vx *= 0.99; }
      this.life--;
    }
    draw() {
      let alpha = p.map(this.life, 0, CONFIG.splashLife, 0, 200);
      p.strokeWeight(1.6);
      for (let r of this.rays) { p.stroke(200, 220, 255, alpha); p.line(r.x, r.y, r.x - r.vx * 0.08, r.y - r.vy * 0.08); }
    }
  }

  function spawnSplash(x, y, speed) {
    if (splashes.length >= CONFIG.splashCount) splashes.shift();
    splashes.push(new Splash(x, y, speed));
  }

  p.setup = function() {
    let canvas = p.createCanvas(p.windowWidth, p.windowHeight * 1.4);
    canvas.parent("rainContainer");
    p.pixelDensity(1);
    p.background(bgColor);
    window.addEventListener("scroll", () => {
      let rect = canvas.elt.getBoundingClientRect();
      if (!rainStarted && rect.top < window.innerHeight && rect.bottom > 0) {
        rainStarted = true;
      }
    });
  };

  p.draw = function() {
    if (rainStarted && bgColor > 18) { bgColor -= 1.5; }
    p.background(bgColor);
    if (rainStarted && rainIntensity < CONFIG.rainCount) {
      rainIntensity += 1;
      drops.push(new Drop());
    }

    if (!lightning.active && p.random() < CONFIG.lightningChance) {
      lightning.active = true; lightning.alpha = 255; lightning.decay = p.random(6, 14);
    }
    if (lightning.active) {
      p.fill(255, 255, 255, lightning.alpha);
      p.rect(0, 0, p.width, p.height);
      lightning.alpha -= lightning.decay;
      if (lightning.alpha <= 0) lightning.active = false;
    }

    p.strokeCap(p.ROUND);
    for (let d of drops) { d.update(); d.draw(); }

    for (let i = splashes.length - 1; i >= 0; i--) {
      splashes[i].update(); splashes[i].draw();
      if (splashes[i].life <= 0) splashes.splice(i, 1);
    }
  };

  p.windowResized = function() {
    p.resizeCanvas(p.windowWidth, p.windowHeight * 1.25);
  };
};

new p5(rainSketch, 'rainContainer');
