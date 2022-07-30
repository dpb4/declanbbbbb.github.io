// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

// 1x1, 2x2, 3x3
let sizeDistribution = [80, 10, 10];
let game;
function setup() {
	createCanvas(windowWidth, windowHeight);
	noStroke();
	game = new Game(20, 20);
}
function draw() {
	background(67, 161, 67);
	game.drawMap(game.map);
	game.drawWalls(game.walls);
}