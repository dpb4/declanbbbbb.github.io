class Segment {
  constructor(x, y, len, theta) {
    this.pos1 = createVector(cos(theta) * len, sin(theta) * len);
    this.origin = createVector(x, y);
    this.delta = createVector(0, 0);
    this.len = len;
  }
    
  setPos(x, y) {
    let newPos = createVector(x, y);
    newPos.sub(this.origin);
    this.pos1 = p5.Vector.normalize(newPos).mult(this.len);
    this.origin.add(p5.Vector.sub(newPos, this.pos1));
  }
    
  display() {
    push();
    translate(trans.x, trans.y);
    stroke(snakeColour);
    translate(this.origin.x, this.origin.y);
    strokeWeight(10);

    line(0, 0, this.pos1.x, this.pos1.y);
    
    pop();
  }

  debug() {
    push();
    translate(trans.x, trans.y);
    stroke(0);
    noFill();
    strokeWeight(1);
    circle(this.origin.x + this.pos1.x, this.origin.y + this.pos1.y, appleSafetyRad*2);

    strokeWeight(2);
    line(this.origin.x, this.origin.y, this.origin.x + this.pos1.x, this.origin.y + this.pos1.y);
      
    fill(255, 0, 0);
    noStroke();
    circle(this.pos1.x + this.origin.x, this.pos1.y + this.origin.y, 3);
      
    fill(0, 0, 255);
    circle(this.origin.x, this.origin.y, 3);
      
    pop();
  }

  update() {
    if (debug) {
      this.debug();
    } else {
      this.display();
    }
  }
}
  
class Head extends Segment {
  constructor(x, y, len, theta) {
    super(x, y, len, theta);
  }
    
  moveAndTurn(ang) {
    this.pos1.rotate(ang);
    this.origin = this.origin.add(p5.Vector.mult(this.pos1, speed/this.pos1.mag()));
  }
    
  checkDeath() {
    for (let i = 1; i < numSegs; i++) {
      if (checkIntersection(this.origin, p5.Vector.add(this.origin, this.pos1), segments[i].origin, p5.Vector.add(segments[i].origin, segments[i].pos1))) {
        background(255, 0, 0);
        score = 0;
      }
    }
      
    if (this.origin.x < 0 || this.origin.x > gameWid || this.origin.y < 0 || this.origin.y > gameWid) {
      background(255, 0, 0);
      score = 0;
    }
  }
    
  incLength() {
    segments.push(new Segment(segments[segments.length-1].origin.x, segments[segments.length-1].origin.y, segLen, 0));
    segments[segments.length-1].pos1 = segments[segments.length-2].pos1;
    numSegs ++;
  }
    
  display() {
    push();
    translate(trans.x, trans.y);
    
    // head
    fill(snakeColour);
    noStroke();
    translate(this.origin.x + this.pos1.x/2, this.origin.y + this.pos1.y/2);
    rotate(PI - atan2(this.pos1.x, this.pos1.y));
    ellipse(0, 0, 20, 30);
    
    // eyes
    fill(0);
    circle(7, -3, 5);
    circle(-7, -3, 5);
    
    pop();
  }

  debug() {
    push();
    translate(trans.x, trans.y);
    stroke(0);

    noFill();
    strokeWeight(1);
    circle(this.origin.x + this.pos1.x, this.origin.y + this.pos1.y, appleSafetyRad*2);

    strokeWeight(2);
    line(this.origin.x, this.origin.y, this.origin.x + this.pos1.x, this.origin.y + this.pos1.y);
    
    
    fill(255, 0, 0);
    noStroke();
    circle(this.pos1.x + this.origin.x, this.pos1.y + this.origin.y, 3);
    
    fill(0, 0, 255);
    circle(this.origin.x, this.origin.y, 3);

    noFill();
    stroke(0);
    translate(this.origin.x + this.pos1.x/2, this.origin.y + this.pos1.y/2);
    circle(0, 0, 20);
    
    pop();
  }
}
  
class Apple {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.rad = 10;
  }
    
  findOpenPosition() {
    this.pos = createVector(random(this.rad + applePadding, gameWid - this.rad - applePadding), random(this.rad + applePadding, gameWid - this.rad - applePadding));

    for (let i = 0; i < segments.length-1; i++) {
      if (dist(this.pos.x, this.pos.y, segments[i].pos1.x + segments[i].origin.x, segments[i].pos1.y + segments[i].origin.y) < appleSafetyRad + this.rad) {
        this.findOpenPosition();
        break;
      }
    }
  }

  display() {
    push();
    translate(trans.x, trans.y);
    // apple
    fill(appleColour);
    noStroke();
    ellipse(this.pos.x, this.pos.y, this.rad*2);

    // leaf
    translate(this.pos.x + 3, this.pos.y - this.rad);
    rotate(PI/3);
    noStroke();
    fill(leafColor);
    ellipse(0, 0, 5, 10);

    pop();
  }

  checkEaten() {
    if (this.pos.dist(p5.Vector.add(p5.Vector.div(segments[0].pos1, 2), segments[0].origin)) < this.rad + 10) {
      this.findOpenPosition();
      lenBuffer += segInc;
      score++;
    }
  }
}