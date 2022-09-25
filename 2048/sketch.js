// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let gsm;
let lastState;
let AISwitch;

let squareWidth;
let edgeOffset;
let edgeDarkness;
let backgroundColour;

let zeroBonus = 0.2;

let scores = 0;
let tally = 0;

let sg = [
  [1, 1, 2, 3],
  [7, 6, 5, 4],
  [8, 9, 10, 11],
  [0, 0, 0, 0],
];

let basicGradient = (x) => color((1 - pow(Math.tanh(x / 6), 3)) * 255);
let OPGradient = (x) => lerpColor(color(88, 43, 160), color(226, 116, 52), (1 - pow(Math.tanh(x / 6), 3)));
let POGradient = (x) => lerpColor(color(226, 116, 52), color(88, 43, 160), (1 - pow(Math.tanh(x / 7.5), 2)));
let OPSigGradient = (x) => lerpColor(color(88, 43, 160), color(226, 116, 52), (1 - pow(1/(1 + exp(-x)), 40)));
let OPAcosGradient = (x) => lerpColor(color(88, 43, 160), color(226, 116, 52), pow(acos(1/(x+1)) / (PI/2), 1.5));

let tileColours;

function setup() {
  createCanvas(ceil(min(windowWidth, windowHeight) * 0.72), ceil(min(windowWidth, windowHeight) * 0.9));
  background(200);
  stroke(0);
  strokeWeight(ceil(min(windowWidth, windowHeight)/300));
  textAlign(CENTER, CENTER);
  textFont('Inter');

  gsm = new GameStateManager(OPGradient);
  lastState = gsm.state.copy();
  
  squareWidth = width/4.5;
  edgeOffset = squareWidth*0.05;
  edgeDarkness = 0.75;
  backgroundColour = color(190);
  
  AISwitch = new Switch(false, (width - squareWidth*4)/2, height*0.17, squareWidth*0.3, squareWidth*0.3*0.5, color(120), color(68, 113, 36), color(206));

  tileColours = [
    color(136, 147, 134),
    color(120, 147, 115),
    color(105, 157, 95),
    color(99, 162, 87),
    color(92, 169, 77),
    color(76, 172, 73),
    color(71, 184, 108),
    color(71, 184, 125),
    color(71, 184, 142),
    color(65, 137, 110),
    color(47, 100, 67),
  ];
  textSize(squareWidth/3);
  // frameRate(10000000000);
}

function draw() {
  background(backgroundColour);
  gsm.displayGame();
  gsm.displayGrid();
  AISwitch.display();
  // console.log(frameRate());
  // if (gsm.state.isDead()) {
    
  //   tally++;
  //   console.log(tally);
  //   scores += gsm.state.score;
  //   gsm.state = new State();
  // }

  // if (!gsm.state.isOpen()) {
  //   if (lastState.equals(gsm.state)) {
      
  //     tally++;
  //     console.log(tally);
  //     scores += gsm.state.score;
  //     gsm.state = new State();
  //   }
  // }

  // if (tally === 32) {
  //   console.log("AVG:" + str(scores/tally));
  // }

  // lastState = gsm.state.copy();

  if (AISwitch.state) {
    if (this.frameCount % 16 === 0 || (keyIsDown(32))) {
      gsm.AIMove();
    }
  }
}

function keyPressed() {
  if (keyCode === "UP_ARROW" || keyCode === 87) {
    gsm.input(0);
  } else if (keyCode === "DOWN_ARROW" || keyCode === 83) {
    gsm.input(2);
  } else if (keyCode === "RIGHT_ARROW" || keyCode === 68) {
    gsm.input(1);
  } else if (keyCode === "LEFT_ARROW" || keyCode === 65) {
    gsm.input(3);
  } else if (keyCode === 32) {
    
    console.log(gsm.AIMove());
  }
}

function mousePressed() {
  AISwitch.update();
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}   

function logMatrix(mat) {
  // TODO fix spacing
  console.log(`Size: ${mat.length}x${mat[0].length}`);

  let maxLength = -1;
  for (let i = 0; i < mat.length; i++) {
    for (let j = 0; j < mat[i].length; j++) {
      maxLength = max(mat[i][j].toFixed(1).length, maxLength);
    }
  }
  let out = '';
  
  for (let i = 0; i < mat.length; i++) {
    out += "| ";
    for (let j = 0; j < mat[i].length; j++) {
      out += mat[i][j].toFixed(0);

      if (j !== mat[i].length-1) {
        out += ' '.repeat(maxLength - mat[i][j].toFixed(1).length + 1);
      } else {
        out += ' ';
      }
    }
    out += '|\n';
  }
  console.log(out);
}

function rotateGrid(mat, rotation) {
  let out = new Array(mat.length).fill(0).map(x => new Array(mat[0].length).fill(0));

  rotation = (4-rotation) % 4;

  for (let y = 0; y < mat.length; y++) {
    for (let x = 0; x < mat[0].length; x++) {
      if (rotation === 0) {
        out[y][x] = mat[y][x]
      } else if (rotation === 1) {
        out[y][x] = mat[x][3-y]
      } else if (rotation === 2) {
        out[y][x] = mat[3-y][3-x]
      } else if (rotation === 3) {
        out[y][x] = mat[3-x][y]
      }
    }
  }

  return out;
}




