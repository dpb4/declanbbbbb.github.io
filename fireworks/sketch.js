// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let particles = [];
let fireworkSize = 200;

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(0, 30);
  // noFill();
  // stroke(255);
  // rect(width/4, height/4, width/2, height/2);

  for (let i = particles.length-1; i >= 0; i--) {
    particles[i].update();
    
    if (particles[i].alpha <= 0) {
      particles.splice(i, 1);
    }
  }
}

class Particle {
  constructor(x, y, col) {
    this.pos = createVector(x, y);
    this.size = random(3, 7);
    this.speed = random(1.5);
    this.alpha = 255;
    this.fade = 2;

    this.vel = p5.Vector.random2D();
    this.vel.mult(this.speed);

    this.col = col;
    // this.c = color(col, 100, 100);
  }

  move() {
    this.pos.add(this.vel);
  }

  display() {
    noStroke();
    colorMode(HSB);
    fill(this.col, 100, 100, this.alpha/255);
    colorMode(RGB);
    circle(this.pos.x, this.pos.y, this.size);
  }

  update() {
    this.move();
    this.display();
    this.alpha -= this.fade;
  }
}

function mousePressed() {
  let r = random(360);
  for (let i = 0; i < fireworkSize; i++) {
    particles.push(new Particle(mouseX, mouseY, r));
  }
}

function keyPressed() {
  let r = random(360);
  let rx = random(width/4, width/4*3);
  let ry = random(height/4, height/4*3);
  for (let i = 0; i < fireworkSize; i++) {
    particles.push(new Particle(rx, ry, r));
  }
}