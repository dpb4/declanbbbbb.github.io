const canvas = document.createElement("canvas");
const context = canvas.getContext("2d");

let width = window.innerWidth
|| document.documentElement.clientWidth
|| document.body.clientWidth;

let height = window.innerHeight
|| document.documentElement.clientHeight
|| document.body.clientHeight;

let imageData;
let frameID = 0;

// canvas.style["background-color"] = "rgb(45, 56, 77)";
canvas.style["image-rendering"] = "pixelated";
canvas.id = "game";

let minZ = 0;
let roadWidth = 256;

let speed = 1;
let friction = 0.001;
let speedConstant = 18;

let cameraHeight = 60;
let followingDistance = 120;
let cameraViewOffset = 0.5;
let carPullStrength = 0.25;

let fov = Math.PI/2;
let projectionDistance;

// let player = {x: 0, y: followingDistance, z: 0};
let player;
// let car = {width: 63, height: 40};

let camera = {x: 0, y: 0, z: cameraHeight};
// let cars = [];
let images;

let gameIsRunning = false;

function loadImages(names, callback) {

	let result = {};
	let count  = names.length;
	
	// let onload = 

	for(let n = 0 ; n < names.length ; n++) {
		
		let name = names[n];

		let img = document.createElement('img');
		img.src = "assets/" + name + ".png";

		img.addEventListener('load', () => {
			context.drawImage(img, 0, 0);
			result[name] = context.getImageData(0, 0, img.width, img.height);
			if (--count == 0) {
				console.log("images loaded", performance.now());

				callback(result); 
			}
		});
	}
}

function startGame(loadedImages) {
	images = loadedImages;
	player = new Player('911');

	gameIsRunning = true;
	frameID = window.requestAnimationFrame(gameLoop);
}

let endGame = () => {
	gameIsRunning = false;
	window.cancelAnimationFrame(frameID);
}
  
window.onbeforeunload = endGame;

window.onload = () => {

	document.body.appendChild(canvas);
	document.body.style["margin"] = "0";
	document.body.style["background-color"] = "rgb(23, 29, 40)";

	canvas.width = 480;
	canvas.height = 320;

	projectionDistance = canvas.width/2 / Math.tan(fov/2);

	imageData = new ImageData(canvas.width, canvas.height);

	loadImages(['911'], startGame);
}



function gameLoop() {
	if (!gameIsRunning) {
		return;
	}
	
	// context.drawImage(images[911], 0, 0);
	
	// cameraViewOffset += 0.001;
	// player.y += 1;
	// player.y += 2 + 2*Math.sin(performance.now()/600);
	camera.y += Math.max(0, player.car.pos.y - camera.y - followingDistance) * carPullStrength;
	// camera.y += 2 + Math.sin(performance.now()/600);
	// minZ += 0.1;
	// console.log(minZ)
	updateCars();
	player.update();
	// console.log(player.car.speedometer());
	display();
	window.requestAnimationFrame(gameLoop);
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

function updateCars() {
	// for (c in cars) {
	// 	c.update();
	// }
	player.car.update();
}

function drawCar() {
	let brightness = Math.min(Math.max(1 - Math.pow((player.car.pos.y - camera.y) / 10000, 0.6), 0.5), 1);

	let ratio = projectionDistance / (player.car.pos.y - camera.y);
	
	let screenX = Math.floor(player.car.pos.x * ratio) + canvas.width/2;
	let screenY = Math.floor(camera.z * ratio) + canvas.height/2;
	
	let screenWidth = Math.floor(player.car.width*ratio);
	let screenHeight = Math.floor(player.car.height*ratio);

	// console.log(images[911]);
	for (let y = Math.floor(screenY - screenHeight/2); y < Math.floor(screenY + screenHeight/2); y++) {
		for (let x = Math.floor(screenX - screenWidth/2); x < Math.floor(screenX + screenWidth/2); x++) {
			let spriteX = Math.floor(((x - Math.floor(screenX - screenWidth/2)) / screenWidth) * images[911].width);
			let spriteY = Math.floor(((y - Math.floor(screenY - screenHeight/2)) / screenHeight) * images[911].height);

			let index = 4*(x + y*canvas.width);
			let spriteIndex = 4*(spriteX + spriteY*images[911].width);
			
			if (images[911].data[spriteIndex+3] !== 0) {
				imageData.data[index+0] = images[911].data[spriteIndex+0] * brightness;
				imageData.data[index+1] = images[911].data[spriteIndex+1] * brightness;
				imageData.data[index+2] = images[911].data[spriteIndex+2] * brightness;
				imageData.data[index+3] = images[911].data[spriteIndex+3] * brightness;
			}
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
