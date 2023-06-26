// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let param;

let cellPixelWidth = 6;
let brushSize = 20;
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

	// for (let i = 0; i < (numCellsX*numCellsY*0.1); i++) {
	// 	grid[floor(random(numCellsY))][floor(random(numCellsX))] = new Sand(floor(random(numCellsX)), floor(random(numCellsY)));
	// }
	// frameRate();

	// loadPixels();
	noStroke();
	fill(79, 232, 94);

	lastFrameMillis = millis();
}

function draw() {
	background(25);
	print(frameRate());
	if(mouseIsPressed) {
		for (let y = -brushSize; y < brushSize; y++) {
			for (let x = -brushSize; x < brushSize; x++) {
				if (dist(mouseX + x*cellPixelWidth, mouseY + y*cellPixelWidth, mouseX, mouseY) / cellPixelWidth <= brushSize) {
					grid[floor(mouseY/cellPixelWidth + y)][floor(mouseX/cellPixelWidth) + x] = new Sand(floor(mouseX/cellPixelWidth) + x, floor(mouseY/cellPixelWidth + y));
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
		if (grid[y][x] !== 0) {
			grid[y][x].update();
		}
	}
}

function display() {
	loadPixels();
	let rowx = 0;
	let cellx = 0;
	let celly = 0;
	let x = 0;
	let y = 0;
	for (let i = 0; i < width*height; i++) {
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

		let c = grid[y][x];

		if (c !== 0) {
			pixels[i*4 + 0] = c.r;
			pixels[i*4 + 1] = c.g;
			pixels[i*4 + 2] = c.b;
		}
		
		cellx++;
		rowx++;
	}
	updatePixels();
}
