// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let bg;

function setup() {
  createCanvas(windowWidth, windowHeight);

  bg = new Displayer(30);
}

function draw() {
  background(255);

  bg.drawGrid();
  bg.move(-1, -1);

  loadPixels();
  fill(255, 0, 0);
  for (let i = 0; i < 1; i++) {

    // bg.pixRect2(0, 0, width, height, color(255, 0, 0));
    // rect(100, 200, 1000, 1000);
  }

  updatePixels();
  console.log(frameRate());
  // bg.pixRect2(100, 200, 100, 100, color(255, 255, 0));
}

class Displayer {
  constructor(cellSize) {
    this.cellSize = cellSize;

    this.numX = ceil(width/cellSize);
    this.numY = ceil(height/cellSize);

    this.translationX = 0;
    this.translationY = 0;
  }

  drawGrid() {
    push();
    translate(this.translationX % this.cellSize, this.translationY % this.cellSize);

    for (let i = -1; i < this.numX+1; i++) {
      let x = i*this.cellSize;
      line(x, -this.cellSize, x, height + this.cellSize);
    }
    for (let i = -1; i < this.numY+1; i++) {
      let y = i*this.cellSize;
      line(-this.cellSize, y, width + this.cellSize, y);
    }

    pop();
  }

  move(x, y) {
    this.translationX += x;
    this.translationY += y;
  }

  pixRect(x, y, w, h, col) {
    // loadPixels();
    for (let xi = 0; xi < w; xi++) {
      for (let yi = 0; yi < h; yi++) {
        let index = 4 * ((y + yi) * width + (x + xi));
        pixels[index] = red(col);
        pixels[index+1] = green(col);
        pixels[index+2] = blue(col);
      }
    }
    // updatePixels();
  }
  pixRect2(x, y, w, h, col) {
    // loadPixels();
    for (let i = 0; i < w*h; i++) {
      let cx = i % w;
      let cy = floor(i/w);
      let index = 4 * ((y + cy) * width + (x + cx));

      pixels[index] = red(col);
      pixels[index+1] = green(col);
      pixels[index+2] = blue(col);
    }
    // updatePixels();
  }
}
