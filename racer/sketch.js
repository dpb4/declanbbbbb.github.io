const canvas = document.createElement("canvas");
const context = canvas.getContext("2d");

let width = window.innerWidth
|| document.documentElement.clientWidth
|| document.body.clientWidth;

let height = window.innerHeight
|| document.documentElement.clientHeight
|| document.body.clientHeight;

let imageData;

// canvas.style["background-color"] = "rgb(45, 56, 77)";
canvas.style["image-rendering"] = "pixelated";
canvas.id = "game";

let minZ = 0;
let roadWidth = 256;

let speed = 1;

let cameraHeight = 60;
let followingDistance = 200;
let cameraViewOffset = 0.5;

let fov = Math.PI/2;
let projectionDistance;

let camera = {x: 0, y: 0, z: cameraHeight};
let player = {x: 32, y: followingDistance, z: 0};
let car = {width: 63, height: 40};
let images;
// let carSprite = load("assets/911.png");

let gameIsRunning = false;

function loadImages(names, callback) {

	let result = {};
	let count  = names.length;
	
	// let onload = function() { if (--count == 0) callback(result); };

	for(let n = 0 ; n < names.length ; n++) {
		
		let name = names[n];

		let img = document.createElement('img');
		// img.addEventListener('load', onload);
		img.src = "assets/" + name + ".png";
		
		// let can = document.createElement('canvas');
		// can.width = img.width;
		// can.height = img.height;
		// let ctx = can.getContext("2d");
		// ctx.drawImage(img, 0, 0);
		context.fillRect(0, 0, img.width, img.height);
		context.drawImage(img, 0, 0);
		// ctx.fillRect(0, 0, 20, 20);

		// result[name] = img;
		result[name] = context.getImageData(0, 0, img.width, img.height);
	}
	callback(result);
}

function startGame(loadedImages) {
	images = loadedImages;
	window.requestAnimationFrame(gameLoop);
}
  

window.onload = () => {

	document.body.appendChild(canvas);
	document.body.style["margin"] = "0";
	document.body.style["background-color"] = "rgb(23, 29, 40)";

	canvas.width = 480;
	canvas.height = 320;

	projectionDistance = canvas.width/2 / Math.tan(fov/2);

	imageData = new ImageData(canvas.width, canvas.height);


	gameIsRunning = true;
	loadImages(['911'], startGame);
}



function gameLoop() {
	
	display();
	// context.drawImage(images[911], 0, 0);
	window.requestAnimationFrame(gameLoop);

	// cameraViewOffset += 0.001;
	// player.y += 1;
	player.y += 2 + Math.sin(performance.now()/600);
	camera.y += Math.max(0, player.y - camera.y - followingDistance) * 0.01;
	// camera.y += 2 + Math.sin(performance.now()/600);
	// minZ += 0.1;
	// console.log(minZ)
}

function updateFOV(num) {
	fov = num;
	projectionDistance = canvas.width/2 / Math.tan(fov/2);
}

function getMousePos(canvas, evt) {
    let rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

function drawCar() {
	let brightness = Math.min(Math.max(1 - Math.pow((player.y - camera.y) / 10000, 0.6), 0.5), 1);

	let ratio = projectionDistance / (player.y - camera.y);
	
	let screenX = Math.floor(player.x * ratio) + canvas.width/2;
	let screenY = Math.floor(camera.z * ratio) + canvas.height/2;
	
	let screenWidth = Math.floor(car.width*ratio);
	let screenHeight = Math.floor(car.height*ratio);

	for (let y = Math.floor(screenY - screenHeight/2); y < Math.floor(screenY + screenHeight/2); y++) {
		for (let x = Math.floor(screenX - screenWidth/2); x < Math.floor(screenX + screenWidth/2); x++) {

			let index = 4*(x + y*canvas.width);
		
			imageData.data[index] = 255 * brightness;
			imageData.data[index+1] = 0;
			imageData.data[index+2] = 0;
			imageData.data[index+3] = 255;
		}
	}
	// console.log(screenX, screenY, ratio);

}

let count = 0;
function display() {
	for (let y = 0; y < canvas.height; y++) {
		let rayZ = y - cameraViewOffset*canvas.height;
		let rayY = projectionDistance;

		if (rayZ > minZ) {
			
			let intersectionY = projectionDistance / rayZ * camera.z + camera.y;
			// print(intersectionY);
			// console.log(intersectionY);
			let brightness = Math.min(Math.max(1 - Math.pow((intersectionY - camera.y) / 10000, 0.6), 0.5), 1);
			
			// if (count < 20) {
			// 	console.log(intersectionY, brightness);
			// 	count++;
			// }
			
			let c = {r: 0, g: 0, b: 0};
			for (let x = 0; x < canvas.width; x++) {
				let rayX = x - canvas.width/2;
				let intersectionX = (intersectionY - camera.y) * rayX / projectionDistance;
				let index = 4 * (x + y*canvas.width);
				
				if (Math.abs(intersectionX) < roadWidth/2) {
					c.r = 128 * brightness;
					c.g = 128 * brightness;
					c.b = 128 * brightness;

					if (Math.abs(intersectionX) % (roadWidth/4) < 4 && Math.floor(intersectionY / 32) % 3 !== 0) {
						//245, 215, 66
						c.r = 245 * brightness;
						c.g = 215 * brightness;
						c.b = 66 * brightness;
					}
				} else {
					if (Math.floor(Math.abs(intersectionX) / 64) % 2 !== Math.floor((intersectionY) / 64) % 2) {
						c.r = 107*brightness;
						c.g = 196*brightness;
						c.b = 69*brightness;
					} else {
						c.r = 74*brightness;
						c.g = 143*brightness;
						c.b = 44*brightness;
					}
				}

				
				imageData.data[index + 0] = c.r;
				imageData.data[index + 1] = c.g;
				imageData.data[index + 2] = c.b;
				imageData.data[index + 3] = 255;
			}
		} else {
			for (let x = 0; x < canvas.width; x++) {
				let index = 4 * (x + y*canvas.width);

				imageData.data[index + 0] = 255;
				imageData.data[index + 1] = 255;
				imageData.data[index + 2] = 255;
				imageData.data[index + 3] = 255;
			}
		}

		// player 

		// console.log(perceivedWidth);
	}
	

	drawCar();


	context.putImageData(imageData, 0, 0);
}

// function display() {
// 	let rowx = 0;
// 	let cellx = 0;
// 	let celly = 0;
// 	let x = 0;
// 	let y = 0;

// 	for (let i = 0; i < canvas.width*canvas.height; i++) {
// 		if (cellx === cellPixelWidth) {
// 			cellx = 0;
// 			x++;
// 		}
// 		if (rowx === canvas.width) {
// 			rowx = 0
// 			cellx = 0;
// 			x = 0;
// 			celly++;
// 		}
// 		if (celly === cellPixelWidth) {
// 			celly = 0;
// 			y++;
// 		}

// 		let c = grid[y][x];

// 		if (c !== 0) {
// 			imageData.data[i*4 + 0] = c.r;
// 			imageData.data[i*4 + 1] = c.g;
// 			imageData.data[i*4 + 2] = c.b;
// 			imageData.data[i*4 + 3] = 255;
// 		} else {
// 			imageData.data[i*4 + 0] = 45;
// 			imageData.data[i*4 + 1] = 56;
// 			imageData.data[i*4 + 2] = 77;
// 			imageData.data[i*4 + 3] = 255;
// 		}
// 		// if (true) {
// 		// 	imageData.data[i*4 + 0] = Math.floor(Math.random() * 255);
// 		// 	imageData.data[i*4 + 1] = 200;
// 		// 	imageData.data[i*4 + 2] = 50;
// 		// 	imageData.data[i*4 + 3] = 255;
// 		// }
		
// 		cellx++;
// 		rowx++;
// 	}
// 	// console.log(imageData);
// 	context.putImageData(imageData, 0, 0);

// 	// context.fillRect(0, 0, 100, 100);
// }
