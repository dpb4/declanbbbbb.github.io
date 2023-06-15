// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let gravity = -9.81;
let forceConstant = 10;
let timeScale = 0.1;
let velDecay = 0.95;

let gridSize = 16;

let points = Array();
let grid = Array(gridSize+2).fill(0).map(x => Array(gridSize+2).fill(0));

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();

  for (let i = 0; i <1000; i++) {
    points.push(new Particle(random(100, width-100), random(100, height-100), 0, 0, 30, 10, 5, i));
  }
}

function draw() {
  background(255);
  grid = Array(gridSize+4).fill(0).map(x => Array(gridSize+4).fill(Array(0)));

  for (let i = 0; i < gridSize; i++) {
    stroke(0);
    line(i*width/gridSize, 0, i*width/gridSize, height);
    line(0, i*height/gridSize, width, i*height/gridSize);
  }

  for (let p = 0; p < points.length; p++) {
    let y = floor((points[p].pos.y)/(height/gridSize))+2;
    let x = floor((points[p].pos.x)/(width/gridSize))+2;
    grid[y][x].push(points[p].id);
    points[p].gx = x;
    points[p].gy = y;
  }
  // print(grid);
  // print(floor((mouseX)/(width/gridSize))+1, floor((mouseY)/(height/gridSize))+1);

  for (let p = 0; p < points.length; p++) {

    points[p].update();
    points[p].display();
  }
  console.log(frameRate());
}

class Particle {
  constructor(x, y, vx, vy, mass, radius, strength, id) {
    this.pos = createVector(x, y);
    this.vel = createVector(vx, vy);
    this.acc = createVector(vx, vy);
    this.mass = mass;
    this.r = radius;
    this.c = color(random(255), random(255), random(255));
    this.strength = strength;
    this.id = id;
    this.gx = 0;
    this.gy = 0;
  }

  display() {
    noStroke();
    fill(this.c);
    ellipse(this.pos.x, height - this.pos.y, this.r*2, this.r*2);
  }

  update() {
    let force = this.collectForces();

    this.acc = force.mult(this.mass);
    this.acc.y += gravity;
    this.acc.mult(timeScale);

    this.vel.add(this.acc);
    this.vel.mult(velDecay);

    this.pos.add(this.vel);

    if (this.pos.x > width-this.r) {
      this.pos.x = width-this.r;
      this.vel.x *= -velDecay;
    } else if (this.pos.x < this.r) {
      this.pos.x = this.r;
      this.vel.x *= -velDecay;
    }
    if (this.pos.y > height-this.r) {
      this.pos.y = height-this.r;
      this.vel.y *= -velDecay;
    } else if (this.pos.y < this.r) {
      this.pos.y = this.r;
      this.vel.y *= -velDecay;
    }
  }

  collectForces() {
    let force = createVector(0, 0);
    for (let p = 0; p < points.length; p++) {
      let id = points[p].id;
      if (id !== this.id) {
        // print(this.gx, this.gy )
        if (id in grid[this.gy][this.gx] || id in grid[this.gy][this.gx+1] || id in grid[this.gy+1][this.gx+1] || id in grid[this.gy+1][this.gx] ||id in grid[this.gy+1][this.gx-1] || id in grid[this.gy][this.gx-1] || id in grid[this.gy-1][this.gx-1] || id in grid[this.gy-1][this.gx] || id in grid[this.gy-1][this.gx+1]) {

        
          let direction = p5.Vector.sub(this.pos, points[p].pos).normalize();
          let distance = this.pos.dist(points[p].pos);
          let properdistance = this.r + points[p].r;

          if (distance < properdistance) {
            let delta = p5.Vector.mult(direction, (properdistance-distance)/2);
            this.pos.add(delta);
            points[p].pos.sub(delta);
            distance = properdistance
          }

          let mag = this.strength*points[p].strength*forceConstant / (distance*distance);
          force.add(direction.mult(mag));
        }
      }
    }

    if (mouseIsPressed) {

    }
    // print(force);
    return force;
  }
  // displayDebug() {

  // }
}
