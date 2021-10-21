let startingBoard = [
  ['r','n','b','q', 0 ,'b','n','r'],
  ['p','p','p','p','p','p','p','p'],
  [ 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 ],
  [ 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 ],
  [ 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 ],
  [ 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 ],
  ['p','p','p','p','p','p','p','p'],
  ['r','n','b','q', 0 ,'b','n','r']
];
// TODO king cant move into danger 242, en passant, castling, everything else

// white: -1
// black: 1
let pieces;

let scx;
let scy;

let types;
let turn = -1;
let selectedPiece;

let picking = true;

let properSelected = false;
let sprites = [];

let blackKing;
let whiteKing;
function preload() {
  // layout: sprites[team][piece][theme]
  sprites = [
    [
      [],
      [],
      [],
      [],
      [],
      [],
    ],
    [
      [],
      [],
      [],
      [],
      [],
      [],
    ]
  ];
}

function setup() {
  createCanvas(600, 600);
  noStroke();

  types = {'p': Pawn, 'n': Knight, 'b': Bishop, 'r': Rook, 'k': King, 'q': Queen};

  scx = width/8;
  scy = height/8;

  initBoard();
}

function draw() {
  background(220);
  drawGrid();
  displayPieces();

  properSelected = selectedPiece !== undefined && selectedPiece.team === turn;
  let checked = false;
  
  if (turn === -1) {
    checked = checkKing(whiteKing);
  } else {
    checked = checkKing(blackKing);
  }
  
  if (properSelected && !checked) {
    highlightMoves(selectedPiece);
  }
}

function initBoard() {
  let curTeam = 1;
  pieces = startingBoard;

  for (let y = 0; y < 8; y++) {
    if (y === 4) {
      curTeam = -1;
    }
    for (let x = 0; x < 8; x++) {
      if (startingBoard[y][x] !== 0) {
        // i cannot believe this works
        pieces[y][x] = new types[pieces[y][x]](x, y, curTeam);
      }
    }
  }
  blackKing = new King(4, 0, 1);
  whiteKing = new King(4, 7, -1);
  pieces[0][4] = blackKing;
  pieces[7][4] = whiteKing;

  // if on the white team, flip all the moves vertically
  for (let y = 4; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      if (startingBoard[y][x] !== 0) {
        for (let i = 0; i < pieces[y][x].moves.length; i++) {
          pieces[y][x].moves[i][1] *= -1;
        }
      }
    }
  }
}

function drawGrid() {
  for (let x = 0; x < 8; x++) {
    for (let y = 0; y < 8; y++) {
      fill((x+y+1)%2 * 255);
      rect(x * scx, y * scy, scx, scy);
    }
  }
}

function displayPieces() {
  push();
  stroke(255, 0, 0);
  fill(255, 0, 0);
  for (let x = 0; x < 8; x++) {
    for (let y = 0; y < 8; y++) {
      if (pieces[y][x] !== 0) {
        pieces[y][x].display();
      }
    }
  }
  pop();
}

function checkKing(king) {
  if (king.isInCheck()) {
    selectedPiece = king;

    let checkedMoves = king.getCheckedMoves();

    if (checkedMoves.length === 0) {
      console.log("checkmate");
    }

    highlightMoves(king, checkedMoves);
    
    return true;
  }
}

function highlightMoves(p, moves=p.getPossibleMoves()) {
  let x = p.x;
  let y = p.y;

  fill(0, 255, 0, 127);
  rect(x*scx, y*scy, scx, scy);
  fill(255, 255, 0, 127);

  for (let move of moves) {
    rect((x + move[0])*scx, (y+move[1])*scy, scx, scy);
  }
}

function mouseClicked() {
  let mouseXIndex = floor(mouseX/scx);
  let mouseYIndex = floor(mouseY/scy);
  
  if (mouseX < width && mouseY < height) {
    if (properSelected) {
      let found = false;
      let moves = selectedPiece.getPossibleMoves();
  
      for (let move of moves) {
        if (move[0] + selectedPiece.x === mouseXIndex && move[1] + selectedPiece.y === mouseYIndex) {
          selectedPiece.move(mouseXIndex, mouseYIndex);
          found = true;
          break;
        }
      }
      if (!found) {
        selectedPiece = pieces[mouseYIndex][mouseXIndex];
      }
    } else {
      selectedPiece = pieces[mouseYIndex][mouseXIndex];
    }
  }
}