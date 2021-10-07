// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let balls = [];
let speed = 4;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();

  for (let i = 0; i < 500; i++) {
    balls.push(makeBalls());
  }
}

function makeBalls() {
  let myBall = {
    radius: random(10, 30),
    x: random(width),
    y: random(height),
    time: random(1000),
    theColour: color(random(255), random(255), random(255), random(255))
  };
  return myBall;
}

function draw() {
  background(255);
  for (let myBall of balls) {
    fill(myBall.theColour);
    stroke(red(myBall.theColour)/2, green(myBall.theColour)/2, blue(myBall.theColour)/2, alpha(myBall.theColour)/2);
    myBall.x += speed*(noise(myBall.time) - 0.5);
    myBall.y += speed*(noise(myBall.time+100) - 0.5);
    circle(myBall.x, myBall.y, myBall.radius*2);
    myBall.time += 0.003;
  }
}

function mouseClicked() {
  for (let i = 0; i < 30; i++) {
    balls.push(makeBalls());
  }
}
