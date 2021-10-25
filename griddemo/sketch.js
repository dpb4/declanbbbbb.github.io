// Grid Demo

let gridSize = 60;
let grid;
let nesw = [[0, 1], [1, 0], [0, -1], [-1, 0], [0, 0]];

function setup() {
  createCanvas(windowWidth, windowHeight);
  grid = createRandom2DArray(gridSize, gridSize);
  stroke(128);
}

function draw() {
  background(220);
  displayGrid();
}

function mousePressed() {
  let cellWidth = width/gridSize;
  let cellHeight = width/gridSize;

  let cellX = Math.floor(mouseX/cellWidth);
  let cellY = Math.floor(mouseY/cellWidth);

  for (let move of nesw) {
    let nCellX = cellX + move[0];
    let nCellY = cellY + move[1];
    if (nCellX < gridSize && nCellX >= 0 && nCellY < gridSize && nCellY >= 0) {
      if (grid[nCellY][nCellX] === 1) {
        grid[nCellY][nCellX] = 0;
      }
      else if (grid[nCellY][nCellX] === 0) {
        grid[nCellY][nCellX] = 1;
      }
    }
  }
}
function keyTyped() {
  if (key === 'b') {
    grid = createEmpty2DArray(gridSize, gridSize, 1);
  } else if (key === 'w') {
    grid = createEmpty2DArray(gridSize, gridSize, 0);

  }
  // uncomment to prevent any default behavior
  // return false;
}
function keyPressed() {

  grid = createEmpty2DArray(gridSize, gridSize);
  
}

function displayGrid() {
  let cellWidth = width/gridSize;
  let cellHeight = width/gridSize;

  for (let y=0; y<gridSize; y++) {
    for (let x=0; x<gridSize; x++) {
      if (grid[y][x] === 0) {
        fill("white");
      }
      else if (grid[y][x] === 1) {
        fill("black");
      }
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
      if (random(100) < 50) {
        grid[y].push(0);
      }
      else {
        grid[y].push(1);
      }
    }
  }
  return grid;
}