const w = 7;
const h = 6;

let directions = [
	{x: 1, y: 0},
	{x: 1, y: 1},
	{x: 0, y: 1},
	{x:-1, y: 1},
	{x:-1, y: 0},
	{x:-1, y:-1},
	{x: 0, y:-1},
	{x: 1, y:-1},
]

let boardWidthPixels;
let boardHeightPixels;

let translation;

let pieceRadius;
let piecePadding;
let LREdgePadding;
let pieceBorderWidth;

let ATeamColour;
let BTeamColour;

let boardColour;
let backgroundColour;

let currentState;

function setup() {
	createCanvas(windowWidth, windowHeight);

	currentState = new State();
	currentState.grid[5][0] = 1;
	currentState.grid[4][0] = 1;
	currentState.grid[3][0] = 1;
	currentState.grid[2][0] = 1;
	currentState.grid[1][3] = 2;
	currentState.grid[3][4] = 2;
	currentState.grid[5][2] = 2;
	currentState.grid[2][5] = 1;

	
	boardWidthPixels = window.width*0.6;
	boardHeightPixels = boardWidthPixels * 6/7;

	piecePadding = 10;
	pieceRadius = boardHeightPixels / 6 - piecePadding*7/6;

	translation = {x: (window.width-boardWidthPixels)/2, y: (window.height - boardHeightPixels) / 2};

	LREdgePadding = 10;
	pieceBorderWidth;

	ATeamColour = color(227, 212, 45);
	BTeamColour = color(199, 68, 54);

	boardColour = color(49, 105, 168);
	backgroundColour = color(240);
}

function drawBoard() {
	push();

	noStroke();
	fill(boardColour);
	translate(translation.x, translation.y);
	rect(-(piecePadding/2) - LREdgePadding, -(piecePadding/2), boardWidthPixels+(piecePadding) + LREdgePadding*2, boardHeightPixels+(piecePadding), 2);

	fill(backgroundColour);

	for (let i = 0; i < w; i++) {
		for (let j = 0; j < h; j++) {
			if (currentState.grid[j][i] === 1) {
				fill(ATeamColour);
			} else if (currentState.grid[j][i] === 2) {
				fill(BTeamColour);
			} else {
				fill(backgroundColour);
			}
			ellipse((i+0.5)*boardWidthPixels/7, (j+0.5)*boardHeightPixels/6, pieceRadius, pieceRadius);
		}
	}

	pop();
}


function draw() {
	background(backgroundColour);
	drawBoard();
}