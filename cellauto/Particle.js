class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.type = "typeless"
        this.col = color(0);
    }

    update() {}

    copy() {
        return new Particle(this.x, this.y);
    }
}