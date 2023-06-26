const canvas = document.createElement("canvas");
const context = canvas.getContext("2d");

let width = window.innerWidth
|| document.documentElement.clientWidth
|| document.body.clientWidth;

let height = window.innerHeight
|| document.documentElement.clientHeight
|| document.body.clientHeight;

let imageData;
canvas.style["background-color"] = "rgb(45, 56, 77)";
canvas.style["image-rendering"] = "pixelated";
canvas.id = "grid";

let param;

let cellPixelWidth = 10;
let brushSize = 0;
let numCellsX;
let numCellsY;

let frameTime = 33;

let lastFrameMillis;
let gameIsRunning = false;
let grid;

window.onload = () => {

	document.body.appendChild(canvas);
	document.body.style["margin"] = "0";
	document.body.style["background-color"] = "rgb(23, 29, 40)";

	canvas.width = Math.min(width, height) * 0.8;
	canvas.height = Math.min(width, height) * 0.8;

	numCellsX = Math.ceil(canvas.width/cellPixelWidth);
	numCellsY = Math.ceil(canvas.height/cellPixelWidth);

	grid = new Array(numCellsY+1).fill(0).map(x => Array(numCellsX).fill(0));

	imageData = new ImageData(canvas.width, canvas.height);
	for (let i = 0; i < canvas.width*canvas.height; i++) {
		imageData[i*4 + 0] = 23;
		imageData[i*4 + 1] = 29;
		imageData[i*4 + 2] = 40;
		imageData[i*4 + 3] = 255;
	}

	gameIsRunning = true;
	
	window.requestAnimationFrame(gameLoop);

	canvas.addEventListener("click", (evt) => {
		let mousePos = getMousePos(canvas, evt);


		if (brushSize > 1) {
			for (let y = -brushSize; y < brushSize; y++) {
				for (let x = -brushSize; x < brushSize; x++) {
					if (Math.pow(x, 2) + Math.pow(y, 2) <= brushSize*brushSize) {
						grid[Math.floor(mousePos.y/cellPixelWidth + y)][Math.floor(mousePos.x/cellPixelWidth) + x] = new Sand(Math.floor(mousePos.x/cellPixelWidth) + x, Math.floor(mousePos.y/cellPixelWidth + y));
					}
					// if (dist(mousePos.x + x*cellPixelWidth, mousePos.y + y*cellPixelWidth, mousePos.x, mousePos.y) / cellPixelWidth <= brushSize) {
					// }
				}
			}
		} else {
			for (let i = 0; i < 10; i++) {
				grid[Math.floor(mousePos.y/cellPixelWidth)+i][Math.floor(mousePos.x/cellPixelWidth)] = new Sand(Math.floor(mousePos.x/cellPixelWidth), Math.floor(mousePos.y/cellPixelWidth)+i);
				grid[Math.floor(mousePos.y/cellPixelWidth)+i][Math.floor(mousePos.x/cellPixelWidth)+1] = new Sand(Math.floor(mousePos.x/cellPixelWidth)+1, Math.floor(mousePos.y/cellPixelWidth)+i);
			}
		}

	});
	// gameLoop();
	for (let i = 0; i < (numCellsX*numCellsY*0.1); i++) {
		let x = Math.floor(Math.random() * numCellsX);
		let y = Math.floor(Math.random() * numCellsY);
		grid[y][x] = new Sand(x, y);
		// console.log("added");
	}

	// grid[10][10] = new Sand(10, 10);
	// grid[11][10] = new Sand(10, 11);
}

// window.addEventListener("DOMContentLoaded", gameLoop);

// gameLoop();


function getMousePos(canvas, evt) {
    let rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

function gameLoop(currentMillis) {
	// console.log(currentMillis - lastFrameMillis, 1000 / (currentMillis - lastFrameMillis));
	lastFrameMillis = currentMillis;
	
	updateCells();
	display();
	window.requestAnimationFrame(gameLoop);
}

function updateCells() {
	// for (let i = (numCellsY-1) * (numCellsX); i >= 0; i--) {
	// 	let x = i % numCellsX;
	// 	let y = Math.floor(i / numCellsX);
	// 	if (grid[y][x] !== 0) {
	// 		grid[y][x].update();
	// 		console.log(i, x, y);
	// 	}
	// }
	for (let y = numCellsY; y >= 0; y--) {
		for (let x = 0; x < numCellsX; x++) {
			if (grid[y][x] !== 0) {
				grid[y][x].update();
				// console.log(x, y);
			}
		}
	}
}

function display() {
	let rowx = 0;
	let cellx = 0;
	let celly = 0;
	let x = 0;
	let y = 0;

	for (let i = 0; i < canvas.width*canvas.height; i++) {
		if (cellx === cellPixelWidth) {
			cellx = 0;
			x++;
		}
		if (rowx === canvas.width) {
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
			imageData.data[i*4 + 0] = c.r;
			imageData.data[i*4 + 1] = c.g;
			imageData.data[i*4 + 2] = c.b;
			imageData.data[i*4 + 3] = 255;
		} else {
			imageData.data[i*4 + 0] = 45;
			imageData.data[i*4 + 1] = 56;
			imageData.data[i*4 + 2] = 77;
			imageData.data[i*4 + 3] = 255;
		}
		// if (true) {
		// 	imageData.data[i*4 + 0] = Math.floor(Math.random() * 255);
		// 	imageData.data[i*4 + 1] = 200;
		// 	imageData.data[i*4 + 2] = 50;
		// 	imageData.data[i*4 + 3] = 255;
		// }
		
		cellx++;
		rowx++;
	}
	// console.log(imageData);
	context.putImageData(imageData, 0, 0);

	// context.fillRect(0, 0, 100, 100);
}
