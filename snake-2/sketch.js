// snake 2
// Declan Bainbridge
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"


//TODO: check all segment[0] usage, change pos1, consider adding pos1 + origin variable, consider adding pause, add sounds
let s;
let a;
let segments = [];
let appleSafetyRad = 30;
let applePadding = 5;
let segInc = 5;
let gameWid = 400;
let dir = 0;
let turnAmt;
let trans;
let themes;
let curTheme = 0;

let appleColour;
let leafColor;

let snakeColour;
let bgColour;
let mapColour;

let numSegs;
let segLen;
let snakeWid;
let speed = 2;
let lenBuffer = 0;
let score = 0;
let highScore = 0;

let dead = false;
let debug = false;
let started = false;

let signFont;
let smallFont;

function preload() {
  signFont = loadFont("assets/SignLanguage-Regular.ttf");
  smallFont = loadFont("assets/skinnyness.ttf");
}

function setup() {
  createCanvas(500, 650);
  snakeColour = color(0, 200, 127);
  appleColour = color(232, 53, 53);
  leafColor = color(118, 207, 50);
  bgColour = color("yellow");
  mapColour = color("pink");

  turnAmt = PI/32;

  let edgePadding = (width - gameWid) / 2;
  trans = createVector(edgePadding, height - gameWid - edgePadding);
  
  gameInit();

  // layout: apple, snake, background, map
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
    updateLen();
    
    a.display();
    a.checkEaten();

    for (let i = 0; i < numSegs; i++) {
      if (i === 0) {
        segments[0].moveAndTurn(dir);
        segments[0].checkDeath();
      } else {
        segments[i].setPos(segments[i-1].origin.x, segments[i-1].origin.y);
      }
      segments[i].update();
    }
  }
  
}

function gameInit() {
  dead = false;
  lenBuffer = 0;
  numSegs = 5;
  segLen = 5;
  speed = 2;
  snakeWid = 10;

  segments = [];

  s = new Head(gameWid/2, gameWid/2, 30, 0);
  segments.push(s);
  
  let initAngle = 0;
  
  for (let i = 1; i < numSegs; i++) {
    let seg = new Segment(segments[i-1].origin.x - segLen*cos(initAngle), segments[i-1].origin.y - segLen*sin(initAngle), segLen, 0);
    segments.push(seg);
  }

  a = new Apple(0, 0);
  a.findOpenPosition();
}

function keyPressed() {
  if (key === 'x') {
    debug = !debug;
  }
}

function checkInput() {
  if (keyIsDown(65) || keyIsDown(LEFT_ARROW)) { // a
    dir = -turnAmt;
  } else if (keyIsDown(68) || keyIsDown(RIGHT_ARROW)) { // d
    dir = turnAmt;
  } else {
    dir = 0;
  }
  if (keyIsDown(32)) {
    segments[0].incLength();
  }
}

function checkIntersection(p1, p2, p3, p4) {
  // solution adapted from: https://stackoverflow.com/questions/563198/how-do-you-detect-where-two-line-segments-intersect
  
  let v1 = p5.Vector.sub(p2, p1);
  let v2 = p5.Vector.sub(p4, p3);
  
  s = (-v1.y * (p1.x - p3.x) + v1.x * (p1.y - p3.y)) / (-v2.x * v1.y + v1.x * v2.y);
  t = ( v2.x * (p1.y - p3.y) - v2.y * (p1.x - p3.x)) / (-v2.x * v1.y + v1.x * v2.y);

  return s >= 0 && s <= 1 && t >= 0 && t <= 1;
  
}

function updateLen() {
  if (lenBuffer !== 0) {
    segments[0].incLength();
    lenBuffer--;
  }
}

function drawTitles() {
  push();

  fill(mapColour);

  noStroke();
  textSize(100);
  textAlign(CENTER, BOTTOM);
  textFont(signFont);
  text("snake2", width/2, trans.y+20);

  textSize(36);
  strokeWeight(1);
  stroke(mapColour);
  textFont(smallFont);

  textAlign(RIGHT, TOP);
  text(`SCORE: ${score}`, width-30, 30);

  textAlign(LEFT, TOP);
  text(`HIGHSCORE: ${highScore}`, 30, 30);

  textSize(24);
  textAlign(LEFT, BOTTOM);
  text(`THEME: ${themes[curTheme][4]}`, 30, height-18);
  pop();
}

function drawBg() {
  background(snakeColour);

  fill(bgColour);
  strokeWeight(3);
  stroke(mapColour);
  rect(15, 15, width-30, height-30, 20);
}

function drawMap() {
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

  return false;
}

function updateColours() {
  // update colours according to the theme index and make sure the theme is >= 0 and and not out of range
  curTheme %= themes.length;
  
  appleColour = themes[curTheme][0];
  snakeColour = themes[curTheme][1];
  bgColour = themes[curTheme][2];
  mapColour = themes[curTheme][3];
}

function drawButton() {
  push();
  translate(trans.x, trans.y);
  fill(appleColour);
  rectMode(CENTER);
  rect(gameWid/2, gameWid/2, 175, 100, 15);

  fill(mapColour);
  stroke(mapColour);
  strokeWeight(3);
  textAlign(CENTER, CENTER);
  textFont(smallFont);
  textSize(72);
  text("START", gameWid/2, gameWid/2);

  pop();
}

function mousePressed() {
  if (!started && mouseX > trans.x + gameWid/2 - 175/2 && mouseX < trans.x + gameWid/2 + 175/2 && mouseY > trans.x + gameWid/2 - 50 && trans.x + gameWid/2 + 50) {
    started = true;
  }
}