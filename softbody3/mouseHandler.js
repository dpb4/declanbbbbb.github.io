class mouseHandler {
    constructor(shapes) {
        this.grab = false;
        this.grabbedVertex = null;

        this.shapes = shapes;

        this.mins = 0;
        this.mini = 0;
        this.minD = 999999;
    }

    update() {
        if (mouseIsPressed && this.grab === false) {   
            this.findClosest();
            this.move();
            this.grab = true;
        }
        if (this.grab) {
            this.move();
        }

        if (!mouseIsPressed) {
            this.grab = false;
            this.mins = 0;
            this.mini = 0;
            this.minD = 999999;
        }
    }

    findClosest() {
        let mouseVector = createVector(mouseX, height - mouseY);

        for (let s = 0; s < this.shapes.length; s++) {
            for (let i = 0; i < this.shapes[s].vertices.length; i++) {
                if (this.shapes[s].vertices[i].pos.dist(mouseVector) < this.minD) {
                    this.minD = this.shapes[s].vertices[i].pos.dist(mouseVector);
                    this.mini = i;
                    this.mins = s;
                }
            }
        }
    }

    move() {
        this.shapes[this.mins].vertices[this.mini].forcePosition(mouseX, height-mouseY);
        this.shapes[this.mins].vertices[this.mini].forceVelocity(0, 0);
    }
}