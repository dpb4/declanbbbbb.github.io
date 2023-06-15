// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let x1, x2, y1, y2;
let rad;

let p;
let pv;

function setup() {
  createCanvas(windowWidth, windowHeight);

  x2 = 400;
  y2 = 200;
  x1 = 2000;
  y1 = 3000;

  p = createVector(width/2, height);
  pv = createVector(0, 0);

  rad = 20;

}

function draw() {
  background(255);
  stroke(0);
  strokeWeight(3);
  line(x1, y1, x2, y2);

  let tv = pv.y;
  pv.y -= 0.1;
  p.add(pv);

  if (circleLineInstersect(createVector(x1, y1), createVector(x2, y2), p, rad)) {
    fill(255, 0, 0, 128);
    let n = createVector(abs(y1-y2), -abs(x1-x2)).normalize();
    pv.sub(pv.dot(n));
  } else {
    fill(255, 128, 0, 128);
  }
  
  print(pv.y - tv);
  ellipse(p.x, p.y, rad*2, rad*2);  
}

function circleLineInstersect(l1, l2, point, r) {
  let A = point.x - l1.x;
  let B = point.y - l1.y;
  let C = x2 - l1.x;
  let D = y2 - l1.y;

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
  return (dx*dx + dy*dy) <= (r*r);
}
