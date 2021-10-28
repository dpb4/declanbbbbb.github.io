let orbiters = [];
let attractors = [];

let bodies = 10;
let suns = 1;
let speedRange = 60;
let velScale = 0.1;

let trailImage;

// instructions: click to add an orbiter, press any key to restart, scroll to 
// change number of suns (takes effect on restart)

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  trailImage = createImage(1, 1);
  
  trailImage.loadPixels();
  trailImage.set(0, 0, color(0));
  trailImage.updatePixels();
  trailImage.resize(width, height);
  
  orbiters = [];
  attractors = [];
  
  for (let i = 0; i < suns; i++) {
    attractors.push(newSun());
  }
  
  for (let i = 0; i < bodies; i++) {
    orbiters.push(newOrbiter());
  }
}

function draw() {
  image(trailImage, 0, 0);
  trailImage.loadPixels();
  for (let o of orbiters) {
    o.update();
    
    for (let a of attractors) {
      a.display();
      if (o.pos.dist(a.pos) <= a.mass*5/2) {
        orbiters.splice(orbiters.indexOf(o), 1);
      }
    }
  }
  for (let a of attractors) {
    a.display();
  }
  
  trailImage.updatePixels();
  
  text(suns + " sun(s)", 5, 20);
}

function writeColor(image, x, y, c) {
  let index = (x + y * width) * 4;
  image.pixels[index] = red(c);
  image.pixels[index + 1] = green(c);
  image.pixels[index + 2] = blue(c);
  image.pixels[index + 3] = 255;
}

function newOrbiter(posx=random(width/4, width*3/4), posy=random(height/4, height*3/4)) {
  return new Orbiter(createVector(posx, posy), createVector(random(-speedRange, speedRange), random(-speedRange, speedRange)), attractors, random(10, 20));
}

function newSun() {
  return new Attractor(createVector(random(width/4, width*3/4), random(height/4, height*3/4)), random(10, 30)/suns);
}

class Attractor {
  constructor(pos, mass) {
    this.pos = pos;
    this.mass = mass;
  }
  
  display() {
    fill(245, 193, 37);
    noStroke();
    ellipse(this.pos.x, this.pos.y, 5 * this.mass, 5 * this.mass);
  }
}

class Orbiter {
  constructor(pos, vel, attractors, mass) {
    this.pos = pos;
    this.vel = vel;
    this.mass = mass;
    
    this.attractors = attractors;
    colorMode(HSB);
    this.trail = color(random(255), 255, 255);
    colorMode(RGB);
  }
  
  updatePos() {
    this.pos.add(this.vel.copy().mult(velScale));
  }
  
  updateVel() {
    for (let a of this.attractors) {
      let diff = p5.Vector.sub(a.pos, this.pos);
      diff.normalize();
      
      diff.mult(a.mass/this.mass);
      
      this.vel.add(diff);
    }
  }
  
  display() {
    fill(red(this.trail)/2, green(this.trail)/2, blue(this.trail)/2);
    noStroke();
    ellipse(this.pos.x, this.pos.y, this.mass, this.mass);
  }
  
  update() {
    this.updateVel();
    this.updatePos();
    this.display();
    
    if (this.pos.x < width && this.pos.x > 0 && this.pos.y < height && this.pos.y > 0) {
      writeColor(trailImage, int(this.pos.x), int(this.pos.y), this.trail);
    }
  }
}

function mouseClicked() {
  orbiters.push(newOrbiter(mouseX, mouseY));
}

function keyPressed() {
  setup();
}

function mouseWheel(event) {
  suns += -event.delta/100;
  suns = max(suns, 0);
}