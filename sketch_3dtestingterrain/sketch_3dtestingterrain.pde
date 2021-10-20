float noiseScale;
float tanhOff = 0.65;
float r;
boolean paused = false;
void setup() {
  size(600, 600, P3D);
  background(255);
  strokeWeight(1);
  stroke(0);
  noFill();
  
  colorMode(RGB, 1);
  noiseScale = 200;
  r = 0;
  camera();
}

float[][] getNoise() {
  //loadPixels();
  
  float[][] out = new float[width*2][height*2];
  for (int i = 0; i < width*2; i++) {
    for (int j = 0; j < height*2; j++) {
      float val = ((float)Math.tanh(10 * (noise(i/noiseScale, j/noiseScale)-tanhOff)) + 1)/2;
      
      float n1 = noise(i/noiseScale, j/noiseScale);
      float n2 = noise(i/noiseScale/4, j/noiseScale/4);
      //n2 = pow(n1, 2);
      n2 /= 2;
      
      float s = (val * n1) + ((1-val) * n2);
      out[i][j] = s;
      
      //point(i, j);  
      //pixels[i + j*width] = color(s);
    }
  }
  //updatePixels();
  return out;
}
void draw() {
  background(1);
  pushMatrix();
  
  float[][] map = getNoise();
  
  translate(0, height, -width - 200);
  //camera(100, 100, -100, 0, height, -width - 200, 0, 1, 0);
  rotateX(PI/2);
  sphere(20);
  //translate(width/2, -height/2, (-width - 200)/2);
  rotateZ(r);
  //translate(0, height, -width - 200);
  
  
  for (int x = 0; x < map.length; x++) {
    for (int y = 0; y < map[0].length; y++) {
      stroke(map[x][y]);
      line(x, y, 0, x, y, map[x][y]*height);
    }
  }
  //box(width, height, 300);
  popMatrix();
  r += PI/32;
  //for (int x = 0; x < map.length; x++) {
  //  for (int y = 0; y < map[0].length; y++) {
  //    stroke(map[x][y]);
  //    point(x, y);
  //  }
  //}
}

void mouseClicked() {
  paused = !paused;
}
