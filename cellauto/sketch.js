// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let param;

let cellPixelWidth = 8;
let brushSize = 5;
let numCellsX;
let numCellsY;

let grid;

let frameTime = 33;

let lastFrameMillis;

function setup() {
	createCanvas(windowWidth, windowHeight, P2D);
	
	numCellsX = ceil(width/cellPixelWidth);
	numCellsY = ceil(height/cellPixelWidth);

	pixelDensity(1);

	grid = new Array(numCellsY+1).fill(0).map(x => Array(numCellsX).fill(0));

	for (let i = 0; i < (numCellsX*numCellsY*0.9); i++) {
		grid[floor(random(numCellsY))][floor(random(numCellsX))] = 1;
	}
	// frameRate();

	// loadPixels();
	noStroke();
	fill(79, 232, 94);

	lastFrameMillis = millis();
}

function draw() {
	background(25);
	
	if(mouseIsPressed) {
		for (let y = -brushSize; y < brushSize; y++) {
			for (let x = -brushSize; x < brushSize; x++) {
				if (dist(mouseX + x*cellPixelWidth, mouseY + y*cellPixelWidth, mouseX, mouseY) / cellPixelWidth <= brushSize) {
					grid[floor(mouseY/cellPixelWidth + y)][floor(mouseX/cellPixelWidth) + x] = 1;
				}
			}
		}
	}

	if (millis() - lastFrameMillis >= frameTime) {
		tick();
		
		lastFrameMillis = millis();
	}
	
	display();
}

function tick() {
	for (let i = (numCellsY-1) * (numCellsX); i >= 0; i--) {
		let x = i % numCellsX;
		let y = floor(i / numCellsX);
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

function display() {
	// for (let y = 0; y < numCellsY; y++) {
	// 	for (let x = 0; x < numCellsX; x++) {
	// 		if (grid[y][x] !== 0) {
	// 			rect(x*cellPixelWidth, y*cellPixelWidth, cellPixelWidth, cellPixelWidth);
	// 		}
	// 	}
	// }

	// stroke(0);
	// strokeWeight(1);

	// for (let y = 0; y < numCellsY; y++) {
	// 	line(0, y*cellPixelWidth, width, y*cellPixelWidth);
	// }
	// for (let x = 0; x < numCellsX; x++) {
	// 	line(x*cellPixelWidth, 0, x*cellPixelWidth, height);
	// }

	loadPixels();
	let rowx = 0;
	let cellx = 0;
	let celly = 0;
	let x = 0;
	let y = 0;
	for (let i = 0; i < width*height; i++) {
		// let div = i / width;
		// let mod = i - div;
		// let y = floor(div / cellPixelWidth);
		// let x = floor(((i) % width) / cellPixelWidth);
		if (cellx === cellPixelWidth) {
			cellx = 0;
			x++;
		}
		if (rowx === width) {
			rowx = 0
			cellx = 0;
			x = 0;
			celly++;
		}
		if (celly === cellPixelWidth) {
			celly = 0;
			y++;
		}

		if (grid[y][x]) {
			pixels[i*4 + 0] = 79;
			pixels[i*4 + 1] = 232;
			pixels[i*4 + 2] = 94;
			pixels[i*4 + 3] = 255;
		}
		
		cellx++;
		rowx++;
	}
	updatePixels();
}
