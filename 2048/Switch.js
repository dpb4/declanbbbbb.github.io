class Switch {
  constructor(def, x, y, w, h, falseColour, trueColour, knobColour) {
    this.state = def;

    this.x = x;
    this.y = y;

    this.w = w;
    this.h = h;

    this.fc = falseColour;
    this.tc = trueColour;
    this.kc = knobColour;
  }

  display() {
    let m = min(this.w, this.h);

    noStroke();
    if (this.state) {
      fill(this.tc);
      rect(this.x, this.y, this.w, this.h, m/2);

      fill(this.kc);
      ellipse(this.x + this.w - m/2, this.y + m/2, m, m);
    } else {
      fill(this.fc);
      rect(this.x, this.y, this.w, this.h, m/2);
  
      fill(this.kc);
      ellipse(this.x + m/2, this.y + m/2, m, m);
    }
  }

  update() {
    if (mouseX > this.x && mouseY > this.y && mouseX < this.x + this.w && mouseY < this.y + this.h) {
      this.state = !this.state;
    }
  }
}