let moatScene = function(p) {
  const cols = ['#A7EFFF', '#4DD3FF', '#0099CC', '#006699', '#00334D'];
  let agents = [];
  let particleLayer;
  let started = false;
  let antImgs = [];
  const numAnts = 50;
  const baseAnts = 3;
  const antBridgeData = [];
  const bridgeY = 2650;
  const bridgeStartX = 0;
  const antWidth = 100;
  const antHeight = 100;
  const spacingFactor = 0.3;

  const firstText = { content: '"OPEN THE DAM!"', baseY: 350, x: 0, size: 250 };
  const texts = [
    { content: "Water spilled over the fields,", baseY: 900, x: 800, size: 30 },
    { content: "circling the farm like a moat around a castle.", baseY: 1000, x: 1000, size: 40 },
    { content: "Twelve feet deep.", baseY: 1300, x: 300, size: 60 },
    { content: "It would swallow them all,\nevery last one.", baseY: 1340, x: 405, size: 35 },
    { content: "But then he saw them", baseY: 1840, x: 700, size: 120 },
    { content: "It was a sight one could never forget.", baseY: 1850, x: 500, size: 60 },
    { content: "As far as eye could see, crept a darkening hem, ever longer and broader, until the shadow spread across the slope from east to west.", baseY: 1780, x: 700, size: 25 },
    { content: "He saw the brilliant,\ncold eyes,\nand the razor-edged mandibles,\nof this infinite horde.", baseY: 2250, x: 1300, size: 60 },
    { content: "and one by one", baseY: 2250, x: 200, size: 50 },
    { content: "they swarmed over the fallen", baseY: 2450, x: 600, size: 40 },
    { content: "to form a living bridge", baseY: 2525, x: 690, size: 90 },
    { content: "over the moat.", baseY: 2625, x: 1020, size: 60 }
  ];

  const parallaxFactor = 0.3;

  function loadAntImg(i) {
    const imgNum = (i % baseAnts) + 1;
    const img = new Image();
    img.src = `assets/images/a${imgNum}.png`;
    img.onload = () => antImgs[i] = img;
    img.onerror = () => console.warn(`Failed to load a${imgNum}.png`);
  }

  p.setup = function() {
    const canvas = p.createCanvas(p.windowWidth, 3200);
    canvas.parent("moat-scene");

    firstText.x = p.width / 2;

    particleLayer = p.createGraphics(p.width, p.height);
    particleLayer.background(255);

    p.noiseSeed(0);
    p.randomSeed(0);

    for (let i = 0; i < 3000; i++) {
      agents.push(new Agent());
      agents[i].display(particleLayer);
    }

    const amplitude = 400;
    const frequency = p.PI / (numAnts - 1);
    for (let i = 0; i < numAnts; i++) {
      const spacing = antWidth * spacingFactor;
      const x = bridgeStartX + i * spacing;
      const y = bridgeY - p.sin(i * frequency) * amplitude;
      const dy = -p.cos(i * frequency) * amplitude * frequency;
      const dx = spacing;
      const angle = p.atan2(dy, dx);
      const vOffset = [-15, 0, 15][Math.floor(p.random(0, 3))];
      antBridgeData.push({ x: x, y: y + vOffset, angle: angle });
      antImgs.push(null); 
      loadAntImg(i);
    }

    p.noLoop();

    const observer = new IntersectionObserver(entries => {
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

    const rect = document.querySelector('#moat-scene').getBoundingClientRect();
    const scrollY = -rect.top;

    if (scrollY < 1500) {
      const fadeAmount = p.map(scrollY, 200, 500, 0, 255, true);
      particleLayer.fill(0, fadeAmount * 0.02);
      particleLayer.noStroke();
      particleLayer.rect(0, 0, p.width, p.height);
    } else {
      const whiteFade = p.map(scrollY, 1500, 1800, 0, 255, true);
      particleLayer.fill(255, whiteFade * 0.01);
      particleLayer.noStroke();
      particleLayer.rect(0, 0, p.width, p.height);
    }

    const redCols = ['#FF0000', '#FF7F7F', '#A50000', '#8A0303'];
    agents.forEach(agent => {
      agent.update();
      if (scrollY >= 1800) {
        const t = p.map(scrollY, 1800, 2200, 0, 1, true);
        const targetCol = p.color(redCols[p.floor(p.random(redCols.length))]);
        agent.col = p.lerpColor(agent.col, targetCol, t);
      }
      agent.display(particleLayer);
    });

    p.image(particleLayer, 0, 0);

    const yFirst = firstText.baseY - scrollY * parallaxFactor;
    const textsAlpha = p.map(scrollY, 0, 200, 255, 0, true);
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

    texts.forEach(t => {
      let x = t.x;
      let y;
      if (["and one by one", "they swarmed over the fallen", "to form a living bridge", "over the moat."].includes(t.content)) {
        const startX = p.width + 170;
        const progress = p.constrain(p.map(scrollY, t.baseY - 900, t.baseY - 200, 0, 1), 0, 1);
        x = p.lerp(startX, t.x, progress);
        y = t.baseY;
      } else {
        const depthFactor = p.map(t.size, 20, 150, 0.1, 0.6, true);
        y = t.baseY - scrollY * depthFactor;
      }

      const textAlpha = p.map(scrollY, t.baseY - 1100, t.baseY, 0, 255, true);
      p.push();
      p.translate(x, y);
      p.scale(1, 1.1);
      p.textFont('Oculi Display Medium', 'sans-serif');
      p.textSize(t.size);
      p.textAlign(t.content.startsWith("He saw the brilliant,") ? p.RIGHT : p.CENTER, p.CENTER);
      p.fill(["and one by one", "they swarmed over the fallen", "to form a living bridge", "over the moat."].includes(t.content) ? 0 : 255, textAlpha);
      p.text(t.content, 0, 0);
      p.pop();
    });

    const scrollProgress = p.map(scrollY, bridgeY - 900, bridgeY - 650, 0, 1, true);
    const antsToShow = p.floor(scrollProgress * numAnts);
    for (let i = 0; i < antsToShow; i++) {
      const img = antImgs[i];
      if (!img) continue; 
      p.push();
      p.translate(antBridgeData[i].x, antBridgeData[i].y);
      p.rotate(antBridgeData[i].angle);
      p.imageMode(p.CENTER);
      p.drawingContext.drawImage(img, -antWidth/2, -antHeight/2, antWidth, antHeight);
      p.pop();
    }

    const bottomTextY = 3740 - scrollY * parallaxFactor;
    if (bottomTextY > 0) {
      p.push();
      p.textFont('Crimson Pro', 'serif');
      p.textSize(40);
      p.textAlign(p.CENTER, p.CENTER);
      p.fill(0);
      p.text("CLICK ON THE ANTS TO STAY ALIVE", p.width / 2, bottomTextY);
      p.text("⬇", p.width / 2, bottomTextY + 60);
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
      const angle = p.noise(this.x / this.noiseScale, this.y / this.noiseScale) * this.noiseStrength;
      this.x += p.cos(angle) * this.speed;
      this.y += p.sin(angle) * this.speed;
    }
  }
};

new p5(moatScene, 'moat-scene');
