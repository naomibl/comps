const mySketch = (p) => {
  let particlesQ = 25;
  let c = 0;

  let x = [];
  let y = [];
  let vx = [];
  let vy = [];

  p.setup = function() {
    const container = document.getElementById('farm-container');
    const w = container.offsetWidth;
    const h = container.offsetHeight;

    const cnv = p.createCanvas(w, h);
    cnv.parent('farm-container');  
    cnv.style('position', 'absolute');
    cnv.style('top', '0');
    cnv.style('left', '0');

    for (let i = 0; i < particlesQ; i++) {
      vx[i] = 0;
      vy[i] = 0;
    }
  };

  p.draw = function() {
    if (c < particlesQ) {
      addNewParticleFromTop(); 
    }

    for (let a = 0; a < c; a++) {
      let ax = p.random(-0.03, 0.03);
      let ay = p.random(-0.03, 0.03);

      for (let b = 0; b < c; b++) {
        if (a !== b) {
          let dx = x[a] - x[b];
          let dy = y[a] - y[b];
          let d = p.sqrt(dx * dx + dy * dy);
          if (d < 1) d = 1;
          let common = p.cos(d) / d;
          ax += common * dx * 0.01;
          ay += common * dy * 0.01;
        }
      }

      vx[a] += ax;
      vy[a] += ay;
    }

    for (let i = 0; i < c; i++) {
      x[i] += vx[i];
      y[i] += vy[i];

      if (y[i] > p.height) {
        y[i] = 0;
        x[i] = p.random(p.width);
        vy[i] = p.random(0.1, 1.2);
        vx[i] = p.random(-0.2, 0.2);
      }

      if (x[i] < 0) x[i] = p.width;
      if (x[i] > p.width) x[i] = 0;
      if (y[i] < 0) y[i] = 0;

      p.set(x[i], y[i], p.color('#ff0000'));
    }

    p.updatePixels();
  };

  function addNewParticleFromTop() {
    x[c] = p.random(p.width);
    y[c] = 0;
    vx[c] = p.random(-0.2, 0.2);
    vy[c] = p.random(0.1, 1.2);

    c++;
    if (c >= particlesQ) c = particlesQ;
  }

  function addNewParticle() {
    x[c] = p.mouseX;
    y[c] = p.mouseY;
    vx[c] = p.random(-0.2, 0.2);
    vy[c] = p.random(-0.2, 0.2);

    c++;
    if (c >= particlesQ) c = 0;
  }

  p.mouseClicked = addNewParticle;
  p.mouseDragged = addNewParticle;
};

new p5(mySketch);

window.addEventListener('load', () => {
  const firstP = document.querySelector('#farm-container p');
  if (firstP) {
    firstP.style.position = 'relative';
    firstP.style.top = '100px';
  }
});
