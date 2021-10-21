// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let initialGrid = [
  [2, 0, 5,  0, 0, 7,  0, 0, 6],
  [4, 0, 0,  9, 6, 0,  0, 2, 0],
  [0, 0, 0,  0, 8, 0,  0, 4, 5],
  
  [9, 8, 0,  0, 7, 4,  0, 0, 0],
  [5, 7, 0,  8, 0, 2,  0, 6, 9],
  [0, 0, 0,  6, 3, 0,  0, 5, 7],

  [7, 5, 0,  0, 2, 0,  0, 0, 0],
  [0, 6, 0,  0, 5, 1,  0, 0, 2],
  [3, 0, 0,  4, 0, 0,  5, 0, 8]
];

let cellSize;
let grid;

function setup() {
  createCanvas(min(windowWidth, windowHeight) * 0.8, min(windowWidth, windowHeight) * 0.8);

  cellSize = (width-4)/9;

  textAlign(CENTER, CENTER);
  textSize(cellSize * 0.5);
  grid = initialGrid;
}

function draw() {
  background(252);
  
  translate(2, 2);
  displaySudoku();
}

function displaySudoku() {
  for (let i = 0; i <= 9; i++) {
    if (i % 3 === 0) {
      strokeWeight(3);
    } else {
      strokeWeight(1);
    }

    line(0, i*cellSize, width, i*cellSize);
    line(i*cellSize, 0, i*cellSize, height);

    for (let j = 0; j < 9; j++) {
      if (grid[j][i] !== 0) {
        text(grid[j][i], i*cellSize + cellSize/2, j*cellSize + cellSize/2);
      }
    }
  }
}
