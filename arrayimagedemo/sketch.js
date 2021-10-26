// Grid Demo

let gridSizeX = 100;
let gridSizeY;
let cellWidth;
let cellHeight;
let seed;

let grid;

let noiseZoom = 20;

let offsetX = 0;
let offsetY = 0;

let planeDir;
let planeSpeed;

let straight;
let left;
let right;

let curSprite;

function preload() {
  straight = loadImage("assets/straight.png");
  left = loadImage("assets/bankleft.png");
  right = loadImage("assets/bankright.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  gridSizeY = floor(height/(width/gridSizeX)) + 1;
  
  seed = random(-10000, 20000);
  cellWidth = width/gridSizeX;
  cellHeight = height/gridSizeY;
  
  grid = createEmpty2DArray(gridSizeY, gridSizeX, 0);
  createFancyNoiseArray();
  
  noStroke();
}

function draw() {
  checkInput();
  displayGrid();
}

function checkInput() {
  if (keyIsDown(UP_ARROW) || keyIsDown(65)) {
    offsetY -= 1/noiseZoom;
  }

  if (keyIsDown(LEFT_ARROW) || keyIsDown(87)) {
    offsetX -= 1/noiseZoom;
  }

  if (keyIsDown(DOWN_ARROW) || keyIsDown(68)) {
    offsetY += 1/noiseZoom;
  }

  if (keyIsDown(RIGHT_ARROW) || keyIsDown(83)) {
    offsetX += 1/noiseZoom;
  }

  createFancyNoiseArray();
}

function displayGrid() {
  for (let y=0; y<gridSizeY; y++) {
    for (let x=0; x<gridSizeX; x++) {
      fill(floatToColour(grid[y][x]));
      rect(x*cellWidth, y*cellHeight, cellWidth+1, cellHeight+1);
    }
  }
}

function displayPlane() {
  push();
  imageMode(CENTER);

  rotate(planeDir);
  image(curSprite, width/2, height/2);
  pop();
}

function createEmpty2DArray(rows, cols, val) {
  let grid = [];
  for (let y=0; y<rows; y++) {
    grid.push([]);
    for (let x=0; x<cols; x++) {
      grid[y].push(val);
    }
  }
  return grid;
}

function floatToColour(x) {
  let water = 0.4;
  let sand = 0.5;
  let grass = 0.65;
  let mountain = 0.8;

  if (x < water) {
    return color(28, 120, 186);
  } else if (x < sand) {
    return lerpColor(color(247, 246, 186), color(217, 216, 171), map(x, water, sand, 1, 0));
  } else if (x < grass) {
    return lerpColor(color(27, 141, 38), color(67, 181, 78), map(x, sand, grass, 0, 1));
  } else if (x < mountain) {
    return lerpColor(color(153, 153, 153), color(255), map(x, grass, 1, 0, 1));
  } else {
    return color(255);
  }
}

function createFancyNoiseArray() {
  let cols = grid.length;
  let rows = grid[0].length;

  for (let y=0; y<rows; y++) {
    for (let x=0; x<cols; x++) {
      grid[x][y] = noise(x/noiseZoom + offsetX + seed, y/noiseZoom + offsetY + seed);
    }
  }
}

function mouseWheel(event) {
  noiseZoom += event.delta/100;
  noiseZoom = max(0, noiseZoom);
}