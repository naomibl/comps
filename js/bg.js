let backgroundSketch = function(p) {
  let antColor = new Uint8Array([255, 255, 234]);
  let antsNum = 2750;
  let sensorOffset = 20;
  let clockwise = 40;
  let counter = -40;
  let ants;

  const ant = () => ({
    x: p.width / 5,
    y: p.height / 5,
    angle: p.random(40),
    step: p.random(0.5, 3),
  });

  ants = {
    ants: [],

    init() {
      this.ants.length = 0;
      for (let i = antsNum; i--; ) this.ants.push(ant());
    },

    smell(a, d) {
      const aim = a.angle + d;
      let x = 0 | (a.x + sensorOffset * p.cos(aim));
      let y = 0 | (a.y + sensorOffset * p.sin(aim));
      x = (x + p.width) % p.width;
      y = (y + p.height) % p.height;

      const index = (x + y * p.width) * 4;
      return p.pixels[index]; 
    },

    updateAngle() {
      for (const a of this.ants) {
        const right = this.smell(a, clockwise);
        const center = this.smell(a, 0);
        const left = this.smell(a, counter);

        if (center > left && center > right) {
        } else if (left < right) {
          a.angle += clockwise;
        } else if (left > right) {
          a.angle += counter;
        }
      }
    },

    updatePosition() {
      for (const a of this.ants) {
        a.x += p.cos(a.angle) * a.step;
        a.y += p.sin(a.angle) * a.step;
        a.x = (a.x + p.width) % p.width;
        a.y = (a.y + p.height) % p.height;

        const index = ((0 | a.x) + (0 | a.y) * p.width) * 4;
        p.pixels.set(antColor, index);
      }
    },
  };

  p.setup = function() {
    let canvas = p.createCanvas(p.windowWidth, 2000);
    canvas.parent("bgSketch");
    p.angleMode(p.DEGREES);
    p.pixelDensity(1);
    p.background(0);
    ants.init();
  };

  p.draw = function() {
    p.background(0, 10); 
    p.stroke(255);
    p.strokeWeight(20);
    if (p.mouseIsPressed) {
      p.line(p.pmouseX, p.pmouseY, p.mouseX, p.mouseY);
    }

    p.loadPixels();
    for (let i = 12; i--; ) {
      ants.updateAngle();
      ants.updatePosition();
    }

    p.updatePixels();
  };
};

new p5(backgroundSketch, 'bgSketch');
