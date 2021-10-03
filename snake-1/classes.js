class Apple {
  // this is the apple class
  constructor() {
    this.findOpenPos();
  }

  findOpenPos() {
    // find a random position on the board; if it is occupied, do it again
    // i think if you completed the game and maxed out the snake this would break,
    // but i am choosing to ignore that
    this.pos = createVector(floor(random(0, numSquares)), floor(random(0, numSquares)));
    if (gameMap[this.pos.x][this.pos.y] !== 0 && !this.pos.equals(s.pos)) {
      this.findOpenPos();
    }
  }

  eaten() {
    // called when the apple is eaten
    crunch.play();
    score++;
    this.findOpenPos();
    if (debug) {
      console.log(this.pos.x, this.pos.y, gameMap[this.pos.x][this.pos.y]);
      if (gameMap[this.pos.x][this.pos.y] !== 0) {
        console.log("WOAH!!!!!!!!!!!!!!!!!!!");
      }
    }
  }
}
  
class SnakeHead {
  // the only part of the snake that is not just a number is the head
  // it works by stamping its length onto the array at its current position,
  // moving, then subtracting one from every array entry that isn't zero
  // this gives the illusion of a tail
  constructor(x, y, dirx, diry, initLength) {
    this.pos = createVector(x, y);
    this.dir = createVector(dirx, diry);
    this.nextDir = createVector(dirx, diry);
    this.snakeLength = initLength;
  }
    
  initGameMap() {
    gameMap[this.pos.x][this.pos.y] = this.snakeLength;
  }
    
  subGameMap() {
    // subtract 1 from every entry in the map that isn't zero
    for (let x = 0; x < numSquares; x++) {
      for (let y = 0; y < numSquares; y++) {
        if (gameMap[x][y] !== 0) {
          gameMap[x][y] -= 1;
        }
      }
    }
  }
    
  putHead() {
    // place the head down into the array
    gameMap[this.pos.x][this.pos.y] += this.snakeLength;
  }
    
  move() {
    this.pos.add(this.dir);
  }
    
  checkDead() {
    // this controls all the death conditions as well as the death itself
    if (this.pos.x > numSquares-1 || this.pos.x < 0 || this.pos.y > numSquares-1 || this.pos.y < 0) {
      // if the head is outside the allocated grid of squares, you died
      dead = true;
    }
      
    // i like this part: if any entry is greater than the length of the snake (the max 
    // that any one square should be) that means the head went onto another snake part
    for (let x = 0; x < numSquares; x++) {
      for (let y = 0; y < numSquares; y++) {
        if (gameMap[x][y] > this.snakeLength) {
          // make sure every entry <= the current length
          dead = true;
        }
      }
    }
      
    if (dead) {
      deathCry.play();
        
      started = false;
        
      highscore = max(score, highscore);
        
      // reset the map to a blank grid of zeroes
      gameMap = Array(numSquares).fill(0).map(x => Array(numSquares).fill(0)); 
        
      // re initialize the snake
      s = new SnakeHead(floor(numSquares/2), floor(numSquares/2), 1, 0, 3);
      s.initGameMap();
        
      // find a new spot for an apple
      apple.findOpenPos();
        
      score = 0;
        
      drawStartScreen();
    }
  }
    
  checkApple() {
    // check if the head is overlapping the apple
    // if it is, add one to the length and every entry that isn't zero
    if (this.pos.equals(apple.pos)) {
      this.snakeLength++;
        
      for (let x = 0; x < numSquares; x++) {
        for (let y = 0; y < numSquares; y++) {
          if (gameMap[x][y] !== 0) {
            gameMap[x][y]++;
          }
        }
      }
        
      if (!dead) {
        apple.eaten(); 
      }
        
    }
  }
    
  update() {
    // combine all the aforementioned functions to update the snake each cycle
    this.dir = this.nextDir; // i will explain this more below
    this.move();
    this.checkDead();
      
    if (!dead) {
      this.checkApple();
      this.subGameMap();
      this.putHead();
    }
  }
}
