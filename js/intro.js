window.addEventListener("load", () => {
  const overlay = document.getElementById("overlay");
  const video = document.getElementById("video");
  const container = document.getElementById("titleContainer");
  const body = document.body;
  const bgWrapper = document.getElementById("bglinewrapper");
  const antWrapper = document.getElementById("antWrapper");

  // mask
  video.style.mask = "url(#textMask)";
  video.style.maskRepeat = "no-repeat";
  video.style.maskPosition = "center";
  video.style.maskSize = "contain";

  overlay.style.clipPath = "inset(0 0 100% 0)";

  body.style.backgroundColor = "black";
  body.style.transition = "background-color 5s ease"; 

  let locked = false;
  let antsStarted = false; 

  const handleScroll = () => {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const revealPercent = Math.min(scrollY / windowHeight, 1);
    overlay.style.clipPath = `inset(0 0 ${100 - revealPercent * 100}% 0)`;

    if (scrollY > 50 && !antsStarted) {
      antsStarted = true;
      bgWrapper.style.display = "block"; 
      new p5(mySketch); 
    }

    if (revealPercent < 1) {
      if (locked) {
        container.style.position = "fixed";
        container.style.top = "50%";
        container.style.transform = "translate(-50%, -50%)";

        antWrapper.style.position = "fixed";
        antWrapper.style.top = "0";
        antWrapper.style.left = "0";
        locked = false;
      }
      body.style.backgroundColor = "black";
    } else {
      if (!locked) {
        const rect = container.getBoundingClientRect();
        const offsetTop = rect.top + scrollY;

        container.style.position = "absolute";
        container.style.top = `${offsetTop}px`;
        container.style.transform = "translate(-50%, 0)";

        antWrapper.style.position = "absolute";
        antWrapper.style.top = `${offsetTop}px`;
        antWrapper.style.left = "0";
        locked = true;
      }

      body.style.backgroundColor = "white";
    }
  };

  handleScroll(); 
  window.addEventListener("scroll", handleScroll);
});


window.addEventListener('load', () => {
  const wrapper = document.getElementById('bglinewrapper');
  const farm = document.getElementById('farm-container');

  wrapper.style.display = 'block';
  wrapper.style.opacity = 1;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    const farmTop = farm.offsetTop;
    const fadeEnd = farmTop + 250; 

    if (scrollY <= farmTop) {
      wrapper.style.opacity = 1;
    } else if (scrollY >= fadeEnd) {
      wrapper.style.opacity = 0;
    } else {
      const progress = (scrollY - farmTop) / (fadeEnd - farmTop);
      wrapper.style.opacity = 1 - progress;
    }

    wrapper.style.transition = 'opacity 0.1s linear';
  });
});
