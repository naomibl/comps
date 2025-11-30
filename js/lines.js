const mySketch = (p) => {
  const particlesQ = 325;
  const sensorOffset = 10;
  const clockwise = 20;
  const counter = -20;
  const antColor = new Uint8Array([255, 0, 0, 70]);
  const updatesPerFrame = 15; 
  

  let ants = [];

  function ant() {
    return {
      x: p.random(p.width),
      y: p.random(p.height),
      angle: p.random(360),
      step: p.random(1, 3)
    };
  }

  p.setup = function() {
  const container = document.getElementById('bglinewrapper');
  const w = container.offsetWidth;
  const h = container.offsetHeight;

  const cnv = p.createCanvas(w, h);
  cnv.parent(container);  
  cnv.style('position', 'absolute');
  cnv.style('top', '0');
  cnv.style('left', '0');
  cnv.style('pointer-events', 'none');

  for (let i = 0; i < particlesQ; i++) {
    ants.push(ant());
  }

  p.background(0);
  p.pixelDensity(1);
};

  function smell(a, deltaAngle) {
    const aim = a.angle + deltaAngle;
    let sx = Math.floor(a.x + sensorOffset * p.cos(aim));
    let sy = Math.floor(a.y + sensorOffset * p.sin(aim));

    sx = (sx + p.width) % p.width;
    sy = (sy + p.height) % p.height;

    const idx = (sx + sy * p.width) * 4;
    return p.pixels[idx]; // red channel as brightness
  }

  function updateAngle(a) {
    const right = smell(a, clockwise);
    const center = smell(a, 0);
    const left = smell(a, counter);

    if (center >= left && center >= right) {
    } else if (left < right) {
      a.angle += clockwise;
    } else if (left > right) {
      a.angle += counter;
    }
  }

  function updatePosition(a) {
    a.x += p.cos(a.angle) * a.step;
    a.y += p.sin(a.angle) * a.step;

    a.x = (a.x + p.width) % p.width;
    a.y = (a.y + p.height) % p.height;

    const idx = (Math.floor(a.x) + Math.floor(a.y) * p.width) * 4;
    p.pixels.set(antColor, idx);
  }

  p.draw = function() {
    p.loadPixels();

    for (let u = 0; u < updatesPerFrame; u++) { 
      for (let a of ants) {
        updateAngle(a);
        updatePosition(a);
      }
    }

    p.updatePixels();
  };
};

new p5(mySketch);
