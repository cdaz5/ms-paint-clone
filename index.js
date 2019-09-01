const canvas = document.getElementById("draw");
const ctx = canvas.getContext("2d");

const circles = [...document.getElementsByClassName("circle")];
const colorPicker = document.querySelector('input[name="colorPicker"]');
const rainbowInput = document.querySelector('input[name="rainbowFunk"]');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

ctx.lineJoin = "round";
ctx.lineCap = "round";
ctx.lineWidth = 50;

let isDrawing = false;
let lastX = 0;
let lastY = 0;
let hue = 210;
let rainbowFunk = false;
let direction = true;

const updateLastXandLastY = ({ offsetX, offsetY }) => {
  lastX = offsetX;
  lastY = offsetY;
};

const toggleIsDrawing = bool => (isDrawing = bool);

const toggleAndUpdate = drawing => event => {
  toggleIsDrawing(drawing);
  updateLastXandLastY(event);
};

const updateSelectedCircle = widthAttr => {
  circles.forEach(circle => {
    const { width } = circle.dataset;
    if (width === widthAttr) {
      circle.classList.add("selected");
    } else {
      circle.classList.remove("selected");
    }
  });
};

const draw = ({ offsetX, offsetY }) => {
  if (!isDrawing) return;

  ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`;
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(offsetX, offsetY);
  ctx.stroke();

  updateLastXandLastY({ offsetX, offsetY });

  if (rainbowFunk) {
    hue += 5;

    if (ctx.lineWidth >= 200 || ctx.lineWidth <= 1) {
      direction = !direction;
    }
    if (direction) {
      ctx.lineWidth += 1;
    } else {
      ctx.lineWidth -= 1;
    }
  }
};

const setLineWidth = width => (ctx.lineWidth = Number(width));

const handleCircleClick = ({
  target: {
    dataset: { width }
  }
}) => {
  setLineWidth(width);
  updateSelectedCircle(width);
};

const setHue = ({ target: { value } }) => {
  updateCircleColor(value);
  hue = hexToHSL(event.target.value);
};

const updateCircleColor = hex => {
  circles.forEach(circle => {
    circle.style.background = hex;
  });
};

const updateRainbowFunk = ({ target: { checked } }) => (rainbowFunk = checked);

canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mousedown", toggleAndUpdate(true));
canvas.addEventListener("mouseup", toggleAndUpdate(false));
canvas.addEventListener("mouseout", toggleAndUpdate(false));

circles.forEach(circle => circle.addEventListener("click", handleCircleClick));
colorPicker.addEventListener("change", setHue, false);
rainbowInput.addEventListener("change", updateRainbowFunk);

const hexToHSL = H => {
  // Convert hex to RGB first
  let r = 0,
    g = 0,
    b = 0;
  if (H.length == 4) {
    r = "0x" + H[1] + H[1];
    g = "0x" + H[2] + H[2];
    b = "0x" + H[3] + H[3];
  } else if (H.length == 7) {
    r = "0x" + H[1] + H[2];
    g = "0x" + H[3] + H[4];
    b = "0x" + H[5] + H[6];
  }
  // Then to HSL
  r /= 255;
  g /= 255;
  b /= 255;
  let cmin = Math.min(r, g, b),
    cmax = Math.max(r, g, b),
    delta = cmax - cmin,
    h = 0,
    s = 0,
    l = 0;

  if (delta == 0) h = 0;
  else if (cmax == r) h = ((g - b) / delta) % 6;
  else if (cmax == g) h = (b - r) / delta + 2;
  else h = (r - g) / delta + 4;

  h = Math.round(h * 60);

  if (h < 0) h += 360;
  return h;
};
