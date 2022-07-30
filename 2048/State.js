class State {
  constructor() {
    this.grid = new Array(4).fill(0).map(x => new Array(4).fill(0));  
    this.score = 0; 

    this.grid[floor(random(4))][floor(random(4))] = 1;
  }

  applyMove(move) {
    let nextGrid = new Array(4).fill(0).map(x => new Array(4).fill(0));
    let combinationMap = new Array(4).fill(0).map(x => new Array(4).fill(0));

    // logMatrix(nextGrid);

    let rGrid = rotateGrid(this.grid, -move);
    for (let x = 0; x < 4; x++) {
      nextGrid[0][x] = rGrid[0][x];
      for (let y = 1; y < 4; y++) {
        if (rGrid[y][x] !== 0) {
          for (let m = 1; m < y+1; m++) {
            // scooch
            if (nextGrid[y-m][x] === 0) {
              nextGrid[y-m][x] = rGrid[y][x];
              nextGrid[y-m+1][x] = 0;

            // combine
            } else if (nextGrid[y-m][x] === rGrid[y][x] && combinationMap[y-m][x] === 0) {
              nextGrid[y-m][x] = rGrid[y][x] + 1;
              nextGrid[y-m+1][x] = 0;

              combinationMap[y-m][x] = 1;
              break;

            // do nothing
            } else {
              nextGrid[y-m+1][x] = rGrid[y][x];
              break;
            }
          }
        }
      }
    }

    this.evalScore();
    return rotateGrid(nextGrid, move)


  }

  nextState(move) {
    let ns = this.copy();
    ns.setGrid(this.applyMove(move));

    if (ns.isOpen()) {
      let found = false;

      while (!found) {
        let x = floor(random(4));
        let y = floor(random(4));

        if (ns.grid[y][x] === 0) {
          let draw = random();

          if (draw < 0.1) {
            ns.grid[y][x] = 2;
          } else {
            ns.grid[y][x] = 1;
          }

          found = true;
        }
      }
    }
    ns.evalScore();
    return ns;
  }

  getAllNextStates(states) {
    let statesList;
    let output = [];
    if (states === undefined) {
      statesList = [this.copy()];
    } else {
      statesList = [...states];
    }
    for (let ss of statesList) {
      for (let i = 0; i < 4; i++) {
        let s = new State();
        s.setGrid(ss.applyMove(i));
        output.push(s);
      }
    }
    return output;
  }

  setGrid(grid) {
    for (let i = 0; i < 4; i++) {
      this.grid[i] = [...grid[i]];
    }

    this.evalScore();
  }

  evalScore() {
    let s = 0;
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        s += pow(2, this.grid[i][j]) * this.grid[i][j];
      }
    }

    this.score = s;
    return s;
  }

  copy() {
    let s = new State();
    s.setGrid(this.grid);
    return s;
  }
  
  equals(s) {
    if (this.score !== s.score) {
      return false;
    }

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.grid[i][j] !== s.grid[i][j]) {
          return false;
        }
      }
    }

    return true;
  }

  isOpen() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.grid[i][j] === 0) {
          return true;
        }
      }
    }
    return false;
  }

  isDead() {
    if (this.isOpen()) {
      return false;
    }

    for (let i = 0; i < 4; i++) {
      let next = this.nextState(i);
      if (!this.equals(next)) {
        return false;
      }
    }

    return true;
  }
}