// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let param;

let cellPixelWidth = 4;
let numCellsX;
let numCellsY;

let grid;
let pd, pd2;

function setup() {
	createCanvas(windowWidth, windowHeight);
	
	numCellsX = ceil(width/cellPixelWidth);
	numCellsY = ceil(height/cellPixelWidth);

	pixelDensity(1);
	pd = pixelDensity();
	pd2 = pd*pd;

	grid = new Array(numCellsY+1).fill(0).map(x => Array(numCellsX).fill(0));

	for (let i = 0; i < (numCellsX*numCellsY*0.1); i++) {
		grid[floor(random(numCellsY))][floor(random(numCellsX))] = 1;
	}
	frameRate(20);

	background(25);
	loadPixels();
	display();
}

function draw() {

	print(frameRate());
	// loadPixels();
	
	if(mouseIsPressed) {
		grid[floor(mouseY/cellPixelWidth)][floor(mouseX/cellPixelWidth)] = 1;
	}
	
	for (let i = (numCellsY-1) * (numCellsX); i >= 0; i--) {
		let x = i % numCellsX;
		let y = floor(i / numCellsX);
		if (grid[y][x] === 1) {
			if (grid[y+1][x] === 0) {
				grid[y][x] = 0;
				square(x*cellPixelWidth, y*cellPixelWidth, 0);
				grid[y+1][x] = 1
				square(x*cellPixelWidth, (y+1)*cellPixelWidth, 1);
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
					square((x-1)*cellPixelWidth, (y+1)*cellPixelWidth, 1);
					grid[y][x] = 0;
					square(x*cellPixelWidth, y*cellPixelWidth, 0);
				} else if (dr > 0 && dl === 0) {
					grid[y+1][x+1] = 1;
					square((x+1)*cellPixelWidth, (y+1)*cellPixelWidth, 1);
					grid[y][x] = 0;
					square(x*cellPixelWidth, y*cellPixelWidth, 0);
				} else if (dr > 0 && dl > 0) {
					if (dr > dl) {
						grid[y+1][x+1] = 1;
						square((x+1)*cellPixelWidth, (y+1)*cellPixelWidth, 1);
						grid[y][x] = 0;
						square(x*cellPixelWidth, y*cellPixelWidth, 0);
					} else if (dr < dl) {
						grid[y+1][x-1] = 1;
						square((x-1)*cellPixelWidth, (y+1)*cellPixelWidth, 0);
						grid[y][x] = 0;
						square(x*cellPixelWidth, y*cellPixelWidth, 0);
					} else {
						if (random(-1, 1) > 0) {
							grid[y+1][x-1] = 1;
							square((x-1)*cellPixelWidth, (y+1)*cellPixelWidth, 0);
						} else {
							grid[y+1][x+1] = 1;
							square((x+1)*cellPixelWidth, (y+1)*cellPixelWidth, 0);
						}
						grid[y][x] = 0;
						square(x*cellPixelWidth, y*cellPixelWidth, 0);
					}
				}
			}
		}
	}	

	updatePixels();
	// display();
}

function display() {
	// noStroke();
	// fill(79, 232, 94);
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

	for (let i = 0; i < width*height; i++) {
		let x = floor(((i) % width) / cellPixelWidth);
		let y = floor(((i) / width) / cellPixelWidth);
		// print(y);
		if (grid[y][x]) {
			pixels[i*4 + 0] = 79;
			pixels[i*4 + 1] = 232;
			pixels[i*4 + 2] = 94;
			pixels[i*4 + 3] = 255;
		}
	}
	updatePixels();
}

function square(x, y, f) {
	for (let i = 0; i < cellPixelWidth*cellPixelWidth; i++) {
		let ix = x + (i % cellPixelWidth);
		let iy = y + floor(i / cellPixelWidth);

		let index = (ix + (iy*width)) * 4;

		pixels[index + 0] = 79 * f;
		pixels[index + 1] = 232 * f;
		pixels[index + 2] = 94 * f;
		pixels[index + 3] = 255 * f;
	}
}
