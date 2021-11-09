// i decided to make one big parent class (piece) that has all the functions a piece would normally need
// its essentially used like a java interface, it defines the basic variables and methods that most pieces will need

// i split the pieces into two categories: step pieces and free pieces
// step: pawn, knight, king
// free: bishop, rook, queen

// FYI(s): 
// - for every function with board=pieces as an argument, it is for checking hypothetical boards when examining checkmate. by default the functions all use the current board
// - i decided that a 'move' would be a list of length 2, basically like a vector. everywhere you say move[0] is the x move, and move[1] is the y move
// - a piece's 'code' is a single character representing that piece type

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
    // does the basic checks on the legality of a move

    let nx = x + move[0];
    let ny = y + move[1];
    
    // if it is inside the board
    if (nx >= 0 && nx <= 7 && ny >= 0 && ny <= 7) {
      // if it is an empty square
      if (board[ny][nx] === 0) {
        return true;
      }
      // if its not empty, make sure its an enemy
      return board[ny][nx].team === -this.team;
    }

    // otherwise its not legal
    return false;
  }

  getPossibleMoves(board=pieces) {
    // applies checkMove to all the moves in the list and returns the list of possible moves (but not necessarily ALLOWED moves)
    let possibleMoves = [];

    for (let i = 0; i < this.moves.length; i++) {
      if (this.checkMove(this.x, this.y, this.moves[i], board)) {
        // if it is a possible move, add it to the list
        possibleMoves.push(this.moves[i]);
      }
    }

    return possibleMoves;
  }

  move(x, y) {
    // moves the piece to a given location

    // first set the new position to be the piece that is moving
    pieces[y][x] = this;

    // then clear the old position
    pieces[this.y][this.x] = 0;

    // then update the variables inside the moving piece
    this.x = x;
    this.y = y;
    this.hasMoved = true;
    
    // then change the turn
    turn = -turn;

    // lastly play da sound
    tap.play();
  }

  display() {
    // displays the piece
    image(this.getSprite(), this.x*scx + offset, this.y*scy + offset);
  }

  getSprite() {
    // returns the appropriate sprite of the piece
    if (this.team === -1) {
      return sprites[0][codes[this.code]][theme];
    }
    return sprites[1][codes[this.code]][theme];
  }

  getPossibleBoards() {
    // returns a list of boards based on each possible move
    // this is used to check for check mainly

    let moves = this.getPossibleMoves();
    let boards = [];

    for (let m of moves) {
      // for every move, copy the existing board into a new 8x8 grid
      let newBoard = new Array(8).fill(0).map(x => new Array(8));
      
      for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
          newBoard[y][x] = pieces[y][x];
        }
      }

      // then, change one piece based on m (the current move)
      newBoard[this.y][this.x] = 0;
      newBoard[this.y + m[1]][this.x + m[0]] = new types[pieces[this.y][this.x].code](this.x + m[0], this.y + m[1], this.team);
      newBoard[this.y + m[1]][this.x + m[0]].moves = this.moves;

      boards.push(newBoard);
    }

    return boards;
  }

  getAllowableMoves() {
    // this returns the allowable moves a piece can take, which includes checking for check
    let moves = this.getPossibleMoves();
    let allowedMoves = [];

    // unfortunately i can't use getPossibleBoards here, since i need to look specifically
    // at which piece moved from the current board to the new board, so i have to repeat a ton of the same code

    // it looks at each move a piece could make, and ensures that the king is not in check if that move is made
    // if he is in check, its not a legal move
    for (let m of moves) {
      // all the same as descirbed above

      let newBoard = new Array(8).fill(0).map(x => new Array(8));
      
      for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
          newBoard[y][x] = pieces[y][x];
        }
      }

      newBoard[this.y][this.x] = 0;
      newBoard[this.y + m[1]][this.x + m[0]] = new types[pieces[this.y][this.x].code](this.x + m[0], this.y + m[1], this.team);
      newBoard[this.y + m[1]][this.x + m[0]].moves = this.moves;

      // make sure that the appropriate king is not in check before adding the move
      if (this.team === -1) {
        if (!whiteKing.isInCheck(whiteKing.x, whiteKing.y, newBoard)) {
          allowedMoves.push(m);
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
  // the only difference between a freepiece and a piece is the getpossiblemoves function. everything else is identical
  constructor(x, y, team) {
    super(x, y, team);

    // the moves a free piece can INITIALLY make (one step)
    // it also makes sense to think of them as directions that the piece might be able to go
    this.moves; 
  }

  getPossibleMoves(board=pieces) {
    // this checks the initial moves a free piece can make

    // this is the list of allowed first moves
    let possibleMoves = [];

    // check only the first moves
    // if you can't make the first move, you definitely can't go any further in that direction
    for (let fm of this.moves) {
      if (this.checkMove(this.x, this.y, fm, board)) {
        possibleMoves.push(fm);
      }
    }

    let num = possibleMoves.length;
    let out = [];

    // for every first move,
    for (let f = 0; f < num; f++) {
      // check 8 moves in that direction (you obviously cannot move more than 7, so this covers all bases)
      for (let i = 1; i < 8; i++) {
        // scale the first move by i
        let curMove = [possibleMoves[f][0]*i, possibleMoves[f][1]*i];

        // check curMove with checkmove (the basic checks)
        if (this.checkMove(this.x, this.y, curMove, board)) {

          // if its an enemy, its an allowed move but it has to be the last move in that direction
          if (board[this.y + curMove[1]][this.x + curMove[0]].team === -this.team) {
            out.push(curMove);
            break;
          } else {
            // if its not an enemy, you're golden
            out.push(curMove);
          }
        } else {

          // if its not allowed under the basic checks, you have to stop checking in that direction or it will jump over pieces
          break;
        }
        
      }
    }
    return out;
  }
}

// here is where i defined all the piece types
// they all have their own moves and codes
// when they have different functionality than a default piece, i overload functions to account for that

class Pawn extends Piece {
  constructor(x, y, team) {
    super(x, y, team);
    this.moves = [
      [ 1,  1], [-1,  1],
      [ 0,  1], [ 0,  2]
    ];
    this.code = 'p';
  }

  move(x, y) {
    // when pawns move, there is the possibility of them turning into a queen (accounted for here)
    let transformed = false;
    
    // if it has reached the other side, replace it with a queen
    if (y === 0 || y === 7) {
      pieces[y][x] = new Queen(x, y, this.team);
      pieces[this.y][this.x] = 0;
      transformed = true;
    }

    // otherwise just move like normal
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
  }

  checkFlank(x, y, move, board=pieces) {
    // this is essentially the original checkMove function. it allowes moves to land on enemies (but i only pass it flanking moves)
    let nx = x + move[0];
    let ny = y + move[1];
    
    if (nx >= 0 && nx <= 7 && ny >= 0 && ny <= 7) {
      if (board[ny][nx] !== 0) {
        return board[ny][nx].team === -this.team;
      }
    }
    return false;
  }

  isFlankingKing(board=pieces) {
    // this is used for determining check

    // go through the first 2 moves:
    for (let i = 0; i < 2; i++) {

      let nx = this.x + this.moves[i][0];
      let ny = this.y + this.moves[i][1];

      // if you are flanking something
      if (this.checkFlank(this.x, this.y, this.moves[i], board)) {
        if (board[ny][nx] !== 0) {
          if (board[ny][nx].code === 'k' && board[ny][nx].team === -this.team) {
            // if that something is an opposing king, return true
            return true;
          }
        }
      }
    }
    return false;
  }

  getPossibleMoves() {
    // pawns have weird rules so this had to be overloaded

    let possibleMoves = [];

    for (let i = 0; i < this.moves.length - this.hasMoved; i++) {

      // the second two moves are the forward ones that can't take pieces
      if (i > 1) {

        // check straight moves with checkMove
        if (this.checkMove(this.x, this.y, this.moves[i])) {
          possibleMoves.push(this.moves[i]);
        } else {
          // if you can't move one, you definitely can't move two
          break;
        }
      } else {

        // the first two moves are the diagonal ones, so check them with checkFlank instead
        if (this.checkFlank(this.x, this.y, this.moves[i])) {
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
    this.code = 'n';
  }
}

class Bishop extends FreePiece {
  constructor(x, y, team) {
    super(x, y, team);
    this.moves = [
      [1, 1], [-1, 1], [-1, -1], [1, -1]
    ];
    this.code = 'b';
  }
}

class Rook extends FreePiece {
  constructor(x, y, team) {
    super(x, y, team);
    this.moves = [
      [0, 1], [-1, 0], [0, -1], [1, 0]
    ];
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
    this.code = 'q';
  }
}

class King extends Piece {
  // this one is a doozy
  constructor(x, y, team) {
    super(x, y, team);
    this.moves = [
      [ 0,  1], [ 0, -1],
      [ 1,  0], [-1,  0],
      [ 1,  1], [ 1, -1],
      [-1,  1], [-1, -1]
    ];
    this.code = 'k';
  }

  isInCheck(posx=this.x, posy=this.y, board=pieces) {
    // returns whether or not the king is checked
    
    // look at every piece
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {

        let curPiece = board[y][x];
        
        if (curPiece !== 0) {
  
          // look at every piece, if its an enemy:
          if (curPiece.team === -this.team) {

            // if its any piece other than a king
            if (curPiece !== whiteKing && curPiece !== blackKing) {

              let moves = curPiece.getPossibleMoves(board);

              // if it is not a pawn:
              if (curPiece.code !== 'p') {
                for (let m of moves) {
                  // check if any of the moves make a piece land on the king
                  if (x + m[0] === posx && y + m[1] === posy) {
                    return true;
                  }
                }
              } else {
                // pawns are unique because they are the only pieces that have some moves that cannot take enemies
                // as such, they have to be treated differently
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

  getAllowableMoves() {
    // if you dont override this function it will turn into a stack error

    let uncheckedMoves = this.getPossibleMoves();
    let boards = this.getPossibleBoards();
    let checkedMoves = [];

    // basically just check if a move puts it in danger, and if it does it isn't allowed
    for (let i = 0; i < uncheckedMoves.length; i++) {
      if (!this.isInCheck(this.x + uncheckedMoves[i][0], this.y + uncheckedMoves[i][1], boards[i])) {
        checkedMoves.push(uncheckedMoves[i]);
      }
    }

    // if you arse safe and haven't moved, maybe you can castle
    if (!this.isInCheck() && !this.hasMoved) {
      // castleMoves returns an array of arrays so it must be flattened
      checkedMoves.push(this.castleMoves().flat());
    }

    return checkedMoves;
  }

  castleMoves() {
    // returns the moves that you can make to castle
    let out = [];

    for (let x = 0; x < 2; x++) {
      // look at the leftmost and rigtmost pieces of your row
      let failed = false;
      let p = pieces[this.y][x*7];

      // if they are rooks that haven't moved, check if the math between them is clear
      if (p.code === 'r' && !p.hasMoved) {
        
        // the distance between this king and the current rook
        let d = abs(this.x - p.x);

        for (let i = 1; i < d; i++) {
          // step towards the rook in increments of one
          let xpos = floor(lerp(this.x, p.x, i/d));

          // if the path is empty, make sure none of the squares are in check
          if (pieces[this.y][xpos] === 0) {
            if (this.isInCheck(xpos, this.y)) {
              failed = true;
            }
          } else {
            // if the path isn't empty, you obviously can't castle
            failed = true;
          }
        }
      }

      if (!failed) {
        // maps [0, 1] to [-2, 2]
        let xmove = x*4 - 2;

        out.push([xmove, 0]);
      }
    }

    return out;
  }
}
