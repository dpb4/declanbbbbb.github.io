// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let outerRadius, innerRadius;
let outerCircumference, innerCircumference;
let pencilDistance;

let circleCenter;
let pencilPosition;
let previousPosition;

let pencilColour;

let angleStep;
let circumferenceStep;
let rotation;
let steps;
let subdivisions;

let paper;

function setup() {
  createCanvas(min(displayWidth, displayHeight), min(displayWidth, displayHeight));

  outerRadius = min(width, height) * 0.8 * 0.5;
  innerRadius = outerRadius/4.34;

  outerCircumference = outerRadius * TWO_PI;
  innerCircumference = innerRadius * TWO_PI;

  pencilDistance = innerRadius*0.9;

  circleCenter = createVector(outerRadius - innerRadius, 0);
  pencilPosition = createVector(pencilDistance, 0);
  previousPosition = pencilPosition.copy();

  pencilColour = color(120, 50, 200);
  
  steps = 36;
  subdivisions = 100;

  angleStep = TWO_PI / steps;
  circumferenceStep = outerCircumference / steps;

  rotation = outerCircumference / innerCircumference * angleStep;

  paper = createGraphics(width, height);
  
  strokeWeight(3);
  background(255);
  // frameRate(10000);
}

function draw() {
  // background(255);
  paper.push();
  paper.translate(width/2, height/2);
  
  paper.strokeWeight(1);
  paper.stroke(pencilColour);
  for (let i = 0; i < subdivisions; i++) {
    
    previousPosition = pencilPosition.copy();
    pencilPosition.rotate(-rotation / subdivisions);
    circleCenter.rotate(angleStep / subdivisions);
    
    paper.line(pencilPosition.x + circleCenter.x, pencilPosition.y + circleCenter.y, previousPosition.x + circleCenter.x, previousPosition.y + circleCenter.y)
  }
  
  paper.pop();
  background(255);
  image(paper, 0, 0);
  
  push();
  translate(width/2, height/2);
  
  noFill();
  stroke(100);
  ellipse(0, 0, outerRadius*2, outerRadius*2);

  fill(50, 50);
  stroke(25, 75);
  ellipse(circleCenter.x, circleCenter.y, innerRadius*2, innerRadius*2);

  fill(pencilColour);
  noStroke();
  ellipse(pencilPosition.x + circleCenter.x, pencilPosition.y + circleCenter.y, 20, 20);

  pop();
}


