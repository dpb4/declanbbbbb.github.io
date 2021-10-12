class Piece {
  constructor (x, y, team) {
    this.x = x;
    this.y = y;
    this.team = team;
    this.moves;
  }

  checkMove(x, y, move) {
    let nx = x + move[0];
    let ny = y + move[1];
    
    if (!(nx < 0 || nx > 7 || ny < 0 || ny > 7)) {
      if (pieces[ny][nx] === 0) {
        return nx >= 0 && nx <= 7 && ny >= 0 && ny <= 7;
      }
    }
    // TODO: fix lol
    return nx >= 0 && nx <= 7 && ny >= 0 && ny <= 7 && pieces[ny][nx].team === -this.team;
    // return nx < 0 || nx > 7 || ny < 0 || ny > 7 || pieces[ny][nx] === 0;
  }

  getPossibleMoves() {
    let possibleMoves = [];

    for (let i = 0; i < this.moves.length; i++) {
      if (this.checkMove(this.x, this.y, this.moves[i])) {
        possibleMoves.push(this.moves[i]);
      }
    }

    return possibleMoves;
  }

  display() {
    push();
    stroke(255, 0, 0);
    fill((1 - (this.team/2 + 0.5)) * 255);
    circle(this.x*scx + scx/2, this.y*scy + scy/2, 20);
    pop();
  }
}

class FreePiece extends Piece {
  constructor(x, y, team) {
    super(x, y, team);
    this.moves; // the moves a free piece can initally make
    this.firstMoves; 
  }

  getPossibleMoves() {
    // this checks the initial moves a free piece can make
    let possibleMoves = [];

    for (let fm of this.moves) {
      if (this.checkMove(this.x, this.y, fm)) {
        possibleMoves.push(fm);
      }
    }

    let num = possibleMoves.length;
    let out = [];

    for (let f = 0; f < num; f++) {
      for (let i = 1; i < 8; i++) {
        let curMove = [possibleMoves[f][0]*i, possibleMoves[f][1]*i];

        if (this.checkMove(this.x, this.y, curMove)) {
          out.push(curMove);
        }
      }
    }

    return out;
  }
}

// here come the different pieces
// I split the pieces into two categories: step pieces and free pieces
// step: pawn, knight, king
// free: bishop, rook, queen

class Pawn extends Piece {
  constructor(x, y, team) {
    super(x, y, team);
    this.moves = [
      [0, 1], [0, 2]
    ];
  }

  // check first round
  getPossibleMoves() {
    let possibleMoves = [];

    for (let i = 0; i < this.moves.length; i++) {
      if (this.checkMove(this.x, this.y, this.moves[i])) {
        // TODO re examine
        if (i !== 1) {
          possibleMoves.push(this.moves[i]);
        } else if (round === 0) {
          possibleMoves.push(this.moves[i]);
        }
        
      }
    }

    return possibleMoves;
  }
}

class Knight extends Piece {
  constructor(x, y, team) {
    super(x, y, team);
    this.moves = [
      [ 1,  2], [-1,  2], 
      [-2,  1], [-2, -1], 
      [-1, -2], [ 1, -2], 
      [ 2, -1], [ 2,  1]
    ];
  }
}

class Bishop extends FreePiece {
  constructor(x, y, team) {
    super(x, y, team);
    this.moves = [
      [1, 1], [-1, 1], [-1, -1], [1, -1]
    ];
  }
}

class Rook extends FreePiece {
  constructor(x, y, team) {
    super(x, y, team);
    this.moves = [
      [0, 1], [-1, 0], [0, -1], [1, 0]
    ];
  }
}

class King extends Piece {
  constructor(x, y, team) {
    super(x, y, team);
    this.moves = [
      [ 0,  1], [ 0, -1],
      [ 1,  0], [-1,  0],
      [ 1,  1], [ 1, -1],
      [-1,  1], [-1, -1]
    ];
  }
}

class Queen extends FreePiece {
  constructor(x, y, team) {
    super(x, y, team);
    this.moves = [
      [ 0,  1], [-1,  0], [ 0, -1], [ 1,  0],
      [ 1,  1], [-1,  1], [ 1, -1], [-1, -1]
    ];
  }
}