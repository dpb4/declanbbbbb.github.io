// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let param;

let cellPixelWidth = 20;
let numCellsX;
let numCellsY;

let grid;

function setup() {
	createCanvas(windowWidth, windowHeight);

	numCellsX = ceil(width/cellPixelWidth);
	numCellsY = ceil(height/cellPixelWidth);

	grid = new Array(numCellsY).fill(0).map(x => Array(numCellsX).fill(0));

	for (let i = 0; i < (numCellsX*numCellsY*0); i++) {
		grid[floor(random(numCellsY))][floor(random(numCellsX))] = 1;
	}
	frameRate(20);
}

function draw() {
	background(25);
	
	let nextGrid = new Array(numCellsY).fill(0).map(x => Array(numCellsX).fill(0));

	if(mouseIsPressed) {
		grid[floor(mouseY/cellPixelWidth)][floor(mouseX/cellPixelWidth)] = 1;
	}
	
	for (let y = numCellsY-2; y >= 0; y--) {
		for (let x = 0; x < numCellsX; x++) {
			if (grid[y][x] === 1) {
				if (grid[y+1][x] === 0) {
					grid[y][x] = 0;
					grid[y+1][x] = 1
				} else {
					let dr = 0;
					let dl = 0;

					let checkRight = true;
					let checkLeft = true;
					if (x === 0) {
						dl = 0;
						checkLeft = false;
					} else if (x === numCellsX-1) {
						dr = 0;
						checkRight = false;
					} else {
						if (checkRight) {
							let hit = false;
							let ty = y+1;
							let tx = x+1;
							while (!hit && ty < numCellsY) {
								if (grid[ty][tx] !== 0) {
									hit = true;
								} else {
									ty++;
									dr++;
								}
							}
						}
						if (checkLeft) {
							let hit = false;
							let ty = y+1;
							let tx = x-1;
							while (!hit && ty < numCellsY) {
								if (grid[ty][tx] !== 0) {
									hit = true;
								} else {
									ty++;
									dl++;
								}
							}
						}
					}

					if (dr === 0 && dl > 0) {
						grid[y+1][x-1] = 1;
						grid[y][x] = 0;
					} else if (dr > 0 && dl === 0) {
						grid[y+1][x+1] = 1;
						grid[y][x] = 0;
					} else if (dr > 0 && dl > 0) {
						if (dr > dl) {
							grid[y+1][x+1] = 1;
							grid[y][x] = 0;
						} else if (dr < dl) {
							grid[y+1][x-1] = 1;
							grid[y][x] = 0;
						} else {
							if (random(-1, 1) > 0) {
								grid[y+1][x-1] = 1;
							} else {
								grid[y+1][x+1] = 1;
							}
							grid[y][x] = 0;
						}
					}
				}
			}
		}
	}
	// print(nextGrid);
	
	// for (let y = 0; y < numCellsY; y++) {
	// 	for (let x = 0; x < numCellsX; x++) {
	// 		grid[y][x] = nextGrid[y][x];
	// 	}
	// }
	

	display();
}

function display() {
	noStroke();
	fill(79, 232, 94);
	for (let y = 0; y < numCellsY; y++) {
		for (let x = 0; x < numCellsX; x++) {
			if (grid[y][x] !== 0) {
				rect(x*cellPixelWidth, y*cellPixelWidth, cellPixelWidth, cellPixelWidth);
			}
		}
	}

	stroke(0);
	strokeWeight(1);

	for (let y = 0; y < numCellsY; y++) {
		line(0, y*cellPixelWidth, width, y*cellPixelWidth);
	}
	for (let x = 0; x < numCellsX; x++) {
		line(x*cellPixelWidth, 0, x*cellPixelWidth, height);
	}
}
