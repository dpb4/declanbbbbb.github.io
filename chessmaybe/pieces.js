class Piece {
  constructor (x, y, team) {
    this.x = x;
    this.y = y;
    this.team = team;
    this.moves;
    this.code;
    this.hasMoved = false;
  }

  checkMove(x, y, move, board=pieces) {
    let nx = x + move[0];
    let ny = y + move[1];
    
    if (nx >= 0 && nx <= 7 && ny >= 0 && ny <= 7) {
      if (board[ny][nx] === 0) {
        return true;
      }
      return board[ny][nx].team === -this.team;
    }
    return false;
  }

  getPossibleMoves(board=pieces) {
    let possibleMoves = [];

    for (let i = 0; i < this.moves.length; i++) {
      if (this.checkMove(this.x, this.y, this.moves[i], board)) {
        possibleMoves.push(this.moves[i]);
      }
    }

    return possibleMoves;
  }

  move(x, y) {
    pieces[y][x] = this;
    pieces[this.y][this.x] = 0;
    this.x = x;
    this.y = y;

    turn = -turn;
    this.hasMoved = true;
    tap.play();
  }

  canTakeSquare(x, y) {
    // TODO may be redundant
    let moves = this.getPossibleMoves();

    for (let m of moves) {
      if (this.x + m[0] === x && this.y + m[1] === y) {
        return m;
      }
    }
    
  }

  display() {
    image(this.getSprite(), this.x*scx + offset, this.y*scy + offset);
  }

  getSprite() {
    if (this.team === -1) {
      return sprites[0][codes[this.code]][theme];
    }
    return sprites[1][codes[this.code]][theme];
  }

  getPossibleBoards() {
    let moves = this.getPossibleMoves();
    let boards = [];

    for (let m of moves) {
      let newBoard = new Array(8).fill(0).map(x => new Array(8));
      
      for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
          newBoard[y][x] = pieces[y][x];
        }
      }

      newBoard[this.y][this.x] = 0;
      newBoard[this.y + m[1]][this.x + m[0]] = new types[pieces[this.y][this.x].code](this.x + m[0], this.y + m[1], this.team);
      boards.push(newBoard);
    }

    return boards;
  }

  getMovesInCheck() {
    // let boards = this.getPossibleBoards();
    let moves = this.getPossibleMoves();
    let allowedMoves = [];

    for (let m of moves) {
      let newBoard = new Array(8).fill(0).map(x => new Array(8));
      
      for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
          // TODO: clone the pieces, consider going to string then back to pieces
          // use newboard as a stringy array then make a function for string to board
          newBoard[y][x] = pieces[y][x];
        }
      }

      newBoard[this.y][this.x] = 0;
      newBoard[this.y + m[1]][this.x + m[0]] = new types[pieces[this.y][this.x].code](this.x + m[0], this.y + m[1], this.team);

      if (this.team === -1) {
        if (!whiteKing.isInCheck(whiteKing.x, whiteKing.y, newBoard)) {
          allowedMoves.push(m); // TODO add moves, not boards
        }
      } else {
        if (!blackKing.isInCheck(blackKing.x, blackKing.y, newBoard)) {
          allowedMoves.push(m);
        }
      }
    }

    return allowedMoves;
  }
}

class FreePiece extends Piece {
  constructor(x, y, team) {
    super(x, y, team);
    this.moves; // the moves a free piece can initally make
  }

  getPossibleMoves(board=pieces) {
    // this checks the initial moves a free piece can make
    let possibleMoves = [];

    for (let fm of this.moves) {
      if (this.checkMove(this.x, this.y, fm, board)) {
        possibleMoves.push(fm);
      }
    }

    let num = possibleMoves.length;
    let out = [];

    for (let f = 0; f < num; f++) {
      for (let i = 1; i < 8; i++) {
        let curMove = [possibleMoves[f][0]*i, possibleMoves[f][1]*i];

        if (this.checkMove(this.x, this.y, curMove, board)) {
          if (board[this.y + curMove[1]][this.x + curMove[0]].team === -this.team) {
            out.push(curMove);
            break;
          } else {
            out.push(curMove);
          }
          
        } else {
          break;
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
      [ 1,  1], [-1,  1],
      [ 0,  1], [ 0,  2]
    ];
    this.name = 'pawn';
    this.code = 'p';
  }

  move(x, y) {
    let transformed = false;
    
    if (y === 0 || y === 7) {
      pieces[y][x] = new Queen(x, y, this.team);
      pieces[this.y][this.x] = 0;
      transformed = true;
    }

    if (!transformed) {
      pieces[y][x] = this;
      pieces[this.y][this.x] = 0;
      this.x = x;
      this.y = y;
    }
    
    turn = -turn;
    this.hasMoved = true;
    tap.play();
  }

  checkMove(x, y, move) {
    // overloaded to include that pawns can not take from in front of them
    let nx = x + move[0];
    let ny = y + move[1];
    
    return nx >= 0 && nx <= 7 && ny >= 0 && ny <= 7 && pieces[ny][nx] === 0;
    // return nx < 0 || nx > 7 || ny < 0 || ny > 7 || pieces[ny][nx] === 0;
  }

  checkFlank(x, y, move, board=pieces) {
    let nx = x + move[0];
    let ny = y + move[1];
    
    if (nx >= 0 && nx <= 7 && ny >= 0 && ny <= 7) {
      // console.log(board[ny][nx]);
      if (board[ny][nx] !== 0) {
        return board[ny][nx].team === -this.team;
      }
    }
    return false;
    // return nx < 0 || nx > 7 || ny < 0 || ny > 7 || pieces[ny][nx] === 0;
  }

  isFlankingKing(board=pieces) {

    for (let i = 0; i < 2; i++) {
      let nx = this.x + this.moves[i][0];
      let ny = this.y + this.moves[i][1];
      if (this.checkFlank(this.x, this.y, this.moves[i], board)) {
        if (board[ny][nx] !== 0) {
          if (board[ny][nx].code === 'k' && board[ny][nx].team === -this.team) {
            return true;
          }
        }
      }
    }
    return false;
  }

  getPossibleMoves() {
    // TODO check for enemies and en passant
    let possibleMoves = [];

    for (let i = 0; i < this.moves.length - this.hasMoved; i++) {
      if (i > 1) {
        if (this.checkMove(this.x, this.y, this.moves[i])) {
          possibleMoves.push(this.moves[i]);
        } else {
          // if you can't move one, you definitely can't move two
          break;
        }
      } else {
        if (this.checkFlank(this.x, this.y, this.moves[i])) {
          possibleMoves.push(this.moves[i]);
        }
      }
    }

    // possibleMoves.push(this.checkSideTakes());

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
    this.name = 'knight';
    this.code = 'n';
  }
}

class Bishop extends FreePiece {
  constructor(x, y, team) {
    super(x, y, team);
    this.moves = [
      [1, 1], [-1, 1], [-1, -1], [1, -1]
    ];
    this.name = 'bishop';
    this.code = 'b';
  }
}

class Rook extends FreePiece {
  constructor(x, y, team) {
    super(x, y, team);
    this.moves = [
      [0, 1], [-1, 0], [0, -1], [1, 0]
    ];
    this.name = 'rook';
    this.code = 'r';
  }
}

class Queen extends FreePiece {
  constructor(x, y, team) {
    super(x, y, team);
    this.moves = [
      [ 0,  1], [-1,  0], [ 0, -1], [ 1,  0],
      [ 1,  1], [-1,  1], [ 1, -1], [-1, -1]
    ];
    this.name = 'queen';
    this.code = 'q';
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
    this.name = 'king';
    this.code = 'k';

    this.threatX;
    this.threatY;
  }

  checkMove(x, y, move) {
    //TODO
    let nx = x + move[0];
    let ny = y + move[1];
    
    if (nx >= 0 && nx <= 7 && ny >= 0 && ny <= 7) {
      if (pieces[ny][nx] === 0) {
        return true;
      }
      return pieces[ny][nx].team === -this.team;  
      // if (!this.isInCheck(nx, ny)) {
      // }
    }
    return false;
  }

  isInCheck(posx=this.x, posy=this.y, board=pieces) {
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {

        let curPiece = board[y][x];
        
        if (curPiece !== 0) {
  
          // look at every piece, if its an enemy:
          if (curPiece.team === -this.team) {

            // if its any piece other than a king
            if (curPiece !== whiteKing && curPiece !== blackKing) {

              let moves = curPiece.getPossibleMoves(board);
              if (curPiece.code !== 'p') {
                for (let m of moves) {
                  if (x + m[0] === posx && y + m[1] === posy) {
                    return true;
                  }
                }
              } else {

                if (curPiece.isFlankingKing(board)) {
                  return true;
                }
              }
            }
          }
        }
      }
    }
    return false;
  }

  getMovesInCheck() {
    // if you dont override the function it will turn into a stack error

    let uncheckedMoves = this.getPossibleMoves();
    let boards = this.getPossibleBoards();
    let checkedMoves = [];

    for (let i = 0; i < uncheckedMoves.length; i++) {

      if (!this.isInCheck(this.x + uncheckedMoves[i][0], this.y + uncheckedMoves[i][1], boards[i])) {
        checkedMoves.push(uncheckedMoves[i]);
      }
    }

    if (!this.isInCheck() && !this.hasMoved) {
      checkedMoves.push(this.castleMoves());
    }
    return checkedMoves;
  }

  castleMoves() {
    let out = [];

    for (let x = 0; x < 2; x++) {
      let failed = false;
      let p = pieces[this.y][x*7];

      if (p.code === 'r' && !p.hasMoved) {
        
        let d = abs(this.x - p.x);
        for (let i = 1; i < d; x++) {
          let xpos = floor(lerp(this.x, p.x, i/d));

          if (pieces[this.y][xpos] === 0) {
            if (this.isInCheck(xpos, this.y)) {
              failed = true;
            }
          } else {
            failed = true;
          }
        }
      }
    }

    if (!failed) {
      if (x === 0) {
        out.push([-3, 0]);
      } else {
        out.push([2, 0]);
      }
    }

    return out;
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
}
