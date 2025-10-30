function magnify(imgID, zoom) {
  const img = document.getElementById(imgID);
  const lens = document.createElement("div");
  lens.className = "img-magnifier-lens";
  img.parentElement.appendChild(lens);

  lens.style.backgroundImage = `url('${img.src}')`;
  lens.style.backgroundRepeat = "no-repeat";
  lens.style.display = "none";

  function updateBackgroundSize() {
    const rect = img.getBoundingClientRect();
    lens.style.backgroundSize = `${rect.width * zoom}px ${rect.height * zoom}px`;
  }
  updateBackgroundSize();
  window.addEventListener("resize", updateBackgroundSize);

  function moveLens(e) {
    e.preventDefault();
    lens.style.display = "block";

    const rect = img.getBoundingClientRect();
    let x = e.clientX - rect.left - lens.offsetWidth / 2;
    let y = e.clientY - rect.top - lens.offsetHeight / 2;

    x = Math.max(0, Math.min(x, rect.width - lens.offsetWidth));
    y = Math.max(0, Math.min(y, rect.height - lens.offsetHeight));

    lens.style.left = x + "px";
    lens.style.top = y + "px";

    lens.style.backgroundPosition = `-${x * zoom}px -${y * zoom}px`;
  }

  img.addEventListener("mousemove", moveLens);
  img.addEventListener("touchmove", moveLens);
  img.addEventListener("mouseleave", () => {
    lens.style.display = "none";
  });
  img.addEventListener("touchend", () => {
    lens.style.display = "none";
  });
}

magnify("army-image", 1.5);

