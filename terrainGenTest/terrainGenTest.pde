float noiseScale;
float tanhOff = 0;

boolean paused = false;
void setup() {
  size(300, 300);
  background(0);
  strokeWeight(1);
  
  colorMode(RGB, 1);
  noiseScale = 25;
  
  drawThing();
}

void drawThing() {
  loadPixels();
  for (int i = 0; i < width; i++) {
    for (int j = 0; j < height; j++) {
      float val = ((float)Math.tanh(10 * (noise(i/noiseScale, j/noiseScale)-tanhOff)) + 1)/2;
      
      float n1 = noise(i/noiseScale, j/noiseScale);
      float n2 = noise(i/noiseScale/4, j/noiseScale/4);
      //n2 = pow(n1, 2);
      n2 /= 2;
      
      float s = (val * n1) + ((1-val) * n2);
      //stroke(s);
      
      //point(i, j);  
      pixels[i + j*width] = color(s);
    }
  }
  updatePixels();
}
void draw() {
  if (!paused) {
    drawThing();
    tanhOff += 0.005;
  } if (tanhOff >= 1) {
    tanhOff = 0;
  }
}

void mouseClicked() {
  paused = !paused;
}