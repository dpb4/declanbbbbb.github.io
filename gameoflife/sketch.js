// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let numSqW = 100;
let numSqH;
let sqWid;

let grid;

function setup() {
  createCanvas(windowWidth, windowHeight);

  sqWid = width/numSqW;
  numSqH = floor(height/sqWid);

  grid = Array(numSqW).fill(0).map(x => Array(numSqH).fill(0));
}

function draw() {
  background(255);
  displayGrid();
  
}

function displayGrid() {
  for (let x = 0; x < numSqW; x++) {
    for (let y = 0; y < numSqH; y++) {
      if (grid[x][y] === 1) {
        fill(0);
      } else {
        fill(255);
      }
      rect(x*sqWid, y*sqWid, sqWid, sqWid);
    }
  }
}

function mouseClicked() {
  let cellX = floor(mouseX/sqWid);
  let cellY = floor(mouseY/sqWid);

  if (grid[cellX][cellY] === 0) {
    grid[cellX][cellY] = 1;
  } else {
    grid[cellX][cellY] = 0;
  }
}

function keyPressed() {
  if (keyCode === SPACE) {
    background(255, 0, 0);
  }
}
