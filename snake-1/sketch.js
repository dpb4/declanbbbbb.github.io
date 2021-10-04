// snake
// Declan Bainbridge
// 10/4/21
//
// Extra for Experts:
// sounds, scroll wheel input

// my highscore for 20x20: 95

// number of squares on one side
// recommended range: 10 - 50. i think 20 is the best
let numSquares = 20;
let mapWid = 400; // width of the game area

// empty array of zeroes
let gameMap = Array(numSquares).fill(0).map(x => Array(numSquares).fill(0));
let directions;

let colourList = [];
let accentColour;
let bgColour;
let appleColour;
// stroke weight
let weight = 4;

let debug = false; // toggle debug mode
let dead = false;
let started = false;

let s; // the snake
let apple; // the apple
let arcade; // the font
let crunch; // sound that plays when you eat the apple
let deathCry; // sound that plays when you die

let score = 0;
let highscore = 0;
let theme = 0;

function preload() {
  crunch = loadSound("assets/apple.wav");
  deathCry = loadSound("assets/blip.wav");
  arcade = loadFont("assets/ARCADECLASSIC-1.TTF");
}

function setup() {
  createCanvas(500, 600);
  strokeWeight(weight);
  stroke(0);
  textFont(arcade);
  
  // initialize the snake
  s = new SnakeHead(floor(numSquares/2), floor(numSquares/2), 1, 0, 3);
  s.initGameMap();
  
  // initialize the apple
  apple = new Apple();
  
  directions = {
    "w": createVector(0, -1), 
    "s": createVector(0, 1), 
    "a": createVector(-1, 0), 
    "d": createVector(1, 0)
  };
  
  // i may have gone overboard here
  // the layout: accentColour, bgColour, appleColour, theme name
  colourList = [
    [color(0, 255, 0),     color(0),             color(255, 0, 0),     "ORIGINAL"],
    [color(255, 0, 255),   color(255),           color(0, 255, 255),   "INVERSE" ],
    [color(52, 235, 204),  color(0),             color(250, 244, 72),  "BLOO"    ],
    [color(109, 161, 95),  color(71, 122, 74),   color(109, 161, 95),  "RETRO"   ],
    [color(127, 159, 255), color(250, 168, 255), color(76, 255, 0),    "CANDY"   ],
    [color(255, 144, 0),   color(255, 88, 17),   color(255, 216, 0),   "SUNSET"  ],
    [color(242),           color(172, 220, 226), color(255, 216, 0),   "SKY"     ],
    [color(3, 15, 181),    color(55, 2, 124),    color(255, 170, 0),   "DUSK"    ],
    [color(0, 91, 30),     color(119, 0, 13),    color(219, 153, 0),   "REGAL"   ],
    [color(82, 158, 107),  color(154, 211, 173), color(90, 155, 158),  "MUTED"   ],
    [color(163),           color(211),           color(199, 102, 25),  "MALLOW"  ],
    [color(7, 112, 60),    color(152, 206, 62),  color(237, 26, 55),   "DEW MTN" ],
    [color(72, 134, 234),  color(211),           color(234, 136, 0),   "SCIENCE" ],
    [color(0, 181, 24),    color(255),           color(211, 50, 44),   "ITALY"   ],
    [color(91, 24, 0),     color(255, 254, 253), color(255, 150, 211), "SCREAM"  ],
    [color(238, 158, 239), color(161, 107, 168), color(237, 173, 195), "FLOWER"  ],
    [color(146, 131, 200), color(94, 205, 206),  color(142, 229, 55),  "MONSTER" ],
    [color(240, 136, 10),  color(103, 64, 161),  color(1, 148, 19),    "SPOOKY"  ],
    [color(118, 156, 226), color(79, 121, 226),  color(255),           "WAVES"   ]
  ];
}

  
function draw() {
  updateColours();
    
  if (started) {
    // the snake only updates every 10 frames to make it slower
    if (frameCount % 10 === 0 && !dead) {
      background(bgColour);
      s.update();
      drawMap();
      drawTitle();
    }
  } else {
    // before the game is started
    drawStartScreen();
    drawTitle();
  }
}

function updateColours() {
  // update colours according to the theme index and make sure the theme is >= 0 and and not out of range
  theme = max(theme, 0); // if less than 0, become zero
  theme %= colourList.length;
    
  accentColour = colourList[theme][0];
  bgColour = colourList[theme][1];
  appleColour = colourList[theme][2];
}

function drawStartScreen() {
  // this is all just drawing stuff that makes the start screen
  background(bgColour);
  
  push();
  
  translate((width - mapWid)/2, height - mapWid - (width - mapWid)/2);
  fill(accentColour);
  stroke(accentColour);
  rect(-weight, -weight, mapWid + weight*2, mapWid + weight*2);
  rectMode(CENTER);
  
  stroke(bgColour);
  fill(bgColour);
  rect(mapWid/2, mapWid/2, 150, 100);
  
  fill(appleColour);
  textSize(50);
  noStroke();
  textAlign(CENTER, CENTER);
  
  // the default kerning looks very goofy at this size so i did all this to make it nicer
  let textWid = textWidth("PLAY");
  let widScale = 3;
  let widOff = 4;
  text("P", widOff + mapWid/2 - textWid/widScale - 6, mapWid/2);
  text("L", widOff + mapWid/2 - textWid/widScale/4 - 4, mapWid/2);
  text("A", widOff + mapWid/2 + textWid/widScale/4, mapWid/2);
  text("Y", widOff + mapWid/2 + textWid/widScale - 1, mapWid/2);
  pop();
}

function drawMap() {
  // this draws the board and the apple
  let sf = mapWid / numSquares; // scale factor, everything is in coordinates from 0 - mapWid so this maps it to screen sizes

  push();
  
  // translate it to the center at the bottom
  translate((width - mapWid)/2, height - width/2 - mapWid/2);
  
  // apple
  fill(appleColour);
  stroke(bgColour);
  rect(apple.pos.x * sf, apple.pos.y * sf, sf, sf);
  
  // outline rectangle
  noFill();
  stroke(accentColour);
  rect(-weight, -weight, mapWid + weight*2, mapWid + weight*2);
  rect(-weight*3, -weight*3, mapWid + weight*6, mapWid + weight*6);
  
  fill(accentColour);
  stroke(bgColour);
  
  // go through every square and check if it is occupied by a snake piece
  // if it is, draw it
  for (let x = 0; x < numSquares; x++) {
    for (let y = 0; y < numSquares; y++) {
      if (gameMap[x][y] !== 0 && gameMap[x][y] !== undefined) {
        rect(x * sf, y * sf, sf, sf);
      }
      if (debug) {
        text(gameMap[x][y], x * sf + sf / 2, y * sf + sf / 2, sf, sf);
      }
    }
  }
  pop();
}

function drawTitle() {
  // this draws all the text at the top of the screen
  push();
  
  textAlign(CENTER, CENTER);
  noStroke();
  fill(accentColour);
  
  textSize(72);
  text("SNAKE!", width/2 + 15, 50);
  
  textSize(36);
  text(`SCORE  ${score}`, width/2, 100);
  
  textAlign(LEFT, TOP);
  textSize(24);
  text(`HIGH  ${highscore}`, 10, 5);
  
  textAlign(RIGHT, TOP);
  text("THEME", width-10, 5);
  textSize(18);
  text(colourList[theme][3], width-10, 30);
  
  pop();
}



function keyPressed () {
  // if the key is in wasd (it doesnt work with a normal list lol)
  if (key in {'w': 0, 'a': 0, 's': 0, 'd': 0} && started) {
    // this conditional makes sure you arent trying to turn 180 degrees
    // nextDir exists so that in between snake updates you cant turn multiple times, which allowed you
    // to still turn around 180 degrees
    // instead of updating dir each time, this will only update it once per cycle
    if (!directions[key].equals(p5.Vector.mult(s.dir, -1))) {
      s.nextDir = directions[key];
    }
  }
}

function mouseClicked() {
  if (!started) {
    let midX = (width - mapWid)/2 + mapWid/2;
    // conditional that just checks if mouse is inside the play button
    if (mouseX > width/2 - 75 && mouseX < width/2 + 75 && mouseY < height - width/2 + 50 && mouseY > height - width/2 - 50) {
      dead = false;
      started = true;
    }
  }
}

function mouseWheel(event) {
  // change the theme up or down according to the scroll
  theme += ceil(-event.delta/100);
  
  // loop back around
  if (theme < 0) {
    theme = colourList.length-1;
  }

  return false;
}
