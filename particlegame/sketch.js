const canvas = document.createElement("canvas")
const context = canvas.getContext("2d")

let width = window.innerWidth
|| document.documentElement.clientWidth
|| document.body.clientWidth;

let height = window.innerHeight
|| document.documentElement.clientHeight
|| document.body.clientHeight;

const imageData = context.createImageData(Math.min(width, height), Math.min(width, height));
canvas.style["background-color"] = "rgb(45, 56, 77)"
canvas.style["image-rendering"] = "pixelated"
canvas.id = "grid";

window.onload = () => {

	document.body.appendChild(canvas)
	document.body.style["margin"] = "0"
	document.body.style["background-color"] = "rgb(23, 29, 40)"

	// canvas.width = Math.min(width, height) * 0.8;
	// canvas.height = Math.min(width, height) * 0.8;
	canvas.width = 100;
	canvas.height = 100;
}

// window.onresize = () => {
// 	canvas.width = Math.min(width, height);
// 	canvas.height = Math.min(width, height);
// }

let gridSize = 50;
let cellSize;
let grid = Array(gridSize).fill(0).map(x => Array(gridSize).fill(1));

let borderWidth = 5;
let borderRadius = 10;
let cellMargin = 1;
let cellRadius = 2;

let minScreenSize;

