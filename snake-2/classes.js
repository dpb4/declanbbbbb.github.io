class Segment {
  // every piece of the snake that isn't a head is a segment

  constructor(x, y, len, theta) {
    this.origin = createVector(x, y); // the position of the first point
    this.leadingPos = p5.Vector.add(this.origin, this.posVec); // the position of the second point
    this.posVec = createVector(cos(theta) * len, sin(theta) * len); // the position of the second point, relative to the first point (origin)
    this.len = len; // the length of the segments
  }
    
  setPos(x, y) {
    // this is what drags each segment along with the one in front of it

    let newPos = createVector(x, y);
    newPos.sub(this.origin); // make it relative to the "origin" point

    // set posVec to face newPos
    this.posVec = p5.Vector.normalize(newPos).mult(this.len);

    // scooch the origin over to make posVec touch the new point
    this.origin.add(p5.Vector.sub(newPos, this.posVec));
  }
    
  display() {
    // this draws the segment

    push();
    translate(trans.x, trans.y);

    // draw the segment with a super wide line
    // this is by far the easiest way to make a "pill" shape
    stroke(snakeColour);
    strokeWeight(snakeWid);
    line(this.origin.x, this.origin.y, this.leadingPos.x, this.leadingPos.y);
    
    pop();
  }

  debug() {
    // this draws the debug stuff

    push();
    translate(trans.x, trans.y);

    // draw the circle that the apple cannot spawn inside
    stroke(0);
    noFill();
    strokeWeight(1);
    circle(this.leadingPos.x, this.leadingPos.y, appleSafetyRad*2);

    // draw the segment as a normal line
    stroke(0);
    strokeWeight(2);
    line(this.origin.x, this.origin.y, this.leadingPos.x, this.leadingPos.y);
      
    // red dot for the leading point
    fill(255, 0, 0);
    noStroke();
    circle(this.leadingPos.x, this.leadingPos.y, 3);
      
    // blue dot for the origin point
    // you should only ever see this on the very end
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
    this.leadingPos = p5.Vector.add(this.origin, this.posVec); // update the leadingPos according to whatever has changed
  }
}
  
class Head extends Segment {
  // the head of the snake

  constructor(x, y, len, theta) {
    super(x, y, len, theta);
  }
    
  moveAndTurn(ang) {
    // this is what moves the head
    this.posVec.rotate(ang);

    // scale posVec to a magnitude of speed then add it to the origin
    this.origin = this.origin.add(p5.Vector.mult(this.posVec, speed/this.posVec.mag()));
  }
    
  checkDeath() {
    // check for any death conditions

    // check if the head segment crosses any other segment (overlapping itself)
    for (let i = 1; i < numSegs; i++) {
      if (checkIntersection(this.origin, this.leadingPos, segments[i].origin, segments[i].leadingPos)) {
        dead = true;
      }
    }

    // check if the head is out of bounds
    // the weird conditional puts the collision point right in the middle of the face
    if (this.origin.x + this.posVec.x/2 < 0 || this.origin.x + this.posVec.x/2 > gameWid || this.origin.y + this.posVec.y/2 < 0 || this.origin.y + this.posVec.y/2 > gameWid) {
      background(255, 0, 0);
      dead = true;
    }

    if (dead) {
      die.play(0, 1, 1, 0.3, 0.9);
      this.deathCleanup();
    }
  }

  deathCleanup() {
    // called when the snake dies

    highScore = max(score, highScore);
    score = 0;
    started = false;

    gameInit();
  }
    
  incLength() {
    // add one more segment to the list
    segments.push(new Segment(segments[segments.length-1].origin.x, segments[segments.length-1].origin.y, segLen, 0));

    // make it face the same way as the previous last segment
    segments[segments.length-1].posVec = segments[segments.length-2].posVec;

    numSegs++;
  }
    
  display() {
    // this draws the head

    push();
    translate(trans.x, trans.y);
    
    // head
    fill(snakeColour);
    noStroke();
    translate(this.origin.x + this.posVec.x/2, this.origin.y + this.posVec.y/2);
    rotate(PI - atan2(this.posVec.x, this.posVec.y));
    ellipse(0, 0, 20, 30);
    
    // eyes
    fill(0);
    circle(7, -3, 5);
    circle(-7, -3, 5);
    
    pop();
  }

  debug() {
    // draws the debug stuff for the head
    push();
    translate(trans.x, trans.y);
    stroke(0);

    // apple no go zone
    noFill();
    strokeWeight(1);
    circle(this.leadingPos.x, this.leadingPos.y, appleSafetyRad*2);

    // the head segment as a normal line
    strokeWeight(2);
    line(this.origin.x, this.origin.y, this.leadingPos.x, this.leadingPos.y);
    
    // red dot for the leading point
    fill(255, 0, 0);
    noStroke();
    circle(this.leadingPos.x, this.leadingPos.y, 3);
    
    // blue dot for the origin point
    fill(0, 0, 255);
    circle(this.origin.x, this.origin.y, 3);

    // this draws the circle in which an apple will be eaten
    // it is just the right size to fit nicely into the head
    // it is also centered around the point where the head is checked for being outside the walls
    noFill();
    stroke(0);
    circle(this.origin.x + this.posVec.x/2, this.origin.y + this.posVec.y/2, 20);
    
    pop();
  }
}
  
class Apple {
  // the apple

  constructor(x, y) {
    this.pos = createVector(x, y);
    this.rad = 10;
  }
    
  findOpenPosition() {
    // find a random position inside the game map and away from the walls
    this.pos = createVector(random(this.rad + applePadding, gameWid - this.rad - applePadding), random(this.rad + applePadding, gameWid - this.rad - applePadding));

    // check if the apple is too close to the snake
    // if it is, try again
    for (let i = 0; i < segments.length-1; i++) {
      if (dist(this.pos.x, this.pos.y, segments[i].posVec.x + segments[i].origin.x, segments[i].posVec.y + segments[i].origin.y) < appleSafetyRad + this.rad) {
        this.findOpenPosition();
        break;
      }
    }
  }

  display() {
    // draw the apple

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
    fill(leafColour);
    ellipse(0, 0, 5, 10);

    pop();
  }

  checkEaten() {
    // checks if the apple should be eaten

    // if the distance between the apple and the midpoint of the head is < 0 
    if (this.pos.dist(p5.Vector.add(p5.Vector.div(segments[0].posVec, 2), segments[0].origin)) - this.rad - 10 < 0) {
      this.findOpenPosition();
      lenBuffer += segInc;
      score++;
      eat.play();
    }
  }

  update() {
    this.display();
    this.checkEaten();
  }
}