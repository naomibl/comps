window.addEventListener("load", () => {

  const overlay = document.getElementById("overlay");
  const video = document.getElementById("video");
  const container = document.getElementById("titleContainer");
  const body = document.body;

  // mask
  video.style.mask = "url(#textMask)";
  video.style.maskRepeat = "no-repeat";
  video.style.maskPosition = "center";
  video.style.maskSize = "contain";

  overlay.style.clipPath = "inset(0 0 100% 0)"; // hide initially

  body.style.backgroundColor = "black";
  body.style.transition = "background-color 5s ease"; 

  let locked = false;

  const handleScroll = () => {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const revealPercent = Math.min(scrollY / windowHeight, 1);
    overlay.style.clipPath = `inset(0 0 ${100 - revealPercent * 100}% 0)`;

    if (revealPercent < 1) {
      if (locked) {
        container.style.position = "fixed";
        container.style.top = "50%";
        container.style.transform = "translate(-50%, -50%)";
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
        locked = true;
      }

      body.style.backgroundColor = "white";
    }
  };

  handleScroll(); 
  window.addEventListener("scroll", handleScroll);
});
