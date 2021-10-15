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
let neighbors = [[1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1], [1, 0]];
let speed;

function setup() {
  createCanvas(windowWidth, windowHeight);

  sqWid = width/numSqW;
  numSqH = floor(height/sqWid) + 1;
  speed = 5;

  grid = Array(numSqW).fill(0).map(x => Array(numSqH).fill(0));
}

function draw() {
  background(255);
  displayGrid();
  // frameRate(60/speed);
  if (keyIsDown(32) && frameCount % speed === 0) {
    tickGrid();
  }
}

function tickGrid() {
  let nextGrid = Array(numSqW).fill(0).map(x => Array(numSqH).fill(0));

  for (let x = 0; x < numSqW; x++) {
    for (let y = 0; y < numSqH; y++) {
      let cell = grid[x][y];
      let num = numNeighbors(x, y);
      if (cell === 1) {
        if (num === 2 || num === 3) {
          nextGrid[x][y] = 1;
        }
      } else {
        if (num === 3) {
          nextGrid[x][y] = 1;
        }
      }
    }
  }

  grid = [...nextGrid];
}

function numNeighbors(x, y) {
  let sum = 0;
  for (let n of neighbors) {
    let nx = x + n[0];
    let ny = y + n[1];
    if (nx >= 0 && nx < numSqW && ny >= 0 && ny < numSqH) {
      if (grid[nx][ny] === 1) {
        sum++;
      }
    }
  }
  return sum;
}

function fillRandom() {
  for (let x = 0; x < numSqW; x++) {
    for (let y = 0; y < numSqH; y++) {
      grid[x][y] = round(random(0, 1));
    }
  }
}

function displayGrid() {
  for (let x = 0; x < numSqW; x++) {
    for (let y = 0; y < numSqH; y++) {
      if (grid[x][y] === 1) {
        fill(0);
        rect(x*sqWid, y*sqWid, sqWid, sqWid);
      }
    }
  }

  //vertical
  for (let i = 0; i < numSqW; i++) {
    line(i*sqWid, 0, i*sqWid, height);
  }
  //horizontal
  for (let i = 0; i < numSqH; i++) {
    line(0, i*sqWid, width, i*sqWid);
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
  // if (keyIsDown(32)) {
  //   tickGrid();
  // }
  if (keyIsDown(88)) {
    grid = Array(numSqW).fill(0).map(x => Array(numSqH).fill(0));
  }
  if (keyIsDown(82)) {
    fillRandom();
  }
}

function mouseWheel(event) {
  speed += event.delta/100;
}