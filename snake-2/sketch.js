// snake 2
// Declan Bainbridge
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"


//TODO: fix apple spawning, dfix length increase AGAIN >:[
let s;
let a;
let segments = [];
let numSegs = 10;
let segLen = 5;
let dir = 0;
let speed = 2;
let appleSafety = 10;

let dead = false;
let debug = true;

function setup() {
  createCanvas(400, 400);
  
  s = new Head(width/2, height/2, 30, 0);
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
  stroke(0, 200, 127);
  fill(0, 200, 127);
  
  checkInput();
  
  for (let i = 0; i < numSegs; i++) {
    if (i === 0) {
      segments[0].moveAndTurn(dir);
      segments[0].checkDeath();
    } else {
      segments[i].setPos(segments[i-1].origin.x, segments[i-1].origin.y);
    }
    segments[i].update();
  }
  a.display();
  a.checkEaten();
}

function checkInput() {
  if (keyIsDown(65) || keyIsDown(LEFT_ARROW)) { // a
    dir = -PI/32;
  } else if (keyIsDown(68) || keyIsDown(RIGHT_ARROW)) { // d
    dir = PI/32;
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


