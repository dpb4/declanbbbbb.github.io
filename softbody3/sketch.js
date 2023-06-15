// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let debug = false;

let gravity = -0.981;
let accelerationConstant = 1;
let generalFriction = 0.05;
let groundFriction = 0.1;
let springExponent = 1;
let physicsIterations = 10;

let selfIntersection = true;

// let v;
// let v2;
// let c;

let shape;
let mh;

function setup() {
	createCanvas(windowWidth, windowHeight);
	
	// v = new Vertex(0, height, 50, 20);
	// v2 = new Vertex(0, height-200, 50, 20);
	
	// v.applyForce(createVector(15, 0));
	
	// c = new Connection(200, 0.1, v, v2);
	shape = new Square(width/2, height/2, 0.2, 100, 100, 4);
	mh = new mouseHandler([shape]);
}

function draw() {
	background(255);
	
	// c.apply();
	
	// v.updatePosition();
	
	// v2.updatePosition();
	
	// c.display();
	// v.display();
	// v2.display();
	for (let x = 0; x < 1; x++) {
		shape.update();

	}
	mh.update();
	shape.display();
}

function circleLineInstersect(l1, l2, point, r) {
	let A = point.x - l1.x;
	let B = point.y - l1.y;
	let C = l2.x - l1.x;
	let D = l2.y - l1.y;
  
	let dot = A*C + B*D;
	let lengthSquared = C*C + D*D;
  
	let p = dot / lengthSquared;
  
	let tx, ty;
  
	if (p < 0) {
		tx = l1.x;
		ty = l1.y;
	} else if (p > 1) {
		tx = l2.x;
		ty = l2.y;
	} else {
		tx = l1.x + p*C;
		ty = l1.y + p*D;
	}
  
	let dx = point.x - tx;
	let dy = point.y - ty;

	// print((dx*dx + dy*dy))
	return (dx*dx + dy*dy) <= (r*r);
}
