// Grid Demo

let gridSizeX = 100;
let gridSizeY;
let cellWidth;
let cellHeight;
let grid;
let nesw = [[0, 1], [1, 0], [0, -1], [-1, 0], [0, 0]];
let noiseZoom = 20;
let seed;

let offsetX = 0;
let offsetY = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  gridSizeY = floor(height/(width/gridSizeX)) + 1;

  seed = random(-10000, 20000);
  cellWidth = width/gridSizeX;
  cellHeight = height/gridSizeY;
  grid = createEmpty2DArray(gridSizeY, gridSizeX, 0);
  grid = createFancyNoiseArray(grid);
  
  noStroke();
}

function draw() {
  // background(220);
  // loadPixels();

  if (keyIsDown(UP_ARROW)) {
    offsetY -= 1/noiseZoom;
    grid = createFancyNoiseArray(grid);
  }

  if (keyIsDown(LEFT_ARROW)) {
    offsetX -= 1/noiseZoom;
    grid = createFancyNoiseArray(gridSizeX, gridSizeY);
  }

  if (keyIsDown(DOWN_ARROW)) {
    offsetY += 1/noiseZoom;
    grid = createFancyNoiseArray(gridSizeX, gridSizeY);
  }

  if (keyIsDown(RIGHT_ARROW)) {
    offsetX += 1/noiseZoom;
    grid = createFancyNoiseArray(gridSizeX, gridSizeY);
  }
  displayGrid();
}

function displayGrid() {
  for (let y=0; y<gridSizeY; y++) {
    for (let x=0; x<gridSizeX; x++) {
      fill(floatToColour(grid[y][x]));
      rect(x*cellWidth, y*cellHeight, cellWidth+1, cellHeight+1);
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

function createFancyNoiseArray(array) {
  let cols = array.length;
  let rows = array[0].length;

  for (let y=0; y<rows; y++) {
    for (let x=0; x<cols; x++) {
      array[y][x] = (noise(x/noiseZoom + offsetX + seed, y/noiseZoom + offsetY + seed));
    }
  }

  return array;
}

function pixRect() {
  loadPixels();
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // let c = floatToColour(grid[floor(y/cellHeight)][floor(x/cellWidth)]);
      // let i = y*width + x;

      // pixels[i*4] = red(c);
      // pixels[i*4 + 1] = green(c);
      // pixels[i*4 + 2] = blue(c);

      let c = floatToColour(grid[floor(y/cellHeight)][floor(x/cellWidth)]);
      
      let index = 4 * (y * width + x);
      pixels[index] = 0;
      pixels[index+1] = 255;
      pixels[index+2] = 255;

    }
  }
  updatePixels();
}