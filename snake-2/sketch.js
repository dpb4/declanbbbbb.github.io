// snake 2
// Declan Bainbridge
// 10/4/21
//
// Extra for Experts:
// sound, scroll input

// my highscore is 58

// variables that shouldn't be changed
let s; // snake head
let a; // apple

let segments = []; // the list of segments
let dir = 0; // used every frame to turn the snake
let turnAmt; // amount the snake turns
let trans; // translation for the game board, used in every draw function
let themes; // list of themes
let curTheme = 0;
let numSegs; // total number of segments
let lenBuffer = 0; // how many segments are being added currently
let score = 0;
let highScore = 0;

let appleColour;
let leafColour;
let snakeColour;
let bgColour;
let mapColour;

// variables that CAN be changed
let speed = 2;
let segLen = 5; // length of each segment
let snakeWid = 10; // width of snake
let appleSafetyRad = 30; // how close apple can spawn to snake
let applePadding = 5; // how far apple should stay from walls
let segInc = 5; // how many segments are added every time an apple is eaten
let gameWid = 400; // width of the game area

let dead = false;
let debug = false;
let started = false;

let signFont;
let smallFont;

let eat;
let die;

function preload() {
  signFont = loadFont("assets/SignLanguage-Regular.ttf");
  smallFont = loadFont("assets/skinnyness.ttf");

  eat = loadSound("assets/cronch.wav");
  die = loadSound("assets/scream.mp3");
}

function setup() {
  createCanvas(500, 650);
  leafColour = color(0, 255, 0); // the leaf colour doesn't change with the theme

  turnAmt = PI/32;

  let edgePadding = (width - gameWid) / 2;
  trans = createVector(edgePadding, height - gameWid - edgePadding);
  
  gameInit();

  // layout: apple, snake, background, map
  // i opted for hex this time because its nicer in a lot of ways
  themes = [
    [color("#ff0000"), color("#33ff00"), color("#000000"), color("#ffffff"), "RETRO"     ],
    [color("#000000"), color("#b3d334"), color("#ec8323"), color("#794099"), "SPOOKY"    ],
    [color("#ff9900"), color("#12a3b2"), color("#79d8d5"), color("#196084"), "OCEAN"     ],
    [color("#ffe000"), color("#1282af"), color("#77c9ad"), color("#af081c"), "SUPERHERO" ],
    [color("#e0e0e0"), color("#9e9e9e"), color("#606060"), color("#343B40"), "NOIR"      ],
    [color("#c4a52e"), color("#f47e20"), color("#74c37e"), color("#124c25"), "JUNGLE"    ],
    [color("#e51c99"), color("#60cacc"), color("#fc94ff"), color("#8c18b7"), "CANDY"     ],
    [color("#07ff00"), color("#00cfff"), color("#fec20e"), color("#ff00ff"), "NEON"      ],
    [color("#2E1A13"), color("#3D2E29"), color("#805D52"), color("#BA8675"), "COCO"      ],
    [color("#550527"), color("#D4E4BC"), color("#F8AD9D"), color("#F0766A"), "FIG"       ],
    [color("#8E9AAF"), color("#BAABC4"), color("#FEEAFA"), color("#E4B4BB"), "NEUTRAL"   ],
    [color("#3772FF"), color("#F45D01"), color("#F7E702"), color("#38DB2A"), "KID"       ],
    [color("#F42B03"), color("#FF88DC"), color("#91A6FF"), color("#FAFF7F"), "TOY BOX"   ]
  ];
}

function draw() {
  background(220);  

  updateColours();
  drawBg();
  drawTitles();
  drawMap();

  if (!started) {
    drawButton();
  }

  if (!dead && started) {
    checkInput();
    updateLen(); // use lenbuffer to add to the length of the snake
    
    // update the apple
    a.update();

    for (let i = 0; i < numSegs; i++) {
      if (i === 0) { // if its the first entry, aka the head
        segments[0].moveAndTurn(dir);
        segments[0].checkDeath();
      } else { // if its any part of the body
        segments[i].setPos(segments[i-1].origin.x, segments[i-1].origin.y);
      }

      // regardless, update each part
      segments[i].update();
    }
  }
  
}

function gameInit() {
  // this sets everything up to start the game, called in setup and everytime you die
  dead = false;
  lenBuffer = 0;
  numSegs = 5;

  segments = []; // empty the segments

  // initialize the head
  s = new Head(gameWid/2, gameWid/2, 20, 0);
  segments.push(s);
  
  let initAngle = 0; // the angle that the segments will spawn with

  // initialize the segments as many times as requested
  for (let i = 1; i < numSegs; i++) { 
    let seg = new Segment(segments[i-1].origin.x - segLen*cos(initAngle), segments[i-1].origin.y - segLen*sin(initAngle), segLen, 0);
    segments.push(seg);
  }

  // initialize the apple
  a = new Apple(0, 0); 
  a.findOpenPosition();
}

function keyPressed() {
  // this just toggles debug mode
  if (key === 'x') {
    debug = !debug;
  }
}

function checkInput() {
  // this checks for a/d and changes dir accordingly
  if (keyIsDown(65) || keyIsDown(LEFT_ARROW)) { // a
    dir = -turnAmt;
  } else if (keyIsDown(68) || keyIsDown(RIGHT_ARROW)) { // d
    dir = turnAmt;
  } else {
    dir = 0;
  }
}

function checkIntersection(p1, p2, p3, p4) {
  // solution adapted from: https://stackoverflow.com/questions/563198/how-do-you-detect-where-two-line-segments-intersect
  // it basically converts each line segment to a vector then isolates certain variables (read thread for more details lol)
  // i dont completely understand it but it works perfectly
  
  let v1 = p5.Vector.sub(p2, p1);
  let v2 = p5.Vector.sub(p4, p3);
  
  s = (-v1.y * (p1.x - p3.x) + v1.x * (p1.y - p3.y)) / (-v2.x * v1.y + v1.x * v2.y);
  t = ( v2.x * (p1.y - p3.y) - v2.y * (p1.x - p3.x)) / (-v2.x * v1.y + v1.x * v2.y);

  return s >= 0 && s <= 1 && t >= 0 && t <= 1;
}

function updateLen() {
  // eating an apple increases the buffer by 5, then every frame it adds one segment and decreases the buffer
  if (lenBuffer !== 0) {
    segments[0].incLength();
    lenBuffer--;
  }
}

function drawTitles() {
  // this is responsible for drawing all the text
  push();

  // main title
  fill(mapColour);
  noStroke();
  textSize(100);
  textAlign(CENTER, BOTTOM);
  textFont(signFont);
  text("snake2", width/2, trans.y+20);

  // score and highscore
  textSize(36);
  strokeWeight(1);
  stroke(mapColour);
  textFont(smallFont);

  textAlign(RIGHT, TOP);
  text(`SCORE: ${score}`, width-30, 30);

  textAlign(LEFT, TOP);
  text(`HIGHSCORE: ${highScore}`, 30, 30);

  // theme
  textSize(24);
  textAlign(LEFT, BOTTOM);
  text(`THEME: ${themes[curTheme][4]}`, 30, height-18);

  pop();
}

function drawBg() {
  // this draws the stuff behind the game board, the background and the rounded rectangle
  background(snakeColour);

  fill(bgColour);
  stroke(mapColour);
  strokeWeight(3);
  rect(15, 15, width-30, height-30, 20);
}

function drawMap() {
  // this draws the game area where the snake stays
  stroke(mapColour);
  fill(mapColour);
  rect(trans.x, trans.y, gameWid, gameWid, 15);
}

function mouseWheel(event) {
  // change the theme up or down according to the scroll
  curTheme += ceil(-event.delta/100);
  
  // loop back around
  if (curTheme < 0) {
    curTheme = themes.length-1;
  }
  curTheme %= themes.length;

  return false;
}

function updateColours() {
  // update colours according to the theme index
  appleColour = themes[curTheme][0];
  snakeColour = themes[curTheme][1];
  bgColour = themes[curTheme][2];
  mapColour = themes[curTheme][3];
}

function drawButton() {
  // this draws the start button
  push();

  // the rectangle part
  translate(trans.x, trans.y);
  fill(appleColour);
  rectMode(CENTER);
  rect(gameWid/2, gameWid/2, 175, 100, 15);

  // the start part
  fill(mapColour);
  stroke(mapColour);
  strokeWeight(3);
  textAlign(CENTER, CENTER);
  textFont(smallFont);
  textSize(72);
  text("START", gameWid/2, gameWid/2);

  // instructions
  stroke(bgColour);
  fill(bgColour);
  textSize(24);
  textAlign(LEFT, BOTTOM);
  noStroke();
  text("A,D or LEFT,RIGHT to turn\nScroll to change themes", 5, gameWid-2);

  pop();
}

function mousePressed() {
  // this controls the button pressing if the game has not started
  // this giant conditional is because of the weird values for the edges of the button
  if (!started && mouseX > trans.x + gameWid/2 - 175/2 && mouseX < trans.x + gameWid/2 + 175/2 && mouseY > trans.x + gameWid/2 - 50 && trans.x + gameWid/2 + 50) {
    started = true;
  }
}