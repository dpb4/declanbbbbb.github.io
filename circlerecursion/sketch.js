// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let cutoff = 10;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
}

function draw() {
  background(0);

  recursiveCircle(width/2, min(width, height), 1, mouseX/width/2);
}

function recursiveCircle(x, diameter, col, scale) {
  fill(col * 255);
  circle(x, height/2, diameter);
  if (diameter < cutoff) {
    return;
  }
  recursiveCircle(x - scale * diameter, diameter/2, !col, scale);
  recursiveCircle(x + scale * diameter, diameter/2, !col, scale);
}
