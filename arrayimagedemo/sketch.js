// Grid Demo

let gridSizeX = 100;
let grisSizeY;
let grid;
let nesw = [[0, 1], [1, 0], [0, -1], [-1, 0], [0, 0]];
let noiseZoom = 20;

let octaves = 1;
let frequency = 2;
let amplitude = 0; // used for octave layering

let offsetY = 0;

let expCo = 10;

function setup() {
  createCanvas(windowWidth, windowHeight);
  gridSizeY = floor(height/(width/gridSizeX)) + 1;
  grid = createFancyNoiseArray(gridSizeX, gridSizeY);
  
  noStroke();
}

function draw() {
  background(220);
  displayGrid();

  if (keyIsDown(UP_ARROW)) {
    offsetY += height/gridSizeX/noiseZoom;
    grid = createFancyNoiseArray(gridSizeX, gridSizeX);
    console.log("moving");
  }
}

function displayGrid() {
  let cellWidth = width/gridSizeX;
  let cellHeight = width/gridSizeX;

  for (let y=0; y<gridSizeY; y++) {
    for (let x=0; x<gridSizeX; x++) {
      noStroke();
      fill(floatToColour(grid[y][x]));
      rect(x*cellWidth, y*cellHeight, cellWidth, cellHeight);
    }
  }
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

function createRandom2DArray(rows, cols) {
  let grid = [];
  for (let y=0; y<rows; y++) {
    grid.push([]);
    for (let x=0; x<cols; x++) {
      grid[y].push(fancyNoise(x, y));
    }
  }
  return grid;
}

function floatToColour(x) {
  let water = 0.4;
  let sand = 0.5;
  let grass = 0.7;
  let mountain = 0.9;

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

function createFancyNoiseArray(cols, rows) {
  let grid = [];
  let aMin = 9999999;
  let aMax = -9999999;

  for (let y=0; y<rows; y++) {
    grid.push([]);
    for (let x=0; x<cols; x++) {

      let cellVal = 0;
      for (let i = 0; i < octaves; i++) {
        cellVal += noise(x/noiseZoom * pow(frequency, i), y/noiseZoom * pow(frequency, i) + offsetY) * pow(amplitude, i);
      }

      grid[y].push(cellVal);
      aMin = min(aMin, cellVal);
      aMax = max(aMax, cellVal);
    }
  }

  for (let y=0; y<rows; y++) {
    for (let x=0; x<cols; x++) {
      grid[y][x] = map(grid[y][x], aMin, aMax, 0, 1);
    }
  }
  return grid;
}
function fancyNoise(x, y) {
  let out = 0;
  for (let i = 0; i < octaves; i++) {
    out += noise(x/noiseZoom * pow(frequency, i), y/noiseZoom * pow(frequency, i)) * exp(expCo * (pow(amplitude, i)-1));
  }
  return min(max(out, 0), 1);
  //return out;
}