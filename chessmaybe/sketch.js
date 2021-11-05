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
// TODO en passant, castling, consider adding blank class, stalemate rule, king list, everything else

// resizeNN.js is NOT MY CODE. p5 doesn't have nearest neighbor resizing by default so pixel art gets blurry. that script just implements it.
// https://gist.github.com/GoToLoop/2e12acf577506fd53267e1d186624d7c

// white: -1
// black: 1
let pieces;

let scx;
let scy;
let offset;

let types;
let codes;

let turn = -1;
let selectedPiece;

let picking = true;
let done = false;

let selectedIsProper = false;
let checked = false;

let sprites = [];
let theme = 0;
let font;
let tap;

let blackKing;
let whiteKing;
function preload() {
  tap = loadSound('./assets/move.wav');
  font = loadFont('./assets/IMFellDWPica-Regular.ttf');

  // layout: sprites[team][piece][theme]
  sprites = [
    [
      [loadImage("./assets/pixel/wpawn.png")  ],
      [loadImage("./assets/pixel/wknight.png")],
      [loadImage("./assets/pixel/wbishop.png")],
      [loadImage("./assets/pixel/wrook.png")  ],
      [loadImage("./assets/pixel/wqueen.png") ],
      [loadImage("./assets/pixel/wking.png")  ],
    ],
    [
      [loadImage("./assets/pixel/bpawn.png")  ],
      [loadImage("./assets/pixel/bknight.png")],
      [loadImage("./assets/pixel/bbishop.png")],
      [loadImage("./assets/pixel/brook.png")  ],
      [loadImage("./assets/pixel/bqueen.png") ],
      [loadImage("./assets/pixel/bking.png")  ],
    ]
  ];
  
}

function setup() {
  createCanvas(544, 544); // multiples of 8 and 17 (136)
  noStroke();
  textFont(font);

  types = {'p': Pawn, 'n': Knight, 'b': Bishop, 'r': Rook, 'q': Queen, 'k': King};
  codes = {'p': 0, 'n': 1, 'b': 2, 'r': 3, 'q': 4, 'k': 5};

  scx = width/8;
  scy = height/8;
  offset = width/8/17; // 15x15 with one on either side (17x17)

  initBoard();

  // this resizes the pixel art nicely
  for (let j = 0; j < 2; j++) {
    for (let i = 0; i < sprites[j].length; i++) {
      sprites[j][i][0].resizeNN(width/8/17*15, width/8/17*15);
    }
  }
}

function draw() {
  background(220);
  drawGrid();
  displayPieces();
  if (!done) {

    selectedIsProper = selectedPiece !== undefined && selectedPiece.team === turn;
    checked = false;
    
    drawCheck();
    
    if (selectedIsProper) {
      highlightMoves(selectedPiece, selectedPiece.getMovesInCheck());
    }
  }
  if (checkForCheckMate()) {
    done = true;

    push();
    stroke(0);
    strokeWeight(8);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(120);
    if (turn === -1) {
      text("Black wins", width/2, height/2);
    } else {
      text("White wins", width/2, height/2);
    }

    pop();
  }
}

function checkForCheckMate() {
  for (let y = 0; y < 7; y++) {
    for (let x = 0; x < 7; x++) {
      if (pieces[y][x] !== 0) {
        if (pieces[y][x].team === turn) {
          if (pieces[y][x].getMovesInCheck().length !== 0) {
            return false;
          }
        }
      }
    }
  }
  return true;
}
function drawCheck() {
  push();
  fill(255, 255, 0, 127);
  noStroke();
  if (turn === -1) {
    if (whiteKing.isInCheck()) {
      rect(whiteKing.x * scx, whiteKing.y * scy, scx, scy);
    }
  } else {
    if (blackKing.isInCheck()) {
      rect(blackKing.x * scx, blackKing.y * scy, scx, scy);
    }
  }
  pop();
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

function highlightMoves(p, moves=p.getMovesInCheck()) {
  let x = p.x;
  let y = p.y;

  push();
  fill(0, 255, 0, 127);
  rect(x*scx, y*scy, scx, scy);

  for (let move of moves) {
    strokeWeight(10);
    stroke(255, 0, 0, 127);
    line(x*scx + scx/2, y*scy + scy/2, (x + move[0])*scx + scx/2, (y + move[1])*scy + scy/2);
    
    strokeWeight(20);
    stroke(255, 0, 0);
    point((x + move[0])*scx + scx/2, (y + move[1])*scy + scy/2);
  }
  pop();
}

function mouseClicked() {
  let mouseXIndex = floor(mouseX/scx);
  let mouseYIndex = floor(mouseY/scy);
  
  if (mouseX < width && mouseX > 0 && mouseY < height && mouseY > 0) {
    if (selectedIsProper) {
      let found = false;
      let moves = selectedPiece.getMovesInCheck();
  
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