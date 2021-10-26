// Grid Demo

let gridSizeX = 100;
let gridSizeY;
let cellWidth;
let cellHeight;
let seed;

let grid;

let noiseZoom = 10;

let offsetX = 0;
let offsetY = 0;

let planeDir = 0;
let planeSpeed;
let turnRate;

let straight;
let left;
let right;

let curSprite;

// remember to use min p5 for this!!!!! very important!!!!!

// things to add: smooth land, altimeter, smoke, landmass generationa

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
  turnRate = PI/64;
  
  grid = createEmpty2DArray(gridSizeY, gridSizeX, 0);
  createFancyNoiseArray();
  
  noStroke();
}

function draw() {
  checkInput();
  displayGrid();
  displayPlane();
}

function checkInput() {
  curSprite = straight;
  if (keyIsDown(65)) {
    curSprite = left;
    planeDir -= turnRate;
  }

  if (keyIsDown(68)) {
    curSprite = right;
    planeDir += turnRate;
  }

  offsetX -= cos(planeDir)/(50-noiseZoom)/4;
  offsetY += sin(planeDir)/(50-noiseZoom)/4;
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

  translate(width/2, height/2);
  rotate(planeDir);
  image(curSprite, 0, 0);
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
  noiseZoom -= event.delta/100;
  noiseZoom = min(max(10, noiseZoom), 41);
}