const canvas = document.getElementById("climate-canvas");
const ctx = canvas.getContext("2d");
const period = 70_000;
const population = 120;
let canvasWidth;
// Width of streaks (dots)
const minWidth = 2;  // pixels
const maxWidth = 8;
let canvasHeight;
let minHeight;
let maxHeight;
var dots;
const maxSpeed = 35;
const minSpeed = 6;
const glow = 10; // Set to 0 for better performance
let amplitude;

function resetDimensions() {
  // Use CSS to guide our sizing of the canvas.
  const root = document.documentElement;
  // Here we assume that the hero height is expressed in pixels. The width actually ends up being rescaled, so even
  // though it might not be `climate-width` pixels, the position of dots etc gets rescaled by the same multiplier, so
  // our calculations end up being fine.
  const climateWidthString = getComputedStyle(root).getPropertyValue('--climate-width');
  canvasWidth = parseFloat(climateWidthString); // Convert to pixels
  // Here we assume that the hero height is expressed in pixels.
  const climateHeightString = getComputedStyle(root).getPropertyValue('--climate-height');
  canvasHeight = parseFloat(climateHeightString); // Pixels
  ctx.canvas.width = canvasWidth;
  ctx.canvas.height = canvasHeight;
  maxHeight = canvasHeight * 0.9;
  minHeight = canvasHeight * 0.5;
  dots = [{}];
  ctx.globalCompositeOperation = "lighter";
  amplitude = canvasWidth * 0.05;  // Oscillation amplitude (along x axis)
}

window.onresize = function() {
  resetDimensions();
  pushDots(dots, population);
};

function getHSVFromX(x, width) {
  // Notice this assumes that the canvas starts at x=0
  const xNormalized = x / width; // Normalize x-coordinate to [0, 1] range
  // Define color points in HSV space
  const colorPoints = [
    { x: 1, h: 0, s: 87, v: 30 }, // crimson (100% to the right)
    { x: 0.7, h: 16.5, s: 47.7, v: 86.4 }, // peach
    { x: 0.68, h: 220, s: 42.3, v: 88.4 }, // pastel blue
    { x: 0.62, h: 316.4, s: 17.4, v: 87.9 }, // pastel pink
    { x: 0.6, h: 16.5, s: 4.7, v: 81.8 }, // white (60% to the right)
    { x: 0.5, h: 220, s: 65.4, v: 80.8},
    { x: 0.3, h: 220, s: 71.1, v: 57.6 }, // blue (30% to the right)
    { x: 0, h: 220, s: 83.2, v: 37.4 } // navy blue (0% to the right)
  ];

  // Find the two closest color points
  let closestLeft = null;
  let closestRight = null;
  for (const point of colorPoints) {
    if (point.x <= xNormalized && (closestLeft === null || point.x > closestLeft.x)) {
      closestLeft = point;
    }
    if (point.x >= xNormalized && (closestRight === null || point.x < closestRight.x)) {
      closestRight = point;
    }
  }

  // Interpolate between the two closest color points
  const proportion = (xNormalized - closestLeft.x) / (closestRight.x - closestLeft.x);
  const h = closestLeft.h + proportion * (closestRight.h - closestLeft.h);
  const s = closestLeft.s + proportion * (closestRight.s - closestLeft.s);
  const v = closestLeft.v + proportion * (closestRight.v - closestLeft.v);

  return { h, s, v };
}

function getDot() {
  let centerX = Math.random() * canvasWidth;
  //let centerY = Math.random() * canvasHeight;
  const { h, s, v } = getHSVFromX(centerX, canvasWidth);
  return {
    x: centerX,
    y: Math.random() * canvasHeight / 2,
    h: Math.random() * (maxHeight - minHeight) + minHeight,  // height
    w: Math.random() * (maxWidth - minWidth) + minWidth,  // width
    c: { h, s, v },  // color
    m: Math.random() * (maxSpeed - minSpeed) + minSpeed,  // speed
    x0: centerX,
    y0: Math.random() * canvasHeight / 2,
    t0: new Date().getTime() - Math.random() * period
  };
}

function pushDots(dots, population) {
  for (i = 1; i < population; i++) {
    const dot = getDot();
    dots.push(dot);
  }
}

function render() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  for (i = 1; i < dots.length; i++) {
    ctx.beginPath();
    const { h, s, v } = dots[i].c;
    grd = ctx.createLinearGradient(dots[i].x, dots[i].y, dots[i].x + dots[i].w, dots[i].y + dots[i].h);
    grd.addColorStop(0.0, `hsla(${h}, ${s}%, ${v}%, 0)`);
    grd.addColorStop(0.2, `hsla(${h + 1}, ${s}%, ${v}%, 0.5)`);
    grd.addColorStop(0.5, `hsla(${h + 2}, ${s + 20}%, ${v + 10}%, 0.8)`);
    grd.addColorStop(0.8, `hsla(${h + 4}, ${s}%, ${v}%, 0.5)`);
    grd.addColorStop(1.0, `hsla(${h + 5}, ${s}%, ${v}%, 0)`);
    ctx.shadowBlur = glow;
    ctx.shadowColor = `hsla(${h}, ${s}%, ${v}%, 1)`;
    ctx.fillStyle = grd;
    ctx.fillRect(dots[i].x, dots[i].y, dots[i].w, dots[i].h);
    ctx.closePath();

    let executionTime = new Date().getTime();
    dots[i].x = dots[i].x0 + amplitude * Math.sin(2 * Math.PI * (executionTime - dots[i].t0) / period);
    if (dots[i].x > canvasWidth || dots[i].x < 0) {
      dots[i].t0 = executionTime;
      dots[i].x0 = dots[i].x;
    }

    if (dots[i].x > canvasWidth + maxWidth) {
      dots.splice(i, 1);
      dots.push(getDot());
    }
  }
  window.requestAnimationFrame(render);
}

resetDimensions();
pushDots(dots, population);
render();
