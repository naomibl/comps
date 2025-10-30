const mySketch = (p) => {
  let particlesQ = 50;
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
  }

  p.draw = function() {
    if (c < particlesQ) {
      addNewParticleFromEdge();
    }

    for (let a = 0; a < c; a++) {
      let ax = p.random(-0.03, 0.03); 
      let ay = p.random(-0.03, 0.03);

      for (let b = 0; b < c; b++) {
        if (a !== b) {
          let dx = x[a] - x[b];
          let dy = y[a] - y[b];
          let d = p.sqrt(dx*dx + dy*dy);
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


      if (x[i] < 0) x[i] = p.width;
      if (x[i] > p.width) x[i] = 0;
      if (y[i] > p.height - 10) {
        y[i] = p.height - 10;
        vy[i] *= -0.2;
      }
      if (y[i] < 10) {
        y[i] = 10;
        vy[i] *= -0.2;
      }

      p.set(x[i], y[i], p.color(0));
    }

    p.updatePixels();
  }

  function addNewParticleFromEdge() {
    let edge = p.random() < 0.5 ? "left" : "right";

    if (edge === "left") {
      x[c] = 0;
      vx[c] = p.random(0.1, 1.0);
    } else {
      x[c] = p.width;
      vx[c] = p.random(-1, -0.7);
    }

    y[c] = p.random(p.height);
    vy[c] = p.random(-0.2, 0.2);

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
}

new p5(mySketch);