let moatScene = function(p) {
  let cols = ['#A7EFFF', '#4DD3FF', '#0099CC', '#006699', '#00334D'];
  let agents = [];
  let particleLayer;
  let started = false;
  let antImgs = [];
  let numAnts = 50;
  let baseAnts = 3;
  let antBridgeData = [];
  let bridgeY = 2650;
  let bridgeStartX = 0;
  let antWidth = 100;
  let antHeight = 100;
  let spacingFactor = 0.3;

  let firstText = { content: '"OPEN THE DAM!"', baseY: 350, x: 0, size: 250 };
  let texts = [
    { content: "The water rose, a silver tide around the farm,", baseY: 900, x: 800, size: 30 },
    { content: "like the moat encircling a medieval city.", baseY: 1000, x: 1000, size: 40 },
    { content: "Twelve feet deep.", baseY: 1300, x: 300, size: 60 },
    { content: "The water would swallow them all,\nevery last one.", baseY: 1340, x: 405, size: 30 },
    { content: "Then he saw them", baseY: 1940, x: 700, size: 170 },
    { content: "It was a sight one could never forget.", baseY: 1850, x: 500, size: 60 },
    { content: "As far as eye could see, crept a darkening hem, ever longer and broader, until the shadow spread across the slope from east to west.", baseY: 1780, x: 700, size: 25 },
    { content: "He saw the brilliant,\ncold eyes,\nand the razor-edged mandibles,\nof this host of infinity.", baseY: 2150, x: 1300, size: 60 },
    { content: "and one by one", baseY: 2250, x: 200, size: 50 },
    { content: "they swarmed over the fallen", baseY: 2450, x: 600, size: 40 },
    { content: "to form a living bridge.", baseY: 2525, x: 620, size: 90 }
  ];

  let parallaxFactor = 0.3;

  p.preload = function() {
    for (let i = 1; i <= numAnts; i++) {
      let imgNum = (i % baseAnts) + 1;
      antImgs.push(p.loadImage(`images/a${imgNum}.png`));
    }
  };

  p.setup = function() {
    let canvas = p.createCanvas(p.windowWidth, 2800);
    canvas.parent("moat-scene");

    firstText.x = p.width / 2;

    particleLayer = p.createGraphics(p.width, p.height);
    particleLayer.background(255);

    p.noiseSeed(0);
    p.randomSeed(0);

    for (let i = 0; i < 8000; i++) {
      agents.push(new Agent());
      agents[i].display(particleLayer);
    }

    let amplitude = 400;
    let frequency = p.PI / (numAnts - 1);
    for (let i = 0; i < numAnts; i++) {
      let spacing = antWidth * spacingFactor;
      let x = bridgeStartX + i * spacing;
      let y = bridgeY - p.sin(i * frequency) * amplitude;
      let dy = -p.cos(i * frequency) * amplitude * frequency;
      let dx = spacing;
      let angle = p.atan2(dy, dx);
      let vOffset = [-15, 0, 15][Math.floor(p.random(0, 3))];
      antBridgeData.push({ x: x, y: y + vOffset, angle: angle });
    }

    p.noLoop();


    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        started = true;
        p.loop();
      } else {
        p.noLoop();
      }
    }, { threshold: 0.2 });
    observer.observe(document.querySelector('#moat-scene'));
  };

  p.draw = function() {
    if (!started) return;

    let rect = document.querySelector('#moat-scene').getBoundingClientRect();
    let scrollY = -rect.top; 

    if (scrollY < 1500) {
      let fadeAmount = p.map(scrollY, 200, 500, 0, 255, true);
      particleLayer.fill(0, fadeAmount * 0.02);
      particleLayer.noStroke();
      particleLayer.rect(0, 0, p.width, p.height);
    } else if (scrollY >= 1500) {
      let whiteFade = p.map(scrollY, 1500, 1800, 0, 255, true);
      particleLayer.fill(255, whiteFade * 0.01);
      particleLayer.noStroke();
      particleLayer.rect(0, 0, p.width, p.height);
    }

    let redCols = ['#FF0000', '#FF7F7F', '#A50000', '#8A0303'];

    for (let agent of agents) {
      agent.update();

      if (scrollY >= 1800) {
        let t = p.map(scrollY, 1800, 2200, 0, 1, true);
        let targetCol = p.color(redCols[p.floor(p.random(redCols.length))]);
        let currentCol = agent.col;
        agent.col = p.lerpColor(currentCol, targetCol, t);
      }

      agent.display(particleLayer);
    }

    p.image(particleLayer, 0, 0);

    let yFirst = firstText.baseY - scrollY * parallaxFactor;
    let textsAlpha = p.map(scrollY, 0, 200, 255, 0, true);

    p.push();
    p.translate(firstText.x, yFirst);
    p.textFont('Bebas Neue Bold', 'sans-serif');
    p.textSize(firstText.size);
    p.textAlign(p.CENTER, p.CENTER);
    p.noStroke();
    p.fill(200, textsAlpha * 0.6);
    p.text(firstText.content, 8, 8);
    p.fill(0, textsAlpha);
    p.stroke(255, 0, 0, textsAlpha);
    p.text(firstText.content, 0, 0);
    p.pop();

    for (let t of texts) {
      let x = t.x;
      let y;

      if (["and one by one", "they swarmed over the fallen", "to form a living bridge."].includes(t.content)) {
        let startX = p.width + 200;
        let progress = p.map(scrollY, t.baseY - 900, t.baseY - 200, 0, 1, true);
        progress = p.constrain(progress, 0, 1); 
        x = p.lerp(startX, t.x, progress);
        y = t.baseY;
      } else {
        let depthFactor = p.map(t.size, 20, 150, 0.1, 0.6, true);
        y = t.baseY - scrollY * depthFactor;
      }

      let textAlpha = p.map(scrollY, t.baseY - 1100, t.baseY, 0, 255, true);

      p.push();
      p.translate(x, y);
      p.scale(1, 1.1);
      p.textFont('Oculi Display Medium', 'sans-serif');
      p.textSize(t.size);
      p.textAlign(t.content.startsWith("He saw the brilliant,") ? p.RIGHT : p.CENTER, p.CENTER);
      p.fill(["and one by one", "they swarmed over the fallen", "to form a living bridge."].includes(t.content) ? 0 : 255, textAlpha);

      if (t.content === "Then he saw them") {
        let blur = p.map(scrollY, t.baseY - 900, t.baseY - 200, 3, 0, true);
        p.drawingContext.filter = `blur(${blur}px)`;
        p.text(t.content, 0, 0);
        p.drawingContext.filter = 'none';
      } else {
        p.text(t.content, 0, 0);
      }
      p.pop();
    }

    // bridge
    let scrollProgress = p.map(scrollY, bridgeY - 900, bridgeY - 650, 0, 1, true);
    let antsToShow = p.floor(scrollProgress * numAnts);

    for (let i = 0; i < antsToShow; i++) {
      p.push();
      p.translate(antBridgeData[i].x, antBridgeData[i].y);
      p.rotate(antBridgeData[i].angle);
      p.imageMode(p.CENTER);
      p.image(antImgs[i], 0, 0, antWidth, antHeight);
      p.pop();
    }
  };


  class Agent {
    constructor() {
      this.x = p.random(p.width);
      this.y = p.random(p.height);
      this.size = p.random(0.5, 2);
      this.speed = p.random(-5, 5);
      this.col = p.color(p.random(cols));
      this.noiseScale = 900;
      this.noiseStrength = 15;
    }

    display(pg) {
      pg.strokeWeight(this.size);
      pg.stroke(this.col);
      pg.point(this.x, this.y);
    }

    update() {
      let angle = p.noise(this.x / this.noiseScale, this.y / this.noiseScale) * this.noiseStrength;
      this.x += p.cos(angle) * this.speed;
      this.y += p.sin(angle) * this.speed;
    }
  }
};

new p5(moatScene, 'moat-scene');
