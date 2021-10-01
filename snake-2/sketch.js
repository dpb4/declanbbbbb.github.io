// snake 2
// Declan Bainbridge
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"


//TODO: add start/death, check all segment[0] usage, make the whole game pretty
let s;
let a;
let segments = [];
let numSegs = 15;
let segLen = 5;
let appleSafetyRad = 30;
let applePadding = 5;
let segInc = 5;
let gameWid = 400;
let turnAmt;
let trans;

let snakeColour;
let appleColour;
let leafColor;

let dir = 0;
let speed = 2;
let lenBuffer = 0;
let score = 0;

let dead = false;
let debug = false;

function setup() {
  createCanvas(500, 600);
  snakeColour = color(0, 200, 127);
  appleColour = color(232, 53, 53);
  leafColor = color(118, 207, 50);

  turnAmt = PI/32;
  let edgePadding = (width - gameWid) / 2;
  trans = createVector(edgePadding, height - gameWid - edgePadding);
  
  s = new Head(gameWid/2, gameWid/2, 30, 0);
  segments.push(s);
  
  let initAngle = 0;
  
  for (let i = 1; i < numSegs; i++) {
    let seg = new Segment(segments[i-1].origin.x - segLen*cos(initAngle), segments[i-1].origin.y - segLen*sin(initAngle), segLen, 0);
    segments.push(seg);
  }

  a = new Apple(0, 0);
  a.findOpenPosition();
}

function draw() {
  background(220);  
  checkInput();
  
  rect(trans.x, trans.y, gameWid, gameWid); //TODO
  a.display();
  a.checkEaten();
  updateLen();
  drawTitles();

  for (let i = 0; i < numSegs; i++) {
    if (i === 0) {
      segments[0].moveAndTurn(dir);
      segments[0].checkDeath();
    } else {
      segments[i].setPos(segments[i-1].origin.x, segments[i-1].origin.y);
    }
    segments[i].update();
  }
}

function keyPressed() {
  if (key === 'x') {
    debug = !debug;
  }
}

function checkInput() {
  if (keyIsDown(65) || keyIsDown(LEFT_ARROW)) { // a
    dir = -turnAmt;
  } else if (keyIsDown(68) || keyIsDown(RIGHT_ARROW)) { // d
    dir = turnAmt;
  } else {
    dir = 0;
  }
  if (keyIsDown(32)) {
    segments[0].incLength();
  }
}

function checkIntersection(p1, p2, p3, p4) {
  // solution adapted from: https://stackoverflow.com/questions/563198/how-do-you-detect-where-two-line-segments-intersect
  
  let v1 = p5.Vector.sub(p2, p1);
  let v2 = p5.Vector.sub(p4, p3);
  
  s = (-v1.y * (p1.x - p3.x) + v1.x * (p1.y - p3.y)) / (-v2.x * v1.y + v1.x * v2.y);
  t = ( v2.x * (p1.y - p3.y) - v2.y * (p1.x - p3.x)) / (-v2.x * v1.y + v1.x * v2.y);

  return s >= 0 && s <= 1 && t >= 0 && t <= 1;
  
}

function updateLen() {
  if (lenBuffer !== 0) {
    segments[0].incLength();
    lenBuffer--;
  }
}

function drawTitles() {
  push();
  textAlign(CENTER, CENTER);
  text(score, width/2, 120);

  textSize(72);
  text("Snake 2", width/2, 75);
  pop();
}


